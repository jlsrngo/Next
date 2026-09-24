'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Download,
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FileCode,
  ShieldCheck,
  Terminal,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  Code2,
  Globe,
  Sliders,
  Database,
  Lock,
  Boxes,
  FileSearch,
  Presentation,
  Workflow,
  Sparkles,
  Info,
} from 'lucide-react';

interface ArunakiClientProps {
  locale: string;
}

export default function ArunakiClient({ locale }: ArunakiClientProps) {
  const isId = locale === 'id';
  const router = useRouter();
  const pathname = usePathname();

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

  const toggleLanguage = () => {
    const newLocale = isId ? 'en' : 'id';
    const targetPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(targetPath);
  };

  const simulations = [
    {
      category: 'Excel (.xlsx)',
      prompt: 'Rekap pemasukan dan pengeluaran hari ini ke laporan_keuangan.xlsx pada sheet "Agustus 2026", hitung total margin otomatis.',
      logs: [
        { tag: 'SECURITY', text: 'Checked path inside sandbox: ./workspace/laporan_keuangan.xlsx (Access GRANTED)' },
        { tag: 'SNAPSHOT', text: 'Created immutable checkpoint: .arunaki/checkpoints/20260924_1340_laporan.xlsx' },
        { tag: 'COM BRIDGE', text: 'Attaching to native Microsoft Excel COM engine (headless)... Attached PID 9482' },
        { tag: 'EXECUTION', text: 'Injected 34 rows into sheet "Agustus 2026" (Range A24:E57)' },
        { tag: 'FORMULA GUARD', text: 'Preserved dynamic formula: =SUM(D24:D57) and =IF(E58>0,"PROFIT","DEFICIT")' },
        { tag: 'SUCCESS', text: 'Worksheet saved and closed. 0 schema conflicts detected. Rollback available.' },
      ],
    },
    {
      category: 'Word (.docx)',
      prompt: 'Ganti nama klien di kontrak_kerjasama.docx menjadi "PT Surya Mandiri Utama" dan perbarui tanggal efektif ke 1 September 2026.',
      logs: [
        { tag: 'SECURITY', text: 'Verified path: ./workspace/kontrak_kerjasama.docx (Isolated workspace)' },
        { tag: 'SNAPSHOT', text: 'Backup checkpoint created: .arunaki/checkpoints/20260924_1341_kontrak.docx' },
        { tag: 'COM BRIDGE', text: 'Acquired Word.Application COM interface (headless mode)' },
        { tag: 'REPLACE', text: 'Substituted {{NAMA_KLIEN}} -> "PT Surya Mandiri Utama" (3 occurrences)' },
        { tag: 'REPLACE', text: 'Substituted {{TANGGAL_EFEKTIF}} -> "1 September 2026" (1 occurrence)' },
        { tag: 'SUCCESS', text: 'Contract updated successfully. Layout margins & fonts 100% preserved.' },
      ],
    },
    {
      category: 'PDF & e-Materai',
      prompt: 'Gabungkan seluruh file invoice PDF di folder invoices/ bulan ini ke invoice_gabungan.pdf, bubuhkan e-Materai dan mask NIK/NPWP.',
      logs: [
        { tag: 'SCAN', text: 'Discovered 14 matching PDF files in ./workspace/invoices/*.pdf' },
        { tag: 'MERGE', text: 'Executing pdf_manage_pages(action: "merge"). Output: invoice_gabungan.pdf (28 pages)' },
        { tag: 'PII MASK', text: 'Scanning sensitive identifiers... Redacted 14 NIK and 14 NPWP records' },
        { tag: 'E-MATERAI', text: 'Stamped official e-Materai seal at coordinates (X: 450, Y: 720) on Page 1' },
        { tag: 'SUCCESS', text: 'Document sealed and cryptographically verified. Ready for client delivery.' },
      ],
    },
    {
      category: 'Ledger Audit',
      prompt: 'Audit seluruh entri jurnal transaksi di jurnal_umum.xlsx, pastikan total debit dan kredit seimbang, beri flag selisih jika ada.',
      logs: [
        { tag: 'AUDIT', text: 'Inspecting journal entries in ./workspace/jurnal_umum.xlsx (Range A2:F412)' },
        { tag: 'CALCULATE', text: 'Total Debit: Rp 1.482.350.000 | Total Credit: Rp 1.482.350.000' },
        { tag: 'CHECK', text: 'Calculated Variance: Rp 0,00 (Perfect equilibrium)' },
        { tag: 'SUCCESS', text: 'Financial ledger certified balance. Audit log generated at .arunaki/audit_2026.json' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased">
      {/* 1. MINIMAL OPENCODE-STYLE HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo on Left (Exact OpenCode style lowercase bold) */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/projects`}
              className="text-xs font-mono text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 mr-2"
              title={isId ? 'Kembali ke Portofolio' : 'Back to Portfolio'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>

            <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

            <a href="#hero" className="flex items-center gap-2 tracking-tight">
              <span className="text-xl font-bold font-mono tracking-tighter text-black dark:text-white">
                arunaki
              </span>
            </a>
          </div>

          {/* Simple Clean Text Links on Right (Exact OpenCode style) */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
            <a
              href="https://github.com/jlsrngo/Arunaki"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="#docs"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="#features"
              className="hover:text-black dark:hover:text-white transition-colors hidden sm:inline"
            >
              Features
            </a>
            <a
              href="#tools"
              className="hover:text-black dark:hover:text-white transition-colors hidden md:inline"
            >
              Tools
            </a>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 font-mono text-xs"
              title={isId ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isId ? 'ID' : 'EN'}</span>
            </button>

            {/* Download CTA Button */}
            <a
              href="#download"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-mono text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </nav>
        </div>
      </header>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 space-y-24">
        {/* HERO SECTION (Exact OpenCode style) */}
        <section id="hero" className="space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.1]">
              {isId ? 'The open source document agent' : 'The open source document agent'}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
              {isId
                ? 'Native desktop computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers. Strictly sandboxed to your local machine.'
                : 'Native desktop computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers. Strictly sandboxed to your local machine.'}
            </p>
          </div>

          {/* INSTALL BOX (Exact OpenCode terminal tabs style) */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/80 overflow-hidden font-mono shadow-sm">
            {/* Tabs */}
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

            {/* Command Line */}
            <div className="p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <code className="text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-nowrap selection:bg-zinc-300 dark:selection:bg-zinc-700">
                {installCommands[activeTab]}
              </code>
              <button
                onClick={() => copyToClipboard(installCommands[activeTab], 'install')}
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white transition-colors shrink-0"
                title="Copy command"
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
              Live Workstation Preview
            </span>
            <span className="text-emerald-500 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Local Sandbox Active
            </span>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#09090b] text-zinc-200 font-mono text-xs overflow-hidden shadow-sm">
            {/* Top Bar */}
            <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between bg-[#0c0c0e]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-zinc-400 ml-2 text-[11px]">arunaki-agent // headless-com-worker</span>
              </div>
              <span className="text-zinc-500 text-[11px]">bun: 1.3.14 • electron: 43.2</span>
            </div>

            {/* Quick Simulation Tabs */}
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

            {/* Log Stream */}
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

        {/* DOCUMENTATION OVERVIEW */}
        <section id="docs" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              Documentation
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              Core architecture, execution pipelines, and local sandboxing guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-2.5">
              <ShieldCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                Sandboxed Workspace
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                All file reads and writes are restricted exclusively to the selected workspace folder. Path traversal attempts (../../) are intercepted and rejected.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-2.5">
              <Terminal className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                Native Win32 COM Bridge
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Direct headless communication with Microsoft Excel & Word engines. Preserves dynamic formulas (=SUM, =VLOOKUP), typography, and formatting.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-2.5">
              <RotateCcw className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                1-Click Rollback Checkpoints
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Immutable local backups are created before document mutations. Easily restore any modified document back to its original state in one click.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              Features & Supported Formats
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              Full office automation and compliance engines built right into Arunaki.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">Excel Spreadsheets</h3>
                <span className="text-[10px] font-mono text-zinc-400">.xlsx, .xlsm</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cell coordinate updates, multi-sheet cloning, formula evaluation (=SUM, =VLOOKUP), and headless PDF compilation.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">Word Documents</h3>
                <span className="text-[10px] font-mono text-zinc-400">.docx, .doc</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Template placeholder replacement, table population, font and margin preservation, and direct export to PDF.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">PowerPoint Decks</h3>
                <span className="text-[10px] font-mono text-zinc-400">.pptx, .ppt</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Automated slide generation, structured bullet points, text frame modification, and presentation deck compilation.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">PDF Pipeline & e-Materai</h3>
                <span className="text-[10px] font-mono text-zinc-400">.pdf</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Batch invoice merging, page range extraction, custom watermarks, and cryptographic e-Materai stamping at exact coordinates.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">PII Data Redaction</h3>
                <span className="text-[10px] font-mono text-zinc-400">doc_redact_pii</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Automated redaction of sensitive identifiers including Indonesian NIK KTP, NPWP tax IDs, bank accounts, emails, and phone numbers.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-zinc-500" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">Redline Diff & Ledger Audit</h3>
                <span className="text-[10px] font-mono text-zinc-400">doc_compare_versions</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Line-by-line contract redline diff tables, similarity score calculation, and double-entry accounting ledger verification.
              </p>
            </div>
          </div>
        </section>

        {/* TOOLS REFERENCE */}
        <section id="tools" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              Tool Harness Catalog
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              Core tool registry available to the agent harness.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                <tr>
                  <th className="p-3 font-semibold">Module</th>
                  <th className="p-3 font-semibold">Primary Tools</th>
                  <th className="p-3 font-semibold">Scope of Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">Workspace Files</td>
                  <td className="p-3 text-zinc-500">read, write, edit, list, search_workspace, rename, delete</td>
                  <td className="p-3">File CRUD, surgical line diff patching, FTS5 search, atomic file lifecycle.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">Office Automation</td>
                  <td className="p-3 text-zinc-500">desktop_excel_edit, desktop_word_edit, desktop_ppt_edit, desktop_open_file</td>
                  <td className="p-3">Native Win32 COM, formula retention, template authoring, and PDF compilation.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">PDF & Compliance</td>
                  <td className="p-3 text-zinc-500">pdf_manage_pages, pdf_stamp_image, doc_redact_pii, convert_document</td>
                  <td className="p-3">PDF merge, page extraction, watermark stamping, e-Materai, PII data masking.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">Document Audit</td>
                  <td className="p-3 text-zinc-500">doc_compare_versions, extract_structured_data, document_reader</td>
                  <td className="p-3">Redline diff tables, similarity analysis, document structure parsing.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">Enterprise Suite</td>
                  <td className="p-3 text-zinc-500">TextExtractorTool, EnterpriseCalculatorTool, DocumentGeneratorTool</td>
                  <td className="p-3">Compromise NLP text parsing, tax/discount calculation, and Excel/CSV data exports.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">Orchestration</td>
                  <td className="p-3 text-zinc-500">todo_write, batch_execute, agent_spawn, ask_user, save_knowledge</td>
                  <td className="p-3">Working memory checklist, programmatic tool calling (PTC), sub-agent spawning.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* DOWNLOAD SECTION */}
        <section id="download" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              Download Arunaki
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              Pre-built binary packages ready for Windows and macOS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Windows Setup */}
            <div className="p-5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-4">
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Recommended
                </span>
                <h3 className="font-bold text-sm text-black dark:text-white">Windows Setup (.exe)</h3>
                <p className="text-xs text-zinc-500">Arunaki-Setup-x64.exe</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  Windows 10 / 11 (64-bit) with automatic background updates.
                </p>
              </div>
              <a
                href="https://github.com/jlsrngo/Arunaki/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-mono text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .exe</span>
              </a>
            </div>

            {/* Windows Portable */}
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-4">
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Standalone
                </span>
                <h3 className="font-bold text-sm text-black dark:text-white">Windows Portable (.zip)</h3>
                <p className="text-xs text-zinc-500">Arunaki-Portable.zip</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  Zero installation required. Ready to run directly from a USB flash drive.
                </p>
              </div>
              <a
                href="https://github.com/jlsrngo/Arunaki/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .zip</span>
              </a>
            </div>

            {/* macOS */}
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-4">
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Universal
                </span>
                <h3 className="font-bold text-sm text-black dark:text-white">macOS Universal (.dmg)</h3>
                <p className="text-xs text-zinc-500">Arunaki-Universal.dmg</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  Apple Silicon (M1-M4) & Intel x64. Requires macOS Monterey (12.0+).
                </p>
              </div>
              <a
                href="https://github.com/jlsrngo/Arunaki/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .dmg</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 3. MINIMAL FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-8 text-xs font-mono text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Arunaki • The Open Document Agent Workstation & Automation Harness</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jlsrngo/Arunaki"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <Link href={`/${locale}/projects`} className="hover:text-black dark:hover:text-white transition-colors">
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
