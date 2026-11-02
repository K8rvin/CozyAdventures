DO $$
DECLARE
  legacy_rows BIGINT;
BEGIN
  IF to_regclass('public.identities') IS NOT NULL THEN
    EXECUTE 'SELECT count(*) FROM public.identities' INTO legacy_rows;
    IF legacy_rows > 0 THEN
      RAISE EXCEPTION 'Таблица identities не пуста: перед миграцией требуется ручное сопоставление старых аккаунтов с email и новыми паролями. Данные не удалены.';
    END IF;
    DROP TABLE public.identities;
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS auth_credentials (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
