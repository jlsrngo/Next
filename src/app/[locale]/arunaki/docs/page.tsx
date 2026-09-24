'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ArunakiNavbar from '@/components/ArunakiNavbar';
import ArunakiFooter from '@/components/ArunakiFooter';
import { Link } from '@/i18n/navigation';
import { Menu, X, ChevronRight, Clock, Download } from 'lucide-react';
import type { Metadata } from 'next';

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
      { id: 'intro' as SectionId,    en: 'Intro',      id_: 'Pendahuluan' },
    ],
  },
  {
    group: 'CONFIGURE',
    items: [
      { id: 'agents' as SectionId,    en: 'Agents',     id_: 'Agents' },
      { id: 'models' as SectionId,    en: 'Models',     id_: 'Model' },
      { id: 'skills' as SectionId,    en: 'Skills',     id_: 'Skills' },
      { id: 'tools' as SectionId,     en: 'Tools',      id_: 'Tools' },
      { id: 'providers' as SectionId, en: 'Providers',  id_: 'Provider' },
      { id: 'gateway' as SectionId,  en: 'App Gateway', id_: 'App Gateway' },
      { id: 'download' as SectionId,  en: 'Download',   id_: 'Unduh' },
    ],
  },
];

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded">
      {children}
    </code>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto my-4 leading-relaxed">
      {code}
    </pre>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl sm:text-4xl font-bold font-sans text-black dark:text-white mb-4">{children}</h1>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl sm:text-2xl font-bold font-sans text-black dark:text-white mt-8 mb-3">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans mb-4">{children}</p>;
}

