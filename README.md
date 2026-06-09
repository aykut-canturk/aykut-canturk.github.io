# aykut-canturk.github.io

## Admin-Only User Management (GitHub Pages Uyumlu)

Bu projede istemci static (GitHub Pages) olduğu için admin işlemleri Supabase Edge Function ile server-side yapılır.

Eklenen function'lar:

- `supabase/functions/invite-user/index.ts`
- `supabase/functions/list-users/index.ts`
- `supabase/functions/_shared/admin-auth.ts`

### 1) Gerekenler

- Supabase projesi
- Supabase CLI

Supabase CLI kurulumu:

```bash
npm i -g supabase
```

Login ve link:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF`, Supabase URL içindeki alt alan adıdır.
Örn: `https://fnpzxhpryksjxduhejtx.supabase.co` için `fnpzxhpryksjxduhejtx`.

### 2) Function Secret'ları

Bu secret'ları Supabase'e set edin:

```bash
supabase secrets set \
  SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" \
  ADMIN_EMAILS="admin1@example.com,admin2@example.com" \
  INVITE_REDIRECT_TO="https://YOUR_GITHUB_USERNAME.github.io/"
```

Not:

- `SUPABASE_` ile başlayan env adları `supabase secrets set` tarafından engellenir.
- `SERVICE_ROLE_KEY` sadece function ortamında olmalı, istemciye konmamalı.
- `ADMIN_EMAILS` virgülle ayrılmış allowlist'tir.

### 3) Deploy

```bash
supabase functions deploy invite-user
supabase functions deploy list-users
```

### 4) Client Config

`config.js` içinde aşağıdakiler bulunmalı:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_ANON_KEY",
  ADMIN_EMAILS: ["admin1@example.com"],
  INVITE_FUNCTION_NAME: "invite-user",
  LIST_USERS_FUNCTION_NAME: "list-users"
};
```

### 5) Supabase Auth Ayarı

- Authentication > Providers > Email altında self-signup kapatın.

### 6) Test Senaryosu

1. Admin e-posta ile giriş yapın.
2. Üst barda `⚙️` ve `✉️` görünmeli.
3. `⚙️` > `👥 Kullanıcılar` sekmesinde liste yüklenmeli.
4. `✉️` ile davet gönderildiğinde kullanıcıya mail gitmeli.
5. Admin olmayan kullanıcıda `⚙️` ve `✉️` görünmemeli.

### 7) Sık Hata / Çözüm

- `Admin access required`
  - Giriş yapan e-posta `ADMIN_EMAILS` içinde değildir.

- `Missing env var`
  - `supabase secrets set` ile gerekli secret eksik girilmiştir.

- `Function not found`
  - `INVITE_FUNCTION_NAME` veya `LIST_USERS_FUNCTION_NAME` ile deploy adı farklıdır.
