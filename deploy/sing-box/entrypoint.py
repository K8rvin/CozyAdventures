#!/usr/bin/env python3
import json
import os
import tempfile
from pathlib import Path
from urllib.parse import parse_qs, urlparse

TEMPLATE_PATH = Path("/etc/sing-box/config.template.json")
CONFIG_PATH = Path("/tmp/sing-box-config.json")
BINARY = "/usr/local/bin/sing-box"


def query_value(query, key, required=True):
    values = query.get(key, [])
    value = values[0].strip() if values else ""
    if required and not value:
        raise ValueError(key)
    return value


def config_from_vless(url):
    parsed = urlparse(url.strip())
    if parsed.scheme != "vless" or not parsed.username or not parsed.hostname or not parsed.port:
        raise ValueError("url")
    query = parse_qs(parsed.query)
    if query_value(query, "type") != "tcp" or query_value(query, "security") != "reality":
        raise ValueError("transport")
    config = json.loads(TEMPLATE_PATH.read_text(encoding="utf-8"))
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


def main():
    source = os.environ.get("VLESS_URL", "")
    if not source.strip():
        raise SystemExit("VLESS_URL is required")
    try:
        config = config_from_vless(source)
    except (KeyError, TypeError, ValueError, json.JSONDecodeError):
        raise SystemExit("VLESS_URL or sing-box template is invalid") from None
    temporary = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir="/tmp", prefix="sing-box-", delete=False) as stream:
            temporary = stream.name
            json.dump(config, stream, ensure_ascii=False)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, 0o600)
        os.replace(temporary, CONFIG_PATH)
        os.chmod(CONFIG_PATH, 0o600)
    finally:
        if temporary and os.path.exists(temporary):
            os.unlink(temporary)
    os.execv(BINARY, [BINARY, "run", "-c", str(CONFIG_PATH)])


if __name__ == "__main__":
    main()
