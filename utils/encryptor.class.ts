import crypto from "crypto";
import { config } from "./config";

const { ENCRYPTION_SALT } = config;
// @Source: https://stackoverflow.com/a/66476430/10458125
export class Encryptor {
  algorithm: string = "aes-192-cbc";
  key: Buffer;
  constructor(encryptionKey: string) {
    this.key = crypto.scryptSync(encryptionKey, ENCRYPTION_SALT, 24);
  }
  encrypt(clearText: string) {
    const iv = "1234567891011234";
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = cipher.update(clearText, "utf8", "hex");
    return [
      encrypted + cipher.final("hex"),
      Buffer.from(iv).toString("hex"),
    ].join("|");
  }
  decrypt(encryptedText: string) {
    const [encrypted, iv] = encryptedText.split("|");
    if (!iv) throw new Error("IV not found");
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, "hex")
    );
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }
}
