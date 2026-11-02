import { useState, useEffect, useCallback } from 'react';
import { aboutService } from '@/services/api';
import type { ExperienceItemRecord } from '../components/ExperienceAdminCard';
import type { AdminFeedbackState } from '../components/AdminFeedbackBanner';

export function useAdminExperiences() {
  const [experiences, setExperiences] = useState<ExperienceItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchExperiences = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await aboutService.getAboutData();
      if (signal?.aborted) return;
      setExperiences(Array.isArray(data?.experiences) ? (data.experiences as ExperienceItemRecord[]) : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error('[AdminExperiences] Fetch error:', err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchExperiences(controller.signal);
    return () => controller.abort();
  }, [fetchExperiences]);

  const handleDelete = useCallback(
    async (id: string | number, name: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete experience at "${name}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        await aboutService.deleteExperience(id);
        setFeedback({ type: 'success', message: `Experience at "${name}" deleted.` });
        await fetchExperiences();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed.';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchExperiences]
  );

  return {
    experiences,
    loading,
    feedback,
    setFeedback,
    deletingId,
    fetchExperiences,
    handleDelete,
  };
}

export default useAdminExperiences;
