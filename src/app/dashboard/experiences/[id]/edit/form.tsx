'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateWorkExperience } from '@/actions/workExperiences'

const expSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  companyLogoUrl: z.string().url().optional().or(z.literal('')),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean(),
  description: z.string().min(1, 'Description is required'),
  employmentType: z.string().optional(),
  workType: z.string().optional(),
  responsibilities: z.array(z.string()),
  whatILearned: z.array(z.string()).optional(),
  impact: z.array(z.string()).optional(),
  order: z.number().int().min(0),
})

type ExpForm = z.infer<typeof expSchema>

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
const WORK_TYPES = ['Remote', 'On-site', 'Hybrid']

interface ExperienceEditFormProps {
  initialData: any
}

export function ExperienceEditForm({ initialData }: ExperienceEditFormProps) {
  const router = useRouter()
  const [responsibilities, setResponsibilities] = useState<string[]>(initialData?.responsibilities || [])
  const [whatILearned, setWhatILearned] = useState<string[]>(initialData?.whatILearned || [])
  const [impact, setImpact] = useState<string[]>(initialData?.impact || [])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExpForm>({
    resolver: zodResolver(expSchema),
    defaultValues: {
      company: initialData?.company || '',
      companyLogoUrl: initialData?.companyLogoUrl || '',
      position: initialData?.position || '',
      location: initialData?.location || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      current: initialData?.current || false,
      description: initialData?.description || '',
      employmentType: initialData?.employmentType || 'Full-time',
      workType: initialData?.workType || 'Remote',
      responsibilities: initialData?.responsibilities || [],
      whatILearned: initialData?.whatILearned || [],
      impact: initialData?.impact || [],
      order: initialData?.order || 0,
    },
  })

  const watchedResponsibilities = watch('responsibilities')
  const watchedWhatILearned = watch('whatILearned')
  const watchedImpact = watch('impact')

  const addItem = (arr: string[], setArr: (val: string[]) => void, input: string) => {
    if (input.trim() && !arr.includes(input.trim())) {
      setArr([...arr, input.trim()])
    }
  }

  const removeItem = (arr: string[], setArr: (val: string[]) => void, item: string) => {
    setArr(arr.filter(i => i !== item))
  }

  const onSubmit = async (data: ExpForm) => {
    setLoading(true)
    try {
      await updateWorkExperience(initialData.id, {
        ...data,
        responsibilities,
        whatILearned,
        impact,
        companyLogoUrl: data.companyLogoUrl || undefined,
        endDate: data.current ? undefined : data.endDate || undefined,
      })
      toast.success('Experience updated successfully')
      router.push('/dashboard/experiences')
      router.refresh()
    } catch {
      toast.error('Failed to update experience')
    } finally {
      setLoading(false)
    }
  }

  const renderTagInput = (label: string, items: string[], setItems: (val: string[]) => void, watchedItems: string[]) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-none text-sm">
            {item}
            <button type="button" onClick={() => removeItem(items, setItems, item)} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={`Add ${label.toLowerCase()} and press Enter...`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addItem(items, setItems, e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
        className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-6">
      <div className="space-y-2">
        <label htmlFor="company" className="block text-sm font-medium">Company *</label>
        <input id="company" {...register('company')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="position" className="block text-sm font-medium">Position *</label>
        <input id="position" {...register('position')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium">Start Date *</label>
          <input id="startDate" type="date" {...register('startDate')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
          <input id="endDate" type="date" {...register('endDate')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('current')} className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]" />
          <span className="text-sm font-medium">Currently working here</span>
        </label>
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium">Location</label>
        <input id="location" {...register('location')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="City, Country" />
      </div>

      <div className="space-y-2">
        <label htmlFor="companyLogoUrl" className="block text-sm font-medium">Company Logo URL</label>
        <input id="companyLogoUrl" type="url" {...register('companyLogoUrl')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">Description *</label>
        <textarea id="description" rows={4} {...register('description')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700 resize-y" />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="employmentType" className="block text-sm font-medium">Employment Type</label>
          <select id="employmentType" {...register('employmentType')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700">
            {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="workType" className="block text-sm font-medium">Work Type</label>
          <select id="workType" {...register('workType')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700">
            {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {renderTagInput('Responsibilities', responsibilities, setResponsibilities, watchedResponsibilities)}
      {renderTagInput('What I Learned', whatILearned, setWhatILearned, watchedWhatILearned || [])}
      {renderTagInput('Impact', impact, setImpact, watchedImpact || [])}

      <div className="space-y-2">
        <label htmlFor="order" className="block text-sm font-medium">Display Order</label>
        <input id="order" type="number" min="0" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
        {errors.order && <p className="text-sm text-red-500 mt-1">{errors.order.message}</p>}
      </div>

        <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
          <Link href="/dashboard/experiences" className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</Link>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
