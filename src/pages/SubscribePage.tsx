import { Link } from 'react-router-dom'
import { PLANS } from '../config/plans'

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-[#0F0F14]">
      {/* Header */}
      <header className="bg-[#1A1A24] border-b border-[#2D2D3A] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/prompts" className="text-xl font-bold bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
            PromptVault
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F9FAFB] mb-4">
            选择你的计划
          </h1>
          <p className="text-[#9CA3AF] text-lg">
            解锁更多功能，让你的 AI 效率提升 10 倍
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#1A1A24] border rounded-2xl p-6 flex flex-col ${
                plan.id === 'pro' 
                  ? 'border-[#6366F1] shadow-lg shadow-[#6366F1]/20' 
                  : 'border-[#2D2D3A]'
              }`}
            >
              {plan.id === 'pro' && (
                <div className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4 w-fit">
                  推荐
                </div>
              )}
              
              <h3 className="text-xl font-bold text-[#F9FAFB] mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#F9FAFB]">
                  {plan.price === 0 ? '免费' : `¥${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-[#71717A]">/{plan.interval === 'month' ? '月' : '年'}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-[#9CA3AF]">
                    <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  plan.id === 'free'
                    ? 'border border-[#2D2D3A] text-[#9CA3AF] hover:bg-[#232330]'
                    : plan.id === 'pro'
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white hover:opacity-90'
                    : 'border border-[#6366F1] text-[#818CF8] hover:bg-[#6366F1]/10'
                }`}
              >
                {plan.price === 0 ? '当前方案' : `升级到 ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#F9FAFB] text-center mb-8">常见问题</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-6">
              <h3 className="font-semibold text-[#F9FAFB] mb-2">可以随时取消吗？</h3>
              <p className="text-[#9CA3AF] text-sm">当然可以。随时可以在账户设置中取消，取消后你的高级功能会保留到当月账单到期。</p>
            </div>
            <div className="bg-[#1A1A24] border border-[#2D2D3A] rounded-2xl p-6">
              <h3 className="font-semibold text-[#F9FAFB] mb-2">如何升级或降级？</h3>
              <p className="text-[#9CA3AF] text-sm">可以在账户设置中随时更改计划。升级立即生效，降级则在账单到期后生效。</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
