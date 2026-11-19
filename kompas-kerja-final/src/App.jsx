import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Compass, MapPin, Clock, DollarSign, Briefcase, Star, AlertTriangle,
  TrendingUp, TrendingDown, User, Search, CheckCircle2, XCircle,
  ChevronRight, ChevronDown, Info, Plane, Building2, ThumbsUp, ThumbsDown,
  MessageCircle, Filter, Award, Shield, Globe, Sparkles, ArrowRight, X,
  Ticket, Radar, ScanLine, BadgeAlert, SlidersHorizontal, Wallet, Home,
  ShoppingCart, Bus, Wifi, Droplet, HeartPulse, FileText, Copy, Check,
  CreditCard, Smartphone, Trello, Plus, Trash2, Loader2, ExternalLink,
  BookOpen, GraduationCap, ClipboardList, PiggyBank, RotateCcw, Landmark
} from "lucide-react";

/* ============================== DESIGN TOKENS ============================== */
const T = {
  paper: "#EFF2EF",
  paperDim: "#E4E8E3",
  ink: "#15202B",
  inkSoft: "#4B5A63",
  line: "#CBD3CC",
  amber: "#FFB703",
  amberDeep: "#8A5A00",
  teal: "#1F7A6C",
  coral: "#C62836",
  card: "#FBFBF9",
  // semantic surfaces (were hardcoded hex before the design-system audit)
  tealBg: "#E4F3EE", amberBg: "#FFF3D6", coralBg: "#F5E5E6",
  blueFg: "#2C5C99", blueBg: "#EAF1FB", blueLine: "#C9DCF2",
  alertBg: "#FBEAEA", alertLine: "#F1C0C3", alertFg: "#9C2A34",
  noteBg: "#FFF6E0", noteLine: "#F2DFA0", noteFg: "#7A5B00",
  onDarkSoft: "#B9C2C7", onDarkText: "#D7DDE0", darkLine: "#33424D", coralOnDark: "#FF8A94",
};
const F = {
  display: "'Space Grotesk', sans-serif",
  body: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

const COUNTRY_INFO = {
  NZ: {
    name: "Selandia Baru", code: "NZ", color: "#1B7F73",
    visaCapHours: 25, visaCapLabel: "25 jam / minggu", fortnightCap: null,
    visaNote: "Sejak 3 Nov 2025, batas kerja saat semester naik dari 20 ke 25 jam/minggu untuk pemegang visa pelajar yang memenuhi syarat. Bebas jam saat liburan resmi kampus. Mahasiswa PhD/Research Master tidak dibatasi.",
    currency: "NZD", minWage: 23.95, minWageNote: "Upah minimum dewasa NZD $23.95/jam (berlaku 1 April 2026), sebelum pajak.",
    waterNote: "Air keran aman diminum langsung di hampir seluruh kota besar NZ — tidak perlu anggaran khusus air minum.",
    bankNote: "Bank umum: ANZ, ASB, Westpac, BNZ, Kiwibank — bisa buka rekening online sebelum berangkat di beberapa bank.",
    taxId: "IRD number", healthNote: "Cek syarat asuransi kesehatan pelajar dari kampus/penyedia yang disetujui NZQA.",
  },
  AU: {
    name: "Australia", code: "AU", color: "#B85300",
    visaCapHours: 24, visaCapLabel: "48 jam / 2 minggu (≈24 jam/minggu)", fortnightCap: 48,
    visaNote: "Batas resmi saat ini 48 jam per 2 minggu (dihitung Senin–Minggu, gabungan semua kerjaan). Bebas jam saat liburan semester resmi. Ada wacana naik ke 60 jam/2 minggu mulai 1 Juli 2026, tapi belum disahkan — cek VEVO untuk kondisi visa terbaru.",
    currency: "AUD", minWage: 26.44, minWageNote: "Upah minimum nasional AUD $26.44/jam (berlaku 1 Juli 2026); pekerja casual biasanya dapat loading 25% jadi ≈ $33.05/jam.",
    waterNote: "Air keran di kota-kota besar Australia umumnya diolah dengan standar tinggi dan aman diminum langsung — bukan seperti anggapan umum, biasanya tidak perlu galon/filter tambahan.",
    bankNote: "Bank umum: Commonwealth Bank, ANZ, Westpac, NAB — bawa paspor & COE (Confirmation of Enrolment) saat buka rekening.",
    taxId: "TFN (Tax File Number)", healthNote: "Wajib punya OSHC (Overseas Student Health Cover) selama masa visa pelajar — bukan Medicare.",
  },
  TW: {
    name: "Taiwan", code: "TW", color: "#C62836",
    visaCapHours: 20, visaCapLabel: "20 jam / minggu", fortnightCap: null,
    visaNote: "Maksimal 20 jam/minggu di luar libur musim panas/dingin, dan wajib punya izin kerja (work permit) dari Kementerian Tenaga Kerja sebelum mulai bekerja. Bekerja tanpa izin bisa kena denda NT$30.000–150.000.",
    currency: "TWD", minWage: 196, minWageNote: "Upah minimum per jam NT$196 (berlaku 1 Januari 2026), sebelum pajak.",
    waterNote: "Air keran di titik pengolahan sudah memenuhi standar, tapi pipa gedung tua & tangki di atap sering bikin penduduk lokal & pelajar asing tetap merebus air atau pakai dispenser/filter — realistis dianggarkan sebagai biaya kecil tambahan.",
    bankNote: "Bank umum: Bank of Taiwan, CTBC, Taipei Fubon — biasanya perlu ARC dulu sebelum bisa buka rekening.",
    taxId: "ARC (Alien Resident Certificate)", healthNote: "Umumnya otomatis masuk NHI (asuransi kesehatan nasional) setelah ±6 bulan tinggal; sebelum itu biasanya wajib asuransi swasta — cek dengan kampus.",
  },
};

/* ============================== MOCK JOB DATA ==============================
   CATATAN: seluruh data lowongan, ulasan, dan skor sentimen di bawah ini
   adalah data CONTOH (fiktif) untuk mendemonstrasikan fitur aplikasi —
   bukan lowongan sungguhan. Nama perusahaan sengaja dibuat fiktif.
================================================================================ */
const JOBS = [
  {
    id: "nz-01", country: "NZ", city: "Auckland CBD", industry: "Kafe & Barista",
    title: "Barista Part-time", company: "Kedai Kopi Harbourline",
    type: "Part-time", pay: "≈ upah minimum + tip", hours: [15, 25],
    shifts: ["Pagi", "Akhir Pekan"], status: "Sedang Merekrut",
    sentiment: { reddit: 78, googleMaps: 82, tiktok: 70, instagram: 75 },
    tags: { pace: "cepat", social: "depan", physical: 2, english: 3, mandarin: 0, exp: "sedikit" },
    pros: ["Jadwal cukup fleksibel untuk mahasiswa", "Tim kerja ramah, banyak sesama pelajar internasional"],
    cons: ["Shift pagi buta beberapa kali seminggu", "Area kerja sempit saat jam sibuk"],
    reviews: [
      { source: "Reddit r/StudentsNZ", text: "Manajernya fleksibel soal jadwal ujian, tapi shift weekend memang padat." },
      { source: "Google Maps", text: "Tempat kerja pertama yang oke buat pelajar, cuma perlu cepat belajar mesin espresso." },
    ],
    flagged: false,
  },
  {
    id: "nz-02", country: "NZ", city: "Hamilton", industry: "Ritel",
    title: "Kasir & Shop Assistant", company: "Pasar Segar Mart",
    type: "Part-time", pay: "≈ upah minimum", hours: [10, 20],
    shifts: ["Siang", "Akhir Pekan"], status: "Sedang Merekrut",
    sentiment: { reddit: 74, googleMaps: 76, tiktok: 68, instagram: 70 },
    tags: { pace: "seimbang", social: "depan", physical: 2, english: 2, mandarin: 0, exp: "belum" },
    pros: ["Ramah pemula, ada training", "Lokasi dekat kampus"],
    cons: ["Kadang harus berdiri lama di kasir"],
    reviews: [
      { source: "Google Maps", text: "Supervisornya sabar ke staf baru, cocok buat yang belum pernah kerja ritel." },
      { source: "TikTok", text: "Seragamnya nyaman, tapi jam Sabtu sore rame banget." },
    ],
    flagged: false,
  },
  {
    id: "nz-03", country: "NZ", city: "Wellington", industry: "Dapur & Hospitality",
    title: "Kitchen Hand", company: "Golden Wok Kitchen",
    type: "Part-time", pay: "≈ upah minimum + makan saat shift", hours: [12, 22],
    shifts: ["Malam", "Akhir Pekan"], status: "Sedang Merekrut",
    sentiment: { reddit: 68, googleMaps: 71, tiktok: 60, instagram: 65 },
    tags: { pace: "cepat", social: "belakang", physical: 4, english: 2, mandarin: 0, exp: "belum" },
    pros: ["Dapat makan gratis saat shift", "Bagus untuk yang tidak nyaman menghadapi pelanggan langsung"],
    cons: ["Dapur panas dan sempit saat jam sibuk", "Ritme kerja cepat"],
    reviews: [
      { source: "Reddit r/wellington", text: "Lumayan capek pas Jumat-Sabtu malam, tapi chef-nya asik ngajarin." },
      { source: "Google Maps", text: "Dapur agak sempit tapi tim saling bantu." },
    ],
    flagged: false,
  },
  {
    id: "nz-04", country: "NZ", city: "Nelson (musiman)", industry: "Pertanian / Horticulture",
    title: "Pemetik Buah (Musiman)", company: "Orchard Fresh Pickers Co.",
    type: "Full-time (musiman)", pay: "Per hasil petik, potensi tinggi saat panen", hours: [30, 40],
    shifts: ["Pagi"], status: "Sedang Merekrut",
    sentiment: { reddit: 72, googleMaps: 75, tiktok: 80, instagram: 70 },
    tags: { pace: "seimbang", social: "campuran", physical: 5, english: 2, mandarin: 0, exp: "belum" },
    pros: ["Gaji per hasil bisa tinggi kalau cekatan", "Akomodasi pekerja tersedia"],
    cons: ["Sangat bergantung cuaca", "Fisik berat, berjam-jam di bawah matahari"],
    reviews: [
      { source: "Reddit r/PickingNZ", text: "Musim puncak jamnya bisa memanjang mendadak, penting nego di awal." },
      { source: "Google Maps", text: "Bayarannya oke kalau target harian tercapai, tapi capek luar biasa." },
    ],
    flagged: true,
    flagReason: "Beberapa ulasan Google Maps & thread Reddit melaporkan jam kerja panen memanjang tanpa pemberitahuan sebelumnya saat musim puncak.",
  },
  {
    id: "nz-05", country: "NZ", city: "Christchurch", industry: "Perawatan Lansia (non-klinis)",
    title: "Support Staff Dapur & Kebersihan", company: "Sunrise Aged Care Support",
    type: "Part-time", pay: "Di atas upah minimum", hours: [15, 24],
    shifts: ["Pagi", "Malam"], status: "Sedang Merekrut",
    sentiment: { reddit: 85, googleMaps: 88, tiktok: 75, instagram: 80 },
    tags: { pace: "seimbang", social: "depan", physical: 3, english: 3, mandarin: 0, exp: "sedikit" },
    pros: ["Pengalaman relevan untuk jurusan kesehatan", "Jadwal tetap & terprediksi"],
    cons: ["Bisa cukup menguras emosi"],
    reviews: [
      { source: "Reddit r/christchurch", text: "Supervisor perhatian ke staf pelajar, banyak yang lanjut jadi caregiver." },
      { source: "Google Maps", text: "Lingkungan kerja hangat, cocok buat yang suka membantu orang." },
    ],
    flagged: false,
  },
  {
    id: "au-01", country: "AU", city: "Melbourne", industry: "Gudang & Logistik",
    title: "Warehouse Picker/Packer", company: "Southern Cross Logistics Warehouse",
    type: "Casual", pay: "Upah casual (loading lebih tinggi)", hours: [15, 30],
    shifts: ["Malam", "Akhir Pekan", "Fleksibel"], status: "Sedang Merekrut",
    sentiment: { reddit: 74, googleMaps: 70, tiktok: 65, instagram: 68 },
    tags: { pace: "cepat", social: "belakang", physical: 4, english: 2, mandarin: 0, exp: "belum" },
    pros: ["Rate casual lebih tinggi dari kerja tetap", "Banyak slot shift tersedia"],
    cons: ["Berdiri & jalan jauh sepanjang shift", "Target packing cukup ketat"],
    reviews: [
      { source: "Reddit r/melbourne", text: "Rosternya berubah-ubah, kadang mepet banget dikasih taunya." },
      { source: "Google Maps", text: "Bayarannya lumayan tapi capek fisik, penting jaga stamina." },
    ],
    flagged: true,
    flagReason: "Beberapa ulasan menyebutkan jadwal roster sering berubah mendadak dengan pemberitahuan singkat.",
  },
  {
    id: "au-02", country: "AU", city: "Sydney", industry: "Kebersihan",
    title: "Cleaner Komersial", company: "CleanNest Services",
    type: "Part-time", pay: "Di atas upah minimum", hours: [10, 20],
    shifts: ["Pagi", "Fleksibel"], status: "Sedang Merekrut",
    sentiment: { reddit: 80, googleMaps: 77, tiktok: 72, instagram: 75 },
    tags: { pace: "santai", social: "belakang", physical: 3, english: 2, mandarin: 0, exp: "belum" },
    pros: ["Jadwal fleksibel, bisa disesuaikan kuliah", "Kerja cenderung mandiri, minim interaksi"],
    cons: ["Perlu pindah-pindah lokasi, transportasi jadi PR"],
    reviews: [
      { source: "Google Maps", text: "Kerja santai asal disiplin waktu, enak buat yang introvert." },
      { source: "TikTok", text: "Lumayan buat sampingan, tinggal atur rute biar gak buang waktu di jalan." },
    ],
    flagged: false,
  },
  {
    id: "au-03", country: "AU", city: "Brisbane", industry: "Konstruksi (General Hand)",
    title: "Labourer Support", company: "Skyline Build Co.",
    type: "Part-time (semester) / Full-time (liburan)", pay: "Rate per jam tinggi", hours: [15, 40],
    shifts: ["Pagi"], status: "Kompetitif",
    sentiment: { reddit: 66, googleMaps: 60, tiktok: 55, instagram: 62 },
    tags: { pace: "cepat", social: "campuran", physical: 5, english: 3, mandarin: 0, exp: "sedikit" },
    pros: ["Bayaran per jam termasuk tinggi", "Pengalaman berharga untuk jurusan teknik sipil"],
    cons: ["Fisik sangat berat", "Butuh sertifikat White Card dulu"],
    reviews: [
      { source: "Reddit r/AusFinance", text: "Kerjaannya berat tapi worth it kalau butuh uang cepat, siapin fisik." },
      { source: "TikTok", text: "Beberapa proyek subkontraktor telat bayar lembur, cek reputasi kontraktornya dulu." },
    ],
    flagged: true,
    flagReason: "Ada laporan di Reddit dan video TikTok soal keterlambatan pembayaran upah lembur di beberapa proyek subkontraktor.",
  },
  {
    id: "au-04", country: "AU", city: "Adelaide", industry: "Pendidikan / Tutoring",
    title: "Tutor Bahasa & Matematika", company: "BrightPath Tutoring Centre",
    type: "Part-time", pay: "Di atas upah minimum", hours: [6, 14],
    shifts: ["Sore", "Akhir Pekan"], status: "Sedang Merekrut",
    sentiment: { reddit: 88, googleMaps: 90, tiktok: 80, instagram: 85 },
    tags: { pace: "santai", social: "depan", physical: 1, english: 4, mandarin: 0, exp: "berpengalaman" },
    pros: ["Jam kerja pendek & fleksibel", "Cocok untuk yang senang mengajar/akademis"],
    cons: ["Jumlah jam terbatas, tergantung permintaan siswa"],
    reviews: [
      { source: "Google Maps", text: "Tutor-tutornya berpengalaman, siswa dan orang tua puas." },
      { source: "Reddit r/adelaide", text: "Enak buat sampingan tapi jangan andalkan sebagai penghasilan utama." },
    ],
    flagged: false,
  },
  {
    id: "au-05", country: "AU", city: "Perth", industry: "Kurir / Gig Economy",
    title: "Delivery Partner", company: "QuickDash Delivery Partners",
    type: "Gig / Fleksibel", pay: "Per antar, bervariasi", hours: [5, 30],
    shifts: ["Fleksibel"], status: "Sedang Merekrut",
    sentiment: { reddit: 70, googleMaps: 65, tiktok: 60, instagram: 68 },
    tags: { pace: "cepat", social: "campuran", physical: 3, english: 2, mandarin: 0, exp: "belum" },
    pros: ["Jadwal paling fleksibel dari semua opsi", "Bisa mulai/berhenti kapan saja"],
    cons: ["Pendapatan tidak stabil", "Butuh kendaraan & jam kerja tetap dihitung ke batas visa"],
    reviews: [
      { source: "Reddit r/perth", text: "Enak buat isi waktu kosong, tapi jangan lupa hitung total jam gig-nya juga masuk batas visa." },
      { source: "TikTok", text: "Penghasilan naik turun tergantung jam ramai, perlu strategi milih waktu." },
    ],
    flagged: false,
  },
  {
    id: "tw-01", country: "TW", city: "Taipei", industry: "Bubble Tea & F&B",
    title: "Barista & Kasir", company: "MoonTea Bubble Tea House",
    type: "Part-time", pay: "Sesuai UMR Taiwan", hours: [12, 20],
    shifts: ["Siang", "Malam"], status: "Sedang Merekrut",
    sentiment: { reddit: 76, googleMaps: 80, tiktok: 72, instagram: 78 },
    tags: { pace: "cepat", social: "depan", physical: 2, english: 1, mandarin: 3, exp: "belum" },
    pros: ["Budaya tim yang erat", "Banyak cabang, mudah pindah lokasi kalau pindah tempat tinggal"],
    cons: ["Beberapa shift sampai larut malam"],
    reviews: [
      { source: "Reddit r/Taiwan", text: "Owner-nya sabar walau Mandarin masih belajar, penting mau usaha komunikasi." },
      { source: "Google Maps", text: "Ramai terus jadi cepat belajar multitasking." },
    ],
    flagged: false,
  },
  {
    id: "tw-02", country: "TW", city: "Taipei (Shilin)", industry: "Pasar Malam",
    title: "Pramuniaga Stan Malam", company: "NightMarket Helper Stall",
    type: "Part-time", pay: "Harian/tunai", hours: [10, 20],
    shifts: ["Malam", "Akhir Pekan"], status: "Sedang Merekrut",
    sentiment: { reddit: 70, googleMaps: 68, tiktok: 74, instagram: 66 },
    tags: { pace: "cepat", social: "depan", physical: 3, english: 1, mandarin: 4, exp: "belum" },
    pros: ["Penghasilan harian cair cepat", "Suasana kerja ramai dan seru"],
    cons: ["Berdiri lama & lingkungan bising"],
    reviews: [
      { source: "Reddit r/Taiwan", text: "Butuh Mandarin dasar yang oke karena pembeli lokal jarang pakai Inggris." },
      { source: "TikTok", text: "Capek tapi seru, cocok yang suka suasana rame." },
    ],
    flagged: false,
  },
  {
    id: "tw-03", country: "TW", city: "Kaohsiung", industry: "Convenience Store",
    title: "Kasir & Stok Toko", company: "FamilyCorner Mart",
    type: "Part-time", pay: "Sesuai UMR Taiwan", hours: [10, 20],
    shifts: ["Fleksibel", "Pagi", "Malam"], status: "Sedang Merekrut",
    sentiment: { reddit: 82, googleMaps: 84, tiktok: 78, instagram: 80 },
    tags: { pace: "seimbang", social: "depan", physical: 2, english: 1, mandarin: 3, exp: "belum" },
    pros: ["Shift sangat fleksibel, sistemnya 24 jam", "Ada pelatihan terstruktur di awal"],
    cons: ["Shift malam kadang sendirian jaga toko"],
    reviews: [
      { source: "Google Maps", text: "Manajernya jelas soal jadwal, training juga rapi." },
      { source: "Reddit r/Kaohsiung", text: "Shift malam agak sepi tapi tenang buat yang gak suka rame." },
    ],
    flagged: false,
  },
  {
    id: "tw-04", country: "TW", city: "Taichung", industry: "Pendidikan / Cram School",
    title: "Asisten Admin & Pengajar Bahasa", company: "BrightEdge Language Cram School",
    type: "Part-time", pay: "Di atas UMR Taiwan", hours: [8, 18],
    shifts: ["Sore"], status: "Sedang Merekrut",
    sentiment: { reddit: 90, googleMaps: 88, tiktok: 82, instagram: 85 },
    tags: { pace: "santai", social: "depan", physical: 1, english: 4, mandarin: 2, exp: "sedikit" },
    pros: ["Relevan untuk jurusan bahasa/pendidikan", "Lingkungan kerja tenang & terstruktur"],
    cons: ["Jam dibatasi ketat 20 jam/minggu, diawasi kampus"],
    reviews: [
      { source: "Google Maps", text: "Sangat rapi soal kontrak dan jam kerja, cocok yang butuh kepastian." },
      { source: "Reddit r/Taiwan", text: "Bagus untuk portofolio kalau mau lanjut karier di pendidikan bahasa." },
    ],
    flagged: false,
  },
];

/* ============================== HELPERS ============================== */
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const avg = (obj) => Object.values(obj).reduce((a, b) => a + b, 0) / Object.values(obj).length;

const PACE_ORDER = ["santai", "seimbang", "cepat"];
function paceScore(userPace, jobPace) {
  const d = Math.abs(PACE_ORDER.indexOf(userPace) - PACE_ORDER.indexOf(jobPace));
  return d === 0 ? 100 : d === 1 ? 60 : 20;
}
function socialScore(userSocial, jobSocial) {
  if (userSocial === "campuran" || jobSocial === "campuran") return 82;
  return userSocial === jobSocial ? 100 : 30;
}
function expScore(userExp, jobExp) {
  const order = { belum: 0, sedikit: 1, berpengalaman: 2 };
  if (jobExp === "belum") return 100;
  if (jobExp === "sedikit") return order[userExp] >= 1 ? 100 : 60;
  return order[userExp] === 2 ? 100 : order[userExp] === 1 ? 70 : 40;
}
function shiftScore(userShifts, jobShifts) {
  if (userShifts.includes("Fleksibel")) return 95;
  const overlap = jobShifts.filter((s) => userShifts.includes(s)).length;
  if (overlap === 0) return jobShifts.includes("Fleksibel") ? 70 : 25;
  return clamp(40 + overlap * 30);
}
function hoursScore(desired, [min, max], visaCap) {
  const cappedDesired = Math.min(desired, visaCap);
  const mid = (min + max) / 2;
  const diff = Math.abs(cappedDesired - mid);
  const range = Math.max(max - min, 5);
  let s = clamp(100 - (diff / range) * 70);
  if (desired > visaCap) s = clamp(s - 15);
  return s;
}

function computeMatch(job, profile) {
  const cap = COUNTRY_INFO[job.country].visaCapHours;
  const sPace = paceScore(profile.pace, job.tags.pace);
  const sSocial = socialScore(profile.social, job.tags.social);
  const sPhysical = clamp(100 - Math.abs(profile.stamina - job.tags.physical) * 20);
  const sShift = shiftScore(profile.shifts, job.shifts);
  const sHours = hoursScore(profile.targetHours, job.hours, cap);
  let sLang = clamp(100 - Math.abs(profile.english - job.tags.english) * 20);
  if (job.tags.mandarin > 0) {
    const sMandarin = clamp(100 - Math.abs(profile.mandarin - job.tags.mandarin) * 20);
    sLang = (sLang + sMandarin) / 2;
  }
  const sExp = expScore(profile.exp, job.tags.exp);

  const weighted =
    sHours * 0.2 + sPace * 0.15 + sSocial * 0.15 + sPhysical * 0.15 +
    sShift * 0.15 + sLang * 0.12 + sExp * 0.08;

  const countryPenalty = profile.countries.includes(job.country) ? 0 : 35;
  const total = clamp(Math.round(weighted - countryPenalty));

  return {
    total,
    breakdown: [
      { label: "Jam kerja & batas visa", value: Math.round(sHours) },
      { label: "Ritme kerja", value: Math.round(sPace) },
      { label: "Gaya sosial", value: Math.round(sSocial) },
      { label: "Kesiapan fisik", value: Math.round(sPhysical) },
      { label: "Kecocokan shift", value: Math.round(sShift) },
      { label: "Bahasa", value: Math.round(sLang) },
      { label: "Pengalaman", value: Math.round(sExp) },
    ],
  };
}

/* ============================== PERSISTENT STORAGE HOOK ============================== */
function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await window.storage.get(key, false);
        if (mounted && res && res.value) setValue(JSON.parse(res.value));
      } catch (e) {
        // belum ada data tersimpan, pakai default
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = (updaterOrValue) => {
    setValue((prev) => {
      const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;
      window.storage.set(key, JSON.stringify(next), false).catch((e) => console.error("Gagal menyimpan:", e));
      return next;
    });
  };

  return [value, persist, ready];
}

