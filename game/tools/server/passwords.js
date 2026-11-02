import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SALT_BYTES = 16;
const HASH_BYTES = 64;
const SCRYPT_OPTIONS = {
  N: SCRYPT_N,
  r: SCRYPT_R,
  p: SCRYPT_P,
  maxmem: 64 * 1024 * 1024,
};

export function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || /[\p{White_Space}\p{Cc}\p{Cf}]/u.test(email)) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!local || !domain || !domain.includes('.')) return null;
  if (domain.split('.').some((label) => !label)) return null;
  return email;
}

export function isValidPassword(value) {
  return typeof value === 'string' && Array.from(value).length >= 10 && Array.from(value).length <= 128;
}

function formatHash(salt, hash) {
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export async function hashPassword(password) {
  if (!isValidPassword(password)) throw new TypeError('Некорректная длина пароля');
  const salt = randomBytes(SALT_BYTES);
  const hash = await scryptAsync(password, salt, HASH_BYTES, SCRYPT_OPTIONS);
  return formatHash(salt, hash);
}

function parseHash(value) {
  if (typeof value !== 'string') return null;
  const parts = value.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return null;
  if (parts[1] !== String(SCRYPT_N) || parts[2] !== String(SCRYPT_R) || parts[3] !== String(SCRYPT_P)) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(parts[4]) || !/^[A-Za-z0-9_-]+$/.test(parts[5])) return null;
  const salt = Buffer.from(parts[4], 'base64url');
  const expected = Buffer.from(parts[5], 'base64url');
  if (salt.length !== SALT_BYTES || expected.length !== HASH_BYTES) return null;
  return { salt, expected };
}

export async function verifyPassword(password, encodedHash) {
  if (!isValidPassword(password)) return false;
  const parsed = parseHash(encodedHash);
  if (!parsed) return false;
  const actual = await scryptAsync(password, parsed.salt, HASH_BYTES, SCRYPT_OPTIONS);
  return timingSafeEqual(actual, parsed.expected);
}

const DUMMY_PASSWORD_HASH = formatHash(Buffer.alloc(SALT_BYTES), Buffer.alloc(HASH_BYTES));

export function getDummyPasswordHash() {
  return DUMMY_PASSWORD_HASH;
}
