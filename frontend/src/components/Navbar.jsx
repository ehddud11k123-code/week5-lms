import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">AI/ML Week 5</Link>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {user?.avatar_url && (
              <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm text-gray-600">{user?.name}</span>
            {user?.has_purchased && (
              <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline">대시보드</Link>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            로그인
          </Link>
        )}
      </div>
    </nav>
  )
}