/* ============================== DATE / VISA HOUR HELPERS ============================== */
function isoDate(d) { return d.toISOString().slice(0, 10); }
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function daysBetween(a, b) { return Math.round((b - a) / (1000 * 60 * 60 * 24)); }

/* ============================== CV TEMPLATES & INTERVIEW BANK ============================== */
const JOB_CATEGORIES = [
  "Hospitality & F&B", "Ritel & Kasir", "Gudang & Fisik",
  "Kebersihan & Perawatan", "Pendidikan & Tutoring", "Gig & Pengantaran",
];

const CV_TEMPLATES = {
  "Hospitality & F&B": {
    summary: "Motivated international student experienced in fast-paced customer service, comfortable multitasking during peak hours, and quick to learn POS/ordering systems.",
    bullets: [
      "Served an average of [angka] customers per shift while maintaining accuracy and a friendly manner",
      "Trained on [nama mesin/POS] within first week and helped onboard 2 new teammates",
      "Handled cash and card transactions with zero discrepancies over [durasi]",
    ],
    skills: ["Customer service", "POS systems", "Food safety basics", "Teamwork under pressure", "Bahasa Inggris percakapan"],
  },
  "Ritel & Kasir": {
    summary: "Detail-oriented and reliable part-time retail assistant with a track record of accurate cash handling and helpful customer interactions.",
    bullets: [
      "Processed transactions accurately for [angka]+ customers daily using [sistem kasir]",
      "Restocked and organised shelves to maintain store presentation standards",
      "Resolved customer queries and returns in line with store policy",
    ],
    skills: ["Cash handling", "Inventory basics", "Customer communication", "Time management"],
  },
  "Gudang & Fisik": {
    summary: "Physically fit and safety-conscious warehouse assistant, reliable with repetitive tasks and comfortable meeting packing/picking targets.",
    bullets: [
      "Picked and packed [angka]+ orders per shift while meeting accuracy targets",
      "Followed manual handling and workplace safety procedures consistently",
      "Adapted quickly to rotating shift schedules including nights and weekends",
    ],
    skills: ["Manual handling", "Attention to detail", "Reliability", "Basic forklift/pallet jack (if applicable)"],
  },
  "Kebersihan & Perawatan": {
    summary: "Dependable and compassionate support worker with experience maintaining clean, safe environments and assisting day-to-day resident/customer needs.",
    bullets: [
      "Maintained cleaning schedules across [jumlah] sites/rooms to hygiene standards",
      "Assisted staff and residents with day-to-day support tasks (non-clinical)",
      "Communicated respectfully with a diverse, multicultural team",
    ],
    skills: ["Time management", "Attention to hygiene standards", "Empathy & patience", "Basic first aid (if certified)"],
  },
  "Pendidikan & Tutoring": {
    summary: "Patient and articulate tutor with a strong academic background, able to explain concepts clearly to students of varying levels.",
    bullets: [
      "Tutored [jumlah] students per week in [mata pelajaran], improving average grades/confidence",
      "Prepared simple lesson plans tailored to each student's level",
      "Communicated regularly with parents/coordinators on student progress",
    ],
    skills: ["Subject mastery", "Lesson planning", "Patience & clear communication", "Bilingual (Indonesian/English)"],
  },
  "Gig & Pengantaran": {
    summary: "Self-motivated and punctual gig worker experienced managing own schedule, navigating city routes efficiently, and maintaining high customer ratings.",
    bullets: [
      "Completed [angka]+ deliveries with a customer rating of [angka]/5",
      "Planned efficient routes to meet delivery windows during peak hours",
      "Managed own schedule while tracking hours against visa work-hour limits",
    ],
    skills: ["Route planning", "Self-management", "Punctuality", "Basic vehicle maintenance"],
  },
};

