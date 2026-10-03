# ServiceAI

Arabic, RTL Next.js site with a public, account-free articles blog and a manager-only content dashboard backed by Supabase.

## Requirements

- Node.js 20.9 or newer and npm.
- A Supabase project.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` (or configure the equivalent environment variables in your deployment) and set:
   - `NEXT_PUBLIC_SUPABASE_URL`: the Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (recommended) or `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the project's publishable/anon key. Do not use a service-role/secret key.
   - `SUPABASE_ADMIN_EMAIL` or `ADMIN_EMAIL`: the exact email address of the single manager account.
   - `NEXT_PUBLIC_SITE_URL`: the public site origin, without a trailing slash.
   
   Set the Supabase URL before running `npm run build`; Next.js uses it to allow-list the article image host for image optimization.
3. In Supabase SQL Editor, run [`supabase/migrations/20261002190000_initial_cms.sql`](./supabase/migrations/20261002190000_initial_cms.sql). This migration must be applied to the same Supabase project configured in `.env.local`; without it the public article list and CMS tables are unavailable.
4. Run [`supabase/migrations/20261003000000_site_preferences.sql`](./supabase/migrations/20261003000000_site_preferences.sql) to add the administrator-controlled AdSense placements and public social-link settings.
5. In Supabase Dashboard, create one Auth user for the manager using the email configured in `SUPABASE_ADMIN_EMAIL` or `ADMIN_EMAIL`. Set a new, unique password directly in Supabase Auth; never put a password in source code, SQL migrations, or environment files. Do not enable public sign-up. Set the user's **app metadata** (not user-editable metadata) to `{"role":"admin"}`. Alternatively, in SQL Editor after creating the user, run the following with the manager's real email:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where lower(email) = lower('admin@example.com');
   ```

   Confirm that exactly one row was updated and that its email matches the configured manager email. Sign out and sign in again after changing app metadata so Supabase issues a new session token.
6. Run `npm run dev` and open `http://localhost:3000`.

If an administrator password has been shared in chat, email, or another untrusted channel, reset it in Supabase Auth before using the account.

The migration creates six initial categories, the article/category schema, RLS policies, the public article-image bucket, and three starter articles based on the original blog content. Public queries can read only published articles whose publication time has arrived. All content mutations require the manager's Supabase `app_metadata.role=admin` claim; the server also checks the configured manager email. The dashboard has no public sign-up route.

## Routes

- Public: `/`, `/blog`, `/blog/[slug]`, `/tools`, `/tools/resume-builder`, `/tools/resume-analyzer`, `/tools/cover-letter-generator`, `/tools/interview-questions`, `/tools/ats-keywords`, `/about`, `/contact`, `/privacy`, `/terms`
- Manager only: `/admin/login`, `/admin`, `/admin/articles`, `/admin/articles/new`, `/admin/articles/[id]/edit`, `/admin/categories`
- Generated SEO endpoints: `/robots.txt`, `/sitemap.xml`

## Checks

- `npm run typecheck`
- `npm run lint`
- `npm run build`

The contact channel and Google AdSense are not activated until configured by the manager.

The manager can edit all 19 existing AdSense placements and social links from `/admin/settings`. The publisher ID is automatically written to the `google-adsense-account` meta tag in the document head. The AdSense loader script is added to the head only after a valid publisher ID, an ad-unit ID, and that placement's explicit enable switch are saved. Social icons appear in the public footer only for links that have been configured. The WhatsApp field accepts an international phone number; the site creates the `wa.me` URL automatically.

The résumé builder is available to visitors without an account. Its form data remains in page memory only and is not sent to Supabase or persisted. PDF export uses the browser print dialog with A4 styling; choose “Save as PDF” in the dialog.

The résumé analyzer accepts PDF and DOCX files up to 12 MB and extracts their text locally in the browser. Its ATS score and keyword comparison are rule-based indicators, not an AI assessment or a guarantee of a hiring-system outcome; uploaded files are not sent to the server or persisted.

The cover-letter generator creates editable drafts in English, French, Arabic, Spanish, or German and can export DOCX or print to PDF. Draft generation and quality scoring currently use local templates and rules rather than an external AI model; submitted details remain in page memory and are not persisted.

The interview-question tool creates role-aware practice questions and answer frameworks in five languages. Questions and answers use local templates and rules rather than an external AI model; answers include placeholders so visitors can add only their own real experience. Input remains in page memory and is not persisted.

The ATS keyword tool extracts skills, tools, qualifications, and other terms from a job description, with an optional local PDF/DOCX resume comparison. Keyword priorities and the generated summary use local text rules, not an external AI model; the match score is a text indicator rather than a hiring outcome. Neither the description nor the uploaded file is sent to the server or persisted.
