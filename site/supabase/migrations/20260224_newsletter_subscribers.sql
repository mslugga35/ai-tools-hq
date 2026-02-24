-- Newsletter subscribers table for AI Tools HQ
-- Run via Supabase SQL editor or Management API

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text DEFAULT 'ai-tools-hq',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- RLS: allow anon inserts only (no reads/updates/deletes from client)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon inserts" ON newsletter_subscribers;
CREATE POLICY "Allow anon inserts" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Unique constraint handles duplicates — Supabase returns 409 on conflict
-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
