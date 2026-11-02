import { useState, useEffect, useCallback } from 'react';
import { aboutService } from '@/services/api';
import type { EducationItemRecord } from '../components/EducationAdminCard';
import type { AdminFeedbackState } from '../components/AdminFeedbackBanner';

export function useAdminEducation() {
  const [education, setEducation] = useState<EducationItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchEducation = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await aboutService.getAboutData();
      if (signal?.aborted) return;
      setEducation(Array.isArray(data?.educations) ? (data.educations as EducationItemRecord[]) : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error('[AdminEducation] Fetch error:', err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchEducation(controller.signal);
    return () => controller.abort();
  }, [fetchEducation]);

  const handleDelete = useCallback(
    async (id: string | number, name: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete education record at "${name}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        await aboutService.deleteEducation(id);
        setFeedback({ type: 'success', message: `Education record deleted.` });
        await fetchEducation();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed.';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchEducation]
  );

  return {
    education,
    loading,
    feedback,
    setFeedback,
    deletingId,
    fetchEducation,
    handleDelete,
  };
}

export default useAdminEducation;
