import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import AuthCard from '../components/AuthCard'

const LoginPage = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null
  if (user) {
    const to = location.state?.from || '/notes'
    return <Navigate to={to} replace />
  }

  return (
    <div className="auth-page">
      <AuthCard />
    </div>
  )
}

export default LoginPage
