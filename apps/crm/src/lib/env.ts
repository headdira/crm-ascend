export function getHashSalt(): string {
  const salt = process.env.HASH_SALT;
  if (!salt) throw new Error("HASH_SALT is not configured");
  return salt;
}

export function getBuilderApiKey(): string {
  const key = process.env.BUILDER_API_KEY;
  if (!key) throw new Error("BUILDER_API_KEY is not configured");
  return key;
}

export function assertBuilderKey(header: string | null): boolean {
  if (!header) return false;
  return header === getBuilderApiKey();
}
