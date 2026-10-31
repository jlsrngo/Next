'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createProject } from '@/actions/projects'
import { uploadImage } from '@/actions/upload'
import { techList } from '@/lib/techList'
import { TechIcon } from '@/components/TechIcon'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  techStack: z.array(z.string()),
  featured: z.boolean(),
  order: z.number().int().min(0),
})

type ProjectForm = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const [techStack, setTechStack] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showAllTech, setShowAllTech] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: { techStack: [], featured: false, order: 0, imageUrl: '' },
  })

  const watchedImageUrl = watch('imageUrl')

  const toggleTech = (name: string) => {
    if (techStack.includes(name)) {
      const next = techStack.filter(t => t !== name)
      setTechStack(next)
      setValue('techStack', next, { shouldValidate: true })
    } else {
      const next = [...techStack, name]
      setTechStack(next)
      setValue('techStack', next, { shouldValidate: true })
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
      await createProject({
        ...data,
        techStack: techStack,
        imageUrl: data.imageUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        githubUrl: data.githubUrl || undefined,
      })
      toast.success('Project created successfully')
      router.push('/dashboard/projects')
      router.refresh()
    } catch {
      toast.error('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-6">

        {/* Title & Description */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
          <input id="title" {...register('title')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea id="description" rows={4} {...register('description')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Project Image</label>
          <input type="hidden" {...register('imageUrl')} />
          {(imagePreview || watchedImageUrl) ? (
            <div className="relative inline-block">
              <img src={imagePreview || watchedImageUrl || ''} alt="Preview" className="h-40 w-auto rounded-none object-cover border border-slate-200 dark:border-slate-700" />
              <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-none flex items-center justify-center hover:bg-red-600 transition">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-none cursor-pointer hover:border-[var(--accent)] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
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
            className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700 text-sm"
          />
        </div>

        {/* URLs */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="liveUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Live Demo URL</label>
            <input id="liveUrl" type="url" {...register('liveUrl')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</label>
            <input id="githubUrl" type="url" {...register('githubUrl')} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="https://..." />
          </div>
        </div>

        {/* Tech Stack - Icon Grid */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tech Stack
            {techStack.length > 0 && <span className="ml-2 text-xs text-slate-400">({techStack.length} selected)</span>}
          </label>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-none text-sm font-medium">
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
                    className={`p-1.5 rounded-none border-2 transition-all duration-200 ${
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

        {/* Options */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured Project</span>
            </label>
          </div>
          <div className="space-y-2">
            <label htmlFor="order" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Display Order</label>
            <input id="order" type="number" min="0" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-slate-800 dark:text-white dark:border-slate-700" />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t dark:border-slate-800">
          <Link href="/dashboard/projects" className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</Link>
          <button type="submit" disabled={loading || uploadingImage} className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating... </> : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
