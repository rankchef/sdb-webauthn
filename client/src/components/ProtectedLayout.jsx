import { Outlet } from 'react-router-dom'
import Header from './Header'

const ProtectedLayout = () => {
  return (
    <div className="protected-layout">
      <Header />
      <main className="protected-layout-main">
        <Outlet />
      </main>
    </div>
  )
}

export default ProtectedLayout
