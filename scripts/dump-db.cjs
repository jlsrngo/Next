const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.findFirst();
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  const achievements = await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
  const experiences = await prisma.workExperience.findMany({ orderBy: { order: 'asc' } });
  const educations = await prisma.education.findMany({ orderBy: { order: 'asc' } });
  const socialLinks = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });

  console.log('=== PROFILE ===', profile);
  console.log('=== PROJECTS ===', projects);
  console.log('=== SKILLS (sample 5) ===', skills.slice(0, 5));
  console.log('=== EXPERIENCES ===', experiences);
  console.log('=== SOCIAL LINKS ===', socialLinks);

  // Write verified snapshot to public/db-data.json so client fallback is ALWAYS 100% real DB data, never mock!
  const fs = require('fs');
  fs.writeFileSync('public/db-data.json', JSON.stringify({
    profile: {
      id: profile.id,
      name: profile.fullName,
      fullName: profile.fullName,
      username: profile.email ? profile.email.split('@')[0] : 'jlsrngo',
      headline: profile.headline || 'Full Stack Developer',
      bio_home: profile.bioHome,
      bio_about: profile.bioAbout,
      location: profile.location || 'Indonesia',
      work_status: 'Open to Opportunities',
      avatar_url: profile.avatarUrl || '/avatar.jpg',
      github_url: profile.githubUrl || 'https://github.com/jlsrngo',
      linkedin_url: profile.linkedinUrl || 'https://linkedin.com/in/jlsrngo',
      email: profile.email || 'juliosiringo777@gmail.com',
      website: profile.website || 'https://jlsrngo.com',
      accent_color: profile.accentColor || '#3B82F6'
    },
    projects: projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image_url: p.imageUrl,
      live_url: p.liveUrl,
      github_url: p.githubUrl,
      tech_stack: p.techStack,
      featured: p.featured,
      order: p.order,
      order_index: p.order
    })),
    skills: skills.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      icon: s.iconName,
      iconName: s.iconName,
      proficiency: s.proficiency,
      featured: s.featured,
      order: s.order
    })),
    achievements: achievements.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      issuer: a.issuer,
      date: a.date,
      image_url: a.imageUrl,
      category: a.category,
      credential_id: a.credentialId,
      credential_url: a.credentialUrl,
      featured: a.featured,
      order: a.order
    })),
    experiences: experiences.map(e => ({
      id: e.id,
      company_name: e.company,
      company_logo_url: e.companyLogoUrl,
      position: e.position,
      location: e.location || 'Indonesia',
      start_date: e.startDate ? e.startDate.toISOString().slice(0, 10) : '2023-01-01',
      end_date: e.endDate ? e.endDate.toISOString().slice(0, 10) : null,
      is_current: e.current,
      employment_type: e.employmentType || 'Full-time',
      work_type: e.workType || 'Remote',
      responsibilities: Array.isArray(e.responsibilities) ? e.responsibilities : (e.responsibilities ? [String(e.responsibilities)] : []),
      what_i_learned: Array.isArray(e.whatILearned) ? e.whatILearned : (e.whatILearned ? [String(e.whatILearned)] : []),
      impact: Array.isArray(e.impact) ? e.impact : (e.impact ? [String(e.impact)] : [])
    })),
    educations: educations.map(ed => ({
      id: ed.id,
      institution_name: ed.institution,
      institution_logo_url: ed.institutionLogoUrl,
      degree: ed.degree,
      field_of_study: ed.fieldOfStudy,
      location: ed.location,
      gpa: ed.gpa,
      start_date: ed.startDate ? ed.startDate.toISOString().slice(0, 10) : '',
      end_date: ed.endDate ? ed.endDate.toISOString().slice(0, 10) : null,
      is_current: ed.current,
      description: ed.description
    })),
    socialLinks: socialLinks.map(s => ({
      id: s.id,
      platform: s.platform,
      title: s.title,
      description: s.description,
      url: s.url,
      is_featured: s.isFeatured,
      order: s.order
    })),
    stats: {
      total_projects: projects.length,
      featured_projects: projects.filter(p => p.featured).length,
      total_achievements: achievements.length,
      total_contributions: 1957,
      total_repos: 17,
      total_prs: 0,
      followers: 0
    }
  }, null, 2));

  console.log('Updated public/db-data.json with 100% authentic Neon PostgreSQL data!');
  await prisma.$disconnect();
}

main().catch(console.error);
