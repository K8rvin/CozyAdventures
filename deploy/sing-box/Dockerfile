FROM python:3.12-alpine

COPY --chmod=755 sing-box /usr/local/bin/sing-box
COPY ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --chmod=755 entrypoint.py /usr/local/bin/sing-box-entrypoint.py

ENTRYPOINT ["python3", "/usr/local/bin/sing-box-entrypoint.py"]
