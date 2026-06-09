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

  let payload: { email?: string; fullName?: string };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const email = String(payload.email || "").trim().toLowerCase();
  const fullName = String(payload.fullName || "").trim();

  if (!email || !isValidEmail(email)) {
    return jsonResponse({ error: "Valid email is required" }, 400);
  }

  const redirectTo = Deno.env.get("INVITE_REDIRECT_TO") || undefined;

  const result = await auth.ctx.admin.auth.admin.inviteUserByEmail(email, {
    data: fullName ? { display_name: fullName } : undefined,
    redirectTo,
  });

  if (result.error) {
    return jsonResponse({ error: result.error.message }, 400);
  }

  return jsonResponse({
    ok: true,
    invitedBy: auth.ctx.caller.email,
    user: {
      id: result.data.user?.id,
      email: result.data.user?.email,
    },
  });
});
