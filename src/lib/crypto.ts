import crypto from "crypto";

// Application-level encryption for secrets at rest (integration keys, server
// passwords). Values are stored as `enc:v1:<iv>:<tag>:<ciphertext>` (base64).
//
// Backward compatible: values without the prefix are treated as legacy
// plaintext. When APP_ENCRYPTION_KEY is unset, values are stored as-is so
// local development keeps working (set the key in production).

const PREFIX = "enc:v1:";

function getKey(): Buffer | null {
  const secret = process.env.APP_ENCRYPTION_KEY;
  if (!secret) return null;
  // Derive a stable 32-byte key from any passphrase.
  return crypto.createHash("sha256").update(secret).digest();
}

export function isEncryptionConfigured(): boolean {
  return Boolean(process.env.APP_ENCRYPTION_KEY);
}

// Encrypt a plaintext secret. Returns the plaintext unchanged when no key is set.
export function encryptSecret(plain: string): string {
  const key = getKey();
  if (!key) return plain;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return (
    PREFIX +
    [iv, tag, ciphertext].map((b) => b.toString("base64")).join(":")
  );
}

// Decrypt a stored value. Legacy plaintext (no prefix) is returned as-is.
export function decryptSecret(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  if (!value.startsWith(PREFIX)) return value;

  const key = getKey();
  if (!key) return null;

  try {
    const [ivB64, tagB64, ctB64] = value.slice(PREFIX.length).split(":");
    const iv = Buffer.from(ivB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const ciphertext = Buffer.from(ctB64, "base64");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}
