import http from 'node:http';
import net from 'node:net';

const server = http.createServer((req, res) => {
  res.writeHead(501, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Поддерживается только HTTPS CONNECT');
});

server.on('connect', (req, client, head) => {
  const authority = req.url || '';
  const separator = authority.lastIndexOf(':');
  const host = authority.slice(0, separator);
  const port = Number(authority.slice(separator + 1));
  if (!/^[a-z0-9.-]+$/i.test(host) || port !== 443) {
    client.end('HTTP/1.1 403 Forbidden\r\n\r\n');
    return;
  }
  const upstream = net.connect(port, host);
  const close = () => {
    client.destroy();
    upstream.destroy();
  };
  client.on('error', close);
  upstream.on('error', close);
  upstream.setTimeout(60000, close);
  upstream.once('connect', () => {
    client.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    if (head.length) upstream.write(head);
    upstream.pipe(client);
    client.pipe(upstream);
  });
});

server.listen(1080, '0.0.0.0', () => console.log('ACME HTTPS proxy: 1080'));
