import type { IncomingMessage, ServerResponse } from 'http';
import { prisma, getDbSnapshot } from './_db';
import fs from 'fs';
import path from 'path';

type VercelReq = IncomingMessage & {
  query?: Record<string, string | string[]>;
  body?: any;
};
type VercelRes = ServerResponse & {
  status: (code: number) => VercelRes;
  json: (data: any) => void;
};

function parseBody(req: VercelReq): any {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function sendJson(res: VercelRes, statusCode: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(data);
  } else {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  }
}

function formatProject(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
    image_url: p.imageUrl,
    liveUrl: p.liveUrl,
    live_url: p.liveUrl,
    githubUrl: p.githubUrl,
    github_url: p.githubUrl,
    techStack: p.techStack || [],
    tech_stack: p.techStack || [],
    featured: p.featured,
    order: p.order,
  };
}

export async function handleRequest(req: VercelReq, res: VercelRes) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const rawUrl = req.url || '/api';
  const urlObj = new URL(rawUrl, 'http://localhost');
  const pathname = urlObj.pathname.replace(/\/+$/, '') || '/api';
  const method = (req.method || 'GET').toUpperCase();

  // Query parameter helpers
  const getQuery = (param: string): string | null => {
    if (req.query && req.query[param]) {
      const v = req.query[param];
      return Array.isArray(v) ? v[0] : v;
    }
    return urlObj.searchParams.get(param);
  };

  try {
    // 1. Health & Diagnostics
    if (pathname === '/api/health' || pathname === '/api/stats') {
      return sendJson(res, 200, {
        status: 'online',
        runtime: 'axum-neon-vercel',
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Skills CRUD
    if (pathname === '/api/skills') {
      if (method === 'GET') {
        try {
          const skills = await prisma.skill.findMany({
            orderBy: [{ order: 'asc' }, { name: 'asc' }],
          });
          if (skills.length > 0) {
            return sendJson(
              res,
              200,
              skills.map((s) => ({
                id: s.id,
                name: s.name,
                category: s.category,
                icon: s.iconName || s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
                iconName: s.iconName || s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
                proficiency: s.proficiency,
                featured: s.featured,
                order: s.order,
              }))
            );
          }
        } catch (err) {
          console.error('[API /api/skills GET error]', err);
        }
        const snap = getDbSnapshot();
        return sendJson(res, 200, snap?.skills || []);
      }

      if (method === 'POST') {
        const body = parseBody(req);
        const name = body.name || 'New Skill';
        const category = body.category || 'Tools & DevOps';
        const iconName = body.iconName || body.icon || name;
        const proficiency = typeof body.proficiency === 'number' ? body.proficiency : 80;
        const featured = Boolean(body.featured);
        const order = typeof body.order === 'number' ? body.order : 0;

        const skill = await prisma.skill.create({
          data: {
            name,
            category,
            iconName,
            proficiency,
            featured,
            order,
          },
        });

        return sendJson(res, 201, {
          ...skill,
          icon: skill.iconName,
        });
      }

      if (method === 'DELETE') {
        const id = getQuery('id');
        const iconName = getQuery('iconName');

        if (id) {
          await prisma.skill.deleteMany({ where: { id } });
        } else if (iconName) {
          await prisma.skill.deleteMany({
            where: {
              OR: [
                { iconName },
                { name: { equals: iconName, mode: 'insensitive' } },
              ],
            },
          });
        }
        return sendJson(res, 200, { success: true });
      }
    }

    // 3. Profile CRUD
    if (pathname === '/api/profile') {
      if (method === 'GET') {
        try {
          const p = await prisma.profile.findFirst();
          if (p) {
            return sendJson(res, 200, {
              name: p.fullName,
              fullName: p.fullName,
              username: 'jlsrngo',
              headline: p.headline || 'Full Stack Developer',
              focus: p.headline || 'Full-Stack & Systems',
              runtime: 'Rust Axum 0.7 · React 18 · Neon PostgreSQL',
              bio_home: p.bioHome || '',
              bio_about: p.bioAbout || '',
              bioHome: p.bioHome || '',
              bioAbout: p.bioAbout || '',
              location: p.location || 'Indonesia',
              phone: p.phone || '',
              work_status: 'Open to Opportunities',
              avatar_url: p.avatarUrl || '/avatar.jpg',
              avatarUrl: p.avatarUrl || '/avatar.jpg',
              github_url: p.githubUrl || 'https://github.com/jlsrngo',
              linkedin_url: p.linkedinUrl || 'https://linkedin.com/in/jlsrngo',
              email: p.email || 'juliosiringo777@gmail.com',
              website: p.website || 'https://jlsrngo.com',
              accent_color: p.accentColor || '#3B82F6',
              accentColor: p.accentColor || '#3B82F6',
            });
          }
        } catch (err) {
          console.error('[API /api/profile GET error]', err);
        }
        const snap = getDbSnapshot();
        if (snap?.profile) return sendJson(res, 200, snap.profile);
        return sendJson(res, 404, { error: 'Profile not found' });
      }

      if (method === 'PUT' || method === 'POST') {
        const body = parseBody(req);
        const first = await prisma.profile.findFirst();
        if (first) {
          const updated = await prisma.profile.update({
            where: { id: first.id },
            data: {
              fullName: body.fullName || body.name || first.fullName,
              headline: body.headline ?? first.headline,
              bioHome: body.bioHome ?? body.bio_home ?? first.bioHome,
              bioAbout: body.bioAbout ?? body.bio_about ?? first.bioAbout,
              avatarUrl: body.avatarUrl ?? body.avatar_url ?? first.avatarUrl,
              email: body.email ?? first.email,
              phone: body.phone ?? first.phone,
              location: body.location ?? first.location,
              website: body.website ?? first.website,
              githubUrl: body.githubUrl ?? body.github_url ?? first.githubUrl,
              linkedinUrl: body.linkedinUrl ?? body.linkedin_url ?? first.linkedinUrl,
            },
          });
          return sendJson(res, 200, updated);
        }
        return sendJson(res, 404, { error: 'Profile not found' });
      }
    }

    // 4. Projects CRUD
    if (pathname.startsWith('/api/projects')) {
      const parts = pathname.split('/');
      const id = parts[3] || getQuery('id');

      if (method === 'GET') {
        if (id) {
          const proj = await prisma.project.findUnique({ where: { id } });
          if (!proj) return sendJson(res, 404, { error: 'Project not found' });
          return sendJson(res, 200, formatProject(proj));
        }
        try {
          const list = await prisma.project.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
          });
          if (list.length > 0) return sendJson(res, 200, list.map(formatProject));
        } catch (err) {
          console.error('[API /api/projects GET error]', err);
        }
        const snap = getDbSnapshot();
        return sendJson(res, 200, snap?.projects || []);
      }

      if (method === 'POST') {
        const body = parseBody(req);
        const proj = await prisma.project.create({
          data: {
            title: body.title || 'Untitled Project',
            description: body.description || '',
            imageUrl: body.imageUrl || body.image_url || null,
            liveUrl: body.liveUrl || body.live_url || null,
            githubUrl: body.githubUrl || body.github_url || null,
            techStack: Array.isArray(body.techStack)
              ? body.techStack
              : Array.isArray(body.tech_stack)
              ? body.tech_stack
              : [],
            featured: Boolean(body.featured),
            order: typeof body.order === 'number' ? body.order : 0,
          },
        });
        return sendJson(res, 201, formatProject(proj));
      }

      if (method === 'PUT' && id) {
        const body = parseBody(req);
        const updated = await prisma.project.update({
          where: { id },
          data: {
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl ?? body.image_url,
            liveUrl: body.liveUrl ?? body.live_url,
            githubUrl: body.githubUrl ?? body.github_url,
            techStack: body.techStack ?? body.tech_stack,
            featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
            order: typeof body.order === 'number' ? body.order : undefined,
          },
        });
        return sendJson(res, 200, formatProject(updated));
      }

      if (method === 'DELETE' && id) {
        await prisma.project.delete({ where: { id } });
        return sendJson(res, 200, { success: true });
      }
    }

    // 5. Work Experiences CRUD
    if (pathname.startsWith('/api/experiences')) {
      const parts = pathname.split('/');
      const id = parts[3] || getQuery('id');

      if (method === 'GET') {
        try {
          const list = await prisma.workExperience.findMany({ orderBy: { order: 'asc' } });
          if (list.length > 0) return sendJson(res, 200, list);
        } catch (err) {
          console.error('[API /api/experiences GET error]', err);
        }
        const snap = getDbSnapshot();
        return sendJson(res, 200, snap?.experiences || []);
      }

      if (method === 'POST') {
        const b = parseBody(req);
        const exp = await prisma.workExperience.create({
          data: {
            company: b.company || 'Company',
            position: b.position || 'Position',
            location: b.location || 'Location',
            startDate: b.startDate ? new Date(b.startDate) : new Date(),
            endDate: b.endDate ? new Date(b.endDate) : null,
            current: Boolean(b.current),
            description: b.description || '',
            responsibilities: b.responsibilities || [],
            whatILearned: b.whatILearned || [],
            order: typeof b.order === 'number' ? b.order : 0,
          },
        });
        return sendJson(res, 201, exp);
      }

      if (method === 'PUT' && id) {
        const b = parseBody(req);
        const updated = await prisma.workExperience.update({
          where: { id },
          data: {
            company: b.company,
            position: b.position,
            location: b.location,
            startDate: b.startDate ? new Date(b.startDate) : undefined,
            endDate: b.endDate ? new Date(b.endDate) : null,
            current: b.current !== undefined ? Boolean(b.current) : undefined,
            description: b.description,
            responsibilities: b.responsibilities,
            whatILearned: b.whatILearned,
            order: typeof b.order === 'number' ? b.order : undefined,
          },
        });
        return sendJson(res, 200, updated);
      }

      if (method === 'DELETE' && id) {
        await prisma.workExperience.delete({ where: { id } });
        return sendJson(res, 200, { success: true });
      }
    }

    // 6. Education CRUD
    if (pathname.startsWith('/api/education')) {
      const parts = pathname.split('/');
      const id = parts[3] || getQuery('id');

      if (method === 'GET') {
        try {
          const list = await prisma.education.findMany({ orderBy: { order: 'asc' } });
          if (list.length > 0) return sendJson(res, 200, list);
        } catch (err) {
          console.error('[API /api/education GET error]', err);
        }
        const snap = getDbSnapshot();
        return sendJson(res, 200, snap?.educations || []);
      }

      if (method === 'POST') {
        const b = parseBody(req);
        const edu = await prisma.education.create({
          data: {
            institution: b.institution || 'Institution',
            degree: b.degree || 'Degree',
            fieldOfStudy: b.fieldOfStudy || b.field_of_study || '',
            location: b.location || '',
            startDate: b.startDate ? new Date(b.startDate) : new Date(),
            endDate: b.endDate ? new Date(b.endDate) : null,
            current: Boolean(b.current),
            description: b.description || '',
            order: typeof b.order === 'number' ? b.order : 0,
          },
        });
        return sendJson(res, 201, edu);
      }

      if (method === 'PUT' && id) {
        const b = parseBody(req);
        const updated = await prisma.education.update({
          where: { id },
          data: {
            institution: b.institution,
            degree: b.degree,
            fieldOfStudy: b.fieldOfStudy ?? b.field_of_study,
            location: b.location,
            startDate: b.startDate ? new Date(b.startDate) : undefined,
            endDate: b.endDate ? new Date(b.endDate) : null,
            current: b.current !== undefined ? Boolean(b.current) : undefined,
            description: b.description,
            order: typeof b.order === 'number' ? b.order : undefined,
          },
        });
        return sendJson(res, 200, updated);
      }

      if (method === 'DELETE' && id) {
        await prisma.education.delete({ where: { id } });
        return sendJson(res, 200, { success: true });
      }
    }

    // 7. Achievements CRUD
    if (pathname.startsWith('/api/achievements')) {
      const parts = pathname.split('/');
      const id = parts[3] || getQuery('id');

      if (method === 'GET') {
        try {
          const list = await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
          if (list.length > 0) return sendJson(res, 200, list);
        } catch (err) {
          console.error('[API /api/achievements GET error]', err);
        }
        const snap = getDbSnapshot();
        return sendJson(res, 200, snap?.achievements || []);
      }

      if (method === 'POST') {
        const b = parseBody(req);
        const item = await prisma.achievement.create({
          data: {
            title: b.title || 'Achievement',
            description: b.description || '',
            issuer: b.issuer || null,
            date: b.date ? new Date(b.date) : new Date(),
            imageUrl: b.imageUrl || b.image_url || null,
            credentialUrl: b.credentialUrl || b.credential_url || null,
            order: typeof b.order === 'number' ? b.order : 0,
          },
        });
        return sendJson(res, 201, item);
      }

      if (method === 'PUT' && id) {
        const b = parseBody(req);
        const updated = await prisma.achievement.update({
          where: { id },
          data: {
            title: b.title,
            description: b.description,
            issuer: b.issuer,
            date: b.date ? new Date(b.date) : undefined,
            imageUrl: b.imageUrl ?? b.image_url,
            credentialUrl: b.credentialUrl ?? b.credential_url,
            order: typeof b.order === 'number' ? b.order : undefined,
          },
        });
        return sendJson(res, 200, updated);
      }

      if (method === 'DELETE' && id) {
        await prisma.achievement.delete({ where: { id } });
        return sendJson(res, 200, { success: true });
      }
    }

    // 8. Social Links CRUD
    if (pathname.startsWith('/api/social-links')) {
      const parts = pathname.split('/');
      const id = parts[3] || getQuery('id');

      if (method === 'GET') {
        try {
          const list = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
          if (list.length > 0) return sendJson(res, 200, list);
        } catch (err) {
          console.error('[API /api/social-links GET error]', err);
        }
        const snap = getDbSnapshot();
        return sendJson(res, 200, snap?.socialLinks || []);
      }

      if (method === 'POST') {
        const b = parseBody(req);
        const item = await prisma.socialLink.create({
          data: {
            platform: b.platform || 'Platform',
            title: b.title || 'Link',
            url: b.url || 'https://',
            description: b.description || '',
            isFeatured: Boolean(b.isFeatured || b.is_featured),
            order: typeof b.order === 'number' ? b.order : 0,
          },
        });
        return sendJson(res, 201, item);
      }

      if (method === 'PUT' && id) {
        const b = parseBody(req);
        const updated = await prisma.socialLink.update({
          where: { id },
          data: {
            platform: b.platform,
            title: b.title,
            url: b.url,
            description: b.description,
            isFeatured: b.isFeatured !== undefined ? Boolean(b.isFeatured) : undefined,
            order: typeof b.order === 'number' ? b.order : undefined,
          },
        });
        return sendJson(res, 200, updated);
      }

      if (method === 'DELETE' && id) {
        await prisma.socialLink.delete({ where: { id } });
        return sendJson(res, 200, { success: true });
      }
    }

    // 9. About Composite
    if (pathname === '/api/about') {
      try {
        const [experiences, educations, achievements] = await Promise.all([
          prisma.workExperience.findMany({ orderBy: { order: 'asc' } }),
          prisma.education.findMany({ orderBy: { order: 'asc' } }),
          prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
        ]);
        return sendJson(res, 200, { experiences, educations, achievements });
      } catch (err) {
        console.error('[API /api/about GET error]', err);
      }
      const snap = getDbSnapshot();
      return sendJson(res, 200, {
        experiences: snap?.experiences || [],
        educations: snap?.educations || [],
        achievements: snap?.achievements || [],
      });
    }

    // 10. Dashboard
    if (pathname === '/api/dashboard') {
      try {
        const [skills, projects, experiences, educations, achievements] = await Promise.all([
          prisma.skill.count(),
          prisma.project.count(),
          prisma.workExperience.count(),
          prisma.education.count(),
          prisma.achievement.count(),
        ]);
        return sendJson(res, 200, {
          skills,
          projects,
          experiences,
          educations,
          achievements,
        });
      } catch (err) {
        console.error('[API /api/dashboard GET error]', err);
      }
      const snap = getDbSnapshot();
      return sendJson(res, 200, snap?.stats || { skills: 0, projects: 0 });
    }

    // 11. Trending
    if (pathname === '/api/trending') {
      try {
        const candidates = [
          path.join(process.cwd(), 'public', 'trending-tech.json'),
          path.join(process.cwd(), 'dist', 'trending-tech.json'),
        ];
        for (const p of candidates) {
          if (fs.existsSync(p)) {
            return sendJson(res, 200, JSON.parse(fs.readFileSync(p, 'utf-8')));
          }
        }
      } catch {}
      return sendJson(res, 200, {
        status: 'SNAPSHOT',
        source: 'Tech Radar',
        headline: 'High-Performance Systems with Rust & Axum',
        metric: 'SYS // NOMINAL',
        spec: 'TECH WIRE // ACTIVE PIPELINE',
      });
    }

    // 12. GitHub Contributions
    if (pathname === '/api/github/contributions') {
      try {
        const candidates = [
          path.join(process.cwd(), 'public', 'github-contributions.json'),
          path.join(process.cwd(), 'dist', 'github-contributions.json'),
        ];
        for (const p of candidates) {
          if (fs.existsSync(p)) {
            return sendJson(res, 200, JSON.parse(fs.readFileSync(p, 'utf-8')));
          }
        }
      } catch {}
      return sendJson(res, 200, { total: 0, days: [] });
    }

    // Unknown endpoint
    return sendJson(res, 404, { error: `Endpoint ${pathname} not found` });
  } catch (error: any) {
    console.error(`[API error ${pathname}]`, error);
    return sendJson(res, 500, { error: error?.message || 'Internal Server Error' });
  }
}
