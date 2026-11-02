#!/usr/bin/env python3
import argparse
import getpass
import json
import os
import re
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse

DEPLOY = Path(__file__).resolve().parent
ROOT = DEPLOY.parent
ENV_PATH = ROOT / ".env"


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
    config = json.loads((DEPLOY / "sing-box.example.json").read_text(encoding="utf-8"))
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


def read_env(path):
    if not path.exists():
        return [], {}
    lines = path.read_text(encoding="utf-8").splitlines()
    values = {}
    for line in lines:
        match = re.match(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$", line)
        if match:
            values[match[1]] = match[2].strip()
    return lines, values


def write_updates(path, lines, updates):
    remaining = dict(updates)
    output = []
    for line in lines:
        match = re.match(r"^(\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*=\s*)(.*)$", line)
        key = match[2] if match else None
        if key not in updates:
            output.append(line)
            continue
        if key in remaining:
            output.append(f"{key}={remaining.pop(key)}")
    for key, value in remaining.items():
        output.append(f"{key}={value}")
    text = "\n".join(output).rstrip() + "\n"
    temporary = path.with_name(path.name + ".tmp")
    descriptor = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
        stream.write(text)
    os.replace(temporary, path)
    os.chmod(path, 0o600)


def secret_prompt(key, existing):
    value = getpass.getpass(f"{key} (ввод скрыт; пусто — сохранить текущее): ").strip()
    value = value or existing.get(key, "")
    if not value:
        raise ValueError(f"{key} не может быть пустым")
    return value


def value_prompt(key, existing, default=""):
    value = input(f"{key} (пусто — сохранить текущее{'' if default else ''}): ").strip()
    value = value or existing.get(key, "") or default
    if not value:
        raise ValueError(f"{key} не может быть пустым")
    return value


def main():
    parser = argparse.ArgumentParser(description="Скрытая настройка корневого .env портретного сервера")
    parser.add_argument("--host", required=True, help="HTTPS-домен без схемы и пути")
    args = parser.parse_args()
    host = args.host.strip().lower()
    if not re.fullmatch(r"[a-z0-9.-]+", host) or ".." in host:
        parser.error("Некорректный домен")
    lines, existing = read_env(ENV_PATH)
    try:
        vless_url = secret_prompt("VLESS_URL", existing)
        parse_vless(vless_url)
        updates = {
            "KNIGHT_HOST": host,
            "COZY_API_BASE_URL": f"https://{host}",
            "KNIGHT_PUBLIC_URL": f"https://{host}",
            "ACME_EMAIL": value_prompt("ACME_EMAIL", existing),
            "VLESS_URL": vless_url,
            "OPENROUTER_API_KEY": secret_prompt("OPENROUTER_API_KEY", existing),
            "DUCKDNS_TOKEN": secret_prompt("DUCKDNS_TOKEN", existing),
            "TUNNEL_TOKEN": secret_prompt("TUNNEL_TOKEN", existing),
        }
        postgres_user = value_prompt("POSTGRES_USER", existing, "cozy")
        postgres_db = value_prompt("POSTGRES_DB", existing, "cozy")
        postgres_password = secret_prompt("POSTGRES_PASSWORD", existing)
        updates.update({
            "POSTGRES_USER": postgres_user,
            "POSTGRES_PASSWORD": postgres_password,
            "POSTGRES_DB": postgres_db,
            "DATABASE_URL": f"postgresql://{quote(postgres_user, safe='')}:{quote(postgres_password, safe='')}@db:5432/{quote(postgres_db, safe='')}",
            "KNIGHT_IMAGE_PROVIDER": "openrouter",
            "OPENROUTER_IMAGE_MODEL": existing.get("OPENROUTER_IMAGE_MODEL", "google/gemini-3.1-flash-image"),
            "KNIGHT_ALLOWED_ORIGINS": existing.get("KNIGHT_ALLOWED_ORIGINS", "https://k8rvin.github.io"),
            "BACKUP_KEEP_DAYS": existing.get("BACKUP_KEEP_DAYS", "14"),
        })
    except ValueError as error:
        parser.error(str(error))
    write_updates(ENV_PATH, lines, updates)
    print("Корневой .env сохранён с правами 600. Значения не выводятся.")


if __name__ == "__main__":
    main()
