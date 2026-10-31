import { Metadata } from 'next'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Globe, Github } from 'lucide-react'
import { prisma } from '@/lib/prisma'

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } }).catch(() => null)
    if (!project) return { title: 'Project Not Found' }
    return { title: project.title, description: project.description }
  } catch {
    return { title: 'Project' }
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, id } = await params
  const [messages, project] = await Promise.all([
    getMessages({ locale }) as any,
    prisma.project.findUnique({ where: { id } }).catch(() => null),
  ])

  const common = messages.common
  const projects = messages.projects

  if (!project) notFound()

  return (
    <main className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            {common.back}
          </Link>
          <article className="max-w-3xl mx-auto">
            <header className="mb-8 text-center">
              {project.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-bg-sunken border border-line text-ink text-xs font-mono uppercase font-bold rounded-none mb-4">
                  [ {projects.filters.featured} ]
                </span>
              )}
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-ink">{project.title}</h1>
              <p className="text-lg text-muted">{project.description}</p>
            </header>

            {project.imageUrl && (
              <div className="relative rounded-none border border-line overflow-hidden mb-8 bg-bg-raised">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="px-3 py-1 bg-bg-sunken border border-line rounded-none font-mono text-xs uppercase text-muted">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-invert-bg text-invert-fg border border-line rounded-none font-mono text-xs uppercase font-bold tracking-wider hover:opacity-85 transition"
                >
                  <Globe className="h-4 w-4" />
                  {projects.liveDemo}
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-line bg-bg-raised text-ink rounded-none font-mono text-xs uppercase font-bold tracking-wider hover:border-line-strong transition"
                >
                  <Github className="h-4 w-4" />
                  {projects.sourceCode}
                </Link>
              )}
              <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 px-6 py-3 border border-line bg-bg-raised text-ink rounded-none font-mono text-xs uppercase font-bold tracking-wider hover:border-line-strong transition">
                <ArrowLeft className="h-4 w-4" />
                {common.back}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
