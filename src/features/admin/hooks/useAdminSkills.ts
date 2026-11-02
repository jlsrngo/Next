import { useState, useEffect, useMemo, useCallback } from 'react';
import { skillsService } from '@/services/api';
import { techList } from '@/lib/techList';
import { getCategoryForSlug, filterByCategory } from '@/lib/techCategories';
import type { AdminFeedbackState } from '../components/AdminFeedbackBanner';

export interface SkillRecord {
  id?: string | number;
  name?: string;
  iconName?: string;
  icon?: string;
  category?: string;
}

export function useAdminSkills() {
  const [dbSkills, setDbSkills] = useState<SkillRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  const fetchSkills = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await skillsService.getSkills();
      if (signal?.aborted) return;
      setDbSkills(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      console.error('[AdminSkills] Fetch error:', err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchSkills(controller.signal);
    return () => controller.abort();
  }, [fetchSkills]);

  const activeSlugs = useMemo(() => {
    return new Set(
      dbSkills.map((s) => s.iconName || s.icon || s.name?.toLowerCase()).filter(Boolean)
    );
  }, [dbSkills]);

  const toggleSkill = useCallback(
    async (tech: (typeof techList)[0]) => {
      const isActive = activeSlugs.has(tech.slug);
      setTogglingSlug(tech.slug);

      try {
        if (isActive) {
          await skillsService.deleteSkill(tech.slug);
          setFeedback({ type: 'success', message: `${tech.name} deactivated from registry.` });
        } else {
          const category = getCategoryForSlug(tech.slug);
          await skillsService.createSkill({
            name: tech.name,
            category,
            iconName: tech.slug,
            proficiency: 85,
            featured: false,
          });
          setFeedback({ type: 'success', message: `${tech.name} activated in PostgreSQL.` });
        }
        await fetchSkills();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Toggle failed.';
        setFeedback({ type: 'error', message });
      } finally {
        setTogglingSlug(null);
      }
    },
    [activeSlugs, fetchSkills]
  );

  const filteredTech = useMemo(() => {
    return techList.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'ACTIVE') return activeSlugs.has(t.slug);
      return filterByCategory(t.slug, selectedCategory);
    });
  }, [search, selectedCategory, activeSlugs]);

  return {
    dbSkills,
    loading,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    togglingSlug,
    feedback,
    setFeedback,
    activeSlugs,
    filteredTech,
    fetchSkills,
    toggleSkill,
  };
}

export default useAdminSkills;
