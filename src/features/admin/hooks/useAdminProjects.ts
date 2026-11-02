import { useState, useEffect, useMemo, useCallback } from 'react';
import { projectsService } from '@/services/api';
import { useLocale } from '@/context/I18nContext';
import { localizeProject } from '@/lib/localize';
import type { Project } from '@/types/project.types';
import type { AdminFeedbackState } from '../components/AdminFeedbackBanner';

export type FilterType = 'all' | 'featured' | 'normal';

export function useAdminProjects() {
  const locale = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<FilterType>('all');
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchProjects = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await projectsService.getProjects();
      if (signal?.aborted) return;
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      const message = err instanceof Error ? err.message : 'Failed to synchronize projects';
      console.error('[AdminProjects] Fetch error:', message);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, [fetchProjects]);

  const getTechArray = useCallback((p: Project): string[] => {
    const val = p.techStack ?? p.tech_stack;
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return String(val)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, []);

  const handleDelete = useCallback(
    async (id: string | number, title: string) => {
      if (!window.confirm(`CONFIRMATION: Permanently delete project "${title}"?`)) {
        return;
      }

      setDeletingId(id);
      try {
        await projectsService.deleteProject(id);
        setFeedback({ type: 'success', message: `Project "${title}" deleted from registry.` });
        await fetchProjects();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Deletion failed';
        setFeedback({ type: 'error', message });
      } finally {
        setDeletingId(null);
      }
    },
    [fetchProjects]
  );

  const localizedProjects = useMemo(() => {
    return projects.map((p) => localizeProject(p, locale));
  }, [projects, locale]);

  const counts = useMemo(
    () => ({
      all: localizedProjects.length,
      featured: localizedProjects.filter((p) => p.featured).length,
      normal: localizedProjects.filter((p) => !p.featured).length,
    }),
    [localizedProjects]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return localizedProjects.filter((p) => {
      const techList = getTechArray(p);
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        techList.some((t) => t.toLowerCase().includes(query));

      if (!matchesSearch) return false;
      if (filterFeatured === 'featured') return p.featured;
      if (filterFeatured === 'normal') return !p.featured;
      return true;
    });
  }, [localizedProjects, search, filterFeatured, getTechArray]);

  return {
    projects: localizedProjects,
    filtered,
    loading,
    search,
    setSearch,
    filterFeatured,
    setFilterFeatured,
    counts,
    feedback,
    setFeedback,
    deletingId,
    fetchProjects,
    handleDelete,
    getTechArray,
  };
}

export default useAdminProjects;
