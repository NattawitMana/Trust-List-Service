# Trustlist Service Setup Guide

คู่มือสำหรับการตั้งค่าโปรเจกต์ **Trustlist Service** ในโฟลเดอร์นี้

---

## ความต้องการเบื้องต้น (Prerequisites)
1. **Node.js** สำหรับการรันระบบแบบ Local
2. **Git** สำหรับดึงซอร์สโค้ดและจัดการ repository

---

## วิธีตั้งค่าโปรเจกต์ (Setup Guide)

### วิธีที่ 1: ตั้งค่าผ่านสคริปต์อัตโนมัติ (แนะนำ)

#### สำหรับ Windows:
ดับเบิ้ลคลิกไฟล์ [setup.bat] หรือรันผ่าน Terminal:
```cmd
setup.bat
```

#### สำหรับ macOS และ Linux:
เปิด Terminal ในโฟลเดอร์นี้และรันสคริปต์ [setup.sh] :
```bash
chmod +x setup.sh
./setup.sh
```

*หมายเหตุ: สคริปต์จะทำการติดตั้ง Dependencies, คัดลอกการตั้งค่า `.env`, และตั้งค่าโฟลเดอร์ `data-repo` เชื่อมต่อกับ Git `https://github.com/NattawitMana/Trust-List-JSON.git` ให้คุณโดยอัตโนมัติ (ผู้ใช้จำเป็นต้องกำหนดค่า PRIV_KEY ใน .env หรือเตรียม private_key.pem / public_key.pem ด้วยตนเอง)*

---

### วิธีที่ 2: ตั้งค่าด้วยตนเอง (Manual Setup)

1. **ติดตั้ง npm dependencies:**
   ```bash
   npm install
   ```
2. **สร้างไฟล์สภาพแวดล้อม (.env):**
   ```bash
   cp .env.example .env
   ```
   *เปิดไฟล์ `.env` และกำหนดค่า `PRIV_KEY` ด้วยกุญแจส่วนตัวของคุณ*

3. **สร้างโฟลเดอร์และตั้งค่า Git สำหรับ data-repo:**
   ```bash
   mkdir data-repo
   cd data-repo
   git init
   git remote add origin https://github.com/NattawitMana/Trust-List-JSON.git
   git branch -M main
   git pull origin main
   cd ..
   ```
4. **รันเซิร์ฟเวอร์ในโหมดพัฒนา:**
   ```bash
   npm run dev
   ```

---

## การกำหนดค่าตัวแปรในไฟล์ `.env` (Environment Variables)

กำหนดค่าตัวแปรที่จำเป็นในไฟล์ `.env` ดังนี้:

- `PORT`: พอร์ตสำหรับรันเว็บเซิร์ฟเวอร์ (ค่าเริ่มต้น `3000`)
- `HOST`: โฮสต์สำหรับรันเว็บเซิร์ฟเวอร์ (ค่าเริ่มต้น `localhost`)
- `PRIV_KEY`: Private Key ที่ใช้ในการเข้ารหัสลายมือชื่อดิจิทัล (VC signing) โดยต้องระบุในบรรทัดเดียวกันและใช้ `\n` แทนการขึ้นบรรทัดใหม่ เช่น:
  ```env
  PRIV_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyPPN+9MoqmlrG\n...ข้อมูลคีย์...\n-----END PRIVATE KEY-----"
  ```
