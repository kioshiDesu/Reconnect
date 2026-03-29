'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Database } from '@/lib/supabase/types'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        setUser(profile ?? null)
      } else {
        setUser(null)
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser(profile ?? null)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    router.push('/')
  }, [supabase, router])

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase generic type resolution issue with insert
        .insert({
          id: data.user.id,
          username,
          status: 'offline',
        } as Database['public']['Tables']['profiles']['Insert'])

      if (profileError) throw profileError
    }
    
    router.push('/')
  }, [supabase, router])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [supabase, router])

  const updateStatus = useCallback(async (status: 'online' | 'offline' | 'away') => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase generic type resolution issue with update
      .update({ status, updated_at: new Date().toISOString() } as Database['public']['Tables']['profiles']['Update'])
      .eq('id', user.id)

    if (error) throw error
  }, [supabase, user])

  return { user, loading, signIn, signUp, signOut, updateStatus }
}
