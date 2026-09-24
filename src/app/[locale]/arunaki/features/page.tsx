import ArunakiNavbar from '@/components/ArunakiNavbar';
import ArunakiFooter from '@/components/ArunakiFooter';
import { Link } from '@/i18n/navigation';
import {
  FileSpreadsheet,
  FileText,
  FileCode,
  ShieldCheck,
  Presentation,
  FileSearch,
  Database,
  ChevronRight,
  Package,
  Workflow,
  Table,
} from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isId = params.locale === 'id';
  return {
    title: isId
      ? 'Panduan Fitur Dokumen | Arunaki'
      : 'Document Features & Guides | Arunaki',
    description: isId
      ? 'Panduan teknis otomasi Microsoft Excel, Word, PowerPoint, pipeline PDF dengan e-Materai, dan penyamaran PII.'
      : 'Comprehensive technical guides for automating Microsoft Excel, Word, PowerPoint, PDF pipelines, and PII redaction.',
  };
}

export default function ArunakiFeaturesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const isId = locale === 'id';

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased flex flex-col justify-between">
      <ArunakiNavbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20 space-y-16 w-full flex-1">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-sans text-zinc-400">
            <Link href="/arunaki" className="hover:underline">arunaki</Link>
            <span>/</span>
            <span className="text-black dark:text-white font-semibold">features</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white font-sans leading-tight">
            {isId ? 'Panduan Fitur & Format Dokumen' : 'Features & Supported Formats'}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Rincian teknis lengkap, penanganan koordinat sel, injeksi tabel, redline klausul, dan pipeline e-Materai.'
              : 'Complete technical breakdown, cell coordinates, table injection, clause redline diffs, and e-Materai pipeline.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1: Excel */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                  {isId ? 'Spreadsheet Microsoft Excel' : 'Excel Spreadsheets'}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">.xlsx, .xlsm, .csv</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {isId
                ? 'Arunaki berinteraksi langsung dengan Excel melalui otomasi COM headless. Mampu membaca dan menulis sel pada koordinat presisi (misal B2, S14), mengevaluasi rumus dinamis (=SUM, =VLOOKUP, =IF), mengkloning template sheet bulanan, dan ekspor langsung ke PDF.'
                : 'Interacts directly with Microsoft Excel via headless COM automation. Reads and writes precise cell coordinates (B2, S14), preserves dynamic formulas (=SUM, =VLOOKUP), clones monthly template sheets, and compiles directly to PDF.'}
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
              <code>desktop_excel_edit(path, sheet: &quot;Agustus 2026&quot;, updates: [{'{ cell: "B2", value: 15400000 }'}])</code>
            </div>
          </div>

          {/* Feature 2: Word */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                  {isId ? 'Dokumen Microsoft Word' : 'Word Documents'}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">.docx, .doc</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {isId
                ? 'Otomasi korespondensi dan perjanjian hukum: mendeteksi dan mengganti placeholder klausul kontrak (misal {{NAMA_KLIEN}}, {{TANGGAL}}, {{NILAI_KONTRAK}}), menyisipkan tabel berformat rapi, menjaga margin dan font asli 100% utuh, serta menerbitkan ke PDF.'
                : 'Automate corporate agreements and correspondence: detects and substitutes placeholders ({{CLIENT_NAME}}, {{EFFECTIVE_DATE}}), injects multi-column tables, retains typography and page margins, and exports directly to PDF.'}
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
              <code>desktop_word_edit(path, placeholders: {'{ "{{NAMA_KLIEN}}": "PT Surya Mandiri Utama" }'})</code>
            </div>
          </div>

          {/* Feature 3: PowerPoint */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Presentation className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                  {isId ? 'Slide Presentasi PowerPoint' : 'PowerPoint Slide Decks'}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">.pptx, .ppt</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {isId
                ? 'Pembuatan slide presentasi bisnis otomatis: menyusun slide deck baru dengan judul terstruktur, memodifikasi teks frame shape dan kartu metrik KPI, serta menyusun deck PDF siap presentasi.'
                : 'Automated presentation slide authoring: generate slide decks with structured bullet outlines, update shape text frames and KPI metric callouts, and compile distribution decks to PDF.'}
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
              <code>desktop_ppt_edit(path, slides: [{'{ title: "Kinerja Penjualan Q3", bullets: [...] }'}])</code>
            </div>
          </div>

          {/* Feature 4: PDF Pipeline & e-Materai */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                  {isId ? 'Pipeline PDF & e-Materai' : 'PDF Pipeline & e-Materai'}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">.pdf (pdf-lib)</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {isId
                ? 'Penggabungan batch (merge) berkas invoice bulanan, ekstraksi rentang halaman tertentu, penambahan watermark diagonal kustom, serta pembubuhan tanda tangan digital dan stempel e-Materai resmi pada koordinat x,y presisi.'
                : 'Batch invoice merging, page range extraction, custom diagonal text watermarks, and cryptographic e-Materai stamping placed on exact x,y coordinates.'}
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
              <code>pdf_stamp_image(path, stamp_type: &quot;ematerai&quot;, coords: {'{ x: 450, y: 720 }'})</code>
            </div>
          </div>

          {/* Feature 5: PII Data Redaction */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                  {isId ? 'Penyamaran Data Sensitif PII' : 'PII Data Redaction'}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">doc_redact_pii</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {isId
                ? 'Kepatuhan privasi data perusahaan: mendeteksi dan menyamarkan informasi identitas sensitif secara otomatis sebelum dokumen dibagikan. Mendukung NIK KTP Indonesia (16 digit), NPWP pajak, nomor rekening bank, kartu kredit, dan nomor telepon.'
                : 'Automated corporate privacy compliance: detects and masks confidential identifiers before document sharing. Supports Indonesian NIK KTP, NPWP tax IDs, bank accounts, emails, and mobile phone numbers.'}
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
              <code>doc_redact_pii(path, pii_targets: [&quot;NIK&quot;, &quot;NPWP&quot;, &quot;BANK&quot;])</code>
            </div>
          </div>

          {/* Feature 6: Version Audit & Redline */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSearch className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h2 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                  {isId ? 'Audit Redline & Buku Besar' : 'Redline Diff & Ledger Audit'}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">doc_compare_versions</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {isId
                ? 'Audit komparasi dokumen baris-per-baris: menghasilkan tabel redline Markdown yang memetakan klausul ditambah/diubah/dihapus, menghitung skor kemiripan, dan memvalidasi keseimbangan debit-kredit jurnal buku besar akuntansi ganda.'
                : 'Line-by-line document diffing: compiles Markdown redline tables mapping added, modified, and deleted clauses, computes similarity indices, and certifies double-entry accounting ledger balance.'}
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
              <code>doc_compare_versions(original: &quot;v1.docx&quot;, revised: &quot;v2.docx&quot;)</code>
            </div>
          </div>
        </div>

        {/* Knowledge Base Section */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-black dark:text-white">
            {isId ? 'Basis Pengetahuan Domain & Panel Canvas' : 'Domain Knowledge Base & Canvas Panel'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3 shadow-sm">
              <Database className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? 'Penyimpanan Prisma DB SQLite' : 'Prisma SQLite Storage'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Model Knowledge di SQLite menyimpan judul, tipe aturan, teks SOP, dan status aktif. Konteks diinjeksi secara dinamis ke system prompt saat agen memproses dokumen bisnis.'
                  : 'Knowledge model in SQLite stores titles, rule categories, and SOP texts dynamically injected into system prompts.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3 shadow-sm">
              <Package className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-semibold text-base sm:text-lg text-black dark:text-white font-sans">
                {isId ? 'Unggah Dokumen Acuan Drag & Drop' : 'Drag & Drop Reference Upload'}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {isId
                  ? 'Dukungan unggah berkas PDF, DOCX, TXT, MD, dan CSV hingga 10MB dengan ekstraksi teks otomatis (mammoth, pdf2json, csv-parse) langsung ke database.'
                  : 'Direct upload for PDF, DOCX, TXT, MD, and CSV files with automated text extraction into the knowledge base.'}
              </p>
            </div>
          </div>
        </section>

        {/* Next Page Link */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <Link
            href="/arunaki/tools"
            className="inline-flex items-center gap-2 text-base font-sans font-semibold text-black dark:text-white hover:underline group"
          >
            <span>{isId ? 'Lanjut ke Katalog 50+ Tool' : 'Next: 50+ Tool Catalog'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      <ArunakiFooter locale={locale} />
    </div>
  );
}
