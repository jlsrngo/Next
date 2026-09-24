import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardShell from './DashboardShell'
import Providers from './Providers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/id')

  const profile = await prisma.profile.findFirst({
    where: { userId: session.user.id },
    select: { fullName: true, avatarUrl: true, accentColor: true },
  })

  const isMonochrome = profile?.accentColor === '#000000' || profile?.accentColor === 'monochrome'

  return (
    <Providers initialMonochrome={isMonochrome} initialAccentColor={profile?.accentColor ?? undefined}>
      <DashboardShell
        email={session.user.email}
        profileName={profile?.fullName ?? null}
        profileAvatar={profile?.avatarUrl ?? null}
        profileAccent={profile?.accentColor ?? null}
      >
        {children}
      </DashboardShell>
    </Providers>
  )
}
