import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trustListPath = path.resolve(__dirname, './src/mock_data/trust_list.json');
const publicKeyPath = path.resolve(__dirname, './public_key.pem');

// 1. แปะก้อน Signature ที่คุณต้องการตรวจสอบไว้ตรงนี้ (ก๊อปปี้จากรอบที่เซ็นได้มาวาง)
const signatureToTest = "l15KyAwKzvz1aBOBo80k5e+/iGLA1ChR1EccuKkGKHoQexEQBNI5Vk7y+/1Ctv9X1H0xjnCNOKLiGpW4I8h3Gr9EsUD8SAeQ1L/MFDwjVOnUTEQHb5EGAe8lvWM40DahJOvQkqdQMXnsuMkIA0bhz7WtNRh7YfeWdiHqKThdMQgnjaq3JJdMl8SqiMr11X2UWi9MnW2MInYL9SUw65IyxIe4YX3ZVwdbg0190W7gGXxF6Iy/8YA2eF8CGtouPS4yJe6BqQwUU4VAsynAtTQ7a9Tqzb7YbklDyZlMaybHSU8U6ts3SiLKauYNZDJZfDwj4iep6BMBV0Xx04h0WbNedA==";

async function runLocalVerification() {
    try {
        console.log('⏳ กำลังเริ่มทำการตรวจสอบลายเซ็นดิจิทัล...');

        // 2. อ่านไฟล์ข้อมูลต้นฉบับ
        const rawData = await fs.readFile(trustListPath, 'utf8');
        const trustlistObj = JSON.parse(rawData);
        const originalDataString = JSON.stringify(trustlistObj);

        // 3. อ่านไฟล์ Public Key
        const publicKey = await fs.readFile(publicKeyPath, 'utf8');

        // 4. ทำกระบวนการ Verify
        const verify = crypto.createVerify('SHA256');
        verify.update(originalDataString);
        verify.end();

        const isVerified = verify.verify(publicKey, signatureToTest, 'base64');

        // 5. พ่นผลลัพธ์ออกหน้าจอ Terminal ตรงๆ
        console.log('\n--------------------------------------------------');
        if (isVerified) {
            console.log('✅ ผลการตรวจสอบ: ลายเซ็นถูกต้อง 100%!');
            console.log('   ข้อมูลแท้จริงตรงตาม Master List และไม่เคยถูกแก้ไข');
        } else {
            console.log('❌ ผลการตรวจสอบ: ลายเซ็นไม่ถูกต้อง!');
            console.log('   ข้อมูลในไฟล์ JSON อาจถูกแก้ไข หรือใช้ Public Key ผิดคู่');
        }
        console.log('--------------------------------------------------\n');

    } catch (err) {
        console.error('💥 เกิดข้อผิดพลาดระหว่างรันสคริปต์:', err.message);
    }
}

// 🔥 บรรทัดสำคัญ: สั่งให้ฟังก์ชันข้างบนทำงานทันทีที่พิมพ์ node v.js
runLocalVerification();