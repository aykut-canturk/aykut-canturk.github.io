import { corsOk, jsonResponse, requireAdmin } from "../_shared/admin-auth.ts";

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
  if (!email) {
    return jsonResponse({ error: "Email is required" }, 400);
  }

  const result = await auth.ctx.admin
    .from("allowed_users")
    .delete()
    .eq("email", email);

  if (result.error) {
    return jsonResponse({ error: result.error.message }, 400);
  }

  return jsonResponse({ ok: true, email });
});
