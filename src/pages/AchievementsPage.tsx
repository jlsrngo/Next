import { useEffect, useState } from 'react'
import AchievementsClient from '../app/[locale]/achievements/achievements-client'

export default function AchievementsPage() {
  const [profile, setProfile] = useState<any>(null)
  const achievements = [
    {
      id: 1,
      title: 'Full-Stack Engineering Excellence',
      issuer: 'ArtCraft Systems',
      category: 'Certification',
      date: '2024-05-15',
      description: 'Mastery in building high-performance Swiss technical web applications with Rust and modern frontend stacks.',
      credential_id: 'CERT-AC-2024-001',
      credential_url: 'https://getartcraft.com',
      image_url: null,
      is_featured: true,
      order_index: 0
    },
    {
      id: 2,
      title: 'Rust High-Performance Architecture',
      issuer: 'Rust Foundation Community',
      category: 'Award',
      date: '2024-08-20',
      description: 'Recognition for building sub-millisecond asynchronous API microservices with Axum and Tokio.',
      credential_id: 'RUST-AXUM-2024-99',
      credential_url: null,
      image_url: null,
      is_featured: true,
      order_index: 1
    }
  ]

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})
  }, [])

  return (
    <AchievementsClient
      achievements={achievements}
      categories={['All', 'Certification', 'Award']}
      profile={profile}
    />
  )
}
