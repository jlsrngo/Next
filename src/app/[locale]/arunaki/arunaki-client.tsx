'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import ArunakiNavbar from '@/components/ArunakiNavbar';
import ArunakiFooter from '@/components/ArunakiFooter';
import {
  Download,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Terminal,
  FileSpreadsheet,
  FileText,
  FileCode,
  BookOpen,
  Boxes,
  Code2,
  Package,
} from 'lucide-react';

interface ArunakiClientProps {
  locale: string;
}

export default function ArunakiClient({ locale }: ArunakiClientProps) {
  const isId = locale === 'id';

  const [activeTab, setActiveTab] = useState<'curl' | 'winget' | 'bun' | 'npm' | 'brew' | 'git'>('curl');
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSimIndex, setActiveSimIndex] = useState(0);

  const installCommands = {
    curl: 'curl -fsSL https://arunaki.dev/install | bash',
    winget: 'winget install Arunaki.Desktop',
    bun: 'bun create arunaki-app ./workspace',
    npm: 'npx create-arunaki-app ./workspace',
    brew: 'brew install --cask arunaki',
    git: 'git clone https://github.com/jlsrngo/Arunaki.git && cd Arunaki && bun install && npm run dev',
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const simulations = isId
    ? [
        {
          category: 'Excel (.xlsx)',
          prompt: 'Rekap pemasukan dan pengeluaran hari ini ke laporan_keuangan.xlsx pada sheet "Agustus 2026", hitung total margin otomatis.',
          logs: [
            { tag: 'Security', text: 'Memeriksa jalur dalam sandbox: ./workspace/laporan_keuangan.xlsx (Izin diberikan)' },
            { tag: 'Snapshot', text: 'Membuat checkpoint lokal: .arunaki/checkpoints/20260924_1340_laporan.xlsx' },
            { tag: 'COM Bridge', text: 'Menghubungkan ke mesin Microsoft Excel COM (headless)... Terhubung PID 9482' },
            { tag: 'Execution', text: 'Menyisipkan 34 baris data ke sheet "Agustus 2026" (Rentang A24:E57)' },
            { tag: 'Formula Guard', text: 'Menjaga rumus dinamis: =SUM(D24:D57) dan =IF(E58>0,"PROFIT","DEFICIT")' },
            { tag: 'Success', text: 'Worksheet berhasil disimpan dan ditutup. 0 konflik schema terdeteksi. Rollback tersedia.' },
          ],
        },
        {
          category: 'Word (.docx)',
          prompt: 'Ganti nama klien di kontrak_kerjasama.docx menjadi "PT Surya Mandiri Utama" dan perbarui tanggal efektif ke 1 September 2026.',
          logs: [
            { tag: 'Security', text: 'Memverifikasi jalur: ./workspace/kontrak_kerjasama.docx (Workspace terisolasi)' },
            { tag: 'Snapshot', text: 'Backup snapshot dibuat: .arunaki/checkpoints/20260924_1341_kontrak.docx' },
            { tag: 'COM Bridge', text: 'Membuka antarmuka Word.Application COM (mode headless)' },
            { tag: 'Replace', text: 'Mengganti {{NAMA_KLIEN}} -> "PT Surya Mandiri Utama" (3 kecocokan)' },
            { tag: 'Replace', text: 'Mengganti {{TANGGAL_EFEKTIF}} -> "1 September 2026" (1 kecocokan)' },
            { tag: 'Success', text: 'Kontrak berhasil diperbarui. Margin (2.54cm) & font (Times New Roman 12pt) 100% terjaga.' },
          ],
        },
        {
          category: 'PDF & e-Materai',
          prompt: 'Gabungkan seluruh file invoice PDF di folder invoices/ bulan ini ke invoice_gabungan.pdf, bubuhkan e-Materai dan mask NIK/NPWP.',
          logs: [
            { tag: 'Scan', text: 'Menemukan 14 berkas PDF di ./workspace/invoices/*.pdf' },
            { tag: 'Merge', text: 'Mengeksekusi pdf_manage_pages(aksi: "merge"). Output: invoice_gabungan.pdf (28 halaman)' },
            { tag: 'PII Mask', text: 'Memindai data identitas sensitif... 14 NIK dan 14 NPWP berhasil disamarkan' },
            { tag: 'e-Materai', text: 'Membubuhkan stempel e-Materai resmi pada koordinat (X: 450, Y: 720) Halaman 1' },
            { tag: 'Success', text: 'Dokumen telah disegel dan diverifikasi secara kriptografis. Siap dikirim ke klien.' },
          ],
        },
        {
          category: 'Audit Buku Besar',
          prompt: 'Audit seluruh entri jurnal transaksi di jurnal_umum.xlsx, pastikan total debit dan kredit seimbang, beri flag selisih jika ada.',
          logs: [
            { tag: 'Audit', text: 'Memeriksa entri jurnal di ./workspace/jurnal_umum.xlsx (Rentang A2:F412)' },
            { tag: 'Calculate', text: 'Total Debit: Rp 1.482.350.000 | Total Kredit: Rp 1.482.350.000' },
            { tag: 'Check', text: 'Selisih Varian: Rp 0,00 (Keseimbangan sempurna)' },
            { tag: 'Success', text: 'Buku besar keuangan terverifikasi seimbang. Log audit tersimpan di .arunaki/audit_2026.json' },
          ],
        },
      ]
    : [
        {
          category: 'Excel (.xlsx)',
          prompt: 'Summarize today expenses into financial_report.xlsx on sheet "August 2026", calculate total net margin automatically.',
          logs: [
            { tag: 'Security', text: 'Checked path inside sandbox: ./workspace/financial_report.xlsx (Access granted)' },
            { tag: 'Snapshot', text: 'Created immutable checkpoint: .arunaki/checkpoints/20260924_1340_report.xlsx' },
            { tag: 'COM Bridge', text: 'Attaching to native Microsoft Excel COM engine (headless)... Attached PID 9482' },
            { tag: 'Execution', text: 'Injected 34 rows into sheet "August 2026" (Range A24:E57)' },
            { tag: 'Formula Guard', text: 'Preserved dynamic formula: =SUM(D24:D57) and =IF(E58>0,"PROFIT","DEFICIT")' },
            { tag: 'Success', text: 'Worksheet saved and closed. 0 schema conflicts detected. Rollback available.' },
          ],
        },
        {
          category: 'Word (.docx)',
          prompt: 'Replace client name in partnership_agreement.docx with "Surya Mandiri Corp" and update effective date to September 1, 2026.',
          logs: [
            { tag: 'Security', text: 'Verified path: ./workspace/partnership_agreement.docx (Isolated workspace)' },
            { tag: 'Snapshot', text: 'Backup checkpoint created: .arunaki/checkpoints/20260924_1341_contract.docx' },
            { tag: 'COM Bridge', text: 'Acquired Word.Application COM interface (headless mode)' },
            { tag: 'Replace', text: 'Substituted {{CLIENT_NAME}} -> "Surya Mandiri Corp" (3 occurrences)' },
            { tag: 'Replace', text: 'Substituted {{EFFECTIVE_DATE}} -> "September 1, 2026" (1 occurrence)' },
            { tag: 'Success', text: 'Contract updated successfully. Layout margins & fonts 100% preserved.' },
          ],
        },
        {
          category: 'PDF & e-Materai',
          prompt: 'Merge all invoice PDFs in invoices/ folder into combined_invoices.pdf, stamp digital seal, and redact ID/tax numbers.',
          logs: [
            { tag: 'Scan', text: 'Discovered 14 matching PDF files in ./workspace/invoices/*.pdf' },
            { tag: 'Merge', text: 'Executing pdf_manage_pages(action: "merge"). Output: combined_invoices.pdf (28 pages)' },
            { tag: 'PII Mask', text: 'Scanning sensitive identifiers... Redacted 14 identity and tax ID records' },
            { tag: 'e-Materai', text: 'Stamped official cryptographic seal at coordinates (X: 450, Y: 720) on Page 1' },
            { tag: 'Success', text: 'Document sealed and cryptographically verified. Ready for delivery.' },
          ],
        },
        {
          category: 'Ledger Audit',
          prompt: 'Audit all general journal transactions in general_ledger.xlsx, verify debit and credit equilibrium, flag discrepancies.',
          logs: [
            { tag: 'Audit', text: 'Inspecting journal entries in ./workspace/general_ledger.xlsx (Range A2:F412)' },
            { tag: 'Calculate', text: 'Total Debit: $1,482,350.00 | Total Credit: $1,482,350.00' },
            { tag: 'Check', text: 'Calculated Variance: $0.00 (Perfect equilibrium)' },
            { tag: 'Success', text: 'Financial ledger certified balance. Audit log generated at .arunaki/audit_2026.json' },
          ],
        },
      ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased flex flex-col justify-between">
      <ArunakiNavbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 space-y-20 w-full flex-1">
        {/* HERO SECTION */}
        <section id="hero" className="space-y-6">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1] font-sans">
              {isId ? 'Agen dokumen open source' : 'The open source document agent'}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              {isId
                ? 'Otomasi dokumen desktop cerdas untuk spreadsheet Microsoft Excel, kontrak Word, slide presentasi PowerPoint, pipeline PDF, dan pembukuan finansial. Beroperasi secara lokal dan sandboxed di komputer Anda.'
                : 'Native desktop computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers. Strictly sandboxed to your local machine.'}
            </p>
          </div>

          {/* INSTALL BOX */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/80 overflow-hidden shadow-sm">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-2 overflow-x-auto">
              {(['curl', 'winget', 'bun', 'npm', 'brew', 'git'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-sans font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-black dark:border-white text-black dark:text-white font-semibold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-3 text-sm sm:text-base font-mono">
              <code className="text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-nowrap selection:bg-zinc-300 dark:selection:bg-zinc-700">
                {installCommands[activeTab]}
              </code>
              <button
                onClick={() => copyToClipboard(installCommands[activeTab], 'install')}
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white transition-colors shrink-0"
                title={isId ? 'Salin perintah' : 'Copy command'}
              >
                {copied === 'install' ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {/* Warning: CLI not yet available */}
          <div className="flex items-start gap-2.5 mt-3 px-3.5 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-sans text-zinc-500 dark:text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>
              {isId
                ? 'Instalasi via CLI (curl, winget, npm, bun, brew, git) belum tersedia. Gunakan installer .exe dari halaman Download.'
                : 'CLI installation (curl, winget, npm, bun, brew, git) is not yet available. Use the .exe installer from the Download page.'}
            </span>
          </div>
        </section>


        {/* INTERACTIVE WORKSTATION SIMULATOR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-sm font-sans">
            <span className="text-zinc-500 font-medium text-xs sm:text-sm">
              {isId ? 'Pratinjau konsol langsung' : 'Live workstation preview'}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              {isId ? 'Sandbox lokal aktif' : 'Local sandbox active'}
            </span>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#09090b] text-zinc-200 font-mono text-xs sm:text-sm overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-[#0c0c0e]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-zinc-400 ml-2 text-xs">arunaki-agent // headless-com-worker</span>
              </div>
              <span className="text-zinc-500 text-xs">bun: 1.3.14 • electron: 43.2</span>
            </div>

            <div className="p-2 border-b border-zinc-800/80 bg-zinc-950 flex gap-2 overflow-x-auto">
              {simulations.map((sim, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSimIndex(i)}
                  className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    activeSimIndex === i
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {sim.category}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6 space-y-3 leading-relaxed">
              <div className="text-zinc-500 text-xs sm:text-sm">
                &gt; Workspace Root: C:\Users\Finance\Documents\Workspace
              </div>
              <div className="text-white flex items-start gap-2 text-sm sm:text-base">
                <span className="text-zinc-400 dark:text-zinc-500 font-bold">&gt;</span>
                <span className="font-semibold">&quot;{simulations[activeSimIndex].prompt}&quot;</span>
              </div>
              <div className="pt-2 border-t border-zinc-800/80 space-y-2 pl-3 border-l border-zinc-700 text-xs sm:text-sm">
                {simulations[activeSimIndex].logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold shrink-0">
                      {log.tag}
                    </span>
                    <span className="text-zinc-300 break-all">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* QUICK START 3-STEP WALKTHROUGH */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-sans">
              {isId ? 'Panduan Memulai' : 'Getting Started'}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 font-sans">
              {isId
                ? 'Langkah mudah mengoperasikan Arunaki di workstation Windows atau macOS Anda.'
                : 'Simple steps to get Arunaki running on your Windows or macOS workstation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-sm">
              <span className="text-xs sm:text-sm font-mono font-bold text-zinc-400">01</span>
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? 'Unduh Paket Installer' : 'Download Package'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Gunakan installer Setup (.exe) untuk Windows atau DMG untuk macOS dari menu unduhan.'
                  : 'Get the pre-built setup installer (.exe) for Windows or DMG for macOS from the download center.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-sm">
              <span className="text-xs sm:text-sm font-mono font-bold text-zinc-400">02</span>
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? 'Tentukan Folder Workspace' : 'Select Workspace'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Pilih folder dokumen lokal Anda. Arunaki terkunci secara ketat dan sandboxed di folder tersebut.'
                  : 'Select your local working folder. Arunaki is strictly sandboxed to prevent any path traversals.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5 shadow-sm">
              <span className="text-xs sm:text-sm font-mono font-bold text-zinc-400">03</span>
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? 'Ketik Instruksi Dokumen' : 'Automate with Prompts'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Ketik instruksi bahasa alami: rekap Excel, ubah kontrak Word, atau bubuhkan e-Materai pada PDF.'
                  : 'Type natural instructions: update Excel formulas, redline Word clauses, or stamp PDF invoices.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION NAVIGATION CARDS (NAVIGATING TO SEPARATE PAGES) */}
        <section className="space-y-6 pt-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-sans">
              {isId ? 'Jelajahi Dokumentasi Lengkap' : 'Explore Full Documentation'}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 font-sans">
              {isId
                ? 'Pilih bagian di bawah ini untuk membaca panduan terpisah.'
                : 'Select a section below to read comprehensive standalone documentation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/arunaki/docs"
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-zinc-500" />
                  <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans group-hover:underline">
                    {isId ? 'Dokumentasi & Arsitektur' : 'Docs & Architecture'}
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 font-sans">
                  {isId ? 'Batas sandbox, COM headless, 1-klik rollback' : 'Sandbox isolation, headless COM, rollback checkpoints'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/arunaki/features"
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <Boxes className="w-5 h-5 text-zinc-500" />
                  <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans group-hover:underline">
                    {isId ? 'Panduan Fitur Dokumen' : 'Document Features'}
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 font-sans">
                  {isId ? 'Excel, Word, PowerPoint, e-Materai, PII Redaction' : 'Excel, Word, PowerPoint, e-Materai, PII Redaction'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/arunaki/tools"
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-5 h-5 text-zinc-500" />
                  <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans group-hover:underline">
                    {isId ? 'Katalog 50+ Tool' : '50+ Tool Catalog'}
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 font-sans">
                  {isId ? 'Registri lengkap alat agen dengan parameter signature' : 'Complete tool registry with call signatures'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/arunaki/download"
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-zinc-500" />
                  <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans group-hover:underline">
                    {isId ? 'Pusat Unduhan Biner' : 'Download Center'}
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 font-sans">
                  {isId ? 'Windows Setup, Portable .zip, macOS DMG' : 'Windows Setup, Portable .zip, macOS DMG'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <ArunakiFooter locale={locale} />
    </div>
  );
}
