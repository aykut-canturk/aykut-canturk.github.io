import { corsOk, jsonResponse, requireAdmin } from "../_shared/admin-auth.ts";

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return corsOk();
  if (request.method !== "POST" && request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);
  const perPage = Number(url.searchParams.get("perPage") || 200);

  const result = await auth.ctx.admin.auth.admin.listUsers({
    page: Number.isFinite(page) ? page : 1,
    perPage: Number.isFinite(perPage) ? Math.min(Math.max(perPage, 1), 1000) : 200,
  });

  if (result.error) {
    return jsonResponse({ error: result.error.message }, 400);
  }

  const users = (result.data.users || []).map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    banned_until: u.banned_until,
    user_metadata: u.user_metadata || {},
  }));

  return jsonResponse({
    ok: true,
    total: users.length,
    users,
  });
});
