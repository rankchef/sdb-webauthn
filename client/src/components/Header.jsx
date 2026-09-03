import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="app-header">
      <Link to="/notes" className="app-header-brand">SDB WebAuthN</Link>
      <div className="app-header-actions">
        <span>{user.username}</span>
        <button className="btn-primary" type="button" onClick={logout}>
          Одјави се
        </button>
      </div>
    </header>
  )
}

export default Header
