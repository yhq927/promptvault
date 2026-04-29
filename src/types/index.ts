// User Profile (extends Supabase Auth)
export interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url?: string
  subscription_tier: 'free' | 'pro' | 'enterprise'
  subscription_end_date?: string
  created_at: string
  updated_at: string
}

// Category
export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  sort_order: number
  created_at: string
  updated_at: string
}

// Tag
export interface Tag {
  id: string
  name: string
  created_at: string
}

// Prompt
export interface Prompt {
  id: string
  user_id: string
  title: string
  content: string
  description?: string
  category_id?: string
  category?: Category
  is_public: boolean
  usage_count: number
  tags?: Tag[]
  created_at: string
  updated_at: string
}

// Create Prompt Input
export interface CreatePromptInput {
  title: string
  content: string
  description?: string
  category_id?: string
  is_public?: boolean
  tag_ids?: string[]
}

// Update Prompt Input
export interface UpdatePromptInput extends Partial<CreatePromptInput> {
  id: string
}

// Template Variable
export interface Variable {
  key: string
  defaultValue: string
  currentValue: string
}