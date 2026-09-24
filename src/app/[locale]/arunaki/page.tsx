import { getMessages } from 'next-intl/server';
import ArunakiClient from './arunaki-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arunaki | The Desktop Document Agent Workstation & Automation Harness',
  description: 'Native desktop computer-use for Microsoft Excel spreadsheets, Word contracts, PowerPoint decks, PDF pipelines, and financial ledgers.',
};

export default async function ArunakiPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return <ArunakiClient locale={locale} />;
}
