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
  // Şifre sıfırlama mailindeki dönüş adresi (production URL)
  RESET_PASSWORD_REDIRECT_TO: "https://aykut-canturk.github.io/",
  // Google OAuth dönüş adresi
  GOOGLE_AUTH_REDIRECT_TO: "https://aykut-canturk.github.io/",
  // İzinli kullanıcı listesi edge function adları
  ALLOWLIST_LIST_FUNCTION_NAME: "list-allowed-users",
  ALLOWLIST_ADD_FUNCTION_NAME: "add-allowed-user",
  ALLOWLIST_DELETE_FUNCTION_NAME: "delete-allowed-user"
};