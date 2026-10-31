'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Save, Camera, User, Move } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile, getProfile } from '@/actions/profile'

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  headline: z.string().optional(),
  bioHome: z.string().optional(),
  bioAbout: z.string().optional(),
  email: z.string().optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().optional().or(z.literal('')),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarContainerRef = useRef<HTMLDivElement>(null)

  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, startX: 50, startY: 50 })

  useEffect(() => { getProfile().then(setProfileData) }, [])

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '', headline: '', bioHome: '', bioAbout: '',
      email: '', phone: '', location: '', website: '',
      githubUrl: '', linkedinUrl: '', twitterUrl: '', avatarUrl: '',
    },
  })

  const watchedAvatar = watch('avatarUrl')

  useEffect(() => {
    if (profileData) {
      reset({
        fullName: profileData.fullName || '', headline: profileData.headline || '',
        bioHome: profileData.bioHome || '', bioAbout: profileData.bioAbout || '',
        email: profileData.email || '', phone: profileData.phone || '',
        location: profileData.location || '', website: profileData.website || '',
        githubUrl: profileData.githubUrl || '', linkedinUrl: profileData.linkedinUrl || '',
        twitterUrl: profileData.twitterUrl || '', avatarUrl: profileData.avatarUrl || '',
      })
      if (profileData.avatarObjectPosition) {
        const parts = profileData.avatarObjectPosition.split(' ')
        setPosX(parseFloat(parts[0]) || 50)
        setPosY(parseFloat(parts[1]) || 50)
      }
    }
  }, [profileData, reset])

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image too large. Max 2MB.'); return }
    const reader = new FileReader()
    reader.onload = () => { setValue('avatarUrl', reader.result as string, { shouldValidate: true }) }
    reader.readAsDataURL(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    dragStart.current = { x: clientX, y: clientY, startX: posX, startY: posY }
  }, [posX, posY])

  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !avatarContainerRef.current) return
    const rect = avatarContainerRef.current.getBoundingClientRect()
    const dx = clientX - dragStart.current.x
    const dy = clientY - dragStart.current.y
    const pctX = (dx / rect.width) * 100
    const pctY = (dy / rect.height) * 100
    setPosX(Math.max(0, Math.min(100, dragStart.current.startX + pctX)))
    setPosY(Math.max(0, Math.min(100, dragStart.current.startY + pctY)))
  }, [isDragging])

  const onDragEnd = useCallback(() => { setIsDragging(false) }, [])

  useEffect(() => {
    if (!isDragging) return
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pt = 'touches' in e ? e.touches[0] : e
      onDragMove(pt.clientX, pt.clientY)
    }
    const handleUp = () => onDragEnd()
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [isDragging, onDragMove, onDragEnd])

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true)
    try {
      await updateProfile({ ...data, avatarObjectPosition: `${posX}% ${posY}%` } as any)
      toast.success('Profile updated successfully')
      router.push('/dashboard/profile')
      router.refresh()
    } catch { toast.error('Failed to update profile') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Avatar + Name */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex flex-col items-center gap-5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Avatar</label>

                {/* Avatar with Drag */}
                <div className="relative">
                  <div
                    ref={avatarContainerRef}
                    className={`w-40 h-40 rounded-none bg-slate-100 dark:bg-slate-800 overflow-hidden border-4 border-slate-200 dark:border-slate-700 mx-auto transition-all ${watchedAvatar ? (isDragging ? 'ring-4 ring-[var(--accent)]/40 cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'}`}
                    onClick={() => { if (!isDragging && !watchedAvatar) fileInputRef.current?.click() }}
                    onMouseDown={(e) => { if (watchedAvatar) { e.preventDefault(); onDragStart(e.clientX, e.clientY) } }}
                    onTouchStart={(e) => { if (watchedAvatar) { onDragStart(e.touches[0].clientX, e.touches[0].clientY) } }}
                  >
                    {watchedAvatar ? (
                      <Image src={watchedAvatar} alt="Avatar" width={160} height={160} unoptimized className="w-full h-full pointer-events-none select-none" style={{ objectFit: 'cover', objectPosition: `${posX}% ${posY}%` }} draggable={false} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={48} className="text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Upload overlay (only when no image) */}
                  {!watchedAvatar && (
                    <div className="absolute inset-0 rounded-none bg-black/40 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <Camera size={24} className="text-white mx-auto" />
                        <p className="text-xs text-white/80 mt-1 font-medium">Upload Photo</p>
                      </div>
                    </div>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleAvatarSelect} className="hidden" />
                </div>

                {/* Drag hint */}
                {watchedAvatar && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    <Move size={12} className={isDragging ? 'text-[var(--accent)]' : ''} />
                    {isDragging ? 'Adjusting position...' : 'Drag photo to reposition'}
                  </div>
                )}

                {/* Name + Headline */}
                <div className="w-full grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name *</label>
                    <input id="fullName" {...register('fullName')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="headline" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Headline</label>
                    <input id="headline" {...register('headline')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="Full Stack Developer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Bio</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="bioHome" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Homepage Bio</label>
                  <textarea id="bioHome" rows={3} {...register('bioHome')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm resize-none" placeholder="Short bio for homepage..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bioAbout" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">About Page Bio</label>
                  <textarea id="bioAbout" rows={3} {...register('bioAbout')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm resize-none" placeholder="Detailed bio for about page..." />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact + Social */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Contact</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
                  <input id="email" {...register('email')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</label>
                  <input id="phone" {...register('phone')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</label>
                  <input id="location" {...register('location')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="City, Country" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Social Links</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="website" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Website</label>
                  <input id="website" type="url" {...register('website')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="githubUrl" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">GitHub</label>
                  <input id="githubUrl" type="url" {...register('githubUrl')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="https://github.com/username" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="linkedinUrl" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">LinkedIn</label>
                  <input id="linkedinUrl" type="url" {...register('linkedinUrl')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="twitterUrl" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Twitter</label>
                  <input id="twitterUrl" type="url" {...register('twitterUrl')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="https://twitter.com/username" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 px-6 py-4 bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  )
}
