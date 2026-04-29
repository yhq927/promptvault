import { useState, useEffect } from 'react'
import type { Prompt, CreatePromptInput, Category } from '../../types'

interface PromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePromptInput) => Promise<void>
  prompt?: Prompt | null
  categories: Category[]
}

export default function PromptModal({ isOpen, onClose, onSubmit, prompt, categories }: PromptModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title)
      setContent(prompt.content)
      setDescription(prompt.description || '')
      setCategoryId(prompt.category_id || '')
    } else {
      setTitle('')
      setContent('')
      setDescription('')
      setCategoryId('')
    }
    setError('')
  }, [prompt, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        description: description.trim() || undefined,
        category_id: categoryId || undefined,
      })
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2D2D3A]">
          <h2 className="text-xl font-bold text-[#F9FAFB]">
            {prompt ? '编辑提示词' : '创建提示词'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#71717A] hover:text-[#9CA3AF] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[#E5E7EB] text-sm font-medium mb-2">
              标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给提示词起个名字"
              required
              className="w-full bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[#E5E7EB] text-sm font-medium mb-2">
              提示词内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="粘贴你的提示词..."
              required
              rows={8}
              className="w-full bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors font-mono text-sm resize-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#E5E7EB] text-sm font-medium mb-2">
              描述（可选）
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述这个提示词的用途"
              className="w-full bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#E5E7EB] text-sm font-medium mb-2">
              分类
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#F9FAFB] focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              <option value="">无分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#2D2D3A] text-[#9CA3AF] py-3 rounded-xl font-medium hover:bg-[#232330] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? '保存中...' : prompt ? '保存修改' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}