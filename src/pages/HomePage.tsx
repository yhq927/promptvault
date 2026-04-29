import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F0F14]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
          PromptVault
        </h1>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            登录
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            立即开始
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-[#F9FAFB] mb-6 leading-tight">
          管理你的 AI 提示词
          <br />
          <span className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
            变得前所未有的简单
          </span>
        </h2>
        <p className="text-xl text-[#9CA3AF] mb-10 max-w-2xl mx-auto">
          收藏、整理、分类、快速复用。告别复制粘贴，让好的提示词一直都在。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white px-8 py-4 rounded-xl font-medium text-lg hover:opacity-90 transition-opacity"
          >
            免费开始使用
          </Link>
          <Link
            to="/login"
            className="border border-[#2D2D3A] text-[#9CA3AF] px-8 py-4 rounded-xl font-medium text-lg hover:border-[#6366F1] hover:text-[#F9FAFB] transition-all"
          >
            已有账号？登录
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h3 className="text-3xl font-bold text-[#F9FAFB] text-center mb-12">
          为什么选择 PromptVault？
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#6366F1] to-[#818CF8] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-[#F9FAFB] mb-3">一键收藏</h4>
            <p className="text-[#9CA3AF]">看到好的提示词，一键保存到你的私人库，再也不会丢失。</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#818CF8] to-[#C084FC] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-[#F9FAFB] mb-3">秒级搜索</h4>
            <p className="text-[#9CA3AF]">输入关键词，瞬间找到你需要的提示词，无需翻找。</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#C084FC] to-[#F472B6] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-[#F9FAFB] mb-3">一键复制</h4>
            <p className="text-[#9CA3AF]">点击复制，直接粘贴到 AI 对话框使用，省时省力。</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2D2D3A] py-8 text-center">
        <p className="text-[#71717A]">© 2026 PromptVault. 帮你管理 AI 提示词。</p>
      </footer>
    </div>
  )
}