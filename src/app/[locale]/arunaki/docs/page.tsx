'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ArunakiNavbar from '@/components/ArunakiNavbar';
import ArunakiFooter from '@/components/ArunakiFooter';
import { Link } from '@/i18n/navigation';
import { Menu, X, Clock, Download, CheckCircle2, ShieldCheck, Zap, Bot } from 'lucide-react';

type SectionId =
  | 'intro'
  | 'agents'
  | 'models'
  | 'skills'
  | 'tools'
  | 'providers'
  | 'gateway'
  | 'download';

const navGroups = [
  {
    group: null,
    items: [
      { id: 'intro' as SectionId,    en: 'Intro',       id_: 'Pendahuluan' },
    ],
  },
  {
    group: 'CONFIGURE',
    items: [
      { id: 'agents' as SectionId,    en: 'Agents',      id_: 'Agents' },
      { id: 'models' as SectionId,    en: 'Models',      id_: 'Model' },
      { id: 'skills' as SectionId,    en: 'Skills',      id_: 'Skills' },
      { id: 'tools' as SectionId,     en: 'Tools',       id_: 'Tools' },
      { id: 'providers' as SectionId, en: 'Providers',   id_: 'Provider' },
      { id: 'gateway' as SectionId,   en: 'App Gateway', id_: 'App Gateway' },
      { id: 'download' as SectionId,  en: 'Download',    id_: 'Unduh' },
    ],
  },
];

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-sm sm:text-base bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded">
      {children}
    </code>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="p-4 sm:p-5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-sm sm:text-base text-zinc-300 overflow-x-auto my-4 sm:my-5 leading-relaxed">
      {code}
    </pre>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight text-black dark:text-white mb-4 sm:mb-5">{children}</h1>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-black dark:text-white mt-10 mb-4">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans mb-5">{children}</p>;
}

