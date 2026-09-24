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
            { tag: 'SECURITY', text: 'Memeriksa jalur dalam sandbox: ./workspace/laporan_keuangan.xlsx (Izin DIBERIKAN)' },
            { tag: 'SNAPSHOT', text: 'Membuat checkpoint lokal: .arunaki/checkpoints/20260924_1340_laporan.xlsx' },
            { tag: 'COM BRIDGE', text: 'Menghubungkan ke mesin Microsoft Excel COM (headless)... Terhubung PID 9482' },
            { tag: 'EXECUTION', text: 'Menyisipkan 34 baris data ke sheet "Agustus 2026" (Rentang A24:E57)' },
            { tag: 'FORMULA GUARD', text: 'Menjaga rumus dinamis: =SUM(D24:D57) dan =IF(E58>0,"PROFIT","DEFICIT")' },
            { tag: 'SUCCESS', text: 'Worksheet berhasil disimpan dan ditutup. 0 konflik schema terdeteksi. Rollback tersedia.' },
          ],
        },
        {
          category: 'Word (.docx)',
          prompt: 'Ganti nama klien di kontrak_kerjasama.docx menjadi "PT Surya Mandiri Utama" dan perbarui tanggal efektif ke 1 September 2026.',
          logs: [
            { tag: 'SECURITY', text: 'Memverifikasi jalur: ./workspace/kontrak_kerjasama.docx (Workspace terisolasi)' },
            { tag: 'SNAPSHOT', text: 'Backup snapshot dibuat: .arunaki/checkpoints/20260924_1341_kontrak.docx' },
            { tag: 'COM BRIDGE', text: 'Membuka antarmuka Word.Application COM (mode headless)' },
            { tag: 'REPLACE', text: 'Mengganti {{NAMA_KLIEN}} -> "PT Surya Mandiri Utama" (3 kecocokan)' },
            { tag: 'REPLACE', text: 'Mengganti {{TANGGAL_EFEKTIF}} -> "1 September 2026" (1 kecocokan)' },
            { tag: 'SUCCESS', text: 'Kontrak berhasil diperbarui. Margin (2.54cm) & font (Times New Roman 12pt) 100% terjaga.' },
          ],
        },
        {
          category: 'PDF & e-Materai',
          prompt: 'Gabungkan seluruh file invoice PDF di folder invoices/ bulan ini ke invoice_gabungan.pdf, bubuhkan e-Materai dan mask NIK/NPWP.',
          logs: [
            { tag: 'SCAN', text: 'Menemukan 14 berkas PDF di ./workspace/invoices/*.pdf' },
            { tag: 'MERGE', text: 'Mengeksekusi pdf_manage_pages(aksi: "merge"). Output: invoice_gabungan.pdf (28 halaman)' },
            { tag: 'PII MASK', text: 'Memindai data identitas sensitif... 14 NIK dan 14 NPWP berhasil disamarkan' },
            { tag: 'E-MATERAI', text: 'Membubuhkan stempel e-Materai resmi pada koordinat (X: 450, Y: 720) Halaman 1' },
            { tag: 'SUCCESS', text: 'Dokumen telah disegel dan diverifikasi secara kriptografis. Siap dikirim ke klien.' },
          ],
        },
        {
          category: 'Audit Buku Besar',
          prompt: 'Audit seluruh entri jurnal transaksi di jurnal_umum.xlsx, pastikan total debit dan kredit seimbang, beri flag selisih jika ada.',
          logs: [
            { tag: 'AUDIT', text: 'Memeriksa entri jurnal di ./workspace/jurnal_umum.xlsx (Rentang A2:F412)' },
            { tag: 'CALCULATE', text: 'Total Debit: Rp 1.482.350.000 | Total Kredit: Rp 1.482.350.000' },
            { tag: 'CHECK', text: 'Selisih Varian: Rp 0,00 (Keseimbangan sempurna)' },
            { tag: 'SUCCESS', text: 'Buku besar keuangan terverifikasi seimbang. Log audit tersimpan di .arunaki/audit_2026.json' },
          ],
        },
      ]
    : [
        {
          category: 'Excel (.xlsx)',
          prompt: 'Summarize today expenses into financial_report.xlsx on sheet "August 2026", calculate total net margin automatically.',
          logs: [
            { tag: 'SECURITY', text: 'Checked path inside sandbox: ./workspace/financial_report.xlsx (Access GRANTED)' },
            { tag: 'SNAPSHOT', text: 'Created immutable checkpoint: .arunaki/checkpoints/20260924_1340_report.xlsx' },
            { tag: 'COM BRIDGE', text: 'Attaching to native Microsoft Excel COM engine (headless)... Attached PID 9482' },
            { tag: 'EXECUTION', text: 'Injected 34 rows into sheet "August 2026" (Range A24:E57)' },
            { tag: 'FORMULA GUARD', text: 'Preserved dynamic formula: =SUM(D24:D57) and =IF(E58>0,"PROFIT","DEFICIT")' },
            { tag: 'SUCCESS', text: 'Worksheet saved and closed. 0 schema conflicts detected. Rollback available.' },
          ],
        },
        {
          category: 'Word (.docx)',
          prompt: 'Replace client name in partnership_agreement.docx with "Surya Mandiri Corp" and update effective date to September 1, 2026.',
          logs: [
            { tag: 'SECURITY', text: 'Verified path: ./workspace/partnership_agreement.docx (Isolated workspace)' },
            { tag: 'SNAPSHOT', text: 'Backup checkpoint created: .arunaki/checkpoints/20260924_1341_contract.docx' },
            { tag: 'COM BRIDGE', text: 'Acquired Word.Application COM interface (headless mode)' },
            { tag: 'REPLACE', text: 'Substituted {{CLIENT_NAME}} -> "Surya Mandiri Corp" (3 occurrences)' },
            { tag: 'REPLACE', text: 'Substituted {{EFFECTIVE_DATE}} -> "September 1, 2026" (1 occurrence)' },
            { tag: 'SUCCESS', text: 'Contract updated successfully. Layout margins & fonts 100% preserved.' },
          ],
        },
        {
          category: 'PDF & e-Materai',
          prompt: 'Merge all invoice PDFs in invoices/ folder into combined_invoices.pdf, stamp digital seal, and redact ID/tax numbers.',
          logs: [
            { tag: 'SCAN', text: 'Discovered 14 matching PDF files in ./workspace/invoices/*.pdf' },
            { tag: 'MERGE', text: 'Executing pdf_manage_pages(action: "merge"). Output: combined_invoices.pdf (28 pages)' },
            { tag: 'PII MASK', text: 'Scanning sensitive identifiers... Redacted 14 identity and tax ID records' },
            { tag: 'E-MATERAI', text: 'Stamped official cryptographic seal at coordinates (X: 450, Y: 720) on Page 1' },
            { tag: 'SUCCESS', text: 'Document sealed and cryptographically verified. Ready for delivery.' },
          ],
        },
        {
          category: 'Ledger Audit',
          prompt: 'Audit all general journal transactions in general_ledger.xlsx, verify debit and credit equilibrium, flag discrepancies.',
          logs: [
            { tag: 'AUDIT', text: 'Inspecting journal entries in ./workspace/general_ledger.xlsx (Range A2:F412)' },
            { tag: 'CALCULATE', text: 'Total Debit: $1,482,350.00 | Total Credit: $1,482,350.00' },
            { tag: 'CHECK', text: 'Calculated Variance: $0.00 (Perfect equilibrium)' },
            { tag: 'SUCCESS', text: 'Financial ledger certified balance. Audit log generated at .arunaki/audit_2026.json' },
          ],
        },
      ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased flex flex-col justify-between">
      <ArunakiNavbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-20 space-y-20 w-full flex-1">
        {/* HERO SECTION */}
        <section id="hero" className="space-y-6">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1]">
              {isId ? 'Agen dokumen open source' : 'The open source document agent'}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
              {isId
                ? 'Otomasi dokumen desktop cerdas untuk spreadsheet Microsoft Excel, kontrak Word, slide presentasi PowerPoint, pipeline PDF, dan pembukuan finansial. Beroperasi secara lokal dan sandboxed di komputer Anda.'
                : 'Native desktop computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers. Strictly sandboxed to your local machine.'}
            </p>
          </div>

          {/* INSTALL BOX */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/80 overflow-hidden font-mono shadow-sm">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-2 overflow-x-auto">
              {(['curl', 'winget', 'bun', 'npm', 'brew', 'git'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-mono transition-colors border-b-2 -mb-px whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-black dark:border-white text-black dark:text-white font-semibold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <code className="text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-nowrap selection:bg-zinc-300 dark:selection:bg-zinc-700">
                {installCommands[activeTab]}
              </code>
              <button
                onClick={() => copyToClipboard(installCommands[activeTab], 'install')}
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white transition-colors shrink-0"
                title={isId ? 'Salin perintah' : 'Copy command'}
              >
                {copied === 'install' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKSTATION SIMULATOR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 uppercase tracking-wider font-semibold">
              {isId ? 'Pratinjau Konsol Langsung' : 'Live Workstation Preview'}
            </span>
            <span className="text-emerald-500 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isId ? 'Sandbox Lokal Aktif' : 'Local Sandbox Active'}
            </span>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#09090b] text-zinc-200 font-mono text-xs overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between bg-[#0c0c0e]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-zinc-400 ml-2 text-[11px]">arunaki-agent // headless-com-worker</span>
              </div>
              <span className="text-zinc-500 text-[11px]">bun: 1.3.14 • electron: 43.2</span>
            </div>

            <div className="p-2 border-b border-zinc-800/80 bg-zinc-950 flex gap-1.5 overflow-x-auto">
              {simulations.map((sim, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSimIndex(i)}
                  className={`px-3 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                    activeSimIndex === i
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {sim.category}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-5 space-y-2.5 leading-relaxed">
              <div className="text-zinc-500 text-[11px]">
                &gt; Workspace Root: C:\Users\Finance\Documents\Workspace
              </div>
              <div className="text-white flex items-start gap-2">
                <span className="text-emerald-400">&gt;</span>
                <span className="font-semibold">&quot;{simulations[activeSimIndex].prompt}&quot;</span>
              </div>
              <div className="pt-2 border-t border-zinc-800/80 space-y-1.5 pl-3 border-l border-zinc-700 text-[11px]">
                {simulations[activeSimIndex].logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-bold shrink-0">
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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Panduan Memulai' : 'Getting Started'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Langkah mudah mengoperasikan Arunaki di workstation Windows atau macOS Anda.'
                : 'Simple steps to get Arunaki running on your Windows or macOS workstation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">01</span>
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? 'Unduh Paket Installer' : 'Download Package'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Gunakan installer Setup (.exe) untuk Windows atau DMG untuk macOS dari menu unduhan.'
                  : 'Get the pre-built setup installer (.exe) for Windows or DMG for macOS from the download center.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">02</span>
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? 'Tentukan Folder Workspace' : 'Select Workspace'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Pilih folder dokumen lokal Anda. Arunaki terkunci secara ketat dan sandboxed di folder tersebut.'
                  : 'Select your local working folder. Arunaki is strictly sandboxed to prevent any path traversals.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">03</span>
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? 'Ketik Instruksi Dokumen' : 'Automate with Prompts'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Jelajahi Dokumentasi Lengkap' : 'Explore Full Documentation'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Pilih bagian di bawah ini untuk membaca panduan terpisah.'
                : 'Select a section below to read comprehensive standalone documentation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/arunaki/docs"
              className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-zinc-500" />
                  <h3 className="font-bold text-sm text-black dark:text-white font-mono group-hover:underline">
                    {isId ? 'Dokumentasi & Arsitektur' : 'Docs & Architecture'}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  {isId ? 'Batas sandbox, COM headless, 1-klik rollback' : 'Sandbox isolation, headless COM, rollback checkpoints'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/arunaki/features"
              className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-zinc-500" />
                  <h3 className="font-bold text-sm text-black dark:text-white font-mono group-hover:underline">
                    {isId ? 'Panduan Fitur Dokumen' : 'Document Features'}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  {isId ? 'Excel, Word, PowerPoint, e-Materai, PII Redaction' : 'Excel, Word, PowerPoint, e-Materai, PII Redaction'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/arunaki/tools"
              className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-zinc-500" />
                  <h3 className="font-bold text-sm text-black dark:text-white font-mono group-hover:underline">
                    {isId ? 'Katalog 50+ Tool' : '50+ Tool Catalog'}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  {isId ? 'Registri lengkap alat agen dengan parameter signature' : 'Complete tool registry with call signatures'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/arunaki/download"
              className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-zinc-500" />
                  <h3 className="font-bold text-sm text-black dark:text-white font-mono group-hover:underline">
                    {isId ? 'Pusat Unduhan Biner' : 'Download Center'}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  {isId ? 'Windows Setup, Portable .zip, macOS DMG' : 'Windows Setup, Portable .zip, macOS DMG'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <ArunakiFooter locale={locale} />
    </div>
  );
}
