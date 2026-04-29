import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      navigate('/prompts')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
            PromptVault
          </h1>
          <p className="text-[#9CA3AF] mt-2">登录到你的提示词库</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[#E5E7EB] text-sm font-medium mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#E5E7EB] text-sm font-medium mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#232330] border border-[#2D2D3A] rounded-xl px-4 py-3 text-[#F9FAFB] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-[#71717A]">还没有账号？</span>
            <Link
              to="/register"
              className="text-[#818CF8] hover:text-[#C084FC] transition-colors ml-1"
            >
              立即注册
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-[#71717A] hover:text-[#9CA3AF] text-sm transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}