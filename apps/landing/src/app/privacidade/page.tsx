import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/sales/knowledge";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Como o ${SITE_NAME} trata cookies e dados pessoais.`,
};

export default function PrivacidadePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 font-inter text-white/80 leading-relaxed">
      <h1 className="text-3xl font-black text-white mb-6">Política de Privacidade</h1>
      <p className="mb-4">
        O {SITE_NAME} respeita sua privacidade conforme a Lei Geral de Proteção de Dados (LGPD —
        Lei nº 13.709/2018).
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-2">Cookies necessários</h2>
      <p className="mb-4">
        Usamos cookies essenciais para registrar preferências de consentimento e atribuição de
        campanha (parâmetros UTM), sem identificar você diretamente nessa etapa.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-2">Cookies opcionais</h2>
      <p className="mb-4">
        Com seu consentimento, podemos usar cookies de análise (ex.: Google Analytics) e marketing.
        Você pode aceitar, recusar ou personalizar no banner exibido na primeira visita.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-2">Dados que coletamos</h2>
      <p className="mb-4">
        Se você enviar nome e e-mail voluntariamente (com consentimento de marketing), armazenamos
        esses dados para contato sobre o programa. Dados de pagamento são tratados pela plataforma
        Kiwify, não pelo site diretamente.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-2">Seus direitos</h2>
      <p className="mb-4">
        Você pode solicitar acesso, correção ou exclusão dos seus dados entrando em contato pelo
        canal oficial do {SITE_NAME}.
      </p>

      <p className="text-sm text-white/50 mt-10">
        <Link href="/" className="text-primary underline">
          Voltar à página inicial
        </Link>
      </p>
    </main>
  );
}
