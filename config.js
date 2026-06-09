/* =============================================================
   Supabase yapılandırması
   -------------------------------------------------------------
   Bu dosya statik bir sitede herkese açık sunulur; bu yüzden
   yalnızca PUBLIC (anon / publishable) anahtar buraya konur.
   service_role / secret anahtarını ASLA buraya yazmayın.

   ANON_KEY'i Supabase: Settings > API (Data API) sayfasından
   "anon public" (ya da "publishable") anahtarını kopyalayıp
   aşağıya yapıştırın.
   ============================================================= */
window.APP_CONFIG = {
  SUPABASE_URL: "https://fnpzxhpryksjxduhejtx.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_GY7YWCQ7EHGbuyDYdbDXww_r60wNzPS",
  // Davet ekranını görebilecek admin e-postaları
  ADMIN_EMAILS: [
    "ayktcntrk@gmail.com"
  ],
  // Supabase Edge Function adı (auth admin invite çağrısını server-side yapmalı)
  INVITE_FUNCTION_NAME: "invite-user",
  // Supabase Edge Function adı (admin kullanıcı listesini döndürmeli)
  LIST_USERS_FUNCTION_NAME: "list-users"
};