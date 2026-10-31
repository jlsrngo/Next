import { useEffect, useState } from 'react'
import ProjectsClient from '../app/[locale]/projects/projects-client'

export default function ProjectsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})

    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setProjects(data))
      .catch(() => {})
  }, [])

  return <ProjectsClient projects={projects} profile={profile} />
}
