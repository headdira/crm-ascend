"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@crm-ascend/db";
import { LOGO_URL, SITE_NAME } from "@/lib/brand";
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
        <p className="font-semibold">Conta sem acesso ao CRM</p>
        <p className="mt-1 opacity-90">
          Tente entrar de novo (o sistema cria o staff automaticamente). Se persistir, rode no
          Supabase SQL Editor a migration <code className="text-xs">007_staff_self_register.sql</code>{" "}
          ou:{" "}
          <code className="text-xs">
            UPDATE staff_users SET is_active=true, role=&apos;admin&apos; WHERE email=&apos;seu@email&apos;;
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
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (!configured) return;
    setSigningOut(true);
    const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.replace("/login");
    router.refresh();
  }

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
    <main className="ascend-auth-bg flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-white/10 bg-card shadow-[0_0_60px_rgba(255,184,0,0.08)]">
        <CardHeader className="items-center text-center">
          <Image
            src={LOGO_URL}
            alt={SITE_NAME}
            width={160}
            height={48}
            className="mx-auto mb-2 h-11 w-auto"
            priority
          />
          <CardTitle className="text-xl font-black tracking-tight">CRM interno</CardTitle>
          <CardDescription>Acesso para equipe {SITE_NAME}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginError code={urlError} configured={configured} />
          {urlError === "staff" && configured && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="mb-4 w-full text-xs text-muted-foreground underline hover:text-foreground"
            >
              {signingOut ? "Saindo…" : "Sair e tentar outro usuário"}
            </button>
          )}
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
              <Button
                type="submit"
                className="w-full rounded-xl font-black uppercase tracking-wide"
                disabled={loading || !configured}
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
