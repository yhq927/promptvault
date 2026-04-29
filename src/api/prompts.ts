import { supabase } from '../lib/supabase'
import type { Prompt, CreatePromptInput, UpdatePromptInput } from '../types'

export const promptsApi = {
  // 获取所有提示词
  async getAll(): Promise<Prompt[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('prompts')
      .select(`
        *,
        category:categories(*),
        tags:prompt_tags(tag:tags(*))
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform the nested tags
    return (data || []).map(prompt => ({
      ...prompt,
      tags: prompt.tags?.map((t: { tag: unknown }) => t.tag) || []
    }))
  },

  // 创建提示词
  async create(input: CreatePromptInput): Promise<Prompt> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('prompts')
      .insert({
        ...input,
        user_id: user.id,
        is_public: input.is_public ?? false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 更新提示词
  async update(input: UpdatePromptInput): Promise<Prompt> {
    const { id, ...updates } = input
    const { data, error } = await supabase
      .from('prompts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 删除提示词
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // 更新使用次数
  async incrementUsage(id: string): Promise<void> {
    const { error } = await supabase
      .from('prompts')
      .update({ usage_count: supabase.rpc('increment', { row_id: id }) })
      .eq('id', id)

    if (error) console.error('Failed to increment usage:', error)
  },
}