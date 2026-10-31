'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { changeEmail, changePassword } from '@/actions/account'

const emailSchema = z.object({
  newEmail: z.string().email('Invalid email'),
  currentPassword: z.string().min(1, 'Password is required'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm password'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function AccountPage() {
  const { data: session } = useSession()
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showEmailPw, setShowEmailPw] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: '', currentPassword: '' },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    setEmailLoading(true)
    try {
      await changeEmail(data.newEmail, data.currentPassword)
      toast.success('Email updated — please sign in again with your new email')
      emailForm.reset()
    } catch (e: any) {
      toast.error(e.message || 'Failed to change email')
    } finally { setEmailLoading(false) }
  }

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setPasswordLoading(true)
    try {
      await changePassword(data.currentPassword, data.newPassword)
      toast.success('Password updated successfully')
      passwordForm.reset()
    } catch (e: any) {
      toast.error(e.message || 'Failed to change password')
    } finally { setPasswordLoading(false) }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Change Email */}
      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Change Email</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Email *</label>
            <input type="email" {...emailForm.register('newEmail')} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="new@email.com" />
            {emailForm.formState.errors.newEmail && <p className="text-xs text-red-500">{emailForm.formState.errors.newEmail.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Password *</label>
            <div className="relative">
              <input type={showEmailPw ? 'text' : 'password'} {...emailForm.register('currentPassword')} className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="Confirm with password" />
              <button type="button" onClick={() => setShowEmailPw(!showEmailPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showEmailPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {emailForm.formState.errors.currentPassword && <p className="text-xs text-red-500">{emailForm.formState.errors.currentPassword.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={emailLoading} className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold">
            {emailLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : 'Update Email'}
          </button>
        </div>
      </form>

      {/* Right: Change Password */}
      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Shield size={18} className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Change Password</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Update your account password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Password *</label>
            <div className="relative">
              <input type={showCurrentPw ? 'text' : 'password'} {...passwordForm.register('currentPassword')} className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="Enter current password" />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordForm.formState.errors.currentPassword && <p className="text-xs text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Password *</label>
            <div className="relative">
              <input type={showNewPw ? 'text' : 'password'} {...passwordForm.register('newPassword')} className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && <p className="text-xs text-red-500">{passwordForm.formState.errors.newPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm New Password *</label>
            <div className="relative">
              <input type={showConfirmPw ? 'text' : 'password'} {...passwordForm.register('confirmPassword')} className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm" placeholder="Repeat new password" />
              <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={passwordLoading} className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-none hover:opacity-90 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold">
            {passwordLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}
