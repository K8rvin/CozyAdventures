import http from 'node:http';
import net from 'node:net';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function duckdnsToken() {
  if (process.env.DUCKDNS_TOKEN?.trim()) return process.env.DUCKDNS_TOKEN.trim();
  if (!process.env.DUCKDNS_TOKEN_FILE) return '';
  try {
    return (await readFile(process.env.DUCKDNS_TOKEN_FILE, 'utf8')).trim();
  } catch {
    return '';
  }
}

const token = await duckdnsToken();
const host = String(process.env.KNIGHT_HOST || '').trim().toLowerCase();
const email = String(process.env.ACME_EMAIL || '').trim();
let acmeRunning = false;

async function updateCertificate() {
  if (acmeRunning) return;
  acmeRunning = true;
  try {
    if (!/^[a-z0-9.-]+$/.test(host) || host.includes('..') || !email || !token) {
      console.error('ACME is not configured');
      return;
    }
    const certificate = `/var/lib/lego/certificates/${host}.crt`;
    const key = `/var/lib/lego/certificates/${host}.key`;
    const exists = existsSync(certificate) && existsSync(key);
    const args = [
      '--accept-tos', '--email', email,
      '--domains', host,
      '--dns', 'duckdns',
      '--path', '/var/lib/lego',
      '--key-type', 'ec256',
      exists ? 'renew' : 'run',
      ...(exists ? ['--days', '30'] : []),
    ];
    await execFileAsync(process.env.LEGO_BINARY || '/opt/lego', args, {
      env: { ...process.env, DUCKDNS_TOKEN: token },
      timeout: 600000,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
    });
    console.log('ACME certificate is ready');
  } catch {
    console.error('ACME certificate update failed');
  } finally {
    acmeRunning = false;
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(501, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Поддерживается только HTTPS CONNECT');
});

server.on('connect', (req, client, head) => {
  const authority = req.url || '';
  const separator = authority.lastIndexOf(':');
  const hostName = authority.slice(0, separator);
  const port = Number(authority.slice(separator + 1));
  if (!/^[a-z0-9.-]+$/i.test(hostName) || port !== 443) {
    client.end('HTTP/1.1 403 Forbidden\r\n\r\n');
    return;
  }
  const upstream = net.connect(port, hostName);
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
updateCertificate();
setInterval(updateCertificate, 24 * 60 * 60 * 1000).unref();
