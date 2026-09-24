'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { updateProject } from '@/actions/projects'
import { uploadImage } from '@/actions/upload'
import { techList } from '@/lib/techList'
import { TechIcon } from '@/components/TechIcon'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  featured: z.boolean(),
  order: z.number().int().min(0),
})

type ProjectForm = z.infer<typeof projectSchema>

interface ProjectEditFormProps {
  initialData: any
  locale: string
  projectsMessages: any
}

export function ProjectEditForm({ initialData, locale, projectsMessages }: ProjectEditFormProps) {
  const router = useRouter()
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || [])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)
  const [showAllTech, setShowAllTech] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '',
      liveUrl: initialData?.liveUrl || '',
      githubUrl: initialData?.githubUrl || '',
      featured: initialData?.featured || false,
      order: initialData?.order || 0,
    },
  })

  const watchedImageUrl = watch('imageUrl')

  const toggleTech = (name: string) => {
    if (techStack.includes(name)) {
      setTechStack(techStack.filter(t => t !== name))
    } else {
      setTechStack([...techStack, name])
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'projects')
      const { url } = await uploadImage(formData)
      setImagePreview(url)
      setValue('imageUrl', url, { shouldValidate: true })
      toast.success('Image uploaded')
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setValue('imageUrl', '', { shouldValidate: true })
  }

  const onSubmit = async (data: ProjectForm) => {
    setLoading(true)
    try {
      await updateProject(initialData.id, {
        ...data,
        techStack,
        imageUrl: data.imageUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        githubUrl: data.githubUrl || undefined,
      })
      toast.success('Project updated successfully')
      router.push('/dashboard/projects')
      router.refresh()
    } catch {
      toast.error('Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  const fields = {
    title: projectsMessages?.fields?.title || 'Title',
    description: projectsMessages?.fields?.description || 'Description',
    imageUrl: projectsMessages?.fields?.imageUrl || 'Project Image',
    liveUrl: projectsMessages?.fields?.liveUrl || 'Live Demo URL',
    githubUrl: projectsMessages?.fields?.githubUrl || 'GitHub URL',
    techStack: projectsMessages?.fields?.techStack || 'Tech Stack',
    featured: projectsMessages?.fields?.featured || 'Featured Project',
    order: projectsMessages?.fields?.order || 'Display Order',
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

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">{fields.imageUrl}</label>
        <input type="hidden" {...register('imageUrl')} />
        {(imagePreview || watchedImageUrl) ? (
          <div className="relative inline-block">
            <img src={imagePreview || watchedImageUrl || ''} alt="Preview" className="h-40 w-auto rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
            <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-[var(--accent)] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
          >
            {uploadingImage ? (
              <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-slate-400" />
                <span className="text-sm text-slate-500">Click to upload screenshot</span>
                <span className="text-xs text-slate-400">PNG, JPG, WebP, GIF (max 5MB)</span>
              </>
            )}
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
        <p className="text-xs text-slate-400">Or paste URL:</p>
        <input
          type="url"
          placeholder="https://..."
          value={watchedImageUrl || ''}
          onChange={(e) => {
            setImagePreview(null)
            setValue('imageUrl', e.target.value, { shouldValidate: true })
          }}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700 text-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="liveUrl" className="block text-sm font-medium">{fields.liveUrl}</label>
          <input id="liveUrl" type="url" {...register('liveUrl')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <label htmlFor="githubUrl" className="block text-sm font-medium">{fields.githubUrl}</label>
          <input id="githubUrl" type="url" {...register('githubUrl')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="https://..." />
        </div>
      </div>

      {/* Tech Stack - Icon Grid */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {fields.techStack}
          {techStack.length > 0 && <span className="ml-2 text-xs text-slate-400">({techStack.length} selected)</span>}
        </label>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {techStack.map((tech) => (
              <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium">
                {tech}
                <button type="button" onClick={() => toggleTech(tech)} className="hover:text-red-500 transition">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className={`relative ${!showAllTech ? 'max-h-[88px] overflow-hidden' : ''}`}>
          <div className="flex flex-wrap gap-1.5">
            {techList.map(tech => {
              const isSelected = techStack.includes(tech.name)
              return (
                <button
                  type="button"
                  key={tech.slug}
                  onClick={() => toggleTech(tech.name)}
                  title={tech.name}
                  className={`p-1.5 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-current scale-110 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-105'
                  }`}
                  style={isSelected ? { borderColor: tech.color, background: `${tech.color}22`, boxShadow: `0 2px 8px ${tech.color}33` } : undefined}
                >
                  <div className={isSelected ? '' : 'text-slate-400 dark:text-slate-500'}>
                    <TechIcon name={tech.icon} size={20} />
                  </div>
                </button>
              )
            })}
          </div>
          {!showAllTech && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
          )}
        </div>
        <button type="button" onClick={() => setShowAllTech(!showAllTech)} className="text-xs text-[var(--accent)] hover:underline">
          {showAllTech ? 'Show less' : 'Show all'}
        </button>
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
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
        <Link href="/dashboard/projects" className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</Link>
        <button type="submit" disabled={loading || uploadingImage} className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving... </> : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
