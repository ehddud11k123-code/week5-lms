import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CoursePage from './pages/CoursePage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requirePurchase>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/week5"
                element={
                  <ProtectedRoute requirePurchase>
                    <CoursePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
