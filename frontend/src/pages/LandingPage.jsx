import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function LandingPage() {
  const { isLoggedIn, hasPurchased } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/payment/checkout-url`)
      window.location.href = res.data.url
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">AI/ML 강의</span>
          <h1 className="text-5xl font-bold text-gray-900 mt-3 mb-6">Week 5: 딥러닝 성능 향상</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            규제 기법, 데이터 증강, 전이 학습, CNN까지 — 딥러닝 모델 성능을 극대화하는 5가지 핵심 기법을 학습하세요.
          </p>
        </div>

        {/* 커리큘럼 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { emoji: "🛡️", title: "규제 기법", desc: "L1/L2, Dropout, Batch Normalization" },
            { emoji: "📊", title: "모델 복잡도", desc: "과적합 vs 과소적합 이해와 해결" },
            { emoji: "🔄", title: "데이터 증강", desc: "이미지 회전, 반전, 확대/축소" },
            { emoji: "🧠", title: "전이 학습", desc: "MobileNetV2로 적은 데이터에서 고성능" },
            { emoji: "🔬", title: "CNN 실습", desc: "MNIST 손글씨 인식 구현" },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          {hasPurchased ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
            >
              강의 시작하기 →
            </button>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? '처리 중...' : '지금 구매하기'}
            </button>
          )}
          <p className="text-sm text-gray-400 mt-3">일회성 구매 · 영구 접근</p>
        </div>
      </div>
    </div>
  )
}
