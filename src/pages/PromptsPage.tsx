import { useEffect, useState } from 'react'
import { usePromptStore } from '../stores/promptStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useAuthStore } from '../stores/authStore'
import PromptCard from '../components/features/PromptCard'
import PromptModal from '../components/features/PromptModal'
import ShareModal from '../components/features/ShareModal'
import ImportExport from '../components/features/ImportExport'
import MobileSidebar from '../components/layout/MobileSidebar'
import type { CreatePromptInput, Prompt } from '../types'

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function PromptsPage() {
  const { user, signOut } = useAuthStore()
  const { 
    loading, 
    error, 
    fetchPrompts, 
    createPrompt, 
    updatePrompt, 
    deletePrompt,
    selectedCategoryId,
    setSelectedCategory,
    filteredPrompts,
    setSearchQuery 
  } = usePromptStore()
  const { categories, fetchCategories, createCategory } = useCategoryStore()
  
  const [showModal, setShowModal] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sharingPrompt, setSharingPrompt] = useState<Prompt | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const debouncedSearchInput = useDebounce(searchInput, 300)

  // Update store when debounced search changes
  useEffect(() => {
    setSearchQuery(debouncedSearchInput)
  }, [debouncedSearchInput, setSearchQuery])

  useEffect(() => {
    fetchPrompts()
    fetchCategories()
  }, [])

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个提示词吗？')) {
      await deletePrompt(id)
    }
  }

  const handleSubmit = async (data: CreatePromptInput) => {
    if (editingPrompt) {
      await updatePrompt({ ...data, id: editingPrompt.id })
    } else {
      await createPrompt(data)
    }
    setEditingPrompt(null)
  }

  const handleCreateCategory = async () => {
    if (newCategoryName.trim()) {
      await createCategory(newCategoryName.trim())
      setNewCategoryName('')
      setShowNewCategory(false)
    }
  }

  const handleShare = (prompt: Prompt) => {
    setSharingPrompt(prompt)
  }

  const handleImport = async (imported: Partial<Prompt>[]) => {
    for (const item of imported) {
      await createPrompt({
        title: item.title || '未命名',
        content: item.content || '',
        description: item.description,
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F14] flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-[#1A1A24] border-r border-[#2D2D3A] flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[#2D2D3A]">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
            PromptVault
          </h1>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#9CA3AF] text-sm font-medium">分类</h2>
            <button
              onClick={() => setShowNewCategory(true)}
              className="p-1 text-[#71717A] hover:text-[#818CF8] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* All Prompts */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-xl mb-1 transition-colors ${
              !selectedCategoryId 
                ? 'bg-[#6366F1]/20 text-[#818CF8]' 
                : 'text-[#9CA3AF] hover:bg-[#232330]'
            }`}
          >
            📋 全部提示词
          </button>

          {/* Category List */}
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-xl mb-1 flex items-center gap-2 transition-colors ${
                selectedCategoryId === cat.id
                  ? 'bg-[#6366F1]/20 text-[#818CF8]'
                  : 'text-[#9CA3AF] hover:bg-[#232330]'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="truncate">{cat.name}</span>
            </button>
          ))}

          {/* New Category Input */}
          {showNewCategory && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="分类名称"
                className="flex-1 bg-[#232330] border border-[#2D2D3A] rounded-lg px-3 py-2 text-sm text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1]"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              />
              <button
                onClick={handleCreateCategory}
                className="p-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* User */}
        <div className="p-4 border-t border-[#2D2D3A]">
          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF] text-sm truncate">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="p-2 text-[#71717A] hover:text-red-400 transition-colors"
              title="退出登录"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#1A1A24] border-b border-[#2D2D3A] px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 text-[#71717A] hover:text-[#818CF8] transition-colors"
                aria-label="打开菜单"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-[#F9FAFB]">
              {selectedCategoryId 
                ? categories.find(c => c.id === selectedCategoryId)?.name 
                : '我的提示词'}
            </h2>
            </div>
            <div className="flex items-center gap-4">
              {/* Import/Export */}
              <ImportExport prompts={filteredPrompts()} onImport={handleImport} />
              
              {/* Search Box */}
              <div className="relative hidden sm:block">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="搜索提示词..."
                  className="w-64 bg-[#232330] border border-[#2D2D3A] rounded-xl pl-10 pr-4 py-2 text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors"
                />
              </div>
              <button
                onClick={() => { setEditingPrompt(null); setShowModal(true); }}
                className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建提示词
              </button>
            </div>
          </div>
        </header>

        {/* Prompts Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-[#818CF8]">加载中...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
              {error}
            </div>
          ) : filteredPrompts().length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-[#232330] rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-[#F9FAFB] font-medium mb-2">还没有提示词</h3>
              <p className="text-[#71717A] mb-4">点击"新建提示词"开始创建</p>
              <button
                onClick={() => { setEditingPrompt(null); setShowModal(true); }}
                className="bg-[#6366F1] text-white px-5 py-2 rounded-xl font-medium hover:bg-[#4F46E5] transition-colors"
              >
                创建第一个提示词
              </button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrompts().map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <PromptModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingPrompt(null); }}
        onSubmit={handleSubmit}
        prompt={editingPrompt}
        categories={categories}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={!!sharingPrompt}
        onClose={() => setSharingPrompt(null)}
        prompt={sharingPrompt!}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategory}
        onCreateCategory={() => setShowNewCategory(true)}
        showNewCategory={showNewCategory}
        newCategoryName={newCategoryName}
        onNewCategoryNameChange={setNewCategoryName}
        onAddCategory={handleCreateCategory}
        userEmail={user?.email}
        onSignOut={signOut}
      />
    </div>
  )
}