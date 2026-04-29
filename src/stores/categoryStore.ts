import { create } from 'zustand'
import { categoriesApi } from '../api/categories'
import type { Category } from '../types'

interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  createCategory: (name: string, icon?: string, color?: string) => Promise<void>
  updateCategory: (id: string, updates: { name?: string; icon?: string; color?: string }) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const categories = await categoriesApi.getAll()
      set({ categories, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  createCategory: async (name, icon, color) => {
    try {
      const newCategory = await categoriesApi.create(name, icon, color)
      set(state => ({ categories: [...state.categories, newCategory] }))
    } catch (err) {
      set({ error: (err as Error).message })
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const updated = await categoriesApi.update(id, updates)
      set(state => ({
        categories: state.categories.map(c => c.id === id ? updated : c)
      }))
    } catch (err) {
      set({ error: (err as Error).message })
    }
  },

  deleteCategory: async (id) => {
    try {
      await categoriesApi.delete(id)
      set(state => ({
        categories: state.categories.filter(c => c.id !== id)
      }))
    } catch (err) {
      set({ error: (err as Error).message })
    }
  },
}))