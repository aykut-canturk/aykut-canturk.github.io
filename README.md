# aykut-canturk.github.io

## Mimari Özeti

- Giriş modeli: yalnızca Google OAuth
- Kullanıcı modeli: admin davet eder, kullanıcı davet sonrası Google ile giriş yapar
- Admin yetkisi: `ADMIN_EMAILS` allowlist
- Frontend: statik (GitHub Pages)
- Admin işlemleri: Supabase Edge Functions

Edge Functions:

- `supabase/functions/invite-user/index.ts`
- `supabase/functions/list-users/index.ts`
- `supabase/functions/_shared/admin-auth.ts`

## Kurulum

1. Supabase CLI

```bash
npm i -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

1. Function secret'ları

```bash
supabase secrets set \
  SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" \
  ADMIN_EMAILS="admin1@example.com,admin2@example.com" \
  INVITE_REDIRECT_TO="https://YOUR_GITHUB_USERNAME.github.io/"
```

1. Deploy

```bash
supabase functions deploy invite-user
supabase functions deploy list-users
```

## Supabase Auth Ayarları

1. Authentication > Providers > Google

- Google provider aktif olmalı
- Google OAuth Client ID / Secret girilmeli

1. Google Cloud OAuth Client

- Authorized redirect URI:
  `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

1. Authentication > URL Configuration

- Site URL: `https://YOUR_GITHUB_USERNAME.github.io/`
- Redirect URLs: `https://YOUR_GITHUB_USERNAME.github.io/`

1. Email provider

- Self-signup kapalı tutulmalı (Google-only model)

## İstemci Konfigürasyonu

`config.js` örneği:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_ANON_KEY",
  ADMIN_EMAILS: ["admin1@example.com"],
  GOOGLE_AUTH_REDIRECT_TO: "https://YOUR_GITHUB_USERNAME.github.io/",
  INVITE_FUNCTION_NAME: "invite-user",
  LIST_USERS_FUNCTION_NAME: "list-users"
};
```

## Hızlı Kontrol

1. Admin Google ile giriş yapar, `⚙️` ve `✉️` görür.
2. Admin davet gönderir.
3. Davet edilen kullanıcı Google ile giriş yapar.
4. Admin olmayan kullanıcı `⚙️` ve `✉️` görmez.
