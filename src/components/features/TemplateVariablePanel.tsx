import type { Variable } from '../../types'

interface TemplateVariablePanelProps {
  variables: Variable[]
  onUpdateVariable: (key: string, value: string) => void
  onGenerate: () => void
  disabled?: boolean
}

export default function TemplateVariablePanel({ 
  variables, 
  onUpdateVariable, 
  onGenerate,
  disabled 
}: TemplateVariablePanelProps) {
  if (variables.length === 0) return null

  return (
    <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-5 mb-5">
      <h3 className="text-[#E5E7EB] font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        模板变量
      </h3>
      
      <div className="space-y-4">
        {variables.map(variable => (
          <div key={variable.key}>
            <label className="block text-[#9CA3AF] text-sm mb-2">
              {variable.key}
              {variable.defaultValue && (
                <span className="text-[#71717A] ml-2">
                  （默认值：{variable.defaultValue}）
                </span>
              )}
            </label>
            <input
              type="text"
              value={variable.currentValue}
              onChange={(e) => onUpdateVariable(variable.key, e.target.value)}
              placeholder={variable.defaultValue || `输入 ${variable.key}`}
              disabled={disabled}
              className="w-full bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled}
        className="w-full mt-5 bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        应用变量并复制
      </button>
    </div>
  )
}