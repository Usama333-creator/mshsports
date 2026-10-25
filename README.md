# Mashal Olympics Sports Wear — White / Black / Red store with Supabase admin

TanStack Start + React + Tailwind, built for **Vercel** (`vite.config.ts` → `nitro: { preset: "vercel" }`).

## 1) Supabase (one time)
1. Supabase → **SQL Editor** → paste all of `supabase/mashal.sql` → **Run**.
2. **Authentication → Users → Add user** (your email + password, tick *Auto confirm user*).
3. SQL Editor → run (use your email):
   `insert into public.mo_admins (user_id) select id from auth.users where email = 'YOUR-EMAIL' on conflict do nothing;`
4. Vercel → Settings → Environment Variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`) → Redeploy.

## 2) Admin panel — `/admin`
Log in with the email/password from step 2.
- **Products**: add / edit / hide / delete, upload photos, price, featured.
- **Banners**: upload athlete photos for *Built for Champions*, the top slider and the red promo strip.
- **Inquiries**: every Contact-form order is saved here (status + WhatsApp button).

## 3) Replace placeholders
`src/assets/*.jpg` and `mashal-logo.jpg` are placeholders — replace them with your photos (same file names), or upload photos from the admin.
Contact numbers: `src/lib/site.ts`.

## Deploy
Push to GitHub (use `git push` or GitHub Desktop), import in Vercel, framework **Other**, root directory = this folder. `vercel.json` sets the install/build commands.
Local: `npm install --legacy-peer-deps && npm run dev`.
