import { useEffect, useState } from 'react'
import HomeClient from '../app/[locale]/home-client'

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})

    fetch('/api/skills')
      .then(r => r.json())
      .then(data => setSkills(data))
      .catch(() => {})
  }, [])

  return <HomeClient profile={profile} skills={skills} />
}
