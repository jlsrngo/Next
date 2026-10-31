'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateSocialLink } from '@/actions/socialLinks'

const socialSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  url: z.string().url('Invalid URL'),
  isFeatured: z.boolean(),
  order: z.number().int().min(0),
})

type SocialForm = z.infer<typeof socialSchema>

const PLATFORMS = [
  'github', 'linkedin', 'twitter', 'instagram', 'facebook',
  'youtube', 'devto', 'medium', 'stackoverflow', 'leetcode',
  'email', 'website', 'discord', 'slack', 'other'
]

interface SocialLinkEditFormProps {
  initialData: any
}

export function SocialLinkEditForm({ initialData }: SocialLinkEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SocialForm>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      platform: initialData?.platform || '',
      title: initialData?.title || '',
      description: initialData?.description || '',
      url: initialData?.url || '',
      isFeatured: initialData?.isFeatured || false,
      order: initialData?.order || 0,
    },
  })

  const onSubmit = async (data: SocialForm) => {
    setLoading(true)
    try {
      await updateSocialLink(initialData.id, data)
      toast.success('Social link updated successfully')
      router.push('/dashboard/social-links')
      router.refresh()
    } catch {
      toast.error('Failed to update social link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-6">
      <div className="space-y-2">
        <label htmlFor="platform" className="block text-sm font-medium">Platform *</label>
        <select id="platform" {...register('platform')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700">
          {PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        {errors.platform && <p className="text-sm text-red-500 mt-1">{errors.platform.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">Title *</label>
        <input id="title" {...register('title')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <input id="description" {...register('description')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
      </div>

      <div className="space-y-2">
        <label htmlFor="url" className="block text-sm font-medium">URL *</label>
        <input id="url" type="url" {...register('url')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="https://..." />
        {errors.url && <p className="text-sm text-red-500 mt-1">{errors.url.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]" />
            <span className="text-sm font-medium">Featured Link</span>
          </label>
        </div>
        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium">Display Order</label>
          <input id="order" type="number" min="0" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.order && <p className="text-sm text-red-500 mt-1">{errors.order.message}</p>}
        </div>
      </div>

        <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
          <Link href="/dashboard/social-links" className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</Link>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