const INTERVIEW_BANK = {
  "Hospitality & F&B": [
    { q: "Tell me about a time you handled a difficult customer.", tip: "Gunakan struktur STAR (Situation, Task, Action, Result). Fokus ke cara kamu tetap tenang dan menyelesaikan masalah, bukan siapa yang salah." },
    { q: "How do you handle a busy rush period?", tip: "Sebutkan cara memprioritaskan tugas, komunikasi dengan tim, dan tetap ramah walau tergesa-gesa." },
    { q: "Are you available for weekend and evening shifts?", tip: "Jawab jujur sesuai jadwal kuliahmu — sebutkan jam yang benar-benar bisa kamu komit." },
    { q: "Why do you want to work here?", tip: "Riset singkat soal tempatnya (vibe, menu, lokasi) supaya jawabanmu spesifik, bukan generik." },
  ],
  "Ritel & Kasir": [
    { q: "How would you handle a cash register discrepancy?", tip: "Tunjukkan kejujuran & prosedur: cek ulang, laporkan ke supervisor, jangan menutup-nutupi." },
    { q: "Describe your experience with customer service.", tip: "Kalau belum ada pengalaman formal, ceritakan pengalaman informal (bantu di toko keluarga, organisasi kampus, dll)." },
    { q: "How do you stay motivated during repetitive tasks?", tip: "Sebutkan kebiasaan personal: target kecil per jam, mendengarkan podcast (jika diizinkan), dsb." },
  ],
  "Gudang & Fisik": [
    { q: "Are you comfortable with physically demanding work?", tip: "Jujur soal kondisi fisikmu; sebutkan kebiasaan olahraga/stamina kalau relevan." },
    { q: "How do you prioritise safety while working quickly?", tip: "Tekankan bahwa kamu tidak akan mengorbankan prosedur keselamatan demi kecepatan." },
    { q: "Can you work night or early morning shifts?", tip: "Jawab sesuai jadwal kuliah & batas jam visa kamu." },
  ],
  "Kebersihan & Perawatan": [
    { q: "Why are you interested in this kind of support role?", tip: "Kaitkan dengan minat pribadi (misalnya rencana studi kesehatan) kalau relevan, atau soal keandalan & kepedulianmu." },
    { q: "How do you handle emotionally difficult situations at work?", tip: "Tunjukkan empati dan kemampuan menjaga batasan profesional yang sehat." },
    { q: "Are you comfortable working independently with minimal supervision?", tip: "Berikan contoh konkret kamu menyelesaikan tugas tanpa perlu diawasi terus." },
  ],
  "Pendidikan & Tutoring": [
    { q: "How would you explain a difficult concept to a struggling student?", tip: "Beri contoh konkret: analogi sederhana, langkah kecil, cek pemahaman sebelum lanjut." },
    { q: "How do you handle a student who isn't motivated?", tip: "Sebutkan pendekatan personal: cari minat siswa, beri apresiasi kecil, variasi metode." },
    { q: "What subjects/levels are you most confident teaching?", tip: "Jujur soal batas kemampuanmu — lebih baik spesifik daripada mengklaim bisa semua." },
  ],
  "Gig & Pengantaran": [
    { q: "How do you manage your time across deliveries and study?", tip: "Sebutkan cara kamu blok waktu kerja vs belajar, dan bagaimana kamu tetap dalam batas jam visa." },
    { q: "What would you do if the address given is wrong or unclear?", tip: "Tunjukkan inisiatif: hubungi pelanggan/dukungan aplikasi, tetap tenang dan sopan." },
    { q: "How do you stay safe while working outdoors/on the road?", tip: "Sebutkan kebiasaan keselamatan: cek kendaraan, kondisi cuaca, jam istirahat." },
  ],
};

