import { useState } from 'react'
import type { Prompt } from '../../types'
import { useTemplateVariables } from '../../hooks/useTemplateVariables'
import TemplateVariablePanel from './TemplateVariablePanel'

interface PromptCardProps {
  prompt: Prompt
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
  onCopy: (content: string) => void
  onShare?: (prompt: Prompt) => void
}

export default function PromptCard({ prompt, onEdit, onDelete, onCopy, onShare }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showVariables, setShowVariables] = useState(false)
  
  // 模板变量功能
  const { 
    variables,
    updateVariable,
    generateContent,
  } = useTemplateVariables(prompt.content)

  // 检测是否有变量
  const hasVariables = variables.length > 0

  const handleCopy = async () => {
    let contentToCopy = prompt.content
    
    // 如果有变量，使用填充后的内容
    if (hasVariables) {
      contentToCopy = generateContent()
    }
    
    await onCopy(contentToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateAndCopy = async () => {
    const contentToCopy = generateContent()
    await onCopy(contentToCopy)
    setCopied(true)
    setShowVariables(false)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-5 hover:border-[#6366F1]/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {prompt.category && (
            <span 
              className="text-lg"
              style={{ color: prompt.category.color }}
            >
              {prompt.category.icon}
            </span>
          )}
          <h3 className="font-semibold text-[#F9FAFB] group-hover:text-[#818CF8] transition-colors">
            {prompt.title}
          </h3>
        </div>
        
        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-[#71717A] hover:text-[#9CA3AF] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-[#232330] border border-[#2D2D3A] rounded-xl py-2 min-w-[140px] z-10">
              {onShare && (
                <button
                  onClick={() => { onShare(prompt); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-[#9CA3AF] hover:bg-[#2D2D3A] hover:text-[#F9FAFB] transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享
                </button>
              )}
              <button
                onClick={() => { onEdit(prompt); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-[#9CA3AF] hover:bg-[#2D2D3A] hover:text-[#F9FAFB] transition-colors text-sm"
              >
                编辑
              </button>
              <button
                onClick={() => { onDelete(prompt.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors text-sm"
              >
                删除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {prompt.description && (
        <p className="text-[#71717A] text-sm mb-3 line-clamp-2">
          {prompt.description}
        </p>
      )}

      {/* Content Preview */}
      <div className="bg-[#232330] rounded-xl p-3 mb-4">
        <p className="text-[#9CA3AF] text-sm line-clamp-3 font-mono">
          {prompt.content}
        </p>
      </div>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.map(tag => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-[#232330] text-[#818CF8] text-xs rounded-lg"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Template Variables Panel */}
      {hasVariables && showVariables && (
        <TemplateVariablePanel
          variables={variables}
          onUpdateVariable={updateVariable}
          onGenerate={handleGenerateAndCopy}
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-[#71717A]">
          <span>使用 {prompt.usage_count} 次</span>
          <span>{new Date(prompt.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {hasVariables && (
            <button
              onClick={() => setShowVariables(!showVariables)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showVariables 
                  ? 'bg-[#818CF8]/20 text-[#818CF8]' 
                  : 'bg-[#232330] text-[#9CA3AF] hover:bg-[#2D2D3A]'
              }`}
            >
              {showVariables ? '收起变量' : '填充变量'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              copied 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-[#6366F1] text-white hover:bg-[#4F46E5]'
            }`}
          >
            {copied ? '✓ 已复制' : '复制'}
          </button>
        </div>
      </div>
    </div>
  )
}