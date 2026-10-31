#!/usr/bin/env python3
import argparse
import getpass
import json
import os
import re
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent


def query_value(query, key, required=True):
    values = query.get(key, [])
    value = values[0].strip() if values else ""
    if required and not value:
        raise ValueError(f"В VLESS-ссылке отсутствует параметр {key}")
    return value


def parse_vless(url):
    parsed = urlparse(url.strip())
    if parsed.scheme != "vless" or not parsed.username or not parsed.hostname or not parsed.port:
        raise ValueError("Нужна полная VLESS-ссылка")
    query = parse_qs(parsed.query)
    if query_value(query, "type") != "tcp" or query_value(query, "security") != "reality":
        raise ValueError("Ожидается VLESS через TCP и REALITY")
    config = json.loads((ROOT / "sing-box.example.json").read_text(encoding="utf-8"))
    outbound = config["outbounds"][0]
    outbound["server"] = parsed.hostname
    outbound["server_port"] = parsed.port
    outbound["uuid"] = parsed.username
    outbound["flow"] = query_value(query, "flow")
    outbound["tls"]["utls"]["fingerprint"] = query_value(query, "fp", required=False) or "chrome"
    outbound["tls"]["reality"]["public_key"] = query_value(query, "pbk")
    outbound["tls"]["reality"]["short_id"] = query_value(query, "sid")
    server_name = query_value(query, "sni", required=False)
    if server_name:
        outbound["tls"]["server_name"] = server_name
    return config


def write_secret(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    descriptor = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
        stream.write(text)
    os.replace(temporary, path)
    os.chmod(path, 0o600)


def main():
    parser = argparse.ArgumentParser(description="Скрытая настройка секретов портретного сервера")
    parser.add_argument("--host", required=True, help="HTTPS-домен без схемы и пути")
    args = parser.parse_args()
    host = args.host.strip().lower()
    if not re.fullmatch(r"[a-z0-9.-]+", host) or ".." in host:
        parser.error("Некорректный домен")
    try:
        vless_url = getpass.getpass("VLESS-ссылка (ввод скрыт): ")
        config = parse_vless(vless_url)
        api_key = getpass.getpass("OPENROUTER_API_KEY (ввод скрыт): ").strip()
        if not api_key:
            raise ValueError("OpenRouter-ключ не может быть пустым")
    except ValueError as error:
        parser.error(str(error))
    write_secret(ROOT / "secrets" / "sing-box.json", json.dumps(config, ensure_ascii=False, indent=2) + "\n")
    write_secret(ROOT / ".env", f"KNIGHT_HOST={host}\nOPENROUTER_API_KEY={api_key}\n")
    print("Секреты сохранены с правами 600. Значения не выводятся.")


if __name__ == "__main__":
    main()
