import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, FolderOpen, Trophy, Briefcase, GraduationCap, Link2, ArrowUpRight, TrendingUp, User, RefreshCw } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { profileService, dashboardService, skillsService, projectsService, achievementsService, socialLinksService } from '@/services/api';

export default function AdminOverviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [counts, setCounts] = useState({
    skills: 0,
    projects: 0,
    experiences: 0,
    education: 0,
    achievements: 0,
    socialLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileService.getProfile().catch(() => null),
      skillsService.getSkills().catch(() => []),
      projectsService.getProjects().catch(() => []),
      achievementsService.getAchievements().catch(() => []),
      socialLinksService.getSocialLinks().catch(() => []),
      fetch('/api/experiences').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/education').then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([p, skills, projects, achievements, socialLinks, exp, edu]) => {
      setProfile(p);
      setCounts({
        skills: Array.isArray(skills) ? skills.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        achievements: Array.isArray(achievements) ? achievements.length : 0,
        socialLinks: Array.isArray(socialLinks) ? socialLinks.length : 0,
        experiences: Array.isArray(exp) ? exp.length : 0,
        education: Array.isArray(edu) ? edu.length : 0,
      });
      setLoading(false);
    });
  }, []);

  const name = profile?.fullName || profile?.name || 'Julio Siringoringo';
  const total = counts.skills + counts.projects + counts.achievements + counts.socialLinks + counts.experiences + counts.education;

  const stats = [
    { label: 'Skills Matrix', count: counts.skills, icon: Code, href: '/admin/skills', id: '01' },
    { label: 'Projects Archive', count: counts.projects, icon: FolderOpen, href: '/admin/projects', id: '02' },
    { label: 'Work Experiences', count: counts.experiences, icon: Briefcase, href: '/admin/experiences', id: '03' },
    { label: 'Academic Dossier', count: counts.education, icon: GraduationCap, href: '/admin/education', id: '04' },
    { label: 'Achievements Index', count: counts.achievements, icon: Trophy, href: '/admin/achievements', id: '05' },
    { label: 'Relay Channels', count: counts.socialLinks, icon: Link2, href: '/admin/social-links', id: '06' },
  ];

  const shortcuts = [
    { label: 'Edit Profile Spec', href: '/admin/profile', icon: User },
    { label: 'Manage Skills Matrix', href: '/admin/skills', icon: Code },
    { label: 'Manage Projects', href: '/admin/projects', icon: FolderOpen },
    { label: 'Manage Social Channels', href: '/admin/social-links', icon: Link2 },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-ink">
      {/* Top HUD Overview */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 00 // WORKSTATION CONTROL & OVERVIEW ]
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            SESSION // <span className="font-mono uppercase font-bold">{name}</span>
          </h1>
          <p className="text-sm text-faint mt-1 font-mono">
            Direct database administration workstation for PostgreSQL & content matrices.
          </p>
        </div>

        <div className="flex items-center gap-2 border border-line bg-bg-raised px-4 py-2 font-mono text-xs">
          <TrendingUp size={14} className="text-ink" />
          <span className="font-bold text-ink">{loading ? '...' : total}</span>
          <span className="text-[10px] uppercase text-faint tracking-wider">TOTAL RECORDS SYNCED</span>
        </div>
      </div>

      {/* Stats Grid in Swiss Brutalist Cards */}
      <div className="space-y-3">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
          [ METRIC REGISTRIES ]
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                to={stat.href}
                className="group relative border border-line bg-bg-raised hover:bg-bg-sunken hover:border-line-strong p-5 transition-all block"
              >
                <CornerCrosses />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-faint font-bold">
                      {stat.id} // {stat.label}
                    </p>
                    <p className="font-display text-3xl font-bold text-ink mt-2">
                      {loading ? '-' : stat.count}
                    </p>
                  </div>
                  <div className="border border-line bg-bg p-2 text-ink">
                    <Icon size={16} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line/50 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-faint group-hover:text-ink transition-colors">
                  <span>MANAGE REGISTRY</span>
                  <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
          [ RAPID DATA DISPATCH ]
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-3 border border-line bg-bg-raised hover:bg-bg-sunken hover:border-line-strong px-4 py-3 font-mono text-xs uppercase font-bold text-ink transition-all group"
              >
                <Icon size={14} className="text-faint group-hover:text-ink transition-colors" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

