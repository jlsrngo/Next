'use client';

import { useState, useMemo } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import {
  Download,
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  FileCode,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Presentation,
  FileSearch,
  Globe,
  Lock,
  Database,
  Code2,
  Workflow,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Cpu,
  Package,
  Table,
} from 'lucide-react';

interface ArunakiClientProps {
  locale: string;
}

interface ToolItem {
  id: string;
  name: string;
  category: 'workspace' | 'office' | 'pdf' | 'audit' | 'enterprise' | 'orchestration';
  categoryLabel: { id: string; en: string };
  description: { id: string; en: string };
  parameters: string[];
  example: string;
}

export default function ArunakiClient({ locale }: ArunakiClientProps) {
  const isId = locale === 'id';
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<'curl' | 'winget' | 'bun' | 'npm' | 'brew' | 'git'>('curl');
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToolCategory, setActiveToolCategory] = useState<string>('all');

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

  const handleLanguageSwitch = (lang: 'en' | 'id') => {
    if (lang === locale) return;
    localStorage.setItem('portfolio_locale', lang);
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000`;
    router.replace(pathname, { locale: lang });
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
      const matchesCategory = activeToolCategory === 'all' || tool.category === activeToolCategory;
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
  }, [activeToolCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors font-sans antialiased">
      {/* 1. MINIMAL OPENCODE-STYLE HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo on Left (OpenCode lowercase bold monospace style) */}
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="text-xs font-mono text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 mr-2"
              title={isId ? 'Kembali ke Portofolio' : 'Back to Portfolio'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isId ? 'Portofolio' : 'Portfolio'}</span>
            </Link>

            <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

            <a href="#hero" className="flex items-center gap-2 tracking-tight">
              <span className="text-xl font-bold font-mono tracking-tighter text-black dark:text-white">
                arunaki
              </span>
            </a>
          </div>

          {/* Simple Clean Text Links on Right */}
          <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
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
              {isId ? 'Dokumentasi' : 'Docs'}
            </a>
            <a
              href="#features"
              className="hover:text-black dark:hover:text-white transition-colors hidden sm:inline"
            >
              {isId ? 'Fitur' : 'Features'}
            </a>
            <a
              href="#tools"
              className="hover:text-black dark:hover:text-white transition-colors hidden md:inline"
            >
              {isId ? 'Alat' : 'Tools'}
            </a>
            <a
              href="#security"
              className="hover:text-black dark:hover:text-white transition-colors hidden md:inline"
            >
              {isId ? 'Keamanan' : 'Security'}
            </a>

            {/* Language Switcher Pill */}
            <div className="flex items-center rounded border border-zinc-200 dark:border-zinc-800 p-0.5 text-xs font-mono">
              <button
                onClick={() => handleLanguageSwitch('id')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  isId
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                    : 'text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
                title="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  !isId
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                    : 'text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Download CTA Button */}
            <a
              href="#download"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-mono text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isId ? 'Unduh' : 'Download'}</span>
            </a>
          </nav>
        </div>
      </header>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 space-y-24">
        {/* HERO SECTION */}
        <section id="hero" className="space-y-8">
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

        {/* 1. DOCUMENTATION & ARCHITECTURE (DETAILED & IN-DEPTH) */}
        <section id="docs" className="space-y-8 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Dokumentasi & Arsitektur Inti' : 'Documentation & Core Architecture'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Arsitektur sistem mendalam, alur pemanggilan COM native, isolasi sandbox, dan mekanisme pemulihan rollback.'
                : 'In-depth system architecture, native COM bridges, sandbox defense-in-depth, and rollback checkpoint mechanics.'}
            </p>
          </div>

          {/* Architecture Pipeline Flow Diagram */}
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              {isId ? 'Alur Pipeline Arsitektur Sistem' : 'System Architecture Pipeline'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono text-center">
              <div className="p-3.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-[10px] text-zinc-400 mb-1">01. PROMPT</span>
                <span>User Input</span>
              </div>
              <div className="p-3.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-[10px] text-zinc-400 mb-1">02. WORKSTATION</span>
                <span>Electron Shell</span>
              </div>
              <div className="p-3.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-[10px] text-zinc-400 mb-1">03. HARNESS</span>
                <span>Tool Registry</span>
              </div>
              <div className="p-3.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold text-black dark:text-white flex flex-col justify-center items-center shadow-sm">
                <span className="text-[10px] text-zinc-400 mb-1">04. ADAPTERS</span>
                <span>COM / PDF / Ledger</span>
              </div>
              <div className="p-3.5 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-700 dark:text-emerald-400 flex flex-col justify-center items-center shadow-sm">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 mb-1">05. SANDBOX</span>
                <span>Workspace Files</span>
              </div>
            </div>
          </div>

          {/* 3 Pillars Grid with detailed descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <ShieldCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? '1. Folder Sandbox Terkunci' : '1. Sandboxed Workspace'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Seluruh pembacaan dan penulisan berkas dibatasi 100% di dalam folder kerja yang dipilih. Lapisan StorageService secara ketat mencegat percobaan path traversal (../../) dan memblokir akses ke disk sistem root (C:\\Windows).'
                  : 'All file operations are confined 100% to the chosen workspace directory. StorageService actively intercepts path traversal attempts (../../) and strictly blocks access to root system files.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <Terminal className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? '2. Jembatan Win32 COM Native' : '2. Native Win32 COM Bridge'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Berbeda dengan AI berbasis cloud yang sering merusak formula, Arunaki berinteraksi langsung dengan mesin Microsoft Excel & Word lokal secara headless. Rumus dinamis (=SUM, =VLOOKUP), grafik, makro VBA, dan format margin tetap 100% utuh.'
                  : 'Unlike cloud AI models that corrupt formulas, Arunaki attaches directly to local Microsoft Excel and Word COM engines headlessly. Formulas (=SUM, =VLOOKUP), charts, VBA macros, and margins remain 100% intact.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <RotateCcw className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? '3. 1-Klik Rollback Checkpoint' : '3. 1-Click Rollback Checkpoints'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Sebelum file apapun dimodifikasi, Arunaki secara otomatis membuat salinan backup snapshot lokal yang tidak dapat diubah (immutable) di direktori .arunaki/checkpoints. Dokumen asli dapat dikembalikan seketika hanya dengan 1 klik.'
                  : 'Before applying mutations, Arunaki creates immutable local snapshots under .arunaki/checkpoints. If any automated edit needs to be reverted, restore the original file instantly with a single click.'}
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              {isId ? 'Perbandingan: AI Cloud Konvensional vs Arunaki' : 'Comparison: Conventional Cloud AI vs Arunaki'}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <tr>
                    <th className="p-3 font-semibold">{isId ? 'Aspek / Kemampuan' : 'Aspect / Capability'}</th>
                    <th className="p-3 font-semibold">{isId ? 'AI Cloud Konvensional' : 'Conventional Cloud AI'}</th>
                    <th className="p-3 font-semibold text-black dark:text-white">Arunaki Desktop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <tr>
                    <td className="p-3 font-bold">{isId ? 'Kerahasiaan Dokumen' : 'Document Privacy'}</td>
                    <td className="p-3 text-red-500">{isId ? 'File diunggah ke server cloud publik' : 'Files uploaded to public cloud servers'}</td>
                    <td className="p-3 text-emerald-500 font-semibold">{isId ? '100% lokal & sandboxed (zero data leak)' : '100% local & sandboxed (zero data leak)'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">{isId ? 'Integritas Rumus Excel' : 'Excel Formula Retention'}</td>
                    <td className="p-3 text-red-500">{isId ? 'Rumus sering terhapus jadi teks mati' : 'Formulas overwritten into static text'}</td>
                    <td className="p-3 text-emerald-500 font-semibold">{isId ? 'Mesin COM asli menjaga semua formula' : 'Native COM engine preserves all formulas'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">{isId ? 'Pemulihan Kesalahan' : 'Error Recovery'}</td>
                    <td className="p-3 text-zinc-500">{isId ? 'Manual lewat riwayat file OS' : 'Manual file history retrieval'}</td>
                    <td className="p-3 text-emerald-500 font-semibold">{isId ? '1-Klik Rollback Checkpoint otomatis' : 'Automatic 1-Click Rollback Checkpoints'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">{isId ? 'Kepatuhan Regulasi PII' : 'PII Compliance'}</td>
                    <td className="p-3 text-zinc-500">{isId ? 'Rentan kebocoran data KTP/NPWP' : 'High risk of NIK/tax ID data leaks'}</td>
                    <td className="p-3 text-emerald-500 font-semibold">{isId ? 'doc_redact_pii masking otomatis' : 'Automated doc_redact_pii masking'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 2. COMPREHENSIVE FEATURE GUIDES */}
        <section id="features" className="space-y-8 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Panduan Fitur Dokumen Mendalam' : 'Comprehensive Feature Guides'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Rincian teknis lengkap, penanganan koordinat sel, injeksi tabel, redline klausul, dan pipeline e-Materai.'
                : 'Complete technical breakdown, cell coordinates, table injection, clause redline diffs, and e-Materai pipeline.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1: Excel */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                  {isId ? 'Spreadsheet Microsoft Excel' : 'Excel Spreadsheets'}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">.xlsx, .xlsm, .csv</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Arunaki berinteraksi langsung dengan Excel melalui otomasi COM headless. Mampu membaca dan menulis sel pada koordinat presisi (misal B2, S14), mengevaluasi rumus dinamis (=SUM, =VLOOKUP, =IF), mengkloning template sheet bulanan, dan ekspor langsung ke PDF.'
                  : 'Interacts directly with Microsoft Excel via headless COM automation. Reads and writes precise cell coordinates (B2, S14), preserves dynamic formulas (=SUM, =VLOOKUP), clones monthly template sheets, and compiles directly to PDF.'}
              </p>
              <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                <code>desktop_excel_edit(path, sheet: &quot;Agustus 2026&quot;, updates: [{'{ cell: "B2", value: 15400000 }'}])</code>
              </div>
            </div>

            {/* Feature 2: Word */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                  {isId ? 'Dokumen Microsoft Word' : 'Word Documents'}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">.docx, .doc</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Otomasi korespondensi dan perjanjian hukum: mendeteksi dan mengganti placeholder klausul kontrak (misal {{NAMA_KLIEN}}, {{TANGGAL}}, {{NILAI_KONTRAK}}), menyisipkan tabel berformat rapi, menjaga margin dan font asli 100% utuh, serta menerbitkan ke PDF.'
                  : 'Automate corporate agreements and correspondence: detects and substitutes placeholders ({{CLIENT_NAME}}, {{EFFECTIVE_DATE}}), injects multi-column tables, retains typography and page margins, and exports directly to PDF.'}
              </p>
              <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                <code>desktop_word_edit(path, placeholders: {'{ "{{NAMA_KLIEN}}": "PT Surya Mandiri Utama" }'})</code>
              </div>
            </div>

            {/* Feature 3: PowerPoint */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <Presentation className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                  {isId ? 'Slide Presentasi PowerPoint' : 'PowerPoint Slide Decks'}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">.pptx, .ppt</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Pembuatan slide presentasi bisnis otomatis: menyusun slide deck baru dengan judul terstruktur, memodifikasi teks frame shape dan kartu metrik KPI, serta menyusun deck PDF siap presentasi.'
                  : 'Automated presentation slide authoring: generate slide decks with structured bullet outlines, update shape text frames and KPI metric callouts, and compile distribution decks to PDF.'}
              </p>
              <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                <code>desktop_ppt_edit(path, slides: [{'{ title: "Kinerja Penjualan Q3", bullets: [...] }'}])</code>
              </div>
            </div>

            {/* Feature 4: PDF Pipeline & e-Materai */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                  {isId ? 'Pipeline PDF & e-Materai' : 'PDF Pipeline & e-Materai'}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">.pdf (pdf-lib)</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Penggabungan batch (merge) berkas invoice bulanan, ekstraksi rentang halaman tertentu, penambahan watermark diagonal kustom, serta pembubuhan tanda tangan digital dan stempel e-Materai resmi pada koordinat x,y presisi.'
                  : 'Batch invoice merging, page range extraction, custom diagonal text watermarks, and cryptographic e-Materai stamping placed on exact x,y coordinates.'}
              </p>
              <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                <code>pdf_stamp_image(path, stamp_type: &quot;ematerai&quot;, coords: {'{ x: 450, y: 720 }'})</code>
              </div>
            </div>

            {/* Feature 5: PII Data Redaction */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                  {isId ? 'Penyamaran Data Sensitif PII' : 'PII Data Redaction'}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">doc_redact_pii</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Kepatuhan privasi data perusahaan: mendeteksi dan menyamarkan informasi identitas sensitif secara otomatis sebelum dokumen dibagikan. Mendukung NIK KTP Indonesia (16 digit), NPWP pajak, nomor rekening bank, kartu kredit, dan nomor telepon.'
                  : 'Automated corporate privacy compliance: detects and masks confidential identifiers before document sharing. Supports Indonesian NIK KTP, NPWP tax IDs, bank accounts, emails, and mobile phone numbers.'}
              </p>
              <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                <code>doc_redact_pii(path, pii_targets: [&quot;NIK&quot;, &quot;NPWP&quot;, &quot;BANK&quot;])</code>
              </div>
            </div>

            {/* Feature 6: Version Audit & Redline */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
              <div className="flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                  {isId ? 'Audit Redline & Buku Besar' : 'Redline Diff & Ledger Audit'}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">doc_compare_versions</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Audit komparasi dokumen baris-per-baris: menghasilkan tabel redline Markdown yang memetakan klausul ditambah/diubah/dihapus, menghitung skor kemiripan, dan memvalidasi keseimbangan debit-kredit jurnal buku besar akuntansi ganda.'
                  : 'Line-by-line document diffing: compiles Markdown redline tables mapping added, modified, and deleted clauses, computes similarity indices, and certifies double-entry accounting ledger balance.'}
              </p>
              <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                <code>doc_compare_versions(original: &quot;v1.docx&quot;, revised: &quot;v2.docx&quot;)</code>
              </div>
            </div>
          </div>
        </section>

        {/* 3. KNOWLEDGE BASE & CANVAS PANEL */}
        <section id="knowledge" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Basis Pengetahuan Domain & Panel Canvas' : 'Domain Knowledge Base & Canvas Panel'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Integrasi aturan bisnis perusahaan, SOP internal, katalog harga, dan panel kanvas interaktif.'
                : 'Integration of corporate business rules, internal SOPs, price lists, and interactive canvas exports.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5">
              <Database className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? '1. Penyimpanan Prisma DB Terpadu' : '1. Unified Prisma DB Storage'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Model Knowledge di SQLite menyimpan judul, tipe aturan, teks SOP, dan status aktif. Konteks diinjeksi secara dinamis ke system prompt saat agen memproses permintaan.'
                  : 'Knowledge model in SQLite stores titles, rule categories, and SOP texts dynamically injected into system prompts.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5">
              <Package className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? '2. Unggah Dokumen Acuan (Drag & Drop)' : '2. Reference Document Upload'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Dukungan unggah file PDF, DOCX, TXT, MD, dan CSV hingga 10MB dengan ekstraksi teks otomatis (mammoth, pdf2json, csv-parse) langsung ke database.'
                  : 'Direct drag-and-drop upload for PDF, DOCX, TXT, MD, and CSV files with automated text extraction into the knowledge base.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5">
              <Workflow className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? '3. Knowledge Tuning dari Chat' : '3. In-Chat Knowledge Tuning'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Pengguna dapat memberikan umpan balik format langsung di obrolan, dan agen secara otomatis memperbarui aturan di Knowledge Base via tool save_knowledge.'
                  : 'Users can refine output formats directly in chat, allowing the agent to persist rule updates via save_knowledge.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5">
              <Table className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <h3 className="font-bold text-sm text-black dark:text-white font-mono">
                {isId ? '4. Panel Canvas & Ekspor CSV/TXT' : '4. Canvas Panel & Instant Export'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Hasil ekstraksi tabel data dan perhitungan kalkulator disajikan pada Panel Canvas terpisah dengan tombol 1-klik unduh format .csv dan .txt.'
                  : 'Table extraction and calculation datasets are presented in dedicated Canvas Panels with 1-click CSV/TXT exports.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. INTERACTIVE TOOL HARNESS CATALOG */}
        <section id="tools" className="space-y-6 pt-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
                {isId ? 'Katalog Tool Harness (50+ Tool)' : 'Tool Harness Catalog (50+ Tools)'}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                {isId
                  ? 'Registri alat utama yang dapat dipanggil oleh agen dokumen secara terprogram (PTC).'
                  : 'Core tool registry available to the agent harness for programmatic tool calling (PTC).'}
              </p>
            </div>
            <span className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 shrink-0 self-start sm:self-auto">
              {filteredTools.length} {isId ? 'Tool Ditampilkan' : 'Tools Shown'}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isId ? 'Cari nama tool, parameter, atau kata kunci...' : 'Search tools by name, parameters, or keywords...'}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-mono text-zinc-400 hover:text-black dark:hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex overflow-x-auto gap-1.5 pb-1">
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
                onClick={() => setActiveToolCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                  activeToolCategory === cat.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                    : 'border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tool Cards */}
          <div className="space-y-4">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <code className="text-sm font-bold font-mono text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">
                      {tool.name}
                    </code>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                      {isId ? tool.categoryLabel.id : tool.categoryLabel.en}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(tool.example, `tool-${tool.id}`)}
                    className="self-end sm:self-center text-xs font-mono text-zinc-400 hover:text-black dark:hover:text-white flex items-center gap-1"
                  >
                    {copied === `tool-${tool.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">{isId ? 'Tersalin' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy call</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono">
                  {isId ? tool.description.id : tool.description.en}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-mono text-zinc-500 flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-zinc-400">Parameters:</span>
                    {tool.parameters.map((param, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {param}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto">
                    <code>{tool.example}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. DEFENSE-IN-DEPTH SECURITY */}
        <section id="security" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Keamanan & Batas Isolasi Sandbox' : 'Defense-in-Depth Security & Sandboxing'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Empat pilar perlindungan dokumen bisnis dan rahasia perusahaan pada arsitektur Arunaki.'
                : 'Four architectural pillars engineered to safeguard corporate secrets and private records.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2 text-black dark:text-white font-bold text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Isolated Workspace Sandbox</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Seluruh pembacaan dan penulisan berkas terkunci secara eksklusif ke folder kerja yang Anda pilih. Upaya path traversal (seperti ../../Windows/System32) dicegat dan diblokir seketika pada lapisan harness.'
                  : 'All file I/O operations are locked exclusively to the chosen folder. Path traversal attempts (../../) are intercepted and rejected at the harness layer.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2 text-black dark:text-white font-bold text-xs font-mono">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Zero OS Shell Access</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Harness agen Arunaki tidak mengeksekusi shell terminal bebas (cmd/powershell/bash), tidak mengunduh skrip dari luar, dan tidak mengubah konfigurasi sistem operasi Anda.'
                  : 'The agent harness cannot execute arbitrary terminal commands, download external scripts, or modify OS registry and settings.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2 text-black dark:text-white font-bold text-xs font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Approval Gate for Destructive Actions</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Operasi yang bersifat permanen atau menghapus file wajib meminta persetujuan eksplisit melalui dialog interaktif sebelum dieksekusi.'
                  : 'Irreversible modifications and file deletions require explicit interactive user authorization before execution.'}
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
              <div className="flex items-center gap-2 text-black dark:text-white font-bold text-xs font-mono">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Local AES-256 Storage</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isId
                  ? 'Kunci API dan konfigurasi sesi disimpan secara lokal menggunakan enkripsi AES-256 tanpa pernah disinkronisasi ke server cloud pihak ketiga.'
                  : 'API keys and local configurations are stored locally with AES-256 encryption, never transmitted to external cloud trackers.'}
              </p>
            </div>
          </div>
        </section>

        {/* 6. CONFIGURATION */}
        <section id="config" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Konfigurasi & Variabel Lingkungan (.env)' : 'Configuration & Environment Variables'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Pengaturan dapat dikonfigurasi melalui Settings Panel di UI atau via file apps/api/.env.'
                : 'Settings can be configured through the UI Settings Panel or via apps/api/.env.'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                <tr>
                  <th className="p-3 font-semibold">Variable</th>
                  <th className="p-3 font-semibold">Default</th>
                  <th className="p-3 font-semibold">{isId ? 'Deskripsi' : 'Description'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">PORT</td>
                  <td className="p-3 text-zinc-500">3000</td>
                  <td className="p-3">
                    {isId ? 'Port komunikasi server API lokal workstation.' : 'Local API server communication port.'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">WORKSPACE_ROOT</td>
                  <td className="p-3 text-zinc-500">./workspace</td>
                  <td className="p-3">
                    {isId ? 'Jalur folder sandboxed tempat dokumen kerja disimpan.' : 'Default directory for the isolated document workspace.'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">DATABASE_URL</td>
                  <td className="p-3 text-zinc-500">file:./dev.db</td>
                  <td className="p-3">
                    {isId ? 'Jalur penyimpanan basis data SQLite lokal.' : 'Local SQLite database storage path.'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">OPENROUTER_API_KEY</td>
                  <td className="p-3 text-zinc-500">(Custom User Key)</td>
                  <td className="p-3">
                    {isId ? 'Kunci API OpenRouter untuk routing model AI (disimpan lokal dengan AES-256).' : 'OpenRouter API key for model routing (encrypted locally with AES-256).'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-black dark:text-white">DEFAULT_MODEL</td>
                  <td className="p-3 text-zinc-500">deepseek-v4-flash:free</td>
                  <td className="p-3">
                    {isId ? 'Model inferensi default yang diarahkan melalui agent harness.' : 'Default model routed through the agent harness.'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. DOWNLOAD SECTION */}
        <section id="download" className="space-y-6 pt-4 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white font-mono">
              {isId ? 'Unduh Arunaki' : 'Download Arunaki'}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {isId
                ? 'Paket biner siap pakai untuk Windows dan macOS.'
                : 'Pre-built binary packages ready for Windows and macOS.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Windows Setup */}
            <div className="p-6 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-4">
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {isId ? 'Direkomendasikan' : 'Recommended'}
                </span>
                <h3 className="font-bold text-sm text-black dark:text-white">Windows Setup (.exe)</h3>
                <p className="text-xs text-zinc-500">Arunaki-Setup-x64.exe</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  {isId
                    ? 'Windows 10 / 11 (64-bit) dengan pembaruan otomatis di latar belakang.'
                    : 'Windows 10 / 11 (64-bit) with automatic background updates.'}
                </p>
              </div>
              <a
                href="https://github.com/jlsrngo/Arunaki/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-mono text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isId ? 'Unduh .exe' : 'Download .exe'}</span>
              </a>
            </div>

            {/* Windows Portable */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-4">
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {isId ? 'Portabel' : 'Standalone'}
                </span>
                <h3 className="font-bold text-sm text-black dark:text-white">Windows Portable (.zip)</h3>
                <p className="text-xs text-zinc-500">Arunaki-Portable.zip</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  {isId
                    ? 'Tanpa instalasi. Langsung jalankan dari flashdisk USB atau folder lokal.'
                    : 'Zero installation required. Ready to run directly from a USB flash drive.'}
                </p>
              </div>
              <a
                href="https://github.com/jlsrngo/Arunaki/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isId ? 'Unduh .zip' : 'Download .zip'}</span>
              </a>
            </div>

            {/* macOS */}
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-4">
              <div className="space-y-2 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {isId ? 'Universal' : 'Universal'}
                </span>
                <h3 className="font-bold text-sm text-black dark:text-white">macOS Universal (.dmg)</h3>
                <p className="text-xs text-zinc-500">Arunaki-Universal.dmg</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  {isId
                    ? 'Apple Silicon (M1-M4) & Intel x64. Membutuhkan macOS Monterey (12.0+).'
                    : 'Apple Silicon (M1-M4) & Intel x64. Requires macOS Monterey (12.0+).'}
                </p>
              </div>
              <a
                href="https://github.com/jlsrngo/Arunaki/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isId ? 'Unduh .dmg' : 'Download .dmg'}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 3. MINIMAL FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-8 text-xs font-mono text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            {isId
              ? 'Arunaki • Workstation & Harness Agen Dokumen Sandboxed'
              : 'Arunaki • The Open Document Agent Workstation & Automation Harness'}
          </p>
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
            <Link href="/projects" className="hover:text-black dark:hover:text-white transition-colors">
              {isId ? 'Portofolio' : 'Portfolio'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
