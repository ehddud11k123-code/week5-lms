import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const { user, loading, loginWithGoogle, logout } = useAuthContext()
  return {
    user,
    loading,
    isLoggedIn: !!user,
    hasPurchased: user?.has_purchased ?? false,
    loginWithGoogle,
    logout,
  }
}
