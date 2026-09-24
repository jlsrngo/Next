'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateAchievement } from '@/actions/achievements'

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  issuer: z.string().optional(),
  date: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  category: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  type: z.string().optional(),
  featured: z.boolean(),
  order: z.number().int().min(0),
  translations: z.array(z.object({
    locale: z.string(),
    title: z.string(),
    description: z.string(),
    issuer: z.string().optional(),
  })).optional(),
})

type AchievementForm = z.infer<typeof achievementSchema>

interface AchievementEditFormProps {
  initialData: any
  locale: string
  achievementsMessages: any
}

export function AchievementEditForm({ initialData, locale, achievementsMessages }: AchievementEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AchievementForm>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      issuer: initialData?.issuer || '',
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
      imageUrl: initialData?.imageUrl || '',
      category: initialData?.category || '',
      credentialId: initialData?.credentialId || '',
      credentialUrl: initialData?.credentialUrl || '',
      type: initialData?.type || '',
      featured: initialData?.featured || false,
      order: initialData?.order || 0,
    },
  })

  const watchedImage = watch('imageUrl')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image too large. Max 5MB.'); return }
    const reader = new FileReader()
    reader.onload = () => { setValue('imageUrl', reader.result as string, { shouldValidate: true }) }
    reader.readAsDataURL(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: AchievementForm) => {
    setLoading(true)
    try {
      await updateAchievement(initialData.id, {
        ...data,
        imageUrl: data.imageUrl || undefined,
        credentialUrl: data.credentialUrl || undefined,
        date: data.date || undefined,
        translations: initialData.translations || [],
      })
      toast.success('Achievement updated successfully')
      router.push('/dashboard/achievements')
      router.refresh()
    } catch {
      toast.error('Failed to update achievement')
    } finally {
      setLoading(false)
    }
  }

  const fields = {
    title: achievementsMessages?.fields?.title || 'Title',
    description: achievementsMessages?.fields?.description || 'Description',
    issuer: achievementsMessages?.fields?.issuer || 'Issuer / Organization',
    date: achievementsMessages?.fields?.date || 'Date',
    category: achievementsMessages?.fields?.category || 'Category',
    type: achievementsMessages?.fields?.type || 'Type',
    credentialId: achievementsMessages?.fields?.credentialId || 'Credential ID',
    credentialUrl: achievementsMessages?.fields?.credentialUrl || 'Credential URL',
    imageUrl: achievementsMessages?.fields?.imageUrl || 'Certificate Image',
    featured: achievementsMessages?.fields?.featured || 'Featured Achievement',
    order: achievementsMessages?.fields?.order || 'Display Order',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#0c0c0e] rounded-xl border border-slate-200 dark:border-[#27272a] p-6 space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">{fields.title} *</label>
        <input id="title" {...register('title')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">{fields.description} *</label>
        <textarea id="description" rows={4} {...register('description')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="issuer" className="block text-sm font-medium">{fields.issuer}</label>
          <input id="issuer" {...register('issuer')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        </div>
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium">{fields.date} *</label>
          <input id="date" type="date" {...register('date')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">{fields.imageUrl}</label>
        {watchedImage ? (
          <div className="relative rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden">
            <Image src={watchedImage} alt="Preview" width={400} height={192} unoptimized className="w-full h-48 object-contain bg-slate-50 dark:bg-slate-800" />
            <button
              type="button"
              onClick={() => setValue('imageUrl', '', { shouldValidate: true })}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Upload size={20} className="text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, WebP, GIF (max 5MB)</p>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">{fields.category}</label>
          <input id="category" {...register('category')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="Certification, Award, etc." />
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium">{fields.type}</label>
          <input id="type" {...register('type')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="Course, Competition, etc." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="credentialId" className="block text-sm font-medium">{fields.credentialId}</label>
          <input id="credentialId" {...register('credentialId')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        </div>
        <div className="space-y-2">
          <label htmlFor="credentialUrl" className="block text-sm font-medium">{fields.credentialUrl}</label>
          <input id="credentialUrl" type="url" {...register('credentialUrl')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]" />
            <span className="text-sm font-medium">{fields.featured}</span>
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium">{fields.order}</label>
          <input id="order" type="number" min="0" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.order && <p className="text-sm text-red-500 mt-1">{errors.order.message}</p>}
        </div>
      </div>

        <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
          <Link href="/dashboard/achievements" className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</Link>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {loading ? <> <Loader2 className="h-4 w-4 animate-spin" /> Saving... </> : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
