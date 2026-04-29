import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: true,

      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          return { error: error.message }
        }
        set({ user: data.user, session: data.session })
        return { error: null }
      },

      signUp: async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        })
        if (error) {
          return { error: error.message }
        }
        set({ user: data.user, session: data.session })
        return { error: null }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null })
      },

      checkSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          set({ 
            session, 
            user: session?.user ?? null,
            loading: false 
          })
          
          // 监听认证状态变化
          supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null })
          })
        } catch (error) {
          console.error('Session check failed:', error)
          set({ 
            session: null, 
            user: null,
            loading: false 
          })
        }
      },
    }),
    {
      name: 'promptvault-auth',
      partialize: (state) => ({ session: state.session, user: state.user }),
    }
  )
)