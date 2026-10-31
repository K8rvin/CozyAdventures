FROM scratch

COPY --chmod=755 sing-box /usr/local/bin/sing-box
COPY ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

ENTRYPOINT ["/usr/local/bin/sing-box"]
