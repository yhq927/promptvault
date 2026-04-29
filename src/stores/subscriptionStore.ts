import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface SubscriptionState {
  tier: 'free' | 'pro' | 'enterprise'
  loading: boolean
  checkSubscription: (user: User) => Promise<void>
  canUseFeature: (feature: 'templates' | 'variables' | 'sharing' | 'export') => boolean
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  tier: 'free',
  loading: true,

  checkSubscription: async (user: User) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()

      if (error) throw error
      set({ tier: data.subscription_tier || 'free', loading: false })
    } catch (err) {
      console.error('Failed to check subscription:', err)
      set({ tier: 'free', loading: false })
    }
  },

  canUseFeature: (feature) => {
    const { tier } = get()
    const permissions = {
      free: { templates: false, variables: false, sharing: false, export: false },
      pro: { templates: true, variables: true, sharing: true, export: true },
      enterprise: { templates: true, variables: true, sharing: true, export: true },
    }
    return permissions[tier]?.[feature] ?? false
  },
}))
