/** Mídia servida localmente em /public/media (origem: media.base44.com). */
import { QUIZ_LANDING_PROOFS } from "./quiz-evidence";

export const LOGO_URL = "/media/logo-ascend.png";
export const HERO_IMAGE_WEBP = "/media/hero-mentor.webp";
export const HERO_IMAGE = "/media/hero-mentor.png";

export const MENTOR_KELVIN_IMAGE = "/media/mentor-kelvin.jpeg";
export const MENTOR_KELVIN_WEBP = "/media/mentor-kelvin.webp";
export const MENTOR_ERICK_IMAGE = "/media/mentor-erick.jpeg";
export const MENTOR_ERICK_WEBP = "/media/mentor-erick.webp";

/** Banners estilo funil InLead (selfie + destino) para capa do quiz /form */
export const QUIZ_HERO_KELVIN_PARIS = "/media/quiz-hero-kelvin-paris.png";
export const QUIZ_HERO_ERICK_DUBAI = "/media/quiz-hero-erick-dubai.png";
export const QUIZ_LANDING_HEROES = [QUIZ_HERO_KELVIN_PARIS, QUIZ_HERO_ERICK_DUBAI] as const;

export const PROOF_IMAGES = [
  ...QUIZ_LANDING_PROOFS,
] as const;
