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

## 4. Build untuk production (opsional)
```
npm run build
```
Hasilnya ada di folder `dist/` — bisa di-deploy ke Vercel, Netlify, Cloudflare Pages, dll (ingat catatan soal API key di atas kalau mau publik).

## Single-file version
`kompas-kerja.html` (shipped next to this folder) is the same app bundled into one self-contained file. Double-click it to run; no Node.js needed.