function Card({ title, badge, desc }: { title: string; badge?: string; desc: string }) {
  return (
    <div className="p-4 sm:p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2 mb-4">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="font-bold text-black dark:text-white font-mono text-base sm:text-lg">{title}</span>
        {badge && (
          <span className="text-xs sm:text-sm font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">{desc}</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// SECTIONS
// -----------------------------------------------------------------------------

function IntroSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>{isId ? 'Dokumentasi Arunaki' : 'Arunaki Documentation'}</H1>
      <div className="p-5 sm:p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 mb-8 space-y-2">
        <p className="font-mono text-lg sm:text-xl font-bold text-black dark:text-white">
          {isId
            ? 'Workstation & Harness Otomasi Agen Dokumen Desktop'
            : 'The Desktop Document Agent Workstation & Automation Harness'}
        </p>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-sans italic leading-relaxed">
          {isId
            ? 'Native desktop computer-use untuk spreadsheet Microsoft Excel, kontrak Word, presentasi PowerPoint, pipeline PDF, dan pembukuan finansial.'
            : 'Native desktop computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers.'}
        </p>
      </div>

      <H2>{isId ? '1. Panduan Cepat (Quick Start)' : '1. Quick Start'}</H2>
      <div className="space-y-4 sm:space-y-5 mb-8">
        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
          <div className="flex items-center gap-2.5 font-mono text-base sm:text-lg font-bold text-black dark:text-white">
            <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs sm:text-sm font-bold">1</span>
            <span>{isId ? 'Unduh & Jalankan Workstation' : 'Download & Run Workstation'}</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Arunaki hadir sebagai aplikasi native desktop berbasis Electron untuk Windows dan macOS. Buka aplikasi workstation langsung dari sistem operasi Anda.'
              : 'Arunaki runs as a native desktop application built with Electron for Windows and macOS. Launch the workstation app directly on your operating system.'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5">
          <div className="flex items-center gap-2.5 font-mono text-base sm:text-lg font-bold text-black dark:text-white">
            <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs sm:text-sm font-bold">2</span>
            <span>{isId ? 'Pilih Folder Workspace Terisolasi (Sandbox)' : 'Select Sandboxed Workspace Folder'}</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Saat workstation terbuka, pilih folder kerja khusus tempat dokumen bisnis Anda berada (contoh: C:\\Users\\Admin\\Documents\\CompanyFiles).'
              : 'When Arunaki opens, select the dedicated folder containing your business documents (e.g. C:\\Users\\Admin\\Documents\\CompanyFiles).'}
          </p>
          <div className="text-sm font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 p-3 sm:p-3.5 rounded leading-relaxed">
            <strong className="text-black dark:text-white">{isId ? 'Catatan Keamanan:' : 'Security Note:'}</strong>{' '}
            {isId
              ? 'Arunaki dibatasi ketat (sandboxed) hanya pada folder yang dipilih. Agen tidak dapat membaca, mengubah, atau mengakses file apapun di luar folder tersebut.'
              : 'Arunaki is sandboxed strictly to this folder. It cannot read, modify, or access any files outside your selected workspace.'}
          </div>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5">
          <div className="flex items-center gap-2.5 font-mono text-base sm:text-lg font-bold text-black dark:text-white">
            <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs sm:text-sm font-bold">3</span>
            <span>{isId ? 'Mulai Otomasi dengan Bahasa Alami' : 'Start Automating with Natural Language'}</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Ketik instruksi langsung di konsol chat desktop workstation atau kirim via remote App Gateway:'
              : 'Type natural instructions in the desktop workstation console or send them via remote App Gateway:'}
          </p>
          <div className="space-y-2 font-mono text-sm sm:text-base text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded border border-zinc-200 dark:border-zinc-800 leading-relaxed">
            <div>&quot;Rekap pemasukan dan pengeluaran hari ini ke laporan_keuangan.xlsx&quot;</div>
            <div>&quot;Ganti nama klien di kontrak_kerjasama.docx menjadi PT Surya Mandiri&quot;</div>
            <div>&quot;Gabungkan semua file PDF invoice bulan ini dan beri watermark LUNAS&quot;</div>
          </div>
        </div>
      </div>

      <H2>{isId ? '2. Konsep Inti (Core Concepts)' : '2. Core Concepts'}</H2>
      <div className="space-y-4 mb-8">
        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-black dark:text-white" />
            <span className="font-bold font-mono text-base sm:text-lg text-black dark:text-white">
              {isId ? 'The Workspace Sandbox (Isolasi Folder Kerja)' : 'The Workspace Sandbox'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Semua operasi dokumen terjadi secara terisolasi di folder Workspace pilihan Anda. Harness agen tidak dapat mengeksekusi perintah sistem bebas, mengakses file sistem inti, atau menyentuh drive eksternal.'
              : 'All document operations occur within your chosen Workspace Folder. The agent harness cannot execute arbitrary system commands, access root operating system files, or read external drives.'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-black dark:text-white" />
            <span className="font-bold font-mono text-base sm:text-lg text-black dark:text-white">
              {isId ? 'Otomasi Native COM vs Modifikasi Berkas' : 'Native COM vs File Modification'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'File Microsoft Office (.xlsx, .docx, .pptx) dikerjakan langsung via native Windows COM automation headless, sehingga rumus, font, margin, chart, dan styling 100% terjaga. File PDF dan teks dimodifikasi presisi tingkat byte.'
              : 'Microsoft Office files (.xlsx, .docx, .pptx) are executed directly through native Windows COM automation, ensuring formulas, fonts, margins, charts, and colors remain 100% intact. Standard PDF and text files use precise byte-level manipulation.'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-black dark:text-white" />
            <span className="font-bold font-mono text-base sm:text-lg text-black dark:text-white">
              {isId ? 'Checkpoint & 1-Klik Rollback' : 'Checkpoints & 1-Click Rollback'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Sebelum menerapkan perubahan pada dokumen, Arunaki membuat snapshot lokal immutable secara otomatis. Jika ingin mengembalikan dokumen ke versi semula, cukup 1 klik rollback.'
              : 'Before applying changes to any document, Arunaki automatically creates an immutable local snapshot. If an automated modification needs to be undone, restore the original file instantly with a single click.'}
          </p>
        </div>
      </div>

      <H2>{isId ? '3. Antarmuka Akses (Interfaces)' : '3. Access Interfaces'}</H2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-black dark:text-white" />
              <span className="font-mono font-bold text-base sm:text-lg text-black dark:text-white">
                {isId ? 'Workstation Desktop (Electron)' : 'Electron Workstation'}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-mono bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-2.5 py-0.5 rounded font-semibold">
              {isId ? 'Utama' : 'Primary'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Aplikasi desktop native berbasis Electron dengan konsol agen, live preview dokumen, dan kontrol sandbox.'
              : 'Native Electron desktop workstation with agent console, document preview, and sandbox controls.'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-black dark:text-white" />
              <span className="font-mono font-bold text-base sm:text-lg text-black dark:text-white">
                {isId ? 'App Gateway (Akses Pesan)' : 'App Gateway'}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
              Telegram
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {isId
              ? 'Akses remote aman via Telegram Bot untuk kirim perintah dan terima berkas hasil langsung dari chat.'
              : 'Secure remote bridge via Telegram Bot to dispatch tasks and receive processed documents directly in chat.'}
          </p>
        </div>
      </div>

      <H2>{isId ? '4. Arsitektur Eksekusi Harness' : '4. Harness Architecture'}</H2>
      <div className="p-5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-sm sm:text-base text-zinc-300 leading-relaxed overflow-x-auto mb-8">
        <div>{isId ? '[Instruksi Pengguna / User Instruction]' : '[User Instruction]'}</div>
        <div className="text-zinc-500">  │</div>
        <div className="text-zinc-500">  ▼</div>
        <div>{isId ? '[Shell Desktop Arunaki (Electron)]' : '[Arunaki Desktop Shell (Electron)]'}</div>
        <div className="text-zinc-500">  │</div>
        <div className="text-zinc-500">  ▼</div>
        <div>{isId ? '[Harness Eksekusi Agen]' : '[Agent Execution Harness]'}</div>
        <div className="text-zinc-500">  │</div>
        <div className="text-zinc-500">  ▼</div>
        <div>{isId ? '[Registry & Normalizer Tool]' : '[Tool Registry & Normalizer]'}</div>
        <div className="text-zinc-500">  ├── {isId ? 'Bridge Native Office COM (.xlsx, .docx, .pptx)' : 'Native Office COM Bridge (.xlsx, .docx, .pptx)'}</div>
        <div className="text-zinc-500">  ├── {isId ? 'Pemroses Dokumen PDF & Biner' : 'PDF & Binary Processor'}</div>
        <div className="text-zinc-500">  └── {isId ? 'Mesin Pembukuan / Ledger Engine' : 'Ledger Engine'}</div>
        <div className="text-zinc-500">  │</div>
        <div className="text-zinc-500">  ▼</div>
        <div className="text-zinc-200 dark:text-zinc-100 font-semibold">{isId ? '[(Folder Workspace Terisolasi / Sandboxed)]' : '[(Sandboxed Workspace Folder)]'}</div>
      </div>

      <H2>{isId ? 'Teknologi Inti' : 'Core Stack'}</H2>
      <div className="flex flex-wrap gap-2.5 mb-8">
        {['Electron', 'Bun / Node.js', 'TypeScript', 'Native Office COM Bridge', 'pdf-lib', 'mammoth', 'SQLite', 'Telegram Bot API'].map((t) => (
          <span key={t} className="text-sm sm:text-base font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-3.5 py-1.5 rounded">
            {t}
          </span>
        ))}
      </div>
    </>
  );
}

function AgentsSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>Agents</H1>
      <P>
        {isId
          ? 'Arunaki menggunakan sistem multi-agent di mana setiap agen menangani tugas domain tertentu di dalam harness Electron workstation. Agen beroperasi secara headless dan dapat dirantai melalui pipeline otomasi.'
          : 'Arunaki uses a multi-agent system where each agent handles a specific domain task inside the Electron workstation harness. Agents operate headlessly and can be chained through automation pipelines.'}
      </P>
      <H2>{isId ? 'Daftar Agen' : 'Agent Types'}</H2>
      <Card
        title="DocumentAgent"
        badge="com-worker"
        desc={isId
          ? 'Otomasi Microsoft Office (Excel, Word, PowerPoint) via Windows COM headless.'
          : 'Automates Microsoft Office (Excel, Word, PowerPoint) via headless Windows COM.'}
      />
      <Card
        title="PdfAgent"
        badge="pdf-lib"
        desc={isId
          ? 'Pipeline PDF presisi: merge, watermark, pemisahan halaman, dan stempel e-Materai.'
          : 'PDF pipelines: merge, watermark, page extraction, and e-Materai stamp.'}
      />
      <Card
        title="RedactAgent"
        badge="pii-masker"
        desc={isId
          ? 'Deteksi dan samarkan data sensitif PII (NIK, NPWP, nomor rekening, email, telepon).'
          : 'Auto-detects and masks sensitive PII data (NIK, NPWP, bank accounts, emails, phones).'}
      />
      <Card
        title="GatewayAgent"
        badge="bot-gateway"
        desc={isId
          ? 'Menerima instruksi dan mengirimkan berkas hasil melalui App Gateway messaging.'
          : 'Receives instructions and delivers document results via messaging app gateways.'}
      />
      <H2>{isId ? 'Konfigurasi Agen' : 'Agent Configuration'}</H2>
      <CodeBlock code={`// agent.config.ts
export const agents = {
  document: { enabled: true, comTimeout: 30000 },
  pdf:      { enabled: true, maxPageSize: '50MB' },
  redact:   { enabled: true, targets: ['NIK', 'NPWP', 'BANK'] },
  gateway:  { enabled: true, token: process.env.TELEGRAM_BOT_TOKEN },
};`} />
    </>
  );
}

function ModelsSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>{isId ? 'Model & Provider LLM' : 'Models & LLM Providers'}</H1>
      <P>
        {isId
          ? 'Arunaki mendukung berbagai penyedia LLM utama serta penyedia pihak ketiga (third-party) via endpoint standar kompatibel OpenAI. Model dapat dikonfigurasi per agen atau per tugas hanya via file .env tanpa perlu mengubah kode.'
          : 'Arunaki supports major LLM providers as well as third-party providers via OpenAI-compatible endpoints. Models can be configured per agent or task via .env without modifying code.'}
      </P>

      <H2>{isId ? 'Provider Utama (Primary Providers)' : 'Primary Supported Providers'}</H2>
      {[
        { name: 'OpenAI',           models: 'gpt-4o, gpt-4o-mini, gpt-4-turbo',     key: 'OPENAI_API_KEY' },
        { name: 'Anthropic Claude', models: 'claude-3-5-sonnet, claude-3-haiku',    key: 'ANTHROPIC_API_KEY' },
        { name: 'Google Gemini',    models: 'gemini-2.0-flash, gemini-1.5-pro',     key: 'GEMINI_API_KEY' },
        { name: 'Ollama (Local)',   models: 'llama3, mistral, phi3, qwen2',         key: isId ? 'Tanpa API key' : 'No API key' },
      ].map((p) => (
        <div key={p.name} className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mb-4 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <span className="font-bold text-black dark:text-white font-mono text-base sm:text-lg">{p.name}</span>
            <span className="text-xs sm:text-sm font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2.5 py-0.5 rounded">{p.key}</span>
          </div>
          <p className="font-mono text-sm sm:text-base text-zinc-500">{p.models}</p>
        </div>
      ))}

      <H2>{isId ? 'Provider Pihak Ketiga & Kompatibilitas OpenAI (Third-Party)' : 'Third-Party & OpenAI-Compatible Providers'}</H2>
      {[
        {
          name: 'OpenRouter',
          models: 'deepseek/deepseek-r1, anthropic/claude-3.5-sonnet, meta-llama/llama-3.3-70b',
          key: 'OPENROUTER_API_KEY',
          desc: isId ? 'Akses agregator ke 200+ model AI (DeepSeek, Llama, Claude, Qwen) dengan satu API key terpusat.' : 'Aggregator access to 200+ AI models (DeepSeek, Llama, Claude, Qwen) with a single unified API key.',
        },
        {
          name: 'Groq',
          models: 'llama-3.3-70b-versatile, deepseek-r1-distill-llama-70b, mixtral-8x7b',
          key: 'GROQ_API_KEY',
          desc: isId ? 'Inferensi ultra-cepat berbasis hardware LPU untuk proses otomasi dokumen berkecepatan tinggi.' : 'Ultra-fast LPU hardware inference for high-speed automated document processing.',
        },
        {
          name: 'DeepSeek',
          models: 'deepseek-chat (V3), deepseek-reasoner (R1)',
          key: 'DEEPSEEK_API_KEY',
          desc: isId ? 'Model penalaran matematika dan sintesis logika tingkat tinggi langsung dari API resmi DeepSeek.' : 'Advanced reasoning and logical synthesis models directly from official DeepSeek API.',
        },
        {
          name: 'Custom / OpenAI-Compatible',
          models: 'vLLM, LM Studio, Together AI, Mistral, LocalAI, dll.',
          key: 'OPENAI_BASE_URL',
          desc: isId ? 'Gunakan server self-hosted atau gateway proxy apapun yang kompatibel dengan format REST API OpenAI.' : 'Use any self-hosted server or proxy gateway compatible with the standard OpenAI REST API specification.',
        },
      ].map((p) => (
        <div key={p.name} className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mb-4 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <span className="font-bold text-black dark:text-white font-mono text-base sm:text-lg">{p.name}</span>
            <span className="text-xs sm:text-sm font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2.5 py-0.5 rounded">{p.key}</span>
          </div>
          <p className="font-mono text-sm sm:text-base text-zinc-500">{p.models}</p>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">{p.desc}</p>
        </div>
      ))}

      <H2>{isId ? 'Contoh Konfigurasi .env Lengkap' : 'Complete .env Configuration Example'}</H2>
      <CodeBlock code={`# -----------------------------------------------------------
# Provider Selection:
# openai | claude | gemini | ollama | openrouter | groq | deepseek | custom
# -----------------------------------------------------------
PROVIDER=openai

# Primary Providers
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-3-5-sonnet-20241022

GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.0-flash

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1

# Third-Party: OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=deepseek/deepseek-r1

# Third-Party: Groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile

# Third-Party: DeepSeek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat

# Third-Party / Custom OpenAI-Compatible Endpoint
OPENAI_BASE_URL=https://api.your-provider.com/v1
CUSTOM_API_KEY=your-custom-key
CUSTOM_MODEL=your-model-name`} />
    </>
  );
}

function SkillsSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>Skills</H1>
      <P>
        {isId
          ? 'Skills adalah kemampuan domain spesifik yang dapat dipanggil agen. Terdaftar di knowledge base SQLite dan diinjeksi ke system prompt secara dinamis sesuai kebutuhan instruksi.'
          : 'Skills are domain-specific capabilities invokable by the agent. Registered in the SQLite knowledge base and dynamically injected into system prompts.'}
      </P>
      <Card
        title="Excel COM Automation"
        badge=".xlsx .xlsm"
        desc={isId
          ? 'Tulis sel presisi, evaluasi rumus dinamis, kloning sheet, dan ekspor ke PDF.'
          : 'Write precise cell coordinates, evaluate dynamic formulas, clone sheets, and export to PDF.'}
      />
      <Card
        title="Word Placeholder Fill"
        badge=".docx"
        desc={isId
          ? 'Ganti {{PLACEHOLDER}}, sisipkan tabel kontrak, pertahankan format asli dan style dokumen.'
          : 'Replace {{PLACEHOLDER}}, inject contract tables, and preserve original formatting.'}
      />
      <Card
        title="PowerPoint Deck"
        badge=".pptx"
        desc={isId
          ? 'Buat slide deck, modifikasi teks shape, format tata letak, dan ekspor PDF.'
          : 'Create slide decks, modify shape text, structure presentation layout, and export PDF.'}
      />
      <Card
        title="PDF Pipeline"
        badge="pdf-lib"
        desc={isId
          ? 'Merge berkas, watermark, ekstrak halaman tertentu, dan stempel e-Materai.'
          : 'Merge files, watermark, extract pages, and apply e-Materai stamps.'}
      />
      <Card
        title="PII Redaction"
        badge="doc_redact_pii"
        desc={isId
          ? 'Deteksi dan samarkan NIK, NPWP, nomor rekening perbankan, email, dan telepon.'
          : 'Detect and mask NIK, NPWP, banking account numbers, emails, and phone numbers.'}
      />
      <Card
        title="Version Redline Diff"
        badge="doc_compare_versions"
        desc={isId
          ? 'Komparasi dua versi dokumen dan hasilkan ringkasan tabel redline Markdown.'
          : 'Compare two doc versions and generate a Markdown redline diff summary.'}
      />
    </>
  );
}

