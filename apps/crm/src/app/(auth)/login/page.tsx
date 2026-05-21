"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@crm-ascend/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function LoginError({ code }: { code: string | null }) {
  if (!code) return null;

  if (code === "config") {
    return (
      <div
        role="alert"
        className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        <p className="font-semibold">Supabase não configurado neste deploy</p>
        <p className="mt-1 text-destructive/90">
          No projeto Vercel <strong>ascend-crm</strong> (não só a landing), adicione{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, marque{" "}
          <strong>Production</strong> e faça <strong>Redeploy</strong>.
        </p>
      </div>
    );
  }

  if (code === "staff") {
    return (
      <div
        role="alert"
        className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
      >
        <p className="font-semibold">Usuário sem acesso staff</p>
        <p className="mt-1 opacity-90">
          Faça login com um usuário criado no Supabase Auth e promova em{" "}
          <code className="text-xs">staff_users</code> (role admin, is_active true).
        </p>
      </div>
    );
  }

  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/crm";
  const urlError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!supabaseConfigured) {
      toast.error("Supabase não configurado no build. Ajuste as env na Vercel e redeploy.");
      return;
    }

    setLoading(true);
    const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>CRM Ascend</CardTitle>
          <CardDescription>Acesso interno para equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginError code={urlError} />
          {!supabaseConfigured && !urlError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              Variáveis <code className="text-xs">NEXT_PUBLIC_SUPABASE_*</code> ausentes no build.
              Configure na Vercel e redeploy o projeto <strong>ascend-crm</strong>.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !supabaseConfigured}
              >
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
