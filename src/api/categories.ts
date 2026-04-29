import { supabase } from '../lib/supabase'
import type { Category } from '../types'

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data || []
  },

  async create(name: string, icon: string = '📁', color: string = '#6366F1'): Promise<Category> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: maxOrder } = await supabase
      .from('categories')
      .select('sort_order')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const sort_order = (maxOrder?.[0]?.sort_order ?? 0) + 1

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name,
        icon,
        color,
        sort_order,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: { name?: string; icon?: string; color?: string }): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}