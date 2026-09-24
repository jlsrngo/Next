import ArunakiNavbar from '@/components/ArunakiNavbar';
import ArunakiFooter from '@/components/ArunakiFooter';
import { Link } from '@/i18n/navigation';
import { Download, CheckCircle2, Github, ExternalLink, Terminal, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isId = params.locale === 'id';
  return {
    title: isId
      ? 'Pusat Unduhan Biner | Arunaki'
      : 'Download Center & Binaries | Arunaki',
    description: isId
      ? 'Unduh paket instalasi Arunaki untuk Windows (Setup / Portable) dan macOS Universal.'
      : 'Download pre-built Arunaki application packages for Windows (Setup / Portable) and macOS Universal.',
  };
}

export default function ArunakiDownloadPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const isId = locale === 'id';

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased flex flex-col justify-between">
      <ArunakiNavbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 space-y-14 w-full flex-1">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-sans text-zinc-400">
            <Link href="/arunaki" className="hover:underline">arunaki</Link>
            <span>/</span>
            <span className="text-black dark:text-white font-semibold">download</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white font-sans leading-tight">
            {isId ? 'Pusat Unduhan Arunaki' : 'Download Arunaki Packages'}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Paket biner resmi siap pakai untuk Windows dan macOS, serta panduan setup developer open-source.'
              : 'Official pre-built binary packages ready for Windows and macOS, plus open-source developer setup.'}
          </p>
        </div>

        {/* 1. Pre-built Binaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Windows Setup */}
          <div className="p-6 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <span className="text-xs font-sans font-bold text-zinc-500 dark:text-zinc-400">
                {isId ? 'Direkomendasikan' : 'Recommended'}
              </span>
              <h2 className="font-semibold text-lg text-black dark:text-white font-sans">Windows Setup (.exe)</h2>
              <p className="text-xs sm:text-sm font-mono text-zinc-500">Arunaki-Setup-x64.exe</p>
              <ul className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400 font-sans pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>Windows 10 / 11 (64-bit)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>{isId ? 'Pembaruan otomatis latar belakang' : 'Background auto-update'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span>{isId ? 'Integrasi penuh Win32 COM Office' : 'Full Win32 COM Office integration'}</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-sans text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{isId ? 'Segera Hadir' : 'Coming Soon'}</span>
            </button>
          </div>

          {/* Windows Portable */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <span className="text-xs font-sans font-bold text-zinc-500">
                {isId ? 'Portabel' : 'Standalone'}
              </span>
              <h2 className="font-semibold text-lg text-black dark:text-white font-sans">Windows Portable (.zip)</h2>
              <p className="text-xs sm:text-sm font-mono text-zinc-500">Arunaki-Portable.zip</p>
              <ul className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400 font-sans pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{isId ? 'Tanpa instalasi' : 'Zero installation required'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{isId ? 'Jalankan dari Flashdisk USB' : 'Run directly from USB drive'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{isId ? 'Konfigurasi tersimpan lokal' : 'Locally stored configuration'}</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 font-sans text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{isId ? 'Segera Hadir' : 'Coming Soon'}</span>
            </button>
          </div>

          {/* macOS Universal */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <span className="text-xs font-sans font-bold text-zinc-500">
                {isId ? 'Universal' : 'Universal'}
              </span>
              <h2 className="font-semibold text-lg text-black dark:text-white font-sans">macOS Universal (.dmg)</h2>
              <p className="text-xs sm:text-sm font-mono text-zinc-500">Arunaki-Universal.dmg</p>
              <ul className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400 font-sans pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>Apple Silicon (M1-M4) & Intel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>macOS Monterey (12.0+)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{isId ? 'Sandbox workspace terisolasi' : 'Isolated sandboxed workspace'}</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 font-sans text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{isId ? 'Segera Hadir' : 'Coming Soon'}</span>
            </button>
          </div>
        </div>

        {/* 2. Developer / CLI Setup */}
        <div className="p-6 sm:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            <h2 className="font-semibold text-lg text-black dark:text-white font-sans">
              {isId ? 'Pemasangan Developer (CLI & Source Code)' : 'Developer Setup (CLI & Source Code)'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Jalankan Arunaki langsung dari source code menggunakan runtime Bun:'
              : 'Run Arunaki directly from source code using the Bun runtime:'}
          </p>

          <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 space-y-3">
            <div>
              <span className="text-zinc-400"># 1. {isId ? 'Kloning repositori' : 'Clone repository'}</span>
              <p>git clone https://github.com/jlsrngo/Arunaki.git && cd Arunaki</p>
            </div>
            <div>
              <span className="text-zinc-400"># 2. {isId ? 'Pasang dependensi menggunakan Bun' : 'Install dependencies using Bun'}</span>
              <p>bun install</p>
            </div>
            <div>
              <span className="text-zinc-400"># 3. {isId ? 'Jalankan server web & desktop workstation' : 'Start web server & desktop workstation'}</span>
              <p>npm run dev</p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="https://github.com/jlsrngo/Arunaki"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-sans text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Github className="w-4 h-4" />
              <span>{isId ? 'Lihat Repositori di GitHub' : 'View Repository on GitHub'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </main>

      <ArunakiFooter locale={locale} />
    </div>
  );
}
