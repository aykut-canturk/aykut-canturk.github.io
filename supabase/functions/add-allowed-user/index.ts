import { corsOk, jsonResponse, requireAdmin } from "../_shared/admin-auth.ts";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return corsOk();
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  let payload: { email?: string };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const email = String(payload.email || "").trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return jsonResponse({ error: "Valid email is required" }, 400);
  }

  const result = await auth.ctx.admin
    .from("allowed_users")
    .upsert({ email, created_by: auth.ctx.caller.id }, { onConflict: "email", ignoreDuplicates: true })
    .select("email, created_at")
    .single();

  if (result.error && result.error.code !== "PGRST116") {
    return jsonResponse({ error: result.error.message }, 400);
  }

  return jsonResponse({ ok: true, user: result.data || { email } });
});
