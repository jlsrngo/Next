import { useState, useEffect, useMemo, useCallback } from 'react';
import { achievementsService } from '@/services/api';
import type { AchievementItemRecord } from '../components/AchievementAdminCard';
import type { AdminFeedbackState } from '../components/AdminFeedbackBanner';

export function useAdminAchievements() {
  const [achievements, setAchievements] = useState<AchievementItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchAchievements = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await achievementsService.getAchievements();
      if (signal?.aborted) return;
      setAchievements(Array.isArray(data) ? (data as AchievementItemRecord[]) : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error('[AdminAchievements] Fetch error:', err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAchievements(controller.signal);
    return () => controller.abort();
  }, [fetchAchievements]);

  const handleDelete = useCallback(
    async (id: string | number, title: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete achievement "${title}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        await achievementsService.deleteAchievement(id);
        setFeedback({ type: 'success', message: `Achievement "${title}" deleted from registry.` });
        await fetchAchievements();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed.';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchAchievements]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return achievements;
    return achievements.filter((a) => {
      return (
        a.title?.toLowerCase().includes(q) ||
        a.issuer?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
      );
    });
  }, [achievements, search]);

  return {
    achievements,
    filtered,
    loading,
    search,
    setSearch,
    feedback,
    setFeedback,
    deletingId,
    fetchAchievements,
    handleDelete,
  };
}

export default useAdminAchievements;
