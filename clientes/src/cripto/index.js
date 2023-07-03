import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';

// Defining key
const key = randomBytes(32);

// Defining iv
const iv = randomBytes(16);

function encrypt(text) {
  const cipher = createCipheriv(algorithm, Buffer.from(key), iv);

  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
}

const output = encrypt('ZE PINDOLA CARALHO');

function decrypt(text) {
  const ivi = Buffer.from(text.iv, 'hex');
  const encryptedText = Buffer.from(text.encryptedData, 'hex');

  const decipher = createDecipheriv(algorithm, Buffer.from(key), ivi);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

console.log(output);
console.log(decrypt(output));
