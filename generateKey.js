import crypto from 'crypto';
import fs from 'fs';

// สั่งสุ่มสร้างคู่กุญแจดิจิทัล (RSA 2048-bit)
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// บันทึกออกมาเป็นไฟล์ภายในโปรเจกต์
fs.writeFileSync('private_key.pem', privateKey);
fs.writeFileSync('public_key.pem', publicKey);

console.log('สร้างไฟล์ private_key.pem และ public_key.pem สำเร็จแล้ว!');