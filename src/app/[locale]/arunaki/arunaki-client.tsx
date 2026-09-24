'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FileCode,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  Layers,
  Sparkles,
  Cpu,
  RotateCcw,
  Boxes,
  Zap,
} from 'lucide-react';

interface ArunakiClientProps {
  locale: string;
}

export default function ArunakiClient({ locale }: ArunakiClientProps) {
  const isId = locale === 'id';
  const [activeTab, setActiveTab] = useState<'quickstart' | 'concepts' | 'features' | 'prompts'>('quickstart');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const samplePrompts = [
    {
      label: isId ? 'Rekap Keuangan Excel' : 'Excel Financial Summary',
      prompt: 'Rekap pemasukan dan pengeluaran hari ini ke laporan_keuangan.xlsx pada sheet "Agustus 2026", hitung total margin bersih otomatis.',
      category: 'Excel (.xlsx)',
    },
    {
      label: isId ? 'Pembaruan Kontrak Word' : 'Word Contract Update',
      prompt: 'Ganti nama klien di kontrak_kerjasama.docx menjadi "PT Surya Mandiri Utama" dan perbarui tanggal efektif ke 1 September 2026.',
      category: 'Word (.docx)',
    },
    {
      label: isId ? 'Penggabungan & Watermark PDF' : 'PDF Merge & Stamp',
      prompt: 'Gabungkan seluruh file invoice PDF di folder invoices/ bulan ini ke invoice_gabungan.pdf lalu bubuhkan stempel watermark "LUNAS".',
      category: 'PDF Pipeline',
    },
    {
      label: isId ? 'Validasi Buku Besar Akuntansi' : 'Ledger Balance Audit',
      prompt: 'Audit seluruh entri jurnal transaksi di jurnal_umum.xlsx, pastikan total debit dan kredit seimbang, beri flag selisih jika ada.',
      category: 'Financial Ledger',
    },
  ];

  return (
    <div className="py-8 md:py-12 space-y-16 animate-fade-in">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isId ? 'Kembali ke Daftar Proyek' : 'Back to Projects'}</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="#download"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isId ? 'Unduh' : 'Download'}</span>
          </a>
          <a
            href="#docs"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isId ? 'Dokumentasi' : 'Documentation'}</span>
          </a>
          <a
            href="https://github.com/jlsrngo/Arunaki"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>v0.1.0 • Desktop Electron Agent Workstation</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
            Arunaki
          </h1>
          <p className="text-xl md:text-2xl font-bold text-zinc-700 dark:text-zinc-300">
            The Desktop Document Agent Workstation & Automation Harness
          </p>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {isId
              ? 'Sistem otomatisasi desktop cerdas untuk spreadsheet Microsoft Excel, kontrak Word, slide presentasi PowerPoint, pipeline PDF, dan pembukuan finansial. Beroperasi secara lokal dan sandboxed menggunakan Electron dengan eksekusi COM native tanpa mengunggah data rahasia ke cloud.'
              : 'Native desktop document computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers. Built with Electron for native COM automation strictly sandboxed within your local machine.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#download"
            className="px-5 py-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs md:text-sm hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isId ? 'Unduh Arunaki (.exe)' : 'Download Arunaki (.exe)'}</span>
          </a>
          <a
            href="#docs"
            className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs md:text-sm hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isId ? 'Buka Dokumentasi' : 'Read Documentation'}</span>
          </a>
          <a
            href="https://github.com/jlsrngo/Arunaki"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs md:text-sm hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            <span>Source Code</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Live Simulation Terminal Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-zinc-500">
              <Terminal className="w-4 h-4" />
              <span>arunaki-workstation // electron-core</span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Local Sandbox Active
            </span>
          </div>

          <div className="font-mono text-xs space-y-2 text-zinc-800 dark:text-zinc-300">
            <div className="text-zinc-500">
              &gt; Workspace: C:\Users\Finance\Documents\Laporan_2026
            </div>
            <div className="text-zinc-900 dark:text-zinc-100 font-semibold">
              &gt; User: &quot;Rekap pemasukan dan pengeluaran hari ini ke laporan_keuangan.xlsx&quot;
            </div>
            <div className="text-zinc-600 dark:text-zinc-400 pl-4 border-l-2 border-zinc-400 dark:border-zinc-700 space-y-1">
              <p>[COM Bridge] Attaching to Microsoft Excel COM engine (headless)...</p>
              <p>[Snapshot] Created immutable backup: .arunaki/checkpoints/20260924_1220.xlsx</p>
              <p>[Formula Guard] Preserved formulas: =SUM(B2:B38), =IF(D2&gt;0, &quot;PROFIT&quot;, &quot;DEFICIT&quot;)</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">[Complete] 32 baris transaksi berhasil direkap dan diverifikasi tanpa konflik.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="space-y-6 scroll-mt-20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <Download className="w-3.5 h-3.5" />
            <span>Download Center</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white">
            {isId ? 'Unduh Paket Instalasi Arunaki' : 'Download Arunaki Packages'}
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
            {isId
              ? 'Tersedia installer siap pakai untuk Windows x64 dan versi portabel standalone.'
              : 'Pre-built installer packages available for Windows x64 and standalone portable version.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Windows Setup Installer */}
          <div className="relative rounded-2xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 p-6 flex flex-col justify-between space-y-5 hover:border-zinc-500 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 uppercase tracking-wider">
                  Recommended
                </span>
                <span className="text-[11px] font-mono text-zinc-500">v0.1.0</span>
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Windows Setup Installer</h3>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Arunaki-Setup-x64.exe</p>
              <ul className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Windows 10 / 11 (64-bit)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Setup Wizard + Auto-update
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Office 2016+ COM Support
                </li>
              </ul>
            </div>
            <a
              href="https://github.com/jlsrngo/Arunaki/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isId ? 'Unduh Installer (.exe)' : 'Download Installer (.exe)'}</span>
            </a>
          </div>

          {/* Windows Portable */}
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Standalone
                </span>
                <span className="text-[11px] font-mono text-zinc-500">v0.1.0</span>
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Windows Portable (.zip)</h3>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Arunaki-Portable.zip</p>
              <ul className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Tanpa Perlu Instalasi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Siap Dijalankan dari Flashdisk
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Konfigurasi Disimpan Lokal
                </li>
              </ul>
            </div>
            <a
              href="https://github.com/jlsrngo/Arunaki/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isId ? 'Unduh Portable (.zip)' : 'Download Portable (.zip)'}</span>
            </a>
          </div>

          {/* macOS Package */}
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 flex flex-col justify-between space-y-5 hover:border-zinc-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Development
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Preview</span>
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">macOS Universal (.dmg)</h3>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Arunaki-Universal.dmg</p>
              <ul className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Apple Silicon & Intel x64
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> macOS 12 Monterey or later
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Sandboxed Workspace
                </li>
              </ul>
            </div>
            <a
              href="https://github.com/jlsrngo/Arunaki/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isId ? 'Lihat Rilis GitHub' : 'View GitHub Releases'}</span>
            </a>
          </div>
        </div>

        {/* Security & Sandbox Guarantee Notice */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-black dark:text-white">
              {isId ? 'Jaminan Keamanan & Privasi File Lokal' : 'Local Sandbox Security Guarantee'}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {isId
                ? 'Arunaki beroperasi 100% di dalam folder kerja yang Anda pilih. Aplikasi ini tidak pernah mengunggah isi file, formula rahasia, atau data perusahaan ke server publik.'
                : 'Arunaki is strictly sandboxed to the folder you specify. It does not upload file contents, confidential formulas, or corporate data to public cloud servers.'}
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="space-y-6 scroll-mt-20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Documentation Hub</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white">
            {isId ? 'Dokumentasi & Panduan Lengkap' : 'Arunaki Documentation'}
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
            {isId
              ? 'Pelajari konsep inti, alur kerja, arsitektur COM bridge, dan contoh prompt otomasi.'
              : 'Explore core concepts, COM bridge architecture, workflows, and natural language prompts.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'quickstart'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm border border-slate-300 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isId ? '1. Panduan Cepat' : '1. Quick Start'}</span>
          </button>
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'concepts'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm border border-slate-300 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isId ? '2. Konsep & Arsitektur' : '2. Core Architecture'}</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'features'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm border border-slate-300 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>{isId ? '3. Fitur Dokumen' : '3. Document Features'}</span>
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'prompts'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm border border-slate-300 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isId ? '4. Katalog Prompt' : '4. Prompt Catalog'}</span>
          </button>
        </div>

        {/* Tab Content 1: Quick Start */}
        {activeTab === 'quickstart' && (
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-6">
            <h3 className="text-lg font-bold text-black dark:text-white">
              {isId ? 'Langkah Memulai Menggunakan Arunaki' : 'Getting Started with Arunaki'}
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-300 dark:border-zinc-700">
                  1
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-black dark:text-white">
                    {isId ? 'Unduh dan Pasang Installer' : 'Download and Run Installer'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? 'Unduh file Arunaki-Setup-x64.exe dari bagian Download. Buka installer dan ikuti petunjuk wizard hingga selesai.'
                      : 'Download Arunaki-Setup-x64.exe from the Download section and follow the setup wizard.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-300 dark:border-zinc-700">
                  2
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-black dark:text-white">
                    {isId ? 'Tentukan Folder Workspace Sandboxed' : 'Select Sandboxed Workspace Folder'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? 'Saat Arunaki pertama kali terbuka, pilih direktori folder tempat dokumen bisnis Anda disimpan (misalnya C:\\Dokumen\\Kantor). Arunaki secara otomatis terkunci hanya pada folder tersebut demi keamanan penuh.'
                      : 'Select your local working folder. Arunaki is strictly sandboxed to this folder and cannot modify or access external directories.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-300 dark:border-zinc-700">
                  3
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-black dark:text-white">
                    {isId ? 'Ketik Instruksi Bahasa Alami' : 'Type Natural Language Instructions'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? 'Ketik perintah seperti merekap transaksi ke Excel, mengganti pasal kontrak Word, atau menggabungkan invoice PDF. Arunaki mengeksekusi langsung di komputer Anda secara transparan.'
                      : 'Type short instructions to manipulate spreadsheets, generate contracts, or stamp invoices. Arunaki executes actions natively on your workstation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Core Concepts */}
        {activeTab === 'concepts' && (
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-6">
            <h3 className="text-lg font-bold text-black dark:text-white">
              {isId ? 'Konsep Inti & Arsitektur Keamanan' : 'Core Architecture & Security Concepts'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 space-y-2">
                <ShieldCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <h4 className="font-bold text-xs text-black dark:text-white">
                  {isId ? 'Folder Sandbox Terkunci' : 'Workspace Sandbox'}
                </h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isId
                    ? 'Akses I/O dibatasi hanya pada folder kerja yang Anda pilih. Tidak ada akses ke disk root atau file sistem.'
                    : 'I/O operations strictly confined to the selected workspace folder without system file access.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 space-y-2">
                <Cpu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <h4 className="font-bold text-xs text-black dark:text-white">
                  {isId ? 'Native Office COM Bridge' : 'Native COM Automation'}
                </h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isId
                    ? 'Berinteraksi langsung dengan mesin Microsoft Excel/Word untuk menjaga rumus =SUM(), macro, dan format tetap 100% utuh.'
                    : 'Communicates directly with native Office COM engines preserving dynamic formulas, charts, and styling.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 space-y-2">
                <RotateCcw className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <h4 className="font-bold text-xs text-black dark:text-white">
                  {isId ? '1-Click Rollback Snapshot' : '1-Click Rollback Checkpoints'}
                </h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isId
                    ? 'Snapshot lokal dibuat otomatis sebelum setiap perubahan. File asli dapat dikembalikan seketika hanya dengan 1 klik.'
                    : 'Immutable local backups created before file mutations, allowing instantaneous one-click rollbacks.'}
                </p>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Pipeline Arsitektur Sistem
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-semibold text-black dark:text-white">
                  User Prompt
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-semibold text-black dark:text-white">
                  Electron Shell
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-semibold text-black dark:text-white">
                  Agent Harness
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-semibold text-black dark:text-white">
                  COM Bridge
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 font-semibold text-emerald-700 dark:text-emerald-300 col-span-2 md:col-span-1">
                  Local Sandbox
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Document Features */}
        {activeTab === 'features' && (
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-6">
            <h3 className="text-lg font-bold text-black dark:text-white">
              {isId ? 'Kemampuan Otomasi Dokumen & Format' : 'Document Automation Capabilities'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-black dark:text-white">
                  <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
                  <span>Microsoft Excel (.xlsx, .xlsm)</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isId
                    ? 'Menulis ke sel target (misal B2, S14), mengevaluasi rumus dinamis, mengkloning template sheet bulanan, dan ekspor ke PDF.'
                    : 'Direct cell coordinates reading/writing, dynamic formula evaluation, monthly sheet cloning, and headless PDF export.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-black dark:text-white">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span>Microsoft Word (.docx)</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isId
                    ? 'Penggantian klausul kontrak otomatis, injeksi nama pihak kedua, tabel transaksi, dengan mempertahankan margin & font asli.'
                    : 'Automated clause replacement, dynamic table injection, and template population preserving typography and headers.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-black dark:text-white">
                  <FileCode className="w-4 h-4 text-zinc-500" />
                  <span>PDF Pipeline & Watermarking</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isId
                    ? 'Penggabungan batch invoice bulanan, penambahan stempel watermark digital (LUNAS, DRAFT), dan ekstraksi tabel data.'
                    : 'Batch merging, digital watermark stamping, cryptographic signing, and OCR table extraction.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-black dark:text-white">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  <span>Financial Ledger Engine</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isId
                    ? 'Validasi otomatis pembukuan akuntansi ganda (debit-kredit balance), deteksi selisih buku kas, dan sinkronisasi saldo akhir.'
                    : 'Dual-entry ledger validation, debit/credit balance verification, and automatic cash reconciliation auditing.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Prompt Catalog */}
        {activeTab === 'prompts' && (
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-6">
            <h3 className="text-lg font-bold text-black dark:text-white">
              {isId ? 'Katalog Contoh Prompt Bahasa Alami' : 'Natural Language Prompt Catalog'}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {isId
                ? 'Salin prompt di bawah ini langsung ke konsol Arunaki untuk mulai mengeksekusi otomatisasi dokumen.'
                : 'Copy any of these prompts directly into Arunaki to start automating your documents.'}
            </p>

            <div className="space-y-3">
              {samplePrompts.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-black dark:text-white">• {item.label}</span>
                    </div>
                    <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      &quot;{item.prompt}&quot;
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.prompt, index)}
                    className="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 text-black dark:text-white transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer info */}
      <div className="pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>Arunaki • The Desktop Document Agent Workstation & Automation Harness</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/jlsrngo/Arunaki"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1 text-black dark:text-white font-semibold"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
          <span>•</span>
          <Link href={`/${locale}/projects`} className="hover:underline">
            Julio Siringoringo Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
