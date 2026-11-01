'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Eye, EyeOff, Lock, X } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [isOpen]);
    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (result?.error) {
                toast.error(t('toast.error_auth'));
            } else {
                toast.success(t('toast.login_success'));
                onClose();
                setEmail('');
                setPassword('');
                window.location.replace('/admin');
            }
        } catch {
            toast.error(t('toast.error_auth'));
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        isOpen ? (
            <div
                className={`glass-overlay ${visible ? 'animate-modal-overlay-in' : 'opacity-0'}`}
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`relative w-full max-w-[380px] p-8 flex flex-col rounded-none border border-line-strong bg-bg-raised text-ink overflow-hidden ${visible ? 'animate-modal-content-in' : 'opacity-0'}`}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-none hover:bg-bg-sunken transition-colors z-10 w-8 h-8 flex items-center justify-center text-ink border border-line shadow-none">
                        <X className="w-4 h-4" />
                    </button>

                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6">
                        <img
                            src="/icon.svg"
                            alt="Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <h2
                        className="font-display text-2xl font-bold text-center mb-1 tracking-tight text-ink uppercase"
                    >
                        {t('common.login_title')}
                    </h2>
                    <p
                        className="hud-label text-center mb-6 text-faint"
                    >
                        {t('common.login_subtitle')}
                    </p>

                    <form onSubmit={handleSubmit} className="w-full space-y-4 relative z-10">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-11 !rounded-none shadow-none ring-0 focus:ring-0"
                                placeholder={t('common.username_placeholder')}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-11 pr-11 !rounded-none shadow-none ring-0 focus:ring-0"
                                placeholder={t('common.password_placeholder')}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-faint hover:text-ink transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 !rounded-none mt-4 uppercase font-bold"
                        >
                            {loading ? t('common.loading') : t('common.sign_in')}
                        </button>
                    </form>
                </div>
            </div>
        ) : null,
        document.body
    );
};

export default LoginModal;
