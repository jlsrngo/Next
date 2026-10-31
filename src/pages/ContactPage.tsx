import { useEffect, useState } from 'react'
import ContactClient from '../app/[locale]/contact/contact-client'

export default function ContactPage() {
  const [profile, setProfile] = useState<any>(null)
  const socialLinks = [
    {
      id: 1,
      platform: 'github',
      title: 'GitHub Repository & Code',
      description: 'Explore open-source repositories, Rust microservices, and web experiments.',
      url: 'https://github.com/jlsrngo',
      is_featured: true,
    },
    {
      id: 2,
      platform: 'linkedin',
      title: 'LinkedIn Network',
      description: 'Connect for professional opportunities, engineering collaborations, and partnerships.',
      url: 'https://linkedin.com/in/jlsrngo',
      is_featured: true,
    },
    {
      id: 3,
      platform: 'gmail',
      title: 'Direct Email',
      description: 'Send direct inquiries for contracts, projects, or architecture consultations.',
      url: 'mailto:juliosiringo777@gmail.com',
      is_featured: false,
    },
    {
      id: 4,
      platform: 'website',
      title: 'Official Website',
      description: 'Visit the live portfolio and blog platform.',
      url: 'https://jlsrngo.com',
      is_featured: false,
    }
  ]

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})
  }, [])

  return <ContactClient socialLinks={socialLinks} profile={profile} />
}
