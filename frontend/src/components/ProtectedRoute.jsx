import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, requirePurchase = false }) {
  const { isLoggedIn, hasPurchased, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (requirePurchase && !hasPurchased) return <Navigate to="/" replace />

  return children
}
