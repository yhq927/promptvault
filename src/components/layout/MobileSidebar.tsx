import type { Category } from '../../types'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  selectedCategoryId: string | null
  onSelectCategory: (id: string | null) => void
  onCreateCategory: () => void
  showNewCategory: boolean
  newCategoryName: string
  onNewCategoryNameChange: (name: string) => void
  onAddCategory: () => void
  userEmail?: string
  onSignOut: () => void
}

export default function MobileSidebar({
  isOpen,
  onClose,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCreateCategory,
  showNewCategory,
  newCategoryName,
  onNewCategoryNameChange,
  onAddCategory,
  userEmail,
  onSignOut,
}: MobileSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#1A1A24] border-r border-[#2D2D3A] z-50 transform transition-transform duration-300 md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2D2D3A]">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
            PromptVault
          </h1>
          <button onClick={onClose} className="p-2 text-[#71717A] hover:text-[#818CF8] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Categories */}
        <div className="p-4 overflow-y-auto h-[calc(100%-180px)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#9CA3AF] text-sm font-medium">分类</h2>
            <button
              onClick={onCreateCategory}
              className="p-1 text-[#71717A] hover:text-[#818CF8] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* All Prompts */}
          <button
            onClick={() => { onSelectCategory(null); onClose(); }}
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
              onClick={() => { onSelectCategory(cat.id); onClose(); }}
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
                onChange={(e) => onNewCategoryNameChange(e.target.value)}
                placeholder="分类名称"
                className="flex-1 bg-[#232330] border border-[#2D2D3A] rounded-lg px-3 py-2 text-sm text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1]"
                onKeyDown={(e) => e.key === 'Enter' && onAddCategory()}
                autoFocus
              />
              <button
                onClick={onAddCategory}
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
            <span className="text-[#9CA3AF] text-sm truncate">{userEmail}</span>
            <button
              onClick={onSignOut}
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
    </>
  )
}