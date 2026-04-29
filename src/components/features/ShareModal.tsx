import { useState } from 'react'
import type { Prompt } from '../../types'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  prompt: Prompt
}

export default function ShareModal({ isOpen, onClose, prompt }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = `${window.location.origin}/shared/${prompt.id}`
  
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2D2D3A]">
          <h2 className="text-xl font-bold text-[#F9FAFB]">分享提示词</h2>
          <button onClick={onClose} className="p-2 text-[#71717A] hover:text-[#9CA3AF]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-semibold text-[#F9FAFB] mb-2">{prompt.title}</h3>
          <p className="text-[#71717A] text-sm mb-6 line-clamp-2">{prompt.description || '无描述'}</p>
          
          {/* Share Link */}
          <div className="mb-6">
            <label className="block text-[#9CA3AF] text-sm mb-2">分享链接</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#9CA3AF] text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-[#6366F1] text-white hover:bg-[#4F46E5]'
                }`}
              >
                {copied ? '✓ 已复制' : '复制'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#232330] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#818CF8] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-[#9CA3AF]">
                <p>分享后，任何人都可以通过链接查看这个提示词。</p>
                <p className="mt-1">他们可以一键复制，但不能编辑或删除。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
