import { create } from 'zustand'
import { promptsApi } from '../api/prompts'
import type { Prompt, CreatePromptInput, UpdatePromptInput } from '../types'

interface PromptState {
  prompts: Prompt[]
  loading: boolean
  error: string | null
  selectedCategoryId: string | null
  searchQuery: string
  
  fetchPrompts: () => Promise<void>
  createPrompt: (input: CreatePromptInput) => Promise<void>
  updatePrompt: (input: UpdatePromptInput) => Promise<void>
  deletePrompt: (id: string) => Promise<void>
  setSelectedCategory: (id: string | null) => void
  setSearchQuery: (query: string) => void
  filteredPrompts: () => Prompt[]
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  loading: false,
  error: null,
  selectedCategoryId: null,
  searchQuery: '',

  fetchPrompts: async () => {
    set({ loading: true, error: null })
    try {
      const prompts = await promptsApi.getAll()
      set({ prompts, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  createPrompt: async (input) => {
    set({ loading: true, error: null })
    try {
      const newPrompt = await promptsApi.create(input)
      set(state => ({ 
        prompts: [newPrompt, ...state.prompts],
        loading: false 
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  updatePrompt: async (input) => {
    set({ loading: true, error: null })
    try {
      const updated = await promptsApi.update(input)
      set(state => ({
        prompts: state.prompts.map(p => p.id === updated.id ? updated : p),
        loading: false
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  deletePrompt: async (id) => {
    set({ loading: true, error: null })
    try {
      await promptsApi.delete(id)
      set(state => ({
        prompts: state.prompts.filter(p => p.id !== id),
        loading: false
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  setSelectedCategory: (id) => set({ selectedCategoryId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  filteredPrompts: () => {
    const { prompts, selectedCategoryId, searchQuery } = get()
    return prompts.filter(prompt => {
      const matchesCategory = !selectedCategoryId || prompt.category_id === selectedCategoryId
      const matchesSearch = !searchQuery || 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  },
}))