/* ============================== ARRIVAL CHECKLIST ============================== */
const CHECKLIST_ITEMS = {
  NZ: [
    { id: "bank", label: "Buka rekening bank lokal", desc: "Bawa paspor & bukti pendaftaran kampus; beberapa bank bisa proses online sebelum berangkat." },
    { id: "ird", label: "Ajukan IRD number", desc: "Nomor pajak — wajib sebelum mulai bekerja, ajukan online lewat situs IRD." },
    { id: "sim", label: "Beli kartu SIM lokal", desc: "Spark, One NZ, atau 2degrees — tersedia di bandara & minimarket." },
    { id: "insurance", label: "Daftar asuransi kesehatan pelajar", desc: "Cek penyedia yang disetujui/direkomendasikan kampus." },
    { id: "accommodation", label: "Konfirmasi akomodasi", desc: "Asrama kampus atau flatting bersama pelajar lain." },
    { id: "transport", label: "Aktifkan kartu transportasi umum (AT HOP dll)", desc: "Beli & top-up di stasiun/minimarket sesuai kota." },
    { id: "workright", label: "Cek kondisi visa & hak kerja di eVisa", desc: "Pastikan batas jam kerja sesuai kondisi visamu." },
  ],
  AU: [
    { id: "bank", label: "Buka rekening bank lokal", desc: "Bawa paspor & COE (Confirmation of Enrolment)." },
    { id: "tfn", label: "Ajukan TFN (Tax File Number)", desc: "Wajib sebelum bekerja — ajukan online lewat ATO." },
    { id: "oshc", label: "Aktifkan OSHC", desc: "Asuransi kesehatan wajib pelajar internasional selama masa visa." },
    { id: "sim", label: "Beli kartu SIM lokal", desc: "Telstra, Optus, Vodafone, atau provider prabayar lain." },
    { id: "accommodation", label: "Konfirmasi akomodasi", desc: "Student housing, homestay, atau share house." },
    { id: "transport", label: "Aktifkan kartu transportasi umum (Opal/Myki/Go Card, dst.)", desc: "Sesuai kota tujuan; biasanya ada diskon pelajar/concession." },
    { id: "vevo", label: "Cek kondisi visa lewat VEVO", desc: "Pastikan batas 48 jam/2 minggu sesuai kondisi visamu." },
  ],
  TW: [
    { id: "arc", label: "Urus ARC (Alien Resident Certificate)", desc: "Wajib untuk tinggal & jadi syarat buka rekening bank." },
    { id: "bank", label: "Buka rekening bank lokal", desc: "Biasanya perlu ARC terlebih dulu." },
    { id: "workpermit", label: "Ajukan izin kerja part-time", desc: "Wajib sebelum mulai kerja apa pun — lewat Kementerian Tenaga Kerja/kampus." },
    { id: "nhi", label: "Cek pendaftaran NHI (asuransi kesehatan nasional)", desc: "Umumnya otomatis aktif setelah ±6 bulan tinggal." },
    { id: "sim", label: "Beli kartu SIM lokal", desc: "Chunghwa Telecom, Taiwan Mobile, atau FarEasTone." },
    { id: "accommodation", label: "Konfirmasi akomodasi", desc: "Asrama kampus atau sewa kamar/apartemen." },
    { id: "water", label: "Siapkan solusi air minum", desc: "Dispenser/filter atau kebiasaan merebus air keran sebelum diminum." },
  ],
};

/* ============================== DEFAULT COST-OF-LIVING ITEMS (contoh, per minggu) ============================== */
const DEFAULT_COSTS = {
  NZ: { sewa: 220, groceries: 90, transport: 30, utilitas: 25, internet: 12, airMinum: 0, asuransi: 15, hiburan: 40 },
  AU: { sewa: 280, groceries: 100, transport: 35, utilitas: 30, internet: 12, airMinum: 0, asuransi: 20, hiburan: 45 },
  TW: { sewa: 2200, groceries: 1400, transport: 400, utilitas: 350, internet: 150, airMinum: 100, asuransi: 200, hiburan: 800 },
};
const COST_LABELS = [
  { key: "sewa", label: "Sewa kamar (bagi patungan)", icon: Home },
  { key: "groceries", label: "Groceries / makan", icon: ShoppingCart },
  { key: "transport", label: "Transportasi umum", icon: Bus },
  { key: "utilitas", label: "Listrik & air", icon: Droplet },
  { key: "internet", label: "Internet & pulsa", icon: Wifi },
  { key: "airMinum", label: "Air minum tambahan (galon/filter)", icon: Droplet },
  { key: "asuransi", label: "Asuransi kesehatan (cicilan mingguan)", icon: HeartPulse },
  { key: "hiburan", label: "Uang jajan & hiburan", icon: Sparkles },
];

/* ============================== KANBAN STAGES ============================== */
const KANBAN_STAGES = ["Mau Dilamar", "Sudah Dilamar", "Interview", "Diterima", "Ditolak"];

/* ============================== SMALL UI ATOMS ============================== */
function Chip({ active, onClick, children, color }) {
  return (
    <button
      onClick={onClick}
      className="text-sm px-3 py-1.5 rounded-full border transition-colors"
      style={{
        borderColor: active ? (color || T.ink) : T.line,
        background: active ? (color || T.ink) : "transparent",
        color: active ? "#fff" : T.inkSoft,
        fontFamily: F.body,
      }}
    >
      {children}
    </button>
  );
}

function CircularScore({ value, size = 64, stroke = 7, color = T.teal }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (clamp(value) / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={T.line} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.display, fontWeight: 700, fontSize: size * 0.28, color: T.ink,
      }}>
        {Math.round(value)}
      </div>
    </div>
  );
}

function Bar({ label, value, color = T.teal }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1" style={{ color: T.inkSoft, fontFamily: F.mono }}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: T.paperDim, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Sedang Merekrut": { bg: T.tealBg, fg: T.teal, icon: CheckCircle2 },
    "Kompetitif": { bg: T.amberBg, fg: T.amberDeep, icon: Info },
    "Ditutup Sementara": { bg: T.coralBg, fg: T.coral, icon: XCircle },
  };
  const s = map[status] || map["Kompetitif"];
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full" style={{ background: s.bg, color: s.fg }}>
      <Icon size={12} /> {status}
    </span>
  );
}