function Card({ title, badge, desc }: { title: string; badge?: string; desc: string }) {
  return (
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1.5 mb-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-black dark:text-white font-sans text-sm">{title}</span>
        {badge && (
          <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans">{desc}</p>
    </div>
  );
}

// â”€â”€â”€ SECTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function IntroSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>{isId ? 'Pendahuluan' : 'Intro'}</H1>
      <P>
        {isId
          ? 'Arunaki adalah workstation agen dokumen desktop open-source yang berjalan sepenuhnya lokal dan sandboxed. Tidak ada data yang dikirim ke cloud.'
          : 'Arunaki is an open-source desktop document agent workstation that runs fully local and sandboxed. No data is ever sent to the cloud.'}
      </P>
      <P>
        {isId
          ? 'Agen mengotomasi dokumen Microsoft Office, mengelola pipeline PDF, menyamarkan data sensitif PII, dan berinteraksi via chat atau Telegram Bot â€” semuanya dari mesin lokal Anda.'
          : 'The agent automates Microsoft Office documents, manages PDF pipelines, redacts PII sensitive data, and interacts via chat or Telegram Bot â€” all from your local machine.'}
      </P>
      <H2>{isId ? 'Antarmuka yang tersedia' : 'Available interfaces'}</H2>
      <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans mb-6">
        {[
          { label: 'Desktop App', desc: isId ? 'Aplikasi Windows (Bun runtime)' : 'Windows desktop app (Bun runtime)' },
          { label: 'Web UI',      desc: isId ? 'Antarmuka web di localhost' : 'Web interface on localhost' },
          { label: 'Telegram Bot',desc: isId ? 'Kontrol agen via Telegram chat' : 'Control the agent via Telegram chat' },
        ].map((i) => (
          <li key={i.label} className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400" />
            <span><strong className="text-black dark:text-white">{i.label}</strong> â€” {i.desc}</span>
          </li>
        ))}
      </ul>
      <H2>{isId ? 'Arsitektur sistem' : 'System architecture'}</H2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {['01. UI Layer', '02. Agent Core', '03. Tool Registry', '04. COM Adapters', '05. Sandbox', '06. Knowledge DB'].map((s) => (
          <div key={s} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-mono text-zinc-600 dark:text-zinc-400 text-center">
            {s}
          </div>
        ))}
      </div>
      <H2>{isId ? 'Teknologi inti' : 'Core stack'}</H2>
      <div className="flex flex-wrap gap-2">
        {['Bun', 'TypeScript', 'SQLite (Prisma)', 'pdf-lib', 'mammoth', 'COM Automation', 'Telegram Bot API'].map((t) => (
          <span key={t} className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2.5 py-1 rounded">
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
      <P>{isId
        ? 'Arunaki menggunakan sistem multi-agent di mana setiap agen menangani tugas domain tertentu. Agen beroperasi secara headless dan dapat dirantai melalui pipeline.'
        : 'Arunaki uses a multi-agent system where each agent handles a specific domain task. Agents operate headlessly and can be chained through pipelines.'}</P>
      <H2>{isId ? 'Jenis agen' : 'Agent types'}</H2>
      <Card title="DocumentAgent" badge="com-worker" desc={isId ? 'Otomasi Microsoft Office (Excel, Word, PowerPoint) via COM headless.' : 'Automates Microsoft Office (Excel, Word, PowerPoint) via headless COM.'} />
      <Card title="PdfAgent"      badge="pdf-lib"    desc={isId ? 'Pipeline PDF: merge, watermark, ekstraksi halaman, stempel e-Materai.' : 'PDF pipelines: merge, watermark, page extraction, e-Materai stamp.'} />
      <Card title="RedactAgent"   badge="pii-masker" desc={isId ? 'Deteksi & samarkan PII (NIK, NPWP, rekening, email) otomatis.' : 'Auto-detects and masks PII (NIK, NPWP, bank accounts, emails).'} />
      <Card title="TelegramAgent" badge="bot-api"    desc={isId ? 'Terima perintah & kirim hasil dokumen via messaging app gateway.' : 'Receives commands and delivers document results via messaging app gateway.'} />
      <H2>{isId ? 'Konfigurasi' : 'Configuration'}</H2>
      <CodeBlock code={`// agent.config.ts
export const agents = {
  document: { enabled: true, comTimeout: 30000 },
  pdf:      { enabled: true, maxPageSize: '50MB' },
  redact:   { enabled: true, targets: ['NIK', 'NPWP', 'BANK'] },
  telegram: { enabled: true, token: process.env.TELEGRAM_BOT_TOKEN },
};`} />
    </>
  );
}

function ModelsSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>{isId ? 'Model' : 'Models'}</H1>
      <P>{isId
        ? 'Arunaki mendukung berbagai penyedia LLM. Model dapat dikonfigurasi per agen atau per tugas hanya via .env â€” tanpa mengubah kode.'
        : 'Arunaki supports multiple LLM providers. Models can be configured per agent or task via .env only â€” no code changes needed.'}</P>
      <H2>{isId ? 'Provider yang didukung' : 'Supported providers'}</H2>
      {[
        { name: 'OpenAI',           models: 'gpt-4o, gpt-4o-mini, gpt-4-turbo',     key: 'OPENAI_API_KEY' },
        { name: 'Anthropic Claude', models: 'claude-3-5-sonnet, claude-3-haiku',    key: 'ANTHROPIC_API_KEY' },
        { name: 'Google Gemini',    models: 'gemini-2.0-flash, gemini-1.5-pro',     key: 'GEMINI_API_KEY' },
        { name: 'Ollama (Local)',   models: 'llama3, mistral, phi3, qwen2',         key: isId ? 'Tanpa API key' : 'No API key' },
      ].map((p) => (
        <div key={p.name} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mb-3 space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-black dark:text-white font-sans text-sm">{p.name}</span>
            <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 px-2 py-0.5 rounded">{p.key}</span>
          </div>
          <p className="font-mono text-xs text-zinc-500">{p.models}</p>
        </div>
      ))}
      <CodeBlock code={`# .env
PROVIDER=openai           # openai | claude | gemini | ollama
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
OLLAMA_BASE_URL=http://localhost:11434`} />
    </>
  );
}

function SkillsSection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>Skills</H1>
      <P>{isId
        ? 'Skills adalah kemampuan domain spesifik yang dapat dipanggil agen. Terdaftar di knowledge base SQLite dan diinjeksi ke system prompt secara dinamis.'
        : 'Skills are domain-specific capabilities invokable by the agent. Registered in SQLite knowledge base and dynamically injected into system prompts.'}</P>
      <Card title="Excel COM Automation"  badge=".xlsx .xlsm"          desc={isId ? 'Tulis sel presisi, evaluasi rumus, kloning sheet, ekspor PDF.' : 'Write precise cells, evaluate formulas, clone sheets, export PDF.'} />
      <Card title="Word Placeholder Fill" badge=".docx"                desc={isId ? 'Ganti {{PLACEHOLDER}}, sisipkan tabel, pertahankan format asli.' : 'Replace {{PLACEHOLDER}}, inject tables, retain original formatting.'} />
      <Card title="PowerPoint Deck"       badge=".pptx"                desc={isId ? 'Buat slide deck, modifikasi shape text, ekspor PDF.' : 'Create slide decks, modify shape text, export PDF.'} />
      <Card title="PDF Pipeline"          badge="pdf-lib"              desc={isId ? 'Merge, watermark, ekstrak halaman, stempel e-Materai.' : 'Merge, watermark, extract pages, apply e-Materai stamp.'} />
      <Card title="PII Redaction"         badge="doc_redact_pii"       desc={isId ? 'Deteksi & samarkan NIK, NPWP, rekening, email, telepon.' : 'Detect & mask NIK, NPWP, bank accounts, emails, phones.'} />
      <Card title="Version Redline Diff"  badge="doc_compare_versions" desc={isId ? 'Komparasi dua versi dokumen, hasilkan tabel redline Markdown.' : 'Compare two doc versions, output Markdown redline table.'} />
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
    { group: 'gateway',   tools: ['send_telegram', 'telegram_get_file', 'telegram_send_photo'] },
  ];
  return (
    <>
      <H1>Tools</H1>
      <P>{isId
        ? 'Arunaki menyediakan 50+ tool yang dapat dipanggil langsung dari chat atau pipeline agen. Setiap tool adalah fungsi TypeScript berparameter dengan validasi tipe penuh.'
        : 'Arunaki provides 50+ tools callable directly from chat or agent pipelines. Each tool is a fully typed TypeScript function with parameter validation.'}</P>
      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.group}>
            <h3 className="text-xs font-sans font-semibold text-zinc-400 mb-2">{g.group}</h3>
            <div className="flex flex-wrap gap-2">
              {g.tools.map((t) => (
                <code key={t} className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded">
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
      <H1>Providers</H1>
      <P>{isId
        ? 'Arunaki menggunakan arsitektur LLM Router. Ganti provider AI hanya dengan satu baris di .env â€” tanpa mengubah kode apapun.'
        : 'Arunaki uses an LLM Router architecture. Switch AI providers with just one line in .env â€” no code changes required.'}</P>
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
      <P>{isId
        ? 'Jalankan LLM secara lokal tanpa internet atau API key. Install Ollama terlebih dahulu.'
        : 'Run LLMs locally with no internet or API key. Install Ollama first.'}</P>
      <CodeBlock code={`PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1

# Pull model:
# ollama pull llama3.1`} />
    </>
  );
}

function GatewaySection({ isId }: { isId: boolean }) {
  return (
    <>
      <H1>App Gateway</H1>
      <P>{isId
        ? 'Arunaki dapat dikendalikan sepenuhnya via messaging app gateways (e.g. Telegram). Kirim perintah teks, unggah file, terima dokumen hasil â€” tanpa membuka antarmuka desktop.'
        : 'Arunaki can be fully controlled via messaging app gateways (e.g. Telegram). Send text commands, upload files, receive processed results â€” without opening the desktop UI.'}</P>
      <H2>{isId ? 'Setup' : 'Setup'}</H2>
      <P>{isId ? 'Buat bot via @BotFather di Telegram, salin token ke .env.' : 'Create a bot via @BotFather on Telegram, copy the token to .env.'}</P>
      <CodeBlock code={`# .env
TELEGRAM_BOT_TOKEN=123456789:AAF...
TELEGRAM_ALLOWED_CHAT_IDS=123456789`} />
      <H2>{isId ? 'Perintah' : 'Commands'}</H2>
      <div className="space-y-2 mb-6">
        {[
          { cmd: '/start',          desc: isId ? 'Mulai sesi' : 'Start session' },
          { cmd: '/help',           desc: isId ? 'Daftar perintah' : 'Command list' },
          { cmd: '/status',         desc: isId ? 'Status agen & model' : 'Agent & model status' },
          { cmd: '/process [file]', desc: isId ? 'Proses dokumen' : 'Process document' },
          { cmd: '/redact [file]',  desc: isId ? 'Samarkan PII' : 'Redact PII' },
        ].map((c) => (
          <div key={c.cmd} className="flex items-start gap-3 text-sm">
            <Code>{c.cmd}</Code>
            <span className="text-zinc-600 dark:text-zinc-400 font-sans">{c.desc}</span>
          </div>
        ))}
      </div>
      <H2>{isId ? 'Contoh tool' : 'Tool examples'}</H2>
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
      <P>{isId
        ? 'Paket biner resmi Arunaki untuk Windows dan macOS. Semua installer sedang dalam pengembangan aktif.'
        : 'Official Arunaki binary packages for Windows and macOS. All installers are in active development.'}</P>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { title: 'Windows Setup', file: 'Arunaki-Setup-x64.exe', badge: isId ? 'Direkomendasikan' : 'Recommended' },
          { title: 'Windows Portable', file: 'Arunaki-Portable.zip', badge: isId ? 'Portabel' : 'Standalone' },
          { title: 'macOS Universal', file: 'Arunaki-Universal.dmg', badge: 'Universal' },
        ].map((p) => (
          <div key={p.title} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
            <div>
              <p className="text-xs text-zinc-400 font-sans mb-1">{p.badge}</p>
              <p className="font-semibold text-black dark:text-white font-sans text-sm">{p.title}</p>
              <p className="font-mono text-xs text-zinc-500 mt-0.5">{p.file}</p>
            </div>
            <button disabled className="w-full py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-sans text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              {isId ? 'Segera Hadir' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>
      <H2>{isId ? 'Dari Source Code' : 'From Source Code'}</H2>
      <CodeBlock code={`# 1. Clone repository
git clone https://github.com/jlsrngo/Arunaki.git && cd Arunaki

# 2. Install dependencies (Bun)
bun install

# 3. Start workstation
npm run dev`} />
      <a
        href="https://github.com/jlsrngo/Arunaki"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-sans text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" />
        {isId ? 'Lihat di GitHub' : 'View on GitHub'}
      </a>
    </>
  );
}

// â”€â”€â”€ PAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ArunakiDocsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isId = locale === 'id';

  const [active, setActive] = useState<SectionId>('intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getLabel = (item: { en: string; id_: string }) => isId ? item.id_ : item.en;

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
      case 'gateway':  return <GatewaySection isId={isId} />;
      case 'download':  return <DownloadSection isId={isId} />;
    }
  };

  const SidebarContent = () => (
    <nav className="space-y-0.5 text-sm font-sans">
      {navGroups.map((g) => (
        <div key={g.group ?? 'top'}>
          {g.group && (
            <div className="pt-4 pb-1.5 px-3">
              <span className="text-[11px] font-semibold text-zinc-400 tracking-widest">{g.group}</span>
            </div>
          )}
          {g.items.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                active === item.id
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-semibold'
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
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors font-sans antialiased flex flex-col">
      <ArunakiNavbar locale={locale} />

      {/* Mobile top bar */}
      <div className="fixed top-16 left-0 right-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md px-4 py-2.5 flex items-center gap-3 lg:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-medium text-zinc-500">{currentLabel ? getLabel(currentLabel) : ''}</span>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 dark:bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 w-full max-w-5xl mx-auto sm:px-6">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-40 lg:z-auto w-52 shrink-0
            bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800
            h-[calc(100vh-64px)] overflow-y-auto
            pt-14 lg:pt-8 px-2 pb-10
            transition-transform duration-200 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <SidebarContent />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 pt-28 lg:pt-8 pb-20">
          <div className="flex items-center gap-2 text-sm font-sans text-zinc-400 mb-6">
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



