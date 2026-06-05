export function getLandingSiteUrl() {
  return process.env.NEXT_PUBLIC_LANDING_URL?.replace(/\/$/, "") ?? "https://ascendclub.com.br";
}

export function getAdsQuizPublicUrl() {
  return `${getLandingSiteUrl()}/form`;
}