/* ============================== BOARDING-PASS JOB CARD ============================== */
function JobCard({ job, onOpen, matchScore }) {
  const cInfo = COUNTRY_INFO[job.country];
  const composite = Math.round(avg(job.sentiment));
  return (
    <div
      onClick={() => onOpen(job)}
      role="button" tabIndex={0}
      aria-label={`Buka detail: ${job.title}, ${job.company}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(job); } }}
      className="cursor-pointer flex rounded-2xl overflow-hidden border transition-transform hover:-translate-y-0.5"
      style={{ borderColor: T.line, background: T.card, boxShadow: "0 1px 2px rgba(21,32,43,0.06)" }}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: cInfo.color, color: "#fff", fontFamily: F.mono }}>
            {cInfo.code}
          </span>
          <span className="text-xs" style={{ color: T.inkSoft }}>{job.city} · {job.industry}</span>
          {job.flagged && <BadgeAlert size={14} color={T.coral} />}
        </div>
        <h3 className="text-lg font-semibold" style={{ fontFamily: F.display, color: T.ink }}>{job.title}</h3>
        <p className="text-sm mb-2" style={{ color: T.inkSoft }}>{job.company}</p>
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: T.inkSoft }}>
          <span className="flex items-center gap-1"><Clock size={13} /> {job.hours[0]}–{job.hours[1]} jam/mgg</span>
          <span className="flex items-center gap-1"><DollarSign size={13} /> {job.pay}</span>
          <span className="flex items-center gap-1"><Briefcase size={13} /> {job.type}</span>
        </div>
        <div className="mt-3"><StatusBadge status={job.status} /></div>
      </div>
      <div className="w-28 flex flex-col items-center justify-center gap-1 p-3 border-l border-dashed" style={{ borderColor: T.line, background: T.paperDim }}>
        <div className="flex items-center gap-1">
          <Star size={13} fill={T.amber} color={T.amber} />
          <span className="text-sm font-semibold" style={{ fontFamily: F.mono, color: T.ink }}>{composite}</span>
        </div>
        <span className="text-[10px]" style={{ color: T.inkSoft }}>skor sosial</span>
        {typeof matchScore === "number" && (
          <>
            <div className="w-full h-px my-1" style={{ background: T.line }} />
            <span className="text-lg font-bold" style={{ fontFamily: F.display, color: T.teal }}>{matchScore}%</span>
            <span className="text-[10px]" style={{ color: T.inkSoft }}>cocok</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================== JOB DETAIL MODAL ============================== */
function JobDetail({ job, onClose, profile, hasProfile }) {
  const cInfo = COUNTRY_INFO[job.country];
  const match = hasProfile ? computeMatch(job, profile) : null;
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={`Detail lowongan ${job.title}`} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" style={{ background: "rgba(21,32,43,0.5)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        style={{ background: T.card }}
      >
        <div className="p-5 sm:p-6 border-b" style={{ borderColor: T.line }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: cInfo.color, color: "#fff", fontFamily: F.mono }}>
                  {cInfo.code} · {cInfo.name}
                </span>
                <StatusBadge status={job.status} />
              </div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: F.display, color: T.ink }}>{job.title}</h2>
              <p style={{ color: T.inkSoft }}>{job.company} · {job.city}</p>
            </div>
            <button onClick={onClose} aria-label="Tutup detail lowongan" className="p-2 rounded-full hover:bg-black/5"><X size={20} color={T.inkSoft} aria-hidden="true" /></button>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-3" style={{ background: T.paperDim }}>
            <div className="text-xs mb-1" style={{ color: T.inkSoft }}>Jam kerja</div>
            <div className="font-semibold" style={{ fontFamily: F.mono, color: T.ink }}>{job.hours[0]}–{job.hours[1]} jam/minggu</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: T.paperDim }}>
            <div className="text-xs mb-1" style={{ color: T.inkSoft }}>Estimasi bayaran</div>
            <div className="font-semibold" style={{ fontFamily: F.mono, color: T.ink }}>{job.pay}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: T.paperDim }}>
            <div className="text-xs mb-1" style={{ color: T.inkSoft }}>Shift</div>
            <div className="font-semibold text-sm" style={{ color: T.ink }}>{job.shifts.join(", ")}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: T.paperDim }}>
            <div className="text-xs mb-1" style={{ color: T.inkSoft }}>Tipe kontrak</div>
            <div className="font-semibold text-sm" style={{ color: T.ink }}>{job.type}</div>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-2">
          <div className="rounded-xl p-3 flex gap-2 items-start" style={{ background: T.blueBg, border: `1px solid ${T.blueLine}` }}>
            <Shield size={16} color={T.blueFg} style={{ marginTop: 2, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: T.blueFg }}>
              <b>Batas visa pelajar di {cInfo.name}:</b> {cInfo.visaCapLabel}. {cInfo.visaNote}
            </p>
          </div>
        </div>

        {match && (
          <div className="px-5 sm:px-6 pt-4">
            <div className="rounded-2xl p-4 flex gap-4 items-center" style={{ background: T.ink }}>
              <CircularScore value={match.total} color={T.amber} size={72} />
              <div className="flex-1">
                <div className="text-sm font-semibold mb-2" style={{ color: "#fff", fontFamily: F.display }}>Skor Kecocokan Kamu</div>
                <div className="grid grid-cols-2 gap-x-4">
                  {match.breakdown.map((b) => (
                    <div key={b.label} className="text-[11px] mb-1 flex justify-between" style={{ color: T.onDarkText, fontFamily: F.mono }}>
                      <span>{b.label}</span><span>{b.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold" style={{ color: T.teal }}><ThumbsUp size={15} /> Kelebihan</div>
            <ul className="space-y-1">
              {job.pros.map((p, i) => <li key={i} className="text-sm flex gap-2" style={{ color: T.inkSoft }}><span>+</span>{p}</li>)}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold" style={{ color: T.coral }}><ThumbsDown size={15} /> Perlu Diperhatikan</div>
            <ul className="space-y-1">
              {job.cons.map((c, i) => <li key={i} className="text-sm flex gap-2" style={{ color: T.inkSoft }}><span>–</span>{c}</li>)}
            </ul>
          </div>
        </div>

        <div className="px-5 sm:px-6">
          <div className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: T.ink }}>
            <Radar size={15} /> Sentimen dari Media Sosial & Ulasan
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {Object.entries(job.sentiment).map(([k, v]) => (
              <div key={k} className="rounded-lg p-2 text-center" style={{ background: T.paperDim }}>
                <div className="text-[10px] uppercase mb-1" style={{ color: T.inkSoft }}>{k}</div>
                <div className="font-bold" style={{ fontFamily: F.display, color: T.ink }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-4">
            {job.reviews.map((r, i) => (
              <div key={i} className="rounded-lg p-3 text-sm" style={{ background: T.paperDim, color: T.inkSoft }}>
                <span className="block text-[11px] font-semibold mb-1" style={{ color: T.ink, fontFamily: F.mono }}>{r.source}</span>
                {r.text}
              </div>
            ))}
          </div>
          <p className="text-[11px] italic mb-5" style={{ color: T.inkSoft }}>
            Contoh ilustrasi tampilan — bukan ulasan sungguhan.
          </p>
        </div>

        {job.flagged && (
          <div className="mx-5 sm:mx-6 mb-6 rounded-xl p-3 flex gap-2 items-start" style={{ background: T.alertBg, border: `1px solid ${T.alertLine}` }}>
            <AlertTriangle size={16} color={T.coral} style={{ marginTop: 2, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: T.alertFg }}><b>Peringatan komunitas:</b> {job.flagReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== PROFILE FORM ============================== */
const DEFAULT_PROFILE = {
  countries: ["NZ", "AU", "TW"],
  targetHours: 15,
  pace: "seimbang",
  social: "campuran",
  stamina: 3,
  shifts: ["Fleksibel"],
  english: 3,
  mandarin: 1,
  exp: "sedikit",
};

function ToggleCountry({ code, active, onClick }) {
  const info = COUNTRY_INFO[code];
  return (
    <button onClick={onClick} className="flex-1 rounded-xl p-3 border text-left transition-colors"
      style={{ borderColor: active ? info.color : T.line, background: active ? `${info.color}15` : "transparent" }}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: info.color, color: "#fff", fontFamily: F.mono }}>{info.code}</span>
        <span className="text-sm font-medium" style={{ color: T.ink }}>{info.name}</span>
      </div>
    </button>
  );
}

function ProfileForm({ profile, setProfile, onSubmit }) {
  const toggleArr = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const minCap = Math.min(...profile.countries.map((c) => COUNTRY_INFO[c].visaCapHours), 999);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>Bangun Profil Kerjamu</h2>
      <p className="text-sm mb-6" style={{ color: T.inkSoft }}>Semua dihitung dengan aturan yang transparan di perangkatmu sendiri — tanpa AI, tanpa data dikirim ke server mana pun.</p>

      <div className="mb-6">
        <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>Negara tujuan</label>
        <div className="flex gap-2">
          {Object.keys(COUNTRY_INFO).map((c) => (
            <ToggleCountry key={c} code={c} active={profile.countries.includes(c)}
              onClick={() => setProfile({ ...profile, countries: toggleArr(profile.countries, c) })} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>
          Target jam kerja/minggu: <span style={{ color: T.teal }}>{profile.targetHours} jam</span>
        </label>
        <input type="range" min={5} max={40} value={profile.targetHours}
          onChange={(e) => setProfile({ ...profile, targetHours: Number(e.target.value) })}
          className="w-full" />
        {profile.targetHours > minCap && (
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: T.coral }}>
            <AlertTriangle size={12} /> Melebihi batas visa terketat dari negara pilihanmu ({minCap} jam/minggu).
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>Ritme kerja yang kamu suka</label>
        <div className="flex gap-2">
          {["santai", "seimbang", "cepat"].map((p) => (
            <Chip key={p} active={profile.pace === p} color={T.teal} onClick={() => setProfile({ ...profile, pace: p })}>{p}</Chip>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>Gaya sosial saat kerja</label>
        <div className="flex gap-2">
          {[["depan", "Depan pelanggan"], ["belakang", "Balik layar"], ["campuran", "Campuran"]].map(([v, l]) => (
            <Chip key={v} active={profile.social === v} color={T.teal} onClick={() => setProfile({ ...profile, social: v })}>{l}</Chip>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>
          Kesiapan fisik: <span style={{ color: T.teal }}>{profile.stamina}/5</span>
        </label>
        <input type="range" min={1} max={5} value={profile.stamina}
          onChange={(e) => setProfile({ ...profile, stamina: Number(e.target.value) })} className="w-full" />
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>Preferensi shift (bisa pilih lebih dari satu)</label>
        <div className="flex flex-wrap gap-2">
          {["Pagi", "Siang", "Malam", "Akhir Pekan", "Fleksibel"].map((s) => (
            <Chip key={s} active={profile.shifts.includes(s)} color={T.teal} onClick={() => setProfile({ ...profile, shifts: toggleArr(profile.shifts, s) })}>{s}</Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>
            Percaya diri Bahasa Inggris: <span style={{ color: T.teal }}>{profile.english}/5</span>
          </label>
          <input type="range" min={1} max={5} value={profile.english}
            onChange={(e) => setProfile({ ...profile, english: Number(e.target.value) })} className="w-full" />
        </div>
        {profile.countries.includes("TW") && (
          <div>
            <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>
              Percaya diri Mandarin: <span style={{ color: T.teal }}>{profile.mandarin}/5</span>
            </label>
            <input type="range" min={1} max={5} value={profile.mandarin}
              onChange={(e) => setProfile({ ...profile, mandarin: Number(e.target.value) })} className="w-full" />
          </div>
        )}
      </div>

      <div className="mb-8">
        <label className="text-sm font-semibold block mb-2" style={{ color: T.ink }}>Pengalaman kerja part-time sebelumnya</label>
        <div className="flex gap-2">
          {[["belum", "Belum pernah"], ["sedikit", "Sedikit"], ["berpengalaman", "Berpengalaman"]].map(([v, l]) => (
            <Chip key={v} active={profile.exp === v} color={T.teal} onClick={() => setProfile({ ...profile, exp: v })}>{l}</Chip>
          ))}
        </div>
      </div>

      <button onClick={onSubmit}
        className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        style={{ background: T.amber, color: T.ink, fontFamily: F.display }}>
        <Sparkles size={18} /> Hitung Kecocokan Saya <ArrowRight size={18} />
      </button>
    </div>
  );
}

/* ============================== PELACAK JAM KERJA ============================== */
function HoursTracker({ profile }) {
  const [data, setData] = usePersistentState("hours-log", {
    visaCountry: profile.countries[0] || "NZ",
    entries: [],
  });
  const [form, setForm] = useState({ date: isoDate(new Date()), label: "", hours: "" });

  const cInfo = COUNTRY_INFO[data.visaCountry];
  const today = new Date();

  const weekStart = getMonday(today);
  const weeklyTotal = data.entries
    .filter((e) => {
      const d = new Date(e.date);
      return d >= weekStart && daysBetween(weekStart, d) < 7;
    })
    .reduce((sum, e) => sum + Number(e.hours), 0);

  const last14Total = data.entries
    .filter((e) => daysBetween(new Date(e.date), today) < 14 && daysBetween(new Date(e.date), today) >= 0)
    .reduce((sum, e) => sum + Number(e.hours), 0);

  const isFortnight = !!cInfo.fortnightCap;
  const cap = isFortnight ? cInfo.fortnightCap : cInfo.visaCapHours;
  const used = isFortnight ? last14Total : weeklyTotal;
  const pct = clamp((used / cap) * 100, 0, 999);
  const barColor = pct >= 100 ? T.coral : pct >= 75 ? T.amber : T.teal;

  const addEntry = () => {
    if (!form.label || !form.hours) return;
    const entry = { id: `h-${Date.now()}`, date: form.date, label: form.label, hours: Number(form.hours) };
    setData({ ...data, entries: [entry, ...data.entries].slice(0, 60) });
    setForm({ date: isoDate(new Date()), label: "", hours: "" });
  };
  const removeEntry = (id) => setData({ ...data, entries: data.entries.filter((e) => e.id !== id) });

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>Pelacak Jam Kerja Mingguan</h2>
      <p className="text-sm mb-4" style={{ color: T.inkSoft }}>Tersimpan otomatis di perangkatmu. Bukan catatan resmi imigrasi — tetap simpan slip gaji aslimu.</p>

      <div className="rounded-2xl p-4 mb-5" style={{ background: T.card, border: `1px solid ${T.line}` }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold" style={{ color: T.ink }}>Negara visa aktifku:</span>
          <div className="flex gap-2">
            {Object.keys(COUNTRY_INFO).map((c) => (
              <Chip key={c} active={data.visaCountry === c} color={COUNTRY_INFO[c].color} onClick={() => setData({ ...data, visaCountry: c })}>{c}</Chip>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <CircularScore value={pct > 100 ? 100 : pct} color={barColor} size={70} />
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: T.ink }}>
              {used.toFixed(1)} / {cap} jam {isFortnight ? "(14 hari terakhir)" : "(minggu ini, Senin–Minggu)"}
            </div>
            <div className="text-xs" style={{ color: T.inkSoft }}>Batas visa {cInfo.name}: {cInfo.visaCapLabel}</div>
          </div>
        </div>
        {pct >= 100 && (
          <div className="rounded-lg p-2 flex gap-2 items-start mb-2" style={{ background: T.alertBg }}>
            <AlertTriangle size={14} color={T.coral} style={{ marginTop: 2, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: T.alertFg }}>Kamu sudah di atas batas jam kerja visa. Segera kurangi jam kerja berikutnya.</p>
          </div>
        )}
        {pct >= 75 && pct < 100 && (
          <div className="rounded-lg p-2 flex gap-2 items-start mb-2" style={{ background: T.amberBg }}>
            <Info size={14} color={T.amberDeep} style={{ marginTop: 2, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: T.noteFg }}>Mendekati batas — sisa {Math.max(cap - used, 0).toFixed(1)} jam.</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl p-4 mb-5" style={{ background: T.card, border: `1px solid ${T.line}` }}>
        <div className="text-sm font-semibold mb-2" style={{ color: T.ink }}>Catat jam kerja</div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input type="date" aria-label="Tanggal kerja" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
          <input type="text" placeholder="Nama kerjaan" aria-label="Nama kerjaan" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
          <input type="number" min="0" step="0.5" placeholder="Jam" aria-label="Jumlah jam kerja" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })}
            className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
        </div>
        <button onClick={addEntry} className="flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg" style={{ background: T.ink, color: "#fff" }}>
          <Plus size={14} /> Tambah catatan
        </button>
      </div>

      <div className="space-y-2">
        {data.entries.length === 0 && <p className="text-sm text-center py-6" style={{ color: T.inkSoft }}>Belum ada catatan jam kerja.</p>}
        {data.entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-xl p-3" style={{ background: T.card, border: `1px solid ${T.line}` }}>
            <div>
              <div className="text-sm font-medium" style={{ color: T.ink }}>{e.label}</div>
              <div className="text-xs" style={{ color: T.inkSoft, fontFamily: F.mono }}>{e.date} · {e.hours} jam</div>
            </div>
            <button onClick={() => removeEntry(e.id)} aria-label={`Hapus catatan ${e.label}`}><Trash2 size={15} color={T.inkSoft} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== KALKULATOR GAJI BERSIH & BIAYA HIDUP ============================== */
function CostCalculator() {
  const [calc, setCalc] = usePersistentState("cost-calc", {
    country: "NZ",
    hoursPerWeek: 20,
    hourlyWage: COUNTRY_INFO.NZ.minWage,
    taxPct: 12,
    costs: { ...DEFAULT_COSTS.NZ },
  });

  const cInfo = COUNTRY_INFO[calc.country];

  const switchCountry = (c) => {
    setCalc({ ...calc, country: c, hourlyWage: COUNTRY_INFO[c].minWage, costs: { ...DEFAULT_COSTS[c] } });
  };
  const setCost = (key, v) => setCalc({ ...calc, costs: { ...calc.costs, [key]: Number(v) } });

  const grossWeekly = calc.hoursPerWeek * calc.hourlyWage;
  const netWeekly = grossWeekly * (1 - calc.taxPct / 100);
  const totalCosts = Object.values(calc.costs).reduce((a, b) => a + Number(b), 0);
  const surplus = netWeekly - totalCosts;

  const fmt = (n) => `${cInfo.currency} ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  const officialCalc = {
    NZ: "PAYE calculator — ird.govt.nz",
    AU: "Tax withheld calculator — ato.gov.au",
    TW: "Kalkulator National Taxation Bureau setempat",
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>Kalkulator Gaji Bersih & Biaya Hidup</h2>
      <p className="text-sm mb-4" style={{ color: T.inkSoft }}>Semua angka contoh/perkiraan kasar — sesuaikan dengan kondisi kotamu. Bukan nasihat pajak resmi.</p>

      <div className="rounded-2xl p-4 mb-4" style={{ background: T.card, border: `1px solid ${T.line}` }}>
        <div className="flex gap-2 mb-4">
          {Object.keys(COUNTRY_INFO).map((c) => (
            <Chip key={c} active={calc.country === c} color={COUNTRY_INFO[c].color} onClick={() => switchCountry(c)}>{c}</Chip>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs block mb-1" style={{ color: T.inkSoft }}>Jam kerja/minggu</label>
            <input type="number" min="0" aria-label="Jam kerja per minggu" value={calc.hoursPerWeek} onChange={(e) => setCalc({ ...calc, hoursPerWeek: Number(e.target.value) })}
              className="w-full rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: T.inkSoft }}>Upah kotor/jam ({cInfo.currency})</label>
            <input type="number" min="0" aria-label="Upah kotor per jam" value={calc.hourlyWage} onChange={(e) => setCalc({ ...calc, hourlyWage: Number(e.target.value) })}
              className="w-full rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
          </div>
        </div>
        <p className="text-xs mb-3" style={{ color: T.inkSoft }}>{cInfo.minWageNote}</p>

        <label className="text-xs block mb-1" style={{ color: T.inkSoft }}>
          Perkiraan potongan pajak: <span style={{ color: T.teal, fontWeight: 600 }}>{calc.taxPct}%</span>
        </label>
        <input type="range" min={0} max={35} value={calc.taxPct} onChange={(e) => setCalc({ ...calc, taxPct: Number(e.target.value) })} className="w-full mb-1" />
        <p className="text-xs flex items-center gap-1" style={{ color: T.inkSoft }}>
          <ExternalLink size={11} /> Untuk angka akurat, cek {officialCalc[calc.country]}.
        </p>
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ background: T.ink }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs" style={{ color: T.onDarkSoft }}>Estimasi gaji bersih/minggu</div>
            <div className="text-2xl font-bold" style={{ color: "#fff", fontFamily: F.display }}>{fmt(netWeekly)}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: T.onDarkSoft }}>Total estimasi biaya hidup/minggu</div>
            <div className="text-2xl font-bold" style={{ color: "#fff", fontFamily: F.display }}>{fmt(totalCosts)}</div>
          </div>
        </div>
        <div className="h-px my-3" style={{ background: T.darkLine }} />
        <div className="flex items-center gap-2">
          {surplus >= 0 ? <TrendingUp size={16} color={T.amber} /> : <TrendingDown size={16} color={T.coral} />}
          <span className="font-semibold" style={{ color: surplus >= 0 ? T.amber : T.coralOnDark }}>
            {surplus >= 0 ? "Surplus" : "Defisit"} {fmt(Math.abs(surplus))}/minggu
          </span>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ background: T.card, border: `1px solid ${T.line}` }}>
        <div className="text-sm font-semibold mb-3" style={{ color: T.ink }}>Rincian biaya hidup mingguan (contoh, edit sesuai kotamu)</div>
        <div className="space-y-3">
          {COST_LABELS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon size={16} color={T.inkSoft} style={{ flexShrink: 0 }} />
              <span className="text-sm flex-1" style={{ color: T.inkSoft }}>{label}</span>
              <input type="number" min="0" aria-label={label} value={calc.costs[key]} onChange={(e) => setCost(key, e.target.value)}
                className="w-24 rounded-lg px-2 py-1.5 text-sm border text-right" style={{ borderColor: T.line }} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 flex gap-2 items-start" style={{ background: T.blueBg, border: `1px solid ${T.blueLine}` }}>
        <Droplet size={16} color={T.blueFg} style={{ marginTop: 2, flexShrink: 0 }} />
        <div className="text-xs" style={{ color: T.blueFg }}>
          <b>Studi kasus air minum {cInfo.name}:</b> {cInfo.waterNote}
        </div>
      </div>
    </div>
  );
}

/* ============================== CV TEMPLATE & INTERVIEW SIM ============================== */
function CvInterviewPrep() {
  const [category, setCategory] = useState(JOB_CATEGORIES[0]);
  const [copied, setCopied] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const tpl = CV_TEMPLATES[category];
  const questions = INTERVIEW_BANK[category];
  const q = questions[qIndex % questions.length];

  const cvText = `SUMMARY\n${tpl.summary}\n\nEXPERIENCE HIGHLIGHTS\n${tpl.bullets.map((b) => "- " + b).join("\n")}\n\nSKILLS\n${tpl.skills.join(", ")}`;

  const copyText = () => {
    navigator.clipboard.writeText(cvText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const nextQuestion = () => { setQIndex((i) => i + 1); setShowTip(false); };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>Template CV & Simulasi Wawancara</h2>
      <p className="text-sm mb-4" style={{ color: T.inkSoft }}>Pilih kategori kerjaan yang kamu incar.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {JOB_CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} color={T.teal} onClick={() => { setCategory(c); setQIndex(0); setShowTip(false); }}>{c}</Chip>
        ))}
      </div>

      <div className="rounded-2xl p-4 mb-5" style={{ background: T.card, border: `1px solid ${T.line}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: T.ink }}><FileText size={15} /> Kerangka CV (Bahasa Inggris)</div>
          <button onClick={copyText} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: copied ? T.teal : T.paperDim, color: copied ? "#fff" : T.inkSoft }}>
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
        <pre className="text-xs whitespace-pre-wrap p-3 rounded-lg" style={{ background: T.paperDim, color: T.ink, fontFamily: F.mono }}>{cvText}</pre>
        <p className="text-[11px] mt-2 italic" style={{ color: T.inkSoft }}>Ganti bagian [dalam kurung] dengan angka/detail nyata dari pengalamanmu. Tempel ke Word/Google Docs untuk merapikan format.</p>
      </div>

      <div className="rounded-2xl p-4" style={{ background: T.card, border: `1px solid ${T.line}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: T.ink }}><MessageCircle size={15} /> Simulasi Wawancara</div>
          <span className="text-xs" style={{ color: T.inkSoft }}>{(qIndex % questions.length) + 1}/{questions.length}</span>
        </div>
        <div className="rounded-xl p-4 mb-3" style={{ background: T.ink }}>
          <p className="font-medium" style={{ color: "#fff" }}>{q.q}</p>
        </div>
        {showTip ? (
          <div className="rounded-lg p-3 mb-3 text-sm" style={{ background: T.tealBg, color: T.teal }}>{q.tip}</div>
        ) : (
          <button onClick={() => setShowTip(true)} className="text-sm mb-3 flex items-center gap-1" style={{ color: T.teal }}>Lihat tips jawaban <ChevronDown size={14} /></button>
        )}
        <button onClick={nextQuestion} className="w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: T.amber, color: T.ink }}>
          Pertanyaan berikutnya <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ArrivalChecklist() {
  const [state, setState] = usePersistentState("arrival-checklist", { NZ: {}, AU: {}, TW: {} });
  const [country, setCountry] = useState("NZ");
  const items = CHECKLIST_ITEMS[country];
  const done = items.filter((i) => state[country]?.[i.id]).length;

  const toggle = (id) => {
    setState({ ...state, [country]: { ...state[country], [id]: !state[country]?.[id] } });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>Checklist Kedatangan</h2>
      <p className="text-sm mb-4" style={{ color: T.inkSoft }}>Progres tersimpan otomatis di perangkatmu.</p>

      <div className="flex gap-2 mb-4">
        {Object.keys(COUNTRY_INFO).map((c) => (
          <Chip key={c} active={country === c} color={COUNTRY_INFO[c].color} onClick={() => setCountry(c)}>{c}</Chip>
        ))}
      </div>

      <div className="rounded-xl p-3 mb-4 flex items-center gap-3" style={{ background: T.paperDim }}>
        <CircularScore value={(done / items.length) * 100} size={56} color={T.teal} />
        <div className="text-sm" style={{ color: T.ink }}>{done} dari {items.length} langkah selesai untuk {COUNTRY_INFO[country].name}</div>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const checked = !!state[country]?.[item.id];
          return (
            <label key={item.id} className="flex items-start gap-3 rounded-xl p-3 cursor-pointer" style={{ background: T.card, border: `1px solid ${T.line}` }}>
              <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} className="mt-1" />
              <div>
                <div className="text-sm font-medium" style={{ color: checked ? T.inkSoft : T.ink, textDecoration: checked ? "line-through" : "none" }}>{item.label}</div>
                <div className="text-xs" style={{ color: T.inkSoft }}>{item.desc}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== KANBAN PELACAK LAMARAN ============================== */
function KanbanBoard() {
  const [board, setBoard] = usePersistentState("kanban-cards", { cards: [] });
  const [form, setForm] = useState({ title: "", company: "", country: "NZ" });
  const dragId = useRef(null);

  const addCard = () => {
    if (!form.title) return;
    const card = { id: `k-${Date.now()}`, title: form.title, company: form.company, country: form.country, stage: KANBAN_STAGES[0] };
    setBoard({ cards: [card, ...board.cards] });
    setForm({ title: "", company: "", country: "NZ" });
  };
  const removeCard = (id) => setBoard({ cards: board.cards.filter((c) => c.id !== id) });
  const moveCard = (id, stage) => setBoard({ cards: board.cards.map((c) => (c.id === id ? { ...c, stage } : c)) });

  const onDrop = (stage) => {
    if (dragId.current) {
      moveCard(dragId.current, stage);
      dragId.current = null;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>Pelacak Lamaran</h2>
      <p className="text-sm mb-4" style={{ color: T.inkSoft }}>Seret kartu antar kolom, atau pakai tombol panah di tiap kartu. Tersimpan otomatis.</p>

      <div className="rounded-2xl p-4 mb-5" style={{ background: T.card, border: `1px solid ${T.line}` }}>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input type="text" placeholder="Posisi (mis. Barista)" aria-label="Posisi (mis. Barista)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
          <input type="text" placeholder="Nama tempat" aria-label="Nama tempat" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
          <select aria-label="Negara" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }}>
            {Object.keys(COUNTRY_INFO).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={addCard} className="flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg" style={{ background: T.ink, color: "#fff" }}>
          <Plus size={14} /> Tambah lamaran
        </button>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {KANBAN_STAGES.map((stage) => (
          <div key={stage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(stage)}
            className="rounded-2xl p-2 min-h-[120px]" style={{ background: T.paperDim }}>
            <div className="text-xs font-semibold px-2 py-1 mb-2" style={{ color: T.inkSoft }}>{stage} ({board.cards.filter((c) => c.stage === stage).length})</div>
            <div className="space-y-2">
              {board.cards.filter((c) => c.stage === stage).map((c) => (
                <div key={c.id}
                  draggable
                  onDragStart={() => { dragId.current = c.id; }}
                  className="rounded-xl p-2.5 cursor-move" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <div className="text-xs font-semibold" style={{ color: T.ink }}>{c.title}</div>
                      <div className="text-[11px]" style={{ color: T.inkSoft }}>{c.company} · {c.country}</div>
                    </div>
                    <button onClick={() => removeCard(c.id)} aria-label={`Hapus lamaran ${c.title}`}><Trash2 size={12} color={T.inkSoft} /></button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {KANBAN_STAGES.indexOf(stage) > 0 && (
                      <button onClick={() => moveCard(c.id, KANBAN_STAGES[KANBAN_STAGES.indexOf(stage) - 1])} aria-label="Pindah ke tahap sebelumnya" className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: T.paperDim, color: T.inkSoft }}>← </button>
                    )}
                    {KANBAN_STAGES.indexOf(stage) < KANBAN_STAGES.length - 1 && (
                      <button onClick={() => moveCard(c.id, KANBAN_STAGES[KANBAN_STAGES.indexOf(stage) + 1])} aria-label="Pindah ke tahap berikutnya" className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: T.paperDim, color: T.inkSoft }}> →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== CEK REPUTASI ASLI (live, pakai internet) ============================== */
function RealReviewSearch() {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const search = async () => {
    if (!companyName.trim()) return;
    if (!apiKey.trim()) { setError("Isi API key Anthropic kamu dulu (lihat catatan di bawah kolom)."); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Cari informasi dan ulasan terkini di internet tentang tempat kerja ini: "${companyName}"${city ? ", di " + city : ""}. Fokus ke reputasi sebagai TEMPAT KERJA (bukan sebagai bisnis konsumen): budaya kerja, keluhan soal upah/jam kerja, keamanan kerja, dan sentimen umum karyawan. Balas HANYA dalam format JSON valid tanpa markdown, dengan struktur persis: {"found": boolean, "summary": "ringkasan singkat 2-3 kalimat dalam Bahasa Indonesia", "positives": ["poin1","poin2"], "concerns": ["poin1","poin2"], "sourcesNote": "catatan singkat jenis sumber yang ditemukan, dalam Bahasa Indonesia"}. Jika tidak ditemukan informasi relevan, set found:false dan jelaskan singkat di summary.`,
            },
          ],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });
      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`API error ${response.status}: ${errBody.slice(0, 200)}`);
      }
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").filter(Boolean).join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError(`Gagal mengambil data: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 mb-5" style={{ background: T.card, border: `1px solid ${T.line}` }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: T.ink }}>
          <Globe size={15} color={T.teal} /> Cek Reputasi Tempat Kerja Asli (pakai internet)
        </span>
        <ChevronDown size={16} color={T.inkSoft} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div className="mt-3">
          <p className="text-xs mb-3" style={{ color: T.inkSoft }}>
            Beda dari lowongan contoh di atas — ini pencarian <b>live</b> ke internet untuk nama tempat kerja <b>sungguhan</b> yang kamu incar. Butuh koneksi internet dan sedikit pemakaian API (tidak seperti fitur lain di app ini yang 100% offline).
          </p>
          <input type="password" placeholder="Anthropic API key kamu (sk-ant-...)" aria-label="Anthropic API key kamu (sk-ant-...)" value={apiKey}
            onChange={(e) => setApiKey(e.target.value)} className="w-full rounded-lg px-2 py-2 text-sm border mb-2" style={{ borderColor: T.line }} />
          <p className="text-[11px] mb-2" style={{ color: T.inkSoft }}>
            ⚠️ Khusus untuk kamu jalankan sendiri di komputermu (localhost). Key ini hanya disimpan di memori tab browser saat ini (tidak disimpan permanen), tapi <b>jangan pernah</b> pakai kolom seperti ini di situs yang kamu deploy publik — orang lain bisa melihat key-nya lewat DevTools. Buat key baru di{" "}
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" style={{ color: T.teal, textDecoration: "underline" }}>console.anthropic.com</a>.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input type="text" placeholder="Nama tempat kerja (mis. nama kafe/toko asli)" aria-label="Nama tempat kerja (mis. nama kafe/toko asli)" value={companyName}
              onChange={(e) => setCompanyName(e.target.value)} className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
            <input type="text" placeholder="Kota (opsional)" aria-label="Kota (opsional)" value={city}
              onChange={(e) => setCity(e.target.value)} className="rounded-lg px-2 py-2 text-sm border" style={{ borderColor: T.line }} />
          </div>
          <button onClick={search} disabled={loading} className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg" style={{ background: T.ink, color: "#fff", opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} {loading ? "Mencari..." : "Cari"}
          </button>

          {error && <p className="text-xs mt-3" style={{ color: T.coral }}>{error}</p>}

          {result && (
            <div className="mt-3 rounded-xl p-3" style={{ background: T.paperDim }}>
              {!result.found ? (
                <p className="text-sm" style={{ color: T.inkSoft }}>{result.summary}</p>
              ) : (
                <>
                  <p className="text-sm mb-3" style={{ color: T.ink }}>{result.summary}</p>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <div className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: T.teal }}><ThumbsUp size={12} /> Positif</div>
                      <ul className="text-xs space-y-1" style={{ color: T.inkSoft }}>
                        {(result.positives || []).map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: T.coral }}><ThumbsDown size={12} /> Perhatikan</div>
                      <ul className="text-xs space-y-1" style={{ color: T.inkSoft }}>
                        {(result.concerns || []).map((c, i) => <li key={i}>• {c}</li>)}
                      </ul>
                    </div>
                  </div>
                  <p className="text-[11px] italic" style={{ color: T.inkSoft }}>{result.sourcesNote}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================== MAIN APP ============================== */
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [hasProfile, setHasProfile] = useState(false);
  const [openJob, setOpenJob] = useState(null);
  const [filters, setFilters] = useState({ countries: ["NZ", "AU", "TW"], industry: "Semua", onlyHiring: false });

  const industries = useMemo(() => ["Semua", ...new Set(JOBS.map((j) => j.industry))], []);

  const filteredJobs = useMemo(() => {
    return JOBS.filter((j) =>
      filters.countries.includes(j.country) &&
      (filters.industry === "Semua" || j.industry === filters.industry) &&
      (!filters.onlyHiring || j.status === "Sedang Merekrut")
    );
  }, [filters]);

  const ranked = useMemo(() => {
    if (!hasProfile) return [];
    return JOBS.map((j) => ({ job: j, match: computeMatch(j, profile) }))
      .sort((a, b) => b.match.total - a.match.total);
  }, [hasProfile, profile]);

  const flaggedJobs = JOBS.filter((j) => j.flagged);

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: Compass },
    { id: "cari", label: "Cari Kerja", icon: Search },
    { id: "profil", label: "Profil & Kecocokan", icon: User },
    { id: "rekomendasi", label: "Rekomendasi", icon: Sparkles },
    { id: "jamgaji", label: "Jam & Gaji", icon: Wallet },
    { id: "persiapan", label: "Persiapan", icon: GraduationCap },
    { id: "lamaran", label: "Lamaran", icon: Trello },
    { id: "peringatan", label: "Peringatan", icon: AlertTriangle },
  ];

  const [jamGajiSub, setJamGajiSub] = useState("jam");
  const [persiapanSub, setPersiapanSub] = useState("cv");

  return (
    <div style={{ background: T.paper, minHeight: "100%", fontFamily: F.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        input[type=range] { accent-color: ${T.teal}; }
      `}</style>

      {/* HEADER */}
      <div className="border-b sticky top-0 z-20" style={{ borderColor: T.line, background: T.paper }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: T.ink }}>
              <Compass size={18} color={T.amber} />
            </div>
            <div>
              <div className="font-bold leading-tight" style={{ fontFamily: F.display, color: T.ink }}>Kompas Kerja</div>
              <div className="text-[11px] leading-tight" style={{ color: T.inkSoft }}>NZ · AU · Taiwan — untuk pelajar Indonesia</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-full" style={{ background: T.paperDim, color: T.inkSoft }}>
            <Ticket size={13} /> {JOBS.length} lowongan contoh
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-2">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} aria-current={active ? "page" : undefined}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-colors"
                style={{ background: active ? T.ink : "transparent", color: active ? "#fff" : T.inkSoft, fontWeight: active ? 600 : 400 }}>
                <Icon size={15} /> {n.label}
                {n.id === "peringatan" && flaggedJobs.length > 0 && (
                  <span className="text-[10px] px-1.5 rounded-full" style={{ background: T.coral, color: "#fff" }}>{flaggedJobs.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* DISCLAIMER */}
        <div className="rounded-xl p-3 mb-6 flex gap-2 items-start" style={{ background: T.noteBg, border: `1px solid ${T.noteLine}` }}>
          <Info size={15} color={T.amberDeep} style={{ marginTop: 2, flexShrink: 0 }} />
          <p className="text-xs" style={{ color: T.noteFg }}>
            Prototipe demo — daftar lowongan, ulasan, dan skor sentimen di bawah adalah <b>data contoh</b> untuk menunjukkan cara kerja fitur, bukan lowongan nyata.
          </p>
        </div>

        {/* ================= DASHBOARD ================= */}
        {tab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: F.display, color: T.ink }}>
              Satu kompas, tiga negara tujuan.
            </h1>
            <p className="mb-6 max-w-xl" style={{ color: T.inkSoft }}>
              Temukan kerja part-time & full-time di Selandia Baru, Australia, dan Taiwan — lengkap dengan estimasi gaji, jam shift, reputasi tempat kerja, dan seberapa cocok dengan gaya kerjamu.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {Object.values(COUNTRY_INFO).map((c) => {
                const count = JOBS.filter((j) => j.country === c.code).length;
                return (
                  <div key={c.code} className="rounded-2xl p-4" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                    <div className="text-xs font-bold px-2 py-0.5 rounded inline-block mb-2" style={{ background: c.color, color: "#fff" }}>{c.code}</div>
                    <div className="font-semibold mb-1" style={{ color: T.ink }}>{c.name}</div>
                    <div className="text-2xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>{count}</div>
                    <div className="text-xs" style={{ color: T.inkSoft }}>lowongan · maks {c.visaCapLabel}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: T.ink, fontFamily: F.display }}>
                <ScanLine size={18} /> Papan Keberangkatan Lowongan
              </h2>
              <button onClick={() => setTab("cari")} className="text-sm flex items-center gap-1" style={{ color: T.teal }}>
                Lihat semua <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid gap-3">
              {JOBS.slice(0, 4).map((j) => (
                <JobCard key={j.id} job={j} onOpen={setOpenJob} matchScore={hasProfile ? computeMatch(j, profile).total : undefined} />
              ))}
            </div>
          </div>
        )}

        {/* ================= CARI KERJA ================= */}
        {tab === "cari" && (
          <div>
            <RealReviewSearch />
            <div className="rounded-2xl p-4 mb-5" style={{ background: T.card, border: `1px solid ${T.line}` }}>
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold" style={{ color: T.ink }}><SlidersHorizontal size={15} /> Filter</div>
              <div className="mb-3">
                <div className="text-xs mb-1.5" style={{ color: T.inkSoft }}>Negara</div>
                <div className="flex gap-2">
                  {Object.keys(COUNTRY_INFO).map((c) => (
                    <Chip key={c} active={filters.countries.includes(c)} color={COUNTRY_INFO[c].color}
                      onClick={() => setFilters({ ...filters, countries: filters.countries.includes(c) ? filters.countries.filter((x) => x !== c) : [...filters.countries, c] })}>
                      {c}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs mb-1.5" style={{ color: T.inkSoft }}>Industri</div>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <Chip key={ind} active={filters.industry === ind} color={T.teal} onClick={() => setFilters({ ...filters, industry: ind })}>{ind}</Chip>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: T.inkSoft }}>
                <input type="checkbox" checked={filters.onlyHiring} onChange={(e) => setFilters({ ...filters, onlyHiring: e.target.checked })} />
                Hanya tampilkan yang sedang merekrut
              </label>
            </div>

            <div className="text-sm mb-3" style={{ color: T.inkSoft }}>{filteredJobs.length} lowongan ditemukan</div>
            <div className="grid gap-3">
              {filteredJobs.map((j) => (
                <JobCard key={j.id} job={j} onOpen={setOpenJob} matchScore={hasProfile ? computeMatch(j, profile).total : undefined} />
              ))}
              {filteredJobs.length === 0 && (
                <div className="text-center py-10 text-sm" style={{ color: T.inkSoft }}>Tidak ada lowongan yang cocok dengan filter ini.</div>
              )}
            </div>
          </div>
        )}

        {/* ================= PROFIL ================= */}
        {tab === "profil" && (
          <ProfileForm profile={profile} setProfile={setProfile} onSubmit={() => { setHasProfile(true); setTab("rekomendasi"); }} />
        )}

        {/* ================= REKOMENDASI ================= */}
        {tab === "rekomendasi" && (
          <div>
            {!hasProfile ? (
              <div className="text-center py-16">
                <User size={36} color={T.inkSoft} className="mx-auto mb-3" />
                <p className="mb-4" style={{ color: T.inkSoft }}>Isi profil kerjamu dulu supaya kami bisa hitung kecocokannya.</p>
                <button onClick={() => setTab("profil")} className="px-4 py-2 rounded-xl font-semibold" style={{ background: T.ink, color: "#fff" }}>Isi Profil Sekarang</button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ fontFamily: F.display, color: T.ink }}>Rekomendasi Terurut untukmu</h2>
                <div className="grid gap-3">
                  {ranked.map(({ job, match }, i) => (
                    <div key={job.id} className="relative">
                      {i < 3 && (
                        <span className="absolute -top-2 -left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: T.amber, color: T.ink }}>
                          TOP {i + 1}
                        </span>
                      )}
                      <JobCard job={job} onOpen={setOpenJob} matchScore={match.total} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= JAM & GAJI ================= */}
        {tab === "jamgaji" && (
          <div>
            <div className="flex gap-2 mb-5">
              <Chip active={jamGajiSub === "jam"} color={T.teal} onClick={() => setJamGajiSub("jam")}>Pelacak Jam Kerja</Chip>
              <Chip active={jamGajiSub === "kalkulator"} color={T.teal} onClick={() => setJamGajiSub("kalkulator")}>Kalkulator Biaya Hidup</Chip>
            </div>
            {jamGajiSub === "jam" ? <HoursTracker profile={profile} /> : <CostCalculator />}
          </div>
        )}

        {/* ================= PERSIAPAN ================= */}
        {tab === "persiapan" && (
          <div>
            <div className="flex gap-2 mb-5">
              <Chip active={persiapanSub === "cv"} color={T.teal} onClick={() => setPersiapanSub("cv")}>CV & Wawancara</Chip>
              <Chip active={persiapanSub === "checklist"} color={T.teal} onClick={() => setPersiapanSub("checklist")}>Checklist Kedatangan</Chip>
            </div>
            {persiapanSub === "cv" ? <CvInterviewPrep /> : <ArrivalChecklist />}
          </div>
        )}

        {/* ================= LAMARAN ================= */}
        {tab === "lamaran" && <KanbanBoard />}

        {/* ================= PERINGATAN ================= */}
        {tab === "peringatan" && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: F.display, color: T.ink }}>Peringatan Komunitas</h2>
            <p className="text-sm mb-5" style={{ color: T.inkSoft }}>Lowongan dengan sinyal ulasan negatif yang meningkat di media sosial & Google Maps.</p>

            <div className="grid gap-3 mb-8">
              {flaggedJobs.map((j) => (
                <div key={j.id} className="rounded-2xl p-4 flex gap-3" style={{ background: T.alertBg, border: `1px solid ${T.alertLine}` }}>
                  <AlertTriangle size={20} color={T.coral} style={{ flexShrink: 0 }} />
                  <div>
                    <div className="font-semibold" style={{ color: T.ink }}>{j.title} — {j.company}</div>
                    <div className="text-xs mb-1" style={{ color: T.inkSoft }}>{COUNTRY_INFO[j.country].name} · {j.city}</div>
                    <p className="text-sm" style={{ color: T.alertFg }}>{j.flagReason}</p>
                    <button onClick={() => setOpenJob(j)} className="text-xs mt-2 flex items-center gap-1" style={{ color: T.teal }}>Lihat detail <ChevronRight size={12} /></button>
                  </div>
                </div>
              ))}
              {flaggedJobs.length === 0 && <p className="text-sm" style={{ color: T.inkSoft }}>Tidak ada peringatan aktif saat ini.</p>}
            </div>

            <div className="rounded-2xl p-4" style={{ background: T.card, border: `1px solid ${T.line}` }}>
              <div className="font-semibold mb-2 flex items-center gap-2" style={{ color: T.ink }}><Shield size={16} /> Tips Keamanan Kerja</div>
              <ul className="text-sm space-y-1.5" style={{ color: T.inkSoft }}>
                <li>• Jangan pernah bayar biaya untuk "jaminan diterima kerja" — ini ciri khas penipuan.</li>
                <li>• Selalu cek ulasan dari lebih dari satu platform sebelum melamar.</li>
                <li>• Simpan bukti jam kerja & slip gaji — berguna kalau ada sengketa upah.</li>
                <li>• NZ: laporkan eksploitasi lewat Immigration New Zealand, dilindungi Worker Protection Act.</li>
                <li>• Australia: Assurance Protocol melindungi pelapor eksploitasi dari pembatalan visa.</li>
                <li>• Taiwan: pastikan kamu punya izin kerja resmi sebelum mulai bekerja untuk menghindari denda.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {openJob && <JobDetail job={openJob} onClose={() => setOpenJob(null)} profile={profile} hasProfile={hasProfile} />}
    </div>
  );
}
