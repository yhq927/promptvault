import { useState } from 'react'
import type { Prompt } from '../../types'

interface ImportExportProps {
  prompts: Prompt[]
  onImport: (prompts: Partial<Prompt>[]) => void
}

export default function ImportExport({ prompts, onImport }: ImportExportProps) {
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleExport = () => {
    const data = prompts.map(p => ({
      title: p.title,
      content: p.content,
      description: p.description || '',
      category: p.category?.name || '',
    }))
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `promptvault-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    setSuccess('导出成功！')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setImporting(true)
    setError('')
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!Array.isArray(data)) {
        throw new Error('文件格式错误')
      }
      
      const imported = data.map((item: { title?: string; content?: string; description?: string }) => ({
        title: item.title || '未命名',
        content: item.content || '',
        description: item.description || '',
      })).filter((item: { content: string }) => item.content)
      
      if (imported.length === 0) {
        throw new Error('没有找到可导入的提示词')
      }
      
      onImport(imported)
      setSuccess(`成功导入 ${imported.length} 个提示词！`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && (
        <span className="text-red-400 text-sm">{error}</span>
      )}
      {success && (
        <span className="text-green-400 text-sm">{success}</span>
      )}
      
      <button
        onClick={handleExport}
        disabled={prompts.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-[#232330] border border-[#2D2D3A] rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#6366F1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        导出
      </button>
      
      <label className="flex items-center gap-2 px-4 py-2 bg-[#232330] border border-[#2D2D3A] rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#6366F1] transition-all cursor-pointer">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {importing ? '导入中...' : '导入'}
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          disabled={importing}
          className="hidden"
        />
      </label>
    </div>
  )
}
