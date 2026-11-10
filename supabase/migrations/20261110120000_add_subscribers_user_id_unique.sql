-- 2026-11-10: subscribers had NO unique index on user_id, but BOTH the
-- check-subscription and handle-stripe-webhook edge functions call
--   .upsert(data, { onConflict: 'user_id' })
-- Postgres requires a matching unique index for ON CONFLICT. Without one, every
-- upsert failed with 42P10 ("no unique or exclusion constraint matching the ON
-- CONFLICT specification"): the webhook threw 500 on every real payment (Stripe
-- retries, then disables the endpoint) and the subscribers row was never written.
--
-- NOTE: do NOT make this a partial index (WHERE user_id IS NOT NULL). Postgres
-- will not infer a *partial* unique index from a bare `ON CONFLICT (user_id)`,
-- so the function's upsert still fails. A plain UNIQUE index is correct here
-- because Postgres treats NULLs as distinct — multiple NULL user_id rows are
-- allowed while the conflict target is satisfied.
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_user_id_key
  ON public.subscribers (user_id);
