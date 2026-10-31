import { useEffect, useState } from 'react'
import AboutClient from '../app/[locale]/about/about-client'

export default function AboutPage() {
  const [profile, setProfile] = useState<any>(null)
  const [aboutData, setAboutData] = useState<{ experiences: any[]; educations: any[] }>({
    experiences: [],
    educations: [],
  })

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})

    fetch('/api/about')
      .then(r => r.json())
      .then(data => setAboutData(data))
      .catch(() => {})
  }, [])

  return (
    <AboutClient
      profile={profile}
      experiences={aboutData.experiences}
      educations={aboutData.educations}
    />
  )
}
