import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard'), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h1>
        <p className="text-gray-500 mb-6">
          {user?.name}님, 구매해 주셔서 감사합니다.<br/>
          3초 후 대시보드로 이동합니다.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700"
        >
          지금 바로 학습하기 →
        </button>
      </div>
    </div>
  )
}
