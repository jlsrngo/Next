import React from 'react'

export const useSession = () => ({ data: null, status: 'unauthenticated' })
export const signOut = () => {}
export const signIn = () => {}
export const SessionProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
