import { useState, useEffect, useCallback } from 'react';
import { socialLinksService } from '@/services/api';
import type { SocialLinkItemRecord } from '../components/SocialLinkAdminCard';
import type { AdminFeedbackState } from '../components/AdminFeedbackBanner';

export function useAdminSocialLinks() {
  const [links, setLinks] = useState<SocialLinkItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchLinks = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await socialLinksService.getSocialLinks();
      if (signal?.aborted) return;
      setLinks(Array.isArray(data) ? (data as SocialLinkItemRecord[]) : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error('[AdminSocialLinks] Fetch error:', err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchLinks(controller.signal);
    return () => controller.abort();
  }, [fetchLinks]);

  const handleDelete = useCallback(
    async (id: string | number, name: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete relay channel "${name}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        await socialLinksService.deleteSocialLink(id);
        setFeedback({ type: 'success', message: `Relay channel deleted.` });
        await fetchLinks();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed.';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchLinks]
  );

  return {
    links,
    loading,
    feedback,
    setFeedback,
    deletingId,
    fetchLinks,
    handleDelete,
  };
}

export default useAdminSocialLinks;
