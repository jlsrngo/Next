import ArunakiNavbar from '@/components/ArunakiNavbar';
import ArunakiFooter from '@/components/ArunakiFooter';
import { Link } from '@/i18n/navigation';
import { ShieldCheck, Terminal, RotateCcw, Lock, Database, AlertTriangle, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isId = params.locale === 'id';
  return {
    title: isId
      ? 'Dokumentasi & Arsitektur | Arunaki'
      : 'Documentation & Architecture | Arunaki',
    description: isId
      ? 'Pelajari arsitektur sistem, isolasi sandbox lokal, integrasi COM headless, dan pemulihan rollback pada Arunaki.'
      : 'Explore core architecture, local sandbox boundaries, headless COM integration, and rollback checkpoints in Arunaki.',
  };
}

export default function ArunakiDocsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const isId = locale === 'id';

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased flex flex-col justify-between">
      <ArunakiNavbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 space-y-16 w-full flex-1">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-sans text-zinc-400">
            <Link href="/arunaki" className="hover:underline">arunaki</Link>
            <span>/</span>
            <span className="text-black dark:text-white font-semibold">docs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white font-sans leading-tight">
            {isId ? 'Dokumentasi & Arsitektur' : 'Architecture & Core Concepts'}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Arsitektur sistem mendalam, alur pemanggilan COM native, batas isolasi sandbox lokal, dan mekanisme rollback snapshot.'
              : 'In-depth system architecture, native COM bridges, local sandbox boundaries, and rollback checkpoint mechanics.'}
          </p>
        </div>

        {/* 1. Architecture Pipeline Diagram */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-black dark:text-white">
            {isId ? 'Alur Pipeline Arsitektur Sistem' : 'System Architecture Pipeline'}
          </h2>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
              <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-xs font-mono text-zinc-400 mb-1">01. PROMPT</span>
                <span className="text-sm font-sans">User Input</span>
              </div>
              <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-xs font-mono text-zinc-400 mb-1">02. WORKSTATION</span>
                <span className="text-sm font-sans">Electron Shell</span>
              </div>
              <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-xs font-mono text-zinc-400 mb-1">03. HARNESS</span>
                <span className="text-sm font-sans">Tool Registry</span>
              </div>
              <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-xs font-mono text-zinc-400 mb-1">04. ADAPTERS</span>
                <span className="text-sm font-sans">COM / PDF / Ledger</span>
              </div>
              <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300 flex flex-col justify-center items-center shadow-sm">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1">05. SANDBOX</span>
                <span className="text-sm font-sans">Workspace Files</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Three Pillars */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-black dark:text-white">
            {isId ? 'Tiga Pilar Keamanan & Integritas' : 'Three Core Pillars of Arunaki'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? '1. Folder Sandbox Terkunci' : '1. Sandboxed Workspace'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Seluruh pembacaan dan penulisan berkas dibatasi 100% di dalam folder kerja yang dipilih. Lapisan StorageService secara ketat mencegat percobaan path traversal (../../) dan memblokir akses ke disk sistem root (C:\\Windows).'
                  : 'All file operations are confined 100% to the chosen workspace directory. StorageService actively intercepts path traversal attempts (../../) and strictly blocks access to root system files.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
              <Terminal className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? '2. Jembatan Win32 COM Native' : '2. Native Win32 COM Bridge'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Berbeda dengan AI berbasis cloud yang sering merusak formula, Arunaki berinteraksi langsung dengan mesin Microsoft Excel & Word lokal secara headless. Rumus dinamis (=SUM, =VLOOKUP), grafik, makro VBA, dan format margin tetap 100% utuh.'
                  : 'Unlike cloud AI models that corrupt formulas, Arunaki attaches directly to local Microsoft Excel and Word COM engines headlessly. Formulas (=SUM, =VLOOKUP), charts, VBA macros, and margins remain 100% intact.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
              <RotateCcw className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? '3. 1-Klik Rollback Checkpoint' : '3. 1-Click Rollback Checkpoints'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Sebelum file apapun dimodifikasi, Arunaki secara otomatis membuat salinan backup snapshot lokal yang tidak dapat diubah (immutable) di direktori .arunaki/checkpoints. Dokumen asli dapat dikembalikan seketika hanya dengan 1 klik.'
                  : 'Before applying mutations, Arunaki creates immutable local snapshots under .arunaki/checkpoints. If any automated edit needs to be reverted, restore the original file instantly with a single click.'}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Comparison Table */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-black dark:text-white">
            {isId ? 'Perbandingan: AI Cloud vs Arunaki Desktop' : 'Comparison: Cloud AI vs Arunaki Desktop'}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="p-4 font-semibold">{isId ? 'Aspek / Kemampuan' : 'Aspect / Capability'}</th>
                  <th className="p-4 font-semibold">{isId ? 'AI Cloud Konvensional' : 'Conventional Cloud AI'}</th>
                  <th className="p-4 font-semibold text-black dark:text-white">Arunaki Desktop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <td className="p-4 font-semibold text-black dark:text-white">{isId ? 'Kerahasiaan Dokumen' : 'Document Privacy'}</td>
                  <td className="p-4 text-red-500 font-medium">{isId ? 'File diunggah ke server cloud publik' : 'Files uploaded to public cloud servers'}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300 font-semibold">{isId ? '100% lokal & sandboxed (zero data leak)' : '100% local & sandboxed (zero data leak)'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-black dark:text-white">{isId ? 'Integritas Rumus Excel' : 'Excel Formula Retention'}</td>
                  <td className="p-4 text-red-500 font-medium">{isId ? 'Rumus sering terhapus jadi teks mati' : 'Formulas overwritten into static text'}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300 font-semibold">{isId ? 'Mesin COM asli menjaga semua formula' : 'Native COM engine preserves all formulas'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-black dark:text-white">{isId ? 'Pemulihan Kesalahan' : 'Error Recovery'}</td>
                  <td className="p-4 text-zinc-500">{isId ? 'Manual lewat riwayat file OS' : 'Manual file history retrieval'}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300 font-semibold">{isId ? '1-Klik Rollback Checkpoint otomatis' : 'Automatic 1-Click Rollback Checkpoints'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-black dark:text-white">{isId ? 'Kepatuhan Regulasi PII' : 'PII Compliance'}</td>
                  <td className="p-4 text-zinc-500">{isId ? 'Rentan kebocoran data KTP/NPWP' : 'High risk of NIK/tax ID data leaks'}</td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300 font-semibold">{isId ? 'doc_redact_pii masking otomatis' : 'Automated doc_redact_pii masking'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Security Boundaries */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-black dark:text-white">
            {isId ? 'Standar Keamanan Sandbox (Defense-in-Depth)' : 'Defense-in-Depth Security Boundaries'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-black dark:text-white font-semibold text-base font-sans">
                <ShieldCheck className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                <span>Isolated Workspace Sandbox</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Seluruh pembacaan dan penulisan berkas terkunci secara eksklusif ke folder kerja yang Anda pilih. Upaya path traversal dicegat dan diblokir seketika pada lapisan harness.'
                  : 'All file I/O operations are locked exclusively to the chosen folder. Path traversal attempts are intercepted and rejected at the harness layer.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-black dark:text-white font-semibold text-base font-sans">
                <Lock className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                <span>Zero OS Shell Access</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Harness agen Arunaki tidak mengeksekusi shell terminal bebas (cmd/powershell/bash), tidak mengunduh skrip dari luar, dan tidak mengubah konfigurasi sistem operasi Anda.'
                  : 'The agent harness cannot execute arbitrary terminal commands, download external scripts, or modify OS registry and settings.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-black dark:text-white font-semibold text-base font-sans">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Approval Gate for Destructive Actions</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Operasi yang bersifat permanen atau menghapus file wajib meminta persetujuan eksplisit melalui dialog interaktif sebelum dieksekusi.'
                  : 'Irreversible modifications and file deletions require explicit interactive user authorization before execution.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-black dark:text-white font-semibold text-base font-sans">
                <Database className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                <span>Local AES-256 Storage</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Kunci API dan konfigurasi sesi disimpan secara lokal menggunakan enkripsi AES-256 tanpa pernah disinkronisasi ke server cloud pihak ketiga.'
                  : 'API keys and local configurations are stored locally with AES-256 encryption, never transmitted to external cloud trackers.'}
              </p>
            </div>
          </div>
        </section>

        {/* 5. Configuration Table */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-black dark:text-white">
            {isId ? 'Konfigurasi & Variabel Lingkungan (.env)' : 'Configuration & Environment Variables'}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="p-4 font-semibold">Variable</th>
                  <th className="p-4 font-semibold">Default</th>
                  <th className="p-4 font-semibold">{isId ? 'Deskripsi' : 'Description'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <td className="p-4 font-mono font-semibold text-black dark:text-white">PORT</td>
                  <td className="p-4 font-mono text-zinc-500">3000</td>
                  <td className="p-4">{isId ? 'Port komunikasi server API lokal workstation.' : 'Local API server communication port.'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-semibold text-black dark:text-white">WORKSPACE_ROOT</td>
                  <td className="p-4 font-mono text-zinc-500">./workspace</td>
                  <td className="p-4">{isId ? 'Jalur folder sandboxed tempat dokumen kerja disimpan.' : 'Default directory for the isolated document workspace.'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-semibold text-black dark:text-white">DATABASE_URL</td>
                  <td className="p-4 font-mono text-zinc-500">file:./dev.db</td>
                  <td className="p-4">{isId ? 'Jalur penyimpanan basis data SQLite lokal.' : 'Local SQLite database storage path.'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-semibold text-black dark:text-white">OPENROUTER_API_KEY</td>
                  <td className="p-4 font-mono text-zinc-500">(Custom User Key)</td>
                  <td className="p-4">{isId ? 'Kunci API OpenRouter untuk routing model AI (disimpan lokal dengan AES-256).' : 'OpenRouter API key for model routing (encrypted locally with AES-256).'}</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-semibold text-black dark:text-white">DEFAULT_MODEL</td>
                  <td className="p-4 font-mono text-zinc-500">deepseek-v4-flash:free</td>
                  <td className="p-4">{isId ? 'Model inferensi default yang diarahkan melalui agent harness.' : 'Default model routed through the agent harness.'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Next Page Link */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <Link
            href="/arunaki/features"
            className="inline-flex items-center gap-2 text-base font-sans font-semibold text-black dark:text-white hover:underline group"
          >
            <span>{isId ? 'Lanjut ke Panduan Fitur Dokumen' : 'Next: Document Features'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      <ArunakiFooter locale={locale} />
    </div>
  );
}
