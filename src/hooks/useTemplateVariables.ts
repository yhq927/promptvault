import { useState, useCallback } from 'react'

interface Variable {
  key: string
  defaultValue: string
  currentValue: string
}

// 解析提示词中的变量 {{variable_name}} 或 {{variable_name::default_value}}
export function useTemplateVariables(initialContent: string = '') {
  const [content, setContent] = useState(initialContent)
  const [variables, setVariables] = useState<Variable[]>([])

  // 解析内容中的变量
  const parseVariables = useCallback((text: string) => {
    const regex = /\{\{(.+?)(?:::(.*?))?\}\}/g
    const found: Variable[] = []
    let match
    
    while ((match = regex.exec(text)) !== null) {
      const key = match[1].trim()
      const defaultValue = match[2]?.trim() || ''
      
      if (!found.some(v => v.key === key)) {
        found.push({
          key,
          defaultValue,
          currentValue: defaultValue,
        })
      }
    }
    
    return found
  }, [])

  // 更新内容时自动解析变量
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent)
    setVariables(parseVariables(newContent))
  }, [parseVariables])

  // 更新单个变量的值
  const updateVariable = useCallback((key: string, value: string) => {
    setVariables(prev => 
      prev.map(v => v.key === key ? { ...v, currentValue: value } : v)
    )
  }, [])

  // 生成最终内容（替换变量）
  const generateContent = useCallback(() => {
    let result = content
    variables.forEach(v => {
      const regex = new RegExp(`\\{\\{${v.key}(?:::.*?)?\\}\\}`, 'g')
      result = result.replace(regex, v.currentValue || v.defaultValue)
    })
    return result
  }, [content, variables])

  // 检查是否有未填充的变量
  const hasUnfilledVariables = useCallback(() => {
    return variables.some(v => !v.currentValue && !v.defaultValue)
  }, [variables])

  return {
    content,
    updateContent,
    variables,
    updateVariable,
    generateContent,
    hasUnfilledVariables,
  }
}