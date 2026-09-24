'use client';

import { useState, useMemo } from 'react';
import ArunakiNavbar from '@/components/ArunakiNavbar';
import ArunakiFooter from '@/components/ArunakiFooter';
import { Link } from '@/i18n/navigation';
import { Search, Copy, Check, ChevronRight } from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  category: 'workspace' | 'office' | 'pdf' | 'audit' | 'enterprise' | 'orchestration';
  categoryLabel: { id: string; en: string };
  description: { id: string; en: string };
  parameters: string[];
  example: string;
}

export default function ArunakiToolsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const isId = locale === 'id';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toolsData: ToolItem[] = [
    // Workspace Files
    {
      id: 'read',
      name: 'read',
      category: 'workspace',
      categoryLabel: { id: 'Berkas Workspace', en: 'Workspace Files' },
      description: {
        id: 'Membaca konten file teks, markdown, JSON, atau kode dari folder workspace yang terisolasi.',
        en: 'Read contents of text, markdown, JSON, or code files strictly from sandboxed workspace directory.',
      },
      parameters: ['path: string', 'offset?: number', 'limit?: number'],
      example: 'read({ path: "reports/monthly_summary.md", limit: 200 })',
    },
    {
      id: 'write',
      name: 'write',
      category: 'workspace',
      categoryLabel: { id: 'Berkas Workspace', en: 'Workspace Files' },
      description: {
        id: 'Menulis file baru atau menimpa file di dalam direktori workspace dengan validasi path traversal.',
        en: 'Write new file or overwrite content inside workspace with strict path traversal validation.',
      },
      parameters: ['path: string', 'content: string', 'create_dirs?: boolean'],
      example: 'write({ path: "notes/audit_review.txt", content: "Balance sheet verified." })',
    },
    {
      id: 'edit',
      name: 'edit',
      category: 'workspace',
      categoryLabel: { id: 'Berkas Workspace', en: 'Workspace Files' },
      description: {
        id: 'Melakukan surgical diff patch pada baris target dokumen teks tanpa merusak konten di sekitarnya.',
        en: 'Perform surgical diff patch on target lines preserving surrounding formatting and structure.',
      },
      parameters: ['path: string', 'target: string', 'replacement: string'],
      example: 'edit({ path: "config.json", target: "\"mode\": \"draft\"", replacement: "\"mode\": \"production\"" })',
    },
    {
      id: 'list',
      name: 'list',
      category: 'workspace',
      categoryLabel: { id: 'Berkas Workspace', en: 'Workspace Files' },
      description: {
        id: 'Mendata seluruh file dan subfolder dalam workspace dengan metadata ukuran dan tipe MIME.',
        en: 'List files and directories in workspace with size, timestamp, and MIME type metadata.',
      },
      parameters: ['path?: string', 'recursive?: boolean'],
      example: 'list({ path: "finance/2026", recursive: true })',
    },
    {
      id: 'search_workspace',
      name: 'search_workspace',
      category: 'workspace',
      categoryLabel: { id: 'Berkas Workspace', en: 'Workspace Files' },
      description: {
        id: 'Pencarian cepat kata kunci atau regex di seluruh dokumen workspace menggunakan SQLite FTS5 index.',
        en: 'High-speed keyword or regex search across workspace documents backed by SQLite FTS5 index.',
      },
      parameters: ['query: string', 'file_pattern?: string'],
      example: 'search_workspace({ query: "NET_MARGIN", file_pattern: "*.xlsx" })',
    },
    {
      id: 'rename',
      name: 'rename',
      category: 'workspace',
      categoryLabel: { id: 'Berkas Workspace', en: 'Workspace Files' },
      description: {
        id: 'Mengubah nama atau memindahkan file di dalam batas sandbox workspace.',
        en: 'Safely rename or relocate file within the confines of workspace sandbox.',
      },
      parameters: ['old_path: string', 'new_path: string'],
      example: 'rename({ old_path: "draft_kontrak.docx", new_path: "kontrak_final_v1.docx" })',
    },
    {
      id: 'delete',
      name: 'delete',
      category: 'workspace',
      categoryLabel: { id: 'Berkas Workspace', en: 'Workspace Files' },
      description: {
        id: 'Menghapus file dari workspace dengan checkpoint snapshot rollback otomatis.',
        en: 'Delete file within workspace with automatic rollback checkpoint creation.',
      },
      parameters: ['path: string', 'require_snapshot?: boolean'],
      example: 'delete({ path: "temp/cache_audit.tmp", require_snapshot: true })',
    },

    // Office Automation
    {
      id: 'desktop_excel_edit',
      name: 'desktop_excel_edit',
      category: 'office',
      categoryLabel: { id: 'Otomasi Office COM', en: 'Office COM' },
      description: {
        id: 'Otomasi Excel native Win32 COM: mengisi sel target (B2, S14), mengevaluasi rumus dinamis (=SUM, =VLOOKUP), mengkloning sheet bulanan, dan ekspor ke PDF.',
        en: 'Native Win32 COM Excel automation: populate target cell coordinates, evaluate dynamic formulas (=SUM, =VLOOKUP), clone sheets, and export to PDF.',
      },
      parameters: ['path: string', 'sheet?: string', 'updates: CellUpdate[]', 'eval_formulas?: boolean', 'export_pdf?: string'],
      example: 'desktop_excel_edit({ path: "laporan_keuangan.xlsx", sheet: "Agustus 2026", updates: [{ cell: "B2", value: 15400000 }] })',
    },
    {
      id: 'desktop_word_edit',
      name: 'desktop_word_edit',
      category: 'office',
      categoryLabel: { id: 'Otomasi Office COM', en: 'Office COM' },
      description: {
        id: 'Otomasi Word native COM: mendeteksi dan mengganti placeholder {{NAMA_KLIEN}}, menyisipkan tabel berformat, menjaga margin & font 100% utuh, dan ekspor ke PDF.',
        en: 'Native Word COM: replace template placeholders ({{NAME}}), inject styled tables, retain margins and typography, and export to PDF.',
      },
      parameters: ['path: string', 'placeholders?: Record<string, string>', 'tables?: TableData[]', 'export_pdf?: string'],
      example: 'desktop_word_edit({ path: "kontrak_kerjasama.docx", placeholders: { "{{NAMA_KLIEN}}": "PT Surya Mandiri Utama" } })',
    },
    {
      id: 'desktop_ppt_edit',
      name: 'desktop_ppt_edit',
      category: 'office',
      categoryLabel: { id: 'Otomasi Office COM', en: 'Office COM' },
      description: {
        id: 'Otomasi presentasi PowerPoint: menambah slide terstruktur, memperbarui teks shape dan kartu KPI metrik, serta menyusun deck PDF.',
        en: 'PowerPoint automation: generate structured slides, update shape text frames and KPI callouts, and compile distribution decks to PDF.',
      },
      parameters: ['path: string', 'slides?: SlideUpdate[]', 'export_pdf?: string'],
      example: 'desktop_ppt_edit({ path: "q3_deck.pptx", slides: [{ title: "Kinerja Penjualan", bullets: ["Pertumbuhan +34% MoM"] }] })',
    },
    {
      id: 'desktop_open_file',
      name: 'desktop_open_file',
      category: 'office',
      categoryLabel: { id: 'Otomasi Office COM', en: 'Office COM' },
      description: {
        id: 'Membuka dokumen hasil otomatisasi langsung pada aplikasi desktop native (Excel/Word/PowerPoint) untuk peninjauan pengguna.',
        en: 'Launch target document in native desktop application for immediate user inspection and verification.',
      },
      parameters: ['path: string'],
      example: 'desktop_open_file({ path: "laporan_keuangan.xlsx" })',
    },

    // PDF & Compliance
    {
      id: 'pdf_manage_pages',
      name: 'pdf_manage_pages',
      category: 'pdf',
      categoryLabel: { id: 'Pipeline PDF & Kepatuhan', en: 'PDF & Compliance' },
      description: {
        id: 'Penggabungan batch (merge) berkas PDF, ekstraksi rentang halaman tertentu, atau rotasi orientasi berkas.',
        en: 'Batch merge multiple PDF files, extract specific page ranges, or rotate orientation.',
      },
      parameters: ['action: "merge" | "extract" | "rotate"', 'source_files: string[]', 'output_path: string', 'pages?: string'],
      example: 'pdf_manage_pages({ action: "merge", source_files: ["invoices/inv1.pdf", "invoices/inv2.pdf"], output_path: "invoice_gabungan.pdf" })',
    },
    {
      id: 'pdf_stamp_image',
      name: 'pdf_stamp_image',
      category: 'pdf',
      categoryLabel: { id: 'Pipeline PDF & Kepatuhan', en: 'PDF & Compliance' },
      description: {
        id: 'Membubuhkan watermark diagonal kustom, badge lunas, tanda tangan digital, atau stempel e-Materai pada koordinat x,y presisi berkas PDF.',
        en: 'Stamp digital watermarks, paid badges, digital signatures, or e-Materai seals at precise x,y page coordinates.',
      },
      parameters: ['path: string', 'stamp_type: "watermark" | "ematerai" | "badge"', 'coords?: { x: number; y: number }', 'text?: string'],
      example: 'pdf_stamp_image({ path: "invoice_final.pdf", stamp_type: "ematerai", coords: { x: 450, y: 720 } })',
    },
    {
      id: 'doc_redact_pii',
      name: 'doc_redact_pii',
      category: 'pdf',
      categoryLabel: { id: 'Pipeline PDF & Kepatuhan', en: 'PDF & Compliance' },
      description: {
        id: 'Mendeteksi dan menyamarkan informasi sensitif (PII) seperti NIK KTP Indonesia, NPWP pajak, nomor rekening bank, kartu kredit, dan nomor telepon seluler.',
        en: 'Detect and redact sensitive PII (Indonesian NIK KTP, NPWP tax ID, bank accounts, emails, and phone numbers).',
      },
      parameters: ['path: string', 'pii_targets: ("NIK" | "NPWP" | "BANK" | "PHONE" | "EMAIL")[]', 'mask_char?: string'],
      example: 'doc_redact_pii({ path: "data_nasabah.pdf", pii_targets: ["NIK", "NPWP", "BANK"] })',
    },
    {
      id: 'convert_document',
      name: 'convert_document',
      category: 'pdf',
      categoryLabel: { id: 'Pipeline PDF & Kepatuhan', en: 'PDF & Compliance' },
      description: {
        id: 'Konversi lokal tanpa cloud antar format DOCX, XLSX, PPTX, PDF, HTML, dan plain text.',
        en: 'Lossless local conversion between DOCX, XLSX, PPTX, PDF, HTML, and text without cloud reliance.',
      },
      parameters: ['source_path: string', 'target_format: "pdf" | "docx" | "xlsx" | "csv" | "txt"'],
      example: 'convert_document({ source_path: "kontrak.docx", target_format: "pdf" })',
    },

    // Document Audit
    {
      id: 'doc_compare_versions',
      name: 'doc_compare_versions',
      category: 'audit',
      categoryLabel: { id: 'Audit Dokumen & Redline', en: 'Document Audit' },
      description: {
        id: 'Membandingkan dua versi dokumen Word/teks, menyusun tabel redline perubahan klausul (ditambah/diubah/dihapus) dan indeks skor kemiripan.',
        en: 'Line-by-line redline audit comparing document revisions, clause diff tables, and similarity index calculation.',
      },
      parameters: ['original_path: string', 'revised_path: string', 'granularity?: "clause" | "word" | "line"'],
      example: 'doc_compare_versions({ original_path: "kontrak_v1.docx", revised_path: "kontrak_v2.docx" })',
    },
    {
      id: 'extract_structured_data',
      name: 'extract_structured_data',
      category: 'audit',
      categoryLabel: { id: 'Audit Dokumen & Redline', en: 'Document Audit' },
      description: {
        id: 'Mengekstraksi entitas data penting, baris tabel, dan pasangan key-value dari invoice atau kontrak ke format JSON terstruktur.',
        en: 'Extract key entities, table items, and key-value metadata from invoices and contracts into structured JSON.',
      },
      parameters: ['path: string', 'schema: Record<string, string>'],
      example: 'extract_structured_data({ path: "faktur.pdf", schema: { nomor_faktur: "string", total_harga: "number" } })',
    },
    {
      id: 'document_reader',
      name: 'document_reader',
      category: 'audit',
      categoryLabel: { id: 'Audit Dokumen & Redline', en: 'Document Audit' },
      description: {
        id: 'Membaca dan mem-parsing struktur hirarkis dokumen Word atau spreadsheet dengan mempertahankan metadata outline judul.',
        en: 'Hierarchically parse Word documents and multi-sheet workbooks preserving outline headers.',
      },
      parameters: ['path: string', 'section?: string'],
      example: 'document_reader({ path: "sop_perusahaan.docx", section: "Bab 3: Prosedur Pengadaan" })',
    },

    // Enterprise Suite
    {
      id: 'TextExtractorTool',
      name: 'TextExtractorTool',
      category: 'enterprise',
      categoryLabel: { id: 'Enterprise Suite', en: 'Enterprise Suite' },
      description: {
        id: 'Ekstraktor teks dokumen multi-format menggunakan compromise NLP dan parser native (pdf2json, mammoth, xlsx, csv-parse).',
        en: 'Multi-format document text extractor powered by compromise NLP and native parsers (mammoth, xlsx, pdf2json).',
      },
      parameters: ['filePath: string', 'extractEntities?: boolean', 'targetFormat?: string'],
      example: 'TextExtractorTool.execute({ filePath: "kontrak_garment.pdf", extractEntities: true })',
    },
    {
      id: 'EnterpriseCalculatorTool',
      name: 'EnterpriseCalculatorTool',
      category: 'enterprise',
      categoryLabel: { id: 'Enterprise Suite', en: 'Enterprise Suite' },
      description: {
        id: 'Kalkulator finansial presisi: menghitung subtotal kuantitas, tarif PPN 11%, diskon berjenjang, dan validasi rekonsiliasi kas.',
        en: 'Precision financial calculator: computes quantity subtotals, tax rates, tiered discounts, and cash reconciliation.',
      },
      parameters: ['items: LineItem[]', 'taxRate?: number', 'discount?: number'],
      example: 'EnterpriseCalculatorTool.execute({ items: [{ qty: 100, price: 75000 }], taxRate: 0.11 })',
    },
    {
      id: 'DocumentGeneratorTool',
      name: 'DocumentGeneratorTool',
      category: 'enterprise',
      categoryLabel: { id: 'Enterprise Suite', en: 'Enterprise Suite' },
      description: {
        id: 'Mesin pembuat dokumen ekspor profesional (Excel .xlsx, .csv, .html, .txt) langsung dari data hasil kalkulasi tabel.',
        en: 'Production document export engine generating Excel .xlsx, CSV, and HTML tables directly from calculated datasets.',
      },
      parameters: ['data: any[]', 'format: "xlsx" | "csv" | "html"', 'outputPath: string'],
      example: 'DocumentGeneratorTool.execute({ data: [...], format: "xlsx", outputPath: "rekap_produksi.xlsx" })',
    },

    // Orchestration & PTC
    {
      id: 'todo_write',
      name: 'todo_write',
      category: 'orchestration',
      categoryLabel: { id: 'Orkestrasi PTC', en: 'Orchestration (PTC)' },
      description: {
        id: 'Mengelola checklist memori kerja agen untuk melacak kemajuan alur tugas multi-tahap.',
        en: 'Manage agent task checklist (working memory) for tracking multi-step workflow execution.',
      },
      parameters: ['tasks: { id: string; title: string; status: "pending" | "in_progress" | "completed" }[]'],
      example: 'todo_write({ tasks: [{ id: "1", title: "Backup berkas asli", status: "completed" }] })',
    },
    {
      id: 'batch_execute',
      name: 'batch_execute',
      category: 'orchestration',
      categoryLabel: { id: 'Orkestrasi PTC', en: 'Orchestration (PTC)' },
      description: {
        id: 'Mengeksekusi sekumpulan instruksi tool secara terkoordinasi (Programmatic Tool Calling - PTC) dalam satu transaksi terpadu.',
        en: 'Execute multiple coordinated tool calls (Programmatic Tool Calling - PTC) in a single transactional batch.',
      },
      parameters: ['calls: { tool: string; args: Record<string, any> }[]'],
      example: 'batch_execute({ calls: [{ tool: "read", args: { path: "data.csv" } }, { tool: "edit", args: { ... } }] })',
    },
    {
      id: 'save_knowledge',
      name: 'save_knowledge',
      category: 'orchestration',
      categoryLabel: { id: 'Orkestrasi PTC', en: 'Orchestration (PTC)' },
      description: {
        id: 'Menyimpan atau memperbarui aturan bisnis, daftar harga, dan SOP ke basis data domain knowledge dari percakapan.',
        en: 'Save or update business rules, price lists, and SOP guidelines directly to the Domain Knowledge database.',
      },
      parameters: ['title: string', 'content: string', 'type: "rule" | "pricing" | "sop"'],
      example: 'save_knowledge({ title: "Aturan Termin Pembayaran", content: "Maksimal tempo 30 hari kalender", type: "rule" })',
    },
  ];

  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.categoryLabel.id.toLowerCase().includes(q) ||
        tool.categoryLabel.en.toLowerCase().includes(q) ||
        tool.description.id.toLowerCase().includes(q) ||
        tool.description.en.toLowerCase().includes(q) ||
        tool.parameters.some((p) => p.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased flex flex-col justify-between">
      <ArunakiNavbar locale={locale} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20 space-y-10 w-full flex-1">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-sans text-zinc-400">
            <Link href="/arunaki" className="hover:underline">arunaki</Link>
            <span>/</span>
            <span className="text-black dark:text-white font-semibold">tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white font-sans leading-tight">
            {isId ? 'Katalog Tool Harness (50+ Tool)' : 'Tool Harness Catalog (50+ Tools)'}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Registri lengkap alat agen dokumen dengan parameter signature dan contoh pemanggilan terprogram (PTC).'
              : 'Complete agent tool registry with parameter signatures and programmatic tool calling (PTC) examples.'}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-3.5">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isId ? 'Cari nama tool, parameter, atau kata kunci...' : 'Search tools by name, parameters, or keywords...'}
              className="w-full pl-11 pr-16 py-3 text-sm sm:text-base rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs sm:text-sm font-sans font-medium text-zinc-400 hover:text-black dark:hover:text-white absolute right-4 top-1/2 -translate-y-1/2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex overflow-x-auto gap-2 pb-1">
            {[
              { id: 'all', label: isId ? 'Semua Kategori' : 'All Categories' },
              { id: 'workspace', label: isId ? 'Berkas Workspace' : 'Workspace Files' },
              { id: 'office', label: isId ? 'Otomasi Office COM' : 'Office COM' },
              { id: 'pdf', label: isId ? 'Pipeline PDF' : 'PDF & Compliance' },
              { id: 'audit', label: isId ? 'Audit Dokumen' : 'Document Audit' },
              { id: 'enterprise', label: isId ? 'Enterprise Suite' : 'Enterprise Suite' },
              { id: 'orchestration', label: isId ? 'Orkestrasi PTC' : 'Orchestration (PTC)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-sans transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Cards */}
        <div className="space-y-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <code className="text-base sm:text-lg font-bold font-mono text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md">
                    {tool.name}
                  </code>
                  <span className="text-xs font-sans font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
                    {isId ? tool.categoryLabel.id : tool.categoryLabel.en}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(tool.example, `tool-${tool.id}`)}
                  className="self-end sm:self-center text-xs sm:text-sm font-sans font-medium text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === `tool-${tool.id}` ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500 font-medium">{isId ? 'Tersalin' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isId ? 'Salin panggil' : 'Copy call'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                {isId ? tool.description.id : tool.description.en}
              </p>

              <div className="space-y-2 pt-1">
                <div className="text-xs sm:text-sm font-sans text-zinc-500 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400">Parameters:</span>
                  {tool.parameters.map((param, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-0.5 rounded font-mono text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      {param}
                    </span>
                  ))}
                </div>

                <div className="p-3.5 sm:p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 overflow-x-auto">
                  <code>{tool.example}</code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Page Link */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <Link
            href="/arunaki/download"
            className="inline-flex items-center gap-2 text-base font-sans font-semibold text-black dark:text-white hover:underline group"
          >
            <span>{isId ? 'Lanjut ke Pusat Unduhan' : 'Next: Download Center'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      <ArunakiFooter locale={locale} />
    </div>
  );
}
