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

  console.log('--- DATABASE INSPECTION ---');
  console.log('Profile:', profile ? { id: profile.id, name: profile.fullName, username: profile.email } : null);
  console.log('Projects count:', projects.length, projects.map(p => ({ title: p.title, featured: p.featured })));
  console.log('Skills count:', skills.length, skills.map(s => s.name));
  console.log('Achievements count:', achievements.length, achievements.map(a => a.title));
  console.log('Experiences count:', experiences.length, experiences.map(e => e.position));
  console.log('Educations count:', educations.length, educations.map(e => e.institution));
  console.log('SocialLinks count:', socialLinks.length, socialLinks.map(s => s.platform));
  
  await prisma.$disconnect();
}

main().catch(console.error);
