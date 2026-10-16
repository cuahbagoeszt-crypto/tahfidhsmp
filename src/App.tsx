// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';

// Injeksi CSS Kritis ke document.head agar frame pertama selalu rapi & terpusat simetris
if (typeof document !== 'undefined') {
  // Set Judul Tab Browser & Favicon logo.png
  document.title = 'Sistem Tahfidh Putra';
  
  let linkIcon = document.querySelector("link[rel~='icon']");
  if (!linkIcon) {
    linkIcon = document.createElement('link');
    linkIcon.rel = 'icon';
    document.head.appendChild(linkIcon);
  }
  linkIcon.href = '/logo.png';

  if (!document.getElementById('tahfidh-critical-css')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'tahfidh-critical-css';
    styleEl.innerHTML = `
      html, body, #root {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        min-width: 100% !important;
        max-width: 100% !important;
        min-height: 100vh !important;
        height: 100% !important;
        box-sizing: border-box !important;
        background-color: #022c22 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        display: flex !important;
        flex-direction: column !important;
      }
      *, *::before, *::after {
        box-sizing: border-box !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  if (!document.getElementById('tailwind-cdn')) {
    const twScript = document.createElement('script');
    twScript.id = 'tailwind-cdn';
    twScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(twScript);
  }
  if (!document.getElementById('supabase-js-cdn')) {
    const sbScript = document.createElement('script');
    sbScript.id = 'supabase-js-cdn';
    sbScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    sbScript.async = true;
    document.head.appendChild(sbScript);
  }
  if (!document.getElementById('sheetjs-cdn')) {
    const xlsxScript = document.createElement('script');
    xlsxScript.id = 'sheetjs-cdn';
    xlsxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    xlsxScript.async = true;
    document.head.appendChild(xlsxScript);
  }
}

const createIcon = (svgContent: string) => ({ size = 20, className = '', ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    dangerouslySetInnerHTML={{ __html: svgContent }}
    {...props}
  />
);

const BookOpen = createIcon('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>');
const LogOut = createIcon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>');
const Save = createIcon('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>');
const User = createIcon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>');
const Users = createIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>');
const Trash2 = createIcon('<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>');
const ShieldCheck = createIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>');
const X = createIcon('<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>');
const ArrowLeft = createIcon('<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>');
const Pencil = createIcon('<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>');
const Check = createIcon('<polyline points="20 6 9 17 4 12"></polyline>');
const History = createIcon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path>');
const Calendar = createIcon('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>');
const Filter = createIcon('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>');
const Target = createIcon('<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>');
const Medal = createIcon('<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>');
const RefreshCw = createIcon('<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>');
const ChevronRight = createIcon('<polyline points="9 18 15 12 9 6"></polyline>');
const Activity = createIcon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>');
const Sliders = createIcon('<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>');
const ArrowUpDown = createIcon('<path d="m21 16-4 4-4-4"></path><path d="M17 20V4"></path><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path>');
const Upload = createIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>');
const Download = createIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>');
const FileSpreadsheet = createIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>');
const ExternalLink = createIcon('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>');
const Printer = createIcon('<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>');
const Plus = createIcon('<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>');
const Menu = createIcon('<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>');

const SUPABASE_URL = 'https://nkirqdfmppziridabvwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raXJxZGZtcHB6aXJpZGFidndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MDU5MDgsImV4cCI6MjEwNDQ4MTkwOH0.ctqZ3aw4j9_jSBI9uF2NO2YWJ1PpeM2yo_HU-yZUjXI';

let supabaseClientInstance: any = null;

const getSupabase = async () => {
  if (supabaseClientInstance) return supabaseClientInstance;
  if (typeof window !== 'undefined' && (window as any).supabase?.createClient) {
    supabaseClientInstance = (window as any).supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClientInstance;
  }
  return new Promise((resolve) => {
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof window !== 'undefined' && (window as any).supabase?.createClient) {
        clearInterval(checkInterval);
        supabaseClientInstance = (window as any).supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        resolve(supabaseClientInstance);
      } else if (attempts > 80) {
        clearInterval(checkInterval);
        resolve(null);
      }
    }, 100);
  });
};

const getXLSX = async (): Promise<any> => {
  if (typeof window !== 'undefined' && (window as any).XLSX) {
    return (window as any).XLSX;
  }
  return new Promise((resolve) => {
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof window !== 'undefined' && (window as any).XLSX) {
        clearInterval(checkInterval);
        resolve((window as any).XLSX);
      } else if (attempts > 80) {
        clearInterval(checkInterval);
        resolve(null);
      }
    }, 100);
  });
};

const POJOK_PER_JUZ = 20;

const DAFTAR_BULAN = [
  { kode: '07', nama: 'Juli' },
  { kode: '08', nama: 'Agustus' },
  { kode: '09', nama: 'September' },
  { kode: '10', nama: 'Oktober' },
  { kode: '11', nama: 'November' },
  { kode: '12', nama: 'Desember' },
  { kode: '01', nama: 'Januari' },
  { kode: '02', nama: 'Februari' },
  { kode: '03', nama: 'Maret' },
  { kode: '04', nama: 'April' },
  { kode: '05', nama: 'Mei' },
  { kode: '06', nama: 'Juni' },
  { kode: 'all', nama: 'Satu Tahun Penuh' }
];

const DAFTAR_KELAS = ['7', '8', '9', '10', '11', '12'];

// Target Lembaga Standar Mulai Juz 1 Pojok 1
const DefaultTargetLembaga: Record<string, Record<string, { j: number; p: number }>> = {
  "07": { "7": {j: 1, p: 6}, "8": {j: 6, p: 6}, "9": {j: 11, p: 6}, "10": {j: 16, p: 6}, "11": {j: 21, p: 6}, "12": {j: 26, p: 6} },
  "08": { "7": {j: 1, p: 15},"8": {j: 6, p: 15},"9": {j: 11, p: 15},"10": {j: 16, p: 15},"11": {j: 21, p: 15},"12": {j: 26, p: 15} },
  "09": { "7": {j: 2, p: 5}, "8": {j: 7, p: 5}, "9": {j: 12, p: 5}, "10": {j: 17, p: 5}, "11": {j: 22, p: 5}, "12": {j: 27, p: 5} },
  "10": { "7": {j: 2, p: 16},"8": {j: 7, p: 16},"9": {j: 12, p: 16},"10": {j: 17, p: 16},"11": {j: 22, p: 16},"12": {j: 27, p: 16} },
  "11": { "7": {j: 3, p: 7}, "8": {j: 8, p: 7}, "9": {j: 13, p: 7}, "10": {j: 18, p: 7}, "11": {j: 23, p: 7}, "12": {j: 28, p: 7} },
  "12": { "7": {j: 3, p: 18},"8": {j: 8, p: 18},"9": {j: 13, p: 18},"10": {j: 18, p: 18},"11": {j: 23, p: 18},"12": {j: 28, p: 18} },
  "01": { "7": {j: 4, p: 4}, "8": {j: 9, p: 4}, "9": {j: 14, p: 4}, "10": {j: 19, p: 4}, "11": {j: 24, p: 4}, "12": {j: 29, p: 4} },
  "02": { "7": {j: 4, p: 12},"8": {j: 9, p: 12},"9": {j: 14, p: 12},"10": {j: 19, p: 12},"11": {j: 24, p: 12},"12": {j: 29, p: 12} },
  "03": { "7": {j: 4, p: 18},"8": {j: 9, p: 18},"9": {j: 14, p: 18},"10": {j: 19, p: 18},"11": {j: 24, p: 18},"12": {j: 29, p: 18} },
  "04": { "7": {j: 5, p: 5}, "8": {j: 10, p: 5},"9": {j: 15, p: 5}, "10": {j: 20, p: 5}, "11": {j: 25, p: 5}, "12": {j: 30, p: 5} },
  "05": { "7": {j: 5, p: 14},"8": {j: 10, p: 14},"9": {j: 15, p: 14},"10": {j: 20, p: 14},"11": {j: 25, p: 14},"12": {j: 30, p: 14} },
  "06": { "7": {j: 5, p: 20},"8": {j: 10, p: 20},"9": {j: 15, p: 20},"10": {j: 20, p: 20},"11": {j: 25, p: 20},"12": {j: 30, p: 20} },
  "all":{ "7": {j: 5, p: 20},"8": {j: 10, p: 20},"9": {j: 15, p: 20},"10": {j: 20, p: 20},"11": {j: 25, p: 20},"12": {j: 30, p: 20} }
};

// Target Standar Pojokan (Ziyadah Baru) per Bulan & Kelas (Default: 20 Pojokan / 1 Juz per bulan)
const DefaultTargetPojokan: Record<string, Record<string, number>> = {
  "07": { "7": 15, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "08": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "09": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "10": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "11": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "12": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "01": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "02": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "03": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "04": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "05": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "06": { "7": 20, "8": 20, "9": 20, "10": 20, "11": 20, "12": 20 },
  "all": { "7": 240, "8": 240, "9": 240, "10": 240, "11": 240, "12": 240 }
};

// Target Standar Deresan (Muroja'ah) per Bulan & Kelas (Default: 20-40 Pojokan per bulan)
const DefaultTargetDeresan: Record<string, Record<string, number>> = {
  "07": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "08": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "09": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "10": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "11": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "12": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "01": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "02": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "03": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "04": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "05": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "06": { "7": 20, "8": 30, "9": 30, "10": 40, "11": 40, "12": 40 },
  "all": { "7": 240, "8": 360, "9": 360, "10": 480, "11": 480, "12": 480 }
};

const safeExtractNum = (str) => {
  if (str === null || str === undefined) return 0;
  const s = String(str).trim().replace(',', '.');
  const match = s.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

// Start Juz 1 Pojok 1 = 1
const getAbsolutePojok = (juz, pojok) => {
  const j = parseInt(juz, 10) || 0;
  const p = parseFloat(pojok) || 0;
  if (j >= 1 && j <= 30) {
    const validPojok = Math.max(0, Math.min(p, POJOK_PER_JUZ));
    return (j - 1) * POJOK_PER_JUZ + validPojok;
  }
  return 0;
};

const getJuzPojokFromAbsolute = (abs: number) => {
  if (abs <= 0) return { j: 0, p: 0 };
  const safeAbs = Math.min(abs, 30 * POJOK_PER_JUZ);
  const j = Math.ceil(safeAbs / POJOK_PER_JUZ);
  let p = safeAbs % POJOK_PER_JUZ;
  if (p === 0) p = POJOK_PER_JUZ;
  return { j, p };
};

const TOTAL_POJOK_QURAN = 30 * POJOK_PER_JUZ; // 600 Pojok

const calculateHalamanCount = (
  juzAwal, pojokAwal, juzAkhir, pojokAkhir, kegiatanStr
) => {
  const jA = parseInt(juzAwal, 10);
  const pA = safeExtractNum(pojokAwal);
  const jB = parseInt(juzAkhir, 10);
  const pB = safeExtractNum(pojokAkhir);

  if (jA < 1 || jA > 30 || jB < 1 || jB > 30) return 0;

  // Fungsi helper untuk menerjemahkan angka desimal menjadi koordinat jarak ukur
  const getCoordinate = (juz, pojok, isAwal) => {
    const base = (juz - 1) * POJOK_PER_JUZ;
    if (Number.isInteger(pojok)) {
      // Jika utuh: Awal = batas atas halaman, Akhir = batas bawah halaman
      return isAwal ? base + (pojok - 1) : base + pojok;
    } else {
      // Jika desimal: Posisi dihitung dari pecahan halaman tersebut
      const integerPart = Math.floor(pojok);
      const fractionalPart = pojok - integerPart;
      return base + (integerPart - 1) + fractionalPart;
    }
  };

  const startCoord = getCoordinate(jA, pA, true);
  const endCoord = getCoordinate(jB, pB, false);

  if (startCoord < 0 || endCoord <= 0) return 0;

  const keg = String(kegiatanStr || '').toLowerCase();
  const isMurojaah = keg.includes('muroja') || keg.includes('muraja') || keg.includes('ulang') || keg.includes('deres');

  // Perhitungan normal (Maju)
  if (endCoord >= startCoord) {
    return endCoord - startCoord;
  }

  // Khusus Muroja'ah (Siklus putaran balik ke Juz 1)
  if (isMurojaah) {
    return (TOTAL_POJOK_QURAN - startCoord) + endCoord;
  }

  return Math.abs(endCoord - startCoord);
};
const getDisplayLogHalaman = (log: any): number => {
  // 1. Cek keterangan terlebih dahulu (termasuk desimal seperti 0.75)
  const angkaKet = safeExtractNum(log?.keterangan);
  if (angkaKet > 0) return angkaKet;

  // 2. Jika keterangan kosong / 0, hitung berdasarkan rentang Juz & Pojok
  if (log?.juz_awal && log?.pojok_awal && log?.juz_akhir && log?.pojok_akhir) {
    const calculated = calculateHalamanCount(
      log.juz_awal, 
      log.pojok_awal, 
      log.juz_akhir, 
      log.pojok_akhir, 
      log.kegiatan
    );
    if (calculated > 0) return calculated;
  }

  // 3. Fallback ke database jumlah_halaman
  const raw = parseFloat(String(log?.jumlah_halaman || '0'));
  if (!isNaN(raw) && raw > 0) return raw;

  return 1;
};

const mapKelasTarget = (kelasString: any): string | null => {
  if (!kelasString) return null;
  const s = String(kelasString).toUpperCase().trim();
  if (s.startsWith('12') || s.includes('XII')) return '12';
  if (s.startsWith('11') || s.includes('XI')) return '11';
  if (s.startsWith('10') || s.includes('X-') || s.includes('X ')) return '10';
  if (s.startsWith('9') || s.includes('IX')) return '9';
  if (s.startsWith('8') || s.includes('VIII')) return '8';
  if (s.startsWith('7') || s.includes('VII')) return '7';

  const match = s.match(/\b(7|8|9|10|11|12)\b/);
  if (match) return match[1];
  return null;
};

const DashboardLivePanel = ({
  santriList,
  rawLogs,
  isLoading,
  ustadzList,
  onRefreshLogs,
  customTargetsLembaga,
  customTargetsPojokan,
  customTargetsDeresan
}: any) => {
  const [filterBulan, setFilterBulan] = useState(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth.toString().padStart(2, '0');
  });
  const [filterMode, setFilterMode] = useState<'bulan' | 'rentang'>('bulan'); // fiter rentang waktu
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [filterKelas, setFilterKelas] = useState('all');
  const [filterZiyadah, setFilterZiyadah] = useState('');
  const [targetFilterMode, setTargetFilterMode] = useState<'lembaga' | 'pojokan' | 'deresan'>('lembaga');
  const [activeTab, setActiveTab] = useState<'santri' | 'halaqoh'>('santri');
  const [modalData, setModalData] = useState<any>(null);
  const [sortHalaqohBy, setSortHalaqohBy] = useState('kamar-asc');
  const [sortSantriBy, setSortSantriBy] = useState('nama-asc');
  const [selectedSantriDetail, setSelectedSantriDetail] = useState<any>(null);
  const [santriDetailTimeFilter, setSantriDetailTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  const ustadzKamarMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (Array.isArray(ustadzList)) {
      ustadzList.forEach((u: any) => {
        if (u.nama) {
          const clean = u.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
          map[clean] = u.kamar || '';
        }
      });
    }
    return map;
  }, [ustadzList]);

  const processedData = useMemo(() => {
    if (!santriList.length) return null;

    let filterZiyadahAbs = 0;
    if (filterZiyadah) {
      const parts = filterZiyadah.split(/[\/\,\-\s\.]+/);
      const fJuz = parseInt(parts[0]) || 0;
      const fPojok = parseInt(parts[1]) || 0;
      if (fJuz > 0) filterZiyadahAbs = getAbsolutePojok(fJuz, fPojok);
    }

    const customPojokFilterInput = targetFilterMode === 'pojokan' ? safeExtractNum(filterZiyadah) : 0;
    const customDeresanFilterInput = targetFilterMode === 'deresan' ? safeExtractNum(filterZiyadah) : 0;

    const santriStats: Record<string, any> = {};

    santriList.forEach((s: any) => {
      const kelasTarget = mapKelasTarget(s.kelas);
      if (filterKelas !== 'all' && kelasTarget !== filterKelas) return;

      santriStats[s.id] = {
        ...s,
        kelasTarget,
        maxZiyadahAbs: 0,
        lastJuzZiyadah: 0,
        lastPojokZiyadah: 0,
        totalZiyadahHalamanBulanIni: 0,
        totalMurojaahHalaman: 0,
        totalDeresanA: 0, // Tambahkan ini
        totalDeresanB: 0,
        capaiTargetLembaga: false,
        capaiTargetPojokan: false,
        capaiTargetDeresan: false,
        capaiTarget: false
      };
    });

    if (Array.isArray(rawLogs)) {
      rawLogs.forEach((log: any) => {
        const sId = log.santri_id;
        if (!santriStats[sId]) return;

        const keg = String(log.kegiatan || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const isMurojaah = keg.includes('muroja') || keg.includes('muraja') || keg.includes('ulang') || keg.includes('deres');
        const isZiyadah = keg.includes('ziyadah') || keg === '' || keg.includes('tambah');

        let logMonth = '';
        if (log.tanggal) {
          const parts = log.tanggal.split('-');
          if (parts.length >= 2) logMonth = parts[1];
          else {
            const d = new Date(log.tanggal);
            if (!isNaN(d.getTime())) logMonth = (d.getMonth() + 1).toString().padStart(2, '0');
          }
        }

        // === TAMBAHAN LOGIKA FILTER RENTANG WAKTU ===
        let isValidDate = false;
        if (filterMode === 'rentang' && startDate && endDate) {
          const logDateStr = log.tanggal ? String(log.tanggal).split(' ')[0].split('T')[0] : '';
          if (logDateStr >= startDate && logDateStr <= endDate) {
            isValidDate = true;
          }
        } else {
          isValidDate = (filterBulan === 'all' || logMonth === filterBulan);
        }
        // ============================================

        if (isMurojaah && isValidDate) {
          let hal = 0;
          if (log.juz_awal && log.pojok_awal && log.juz_akhir && log.pojok_akhir) {
            hal = calculateHalamanCount(log.juz_awal, log.pojok_awal, log.juz_akhir, log.pojok_akhir, log.kegiatan);
          }
          if (!hal || hal === 0) {
            const strHalaman = String(log.jumlah_halaman || '0').replace(',', '.');
            hal = parseFloat(strHalaman);
            if (isNaN(hal) || hal === 0) hal = safeExtractNum(strHalaman);
          }
          
          santriStats[sId].totalMurojaahHalaman += hal; // Total (A+B)
          
          // Pisahkan A dan B (Data "Muroja'ah" lama otomatis masuk ke A)
          if (keg.includes('deresanb')) {
            santriStats[sId].totalDeresanB += hal;
          } else {
            santriStats[sId].totalDeresanA += hal;
          }
        }

        if (isZiyadah) {
         if (isValidDate) {
            let hal = parseFloat(String(log.jumlah_halaman || '0'));
            if (isNaN(hal) || hal === 0) {
              if (log.juz_awal && log.pojok_awal && log.juz_akhir && log.pojok_akhir) {
                const start = getAbsolutePojok(log.juz_awal, log.pojok_awal);
                const end = getAbsolutePojok(log.juz_akhir, log.pojok_akhir);
                hal = Math.max(0, Math.abs(end - start) + 1);
              } else {
                hal = safeExtractNum(log.jumlah_halaman) || 1;
              }
            }
            santriStats[sId].totalZiyadahHalamanBulanIni += hal;
          }

          const currentJuz = safeExtractNum(log.juz_akhir);
          const currentPojok = safeExtractNum(log.pojok_akhir);
          if (currentJuz >= 1 && currentJuz <= 30) {
            const currentAbs = getAbsolutePojok(currentJuz, currentPojok);
            if (currentAbs > santriStats[sId].maxZiyadahAbs) {
              santriStats[sId].lastJuzZiyadah = currentJuz;
              santriStats[sId].lastPojokZiyadah = currentPojok;
              santriStats[sId].maxZiyadahAbs = currentAbs;
            }
          }
        }
      });
    }

    let totalSantri = 0;
    let targetAchieved = 0;
    let sumZiyadahAbs = 0;
    let sumZiyadahVolume = 0;
    let sumMurojaah = 0;

    const kelasStats: Record<string, { total: number; capai: number }> = {
      "7": { total: 0, capai: 0 },
      "8": { total: 0, capai: 0 },
      "9": { total: 0, capai: 0 },
      "10": { total: 0, capai: 0 },
      "11": { total: 0, capai: 0 },
      "12": { total: 0, capai: 0 }
    };

    const halaqohStats: Record<string, any> = {};
    const santriArray = Object.values(santriStats);
    const bulanTargetCek = filterBulan === 'all' ? "06" : filterBulan;

    santriArray.forEach((s: any) => {
      totalSantri++;
      sumZiyadahAbs += s.maxZiyadahAbs;
      sumZiyadahVolume += s.totalZiyadahHalamanBulanIni;
      sumMurojaah += s.totalMurojaahHalaman;

      const cls = s.kelasTarget;
      let targetLembagaAbs = 0;

      if (filterZiyadahAbs > 0) {
        targetLembagaAbs = filterZiyadahAbs;
      } else {
        const customT = cls ? customTargetsLembaga?.[`${bulanTargetCek}_${cls}`] : null;
        if (customT && (customT.juz > 0 || customT.pojokan > 0)) {
          targetLembagaAbs = getAbsolutePojok(customT.juz, customT.pojokan);
        } else if (cls && DefaultTargetLembaga[bulanTargetCek]?.[cls]) {
          const t = DefaultTargetLembaga[bulanTargetCek][cls];
          targetLembagaAbs = getAbsolutePojok(t.j, t.p);
        }
      }

      let targetPojokanVal = 0;
      if (customPojokFilterInput > 0) {
        targetPojokanVal = customPojokFilterInput;
      } else if (cls) {
        const dbVal = customTargetsPojokan?.[`${bulanTargetCek}_${cls}`] ?? customTargetsPojokan?.[`${parseInt(bulanTargetCek, 10)}_${cls}`];
        if (dbVal !== undefined && Number(dbVal) > 0) {
          targetPojokanVal = Number(dbVal);
        } else {
          targetPojokanVal = DefaultTargetPojokan[bulanTargetCek]?.[cls] ?? 20;
        }
      } else {
        targetPojokanVal = 20;
      }

      let targetDeresanVal = 0;
      if (customDeresanFilterInput > 0) {
        targetDeresanVal = customDeresanFilterInput;
      } else if (cls) {
        const dbVal = customTargetsDeresan?.[`${bulanTargetCek}_${cls}`] ?? customTargetsDeresan?.[`${parseInt(bulanTargetCek, 10)}_${cls}`];
        if (dbVal !== undefined && Number(dbVal) > 0) {
          targetDeresanVal = Number(dbVal);
        } else {
          targetDeresanVal = DefaultTargetDeresan[bulanTargetCek]?.[cls] ?? 20;
        }
      } else {
        targetDeresanVal = 20;
      }

      s.targetPojokanVal = targetPojokanVal;
      s.targetDeresanVal = targetDeresanVal;

      // Status Khatam / Khotimin otomatis memenuhi Target Lembaga & Target Pojokan (karena sudah tidak ada tanggungan Ziyadah baru)
      const santriStatusStr = String(s.status_aktif || s.status || '').toLowerCase();
      const isKhatamOrKhotimin = santriStatusStr.includes('khatam') || santriStatusStr.includes('khotimin') || s.maxZiyadahAbs >= 30 * POJOK_PER_JUZ;

      s.isKhatamOrKhotimin = isKhatamOrKhotimin;
      s.capaiTargetLembaga = isKhatamOrKhotimin || (targetLembagaAbs > 0 && s.maxZiyadahAbs >= targetLembagaAbs);
      s.capaiTargetPojokan = isKhatamOrKhotimin || (targetPojokanVal > 0 ? (s.totalZiyadahHalamanBulanIni >= targetPojokanVal) : (s.totalZiyadahHalamanBulanIni > 0));
      s.capaiTargetDeresan = targetDeresanVal > 0 ? (s.totalMurojaahHalaman >= targetDeresanVal) : (s.totalMurojaahHalaman > 0);

      // Status aktif berdasarkan tab/mode target terpilih
      if (targetFilterMode === 'lembaga') {
        s.capaiTarget = s.capaiTargetLembaga;
      } else if (targetFilterMode === 'pojokan') {
        s.capaiTarget = s.capaiTargetPojokan;
      } else {
        s.capaiTarget = s.capaiTargetDeresan;
      }

      if (s.capaiTarget) {
        targetAchieved++;
        if (cls && kelasStats[cls]) kelasStats[cls].capai++;
      }
      if (cls && kelasStats[cls]) kelasStats[cls].total++;

      const hName = s.halaqoh || 'Tanpa Halaqoh';
      if (!halaqohStats[hName]) {
        const cleanName = hName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const kNo = ustadzKamarMap[cleanName] || '';
        halaqohStats[hName] = {
          name: hName,
          kamar: kNo,
          kamarNum: safeExtractNum(kNo),
          totalSantri: 0,
          capai: 0,
          sumZiyadahAbs: 0,
          sumZiyadahVolume: 0,
          sumMurojaah: 0,
          santriList: []
        };
      }

      halaqohStats[hName].totalSantri++;
      halaqohStats[hName].sumZiyadahAbs += s.maxZiyadahAbs;
      halaqohStats[hName].sumZiyadahVolume += s.totalZiyadahHalamanBulanIni;
      halaqohStats[hName].sumMurojaah += s.totalMurojaahHalaman;
      if (s.capaiTarget) halaqohStats[hName].capai++;
      halaqohStats[hName].santriList.push(s);
    });

    santriArray.sort((a, b) => {
      if (sortSantriBy === 'nama-asc') return (a.nama || '').localeCompare(b.nama || '');
      if (sortSantriBy === 'nama-desc') return (b.nama || '').localeCompare(a.nama || '');
      if (sortSantriBy === 'ziyadah-desc') return b.maxZiyadahAbs - a.maxZiyadahAbs;
      if (sortSantriBy === 'ziyadah-asc') return a.maxZiyadahAbs - b.maxZiyadahAbs;
      if (sortSantriBy === 'pojokan-desc') return b.totalZiyadahHalamanBulanIni - a.totalZiyadahHalamanBulanIni;
      if (sortSantriBy === 'pojokan-asc') return a.totalZiyadahHalamanBulanIni - b.totalZiyadahHalamanBulanIni;
      if (sortSantriBy === 'murojaah-desc') return b.totalMurojaahHalaman - a.totalMurojaahHalaman;
      if (sortSantriBy === 'murojaah-asc') return a.totalMurojaahHalaman - b.totalMurojaahHalaman;
      if (sortSantriBy === 'target-desc') {
        if (a.capaiTarget === b.capaiTarget) return (a.nama || '').localeCompare(b.nama || '');
        return a.capaiTarget ? -1 : 1;
      }
      if (sortSantriBy === 'kelas-asc') {
        const kA = safeExtractNum(a.kelasTarget) || 99;
        const kB = safeExtractNum(b.kelasTarget) || 99;
        if (kA !== kB) return kA - kB;
        return (a.nama || '').localeCompare(b.nama || '');
      }
      if (sortSantriBy === 'kamar-asc') {
        const kmA = safeExtractNum(a.kamar) || 999;
        const kmB = safeExtractNum(b.kamar) || 999;
        if (kmA !== kmB) return kmA - kmB;
        return (a.nama || '').localeCompare(b.nama || '');
      }
      return (a.nama || '').localeCompare(b.nama || '');
    });

    let halaqohArray = Object.values(halaqohStats);
    halaqohArray.sort((a: any, b: any) => {
      if (sortHalaqohBy === 'kamar-asc') {
        if (a.kamarNum === 0 && b.kamarNum > 0) return 1;
        if (b.kamarNum === 0 && a.kamarNum > 0) return -1;
        if (a.kamarNum !== b.kamarNum) return a.kamarNum - b.kamarNum;
        return a.name.localeCompare(b.name);
      }
      if (sortHalaqohBy === 'kamar-desc') {
        if (a.kamarNum === 0 && b.kamarNum > 0) return 1;
        if (b.kamarNum === 0 && a.kamarNum > 0) return -1;
        if (a.kamarNum !== b.kamarNum) return b.kamarNum - a.kamarNum;
        return b.name.localeCompare(a.name);
      }
      if (sortHalaqohBy === 'nama-asc') return a.name.localeCompare(b.name);
      if (sortHalaqohBy === 'nama-desc') return b.name.localeCompare(a.name);
      if (sortHalaqohBy === 'capai-desc') {
        const pA = a.totalSantri ? a.capai / a.totalSantri : 0;
        const pB = b.totalSantri ? b.capai / b.totalSantri : 0;
        return pB - pA;
      }
      if (sortHalaqohBy === 'ziyadah-desc') {
        const avgA = a.totalSantri ? a.sumZiyadahAbs / a.totalSantri : 0;
        const avgB = b.totalSantri ? b.sumZiyadahAbs / b.totalSantri : 0;
        return avgB - avgA;
      }
      return 0;
    });

    const pTarget = totalSantri > 0 ? Math.round((targetAchieved / totalSantri) * 100) : 0;
    const avgZDisp = totalSantri > 0 ? getJuzPojokFromAbsolute(Math.floor(sumZiyadahAbs / totalSantri)) : { j: 0, p: 0 };
    const avgZVolDisp = totalSantri > 0 ? (sumZiyadahVolume / totalSantri).toFixed(1) : "0.0";

    return {
      totalSantri,
      targetAchieved,
      pTarget,
      avgZDisp,
      avgZVolDisp,
      avgMurojaah: totalSantri > 0 ? (sumMurojaah / totalSantri).toFixed(1) : "0.0",
      kelasStats,
      santriArray,
      halaqohArray,
      bulanTargetCek,
      customTargetAbs: filterZiyadahAbs
    };
  }, [santriList, rawLogs, filterBulan, filterKelas, filterZiyadah, targetFilterMode, ustadzKamarMap, sortHalaqohBy, sortSantriBy, customTargetsLembaga, customTargetsPojokan, customTargetsDeresan, filterMode, startDate, endDate]);

  // Riwayat setoran untuk santri terpilih di modal detail
  const santriDetailLogs = useMemo(() => {
    if (!selectedSantriDetail || !Array.isArray(rawLogs)) return [];
    const sId = selectedSantriDetail.id;
    const sNis = selectedSantriDetail.nis;
    return rawLogs
      .filter((l: any) => l.santri_id === sId || (sNis && l.santri_id === sNis))
      .sort((a: any, b: any) => {
        const dateComp = String(b.tanggal || '').localeCompare(String(a.tanggal || ''));
        if (dateComp !== 0) return dateComp;
        return (b.id || 0) > (a.id || 0) ? 1 : -1;
      });
  }, [selectedSantriDetail, rawLogs]);

  const filteredSantriDetailLogs = useMemo(() => {
    if (santriDetailTimeFilter === 'all') return santriDetailLogs;
    const now = new Date();
    const days = santriDetailTimeFilter === 'week' ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    cutoff.setHours(0, 0, 0, 0);

    return santriDetailLogs.filter((l: any) => {
      if (!l.tanggal) return false;
      const dStr = String(l.tanggal).split(' ')[0].split('T')[0];
      const d = new Date(dStr);
      return !isNaN(d.getTime()) && d >= cutoff;
    });
  }, [santriDetailLogs, santriDetailTimeFilter]);

  const santriDetailStats = useMemo(() => {
    if (!santriDetailLogs.length) {
      return { lastZiyadah: 'Belum Ada', lastMurojaah: 'Belum Ada', ziyadahCount: 0, murojaahCount: 0 };
    }
    const lastZ = santriDetailLogs.find((l: any) => {
      const k = String(l.kegiatan || '').toLowerCase();
      return (k.includes('ziyadah') || k.includes('tambah') || k === '') && l.juz_akhir;
    });
    const lastM = santriDetailLogs.find((l: any) => {
      const k = String(l.kegiatan || '').toLowerCase();
      return (k.includes('muroja') || k.includes('muraja') || k.includes('ulang') || k.includes('deres'))  && l.juz_akhir;
    });

    let zCount = 0;
    let mCount = 0;
    filteredSantriDetailLogs.forEach((l: any) => {
      const k = String(l.kegiatan || '').toLowerCase();
      if (k.includes('muroja') || k.includes('muraja') || k.includes('ulang') || k.includes('deres')) {
        mCount++;
      } else {
        zCount++;
      }
    });

    return {
      lastZiyadah: lastZ ? `Juz ${lastZ.juz_akhir} Pjk ${lastZ.pojok_akhir}` : 'Belum Ada',
      lastMurojaah: lastM ? `Juz ${lastM.juz_akhir} Pjk ${lastM.pojok_akhir}` : 'Belum Ada',
      ziyadahCount: zCount,
      murojaahCount: mCount
    };
  }, [santriDetailLogs, filteredSantriDetailLogs]);

  if (isLoading || !processedData) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-white rounded-2xl p-6 border border-emerald-100">
        <Activity size={36} className="animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-bold text-slate-700">Menghubungkan & Memproses Data Tahfidh...</p>
      </div>
    );
  }

  const { totalSantri, targetAchieved, pTarget, avgZDisp, avgZVolDisp, avgMurojaah, santriArray, halaqohArray, customTargetAbs, bulanTargetCek } = processedData;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col xl:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-3 rounded-2xl shadow-md">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800">
              Dashboard <span className="text-emerald-600">Tahfidz Putra</span>
            </h1>
            <p className="text-xs text-slate-500 font-bold tracking-wider mt-0.5">
              Monitoring Real-Time • Urutan Hafalan: Juz 1 Pojok 1 ➔ Juz 30
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 items-center w-full xl:w-auto">
          {/* === TAMBAHAN UI SWITCH & INPUT TANGGAL === */}
          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setFilterMode('bulan')}
              className={`px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all ${filterMode === 'bulan' ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Bulan
            </button>
            <button
              onClick={() => setFilterMode('rentang')}
              className={`px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all ${filterMode === 'rentang' ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Rentang
            </button>
          </div>

          {filterMode === 'bulan' ? (
            <div className="flex items-center bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-200 shadow-sm">
              <Calendar size={15} className="text-emerald-600 mr-2" />
              <select
                className="bg-transparent border-none text-xs font-bold text-slate-700 cursor-pointer outline-none"
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
              >
                {DAFTAR_BULAN.map((b) => (
                  <option key={b.kode} value={b.kode}>
                    {b.nama}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-200 shadow-sm gap-2">
              <Calendar size={15} className="text-emerald-600" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-transparent border-none text-[11px] font-bold text-slate-700 outline-none w-[90px]"
                title="Tanggal Mulai"
              />
              <span className="text-[10px] font-black text-slate-400">s/d</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-transparent border-none text-[11px] font-bold text-slate-700 outline-none w-[90px]"
                title="Tanggal Akhir"
              />
            </div>
          )}

          <div className="flex items-center bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-200 shadow-sm">
            <Users size={15} className="text-teal-600 mr-2" />
            <select
              className="bg-transparent border-none text-xs font-bold text-slate-700 cursor-pointer outline-none"
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
            >
              <option value="all">Semua Kelas (7 - 12)</option>
              <option value="7">Kelas 7 (VII)</option>
              <option value="8">Kelas 8 (VIII)</option>
              <option value="9">Kelas 9 (IX)</option>
              <option value="10">Kelas 10 (X)</option>
              <option value="11">Kelas 11 (XI)</option>
              <option value="12">Kelas 12 (XII)</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-200 shadow-sm">
            <Target size={15} className="text-amber-600 mr-2" />
            <input
              type="text"
              placeholder={
                targetFilterMode === 'pojokan'
                  ? 'Target Pjk (mis: 20)'
                  : targetFilterMode === 'deresan'
                  ? 'Target Murj (mis: 20)'
                  : 'Target Juz/Pjk (1/10)'
              }
              className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none w-32 placeholder:text-slate-400"
              value={filterZiyadah}
              onChange={(e) => setFilterZiyadah(e.target.value)}
            />
          </div>

          {onRefreshLogs && (
            <button
              onClick={onRefreshLogs}
              title="Segarkan Data Dari Server"
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all shadow-sm"
            >
              <RefreshCw size={15} />
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[11px] font-black tracking-wider">LIVE</span>
          </div>
        </div>
      </div>

      {/* Mode Target Filter Pills */}
      <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 pl-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Target size={15} className="text-emerald-600" /> Mode Evaluasi Target:
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => setTargetFilterMode('lembaga')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              targetFilterMode === 'lembaga'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-2 ring-teal-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Target size={14} /> 1. Target Lembaga (Milestone)
          </button>
          <button
            type="button"
            onClick={() => setTargetFilterMode('pojokan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              targetFilterMode === 'pojokan'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen size={14} /> 2. Target Pojokan (Ziyadah Baru)
          </button>
          <button
            type="button"
            onClick={() => setTargetFilterMode('deresan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              targetFilterMode === 'deresan'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RefreshCw size={14} /> 3. Target Deresan (Muroja'ah)
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <User size={16} className="text-emerald-600" /> Total Santri Putra
          </div>
          <div className="text-4xl font-black text-slate-800 mt-2">{totalSantri}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Sesuai filter kelas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={16} className="text-teal-600" />
            {targetFilterMode === 'pojokan' ? 'Rata-Rata Pojokan Baru' : 'Rata-Rata Ziyadah'}
          </div>
          {targetFilterMode === 'pojokan' ? (
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-800">{avgZVolDisp}</span>
              <span className="text-xs font-bold text-slate-500">Pojok / Santri</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-800">Juz {avgZDisp.j}</span>
              <span className="text-xs font-black bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-md">
                Pojok {avgZDisp.p}
              </span>
            </div>
          )}
          <div className="text-[11px] font-bold text-slate-400 mt-1">
            {targetFilterMode === 'pojokan' ? 'Volume bulan terpilih' : 'Capaian akumulatif'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <RefreshCw size={16} className="text-green-600" /> Rata-Rata Muroja'ah
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-800">{avgMurojaah}</span>
            <span className="text-xs font-bold text-slate-500">Pojok / Santri</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">Bulan terpilih</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Medal size={16} className={targetFilterMode === 'lembaga' ? 'text-teal-500' : targetFilterMode === 'pojokan' ? 'text-emerald-500' : 'text-blue-500'} />
            {targetFilterMode === 'lembaga'
              ? 'Capai Target Lembaga'
              : targetFilterMode === 'pojokan'
              ? 'Capai Target Pojokan'
              : 'Capai Target Deresan'}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-800">{pTarget}%</span>
            <span className="text-xs font-bold text-slate-500">{targetAchieved} Santri</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                targetFilterMode === 'deresan'
                  ? 'bg-blue-500'
                  : targetFilterMode === 'pojokan'
                  ? 'bg-emerald-500'
                  : 'bg-teal-500'
              }`}
              style={{ width: `${pTarget}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Table Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <div className="flex rounded-xl bg-slate-200/70 p-1">
            <button
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'santri' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('santri')}
            >
              <User size={15} /> Detail Santri
            </button>
            <button
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'halaqoh' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('halaqoh')}
            >
              <Users size={15} /> Rekap Halaqoh
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center pr-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <ArrowUpDown size={13} className="text-emerald-600" /> Urutkan:
            </span>
            {activeTab === 'santri' ? (
              <select
                className="bg-white border border-slate-300 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer shadow-sm focus:border-emerald-500"
                value={sortSantriBy}
                onChange={(e) => setSortSantriBy(e.target.value)}
              >
                <option value="nama-asc">Nama Santri (A → Z)</option>
                <option value="nama-desc">Nama Santri (Z → A)</option>
                <option value="ziyadah-desc">Capaian Ziyadah (Tertinggi)</option>
                <option value="ziyadah-asc">Capaian Ziyadah (Terendah)</option>
                <option value="pojokan-desc">Pojokan Baru (Terbanyak)</option>
                <option value="pojokan-asc">Pojokan Baru (Tersedikit)</option>
                <option value="murojaah-desc">Muroja'ah (Terbanyak)</option>
                <option value="target-desc">Status Target (Tercapai Dahulu)</option>
                <option value="kelas-asc">Tingkat Kelas (7 → 12)</option>
                <option value="kamar-asc">Nomor Kamar (1 → 99)</option>
              </select>
            ) : (
              <select
                className="bg-white border border-slate-300 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer shadow-sm focus:border-emerald-500"
                value={sortHalaqohBy}
                onChange={(e) => setSortHalaqohBy(e.target.value)}
              >
                <option value="kamar-asc">Nomor Kamar (1 → 99)</option>
                <option value="kamar-desc">Nomor Kamar (99 → 1)</option>
                <option value="nama-asc">Nama Ustadz (A → Z)</option>
                <option value="nama-desc">Nama Ustadz (Z → A)</option>
                <option value="capai-desc">Target Tertinggi (%)</option>
                <option value="ziyadah-desc">Rata-rata Ziyadah Tertinggi</option>
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          {activeTab === 'santri' ? (
            <table className="min-w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 uppercase font-black text-slate-500 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    onClick={() => setSortSantriBy(sortSantriBy === 'nama-asc' ? 'nama-desc' : 'nama-asc')}
                    title="Klik untuk mengurutkan Nama"
                  >
                    <div className="flex items-center gap-1.5">
                      Nama Santri
                      <ArrowUpDown size={12} className={sortSantriBy.startsWith('nama') ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    onClick={() => setSortSantriBy(sortSantriBy === 'kelas-asc' ? 'kamar-asc' : 'kelas-asc')}
                    title="Klik untuk urutkan Kelas / Kamar"
                  >
                    <div className="flex items-center gap-1.5">
                      Kelas / Kamar
                      <ArrowUpDown size={12} className={sortSantriBy.startsWith('kelas') || sortSantriBy.startsWith('kamar') ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Halaqoh</th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    onClick={() => setSortSantriBy(sortSantriBy === 'ziyadah-desc' ? 'ziyadah-asc' : 'ziyadah-desc')}
                    title="Klik untuk urutkan Ziyadah"
                  >
                    <div className="flex items-center gap-1.5">
                      Capaian Ziyadah
                      <ArrowUpDown size={12} className={sortSantriBy.startsWith('ziyadah') ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    onClick={() => setSortSantriBy(sortSantriBy === 'pojokan-desc' ? 'pojokan-asc' : 'pojokan-desc')}
                    title="Klik untuk urutkan Pojokan Baru"
                  >
                    <div className="flex items-center gap-1.5">
                      Pojokan Baru (Bln Ini)
                      <ArrowUpDown size={12} className={sortSantriBy.startsWith('pojokan') ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Deresan A</th>
                  <th className="px-5 py-3.5">Deresan B</th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    onClick={() => setSortSantriBy(sortSantriBy === 'murojaah-desc' ? 'murojaah-asc' : 'murojaah-desc')}
                    title="Klik untuk urutkan Muroja'ah"
                  >
                    <div className="flex items-center gap-1.5">
                      Total (A+B)
                      <ArrowUpDown size={12} className={sortSantriBy.startsWith('murojaah') ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    onClick={() => setSortSantriBy('target-desc')}
                    title="Klik untuk urutkan Status Target"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Status Target Aktif
                      <ArrowUpDown size={12} className={sortSantriBy === 'target-desc' ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {santriArray.map((s: any) => {
                  let targetText = '-';
                  const clsMap = s.kelasTarget;
                  if (customTargetAbs > 0) {
                    const t = getJuzPojokFromAbsolute(customTargetAbs);
                    targetText = `Juz ${t.j} Pjk ${t.p}`;
                  } else {
                    const customT = clsMap ? customTargetsLembaga?.[`${bulanTargetCek}_${clsMap}`] : null;
                    if (customT && (customT.juz > 0 || customT.pojokan > 0)) {
                      targetText = `Juz ${customT.juz} Pjk ${customT.pojokan}`;
                    } else {
                      const tKelas = clsMap ? DefaultTargetLembaga[bulanTargetCek]?.[clsMap] : null;
                      if (tKelas) targetText = `Juz ${tKelas.j} Pjk ${tKelas.p}`;
                    }
                  }

                  const targetPojokan = s.targetPojokanVal || (clsMap ? (customTargetsPojokan?.[`${bulanTargetCek}_${clsMap}`] || DefaultTargetPojokan[bulanTargetCek]?.[clsMap] || 20) : 20);
                  const targetDeresan = s.targetDeresanVal || (clsMap ? (customTargetsDeresan?.[`${bulanTargetCek}_${clsMap}`] || DefaultTargetDeresan[bulanTargetCek]?.[clsMap] || 20) : 20);

                  return (
                    <tr key={s.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSantriDetail(s);
                            setSantriDetailTimeFilter('all');
                          }}
                          className="text-left group cursor-pointer"
                        >
                          <div className="font-extrabold text-slate-800 text-sm group-hover:text-emerald-700 group-hover:underline transition-colors flex items-center gap-1.5">
                            {s.nama}
                            <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all inline" />
                          </div>
                          <div className="text-[11px] text-slate-500 font-bold">NIS: {s.nis || '-'}</div>
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-700">{s.kelas || '-'}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{s.kamar || '-'}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-md">
                          {s.halaqoh || 'Belum Ada'}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 ${targetFilterMode === 'lembaga' ? 'bg-teal-50/30' : ''}`}>
                        <div className="font-black text-teal-700 text-sm">
                          {s.lastJuzZiyadah > 0 ? `Juz ${s.lastJuzZiyadah} Pjk ${s.lastPojokZiyadah}` : 'Belum Ada'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">Target Lembaga: {targetText}</div>
                      </td>
                      <td className={`px-5 py-3.5 ${targetFilterMode === 'pojokan' ? 'bg-emerald-50/30' : ''}`}>
                        <span className="font-black text-emerald-700 text-sm">{s.totalZiyadahHalamanBulanIni}</span>
                        <span className="text-[11px] text-slate-500 font-bold"> Pjk</span>
                        <div className="text-[10px] text-slate-400 font-semibold">Target: {targetPojokan} Pjk</div>
                      </td>
                     <td className="px-5 py-3.5 font-bold text-slate-700">{s.totalDeresanA} Pjk</td>
                        <td className="px-5 py-3.5 font-bold text-slate-700">{s.totalDeresanB} Pjk</td>
                        <td className={`px-5 py-3.5 ${targetFilterMode === 'deresan' ? 'bg-blue-50/30' : ''}`}>
                          <span className="font-black text-slate-800 text-sm">{s.totalMurojaahHalaman}</span>
                          <span className="text-[11px] text-slate-500 font-bold"> Pjk</span>
                          <div className="text-[10px] text-slate-400 font-semibold">Target: {targetDeresan} Pjk</div>
                        </td>
                      <td className="px-5 py-3.5 text-center">
                        {s.capaiTarget ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <Check size={11} /> TERCAPAI
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <X size={11} /> BELUM
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 uppercase font-black text-slate-500 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th
                    className="px-4 py-3.5 text-center cursor-pointer hover:bg-slate-100 select-none"
                    onClick={() => setSortHalaqohBy(sortHalaqohBy === 'kamar-asc' ? 'kamar-desc' : 'kamar-asc')}
                    title="Klik untuk mengurutkan nomor kamar"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Kamar
                      <ArrowUpDown size={12} className={sortHalaqohBy.startsWith('kamar') ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 select-none"
                    onClick={() => setSortHalaqohBy(sortHalaqohBy === 'nama-asc' ? 'nama-desc' : 'nama-asc')}
                    title="Klik untuk mengurutkan nama ustadz"
                  >
                    <div className="flex items-center gap-1.5">
                      Nama Halaqoh
                      <ArrowUpDown size={12} className={sortHalaqohBy.startsWith('nama') ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-center">Santri</th>
                  <th className="px-5 py-3.5">Rata-rata Ziyadah</th>
                  <th className="px-5 py-3.5">Pojokan Baru (Rata)</th>
                  <th className="px-5 py-3.5">Rata-rata Murj.</th>
                  <th
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 select-none"
                    onClick={() => setSortHalaqohBy('capai-desc')}
                    title="Klik untuk urutkan target tertinggi"
                  >
                    <div className="flex items-center gap-1">
                      Capai Target Aktif
                      <ArrowUpDown size={12} className={sortHalaqohBy === 'capai-desc' ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {halaqohArray.map((h: any) => {
                  const avgZ = h.totalSantri ? Math.floor(h.sumZiyadahAbs / h.totalSantri) : 0;
                  const avgZDisp = getJuzPojokFromAbsolute(avgZ);
                  const avgPojokBaru = h.totalSantri ? (h.sumZiyadahVolume / h.totalSantri).toFixed(1) : "0.0";
                  const avgM = h.totalSantri ? (h.sumMurojaah / h.totalSantri).toFixed(1) : "0.0";
                  const pHCapai = h.totalSantri ? Math.round((h.capai / h.totalSantri) * 100) : 0;

                  return (
                    <tr key={h.name} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="px-4 py-3.5 text-center font-black text-slate-700">
                        {h.kamar ? (
                          <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                            {h.kamar}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-black text-slate-800 text-sm">{h.name}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-600">{h.totalSantri}</td>
                      <td className={`px-5 py-3.5 font-black text-teal-700 text-sm ${targetFilterMode === 'lembaga' ? 'bg-teal-50/30' : ''}`}>
                        Juz {avgZDisp.j} Pjk {avgZDisp.p}
                      </td>
                      <td className={`px-5 py-3.5 font-bold text-emerald-700 ${targetFilterMode === 'pojokan' ? 'bg-emerald-50/30' : ''}`}>
                        {avgPojokBaru} <span className="text-[10px] text-slate-400">Pjk</span>
                      </td>
                      <td className={`px-5 py-3.5 font-bold text-slate-700 ${targetFilterMode === 'deresan' ? 'bg-blue-50/30' : ''}`}>
                        {avgM} <span className="text-[10px] text-slate-400">Pjk</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-700 text-xs w-8">{pHCapai}%</span>
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pHCapai < 50 ? 'bg-rose-500' : pHCapai < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pHCapai}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => setModalData(h.name)}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-black transition-colors"
                        >
                          DETAIL
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[85vh]">
            <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">{modalData}</h3>
                <p className="text-xs text-slate-500 font-bold">
                  Evaluasi Target Aktif: {targetFilterMode === 'lembaga' ? 'Target Lembaga (Milestone)' : targetFilterMode === 'pojokan' ? 'Target Pojokan (Ziyadah Baru)' : 'Target Deresan (Muroja\'ah)'}
                </p>
              </div>
              <button
                onClick={() => setModalData(null)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-0 overflow-y-auto flex-grow">
              <table className="min-w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 uppercase font-black text-slate-500 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Nama Santri</th>
                    <th className="px-5 py-3">Kelas & Kamar</th>
                    <th className="px-5 py-3">Capaian Ziyadah</th>
                    <th className="px-5 py-3">Pojokan Baru (Bln Ini)</th>
                    <th className="px-5 py-3">Muroja'ah</th>
                    <th className="px-5 py-3 text-center">Status Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(halaqohArray.find((h: any) => h.name === modalData)?.santriList || []).map((s: any) => (
                    <tr key={s.id} className="hover:bg-emerald-50/40">
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSantriDetail(s);
                            setSantriDetailTimeFilter('all');
                          }}
                          className="text-left group cursor-pointer"
                        >
                          <div className="font-extrabold text-slate-800 text-sm group-hover:text-emerald-700 group-hover:underline transition-colors flex items-center gap-1.5">
                            {s.nama}
                            <ChevronRight size={13} className="text-slate-400 group-hover:text-emerald-600 transition-all inline" />
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">NIS: {s.nis || '-'}</div>
                        </button>
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-600">
                        {s.kelas} • {s.kamar || '-'}
                      </td>
                      <td className="px-5 py-3 font-black text-teal-700">
                        {s.lastJuzZiyadah > 0 ? `Juz ${s.lastJuzZiyadah} Pjk ${s.lastPojokZiyadah}` : 'Belum Ada'}
                      </td>
                      <td className="px-5 py-3 font-black text-emerald-700">{s.totalZiyadahHalamanBulanIni} Pjk</td>
                      <td className="px-5 py-3 font-bold text-slate-700">{s.totalMurojaahHalaman} Pjk</td>
                      <td className="px-5 py-3 text-center">
                        {s.capaiTarget ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                            TERCAPAI
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded">
                            BELUM
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Riwayat Santri (Sama Persis Seperti di Dashboard Halaqoh) */}
      {selectedSantriDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-3 md:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh] animate-in fade-in duration-200">
            {/* Header Modal */}
            <div className="p-4 md:p-6 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSantriDetail(null)}
                  className="p-2 bg-white hover:bg-slate-200 rounded-xl text-slate-700 border border-slate-200 transition-colors shadow-sm"
                  title="Tutup Riwayat"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    {selectedSantriDetail.nama}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    NIS: {selectedSantriDetail.nis || '-'} • Kelas: {selectedSantriDetail.kelas || '-'} • Kamar: {selectedSantriDetail.kamar || '-'} • Halaqoh: {selectedSantriDetail.halaqoh || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm">
                  {filteredSantriDetailLogs.length} Riwayat Setoran
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSantriDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
                  title="Tutup"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body Modal */}
            <div className="p-4 md:p-6 overflow-y-auto space-y-5 flex-grow">
              {/* 3 Kartu Ringkasan Capaian & Statistik */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-100/80 shadow-sm">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={14} className="text-emerald-600" /> Capaian Terakhir
                  </div>
                  <div className="text-base font-black text-slate-800 mt-1.5">
                    {santriDetailStats.lastZiyadah}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Muroja'ah: {santriDetailStats.lastMurojaah}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-50/30 p-4 rounded-2xl border border-emerald-100/80 shadow-sm">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-emerald-600" /> Riwayat Ziyadah
                  </div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    {santriDetailStats.ziyadahCount} <span className="text-xs font-bold text-slate-500">Sesi</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {santriDetailTimeFilter === 'week'
                      ? '7 hari terakhir'
                      : santriDetailTimeFilter === 'month'
                      ? '30 hari terakhir'
                      : 'Semua waktu'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50/70 to-blue-50/30 p-4 rounded-2xl border border-blue-100/80 shadow-sm">
                  <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw size={14} className="text-blue-600" /> Riwayat Muroja'ah
                  </div>
                  <div className="text-2xl font-black text-blue-700 mt-1">
                    {santriDetailStats.murojaahCount} <span className="text-xs font-bold text-slate-500">Sesi</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {santriDetailTimeFilter === 'week'
                      ? '7 hari terakhir'
                      : santriDetailTimeFilter === 'month'
                      ? '30 hari terakhir'
                      : 'Semua waktu'}
                  </div>
                </div>
              </div>

              {/* Filter Rentang Waktu */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Filter size={14} className="text-emerald-600" /> Filter Rentang Waktu:
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSantriDetailTimeFilter('week')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      santriDetailTimeFilter === 'week'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Minggu Terakhir
                  </button>
                  <button
                    type="button"
                    onClick={() => setSantriDetailTimeFilter('month')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      santriDetailTimeFilter === 'month'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bulan Terakhir
                  </button>
                  <button
                    type="button"
                    onClick={() => setSantriDetailTimeFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      santriDetailTimeFilter === 'all'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua Waktu
                  </button>
                </div>
              </div>

              {/* Tabel Rincian Setoran */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="min-w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Tanggal & Sesi</th>
                      <th className="px-4 py-3">Kehadiran</th>
                      <th className="px-4 py-3">Kegiatan</th>
                      <th className="px-4 py-3">Pencapaian</th>
                      <th className="px-4 py-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSantriDetailLogs.map((log: any) => {
                      const cleanDate = log.tanggal ? String(log.tanggal).split(' ')[0].split('T')[0] : '-';
                      return (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-800">{cleanDate}</div>
                            <div className="text-[10px] text-slate-400 font-bold">({log.waktu_sesi || 'Subuh'})</div>
                          </td>
                         <td className="px-4 py-3">
                              {log.kehadiran === 'Tidak Setor' ? (
                                <span 
                                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                                  style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}
                                >
                                  Tidak Setor
                                </span>
                              ) : log.kehadiran === 'Izin' ? (
                                <span 
                                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                                  style={{ backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' }}
                                >
                                  Izin
                                </span>
                              ) : log.kehadiran === 'Sakit' ? (
                                <span 
                                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                                  style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' }}
                                >
                                  Sakit
                                </span>
                              ) : (log.kehadiran === 'Alfa' || log.kehadiran === 'Alpha') ? (
                                <span 
                                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                                  style={{ backgroundColor: '#ffe4e6', color: '#9f1239', borderColor: '#fecdd3' }}
                                >
                                  {log.kehadiran}
                                </span>
                              ) : (
                                <span 
                                  className="px-2.5 py-1 rounded-full text-xs font-bold border"
                                  style={{ backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' }}
                                >
                                  {log.kehadiran || 'Hadir'}
                                </span>
                              )}
                            </td>
                          <td className="px-4 py-3 font-bold text-slate-700">{log.kegiatan || 'Ziyadah'}</td>
                          <td className="px-4 py-3">
                            {log.juz_akhir ? (
                              <div className="font-extrabold text-emerald-700">
                                Juz {log.juz_awal} Pjk {log.pojok_awal} ➔ Juz {log.juz_akhir} Pjk {log.pojok_akhir}
                                <span className="ml-2 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-emerald-800">
                                  {getDisplayLogHalaman(log)} Hal
                                </span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500">{log.keterangan || '-'}</td>
                        </tr>
                      );
                    })}
                    {filteredSantriDetailLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400 font-bold">
                          Tidak ada riwayat setoran pada rentang waktu yang dipilih.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function PengaturanTargetPanel({ onRefresh }: any) {
  const [targetType, setTargetType] = useState<'pojokan' | 'lembaga' | 'deresan'>('pojokan');
  const [selectedBulan, setSelectedBulan] = useState('07');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [dataPojokan, setDataPojokan] = useState<Record<string, number>>({});
  const [dataLembaga, setDataLembaga] = useState<Record<string, { juz: number; pojokan: number }>>({});
  const [dataDeresan, setDataDeresan] = useState<Record<string, number>>({});

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadTargetData = async () => {
    setIsLoading(true);
    const client = await getSupabase();
    if (!client) {
      setIsLoading(false);
      return;
    }

    try {
      if (targetType === 'pojokan') {
        const { data, error } = await client
          .from('target_pojokan_rows')
          .select('*')
          .eq('bulan', selectedBulan);

        if (!error && data && data.length > 0) {
          const map: Record<string, number> = {};
          data.forEach((row: any) => {
            map[row.kelas] = row.jumlah_pojokan;
          });
          setDataPojokan(map);
        } else {
          const fallback = DefaultTargetPojokan[selectedBulan] || {};
          const map: Record<string, number> = {};
          DAFTAR_KELAS.forEach((k) => {
            map[k] = fallback[k] || 20;
          });
          setDataPojokan(map);
        }
      } else if (targetType === 'lembaga') {
        const { data, error } = await client
          .from('target_lembaga_rows')
          .select('*')
          .eq('bulan', selectedBulan);

        if (!error && data) {
          const map: Record<string, { juz: number; pojokan: number }> = {};
          data.forEach((row: any) => {
            map[row.kelas] = { juz: row.juz || 0, pojokan: row.pojokan || 0 };
          });
          setDataLembaga(map);
        } else {
          const fallback = DefaultTargetLembaga[selectedBulan] || {};
          const map: Record<string, { juz: number; pojokan: number }> = {};
          DAFTAR_KELAS.forEach((k) => {
            map[k] = { juz: fallback[k]?.j || 0, pojokan: fallback[k]?.p || 0 };
          });
          setDataLembaga(map);
        }
      } else if (targetType === 'deresan') {
        const { data, error } = await client
          .from('target_deresan_rows')
          .select('*')
          .eq('bulan', selectedBulan);

        if (!error && data && data.length > 0) {
          const map: Record<string, number> = {};
          data.forEach((row: any) => {
            map[row.kelas] = row.jumlah_pojokan;
          });
          setDataDeresan(map);
        } else {
          const fallback = DefaultTargetDeresan[selectedBulan] || {};
          const map: Record<string, number> = {};
          DAFTAR_KELAS.forEach((k) => {
            map[k] = fallback[k] || 20;
          });
          setDataDeresan(map);
        }
      }
    } catch (err: any) {
      console.error('Error load target:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTargetData();
  }, [targetType, selectedBulan]);

  const handleSaveTarget = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const client = await getSupabase();
    if (!client) {
      setIsLoading(false);
      showToast('error', 'Koneksi database tidak tersedia!');
      return;
    }

    try {
      if (targetType === 'pojokan') {
        const rows = DAFTAR_KELAS.map((kelas) => ({
          bulan: selectedBulan,
          kelas,
          jumlah_pojokan: dataPojokan[kelas] || 0
        }));

        const { error } = await client
          .from('target_pojokan_rows')
          .upsert(rows, { onConflict: 'bulan,kelas' });

        if (error) throw error;
        showToast('success', `Target Pojokan bulan ${DAFTAR_BULAN.find((b) => b.kode === selectedBulan)?.nama} berhasil disimpan!`);
      } else if (targetType === 'lembaga') {
        const rows = DAFTAR_KELAS.map((kelas) => ({
          bulan: selectedBulan,
          kelas,
          juz: dataLembaga[kelas]?.juz || 0,
          pojokan: dataLembaga[kelas]?.pojokan || 0
        }));

        const { error } = await client
          .from('target_lembaga_rows')
          .upsert(rows, { onConflict: 'bulan,kelas' });

        if (error) throw error;
        showToast('success', `Target Lembaga bulan ${DAFTAR_BULAN.find((b) => b.kode === selectedBulan)?.nama} berhasil disimpan!`);
      } else if (targetType === 'deresan') {
        const rows = DAFTAR_KELAS.map((kelas) => ({
          bulan: selectedBulan,
          kelas,
          jumlah_pojokan: dataDeresan[kelas] || 0
        }));

        const { error } = await client
          .from('target_deresan_rows')
          .upsert(rows, { onConflict: 'bulan,kelas' });

        if (error) throw error;
        showToast('success', `Target Deresan bulan ${DAFTAR_BULAN.find((b) => b.kode === selectedBulan)?.nama} berhasil disimpan!`);
      }

      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast('error', `Gagal menyimpan target: ${err.message || 'Periksa tabel database'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-6">
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Sliders size={22} className="text-emerald-600" /> Pengaturan Target Hafalan
        </h2>
        <p className="text-xs text-slate-500 font-bold mt-1">
          Konfigurasi Target Pojokan, Target Lembaga, dan Target Deresan Santri
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setTargetType('pojokan')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            targetType === 'pojokan'
              ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">1. Target Pojokan</span>
            <BookOpen size={18} className={targetType === 'pojokan' ? 'text-emerald-600' : 'text-slate-400'} />
          </div>
          <p className="text-sm font-black text-slate-800 mt-1">Pendapatan Ziyadah</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Jumlah pojokan/halaman per bulan</p>
        </button>

        <button
          type="button"
          onClick={() => setTargetType('lembaga')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            targetType === 'lembaga'
              ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800">2. Target Lembaga</span>
            <Target size={18} className={targetType === 'lembaga' ? 'text-teal-600' : 'text-slate-400'} />
          </div>
          <p className="text-sm font-black text-slate-800 mt-1">Capaian Akumulatif</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Milestone Juz & Pojokan per bulan</p>
        </button>

        <button
          type="button"
          onClick={() => setTargetType('deresan')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            targetType === 'deresan'
              ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-blue-800">3. Target Deresan</span>
            <RefreshCw size={18} className={targetType === 'deresan' ? 'text-blue-600' : 'text-slate-400'} />
          </div>
          <p className="text-sm font-black text-slate-800 mt-1">Muroja'ah Santri</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Jumlah pojokan/halaman deresan</p>
        </button>
      </div>

      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-emerald-600" />
          <span className="text-xs font-black text-slate-700">Pilih Bulan Target:</span>
        </div>
        <select
          value={selectedBulan}
          onChange={(e) => setSelectedBulan(e.target.value)}
          className="bg-white border border-slate-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 outline-none cursor-pointer shadow-sm"
        >
          {DAFTAR_BULAN.map((b) => (
            <option key={b.kode} value={b.kode}>
              {b.nama}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSaveTarget} className="space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-black uppercase border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 w-36">Tingkat Kelas</th>
                {targetType === 'lembaga' ? (
                  <>
                    <th className="px-5 py-3.5">Target Juz</th>
                    <th className="px-5 py-3.5">Target Pojokan (1-20)</th>
                    <th className="px-5 py-3.5 text-center">Preview Capaian</th>
                  </>
                ) : (
                  <>
                    <th className="px-5 py-3.5">Jumlah Pojokan / Halaman</th>
                    <th className="px-5 py-3.5 text-center">Kategori</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {DAFTAR_KELAS.map((kelas) => {
                const targetL = dataLembaga[kelas] || { juz: 0, pojokan: 0 };
                const prevPojok =
                  targetType === 'lembaga' && (targetL.juz > 0 || targetL.pojokan > 0)
                    ? getAbsolutePojok(targetL.juz, targetL.pojokan)
                    : 0;

                return (
                  <tr key={kelas} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-bold text-slate-800">Kelas {kelas}</td>
                    {targetType === 'lembaga' ? (
                      <>
                        <td className="px-5 py-3.5">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                            value={targetL.juz || ''}
                            onChange={(e) =>
                              setDataLembaga({
                                ...dataLembaga,
                                [kelas]: { ...targetL, juz: parseInt(e.target.value) || 0 }
                              })
                            }
                            placeholder="Juz (1-30)"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <input
                            type="number"
                            min="1"
                            max="20"
                            className="w-24 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                            value={targetL.pojokan || ''}
                            onChange={(e) =>
                              setDataLembaga({
                                ...dataLembaga,
                                [kelas]: { ...targetL, pojokan: parseInt(e.target.value) || 0 }
                              })
                            }
                            placeholder="Pojokan (1-20)"
                          />
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-teal-700">
                          {targetL.juz > 0
                            ? `Juz ${targetL.juz} Pjk ${targetL.pojokan || 0} (${prevPojok} Pjk)`
                            : '-'}
                        </td>
                      </>
                    ) : targetType === 'pojokan' ? (
                      <>
                        <td className="px-5 py-3.5">
                          <input
                            type="number"
                            min="0"
                            className="w-32 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                            value={dataPojokan[kelas] ?? ''}
                            onChange={(e) =>
                              setDataPojokan({
                                ...dataPojokan,
                                [kelas]: parseInt(e.target.value) || 0
                              })
                            }
                            placeholder="Jml Pojokan"
                          />
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-200">
                            Ziyadah Baru
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3.5">
                          <input
                            type="number"
                            min="0"
                            className="w-32 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                            value={dataDeresan[kelas] ?? ''}
                            onChange={(e) =>
                              setDataDeresan({
                                ...dataDeresan,
                                [kelas]: parseInt(e.target.value) || 0
                              })
                            }
                            placeholder="Jml Pojokan Deresan"
                          />
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg text-xs border border-blue-200">
                            Muroja'ah (Deresan)
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan Target'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ImportExcelPanel({ santriList, ustadzList, onImportSuccess }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleDownloadTemplate = async (mode: 'ziyadah_with_santri' | 'ziyadah_blank' | 'murojaah_with_santri' | 'murojaah_blank') => {
    const XLSX = await getXLSX();
    if (!XLSX) {
      showToast('error', 'Pustaka Excel belum siap di browser.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const isMurojaah = mode.startsWith('murojaah');
    const defaultKegiatan = isMurojaah ? "Deresan A" : "Ziyadah";
    const defaultSesi = isMurojaah ? "Maghrib" : "Subuh";

    let sheetData: any[] = [];

    if (mode.includes('with_santri')) {
      sheetData = (santriList || []).map((s: any) => ({
        NIS: s.nis || '',
        Nama_Santri: s.nama || '',
        Kelas: s.kelas || '',
        Kamar: s.kamar || '',
        Halaqoh: s.halaqoh || '',
        Tanggal: todayStr,
        Waktu_Sesi: defaultSesi,
        Kehadiran: 'Hadir',
        Kegiatan: defaultKegiatan,
        Juz_Awal: isMurojaah ? 1 : 1,
        Pojok_Awal: isMurojaah ? 1 : 1,
        Juz_Akhir: isMurojaah ? 1 : 1,
        Pojok_Akhir: isMurojaah ? 20 : 14,
        Keterangan: ''
      }));
    } else {
      sheetData = [
        {
          NIS: '12345',
          Nama_Santri: 'Contoh Santri 1',
          Kelas: '7-A',
          Kamar: '01',
          Halaqoh: 'Ust. Moh. Minanudin',
          Tanggal: todayStr,
          Waktu_Sesi: defaultSesi,
          Kehadiran: 'Hadir',
          Kegiatan: defaultKegiatan,
          Juz_Awal: 1,
          Pojok_Awal: 1,
          Juz_Akhir: 1,
          Pojok_Akhir: isMurojaah ? 20 : 14,
          Keterangan: 'Lancar'
        }
      ];
    }

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    const sheetName = isMurojaah ? 'Setoran_Murojaah' : 'Setoran_Ziyadah';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const fileName = `Template_${sheetName}_${mode.includes('with_santri') ? 'Data_Santri' : 'Kosong'}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsProcessing(true);
    setParsedRows([]);

    const XLSX = await getXLSX();
    if (!XLSX) {
      setIsProcessing(false);
      showToast('error', 'Pustaka pemrosesan Excel belum siap.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          showToast('error', 'Berkas Excel kosong atau tidak terbaca.');
          setIsProcessing(false);
          return;
        }

        const santriNisMap: Record<string, any> = {};
        const santriNamaMap: Record<string, any> = {};
        (santriList || []).forEach((s: any) => {
          if (s.nis) santriNisMap[String(s.nis).trim()] = s;
          if (s.nama) santriNamaMap[String(s.nama).trim().toLowerCase()] = s;
        });

        const ustadzNamaMap: Record<string, any> = {};
        (ustadzList || []).forEach((u: any) => {
          if (u.nama) ustadzNamaMap[String(u.nama).trim().toLowerCase()] = u;
        });

        const processed = rawJson.map((row: any, idx: number) => {
          const rowNis = String(row.NIS || row.nis || '').trim();
          const rowNama = String(row.Nama_Santri || row.nama_santri || row.Nama || row.nama || '').trim();
          const matchedSantri = santriNisMap[rowNis] || santriNamaMap[rowNama.toLowerCase()] || null;

          let tanggalStr = String(row.Tanggal || row.tanggal || '').trim();
          if (typeof row.Tanggal === 'number' || typeof row.tanggal === 'number') {
            const excelDate = new Date(Math.round(((row.Tanggal || row.tanggal) - 25569) * 86400 * 1000));
            if (!isNaN(excelDate.getTime())) {
              tanggalStr = excelDate.toISOString().split('T')[0];
            }
          }
          if (!tanggalStr) tanggalStr = new Date().toISOString().split('T')[0];

          const waktuSesi = String(row.Waktu_Sesi || row.waktu_sesi || row.Sesi || 'Subuh').trim();
          const kehadiran = String(row.Kehadiran || row.kehadiran || 'Hadir').trim();
          const kegiatan = String(row.Kegiatan || row.kegiatan || 'Ziyadah').trim();
          const juzAwal = safeExtractNum(row.Juz_Awal || row.juz_awal);
          const pojokAwal = safeExtractNum(row.Pojok_Awal || row.pojok_awal);
          const juzAkhir = safeExtractNum(row.Juz_Akhir || row.juz_akhir);
          const pojokAkhir = safeExtractNum(row.Pojok_Akhir || row.pojok_akhir);

          let jumlahHalaman = 0;
          if (juzAwal && pojokAwal && juzAkhir && pojokAkhir) {
            jumlahHalaman = calculateHalamanCount(juzAwal, pojokAwal, juzAkhir, pojokAkhir, kegiatan);
          } else if (juzAkhir) {
            jumlahHalaman = safeExtractNum(row.Jumlah_Halaman || row.jumlah_halaman) || 1;
          }

          const keterangan = String(row.Keterangan || row.keterangan || '').trim();
          const isValid = !!matchedSantri && (kehadiran !== 'Hadir' || (juzAkhir > 0));

          return {
            rowNum: idx + 2,
            santriId: matchedSantri?.id || null,
            santriNama: matchedSantri?.nama || rowNama || 'Tidak Dikenali',
            santriKelas: matchedSantri?.kelas || row.Kelas || '',
            nis: matchedSantri?.nis || rowNis,
            ustadzahId: matchedSantri?.halaqoh
              ? ustadzNamaMap[String(matchedSantri.halaqoh).trim().toLowerCase()]?.id || null
              : null,
            tanggal: tanggalStr,
            waktuSesi,
            kehadiran,
            kegiatan,
            juzAwal,
            pojokAwal,
            juzAkhir,
            pojokAkhir,
            jumlahHalaman,
            keterangan,
            isValid,
            errorMessage: !matchedSantri
              ? 'Santri tidak cocok (NIS/Nama)'
              : kehadiran === 'Hadir' && !juzAkhir
              ? 'Juz Akhir belum diisi'
              : ''
          };
        });

        setParsedRows(processed);
        showToast('success', `Berhasil membaca ${processed.length} baris dari berkas.`);
      } catch (err: any) {
        showToast('error', `Gagal mengurai berkas: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleSaveToDatabase = async () => {
    const validRows = parsedRows.filter((r) => r.isValid && r.santriId);
    if (validRows.length === 0) {
      showToast('error', 'Tidak ada data valid yang siap disimpan.');
      return;
    }

    setIsProcessing(true);
    setImportProgress(0);
    const client = await getSupabase();
    if (!client) {
      setIsProcessing(false);
      showToast('error', 'Koneksi database Supabase tidak tersedia.');
      return;
    }

    try {
      const batchSize = 50;
      let insertedCount = 0;

      for (let i = 0; i < validRows.length; i += batchSize) {
        const batch = validRows.slice(i, i + batchSize).map((r) => ({
          tanggal: r.tanggal,
          waktu_sesi: r.waktuSesi,
          santri_id: String(r.santriId),
          ustadzah_id: r.ustadzahId ? String(r.ustadzahId) : null,
          kehadiran: r.kehadiran,
          kegiatan: r.kegiatan,
          juz_awal: r.juzAwal || null,
          pojok_awal: r.pojokAwal || null,
          juz_akhir: r.juzAkhir || null,
          pojok_akhir: r.pojokAkhir || null,
          jumlah_halaman: r.jumlahHalaman || 0,
          keterangan: r.keterangan || ''
        }));

        const { error } = await client.from('log_setoran_rows').insert(batch);
        if (error) throw error;

        insertedCount += batch.length;
        setImportProgress(Math.round((insertedCount / validRows.length) * 100));
      }

      showToast('success', `Alhamdulillah, berhasil mengimpor ${insertedCount} data setoran!`);
      setParsedRows([]);
      setFile(null);
      if (onImportSuccess) onImportSuccess();
    } catch (err: any) {
      showToast('error', `Gagal mengimpor ke database: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-6">
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileSpreadsheet size={22} className="text-emerald-600" /> Import Setoran Excel (Ziyadah & Muroja'ah)
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Input data setoran banyak santri sekaligus melalui berkas Excel (.xlsx) atau CSV
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleDownloadTemplate('ziyadah_with_santri')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Download size={14} /> Template Ziyadah + Santri ({santriList?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => handleDownloadTemplate('murojaah_with_santri')}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Download size={14} /> Template Muroja'ah + Santri
          </button>
          <button
            type="button"
            onClick={() => handleDownloadTemplate('ziyadah_blank')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            Kosong Ziyadah
          </button>
          <button
            type="button"
            onClick={() => handleDownloadTemplate('murojaah_blank')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            Kosong Muroja'ah
          </button>
        </div>
      </div>

      <div className="p-6 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/20 text-center space-y-3">
        <Upload size={36} className="mx-auto text-emerald-600" />
        <div>
          <h4 className="text-sm font-bold text-slate-800">Unggah Berkas Excel / CSV Setoran</h4>
          <p className="text-xs text-slate-500 mt-0.5">Pilih berkas template yang telah Anda isi data setoran Ziyadah dan Muroja'ah santri</p>
        </div>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
          className="text-xs font-bold text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
        />
      </div>

      {isProcessing && importProgress > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Mengimpor data ke Supabase...</span>
            <span>{importProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
          </div>
        </div>
      )}

      {parsedRows.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-slate-600">
              Total {parsedRows.length} baris terbaca •{' '}
              <span className="text-emerald-600 font-black">{parsedRows.filter((r) => r.isValid).length} Siap Impor</span> •{' '}
              <span className="text-rose-600 font-black">{parsedRows.filter((r) => !r.isValid).length} Bermasalah</span>
            </div>
            <button
              type="button"
              disabled={isProcessing || parsedRows.filter((r) => r.isValid).length === 0}
              onClick={handleSaveToDatabase}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Save size={15} /> Simpan {parsedRows.filter((r) => r.isValid).length} Baris ke Database
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-80">
            <table className="min-w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-black uppercase sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Baris</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">NIS</th>
                  <th className="px-4 py-3">Santri</th>
                  <th className="px-4 py-3">Tanggal & Sesi</th>
                  <th className="px-4 py-3">Kegiatan</th>
                  <th className="px-4 py-3">Pencapaian</th>
                  <th className="px-4 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((r, i) => (
                  <tr key={i} className={r.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/40 hover:bg-rose-50/70'}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">#{r.rowNum}</td>
                    <td className="px-4 py-3">
                      {r.isValid ? (
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          OK
                        </span>
                      ) : (
                        <span className="text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                          {r.errorMessage}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{r.nis || '-'}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-800">
                      {r.santriNama}
                      {r.santriKelas && (
                        <span className="text-[10px] text-slate-400 font-semibold ml-1.5">({r.santriKelas})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.tanggal} ({r.waktuSesi})
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${r.kegiatan === "Muroja'ah" ? 'text-blue-600' : 'text-emerald-700'}`}>
                        {r.kegiatan}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {r.juzAkhir ? (
                        <span>
                          Juz {r.juzAwal || 1} Pjk {r.pojokAwal || 1} ➔ Juz {r.juzAkhir} Pjk {r.pojokAkhir || 1}
                          <span className="ml-1.5 text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-bold">
                            {r.jumlahHalaman} Hal
                          </span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{r.keterangan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PantauanInputUstadzPanel({ ustadzList, santriList, rawLogs, onRefreshLogs }: any) {
  const [timeframe, setTimeframe] = useState<'hari_ini' | 'harian' | 'mingguan' | 'bulanan'| 'rentang'>('hari_ini');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return String(d.getMonth() + 1).padStart(2, '0');
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'belum' | 'sudah'>('all');
  const [sortBy, setSortBy] = useState<'rajin' | 'malas' | 'kamar' | 'nama'>('malas');
  const [selectedUstadzDetail, setSelectedUstadzDetail] = useState<any>(null);

  // Filter logs sesuai timeframe
  const filteredLogs = useMemo(() => {
    if (!Array.isArray(rawLogs)) return [];

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return rawLogs.filter((log: any) => {
      if (!log.tanggal) return false;
      const logDateStr = String(log.tanggal).split(' ')[0].split('T')[0];

      if (timeframe === 'hari_ini') {
        return logDateStr === todayStr;
      }
      if (timeframe === 'harian') {
        return logDateStr === selectedDate;
      }
      if (timeframe === 'mingguan') {
        const refDate = selectedDate ? new Date(selectedDate) : now;
        const cutoff = new Date(refDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        cutoff.setHours(0, 0, 0, 0);
        const lDate = new Date(logDateStr);
        return !isNaN(lDate.getTime()) && lDate >= cutoff && lDate <= refDate;
      }
      if (timeframe === 'bulanan') {
        const p = logDateStr.split('-');
        return p.length >= 2 && p[1] === selectedMonth;
      }

      if (timeframe === 'rentang') {
        if (startDate && endDate) {
          return logDateStr >= startDate && logDateStr <= endDate;
        }
      return true;
      }
      return true; // <-- PASTIKAN ADA RETURN TRUE DEFAULT INI
    });
  }, [rawLogs, timeframe, selectedDate, selectedMonth, startDate, endDate]);

  // Kalkulasi keaktifan per ustadz
  const ustadzActivity = useMemo(() => {
    if (!Array.isArray(ustadzList)) return [];

    return ustadzList.map((u: any) => {
      const cleanUstadzName = String(u.nama || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      // Santri binaan ustadz ini
      const binaan = (santriList || []).filter((s: any) => {
        const hClean = String(s.halaqoh || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return hClean === cleanUstadzName || hClean.includes(cleanUstadzName) || cleanUstadzName.includes(hClean);
      });

      const binaanIds = new Set(binaan.map((s: any) => String(s.id)));
      const binaanNis = new Set(binaan.map((s: any) => String(s.nis || '').trim()).filter(Boolean));

      // Log setoran yang diinputkan untuk santri binaan ini atau oleh ustadz ini
      const logsThisPeriod = filteredLogs.filter((l: any) => {
        const sId = String(l.santri_id);
        const matchUstadzId = String(l.ustadzah_id) === String(u.id);
        const matchSantri = binaanIds.has(sId) || binaanNis.has(sId);
        return matchUstadzId || matchSantri;
      });

      // Total log historis (untuk cek waktu terakhir pernah input)
      const allUstadzLogs = (rawLogs || []).filter((l: any) => {
        const sId = String(l.santri_id);
        return String(l.ustadzah_id) === String(u.id) || binaanIds.has(sId) || binaanNis.has(sId);
      });

      const lastLog = allUstadzLogs.length > 0
        ? allUstadzLogs.sort((a, b) => String(b.tanggal || '').localeCompare(String(a.tanggal || '')))[0]
        : null;

      // Santri yang sudah disetor vs belum disetor pada timeframe ini
      const santriInputtedIds = new Set(logsThisPeriod.map((l: any) => String(l.santri_id)));
      const santriSudah = binaan.filter((s: any) => santriInputtedIds.has(String(s.id)) || (s.nis && santriInputtedIds.has(String(s.nis))));
      const santriBelum = binaan.filter((s: any) => !santriInputtedIds.has(String(s.id)) && (!s.nis || !santriInputtedIds.has(String(s.nis))));

      const totalInput = logsThisPeriod.length;
      const totalSantriBinaan = binaan.length;
      const persentaseSantriTerinput = totalSantriBinaan > 0 ? Math.round((santriSudah.length / totalSantriBinaan) * 100) : 0;
      const sudahInput = totalInput > 0;

      return {
        ...u,
        binaan,
        totalSantriBinaan,
        totalInput,
        santriSudah,
        santriBelum,
        persentaseSantriTerinput,
        sudahInput,
        lastLogDate: lastLog ? String(lastLog.tanggal).split(' ')[0].split('T')[0] : null,
        kamarNum: safeExtractNum(u.kamar)
      };
    });
  }, [ustadzList, santriList, filteredLogs, rawLogs]);

  // Sorting dan filtering
  const processedUstadz = useMemo(() => {
    let result = [...ustadzActivity];

    if (filterStatus === 'belum') {
      result = result.filter((u) => !u.sudahInput);
    } else if (filterStatus === 'sudah') {
      result = result.filter((u) => u.sudahInput);
    }

    result.sort((a, b) => {
      if (sortBy === 'rajin') {
        if (b.totalInput !== a.totalInput) return b.totalInput - a.totalInput;
        return b.persentaseSantriTerinput - a.persentaseSantriTerinput;
      }
      if (sortBy === 'malas') {
        if (a.totalInput !== b.totalInput) return a.totalInput - b.totalInput;
        return a.persentaseSantriTerinput - b.persentaseSantriTerinput;
      }
      if (sortBy === 'kamar') {
        if (a.kamarNum === 0 && b.kamarNum > 0) return 1;
        if (b.kamarNum === 0 && a.kamarNum > 0) return -1;
        if (a.kamarNum !== b.kamarNum) return a.kamarNum - b.kamarNum;
        return (a.nama || '').localeCompare(b.nama || '');
      }
      if (sortBy === 'nama') {
        return (a.nama || '').localeCompare(b.nama || '');
      }
      return 0;
    });

    return result;
  }, [ustadzActivity, filterStatus, sortBy]);

  // Statistik Ringkasan
  const summary = useMemo(() => {
    const totalUstadz = ustadzActivity.length;
    const sudahInputCount = ustadzActivity.filter((u) => u.sudahInput).length;
    const belumInputCount = totalUstadz - sudahInputCount;
    const pctAktif = totalUstadz > 0 ? Math.round((sudahInputCount / totalUstadz) * 100) : 0;
    const totalSetoranTimeframe = filteredLogs.length;

    // Cari ustadz paling rajin
    const sortedByInput = [...ustadzActivity].sort((a, b) => b.totalInput - a.totalInput);
    const topUstadz = sortedByInput.length > 0 && sortedByInput[0].totalInput > 0 ? sortedByInput[0] : null;

    return {
      totalUstadz,
      sudahInputCount,
      belumInputCount,
      pctAktif,
      totalSetoranTimeframe,
      topUstadz
    };
  }, [ustadzActivity, filteredLogs]);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-emerald-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-3 rounded-2xl shadow-md">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800">
              Pantauan <span className="text-emerald-600">Penginputan Setoran</span>
            </h1>
            <p className="text-xs text-slate-500 font-bold tracking-wider mt-0.5">
              Monitoring Keaktifan Ustadz Pembimbing • Deteksi Ustadz Belum Input & Peringkat Keaktifan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end">
          {onRefreshLogs && (
            <button
              onClick={onRefreshLogs}
              title="Segarkan Data Dari Database"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw size={15} /> Segarkan Data
            </button>
          )}
        </div>
      </div>

      {/* Selector Timeframe & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Calendar size={15} className="text-emerald-600" /> Timeframe:
          </span>

          <button
            type="button"
            onClick={() => setTimeframe('hari_ini')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              timeframe === 'hari_ini'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Hari Ini
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('harian')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              timeframe === 'harian'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Pilih Tanggal
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('mingguan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              timeframe === 'mingguan'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            7 Hari Terakhir
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('bulanan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              timeframe === 'bulanan'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Bulanan
          </button>

        <button
            type="button"
            onClick={() => setTimeframe('rentang')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              timeframe === 'rentang'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Rentang Waktu
          </button>

          {timeframe === 'harian' && (
            <input
              type="date"
              className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          )}

          {timeframe === 'bulanan' && (
            <select
              className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {DAFTAR_BULAN.filter((b) => b.kode !== 'all').map((b) => (
                <option key={b.kode} value={b.kode}>
                  Bulan {b.nama}
                </option>
              ))}
            </select>
          )}
          {/* === TAMBAHAN INPUT TANGGAL START & END UNTUK MODE RENTANG === */}
          {timeframe === 'rentang' && (
            <div className="flex items-center gap-2 ml-1">
              <input
                type="date"
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-[10px] font-black text-slate-400">s/d</span>
              <input
                type="date"
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
        </div>
        )}
        </div>  
          
        {/* Urutan & Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl">
            <Filter size={13} className="text-slate-500" />
            <select
              className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status ({ustadzActivity.length})</option>
              <option value="belum">🔴 Belum Input Saja ({summary.belumInputCount})</option>
              <option value="sudah">🟢 Sudah Input Saja ({summary.sudahInputCount})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl">
            <ArrowUpDown size={13} className="text-emerald-600" />
            <select
              className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
            >
              <option value="malas">⚠️ Paling Sedikit / Belum Input (Urut Atas)</option>
              <option value="rajin">🔥 Paling Rajin (Input Terbanyak)</option>
              <option value="kamar">Nomor Kamar (1 → 99)</option>
              <option value="nama">Nama Ustadz (A → Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-emerald-600" /> Total Ustadz
          </div>
          <div className="text-4xl font-black text-slate-800 mt-2">{summary.totalUstadz}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Pembimbing halaqoh aktif</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100 bg-rose-50/20">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
            <X size={16} className="text-rose-600" /> Belum Menginput
          </div>
          <div className="text-4xl font-black text-rose-600 mt-2">{summary.belumInputCount}</div>
          <div className="text-[11px] font-bold text-rose-600 mt-1">
            {summary.belumInputCount > 0 ? 'Perlu difollow-up segera' : 'Luar biasa, semua telah input!'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
            <Check size={16} className="text-emerald-600" /> Keaktifan Penginputan
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-700">{summary.pctAktif}%</span>
            <span className="text-xs font-bold text-slate-500">({summary.sudahInputCount} Ustadz)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                summary.pctAktif < 50 ? 'bg-rose-500' : summary.pctAktif < 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${summary.pctAktif}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
            <Medal size={16} className="text-amber-500" /> Terajin Periode Ini
          </div>
          {summary.topUstadz ? (
            <div className="mt-2">
              <div className="font-black text-slate-800 text-sm truncate" title={summary.topUstadz.nama}>
                {summary.topUstadz.nama}
              </div>
              <div className="text-xs font-bold text-emerald-600 mt-0.5">
                {summary.topUstadz.totalInput} setoran terinput
              </div>
            </div>
          ) : (
            <div className="text-sm font-bold text-slate-400 mt-2">Belum ada input</div>
          )}
          <div className="text-[11px] font-bold text-slate-400 mt-1">
            Total {summary.totalSetoranTimeframe} setoran masuk
          </div>
        </div>
      </div>

      {/* Tabel Utama Pantauan Keaktifan */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
              <History size={16} className="text-emerald-600" /> Daftar Rekap Keaktifan Ustadz ({processedUstadz.length})
            </h3>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">
              Periode:{' '}
              {timeframe === 'hari_ini'
                ? 'Hari Ini'
                : timeframe === 'harian'
                ? `Tanggal ${selectedDate}`
                : timeframe === 'mingguan'
                ? '7 Hari Terakhir'
                : timeframe === 'rentang'
                ? `Rentang ${startDate || '?'} s/d ${endDate || '?'}`
                : `Bulan ${DAFTAR_BULAN.find((b) => b.kode === selectedMonth)?.nama || selectedMonth}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg">
              ● {summary.belumInputCount} Belum Input
            </span>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
              ✓ {summary.sudahInputCount} Sudah Input
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="px-4 py-3.5 text-center w-14">Kamar</th>
                <th className="px-5 py-3.5">Nama Ustadz</th>
                <th className="px-4 py-3.5 text-center">Binaan</th>
                <th className="px-4 py-3.5 text-center">Setoran Masuk</th>
                <th className="px-4 py-3.5 text-center">Progress Santri</th>
                <th className="px-4 py-3.5 text-center">Status Input</th>
                <th className="px-4 py-3.5">Terakhir Input</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedUstadz.map((u: any, idx: number) => {
                const isTop = sortBy === 'rajin' && idx === 0 && u.totalInput > 0;
                const isZero = u.totalInput === 0;

                return (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      isZero
                        ? 'bg-rose-50/20 hover:bg-rose-50/50'
                        : isTop
                        ? 'bg-amber-50/30 hover:bg-amber-50/50'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <span className="bg-slate-100 border border-slate-200 font-black text-slate-700 px-2.5 py-1 rounded-lg">
                        {u.kamar ? u.kamar : '-'}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {isTop && (
                          <span title="Paling Rajin" className="text-amber-500 font-bold">
                            👑
                          </span>
                        )}
                        <div>
                          <div className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                            {u.nama}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">
                            {u.totalSantriBinaan} santri dalam halaqoh
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center font-bold text-slate-600">
                      {u.totalSantriBinaan}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`font-black text-sm ${
                          u.totalInput > 0 ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {u.totalInput}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block">setoran</span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-700 text-xs">
                          {u.santriSudah.length} / {u.totalSantriBinaan} ({u.persentaseSantriTerinput}%)
                        </span>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              u.persentaseSantriTerinput === 100
                                ? 'bg-emerald-500'
                                : u.persentaseSantriTerinput > 0
                                ? 'bg-teal-500'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${u.persentaseSantriTerinput}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {u.sudahInput ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-lg">
                          <Check size={11} /> SUDAH INPUT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-black px-2.5 py-1 rounded-lg animate-pulse">
                          <X size={11} /> BELUM INPUT
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {u.lastLogDate ? (
                        <span className="font-bold text-slate-600 text-xs">{u.lastLogDate}</span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Belum pernah</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedUstadzDetail(u)}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}

              {processedUstadz.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    Tidak ada data ustadz yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Santri Binaan Ustadz Terpilih */}
      {selectedUstadzDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-100 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                  {selectedUstadzDetail.nama}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  Kamar: {selectedUstadzDetail.kamar || '-'} • Total Binaan: {selectedUstadzDetail.totalSantriBinaan} Santri • {selectedUstadzDetail.totalInput} Setoran Terinput
                </p>
              </div>
              <button
                onClick={() => setSelectedUstadzDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[11px] font-black text-emerald-800 uppercase block">
                    ✓ Sudah Diinput ({selectedUstadzDetail.santriSudah.length})
                  </span>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Santri yang telah disetorkan</p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[11px] font-black text-rose-800 uppercase block">
                    ⚠ Belum Diinput ({selectedUstadzDetail.santriBelum.length})
                  </span>
                  <p className="text-[11px] text-rose-600 font-semibold mt-0.5">Santri yang belum disetorkan</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Daftar Santri Binaan ({selectedUstadzDetail.binaan.length}):
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  {selectedUstadzDetail.binaan.map((s: any) => {
                    const isSudah = selectedUstadzDetail.santriSudah.some((sdh: any) => sdh.id === s.id);
                    return (
                      <div key={s.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <div className="font-extrabold text-slate-800 text-xs">{s.nama}</div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            NIS: {s.nis || '-'} • Kelas: {s.kelas || '-'} • Kamar: {s.kamar || '-'}
                          </div>
                        </div>
                        <div>
                          {isSudah ? (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                              SUDAH
                            </span>
                          ) : (
                            <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                              BELUM
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {selectedUstadzDetail.binaan.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 font-bold">
                      Belum ada data santri yang terhubung dengan halaqoh ini.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUstadzDetail(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminView({ onBack }: any) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  const [ustadz, setUstadz] = useState<any[]>([]);
  const [santri, setSantri] = useState<any[]>([]);
  const [rawLogs, setRawLogs] = useState<any[]>([]);

  const [rekapData, setRekapData] = useState<any[]>([]);
  const [selectedSantri, setSelectedSantri] = useState<any>(null);
  const [santriHistoryDetails, setSantriHistoryDetails] = useState<any[]>([]);
  const [filterHalaqoh, setFilterHalaqoh] = useState('');

  const [customTargetsLembaga, setCustomTargetsLembaga] = useState<Record<string, { juz: number; pojokan: number }>>({});
  const [customTargetsPojokan, setCustomTargetsPojokan] = useState<Record<string, number>>({});
  const [customTargetsDeresan, setCustomTargetsDeresan] = useState<Record<string, number>>({});

  const [editingLog, setEditingLog] = useState<any>(null);
  const [editLogForm, setEditLogForm] = useState<any>({});

  // State Edit Santri & Edit Ustadz
  const [editingSantri, setEditingSantri] = useState<any>(null);
  const [editSantriForm, setEditSantriForm] = useState<any>({
    nis: '',
    nama: '',
    kelas: '',
    kamar: '',
    halaqoh: '',
    status_aktif: 'Masih Ziyadah'
  });
  const [searchSantri, setSearchSantri] = useState('');
  const [sortSantriAdmin, setSortSantriAdmin] = useState('nama-asc');
  const [isSavingSantri, setIsSavingSantri] = useState(false);

  const [isAddingSantri, setIsAddingSantri] = useState(false);
  const [newSantriForm, setNewSantriForm] = useState<any>({
    nis: '',
    nama: '',
    kelas: '',
    kamar: '',
    halaqoh: '',
    status_aktif: 'Masih Ziyadah'
  });
  const [isCreatingSantri, setIsCreatingSantri] = useState(false);
  const [deletingSantri, setDeletingSantri] = useState<any>(null);
  const [isDeletingSantri, setIsDeletingSantri] = useState(false);

  const handleCreateSantri = async (e: any) => {
    e.preventDefault();
    if (!newSantriForm.nama.trim() || !newSantriForm.nis.trim()) return;
    setIsCreatingSantri(true);
    const client = await getSupabase();
    if (!client) {
      setIsCreatingSantri(false);
      return;
    }

    try {
      const newId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'santri_' + Date.now();

      const newRecord = {
        id: newId,
        nis: newSantriForm.nis.trim(),
        nama: newSantriForm.nama.trim(),
        kelas: newSantriForm.kelas.trim(),
        kamar: newSantriForm.kamar.trim(),
        halaqoh: newSantriForm.halaqoh.trim(),
        status_aktif: newSantriForm.status_aktif || 'Masih Ziyadah'
      };

      const { error } = await client.from('santri_rows').insert([newRecord]);
      if (error) throw error;

      setSantri((prev) => [...prev, newRecord]);
      setIsAddingSantri(false);
      setNewSantriForm({
        nis: '',
        nama: '',
        kelas: '',
        kamar: '',
        halaqoh: '',
        status_aktif: 'Masih Ziyadah'
      });
    } catch (err) {
      console.error('Gagal menambahkan santri:', err);
    } finally {
      setIsCreatingSantri(false);
    }
  };

  const handleConfirmDeleteSantri = async () => {
    if (!deletingSantri) return;
    setIsDeletingSantri(true);
    const client = await getSupabase();
    if (!client) {
      setIsDeletingSantri(false);
      return;
    }

    try {
      const { error } = await client
        .from('santri_rows')
        .delete()
        .eq('id', deletingSantri.id);

      if (error) throw error;

      setSantri((prev) => prev.filter((s) => s.id !== deletingSantri.id));
      setDeletingSantri(null);
    } catch (err) {
      console.error('Gagal menghapus santri:', err);
    } finally {
      setIsDeletingSantri(false);
    }
  };

  const handleUpdateSantriStatus = async (santriId: string, newStatus: string) => {
    setSantri((prev) =>
      prev.map((s) => (s.id === santriId ? { ...s, status_aktif: newStatus, status: newStatus } : s))
    );
    const client = await getSupabase();
    if (!client) return;

    try {
      await client
        .from('santri_rows')
        .update({
          status_aktif: newStatus,
          status: newStatus
        })
        .eq('id', santriId);
    } catch (err) {
      console.error('Gagal memperbarui status santri:', err);
    }
  };

  const [editingUstadz, setEditingUstadz] = useState<any>(null);
  const [editUstadzForm, setEditUstadzForm] = useState<any>({
    nama: '',
    kamar: '',
    password: ''
  });
  const [searchUstadz, setSearchUstadz] = useState('');
  const [sortUstadzAdmin, setSortUstadzAdmin] = useState('kamar-asc');
  const [isSavingUstadz, setIsSavingUstadz] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const client = await getSupabase();
    if (!client) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: dUstadz } = await client.from('ustadz_rows').select('*').order('nama');
      if (dUstadz) setUstadz(dUstadz);

      const { data: dSantri } = await client.from('santri_rows').select('*').order('nama');
      if (dSantri) setSantri(dSantri);

      try {
        const { data: dLembaga } = await client.from('target_lembaga_rows').select('*');
        if (dLembaga && Array.isArray(dLembaga)) {
          const map: Record<string, { juz: number; pojokan: number }> = {};
          dLembaga.forEach((row: any) => {
            map[`${row.bulan}_${row.kelas}`] = { juz: row.juz || 0, pojokan: row.pojokan || 0 };
          });
          setCustomTargetsLembaga(map);
        }
      } catch (e) {
        console.warn('Tabel target_lembaga_rows belum siap:', e);
      }

      try {
        const { data: dPojokan } = await client.from('target_pojokan_rows').select('*');
        if (dPojokan && Array.isArray(dPojokan)) {
          const map: Record<string, number> = {};
          dPojokan.forEach((row: any) => {
            map[`${row.bulan}_${row.kelas}`] = row.jumlah_pojokan || 0;
          });
          setCustomTargetsPojokan(map);
        }
      } catch (e) {
        console.warn('Tabel target_pojokan_rows belum siap:', e);
      }

      try {
        const { data: dDeresan } = await client.from('target_deresan_rows').select('*');
        if (dDeresan && Array.isArray(dDeresan)) {
          const map: Record<string, number> = {};
          dDeresan.forEach((row: any) => {
            map[`${row.bulan}_${row.kelas}`] = row.jumlah_pojokan || 0;
          });
          setCustomTargetsDeresan(map);
        }
      } catch (e) {
        console.warn('Tabel target_deresan_rows belum siap:', e);
      }

      let allLogs: any[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: logBatch, error } = await client
          .from('log_setoran_rows')
          .select('*')
          .order('tanggal', { ascending: false })
          .range(from, from + pageSize - 1);

        if (error || !logBatch || logBatch.length === 0) {
          hasMore = false;
        } else {
          allLogs = [...allLogs, ...logBatch];
          if (logBatch.length < pageSize) {
            hasMore = false;
          } else {
            from += pageSize;
          }
        }
      }
      setRawLogs(allLogs);
    } catch (err) {
      console.error('Error fetch data admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminLogin = (e: any) => {
    e.preventDefault();
    if (adminPassword === '11223344') {
      setIsAdminLoggedIn(true);
      setAdminLoginError('');
    } else {
      setAdminLoginError('Password salah!');
    }
  };

  useEffect(() => {
    let filtered = santri;
    if (filterHalaqoh) {
      filtered = santri.filter((s) => s.halaqoh === filterHalaqoh);
    }

    const rekap = filtered.map((s) => {
      const logs = rawLogs.filter((l) => l.santri_id === s.id || l.santri_id === s.nis);
      
      const lastZiyadah = logs.find(
        (l) => l.kegiatan && l.kegiatan.toLowerCase().includes('ziyadah') && l.juz_akhir
      );
      // TAMBAHAN: Pisahkan Deresan A dan Deresan B
      const lastDeresanA = logs.find(
        (l) => l.kegiatan && l.kegiatan.toLowerCase() === 'deresan a' && l.juz_akhir
      );
      const lastDeresanB = logs.find(
        (l) => l.kegiatan && l.kegiatan.toLowerCase() === 'deresan b' && l.juz_akhir
      );

      return {
        ...s,
        lastZiyadah,
        lastDeresanA, // Gunakan variabel baru
        lastDeresanB, // Gunakan variabel baru
        totalLogs: logs.length
      };
    });

    setRekapData(rekap);
  }, [santri, rawLogs, filterHalaqoh]);

  const handleViewHistory = async (s: any) => {
    setSelectedSantri(s);
    const client = await getSupabase();
    if (!client) return;

    const { data } = await client
      .from('log_setoran_rows')
      .select('*')
      .or(`santri_id.eq.${s.id},santri_id.eq.${s.nis}`)
      .order('tanggal', { ascending: false });

    if (data) setSantriHistoryDetails(data);
  };

  const handleDeleteSingleLog = async (logId: string) => {
    const client = await getSupabase();
    if (!client) return;

    const { error } = await client.from('log_setoran_rows').delete().eq('id', logId);
    if (!error) {
      setSantriHistoryDetails((prev) => prev.filter((l) => l.id !== logId));
      setRawLogs((prev) => prev.filter((l) => l.id !== logId));
    }
  };

  const handleDeleteAllLogs = async (santriObj: any) => {
    const client = await getSupabase();
    if (!client) return;

    const { error } = await client
      .from('log_setoran_rows')
      .delete()
      .or(`santri_id.eq.${santriObj.id},santri_id.eq.${santriObj.nis}`);

    if (!error) {
      setSantriHistoryDetails([]);
      setRawLogs((prev) => prev.filter((l) => l.santri_id !== santriObj.id && l.santri_id !== santriObj.nis));
    }
  };

  const handleSaveEditLog = async (e: any) => {
    e.preventDefault();
    const client = await getSupabase();
    if (!client || !editingLog) return;

    let totalHalaman = 0;
    if (editLogForm.juz_awal && editLogForm.pojok_awal && editLogForm.juz_akhir && editLogForm.pojok_akhir) {
      totalHalaman = calculateHalamanCount(
        editLogForm.juz_awal,
        editLogForm.pojok_awal,
        editLogForm.juz_akhir,
        editLogForm.pojok_akhir,
        editLogForm.kegiatan
      );
    }

    const { error } = await client
      .from('log_setoran_rows')
      .update({
        tanggal: editLogForm.tanggal,
        waktu_sesi: editLogForm.waktu_sesi,
        kehadiran: editLogForm.kehadiran,
        kegiatan: editLogForm.kegiatan,
        juz_awal: editLogForm.juz_awal ? parseInt(editLogForm.juz_awal) : null,
        pojok_awal: editLogForm.pojok_awal ? parseInt(editLogForm.pojok_awal) : null,
        juz_akhir: editLogForm.juz_akhir ? parseInt(editLogForm.juz_akhir) : null,
        pojok_akhir: editLogForm.pojok_akhir ? parseInt(editLogForm.pojok_akhir) : null,
        jumlah_halaman: totalHalaman,
        keterangan: editLogForm.keterangan
      })
      .eq('id', editingLog.id);

    if (!error) {
      setEditingLog(null);
      if (selectedSantri) handleViewHistory(selectedSantri);
      fetchData();
    }
  };

  const handleOpenEditSantri = (s: any) => {
    setEditingSantri(s);
    setEditSantriForm({
      nis: s.nis || '',
      nama: s.nama || '',
      kelas: s.kelas || '',
      kamar: s.kamar || '',
      halaqoh: s.halaqoh || '',
      status_aktif: s.status_aktif || s.status || 'Masih Ziyadah'
    });
  };

  const handleSaveSantriEdit = async (e: any) => {
    e.preventDefault();
    if (!editingSantri) return;
    setIsSavingSantri(true);
    const client = await getSupabase();
    if (!client) {
      setIsSavingSantri(false);
      return;
    }

    try {
      const updateData: any = {
        nis: editSantriForm.nis,
        nama: editSantriForm.nama,
        kelas: editSantriForm.kelas,
        kamar: editSantriForm.kamar,
        halaqoh: editSantriForm.halaqoh,
        status_aktif: editSantriForm.status_aktif || 'Masih Ziyadah'
      };

      const { error } = await client
        .from('santri_rows')
        .update(updateData)
        .eq('id', editingSantri.id);

      if (error) throw error;

      setSantri((prev) =>
        prev.map((s) => (s.id === editingSantri.id ? { ...s, ...updateData, status: updateData.status_aktif } : s))
      );
      setEditingSantri(null);
    } catch (err: any) {
      console.error('Gagal menyimpan data santri:', err);
    } finally {
      setIsSavingSantri(false);
    }
  };

  const handleOpenEditUstadz = (u: any) => {
    setEditingUstadz(u);
    setEditUstadzForm({
      nama: u.nama || '',
      kamar: u.kamar || '',
      password: u.password || ''
    });
  };

  const handleSaveUstadzEdit = async (e: any) => {
    e.preventDefault();
    if (!editingUstadz) return;
    setIsSavingUstadz(true);
    const client = await getSupabase();
    if (!client) {
      setIsSavingUstadz(false);
      return;
    }

    try {
      const { error } = await client
        .from('ustadz_rows')
        .update({
          nama: editUstadzForm.nama,
          kamar: editUstadzForm.kamar,
          password: editUstadzForm.password
        })
        .eq('id', editingUstadz.id);

      if (error) throw error;

      setUstadz((prev) =>
        prev.map((u) => (u.id === editingUstadz.id ? { ...u, ...editUstadzForm } : u))
      );
      setEditingUstadz(null);
    } catch (err: any) {
      console.error('Gagal menyimpan data ustadz:', err);
    } finally {
      setIsSavingUstadz(false);
    }
  };

  const filteredSantriAdmin = useMemo(() => {
    let result = [...santri];
    if (searchSantri.trim()) {
      const q = searchSantri.toLowerCase();
      result = result.filter((s) => {
        const nama = String(s.nama || '').toLowerCase();
        const nis = String(s.nis || '').toLowerCase();
        const kelas = String(s.kelas || '').toLowerCase();
        const halaqoh = String(s.halaqoh || '').toLowerCase();
        const kamar = String(s.kamar || '').toLowerCase();
        return nama.includes(q) || nis.includes(q) || kelas.includes(q) || halaqoh.includes(q) || kamar.includes(q);
      });
    }

    result.sort((a, b) => {
      if (sortSantriAdmin === 'nama-asc') return (a.nama || '').localeCompare(b.nama || '');
      if (sortSantriAdmin === 'nama-desc') return (b.nama || '').localeCompare(a.nama || '');
      if (sortSantriAdmin === 'nis-asc') {
        const nA = safeExtractNum(a.nis);
        const nB = safeExtractNum(b.nis);
        if (nA !== nB) return nA - nB;
        return String(a.nis || '').localeCompare(String(b.nis || ''));
      }
      if (sortSantriAdmin === 'nis-desc') {
        const nA = safeExtractNum(a.nis);
        const nB = safeExtractNum(b.nis);
        if (nA !== nB) return nB - nA;
        return String(b.nis || '').localeCompare(String(a.nis || ''));
      }
      if (sortSantriAdmin === 'kelas-asc') {
        const kA = safeExtractNum(mapKelasTarget(a.kelas)) || 99;
        const kB = safeExtractNum(mapKelasTarget(b.kelas)) || 99;
        if (kA !== kB) return kA - kB;
        return String(a.kelas || '').localeCompare(String(b.kelas || ''));
      }
      if (sortSantriAdmin === 'kamar-asc') {
        const kmA = safeExtractNum(a.kamar) || 999;
        const kmB = safeExtractNum(b.kamar) || 999;
        if (kmA !== kmB) return kmA - kmB;
        return String(a.kamar || '').localeCompare(String(b.kamar || ''));
      }
      if (sortSantriAdmin === 'halaqoh-asc') return String(a.halaqoh || '').localeCompare(String(b.halaqoh || ''));
      return 0;
    });

    return result;
  }, [santri, searchSantri, sortSantriAdmin]);

  const filteredUstadzAdmin = useMemo(() => {
    let result = [...ustadz];
    if (searchUstadz.trim()) {
      const q = searchUstadz.toLowerCase();
      result = result.filter((u) => {
        const nama = String(u.nama || '').toLowerCase();
        const kamar = String(u.kamar || '').toLowerCase();
        return nama.includes(q) || kamar.includes(q);
      });
    }

    result.sort((a, b) => {
      if (sortUstadzAdmin === 'kamar-asc') {
        const kA = safeExtractNum(a.kamar);
        const kB = safeExtractNum(b.kamar);
        if (kA === 0 && kB > 0) return 1;
        if (kB === 0 && kA > 0) return -1;
        if (kA !== kB) return kA - kB;
        return (a.nama || '').localeCompare(b.nama || '');
      }
      if (sortUstadzAdmin === 'kamar-desc') {
        const kA = safeExtractNum(a.kamar);
        const kB = safeExtractNum(b.kamar);
        if (kA === 0 && kB > 0) return 1;
        if (kB === 0 && kA > 0) return -1;
        if (kA !== kB) return kB - kA;
        return (b.nama || '').localeCompare(a.nama || '');
      }
      if (sortUstadzAdmin === 'nama-asc') return (a.nama || '').localeCompare(b.nama || '');
      if (sortUstadzAdmin === 'nama-desc') return (b.nama || '').localeCompare(a.nama || '');
      return 0;
    });

    return result;
  }, [ustadz, searchUstadz, sortUstadzAdmin]);

  if (!isAdminLoggedIn) {
    return (
      <div
        className="min-h-screen w-full bg-emerald-950 flex items-center justify-center p-4 relative"
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#022c22'
        }}
      >
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Portal
        </button>

        <div
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 md:p-8"
          style={{ maxWidth: '28rem', width: '100%', backgroundColor: '#ffffff', borderRadius: '1.5rem' }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Admin Tahfidh Putra</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">Masukkan kunci otentikasi administrator</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {adminLoginError && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">
                {adminLoginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Password Admin</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-800"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
            >
              Buka Akses Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

return (
    <div
      className="min-h-screen w-full bg-slate-100 flex flex-col md:flex-row relative"
      style={{ minHeight: '100vh', width: '100%' }}
    >
      {/* Mobile Top Navbar Bar (Khusus Layar HP / Mobile agar tidak menutupi dashboard) */}
      <div className="md:hidden bg-emerald-900 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-800 rounded-lg">
            <ShieldCheck size={20} className="text-emerald-300" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white leading-tight">Admin Putra</h1>
            <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
              {activeTab === 'dashboard' ? 'Dashboard Live' :
               activeTab === 'pantauan_input' ? 'Pantauan Input' :
               activeTab === 'laporan' ? 'Laporan Format Excel' :
               activeTab === 'import' ? 'Import Excel' :
               activeTab === 'target' ? 'Pengaturan Target' :
               activeTab === 'rekap' ? 'Data & Riwayat' :
               activeTab === 'santri' ? 'Data Santri' : 
               activeTab === 'ustadz' ? 'Data Ustadz':
               activeTab === 'penilaian' ? 'Penilaian Kinerja SMP':'Dashboard'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-xl text-white transition-colors"
          title="Buka Menu Navigasi"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop Gelap saat Menu Mobile Terbuka */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation: Auto-Hide saat tidak tersorot & Melebar saat tersorot */}
      {(() => {
        const isExpanded = isSidebarPinned || isSidebarHovered;
        return (
          <div
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            className={`bg-emerald-900 text-white flex-shrink-0 flex flex-col justify-between shadow-2xl md:shadow-xl z-50 transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'fixed inset-y-0 left-0 w-72 p-5 translate-x-0'
                : `fixed inset-y-0 left-0 -translate-x-full md:relative md:translate-x-0 md:flex ${
                    isExpanded ? 'md:w-64 p-5' : 'md:w-20 p-3'
                  }`
            }`}
          >
            <div>
              <div
                className={`flex items-center pb-4 border-b border-emerald-800 transition-all ${
                  isExpanded ? 'justify-between' : 'justify-center'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-emerald-800 rounded-xl flex-shrink-0 shadow-inner">
                    <ShieldCheck size={22} className="text-emerald-300" />
                  </div>
                  {isExpanded && (
                    <div className="animate-in fade-in duration-200">
                      <h1 className="font-black text-base text-white tracking-tight leading-tight">Admin Putra</h1>
                      <p className="text-[10px] text-emerald-300 font-bold tracking-wider">MANAJEMEN TAHFIDH</p>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsSidebarPinned(!isSidebarPinned)}
                      className={`hidden md:flex p-1.5 rounded-lg transition-colors text-xs font-bold ${
                        isSidebarPinned
                          ? 'bg-emerald-700 text-white'
                          : 'text-emerald-400 hover:text-white hover:bg-emerald-800'
                      }`}
                      title={isSidebarPinned ? 'Kunci Menu Aktif (Klik untuk Auto-Hide)' : 'Kunci Menu Terbuka'}
                    >
                      📌
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="md:hidden p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg"
                      title="Tutup Menu"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <nav className="mt-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-190px)]">
                {[
                  { id: 'dashboard', label: 'Dashboard Live', icon: <Activity size={18} /> },
                  { id: 'pantauan_input', label: 'Pantauan Input Ustadz', icon: <History size={18} /> },
                  { id: 'laporan', label: 'Laporan Format Excel', icon: <Printer size={18} /> },
                  { id: 'import', label: 'Import Excel Setoran', icon: <FileSpreadsheet size={18} /> },
                  { id: 'target', label: 'Pengaturan Target', icon: <Sliders size={18} /> },
                  { id: 'rekap', label: 'Data Terakhir & Riwayat', icon: <History size={18} /> },
                  { id: 'santri', label: 'Data Santri Putra', icon: <BookOpen size={18} /> },
                  { id: 'ustadz', label: 'Data Ustadz', icon: <Users size={18} /> },
                  { id: 'penilaian', label: 'Penilaian Kinerja SMP', icon: <ExternalLink size={18} /> },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      title={item.label}
                      className={`w-full flex items-center rounded-xl text-xs font-black transition-all ${
                        isExpanded ? 'px-3.5 py-3 gap-3 justify-start' : 'px-0 py-3 justify-center'
                      } ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-md'
                          : 'text-emerald-200 hover:bg-emerald-800/60'
                      }`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {isExpanded && (
                        <span className="truncate whitespace-nowrap animate-in fade-in duration-150">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={onBack}
              title="Ke Portal Beranda"
              className={`mt-4 flex items-center text-emerald-300 hover:text-white text-xs font-bold bg-emerald-800/40 hover:bg-emerald-800 rounded-xl transition-all ${
                isExpanded ? 'p-3 gap-2 justify-start' : 'p-3 justify-center'
              }`}
            >
              <ArrowLeft size={16} className="flex-shrink-0" />
              {isExpanded && <span className="truncate whitespace-nowrap">Ke Portal Beranda</span>}
            </button>
          </div>
        );
      })()}

      <div className="flex-grow p-4 md:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'dashboard' && (
          <DashboardLivePanel
            santriList={santri}
            rawLogs={rawLogs}
            isLoading={isLoading}
            ustadzList={ustadz}
            onRefreshLogs={fetchData}
            customTargetsLembaga={customTargetsLembaga}
            customTargetsPojokan={customTargetsPojokan}
            customTargetsDeresan={customTargetsDeresan}
          />
        )}

        {/* Halaman Dashboard Penilaian (Iframe Blogspot) */}
        {activeTab === 'penilaian' && (
          <div className="w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200">
            <iframe 
              src="https://lap-pondokputra.vercel.app/"
              title="Penilaian Kinerja SMP"
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>
        )}

        {activeTab === 'pantauan_input' && (
          <PantauanInputUstadzPanel
            ustadzList={ustadz}
            santriList={santri}
            rawLogs={rawLogs}
            onRefreshLogs={fetchData}
          />
        )}

        {activeTab === 'laporan' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Printer size={22} className="text-emerald-600" /> Dokumen & Laporan Format Excel Otentik
                </h2>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Buka, cetak (PDF Landscape/Portrait), atau unduh langsung file laporan dalam format grid spreadsheet asli.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kartu 1: Laporan Matrix Halaqoh */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        Laporan I
                      </span>
                      <FileSpreadsheet size={18} className="text-emerald-600" />
                    </div>
                    <h3 className="text-base font-black text-slate-800">
                      Rekapitulasi Target Halaqoh (Matrix 3 Target)
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Matrix evaluasi lengkap per halaqoh: Target Pojokan, Target Lembaga, IP (Indikator Progres), dan Target Deresan.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href="/laporan_matrix.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Buka Laporan Penuh</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Kartu 2: Pantauan Perkembangan Hafalan */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-lg">
                        Laporan II
                      </span>
                      <FileSpreadsheet size={18} className="text-teal-600" />
                    </div>
                    <h3 className="text-base font-black text-slate-800">
                      II. Pantauan Perkembangan Hafalan Santri
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Rangkuman Target Pojokan, Persentase per Kelas (VII–XII), Target Lembaga, dan Target Deresan (Page 1 & 2).
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href="/pantauan_hafalan.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Buka Laporan Penuh</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Kartu 3: Rekapitulasi Pendapatan Perkelas */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                        Laporan III
                      </span>
                      <FileSpreadsheet size={18} className="text-amber-600" />
                    </div>
                    <h3 className="text-base font-black text-slate-800">
                      III. Rekapitulasi Pendapatan Hafalan Perkelas
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Distribusi santri per juz (Khotimin, Khatam, Juz 30 s/d Juz 1, dan Belum Setor) untuk kelas VII sampai XII.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href="/rekap_perkelas.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Buka Laporan Penuh</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Kartu 4: Rincian Rekap Data Santri */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg">
                        Laporan V
                      </span>
                      <FileSpreadsheet size={18} className="text-blue-600" />
                    </div>
                    <h3 className="text-base font-black text-slate-800">
                      V. Rincian Rekap Data Perkembangan Hafalan
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Data riil per-santri lengkap: Ziyadah Awal/Akhir, Deresan A (Asar), Deresan B (Maghrib/Isya'), status Y/N, dan presensi.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href="/rincian_rekap.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Buka Laporan Penuh</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <ImportExcelPanel
            santriList={santri}
            ustadzList={ustadz}
            onImportSuccess={fetchData}
          />
        )}

        {activeTab === 'target' && (
          <PengaturanTargetPanel onRefresh={fetchData} />
        )}

        {activeTab === 'rekap' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            {selectedSantri ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedSantri(null)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">{selectedSantri.nama}</h3>
                      <p className="text-xs text-slate-500 font-bold">
                        NIS: {selectedSantri.nis} • Kelas: {selectedSantri.kelas} • Halaqoh: {selectedSantri.halaqoh}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAllLogs(selectedSantri)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={15} /> Hapus Semua Riwayat Santri
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Tanggal & Sesi</th>
                        <th className="px-4 py-3">Kehadiran</th>
                        <th className="px-4 py-3">Kegiatan</th>
                        <th className="px-4 py-3">Pencapaian</th>
                        <th className="px-4 py-3">Keterangan</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {santriHistoryDetails.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-800">{log.tanggal}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{log.waktu_sesi}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {log.kehadiran}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-700">{log.kegiatan}</td>
                          <td className="px-4 py-3">
                            {log.juz_akhir ? (
                              <div className="font-extrabold text-emerald-700">
                                Juz {log.juz_awal} Pjk {log.pojok_awal} ➔ Juz {log.juz_akhir} Pjk {log.pojok_akhir}
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500">{log.keterangan || '-'}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingLog(log);
                                  setEditLogForm(log);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteSingleLog(log.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                                title="Hapus"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {santriHistoryDetails.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-slate-400 font-bold">
                            Belum ada riwayat setoran untuk santri ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-lg font-black text-slate-800">Capaian Terakhir Santri</h2>
                    <p className="text-xs text-slate-500 font-bold">Monitoring hafalan terakhir seluruh santri</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter size={15} className="text-slate-400" />
                    <select
                      className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 outline-none"
                      value={filterHalaqoh}
                      onChange={(e) => setFilterHalaqoh(e.target.value)}
                    >
                      <option value="">Semua Halaqoh</option>
                      {ustadz.map((u) => (
                        <option key={u.id} value={u.nama}>
                          {u.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left whitespace-nowrap">
                   <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">NAMA SANTRI</th>
                        <th className="px-5 py-3">HALAQOH</th>
                        <th className="px-5 py-3">ZIYADAH TERAKHIR</th>
                        <th className="px-5 py-3">DERESAN A TERAKHIR</th>
                        <th className="px-5 py-3">DERESAN B TERAKHIR</th>
                        <th className="px-5 py-3 text-center">AKSI</th>
                      </tr>
                    </thead>
                   <tbody className="divide-y divide-slate-100">
                      {rekapData.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          {/* 1. Nama Santri */}
                          <td className="px-5 py-3">
                            <div className="font-extrabold text-slate-800 text-sm">{s.nama}</div>
                            <div className="text-[10px] text-slate-400 font-bold">
                              NIS: {s.nis} • Kelas: {s.kelas}
                            </div>
                          </td>
                          
                          {/* 2. Halaqoh */}
                          <td className="px-5 py-3">
                            <span className="font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">
                              {s.halaqoh || '-'}
                            </span>
                          </td>
                    
                          {/* 3. Ziyadah Terakhir */}
                          <td className="px-5 py-3 font-bold text-emerald-700">
                            {s.lastZiyadah ? (
                              <div>
                                Juz {s.lastZiyadah.juz_akhir} Hal {s.lastZiyadah.pojok_akhir}
                                <div className="text-[10px] text-slate-400 font-normal">{s.lastZiyadah.tanggal}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-normal">Belum Ada</span>
                            )}
                          </td>
                    
                          {/* 4. Deresan A Terakhir */}
                          <td className="px-5 py-3 font-bold text-slate-700">
                            {s.lastDeresanA ? (
                              <div>
                                Juz {s.lastDeresanA.juz_akhir} Hal {s.lastDeresanA.pojok_akhir}
                                <div className="text-[10px] text-slate-400 font-normal">{s.lastDeresanA.tanggal}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-normal">Belum Ada</span>
                            )}
                          </td>
                    
                          {/* 5. Deresan B Terakhir */}
                          <td className="px-5 py-3 font-bold text-slate-700">
                            {s.lastDeresanB ? (
                              <div>
                                Juz {s.lastDeresanB.juz_akhir} Hal {s.lastDeresanB.pojok_akhir}
                                <div className="text-[10px] text-slate-400 font-normal">{s.lastDeresanB.tanggal}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-normal">Belum Ada</span>
                            )}
                          </td>
                    
                          {/* 6. Aksi */}
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => handleViewHistory(s)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold rounded-xl border border-emerald-200 transition-all text-xs"
                            >
                              Riwayat ({s.totalLogs})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'santri' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-800">Daftar Santri Putra ({santri.length})</h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Kelola dan perbarui identitas santri, kelas, kamar, dan pembina halaqoh</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setNewSantriForm({
                      nis: '',
                      nama: '',
                      kelas: '',
                      kamar: '',
                      halaqoh: '',
                      status_aktif: 'Masih Ziyadah'
                    });
                    setIsAddingSantri(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer"
                >
                  <Plus size={14} /> Tambah Santri
                </button>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-xl shadow-sm">
                  <ArrowUpDown size={14} className="text-emerald-600" />
                  <select
                    className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    value={sortSantriAdmin}
                    onChange={(e) => setSortSantriAdmin(e.target.value)}
                  >
                    <option value="nama-asc">Nama Santri (A → Z)</option>
                    <option value="nama-desc">Nama Santri (Z → A)</option>
                    <option value="nis-asc">NIS (Kecil → Besar)</option>
                    <option value="nis-desc">NIS (Besar → Kecil)</option>
                    <option value="kelas-asc">Kelas (7 → 12)</option>
                    <option value="kamar-asc">Nomor Kamar (1 → 99)</option>
                    <option value="halaqoh-asc">Nama Pembina (A → Z)</option>
                  </select>
                </div>
                <div className="w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Cari Santri (Nama / NIS / Kamar)..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    value={searchSantri}
                    onChange={(e) => setSearchSantri(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px]">
              <table className="min-w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase sticky top-0 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => setSortSantriAdmin(sortSantriAdmin === 'nis-asc' ? 'nis-desc' : 'nis-asc')}
                      title="Klik untuk urutkan NIS"
                    >
                      <div className="flex items-center gap-1.5">
                        NIS
                        <ArrowUpDown size={12} className={sortSantriAdmin.startsWith('nis') ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => setSortSantriAdmin(sortSantriAdmin === 'nama-asc' ? 'nama-desc' : 'nama-asc')}
                      title="Klik untuk urutkan Nama"
                    >
                      <div className="flex items-center gap-1.5">
                        Nama Santri
                        <ArrowUpDown size={12} className={sortSantriAdmin.startsWith('nama') ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => setSortSantriAdmin('kelas-asc')}
                      title="Klik untuk urutkan Kelas"
                    >
                      <div className="flex items-center gap-1.5">
                        Kelas
                        <ArrowUpDown size={12} className={sortSantriAdmin === 'kelas-asc' ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => setSortSantriAdmin('kamar-asc')}
                      title="Klik untuk urutkan Kamar"
                    >
                      <div className="flex items-center gap-1.5">
                        Kamar
                        <ArrowUpDown size={12} className={sortSantriAdmin === 'kamar-asc' ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => setSortSantriAdmin('halaqoh-asc')}
                      title="Klik untuk urutkan Halaqoh"
                    >
                      <div className="flex items-center gap-1.5">
                        Halaqoh Ustadz
                        <ArrowUpDown size={12} className={sortSantriAdmin === 'halaqoh-asc' ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSantriAdmin.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-600">{s.nis}</td>
                      <td className="px-4 py-3 font-extrabold text-slate-800">{s.nama}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{s.kelas}</td>
                      <td className="px-4 py-3 text-slate-600">{s.kamar || '-'}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{s.halaqoh || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-[11px] font-black px-2.5 py-1 rounded-xl border inline-block shadow-sm ${
                            (s.status_aktif || s.status) === 'Khotimin (sudah Haflah/wisuda)'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : (s.status_aktif || s.status) === 'Khatam (sudah 30 Juz)'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : (s.status_aktif || s.status) === 'Boyong (keluar)'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          {s.status_aktif || s.status || 'Masih Ziyadah'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSantri(s)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingSantri(s)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm cursor-pointer"
                            title="Hapus Data Santri"
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSantriAdmin.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-400 font-bold">
                        Santri tidak ditemukan dengan kata kunci "{searchSantri}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ustadz' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-800">Daftar Ustadz Pembimbing ({ustadz.length})</h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Kelola nama ustadz, nomor kamar halaqoh, dan password kredensial login</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-xl shadow-sm">
                  <ArrowUpDown size={14} className="text-emerald-600" />
                  <select
                    className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    value={sortUstadzAdmin}
                    onChange={(e) => setSortUstadzAdmin(e.target.value)}
                  >
                    <option value="kamar-asc">Nomor Kamar (1 → 99)</option>
                    <option value="kamar-desc">Nomor Kamar (99 → 1)</option>
                    <option value="nama-asc">Nama Ustadz (A → Z)</option>
                    <option value="nama-desc">Nama Ustadz (Z → A)</option>
                  </select>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Cari Ustadz (Nama / Kamar)..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    value={searchUstadz}
                    onChange={(e) => setSearchUstadz(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px]">
              <table className="min-w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase sticky top-0 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => setSortUstadzAdmin(sortUstadzAdmin === 'kamar-asc' ? 'kamar-desc' : 'kamar-asc')}
                      title="Klik untuk urutkan nomor kamar"
                    >
                      <div className="flex items-center gap-1.5">
                        Kamar
                        <ArrowUpDown size={12} className={sortUstadzAdmin.startsWith('kamar') ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => setSortUstadzAdmin(sortUstadzAdmin === 'nama-asc' ? 'nama-desc' : 'nama-asc')}
                      title="Klik untuk urutkan nama ustadz"
                    >
                      <div className="flex items-center gap-1.5">
                        Nama Ustadz
                        <ArrowUpDown size={12} className={sortUstadzAdmin.startsWith('nama') ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                    </th>
                    <th className="px-4 py-3">Password / Kredensial</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUstadzAdmin.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-black text-emerald-700">{u.kamar ? `Kamar ${u.kamar}` : '-'}</td>
                      <td className="px-4 py-3 font-extrabold text-slate-800">{u.nama}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{u.password ? '••••••' : '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUstadz(u)}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUstadzAdmin.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-slate-400 font-bold">
                        Ustadz tidak ditemukan dengan kata kunci "{searchUstadz}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Edit Santri */}
      {editingSantri && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                  <Pencil size={17} className="text-emerald-600" /> Edit Data Santri
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">ID: {editingSantri.id}</p>
              </div>
              <button onClick={() => setEditingSantri(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSantriEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">NIS Santri</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={editSantriForm.nis}
                    onChange={(e) => setEditSantriForm({ ...editSantriForm, nis: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kelas</label>
                  <input
                    type="text"
                    placeholder="Contoh: 10-E3 atau 7-A"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={editSantriForm.kelas}
                    onChange={(e) => setEditSantriForm({ ...editSantriForm, kelas: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Lengkap Santri</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800"
                  value={editSantriForm.nama}
                  onChange={(e) => setEditSantriForm({ ...editSantriForm, nama: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kamar Asrama</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kamar 46"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={editSantriForm.kamar}
                    onChange={(e) => setEditSantriForm({ ...editSantriForm, kamar: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Pembina / Halaqoh</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={editSantriForm.halaqoh}
                    onChange={(e) => setEditSantriForm({ ...editSantriForm, halaqoh: e.target.value })}
                  >
                    <option value="">-- Pilih Ustadz --</option>
                    {ustadz.map((u) => (
                      <option key={u.id} value={u.nama}>
                        {u.kamar ? `[Kamar ${u.kamar}] ` : ''}{u.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Status Santri</label>
                <select
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  value={editSantriForm.status_aktif || 'Masih Ziyadah'}
                  onChange={(e) => setEditSantriForm({ ...editSantriForm, status_aktif: e.target.value })}
                >
                  <option value="Masih Ziyadah">Masih Ziyadah</option>
                  <option value="Khatam (sudah 30 Juz)">Khatam (sudah 30 Juz)</option>
                  <option value="Khotimin (sudah Haflah/wisuda)">Khotimin (sudah Haflah/wisuda)</option>
                  <option value="Boyong (keluar)">Boyong (keluar)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSantri(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingSantri}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingSantri ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                  {isSavingSantri ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Santri Baru */}
      {isAddingSantri && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                  <Plus size={17} className="text-emerald-600" /> Tambah Santri Baru
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Entri santri baru ke database tahfidh</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingSantri(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSantri} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">NIS Santri</label>
                  <input
                    type="text"
                    placeholder="Contoh: 819"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={newSantriForm.nis}
                    onChange={(e) => setNewSantriForm({ ...newSantriForm, nis: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kelas</label>
                  <input
                    type="text"
                    placeholder="Contoh: 7-A atau 10-E3"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={newSantriForm.kelas}
                    onChange={(e) => setNewSantriForm({ ...newSantriForm, kelas: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Lengkap Santri</label>
                <input
                  type="text"
                  placeholder="Masukkan nama santri..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800"
                  value={newSantriForm.nama}
                  onChange={(e) => setNewSantriForm({ ...newSantriForm, nama: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kamar Asrama</label>
                  <input
                    type="text"
                    placeholder="Contoh: 20"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={newSantriForm.kamar}
                    onChange={(e) => setNewSantriForm({ ...newSantriForm, kamar: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Pembina / Halaqoh</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                    value={newSantriForm.halaqoh}
                    onChange={(e) => setNewSantriForm({ ...newSantriForm, halaqoh: e.target.value })}
                  >
                    <option value="">-- Pilih Ustadz --</option>
                    {ustadz.map((u) => (
                      <option key={u.id} value={u.nama}>
                        {u.kamar ? `[Kamar ${u.kamar}] ` : ''}{u.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Status Santri</label>
                <select
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                  value={newSantriForm.status_aktif || 'Masih Ziyadah'}
                  onChange={(e) => setNewSantriForm({ ...newSantriForm, status_aktif: e.target.value })}
                >
                  <option value="Masih Ziyadah">Masih Ziyadah</option>
                  <option value="Khatam (sudah 30 Juz)">Khatam (sudah 30 Juz)</option>
                  <option value="Khotimin (sudah Haflah/wisuda)">Khotimin (sudah Haflah/wisuda)</option>
                  <option value="Boyong (keluar)">Boyong (keluar)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingSantri(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSantri}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isCreatingSantri ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                  {isCreatingSantri ? 'Menambahkan...' : 'Tambah Santri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Santri */}
      {deletingSantri && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trash2 size={24} />
            </div>
            <h3 className="font-black text-base text-slate-800">Hapus Data Santri?</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Santri <strong className="text-slate-800">{deletingSantri.nama}</strong> (NIS: {deletingSantri.nis}) akan dihapus permanen dari database.
            </p>

            <div className="flex items-center justify-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setDeletingSantri(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingSantri}
                onClick={handleConfirmDeleteSantri}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeletingSantri ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                {isDeletingSantri ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Ustadz */}
      {editingUstadz && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                  <Pencil size={17} className="text-emerald-600" /> Edit Data Ustadz
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">ID: {editingUstadz.id}</p>
              </div>
              <button onClick={() => setEditingUstadz(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUstadzEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Lengkap Ustadz</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800"
                  value={editUstadzForm.nama}
                  onChange={(e) => setEditUstadzForm({ ...editUstadzForm, nama: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nomor Kamar Asrama</label>
                <input
                  type="text"
                  placeholder="Contoh: 14 atau Kamar 20"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  value={editUstadzForm.kamar}
                  onChange={(e) => setEditUstadzForm({ ...editUstadzForm, kamar: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Password / Kredensial Login</label>
                <input
                  type="text"
                  placeholder="Masukkan password login ustadz..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  value={editUstadzForm.password}
                  onChange={(e) => setEditUstadzForm({ ...editUstadzForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUstadz(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingUstadz}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingUstadz ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                  {isSavingUstadz ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-800">Edit Riwayat Setoran</h3>
              <button onClick={() => setEditingLog(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditLog} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal</label>
                  <input
                    type="date"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editLogForm.tanggal || ''}
                    onChange={(e) => setEditLogForm({ ...editLogForm, tanggal: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Sesi</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editLogForm.waktu_sesi || 'Subuh'}
                    onChange={(e) => setEditLogForm({ ...editLogForm, waktu_sesi: e.target.value })}
                  >
                    <option value="Subuh">Subuh</option>
                    <option value="Asar">Asar</option>
                    <option value="Maghrib">Maghrib</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kehadiran</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editLogForm.kehadiran || 'Hadir'}
                    onChange={(e) => setEditLogForm({ ...editLogForm, kehadiran: e.target.value })}
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Setor">Tidak Setor</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Izin">Izin</option>
                    <option value="Alfa">Alfa</option>
                    <option value="Deresan Mandiri">Deresan Mandiri</option>
                    <option value="Yanbu'a">Yanbu'a</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kegiatan</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={editLogForm.kegiatan || 'Ziyadah'}
                    onChange={(e) => setEditLogForm({ ...editLogForm, kegiatan: e.target.value })}
                  >
                    <option value="Ziyadah">Ziyadah</option>
                    <option value="Deresan A">Deresan A</option>
                    <option value="Deresan B">Deresan B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Juz Awal</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    value={editLogForm.juz_awal || ''}
                    onChange={(e) => setEditLogForm({ ...editLogForm, juz_awal: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Pjk Awal</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    value={editLogForm.pojok_awal || ''}
                    onChange={(e) => setEditLogForm({ ...editLogForm, pojok_awal: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Juz Akhir</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    value={editLogForm.juz_akhir || ''}
                    onChange={(e) => setEditLogForm({ ...editLogForm, juz_akhir: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Pjk Akhir</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    value={editLogForm.pojok_akhir || ''}
                    onChange={(e) => setEditLogForm({ ...editLogForm, pojok_akhir: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Keterangan</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  value={editLogForm.keterangan || ''}
                  onChange={(e) => setEditLogForm({ ...editLogForm, keterangan: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UstadzView({ onBack }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'rekap' | 'bulanan'>('input');

  const sortUstadzData = (list: any[]) => {
    if (!Array.isArray(list)) return [];
    return [...list].sort((a, b) => {
      const numA = safeExtractNum(a.kamar);
      const numB = safeExtractNum(b.kamar);
      if (numA === 0 && numB > 0) return 1;
      if (numB === 0 && numA > 0) return -1;
      if (numA !== numB) return numA - numB;
      return (a.nama || '').localeCompare(b.nama || '');
    });
  };

  const [ustadzList, setUstadzList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cached_ustadz_rows_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sortUstadzData(parsed);
        }
      }
    } catch {}
    return [];
  });
  const [isLoadingUstadzDropdown, setIsLoadingUstadzDropdown] = useState(false);

  const [loginForm, setLoginForm] = useState({ nama: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [santriList, setSantriList] = useState<any[]>([]);
  const [historySetoran, setHistorySetoran] = useState<any[]>([]);
  const [allHalaqohLogs, setAllHalaqohLogs] = useState<any[]>([]);
  const [selectedSantri, setSelectedSantri] = useState<any>(null);
  const [santriHistoryDetails, setSantriHistoryDetails] = useState<any[]>([]);
  const [santriHistoryFilter, setSantriHistoryFilter] = useState<'all' | 'month' | 'week'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingLog, setEditingLog] = useState<any>(null);
  const [editLogForm, setEditLogForm] = useState<any>({
    tanggal: '',
    waktu_sesi: 'Subuh',
    santri_id: '',
    kehadiran: 'Hadir',
    kegiatan: 'Ziyadah',
    juz_awal: '',
    pojok_awal: '',
    juz_akhir: '',
    pojok_akhir: '',
    keterangan: ''
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [targetsLembaga, setTargetsLembaga] = useState<Record<string, { juz: number; pojokan: number }>>({});
  const [targetsPojokan, setTargetsPojokan] = useState<Record<string, number>>({});
  const [targetsDeresan, setTargetsDeresan] = useState<Record<string, number>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const cleanStr = String(dateStr).trim();
    const datePart = cleanStr.split(' ')[0].split('T')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const d = parseInt(parts[2], 10);
      const mIdx = parseInt(parts[1], 10) - 1;
      const y = parts[0].slice(-2);
      const bulanShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${d} ${bulanShort[mIdx] || parts[1]} ${y}`;
    }
    const d = new Date(cleanStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const bulanShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${day} ${bulanShort[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
    }
    return cleanStr;
  };

  const [formData, setFormData] = useState({
    tanggal: getTodayDate(),
    waktu_sesi: 'Subuh',
    santri_id: '',
    kehadiran: 'Hadir',
    kegiatan: 'Ziyadah',
    juz_awal: '',
    pojok_awal: '',
    juz_akhir: '',
    pojok_akhir: '',
    keterangan: ''
  });

  // State untuk kontrol global (Tanggal, Sesi, Kegiatan)
  const [globalTanggal, setGlobalTanggal] = useState(getTodayDate());
  const [globalSesi, setGlobalSesi] = useState('Subuh');
 //const [globalKegiatan, setGlobalKegiatan] = useState('Ziyadah');
  
  // State untuk menampung inputan baris per baris santri
  const [bulkInput, setBulkInput] = useState<Record<string, any>>({});

  // Reset form massal otomatis setiap kali daftar santri dimuat
  useEffect(() => {
    if (santriList.length > 0) {
      const initialBulk: Record<string, any> = {};
     santriList.forEach(s => {
        initialBulk[s.id] = {
          kehadiran: 'Hadir',
          kegiatan: 'Ziyadah', // <-- Pastikan pakai titik dua (:) dan diakhiri koma (,)
          juz_awal: '', pojok_awal: '', juz_akhir: '', pojok_akhir: '', keterangan: ''
        };
      });
      setBulkInput(initialBulk);
    }
  }, [santriList]);

  // Fungsi mengubah nilai pada baris santri tertentu
  const handleBulkChange = (santriId: string, field: string, value: string) => {
    setBulkInput(prev => ({
      ...prev,
      [santriId]: { ...prev[santriId], [field]: value }
    }));
  };

  // === 1. TAMBAHKAN KODE INI DI SINI ===
  const handleGlobalSesiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSesi = e.target.value;
    setGlobalSesi(selectedSesi); // Update text Sesi di header form

    // Tentukan kegiatan otomatis berdasarkan sesi
    let autoKegiatan = 'Ziyadah'; // Default
    if (selectedSesi === 'Asar') {
      autoKegiatan = 'Deresan A';
    } else if (selectedSesi === 'Maghrib') {
      autoKegiatan = 'Deresan B';
    }

    // Update massal kolom 'kegiatan' pada semua santri di state bulkInput
    setBulkInput((prev) => {
      const updatedBulk = { ...prev };
      Object.keys(updatedBulk).forEach((santriId) => {
        updatedBulk[santriId] = {
          ...updatedBulk[santriId],
          kegiatan: autoKegiatan
        };
      });
      return updatedBulk;
    });
  };
  // ===================================
  
  const fetchDaftarUstadz = async (retryCount = 0) => {
    setIsLoadingUstadzDropdown(true);
    try {
      const client = await getSupabase();
      if (!client) {
        if (retryCount < 3) {
          setTimeout(() => fetchDaftarUstadz(retryCount + 1), 700);
        } else {
          setIsLoadingUstadzDropdown(false);
        }
        return;
      }
      const { data, error } = await client.from('ustadz_rows').select('id, nama, password, kamar').order('nama');
      if (error) {
        if (retryCount < 2) {
          setTimeout(() => fetchDaftarUstadz(retryCount + 1), 1000);
        }
      } else if (data && data.length > 0) {
        const sorted = sortUstadzData(data);
        setUstadzList(sorted);
        try {
          localStorage.setItem('cached_ustadz_rows_list', JSON.stringify(sorted));
        } catch {}
      }
    } catch (err) {
      console.error('Error fetch ustadz:', err);
    } finally {
      setIsLoadingUstadzDropdown(false);
    }
  };

  const fetchTargets = async () => {
    try {
      const client = await getSupabase();
      if (!client) return;

      const { data: dLembaga } = await client.from('target_lembaga_rows').select('*');
      if (dLembaga && Array.isArray(dLembaga)) {
        const map: Record<string, { juz: number; pojokan: number }> = {};
        dLembaga.forEach((row: any) => {
          map[`${row.bulan}_${row.kelas}`] = { juz: row.juz || 0, pojokan: row.pojokan || 0 };
        });
        setTargetsLembaga(map);
      }

      const { data: dPojokan } = await client.from('target_pojokan_rows').select('*');
      if (dPojokan && Array.isArray(dPojokan)) {
        const map: Record<string, number> = {};
        dPojokan.forEach((row: any) => {
          map[`${row.bulan}_${row.kelas}`] = row.jumlah_pojokan || 0;
        });
        setTargetsPojokan(map);
      }

      const { data: dDeresan } = await client.from('target_deresan_rows').select('*');
      if (dDeresan && Array.isArray(dDeresan)) {
        const map: Record<string, number> = {};
        dDeresan.forEach((row: any) => {
          map[`${row.bulan}_${row.kelas}`] = row.jumlah_pojokan || 0;
        });
        setTargetsDeresan(map);
      }
    } catch (err) {
      console.error('Error fetch targets:', err);
    }
  };

  useEffect(() => {
    fetchDaftarUstadz();
    fetchTargets();
    try {
      const saved = localStorage.getItem('tahfidh_ustadz_user');
      if (saved) {
        const u = JSON.parse(saved);
        setLoggedInUser(u);
        setIsLoggedIn(true);
      }
    } catch {}
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoginError('');

    if (!loginForm.nama) {
      setLoginError('Pilih nama ustadz terlebih dahulu!');
      return;
    }

    const matched = ustadzList.find((u) => u.nama === loginForm.nama);
    if (!matched) {
      setLoginError('Nama ustadz tidak ditemukan dalam database.');
      return;
    }

    if (matched.password && String(matched.password).trim() !== String(loginForm.password).trim()) {
      setLoginError('Password tidak cocok, silakan periksa kembali.');
      return;
    }

    setLoggedInUser(matched);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('tahfidh_ustadz_user', JSON.stringify(matched));
    } catch {}
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    try {
      localStorage.removeItem('tahfidh_ustadz_user');
    } catch {}
  };

  const fetchSantriAndLogs = async () => {
    if (!loggedInUser) return;
    const client = await getSupabase();
    if (!client) return;

    try {
      const { data: sData } = await client
        .from('santri_rows')
        .select('*')
        .ilike('halaqoh', `%${loggedInUser.nama}%`)
        .order('nama');

      const loadedSantri = sData || [];
      setSantriList(loadedSantri);

      const santriIds = loadedSantri.map((s: any) => s.id);
      const santriNis = loadedSantri.map((s: any) => s.nis).filter(Boolean);
      const allIdentifiers = Array.from(new Set([...santriIds, ...santriNis]));

      let query = client.from('log_setoran_rows').select('*').order('tanggal', { ascending: false });

      if (allIdentifiers.length > 0) {
        query = query.or(`ustadzah_id.eq.${loggedInUser.id},santri_id.in.(${allIdentifiers.join(',')})`);
      } else {
        query = query.eq('ustadzah_id', loggedInUser.id);
      }

      const { data: logData } = await query;
      if (logData) {
        setAllHalaqohLogs(logData);
        setHistorySetoran(logData.slice(0, 30));
      }
    } catch (err) {
      console.error('Error fetching halaqoh data:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && loggedInUser) {
      fetchSantriAndLogs();
    }
  }, [isLoggedIn, loggedInUser]);

 const santriCapaianTerakhir = useMemo(() => {
    return santriList.map((s: any) => {
      const logs = allHalaqohLogs.filter(
        (l: any) => l.santri_id === s.id || (s.nis && l.santri_id === s.nis)
      );

      const lastZiyadah = logs.find(
        (l: any) => l.kegiatan && l.kegiatan.toLowerCase().includes('ziyadah') && l.juz_akhir
      );
      
      // TAMBAHAN: Pisahkan pencarian untuk Deresan A dan Deresan B
      const lastDeresanA = logs.find(
        (l) => l.kegiatan && l.kegiatan.toLowerCase() === 'deresan a' && l.juz_akhir
      );
      const lastDeresanB = logs.find(
        (l) => l.kegiatan && l.kegiatan.toLowerCase() === 'deresan b' && l.juz_akhir
      );

      return {
        ...s,
        lastZiyadah,
        lastDeresanA, // Menggantikan lastMurojaah
        lastDeresanB, // Tambahan baru
        totalLogsCount: logs.length
      };
    });
  }, [santriList, allHalaqohLogs]);

  const rekapBulananList = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const bulanKey = month;
    return santriList.map((s: any) => {
      const cls = mapKelasTarget(s.kelas);
      const logs = allHalaqohLogs
        .filter((l: any) => {
          const matchesSantri = l.santri_id === s.id || (s.nis && l.santri_id === s.nis);
          if (!matchesSantri || !l.tanggal) return false;
          const logDateStr = String(l.tanggal).split(' ')[0].split('T')[0];
          const p = logDateStr.split('-');
          return p[0] === year && p[1] === month;
        })
        .sort((a: any, b: any) => {
          const dateComp = String(a.tanggal).localeCompare(String(b.tanggal));
          if (dateComp !== 0) return dateComp;
          return (a.id || 0) > (b.id || 0) ? 1 : -1;
        });

      // --- Hitung Total Kehadiran (TS, S, I, A) ---
      let totalTS = 0;
      let totalS = 0;
      let totalI = 0;
      let totalA = 0;

      logs.forEach((log: any) => {
        const k = String(log.kehadiran || '').trim().toLowerCase();
        if (k === 'tidak setor') totalTS++;
        else if (k === 'sakit') totalS++;
        else if (k === 'izin' || k === 'ijin') totalI++;
        else if (k === 'alfa' || k === 'alpha') totalA++;
      });
      // --------------------------------------------
      
      const ziyadahLogs = logs.filter((log: any) => {
        const keg = String(log.kegiatan || '').toLowerCase();
        return (keg.includes('ziyadah') || keg === '' || keg.includes('tambah')) && log.juz_akhir;
      });

      const murojaahLogs = logs.filter((log: any) => {
        const keg = String(log.kegiatan || '').toLowerCase();
        return (keg.includes('muroja') || keg.includes('muraja') || keg.includes('ulang') || keg.includes('deres')) && log.juz_akhir;
      });

      let totalZiyadah = 0;
      ziyadahLogs.forEach((log: any) => {
        let hal = parseFloat(String(log.jumlah_halaman || '0'));
        if (isNaN(hal) || hal === 0) {
          if (log.juz_awal && log.pojok_awal && log.juz_akhir && log.pojok_akhir) {
            const start = getAbsolutePojok(log.juz_awal, log.pojok_awal);
            const end = getAbsolutePojok(log.juz_akhir, log.pojok_akhir);
            hal = Math.max(0, Math.abs(end - start) + 1);
          } else {
            hal = safeExtractNum(log.jumlah_halaman) || 0;
          }
        }
        totalZiyadah += hal;
      });

      let totalMurojaah = 0;
      let totalDeresanA = 0;
      let totalDeresanB = 0;
      
      murojaahLogs.forEach((log: any) => {
        let hal = 0;
        if (log.juz_awal && log.pojok_awal && log.juz_akhir && log.pojok_akhir) {
          hal = calculateHalamanCount(log.juz_awal, log.pojok_awal, log.juz_akhir, log.pojok_akhir, log.kegiatan);
        }
        if (!hal || hal === 0) {
          hal = parseFloat(String(log.jumlah_halaman || '0'));
          if (isNaN(hal) || hal === 0) hal = safeExtractNum(log.jumlah_halaman) || 0;
        }
        totalMurojaah += hal;
        
        const k = String(log.kegiatan || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (k.includes('deresanb')) {
          totalDeresanB += hal;
        } else {
          totalDeresanA += hal;
        }
      });

      const firstZiyadah = ziyadahLogs.length > 0 ? ziyadahLogs[0] : null;
      const lastZiyadah = ziyadahLogs.length > 0 ? ziyadahLogs[ziyadahLogs.length - 1] : null;
      const zAwal = firstZiyadah && firstZiyadah.juz_awal ? `Juz ${firstZiyadah.juz_awal} Pjk ${firstZiyadah.pojok_awal}` : '-';
      const zAkhir = lastZiyadah && lastZiyadah.juz_akhir ? `Juz ${lastZiyadah.juz_akhir} Pjk ${lastZiyadah.pojok_akhir}` : '-';

      // Pisahkan log Deresan A dan Deresan B
      const deresanALogs = murojaahLogs.filter((log: any) => {
        const k = String(log.kegiatan || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return !k.includes('deresanb'); // Data murojaah lama/Deresan A
      });
      const deresanBLogs = murojaahLogs.filter((log: any) => {
        const k = String(log.kegiatan || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return k.includes('deresanb');
      });

      const firstDeresanA = deresanALogs.length > 0 ? deresanALogs[0] : null;
      const lastDeresanA = deresanALogs.length > 0 ? deresanALogs[deresanALogs.length - 1] : null;
      const dAwalA = firstDeresanA && firstDeresanA.juz_awal ? `Juz ${firstDeresanA.juz_awal} Pjk ${firstDeresanA.pojok_awal}` : '-';
      const dAkhirA = lastDeresanA && lastDeresanA.juz_akhir ? `Juz ${lastDeresanA.juz_akhir} Pjk ${lastDeresanA.pojok_akhir}` : '-';

      const firstDeresanB = deresanBLogs.length > 0 ? deresanBLogs[0] : null;
      const lastDeresanB = deresanBLogs.length > 0 ? deresanBLogs[deresanBLogs.length - 1] : null;
      const dAwalB = firstDeresanB && firstDeresanB.juz_awal ? `Juz ${firstDeresanB.juz_awal} Pjk ${firstDeresanB.pojok_awal}` : '-';
      const dAkhirB = lastDeresanB && lastDeresanB.juz_akhir ? `Juz ${lastDeresanB.juz_akhir} Pjk ${lastDeresanB.pojok_akhir}` : '-';

      // Cek status Khatam / Khotimin
      const santriStatusStr = String(s.status_aktif || s.status || '').toLowerCase();

      // 1. Target Pojokan (Volume Ziyadah Baru Bulan Ini)
      const targetPojokanVal = cls ? (targetsPojokan[`${bulanKey}_${cls}`] || 0) : 0;

      // 2. Target Lembaga (Capaian Akumulatif s/d Bulan Ini)
      let maxZiyadahAbs = 0;
      allHalaqohLogs.forEach((l: any) => {
        const matches = l.santri_id === s.id || (s.nis && l.santri_id === s.nis);
        if (!matches) return;
        const keg = String(l.kegiatan || '').toLowerCase();
        if (!keg.includes('ziyadah') && keg !== '' && !keg.includes('tambah')) return;
        if (l.tanggal) {
          const logDate = String(l.tanggal).split(' ')[0].split('T')[0];
          if (logDate.slice(0, 7) > selectedMonth) return;
        }
        const j = safeExtractNum(l.juz_akhir);
        const p = safeExtractNum(l.pojok_akhir);
        if (j >= 1 && j <= 30) {
          const abs = getAbsolutePojok(j, p);
          if (abs > maxZiyadahAbs) maxZiyadahAbs = abs;
        }
      });

      const isKhotimin = santriStatusStr.includes('khotimin');
      const isKhatamOrKhotimin = isKhotimin || santriStatusStr.includes('khatam') || maxZiyadahAbs >= 30 * POJOK_PER_JUZ;
      const sudahPojokan = isKhatamOrKhotimin || (targetPojokanVal > 0 ? totalZiyadah >= targetPojokanVal : totalZiyadah > 0);

      const customTL = cls ? targetsLembaga[`${bulanKey}_${cls}`] : null;
      let targetLembagaAbs = 0;
      let targetLembagaText = '';
      if (customTL && (customTL.juz > 0 || customTL.pojokan > 0)) {
        targetLembagaAbs = getAbsolutePojok(customTL.juz, customTL.pojokan);
        targetLembagaText = `Juz ${customTL.juz} Pjk ${customTL.pojokan}`;
      } else if (cls && DefaultTargetLembaga[bulanKey]?.[cls]) {
        const t = DefaultTargetLembaga[bulanKey][cls];
        targetLembagaAbs = getAbsolutePojok(t.j, t.p);
        targetLembagaText = `Juz ${t.j} Pjk ${t.p}`;
      }
      const sudahLembaga = isKhatamOrKhotimin || (targetLembagaAbs > 0 && maxZiyadahAbs >= targetLembagaAbs);

      // 3. Target Deresan (Volume Muroja'ah Bulan Ini)
      const targetDeresanVal = cls ? (targetsDeresan[`${bulanKey}_${cls}`] || 0) : 0;
      const sudahDeresan = targetDeresanVal > 0 ? totalMurojaah >= targetDeresanVal : totalMurojaah > 0;

      return {
        ...s,
        isKhotimin,
        isKhatamOrKhotimin,
        zAwal,
        zAkhir,
        totalZiyadah,
        targetPojokanVal,
        sudahPojokan,
        targetLembagaText,
        sudahLembaga,
        dAwalA,  // <--- Ganti mAwal menjadi dAwalA
        dAkhirA, // <--- Ganti mAkhir menjadi dAkhirA
        dAwalB,  // <--- Tambahkan baris ini
        dAkhirB, // <--- Tambahkan baris ini
        totalMurojaah,
        totalDeresanA,
        totalDeresanB,
        targetDeresanVal,
        sudahDeresan,
        totalTS, // <--- Tambahkan ini
        totalS,  // <--- Tambahkan ini
        totalI,  // <--- Tambahkan ini
        totalA   // <--- Tambahkan ini
      };
    });
  }, [santriList, allHalaqohLogs, selectedMonth, targetsLembaga, targetsPojokan, targetsDeresan]);

  const handleOpenSantriHistory = async (s: any) => {
    setSelectedSantri(s);
    setSantriHistoryFilter('all');
    const client = await getSupabase();
    if (!client) return;

    const { data } = await client
      .from('log_setoran_rows')
      .select('*')
      .or(`santri_id.eq.${s.id},santri_id.eq.${s.nis}`)
      .order('tanggal', { ascending: false });

    if (data) setSantriHistoryDetails(data);
  };

  const filteredSantriHistory = useMemo(() => {
    if (santriHistoryFilter === 'all') return santriHistoryDetails;
    const now = new Date();
    const days = santriHistoryFilter === 'week' ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    cutoff.setHours(0, 0, 0, 0);

    return santriHistoryDetails.filter((l) => {
      if (!l.tanggal) return false;
      const dStr = String(l.tanggal).split(' ')[0].split('T')[0];
      const d = new Date(dStr);
      return !isNaN(d.getTime()) && d >= cutoff;
    });
  }, [santriHistoryDetails, santriHistoryFilter]);

  const santriHistoryStats = useMemo(() => {
    if (!santriHistoryDetails.length) {
      return { lastZiyadah: 'Belum Ada', lastMurojaah: 'Belum Ada', ziyadahCount: 0, murojaahCount: 0 };
    }
    const sortedAll = [...santriHistoryDetails].sort((a, b) => {
      const comp = String(b.tanggal || '').localeCompare(String(a.tanggal || ''));
      if (comp !== 0) return comp;
      return (b.id || 0) > (a.id || 0) ? 1 : -1;
    });

    const lastZ = sortedAll.find((l) => {
      const k = String(l.kegiatan || '').toLowerCase();
      return (k.includes('ziyadah') || k.includes('tambah') || k === '') && l.juz_akhir;
    });

    const lastM = sortedAll.find((l) => {
      const k = String(l.kegiatan || '').toLowerCase();
      return (k.includes('muroja') || k.includes('muraja') || k.includes('ulang') || k.includes('deres')) && l.juz_akhir;
    });

    let zCount = 0;
    let mCount = 0;
    filteredSantriHistory.forEach((l) => {
      const k = String(l.kegiatan || '').toLowerCase();
      if (k.includes('muroja') || k.includes('muraja') || k.includes('ulang') || k.includes('deres')) {
        mCount++;
      } else {
        zCount++;
      }
    });

    return {
      lastZiyadah: lastZ ? `Juz ${lastZ.juz_akhir} Pjk ${lastZ.pojok_akhir}` : 'Belum Ada',
      lastMurojaah: lastM ? `Juz ${lastM.juz_akhir} Pjk ${lastM.pojok_akhir}` : 'Belum Ada',
      ziyadahCount: zCount,
      murojaahCount: mCount
    };
  }, [santriHistoryDetails, filteredSantriHistory]);

  const handleOpenEditModal = (log: any) => {
    setEditingLog(log);
    const cleanDate = log.tanggal ? String(log.tanggal).split(' ')[0].split('T')[0] : getTodayDate();
    setEditLogForm({
      tanggal: cleanDate,
      waktu_sesi: log.waktu_sesi || 'Subuh',
      santri_id: log.santri_id || '',
      kehadiran: log.kehadiran || 'Hadir',
      kegiatan: log.kegiatan || 'Ziyadah',
      juz_awal: log.juz_awal ?? '',
      pojok_awal: log.pojok_awal ?? '',
      juz_akhir: log.juz_akhir ?? '',
      pojok_akhir: log.pojok_akhir ?? '',
      keterangan: log.keterangan || ''
    });
  };

  const handleSaveUstadzEdit = async (e: any) => {
    e.preventDefault();
    if (!editingLog) return;
    setIsSubmitting(true);
    const client = await getSupabase();
    if (!client) {
      setIsSubmitting(false);
      return;
    }

    let totalHalaman = 0;
    if (editLogForm.juz_awal && editLogForm.pojok_awal && editLogForm.juz_akhir && editLogForm.pojok_akhir) {
      totalHalaman = calculateHalamanCount(
        editLogForm.juz_awal,
        editLogForm.pojok_awal,
        editLogForm.juz_akhir,
        editLogForm.pojok_akhir,
        editLogForm.kegiatan
      );
    }

    const { error } = await client
      .from('log_setoran_rows')
      .update({
        tanggal: editLogForm.tanggal,
        waktu_sesi: editLogForm.waktu_sesi,
        santri_id: editLogForm.santri_id,
        kehadiran: editLogForm.kehadiran,
        kegiatan: editLogForm.kegiatan,
        juz_awal: editLogForm.juz_awal ? parseInt(editLogForm.juz_awal) : null,
        pojok_awal: editLogForm.pojok_awal ? parseInt(editLogForm.pojok_awal) : null,
        juz_akhir: editLogForm.juz_akhir ? parseInt(editLogForm.juz_akhir) : null,
        pojok_akhir: editLogForm.pojok_akhir ? parseInt(editLogForm.pojok_akhir) : null,
        jumlah_halaman: totalHalaman,
        keterangan: editLogForm.keterangan || ''
      })
      .eq('id', editingLog.id);

    setIsSubmitting(false);
    if (!error) {
      setEditingLog(null);
      await fetchSantriAndLogs();
      if (selectedSantri) {
        handleOpenSantriHistory(selectedSantri);
      }
    }
  };

  const handleSubmitSetoran = async (e: any) => {
    e.preventDefault();
    if (!formData.santri_id) {
      showToast('error', 'Silakan pilih santri binaan terlebih dahulu!');
      return;
    }
    setIsSubmitting(true);

    const client = await getSupabase();
    if (!client) {
      setIsSubmitting(false);
      showToast('error', 'Koneksi database Supabase tidak tersedia!');
      return;
    }

   let totalHalaman = 0;
    const angkaKeterangan = safeExtractNum(formData.keterangan);
    
    if (angkaKeterangan > 0) {
      // Prioritas 1: Keterangan menang (misal "setor 0.5" -> 0.5)
      totalHalaman = angkaKeterangan;
    } else if (formData.juz_awal && formData.pojok_awal && formData.juz_akhir && formData.pojok_akhir) {
      // Prioritas 2: Jika keterangan tidak mengandung angka, hitung normal
      totalHalaman = calculateHalamanCount(
        formData.juz_awal,
        formData.pojok_awal,
        formData.juz_akhir,
        formData.pojok_akhir,
        formData.kegiatan
      );
    }
    
    const generatedId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    const rowData: any = {
      id: generatedId,
      tanggal: formData.tanggal,
      waktu_sesi: formData.waktu_sesi,
      santri_id: String(formData.santri_id),
      ustadzah_id: String(loggedInUser.id),
      kehadiran: formData.kehadiran,
      kegiatan: formData.kegiatan,
      juz_awal: formData.juz_awal ? parseInt(formData.juz_awal) : null,
      pojok_awal: formData.pojok_awal ? parseInt(formData.pojok_awal) : null,
      juz_akhir: formData.juz_akhir ? parseInt(formData.juz_akhir) : null,
      pojok_akhir: formData.pojok_akhir ? parseInt(formData.pojok_akhir) : null,
      jumlah_halaman: totalHalaman,
      keterangan: formData.keterangan || ''
    };

    let { error } = await client.from('log_setoran_rows').insert([rowData]);

    // Fallback: Jika kolom juz/halaman di database bertipe text
    if (error && error.message && (error.message.includes('type') || error.message.includes('text'))) {
      const fallbackRow = {
        ...rowData,
        juz_awal: rowData.juz_awal !== null ? String(rowData.juz_awal) : null,
        pojok_awal: rowData.pojok_awal !== null ? String(rowData.pojok_awal) : null,
        juz_akhir: rowData.juz_akhir !== null ? String(rowData.juz_akhir) : null,
        pojok_akhir: rowData.pojok_akhir !== null ? String(rowData.pojok_akhir) : null,
        jumlah_halaman: String(totalHalaman)
      };
      const retry = await client.from('log_setoran_rows').insert([fallbackRow]);
      error = retry.error;
    }

    setIsSubmitting(false);

    if (error) {
      console.error('Error insert setoran:', error);
      if (error.message && (error.message.includes('row-level security') || error.message.includes('policy'))) {
        showToast('error', 'RLS Supabase aktif pada tabel log_setoran_rows. Jalankan: ALTER TABLE log_setoran_rows DISABLE ROW LEVEL SECURITY; di SQL Editor Supabase');
      } else {
        showToast('error', `Gagal menyimpan: ${error.message || 'Periksa koneksi database'}`);
      }
    } else {
      const selectedSantriObj = santriList.find((s) => s.id === formData.santri_id || s.nis === formData.santri_id);
      showToast('success', `Alhamdulillah, setoran hafalan ${selectedSantriObj?.nama || ''} berhasil disimpan!`);
      await fetchSantriAndLogs();
      setFormData({
        tanggal: getTodayDate(),
        waktu_sesi: formData.waktu_sesi,
        santri_id: '',
        kehadiran: 'Hadir',
        kegiatan: 'Ziyadah',
        juz_awal: '',
        pojok_awal: '',
        juz_akhir: '',
        pojok_akhir: '',
        keterangan: ''
      });
    }
  };

const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const client = await getSupabase();
    if (!client) {
      setIsSubmitting(false);
      showToast('error', 'Koneksi database tidak tersedia!');
      return;
    }

    const rowsToInsert: any[] = [];

    santriList.forEach(s => {
      const data = bulkInput[s.id];
      if (!data) return;

      const statusKehadiran = data.kehadiran || 'Hadir';
      const isBukanHadirBiasa = statusKehadiran !== 'Hadir'; // Tidak Setor, Sakit, Izin, Alpha
      const isFilled = data.juz_akhir && data.pojok_akhir;

      // Filter: Hanya simpan santri jika statusnya bukan "Hadir" biasa ATAU jika "Hadir" dan Juz/Pojok Akhir terisi
      if (!isBukanHadirBiasa && !isFilled) {
        return;
      }

      let totalHalaman = 0;

      if (isBukanHadirBiasa) {
        totalHalaman = 0;
      } else {
        const angkaKeterangan = safeExtractNum(data.keterangan);
        if (angkaKeterangan > 0) {
          totalHalaman = angkaKeterangan;
        } else if (data.juz_awal && data.pojok_awal && data.juz_akhir && data.pojok_akhir) {
          totalHalaman = calculateHalamanCount(
            data.juz_awal, data.pojok_awal, data.juz_akhir, data.pojok_akhir, data.kegiatan
          );
        }
      }

      const strId = String(s.id);
      rowsToInsert.push({
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9) + strId.substring(0, 4),
        tanggal: globalTanggal,
        waktu_sesi: globalSesi,
        santri_id: strId,
        ustadzah_id: String(loggedInUser.id),
        kehadiran: statusKehadiran,
        kegiatan: data.kegiatan,
        juz_awal: isBukanHadirBiasa ? null : (data.juz_awal ? parseInt(data.juz_awal) : null),
        pojok_awal: isBukanHadirBiasa ? null : (data.pojok_awal ? parseInt(data.pojok_awal) : null),
        juz_akhir: isBukanHadirBiasa ? null : (data.juz_akhir ? parseInt(data.juz_akhir) : null),
        pojok_akhir: isBukanHadirBiasa ? null : (data.pojok_akhir ? parseInt(data.pojok_akhir) : null),
        jumlah_halaman: totalHalaman,
        keterangan: data.keterangan || ''
      });
    }); // <--- PENUTUP FOR EACH YANG SEBELUMNYA KURANG

    // Pengecekan ini harus berada di luar perulangan forEach
    if (rowsToInsert.length === 0) {
      setIsSubmitting(false);
      showToast('error', 'Tidak ada data yang valid untuk disimpan! Pastikan Juz & Pjk Akhir terisi.');
      return;
    }
  
    const { error } = await client.from('log_setoran_rows').insert(rowsToInsert);
    setIsSubmitting(false);

    if (error) {
      showToast('error', `Gagal menyimpan: ${error.message}`);
    } else {
      showToast('success', `Alhamdulillah, berhasil menyimpan ${rowsToInsert.length} data santri sekaligus!`);
      await fetchSantriAndLogs();

      // Kosongkan form setelah sukses
      const resetBulk: Record<string, any> = {};
        santriList.forEach(s => {
        resetBulk[s.id] = {
          kehadiran: 'Hadir', 
          kegiatan: 'Ziyadah', // <-- Pastikan pakai titik dua (:)
          juz_awal: '', pojok_awal: '', juz_akhir: '', pojok_akhir: '', keterangan: ''
        };
      });
      setBulkInput(resetBulk);
    }
  };
  
  const handleDeleteLogUstadz = async (logId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data setoran ini?")) return;
    
    setIsSubmitting(true);
    const client = await getSupabase();
    if (!client) {
      setIsSubmitting(false);
      return;
    }

    const { error } = await client.from('log_setoran_rows').delete().eq('id', logId);
    
    setIsSubmitting(false);
    if (!error) {
      showToast('success', 'Data setoran berhasil dihapus.');
      await fetchSantriAndLogs();
      if (selectedSantri) {
        handleOpenSantriHistory(selectedSantri);
      }
    } else {
      showToast('error', 'Gagal menghapus data: ' + error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen w-full bg-emerald-950 flex items-center justify-center p-4 relative"
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#022c22'
        }}
      >
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Portal
        </button>

        <div
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 md:p-8"
          style={{ maxWidth: '28rem', width: '100%', backgroundColor: '#ffffff', borderRadius: '1.5rem' }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <BookOpen size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Setoran Tahfidh Putra</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">Portal Akses Ustadz Pembimbing</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">
                {loginError}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilih Nama Ustadz
                </label>
                {isLoadingUstadzDropdown && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <RefreshCw size={11} className="animate-spin" /> Memuat...
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all font-semibold text-slate-800 cursor-pointer appearance-none pr-10 shadow-sm"
                  value={loginForm.nama}
                  onChange={(e) => setLoginForm({ ...loginForm, nama: e.target.value })}
                  required
                >
                  <option value="">
                    {isLoadingUstadzDropdown && ustadzList.length === 0
                      ? '-- Menghubungkan Data Ustadz... --'
                      : ustadzList.length === 0
                      ? '-- Menunggu Data Ustadz (Klik Segarkan) --'
                      : `-- Ketuk Untuk Memilih Nama (${ustadzList.length} Ustadz) --`}
                  </option>
                  {ustadzList.map((u) => {
                    const kamarLabel = u.kamar ? `[Kamar ${u.kamar}] ` : '';
                    return (
                      <option key={u.id} value={u.nama}>
                        {kamarLabel}{u.nama}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Password Ustadz</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-800"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
            >
              Masuk Sistem
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-slate-100 flex flex-col"
      style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-800 rounded-xl">
            <BookOpen size={20} className="text-emerald-300" />
          </div>
          <div>
            <h1 className="font-black text-sm md:text-base">Setoran Tahfidh Putra</h1>
            <p className="text-[11px] text-emerald-300 font-bold">
              {loggedInUser?.kamar ? `[Kamar ${loggedInUser.kamar}] ` : ''}
              {loggedInUser?.nama}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSantriAndLogs}
            title="Segarkan Data"
            className="p-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 sticky top-[65px] z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-6 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('input');
              setSelectedSantri(null);
            }}
            className={`py-3.5 px-2 text-xs font-black flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'input'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pencil size={15} /> Input Setoran
          </button>
          <button
            onClick={() => {
              setActiveTab('rekap');
              setSelectedSantri(null);
            }}
            className={`py-3.5 px-2 text-xs font-black flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'rekap'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History size={15} /> Riwayat & Akhir
          </button>
          <button
            onClick={() => {
              setActiveTab('bulanan');
              setSelectedSantri(null);
            }}
            className={`py-3.5 px-2 text-xs font-black flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'bulanan'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar size={15} /> Rekap Bulanan
          </button>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6 flex-grow">
        {activeTab === 'input' && (
          <div className="space-y-6">
            {notification && (
              <div
                className={`p-4 rounded-2xl text-xs font-black flex items-center justify-between shadow-sm border ${
                  notification.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-rose-50 text-rose-800 border-rose-200 ring-2 ring-rose-500/20'
                }`}
              >
                <span>{notification.message}</span>
                <button
                  onClick={() => setNotification(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
              <h2 className="text-base font-black text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Pencil size={18} className="text-emerald-600" /> Form Input Setoran Harian
              </h2>

             <form onSubmit={handleBulkSubmit} className="space-y-4">
                  {/* Kontrol Global */}
                  <div className="flex flex-col md:flex-row gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">TANGGAL SETORAN</label>
                      <input
                        type="date"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                        value={globalTanggal}
                        onChange={(e) => setGlobalTanggal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">SESI</label>
                    <select
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                      value={globalSesi}
                      onChange={handleGlobalSesiChange} // <--- UBAH BAGIAN INI SAJA
                    >
                      <option value="Subuh">Subuh</option>
                      <option value="Asar">Asar</option>
                      <option value="Maghrib">Maghrib</option>
                    </select>
                  </div>
                    {/* DIV KEGIATAN UMUM DI SINI DIHAPUS SAJA */}
                  </div>
                
                  {/* Tabel Input Massal */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="min-w-full text-xs text-left whitespace-nowrap bg-white">
                      <thead className="bg-emerald-50 text-emerald-800 font-black uppercase">
                        <tr>
                          <th className="px-4 py-3">Nama Santri</th>
                          <th className="px-2 py-3 w-28">Kegiatan</th>
                          <th className="px-2 py-3 w-28">Kehadiran</th>
                          <th className="px-2 py-3 w-16">Juz Awal</th>
                          <th className="px-2 py-3 w-16">Pjk Awal</th>
                          <th className="px-2 py-3 w-16">Juz Akhir</th>
                          <th className="px-2 py-3 w-16">Pjk Akhir</th>
                          <th className="px-3 py-3 w-40">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {santriList.map((s) => {
                          const rowData = bulkInput[s.id] || {};
                          return (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-2 font-extrabold text-slate-800 text-[11px]">
                                {s.nama}
                              </td>
                              
                              {/* === TAMBAHAN DROPDOWN KEGIATAN PER BARIS === */}
                              <td className="px-2 py-2">
                                <select
                                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                                  value={rowData.kegiatan || 'Ziyadah'}
                                  onChange={(e) => handleBulkChange(s.id, 'kegiatan', e.target.value)}
                                >
                                  <option value="Ziyadah">Ziyadah</option>
                                  <option value="Deresan A">Deresan A</option>
                                  <option value="Deresan B">Deresan B</option>
                                </select>
                              </td>
                              {/* ============================================== */}
                              
                              <td className="px-2 py-2">
                                <select
                                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                                  value={rowData.kehadiran || 'Hadir'}
                                  onChange={(e) => handleBulkChange(s.id, 'kehadiran', e.target.value)}
                                >
                                  <option value="Hadir">Hadir</option>
                                  <option value="Tidak Setor">Tidak Setor</option>
                                  <option value="Sakit">Sakit</option>
                                  <option value="Izin">Izin</option>
                                  <option value="Alfa">Alfa</option>
                                  <option value="Deresan Mandiri">Deresan Mandiri</option>
                                  <option value="Yanbu'a">Yanbu'a</option>
                                </select>
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="number" min="1" max="30" placeholder="Juz"
                                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 disabled:opacity-50"
                                  disabled={rowData.kehadiran !== 'Hadir'}
                                  value={rowData.juz_awal || ''}
                                  onChange={(e) => handleBulkChange(s.id, 'juz_awal', e.target.value)}
                                />
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="number" min="1" max="20" placeholder="Pjk"
                                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 disabled:opacity-50"
                                  disabled={rowData.kehadiran !== 'Hadir'}
                                  value={rowData.pojok_awal || ''}
                                  onChange={(e) => handleBulkChange(s.id, 'pojok_awal', e.target.value)}
                                />
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="number" min="1" max="30" placeholder="Juz"
                                  className="w-full p-2 bg-slate-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                  disabled={rowData.kehadiran !== 'Hadir'}
                                  value={rowData.juz_akhir || ''}
                                  onChange={(e) => handleBulkChange(s.id, 'juz_akhir', e.target.value)}
                                />
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="number" min="1" max="20" placeholder="Pjk"
                                  className="w-full p-2 bg-slate-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                  disabled={rowData.kehadiran !== 'Hadir'}
                                  value={rowData.pojok_akhir || ''}
                                  onChange={(e) => handleBulkChange(s.id, 'pojok_akhir', e.target.value)}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text" placeholder="Catatan..."
                                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500"
                                  value={rowData.keterangan || ''}
                                  onChange={(e) => handleBulkChange(s.id, 'keterangan', e.target.value)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSubmitting ? 'Menyimpan Semua Data...' : 'Simpan Semua Setoran'}
                  </button>
                </form>            
            </div>

            {}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <History size={17} className="text-emerald-600" /> Riwayat Setoran Terakhir ({historySetoran.length})
              </h3>
              <div className="overflow-x-auto max-h-72">
                <table className="min-w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-black uppercase sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">TANGGAL</th>
                      <th className="px-4 py-3">SANTRI</th>
                      <th className="px-4 py-3">KEGIATAN</th>
                      <th className="px-4 py-3">CAPAIAN</th>
                      <th className="px-4 py-3">STATUS</th>
                      <th className="px-4 py-3 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historySetoran.map((log: any) => {
                      const sNama = santriList.find((s) => s.id === log.santri_id || s.nis === log.santri_id)?.nama || log.santri_id;
                      const cleanDate = log.tanggal ? String(log.tanggal).split(' ')[0].split('T')[0] : '-';
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 text-slate-600 font-semibold">
                            <div>{cleanDate}</div>
                            <div className="text-[10px] text-slate-400 font-bold">({log.waktu_sesi || 'Subuh'})</div>
                          </td>
                          <td className="px-4 py-3 font-black text-slate-800 uppercase">{sNama}</td>
                          <td className="px-4 py-3 font-bold text-emerald-700">{log.kegiatan || 'Ziyadah'}</td>
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {log.juz_akhir ? (
                              <span>
                                Juz {log.juz_awal} Pjk {log.pojok_awal} ➔ Juz {log.juz_akhir} Pjk {log.pojok_akhir}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                              {log.kehadiran || 'Hadir'}
                            </span>
                          </td>
                         <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(log)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                              title="Edit Setoran ini"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLogUstadz(log.id)}
                              disabled={isSubmitting}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm disabled:opacity-50"
                              title="Hapus Setoran ini"
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          </div>
                        </td>
                        </tr>
                      );
                    })}
                    {historySetoran.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400 font-bold">
                          Belum ada riwayat setoran yang Anda inputkan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'rekap' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
            {selectedSantri ? (
              <div className="space-y-5">
                {/* Header & Back Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setSelectedSantri(null)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors mt-0.5"
                      title="Kembali ke Daftar Santri"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">{selectedSantri.nama}</h3>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">
                        NIS: {selectedSantri.nis || '-'} • Kelas: {selectedSantri.kelas || '-'} • Kamar: {selectedSantri.kamar || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-black self-start sm:self-auto shadow-sm">
                    {filteredSantriHistory.length} Riwayat Setoran
                  </div>
                </div>

                {/* Info Card Capaian & Statistik Santri */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-100/80 shadow-sm">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Target size={14} className="text-emerald-600" /> Capaian Terakhir
                    </div>
                    <div className="text-base font-black text-slate-800 mt-1.5">
                      {santriHistoryStats.lastZiyadah}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      Muroja'ah: {santriHistoryStats.lastMurojaah}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-50/30 p-4 rounded-2xl border border-emerald-100/80 shadow-sm">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen size={14} className="text-emerald-600" /> Riwayat Ziyadah
                    </div>
                    <div className="text-2xl font-black text-emerald-700 mt-1">
                      {santriHistoryStats.ziyadahCount} <span className="text-xs font-bold text-slate-500">Sesi</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {santriHistoryFilter === 'week'
                        ? '7 hari terakhir'
                        : santriHistoryFilter === 'month'
                        ? '30 hari terakhir'
                        : 'Semua waktu'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50/70 to-blue-50/30 p-4 rounded-2xl border border-blue-100/80 shadow-sm">
                    <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <RefreshCw size={14} className="text-blue-600" /> Riwayat Muroja'ah
                    </div>
                    <div className="text-2xl font-black text-blue-700 mt-1">
                      {santriHistoryStats.murojaahCount} <span className="text-xs font-bold text-slate-500">Sesi</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {santriHistoryFilter === 'week'
                        ? '7 hari terakhir'
                        : santriHistoryFilter === 'month'
                        ? '30 hari terakhir'
                        : 'Semua waktu'}
                    </div>
                  </div>
                </div>

                {/* Filter Waktu Riwayat */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Filter size={14} className="text-emerald-600" /> Filter Rentang Waktu:
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setSantriHistoryFilter('week')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        santriHistoryFilter === 'week'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Minggu Terakhir
                    </button>
                    <button
                      onClick={() => setSantriHistoryFilter('month')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        santriHistoryFilter === 'month'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Bulan Terakhir
                    </button>
                    <button
                      onClick={() => setSantriHistoryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        santriHistoryFilter === 'all'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua Waktu
                    </button>
                  </div>
                </div>

                {/* Table Riwayat Santri */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Tanggal & Sesi</th>
                        <th className="px-4 py-3">Kehadiran</th>
                        <th className="px-4 py-3">Kegiatan</th>
                        <th className="px-4 py-3">Pencapaian</th>
                        <th className="px-4 py-3">Keterangan</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSantriHistory.map((log: any) => {
                        const cleanDate = log.tanggal ? String(log.tanggal).split(' ')[0].split('T')[0] : '-';
                        return (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-800">{cleanDate}</div>
                              <div className="text-[10px] text-slate-400 font-bold">({log.waktu_sesi || 'Subuh'})</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {log.kehadiran}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-700">{log.kegiatan}</td>
                            <td className="px-4 py-3">
                              {log.juz_akhir ? (
                                <div className="font-extrabold text-emerald-700">
                                  Juz {log.juz_awal} Pjk {log.pojok_awal} ➔ Juz {log.juz_akhir} Pjk {log.pojok_akhir}
                                  <span className="ml-2 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-emerald-800">
                                    {getDisplayLogHalaman(log)} Hal
                                  </span>
                                </div>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-500">{log.keterangan || '-'}</td>
                            <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(log)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                                title="Edit Setoran"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteLogUstadz(log.id)}
                                disabled={isSubmitting}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm disabled:opacity-50"
                                title="Hapus Setoran"
                              >
                                <Trash2 size={12} /> Hapus
                              </button>
                            </div>
                          </td>
                          </tr>
                        );
                      })}
                      {filteredSantriHistory.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                            Tidak ada riwayat setoran pada rentang waktu yang dipilih.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between mb-4">
                  <h2 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    <History size={17} className="text-emerald-600" /> Capaian Terakhir
                  </h2>
                  <div className="text-xs text-emerald-700 font-bold bg-emerald-100/70 px-3 py-1 rounded-xl border border-emerald-200">
                    {santriList.length} Santri
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">NAMA SANTRI</th>
                        <th className="px-4 py-3">ZIYADAH TERAKHIR</th>
                        <th className="px-4 py-3">DERESAN A TERAKHIR</th>
                        <th className="px-4 py-3">DERESAN B TERAKHIR</th>
                        <th className="px-4 py-3 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {santriCapaianTerakhir.map((santri: any) => (
                        <tr key={santri.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-extrabold text-slate-800">{santri.nama}</div>
                            <div className="text-[10px] text-slate-400 font-bold">
                              {santri.nis || '-'} • Kelas {santri.kelas || '-'}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-emerald-700">
                            {santri.lastZiyadah ? (
                              <div>
                                <span className="font-black text-slate-800">
                                  Juz {santri.lastZiyadah.juz_akhir} Hal {santri.lastZiyadah.pojok_akhir}
                                </span>
                                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                                  {formatShortDate(santri.lastZiyadah.tanggal)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">Belum Ada</span>
                            )}
                          </td>
                          
                          {/* Kolom Baru: Deresan A Terakhir */}
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {santri.lastDeresanA ? (
                              <div>
                                <span className="font-black text-slate-800">
                                  Juz {santri.lastDeresanA.juz_akhir} Hal {santri.lastDeresanA.pojok_akhir}
                                </span>
                                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                                  {formatShortDate(santri.lastDeresanA.tanggal)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">Belum Ada</span>
                            )}
                          </td>
                    
                          {/* Kolom Baru: Deresan B Terakhir */}
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {santri.lastDeresanB ? (
                              <div>
                                <span className="font-black text-slate-800">
                                  Juz {santri.lastDeresanB.juz_akhir} Hal {santri.lastDeresanB.pojok_akhir}
                                </span>
                                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                                  {formatShortDate(santri.lastDeresanB.tanggal)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">Belum Ada</span>
                            )}
                          </td>
                    
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleOpenSantriHistory(santri)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <History size={13} /> Riwayat
                            </button>
                          </td>
                        </tr>
                      ))}
                      {santriCapaianTerakhir.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-slate-400 font-bold">
                            Belum ada data santri pada halaqoh ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === 'bulanan' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
              <h2 className="font-black text-slate-800 text-sm flex items-center gap-2">
                <Calendar size={17} className="text-emerald-600" /> Laporan Bulanan Halaqoh
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Pilih Bulan:</span>
                <input
                  type="month"
                  className="p-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 outline-none"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">NAMA SANTRI</th>
                    <th className="px-4 py-3 text-center">AWAL ZIYADAH</th>
                    <th className="px-4 py-3 text-center">AKHIR ZIYADAH</th>
                    <th className="px-4 py-3 text-center">TOTAL ZIYADAH</th>
                    <th className="px-4 py-3 text-center">TARGET POJOKAN</th>
                    <th className="px-4 py-3 text-center">TARGET LEMBAGA</th>
                   <th className="px-4 py-3 text-center">AWAL DERESAN A</th>
                    <th className="px-4 py-3 text-center">AKHIR DERESAN A</th>
                    <th className="px-4 py-3 text-center">AWAL DERESAN B</th>
                    <th className="px-4 py-3 text-center">AKHIR DERESAN B</th>
                    <th className="px-4 py-3 text-center">DERESAN A</th>
                    <th className="px-4 py-3 text-center">DERESAN B</th>
                    <th className="px-4 py-3 text-center">TOTAL (A+B)</th>
                    <th className="px-4 py-3 text-center">TARGET DERESAN</th>
                    <th className="px-3 py-3 text-center" title="Tidak Setor">TS</th>
                    <th className="px-3 py-3 text-center" title="Sakit">S</th>
                    <th className="px-3 py-3 text-center" title="Izin">I</th>
                    <th className="px-3 py-3 text-center" title="Alfa">A</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rekapBulananList.map((santri: any) => (
                    <tr key={santri.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-800">{santri.nama}</span>
                          {santri.isKhotimin ? (
                            <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                              👑 Khotimin
                            </span>
                          ) : santri.isKhatamOrKhotimin ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                              ✓ Khatam
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                          {santri.nis || '-'} • Kelas {santri.kelas || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700 bg-emerald-50/20">
                        {santri.zAwal}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-emerald-700 bg-emerald-50/20">
                        {santri.zAkhir}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-emerald-600 text-sm bg-emerald-50/40">
                        {santri.totalZiyadah} <span className="text-[10px] text-slate-400 font-normal">Hal</span>
                      </td>
                      <td className="px-4 py-3 text-center bg-emerald-50/30">
                        {santri.sudahPojokan ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <Check size={11} /> SUDAH
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <X size={11} /> BELUM
                          </span>
                        )}
                        {santri.targetPojokanVal > 0 && (
                          <div className="text-[9px] text-slate-400 font-semibold mt-0.5">Target: {santri.targetPojokanVal} Pjk</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center bg-teal-50/30">
                        {santri.sudahLembaga ? (
                          <span className="bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <Check size={11} /> SUDAH
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <X size={11} /> BELUM
                          </span>
                        )}
                        {santri.targetLembagaText && (
                          <div className="text-[9px] text-slate-400 font-semibold mt-0.5">{santri.targetLembagaText}</div>
                        )}
                      </td>
                      {/* Kolom Deresan A */}
                      <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50/20">
                        {santri.dAwalA}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-blue-700 bg-blue-50/20">
                        {santri.dAkhirA}
                      </td>
                      
                      {/* Kolom Deresan B */}
                      <td className="px-4 py-3 text-center font-bold text-slate-700 bg-indigo-50/20">
                        {santri.dAwalB}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-indigo-700 bg-indigo-50/20">
                        {santri.dAkhirB}
                      </td> 
                      <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50/10">
                        {santri.totalDeresanA}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700 bg-blue-50/20">
                        {santri.totalDeresanB}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-blue-600 text-sm bg-blue-50/40">
                        {santri.totalMurojaah} <span className="text-[10px] text-slate-400 font-normal">Hal</span>
                      </td>
                      <td className="px-4 py-3 text-center bg-blue-50/30">
                        {santri.sudahDeresan ? (
                          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <Check size={11} /> SUDAH
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <X size={11} /> BELUM
                          </span>
                        )}
                        {santri.targetDeresanVal > 0 && (
                          <div className="text-[9px] text-slate-400 font-semibold mt-0.5">Target: {santri.targetDeresanVal} Pjk</div>
                        )}
                      </td>
                      {/* Kolom Kehadiran TS, S, I, A */}
                      <td className="px-3 py-3 text-center font-bold text-amber-700 bg-amber-50/10">
                        {santri.totalTS > 0 ? santri.totalTS : '-'}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-purple-700 bg-purple-50/10">
                        {santri.totalS > 0 ? santri.totalS : '-'}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-blue-700 bg-blue-50/10">
                        {santri.totalI > 0 ? santri.totalI : '-'}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-rose-700 bg-rose-50/10">
                        {santri.totalA > 0 ? santri.totalA : '-'}
                      </td>
                    </tr>
                  ))}
                  {rekapBulananList.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-6 text-slate-400 font-bold">
                        Belum ada santri binaan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {}
        {editingLog && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                    <Pencil size={17} className="text-emerald-600" /> Edit Riwayat Setoran
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold mt-0.5 text-slate-800">
                    {santriList.find((s) => s.id === editingLog.santri_id || s.nis === editingLog.santri_id)?.nama || 'Santri'}
                  </p>
                </div>
                <button onClick={() => setEditingLog(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveUstadzEdit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal</label>
                    <input
                      type="date"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={editLogForm.tanggal || ''}
                      onChange={(e) => setEditLogForm({ ...editLogForm, tanggal: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Waktu Sesi</label>
                    <select
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={editLogForm.waktu_sesi || 'Subuh'}
                      onChange={(e) => setEditLogForm({ ...editLogForm, waktu_sesi: e.target.value })}
                    >
                      <option value="Subuh">Subuh</option>
                      <option value="Asar">Asar</option>
                      <option value="Maghrib">Maghrib</option>
                      <option value="Isya'">Isya'</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Kehadiran</label>
                    <select
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={editLogForm.kehadiran || 'Hadir'}
                      onChange={(e) => setEditLogForm({ ...editLogForm, kehadiran: e.target.value })}
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Setor">Tidak Setor</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Izin">Izin</option>
                      <option value="Alfa">Alfa</option>
                      <option value="Deresan Mandiri">Deresan Mandiri</option>
                      <option value="Yanbu'a">Yanbu'a</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Kegiatan</label>
                    <select
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      value={editLogForm.kegiatan || 'Ziyadah'}
                      onChange={(e) => setEditLogForm({ ...editLogForm, kegiatan: e.target.value })}
                    >
                      <option value="Ziyadah">Ziyadah</option>
                      <option value="Deresan A">Deresan A</option>
                      <option value="Deresan B">Deresan B</option>
                    </select>
                  </div>
                </div>

                {editLogForm.kehadiran === 'Hadir' && (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block mb-2">
                      Capaian Ayat / Halaman (Start: Juz 1)
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Juz Awal</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          value={editLogForm.juz_awal}
                          onChange={(e) => setEditLogForm({ ...editLogForm, juz_awal: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Pjk Awal</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          value={editLogForm.pojok_awal}
                          onChange={(e) => setEditLogForm({ ...editLogForm, pojok_awal: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Juz Akhir</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          value={editLogForm.juz_akhir}
                          onChange={(e) => setEditLogForm({ ...editLogForm, juz_akhir: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Pjk Akhir</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          value={editLogForm.pojok_akhir}
                          onChange={(e) => setEditLogForm({ ...editLogForm, pojok_akhir: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Catatan / Keterangan</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    value={editLogForm.keterangan || ''}
                    onChange={(e) => setEditLogForm({ ...editLogForm, keterangan: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingLog(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                  >
                    {isSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'portal' | 'admin' | 'ustadz'>('portal');

  if (view === 'admin') {
    return <AdminView onBack={() => setView('portal')} />;
  }

  if (view === 'ustadz') {
    return <UstadzView onBack={() => setView('portal')} />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#022c22',
        margin: 0,
        padding: '1rem',
        boxSizing: 'border-box'
      }}
      className="min-h-screen w-full bg-emerald-950 flex items-center justify-center p-4 relative overflow-hidden"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          textAlign: 'center',
          boxSizing: 'border-box',
          margin: 'auto'
        }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center relative z-10 border border-emerald-900/10"
      >
        <div
          style={{
            width: '4rem',
            height: '4rem',
            margin: '0 auto 1rem auto',
            borderRadius: '1rem',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)'
          }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30"
        >
          <BookOpen size={34} />
        </div>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: '#1e293b',
            margin: '0 0 0.25rem 0',
            lineHeight: 1.2
          }}
          className="text-2xl font-black text-slate-800"
        >
          Sistem Tahfidh Putra
        </h1>
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#64748b',
            margin: '0 0 1.5rem 0'
          }}
          className="text-xs text-slate-500 font-bold mt-1"
        >
          Pondok Pesantren Putra • Monitoring Hafalan
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="space-y-3 mt-6">
          <button
            type="button"
            onClick={() => setView('ustadz')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl flex items-center justify-between transition-all group"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="flex items-center gap-3">
              <div
                style={{
                  padding: '0.625rem',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm"
              >
                <BookOpen size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 900, color: '#1e293b' }} className="font-black text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                  Masuk Ustadz
                </h3>
                <p style={{ margin: 0, fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }} className="text-[11px] text-slate-500 font-semibold">
                  Input setoran hafalan santri binaan
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => setView('admin')}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between transition-all group"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="flex items-center gap-3">
              <div
                style={{
                  padding: '0.625rem',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="p-2.5 bg-slate-800 text-white rounded-xl shadow-sm"
              >
                <ShieldCheck size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 900, color: '#1e293b' }} className="font-black text-slate-800 text-sm group-hover:text-slate-900 transition-colors">
                  Masuk Admin
                </h3>
                <p style={{ margin: 0, fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }} className="text-[11px] text-slate-500 font-semibold">
                  Dashboard live, target & kelola database
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.6875rem',
            color: '#94a3b8',
            fontWeight: 600
          }}
          className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-semibold"
        >
          Aplikasi Manajemen Tahfidh Putra © 2026
        </div>
      </div>
    </div>
  );
}
