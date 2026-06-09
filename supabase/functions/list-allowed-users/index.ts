import { corsOk, jsonResponse, requireAdmin } from "../_shared/admin-auth.ts";

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return corsOk();
  if (request.method !== "POST" && request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const result = await auth.ctx.admin
    .from("allowed_users")
    .select("email, created_at")
    .order("created_at", { ascending: false });

  if (result.error) {
    return jsonResponse({ error: result.error.message }, 400);
  }

  return jsonResponse({ ok: true, users: result.data || [] });
});
