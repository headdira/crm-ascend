import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/crm/:path*", "/login", "/api/crm/:path*"],
  // /api/health fica de fora — diagnóstico de env
};
