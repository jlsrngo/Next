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
import { createEducation } from '@/actions/educations'

const eduSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  institutionLogoUrl: z.string().optional().or(z.literal('')),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  gpa: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean(),
  description: z.string().optional(),
  order: z.number().int().min(0),
})

type EduForm = z.infer<typeof eduSchema>

export default function NewEducationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EduForm>({
    resolver: zodResolver(eduSchema),
    defaultValues: { current: false, order: 0, institutionLogoUrl: '' },
  })

  const watchedLogo = watch('institutionLogoUrl')

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image too large. Max 5MB.'); return }
    const reader = new FileReader()
    reader.onload = () => { setValue('institutionLogoUrl', reader.result as string, { shouldValidate: true }) }
    reader.readAsDataURL(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: EduForm) => {
    setLoading(true)
    try {
      await createEducation({
        ...data,
        institutionLogoUrl: data.institutionLogoUrl || undefined,
        endDate: data.current ? undefined : data.endDate || undefined,
      })
      toast.success('Education created successfully')
      router.push('/dashboard/education')
      router.refresh()
    } catch {
      toast.error('Failed to create education')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Institution Logo</label>
          {watchedLogo ? (
            <div className="relative inline-block">
              <Image src={watchedLogo} alt="Logo preview" width={80} height={80} unoptimized className="h-20 w-20 rounded-none object-contain border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
              <button
                type="button"
                onClick={() => setValue('institutionLogoUrl', '', { shouldValidate: true })}
                className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-none hover:bg-red-600 transition"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-4 rounded-none border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-14 w-14 rounded-none bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Upload size={20} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload logo</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, WebP, GIF (max 5MB)</p>
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleLogoUpload} className="hidden" />
        </div>

        <div className="space-y-2">
          <label htmlFor="institution" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Institution *</label>
          <input id="institution" {...register('institution')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.institution && <p className="text-sm text-red-500 mt-1">{errors.institution.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="degree" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Degree *</label>
          <input id="degree" {...register('degree')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.degree && <p className="text-sm text-red-500 mt-1">{errors.degree.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Field of Study</label>
            <input id="fieldOfStudy" {...register('fieldOfStudy')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </div>
          <div className="space-y-2">
            <label htmlFor="gpa" className="block text-sm font-medium text-slate-700 dark:text-slate-300">GPA</label>
            <input id="gpa" {...register('gpa')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="3.8/4.0" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date *</label>
            <input id="startDate" type="date" {...register('startDate')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
            <input id="endDate" type="date" {...register('endDate')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('current')} className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Currently studying here</span>
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
          <input id="location" {...register('location')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="City, Country" />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea id="description" rows={3} {...register('description')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700 resize-y" />
        </div>

        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Display Order</label>
          <input id="order" type="number" min="0" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.order && <p className="text-sm text-red-500 mt-1">{errors.order.message}</p>}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
          <Link href="/dashboard/education" className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            {loading ? <> <Loader2 className="h-4 w-4 animate-spin" /> Creating... </> : 'Create Education'}
          </button>
        </div>
      </form>
    </div>
  )
}
