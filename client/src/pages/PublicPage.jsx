import { Link } from 'react-router-dom'

const PublicPage = () => {
  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Јавна страница</h2>
        <p className="subtitle">Достапна е без најава.</p>
      </div>
      <nav className="page-nav">
        <Link to="/login">Најава</Link>
        <Link to="/protected">Заштитена страница</Link>
      </nav>
    </div>
  )
}

export default PublicPage
