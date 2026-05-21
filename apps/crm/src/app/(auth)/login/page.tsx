import LoginForm from "./login-form";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const { url, anonKey, ok } = getSupabasePublicEnv();

  return (
    <LoginForm
      supabaseUrl={url}
      supabaseAnonKey={anonKey}
      configured={ok}
      next={params.next ?? "/crm"}
      urlError={params.error ?? null}
    />
  );
}