function ToolsSection({ isId }: { isId: boolean }) {
  const groups = [
    { group: 'Excel',      tools: ['desktop_excel_edit', 'desktop_excel_read', 'desktop_excel_to_pdf', 'desktop_excel_clone_sheet'] },
    { group: 'Word',       tools: ['desktop_word_edit', 'desktop_word_read', 'desktop_word_to_pdf', 'desktop_word_insert_table'] },
    { group: 'PowerPoint', tools: ['desktop_ppt_edit', 'desktop_ppt_new', 'desktop_ppt_to_pdf'] },
    { group: 'PDF',        tools: ['pdf_merge', 'pdf_split', 'pdf_watermark', 'pdf_stamp_image', 'pdf_extract_text'] },
    { group: 'Document',   tools: ['doc_redact_pii', 'doc_compare_versions', 'doc_summarize', 'doc_translate'] },
    { group: 'Gateway',    tools: ['send_telegram', 'telegram_get_file', 'telegram_send_photo'] },
  ];
  return (
    <>
      <H1>Tools</H1>
      <P>
        {isId
          ? 'Arunaki menyediakan 50+ tool bawaan yang dapat dipanggil langsung dari konsol workstation atau pipeline agen. Setiap tool adalah fungsi TypeScript berparameter dengan validasi tipe skema penuh.'
          : 'Arunaki provides 50+ built-in tools callable directly from the workstation console or agent pipelines. Each tool is a fully typed TypeScript function with schema parameter validation.'}
      </P>
      <div className="space-y-6 sm:space-y-7">
        {groups.map((g) => (
          <div key={g.group}>
            <h3 className="text-sm sm:text-base font-mono font-bold text-zinc-400 mb-3">{g.group}</h3>
            <div className="flex flex-wrap gap-2.5">
              {g.tools.map((t) => (
                <code key={t} className="text-sm sm:text-base font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded">
                  {t}
                </code>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProvidersSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>{isId ? 'Konfigurasi Provider' : 'Providers Configuration'}</H1>
      <P>
        {isId
          ? 'Arunaki menggunakan arsitektur LLM Router. Ganti provider AI hanya dengan satu baris di file .env tanpa perlu menyentuh kode.'
          : 'Arunaki uses an LLM Router architecture. Switch AI providers with a single line in your .env file without changing any code.'}
      </P>
      
      <H2>OpenAI</H2>
      <CodeBlock code={`PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o`} />

      <H2>Anthropic Claude</H2>
      <CodeBlock code={`PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-3-5-sonnet-20241022`} />

      <H2>Google Gemini</H2>
      <CodeBlock code={`PROVIDER=gemini
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.0-flash`} />

      <H2>Ollama (Local)</H2>
      <P>
        {isId
          ? 'Jalankan LLM secara lokal tanpa koneksi internet atau API key eksternal. Pastikan Ollama telah terinstal.'
          : 'Run LLMs completely locally with no internet or external API keys. Make sure Ollama is installed.'}
      </P>
      <CodeBlock code={`PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1

# Download model:
# ollama pull llama3.1`} />

      <H2>{isId ? 'Third-Party: OpenRouter (Multi-Model Agregator)' : 'Third-Party: OpenRouter (Multi-Model Aggregator)'}</H2>
      <P>
        {isId
          ? 'Akses model seperti DeepSeek R1, Llama 3.3, dan Claude via gateway OpenRouter.'
          : 'Access models like DeepSeek R1, Llama 3.3, and Claude via the OpenRouter gateway.'}
      </P>
      <CodeBlock code={`PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=deepseek/deepseek-r1`} />

      <H2>{isId ? 'Third-Party: Groq (Kecepatan Ekstrem LPU)' : 'Third-Party: Groq (Ultra-Fast LPU Inference)'}</H2>
      <CodeBlock code={`PROVIDER=groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile`} />

      <H2>{isId ? 'Third-Party: DeepSeek Resmi' : 'Third-Party: Official DeepSeek'}</H2>
      <CodeBlock code={`PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat`} />

      <H2>{isId ? 'Custom OpenAI-Compatible Endpoint' : 'Custom OpenAI-Compatible Endpoint'}</H2>
      <P>
        {isId
          ? 'Koneksikan ke server mandiri (vLLM, LM Studio, Together AI, Mistral API, atau gateway enterprise).'
          : 'Connect to self-hosted servers (vLLM, LM Studio, Together AI, Mistral API, or enterprise proxy gateways).'}
      </P>
      <CodeBlock code={`PROVIDER=custom
OPENAI_BASE_URL=https://api.your-provider.com/v1
CUSTOM_API_KEY=your-api-key
CUSTOM_MODEL=your-model-name`} />
    </>
  );
}

function GatewaySection({ isId }: { isId: boolean }) {
  const apps = [
    {
      name: 'Telegram',
      status: 'available' as const,
      desc: isId
        ? 'Kirim perintah, unggah dokumen kerja, dan terima file hasil langsung dari chat Telegram.'
        : 'Send instructions, upload documents, and receive processed outputs directly in Telegram chat.',
    },
    {
      name: 'WhatsApp',
      status: 'coming_soon' as const,
      desc: isId
        ? 'Gateway WhatsApp via integrasi Baileys / Cloud API untuk interaksi dokumen via chat personal dan grup.'
        : 'WhatsApp gateway via Baileys / Cloud API integration for personal and group document automation.',
    },
    {
      name: 'Discord',
      status: 'coming_soon' as const,
      desc: isId
        ? 'Bot interaktif untuk server Discord tim dengan slash commands dan kanal dokumen khusus.'
        : 'Interactive bot for team Discord servers with slash commands and dedicated channels.',
    },
    {
      name: 'Slack',
      status: 'coming_soon' as const,
      desc: isId
        ? 'Aplikasi Slack Workspace untuk otomasi alur kerja approval dokumen kantor dan laporan harian.'
        : 'Slack Workspace app for enterprise document approval workflows and automated daily reports.',
    },
    {
      name: 'LINE',
      status: 'coming_soon' as const,
      desc: isId
        ? 'Integrasi LINE Messaging API dengan rich menu dan webhook respon dokumen.'
        : 'LINE Messaging API integration with rich menus and document response webhooks.',
    },
  ];

  return (
    <>
      <H1>App Gateway</H1>
      <P>
        {isId
          ? 'Arunaki dapat diakses secara remote melalui App Gateway pesan instan. Saat ini Telegram telah tersedia penuh, sementara aplikasi lainnya sedang dipersiapkan.'
          : 'Arunaki can be controlled remotely via messaging app gateways. Currently Telegram is fully available, with additional platforms in active development.'}
      </P>

      <H2>{isId ? 'Status Integrasi Aplikasi' : 'App Integration Status'}</H2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {apps.map((app) => (
          <div
            key={app.name}
            className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-black dark:text-white font-mono text-base sm:text-lg">{app.name}</span>
              {app.status === 'available' ? (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono px-2.5 py-0.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isId ? 'Tersedia' : 'Available'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                  <Clock className="w-3.5 h-3.5" />
                  {isId ? 'Segera Hadir' : 'Coming Soon'}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">{app.desc}</p>
          </div>
        ))}
      </div>

      <H2>{isId ? 'Setup Gateway Telegram' : 'Telegram Gateway Setup'}</H2>
      <P>
        {isId
          ? 'Daftarkan bot baru via @BotFather di Telegram, lalu masukkan token dan Chat ID ke file .env:'
          : 'Register a new bot via @BotFather on Telegram, then configure token and Chat ID in your .env:'}
      </P>
      <CodeBlock code={`# .env
TELEGRAM_BOT_TOKEN=123456789:AAF...
TELEGRAM_ALLOWED_CHAT_IDS=123456789`} />

      <H2>{isId ? 'Perintah Bot' : 'Bot Commands'}</H2>
      <div className="space-y-3 mb-8">
        {[
          { cmd: '/start',          desc: isId ? 'Mulai sesi interaksi agen' : 'Start agent session' },
          { cmd: '/help',           desc: isId ? 'Daftar perintah yang tersedia' : 'List available commands' },
          { cmd: '/status',         desc: isId ? 'Cek status model dan sandbox workspace' : 'Check model and workspace sandbox status' },
          { cmd: '/process [file]', desc: isId ? 'Jalankan instruksi otomasi pada berkas' : 'Run automated processing on document' },
          { cmd: '/redact [file]',  desc: isId ? 'Samarkan data pribadi PII pada dokumen' : 'Redact PII from document' },
        ].map((c) => (
          <div key={c.cmd} className="flex items-start gap-3.5 text-base">
            <Code>{c.cmd}</Code>
            <span className="text-zinc-600 dark:text-zinc-400 font-sans text-sm sm:text-base leading-relaxed pt-0.5">{c.desc}</span>
          </div>
        ))}
      </div>

      <H2>{isId ? 'Contoh Tool Gateway' : 'Gateway Tool Examples'}</H2>
      <CodeBlock code={`send_telegram(chat_id, file: "report.pdf", caption: "Done")
telegram_get_file(file_id)
telegram_send_photo(chat_id, image_path)`} />
    </>
  );
}

function DownloadSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>{isId ? 'Unduh Arunaki' : 'Download Arunaki'}</H1>
      <P>
        {isId
          ? 'Paket biner resmi Arunaki untuk Windows dan macOS. Workstation desktop native ini sedang dalam persiapan rilis biner.'
          : 'Official Arunaki binary packages for Windows and macOS. The native desktop workstation is in active preparation for release.'}
      </P>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {[
          { title: 'Windows Setup', file: 'Arunaki-Setup-x64.exe', badge: isId ? 'Direkomendasikan' : 'Recommended' },
          { title: 'Windows Portable', file: 'Arunaki-Portable.zip', badge: isId ? 'Portabel' : 'Standalone' },
          { title: 'macOS Universal', file: 'Arunaki-Universal.dmg', badge: 'Universal' },
        ].map((p) => (
          <div key={p.title} className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3.5">
            <div>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mb-1.5">{p.badge}</p>
              <p className="font-bold text-black dark:text-white font-mono text-base sm:text-lg">{p.title}</p>
              <p className="font-mono text-xs sm:text-sm text-zinc-500 mt-1">{p.file}</p>
            </div>
            <button disabled className="w-full py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-mono text-xs sm:text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              {isId ? 'Segera Hadir' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>
      <H2>{isId ? 'Jalankan dari Source Code' : 'Run from Source Code'}</H2>
      <CodeBlock code={`# 1. Clone repository
git clone https://github.com/jlsrngo/Arunaki.git && cd Arunaki

# 2. Install dependencies (Bun)
bun install

# 3. Start Electron workstation harness
npm run dev`} />
      <a
        href="https://github.com/jlsrngo/Arunaki"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-mono text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" />
        {isId ? 'Lihat Repositori di GitHub' : 'View Repository on GitHub'}
      </a>
    </>
  );
}

// -----------------------------------------------------------------------------
// MAIN PAGE
// -----------------------------------------------------------------------------
export default function ArunakiDocsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isId = locale === 'id';

  const [active, setActive] = useState<SectionId>('intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getLabel = (item: { en: string; id_: string }) => (isId ? item.id_ : item.en);

  const currentLabel = navGroups
    .flatMap((g) => g.items)
    .find((i) => i.id === active);

  const renderSection = () => {
    switch (active) {
      case 'intro':     return <IntroSection isId={isId} />;
      case 'agents':    return <AgentsSection isId={isId} />;
      case 'models':    return <ModelsSection isId={isId} />;
      case 'skills':    return <SkillsSection isId={isId} />;
      case 'tools':     return <ToolsSection isId={isId} />;
      case 'providers': return <ProvidersSection isId={isId} />;
      case 'gateway':   return <GatewaySection isId={isId} />;
      case 'download':  return <DownloadSection isId={isId} />;
    }
  };

  const SidebarContent = () => (
    <nav className="space-y-1 font-mono">
      {navGroups.map((g) => (
        <div key={g.group ?? 'top'}>
          {g.group && (
            <div className="pt-5 pb-2 px-3">
              <span className="text-xs sm:text-sm font-mono font-bold text-zinc-400 tracking-wider">{g.group}</span>
            </div>
          )}
          {g.items.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 rounded-md transition-colors font-mono text-base ${
                active === item.id
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-bold'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              {getLabel(item)}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors font-sans antialiased flex flex-col overflow-hidden">
      <ArunakiNavbar locale={locale} />

      {/* Mobile top bar */}
      <div className="fixed top-16 left-0 right-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md px-4 py-2.5 flex items-center gap-3 lg:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-base font-mono font-medium text-zinc-500">{currentLabel ? getLabel(currentLabel) : ''}</span>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 dark:bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 overflow-hidden w-full max-w-6xl mx-auto sm:px-6">
        {/* Sidebar */}
        <aside
          className={`fixed lg:relative top-16 lg:top-auto left-0 z-40 lg:z-auto w-56 sm:w-60 shrink-0
            bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800
            h-[calc(100vh-64px)] lg:h-full overflow-y-auto
            pt-14 lg:pt-8 px-2 pb-10
            transition-transform duration-200 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <SidebarContent />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-5 sm:px-10 pt-28 lg:pt-8 pb-10 overflow-y-auto">
          <div className="flex items-center gap-2 text-base font-mono text-zinc-400 mb-8">
            <Link href="/arunaki" className="hover:underline">arunaki</Link>
            <span>/</span>
            <span className="text-black dark:text-white font-medium">{active}</span>
          </div>
          {renderSection()}
        </main>
      </div>

      <ArunakiFooter locale={locale} />
    </div>
  );
}
