export function getHashSalt(): string {
  const salt = import.meta.env.HASH_SALT ?? process.env.HASH_SALT;
  if (!salt) throw new Error("HASH_SALT is not configured");
  return salt;
}
