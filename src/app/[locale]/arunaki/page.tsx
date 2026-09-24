import ArunakiClient from './arunaki-client';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isId = params.locale === 'id';
  return {
    title: isId
      ? 'Arunaki | Workstation Agen Dokumen Desktop & Otomasi Sandboxed'
      : 'Arunaki | The Desktop Document Agent Workstation & Automation Harness',
    description: isId
      ? 'Otomasi dokumen komputer lokal untuk Microsoft Excel, kontrak Word, presentasi PowerPoint, pipeline PDF, dan pembukuan finansial.'
      : 'Native desktop computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers.',
  };
}

export default async function ArunakiPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return <ArunakiClient locale={locale} />;
}
