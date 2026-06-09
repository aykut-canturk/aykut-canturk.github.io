// @ts-nocheck
import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type AdminContext = {
  caller: User;
  admin: SupabaseClient;
};

function mustEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function parseAdminEmails(): string[] {
  return (Deno.env.get("ADMIN_EMAILS") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

export function corsOk(): Response {
  return new Response("ok", { headers: corsHeaders });
}

export function jsonResponse(data: unknown, status = 200): Response {
  return json(data, status);
}

export async function requireAdmin(request: Request): Promise<
  { ok: true; ctx: AdminContext } | { ok: false; response: Response }
> {
  try {
    const supabaseUrl = mustEnv("SUPABASE_URL");
    const anonKey = mustEnv("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) throw new Error("Missing env var: SERVICE_ROLE_KEY");

    const authHeader = request.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return { ok: false, response: json({ error: "Missing bearer token" }, 401) };
    }

    const token = authHeader.slice("Bearer ".length);
    const callerClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: authHeader } },
    });

    const userRes = await callerClient.auth.getUser(token);
    if (userRes.error || !userRes.data.user) {
      return {
        ok: false,
        response: json({ error: userRes.error?.message || "Invalid token" }, 401),
      };
    }

    const caller = userRes.data.user;
    const callerEmail = (caller.email || "").toLowerCase();
    const adminEmails = parseAdminEmails();

    if (!adminEmails.includes(callerEmail)) {
      return {
        ok: false,
        response: json({ error: "Admin access required" }, 403),
      };
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    return { ok: true, ctx: { caller, admin } };
  } catch (err) {
    return {
      ok: false,
      response: json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500),
    };
  }
}
