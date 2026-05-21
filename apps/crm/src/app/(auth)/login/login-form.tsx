"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@crm-ascend/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  configured: boolean;
  next: string;
  urlError: string | null;
};

function LoginError({ code, configured }: { code: string | null; configured: boolean }) {
  if (!code) return null;

  if (code === "config" && configured) {
    return (
      <div
        role="alert"
        className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
      >
        <p className="font-semibold">Sessão não validada no middleware</p>
        <p className="mt-1 opacity-90">
          O login no servidor está OK. Adicione <code className="text-xs">SUPABASE_URL</code> e{" "}
          <code className="text-xs">SUPABASE_ANON_KEY</code> no Vercel (ascend-crm) e aguarde o
          deploy mais recente, ou faça Redeploy.
        </p>
      </div>
    );
  }

  if (code === "config") {
    return (
      <div
        role="alert"
        className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        <p className="font-semibold">Supabase não configurado no servidor</p>
        <p className="mt-1 text-destructive/90">
          No Vercel <strong>ascend-crm</strong>, confira{" "}
          <code className="text-xs">SUPABASE_URL</code>,{" "}
          <code className="text-xs">SUPABASE_ANON_KEY</code> (ou{" "}
          <code className="text-xs">NEXT_PUBLIC_*</code> + Redeploy). Teste em{" "}
          <code className="text-xs">/api/health</code>.
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
          Promova no SQL:{" "}
          <code className="text-xs">
            UPDATE staff_users SET role=&apos;admin&apos;, is_active=true WHERE email=&apos;...&apos;
          </code>
        </p>
      </div>
    );
  }

  return null;
}

export default function LoginForm({
  supabaseUrl,
  supabaseAnonKey,
  configured,
  next,
  urlError,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!configured) {
      toast.error("Supabase não configurado. Veja /api/health no deploy.");
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
          <LoginError code={urlError} configured={configured} />
          {!configured && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              Servidor sem URL/anon do Supabase. Abra{" "}
              <a href="/api/health" className="underline font-medium">
                /api/health
              </a>{" "}
              neste domínio e confira o JSON.
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
              <Button type="submit" className="w-full" disabled={loading || !configured}>
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
