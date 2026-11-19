# Kompas Kerja — jalan di VS Code

Proyek React (Vite + Tailwind) siap pakai. Sudah pernah di-build & dites lolos di lingkungan ini sebelum dikirim ke kamu.

## 1. Yang perlu diinstal dulu
- **Node.js** versi 18 ke atas → https://nodejs.org (pilih LTS)
- **VS Code** → https://code.visualstudio.com

## 2. Buka & jalankan
1. Ekstrak folder ini, lalu buka lewat VS Code: `File → Open Folder...`
2. Buka terminal di VS Code (`` Ctrl+` `` atau `View → Terminal`)
3. Install dependency:
   ```
   npm install
   ```
4. Jalankan mode development:
   ```
   npm run dev
   ```
5. Buka link yang muncul di terminal (biasanya `http://localhost:5173`) di browser.

Setiap kali kamu simpan perubahan di `src/App.jsx`, halaman akan otomatis refresh (hot reload).

## 3. Struktur folder
```
kompas-kerja-app/
├── src/
│   ├── App.jsx        ← seluruh aplikasi (kode yang sama dari Claude)
│   ├── main.jsx        ← entry point + shim window.storage → localStorage
│   └── index.css       ← import Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 4. Dua hal yang beda dari versi Pertama

**a. Penyimpanan data (pelacak jam, kalkulator, checklist, kanban)**
Di Claude.ai, app ini pakai `window.storage` (API khusus sandbox Claude). Di luar Claude.ai itu tidak ada, jadi `src/main.jsx` sudah saya isi shim kecil yang menggantinya dengan `localStorage` browser biasa — jadi datamu tetap tersimpan otomatis, tapi sekarang tersimpan di browser kamu sendiri (per browser, per komputer).

**b. Fitur "Cek Reputasi Tempat Kerja Asli"**
Fitur ini memanggil Anthropic API langsung dari browser. Di Claude.ai, panggilan ini ditangani otomatis tanpa kamu perlu API key. Di luar Claude.ai, kamu perlu:
1. Bikin API key di https://console.anthropic.com/settings/keys
2. Tempel di kolom "Anthropic API key" yang muncul saat fitur itu dibuka

⚠️ **Penting:** cara ini (API key ditempel langsung di browser) hanya aman untuk kamu pakai sendiri di `localhost`. **Jangan** deploy versi ini ke internet publik dengan kolom API key seperti itu — siapa pun bisa mengambil key-mu lewat DevTools browser. Kalau nanti mau di-deploy publik, panggilan ke Anthropic API itu perlu dipindah ke backend/serverless function supaya key-nya tidak terlihat pengguna.

## 5. Build untuk production (opsional)
```
npm run build
```
Hasilnya ada di folder `dist/` — bisa di-deploy ke Vercel, Netlify, Cloudflare Pages, dll (ingat catatan soal API key di atas kalau mau publik).

## Single-file version
`kompas-kerja.html` (shipped next to this folder) is the same app bundled into one self-contained file. Double-click it to run; no Node.js needed.
