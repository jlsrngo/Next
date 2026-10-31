import React from 'react';
import { useTranslations } from 'next-intl';
import { useContactData } from '../hooks/useContactData';
import ContactCard from '../components/ContactCard';
import CornerCrosses from '@/components/ui/CornerCrosses';

export default function ContactOrchestrator() {
  const t = useTranslations();
  const { socialLinks } = useContactData();

  const featuredLinks = socialLinks.filter(l => l.is_featured);
  const otherLinks = socialLinks.filter(l => !l.is_featured);

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Top Header */}
      <div className="border-b border-black dark:border-white pb-4 animate-fade-in">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-black/70 dark:text-white/70 mb-1">
          [ 06 // TRANSMISSION & NETWORK ]
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
          {t('contact.title') || 'Contact'}
        </h1>
        <p className="text-sm sm:text-base text-black/70 dark:text-white/70 mt-1">
          {t('contact.find_me') || 'Find me on social media and professional networks.'}
        </p>
      </div>

      {/* Featured Direct Cards */}
      <div className="space-y-5">
        {featuredLinks.map((link, i) => (
          <ContactCard key={link.id} link={link} index={i} isFull />
        ))}
      </div>

      {/* Other Channels Grid */}
      {otherLinks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {otherLinks.map((link, i) => (
            <ContactCard key={link.id} link={link} index={featuredLinks.length + i} />
          ))}
        </div>
      )}

      {socialLinks.length === 0 && (
        <div className="relative border border-black dark:border-white bg-[#faf9f7] dark:bg-[#101014] p-10 text-center">
          <CornerCrosses />
          <p className="font-mono text-xs uppercase font-bold text-black/70 dark:text-white/70">
            {t('common.no_data') || 'No contact channels available.'}
          </p>
        </div>
      )}
    </div>
  );
}
