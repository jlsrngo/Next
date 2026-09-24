'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Calendar, ShieldCheck, FileText, ChevronRight, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Achievement {
  id: string
  title: string
  description: string
  issuer: string
  date: string
  image_url: string
  category: string
  credential_id?: string
  credential_url?: string
  type?: string
}

interface AchievementDetailModalProps {
  isOpen: boolean
  onClose: () => void
  achievement: Achievement | null
}

export default function AchievementDetailModal({ isOpen, onClose, achievement }: AchievementDetailModalProps) {
  const t = useTranslations()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [isOpen])

  if (!achievement || !mounted) return null

  const isPdf = achievement.image_url?.toLowerCase().endsWith('.pdf')
  const isDataUrl = achievement.image_url?.startsWith('data:')
  const hasImage = !!achievement.image_url

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 ${visible ? 'animate-modal-overlay-in' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex flex-col md:flex-row w-full max-w-[900px] max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 dark:border-zinc-800 ${visible ? 'animate-modal-content-in' : 'opacity-0'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--accent)] text-white hover:brightness-90 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-full md:w-[65%] shrink-0 flex items-center justify-center min-h-[250px] md:min-h-[400px]">
          {hasImage ? (
            isPdf ? (
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-4 px-10 bg-slate-50 dark:bg-[#0a0a0a]">
                <div className="w-20 h-20 rounded-2xl border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                  <FileText className="w-10 h-10" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-black dark:text-white">{t('achievements.pdf_certificate')}</p>
                  <p className="text-xs text-black dark:text-white uppercase tracking-tight">{t('achievements.click_to_view')}</p>
                </div>
              </div>
            ) : (
              <img
                src={achievement.image_url}
                alt={achievement.title}
                className="w-full h-full object-cover block min-h-[250px] md:min-h-[400px]"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black dark:text-white py-20 bg-slate-50 dark:bg-[#0a0a0a]">
              <FileText className="w-32 h-32" />
            </div>
          )}
        </div>

        <div className="w-full md:w-[35%] p-4 overflow-y-auto bg-white dark:bg-[#0a0a0a] md:rounded-r-3xl text-black dark:text-white flex flex-col">
          <div className="flex-1">
            <div className="mb-1.5">
              <div className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white bg-[var(--accent)] rounded-full">
                {achievement.category}
              </div>
            </div>

            <h2 className="text-sm font-bold leading-snug mb-1">
              {achievement.title}
            </h2>

            {achievement.issuer && (
              <div className="text-xs mb-2.5 text-black dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                <span className="font-bold">{achievement.issuer}</span>
              </div>
            )}

            <div className="border-t border-slate-200 dark:border-zinc-800 pt-2 mb-2.5" />

            <div className="space-y-2">
              {achievement.credential_id && (
                <div className="mb-2">
                  <div className="text-[9px] mb-px tracking-wider text-black dark:text-white font-bold uppercase">
                    Credential ID
                  </div>
                  <p className="text-xs font-bold text-black dark:text-white break-all">
                    {achievement.credential_id}
                  </p>
                </div>
              )}

              {achievement.date && (
                <div className="mb-2">
                  <div className="text-[9px] mb-px tracking-wider text-black dark:text-white font-bold uppercase">
                    {t('achievements.issue_date')}
                  </div>
                  <p className="text-xs font-bold flex items-center gap-2 text-black dark:text-white">
                    <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {new Date(achievement.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              )}

              {achievement.description && (
                <div className="mb-2">
                  <div className="text-[9px] mb-px tracking-wider text-black dark:text-white font-bold uppercase">
                    {t('achievements.description_label')}
                  </div>
                  <p className="text-xs text-black dark:text-white leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            {achievement.credential_url ? (
              <a
                href={achievement.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:brightness-90 rounded-xl transition-all"
              >
                <span className="flex-1">{t('achievements.credential_url_btn')}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            ) : isPdf && hasImage ? (
              <a
                href={achievement.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:brightness-90 rounded-xl transition-all"
              >
                <span className="flex-1">{t('achievements.open_pdf')}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            ) : hasImage && isDataUrl ? (
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = achievement.image_url
                  link.download = `achievement-${achievement.id}.jpg`
                  link.click()
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:brightness-90 rounded-xl transition-all"
              >
                <span className="flex-1">{t('achievements.download_image') || 'Download Image'}</span>
                <Download className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border border-slate-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-black dark:text-white"
              >
                {t('achievements.close_details_btn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
