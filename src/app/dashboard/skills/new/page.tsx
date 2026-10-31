'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { createSkill } from '@/actions/skills'
import IconPicker from '@/components/IconPicker'

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  iconName: z.string().optional(),
  proficiency: z.number().int().min(0).max(100).default(80),
  featured: z.boolean(),
  order: z.number().int().min(0),
})

type SkillForm = z.infer<typeof skillSchema>

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Languages', 'Soft Skills']

export default function NewSkillPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm<SkillForm>({
    resolver: zodResolver(skillSchema),
    defaultValues: { proficiency: 80, featured: false, order: 0 },
  })

  const onSubmit = async (data: SkillForm) => {
    setLoading(true)
    try {
      await createSkill(data)
      toast.success('Skill created successfully')
      router.push('/dashboard/skills')
      router.refresh()
    } catch {
      toast.error('Failed to create skill')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
            <input id="name" {...register('name')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm dark:bg-slate-800 dark:text-white" placeholder="e.g. React, Python, Docker" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
            <select id="category" {...register('category')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm dark:bg-slate-800 dark:text-white">
              <option value="">Select category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Icon</label>
          <Controller
            control={control}
            name="iconName"
            render={({ field }) => (
              <IconPicker value={field.value || ''} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="proficiency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Proficiency (0-100)</label>
            <input id="proficiency" type="number" min="0" max="100" {...register('proficiency', { valueAsNumber: true })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div className="space-y-2">
            <label htmlFor="order" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Display Order</label>
            <input id="order" type="number" min="0" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href="/dashboard/skills" className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</Link>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : 'Create Skill'}
          </button>
        </div>
      </form>
    </div>
  )
}
