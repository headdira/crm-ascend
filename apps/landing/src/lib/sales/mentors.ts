import {
  MENTOR_ERICK_IMAGE,
  MENTOR_ERICK_WEBP,
  MENTOR_KELVIN_IMAGE,
  MENTOR_KELVIN_WEBP,
} from "./media";

export type MentorProfile = {
  name: string;
  role: string;
  img: string;
  webpSrc?: string;
  objectPosition: string;
  desc: string;
};

export const mentorProfiles: MentorProfile[] = [
  {
    name: "Kelvin Martins",
    role: "Co-fundador do Ascend Club",
    img: MENTOR_KELVIN_IMAGE,
    webpSrc: MENTOR_KELVIN_WEBP,
    objectPosition: "50% 12%",
    desc: "Empreendedor digital com anos de experiência, ajudou centenas de alunos a construírem suas primeiras fontes de renda online com estratégias simples e replicáveis.",
  },
  {
    name: "Erick Vinicius",
    role: "Co-fundador do Ascend Club",
    img: MENTOR_ERICK_IMAGE,
    webpSrc: MENTOR_ERICK_WEBP,
    objectPosition: "50% 8%",
    desc: "Empreendedor digital com anos atuando em vendas online, funis e construção de audiência. No Ascend Club, traduz o que funciona no mercado em passos claros — do primeiro conteúdo à primeira venda — com o mesmo método direto que já orientou dezenas de mentorados a resultados consistentes.",
  },
];
