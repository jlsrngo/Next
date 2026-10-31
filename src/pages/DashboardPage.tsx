import { useEffect, useState } from 'react'
import GithubClient from '../app/[locale]/github/github-client'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [initialStats, setInitialStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})

    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => setInitialStats(data))
      .catch(() => {})
  }, [])

  return <GithubClient profile={profile} initialStats={initialStats} />
}
