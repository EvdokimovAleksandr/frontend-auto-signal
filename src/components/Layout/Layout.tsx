import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../utils/hooks'
import { logout } from '../../store/auth/authSlice'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, user, isAdmin, isPremium } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Auto Signal
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/cars" className="nav-link">Автомобили</Link>
            <Link to="/help" className="nav-link">Справка</Link>
            {isAuthenticated && (
              <>
                <Link to="/subscriptions" className="nav-link">Подписки</Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link">Админ</Link>
                )}
              </>
            )}
            {isAuthenticated ? (
              <div className="user-info">
                {isPremium && <span className="premium-badge">💎 Premium</span>}
                {isAdmin && <span className="admin-badge">👑 Admin</span>}
                <span className="user-name">{user?.name || user?.username || `User ${user?.user_id}`}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Выйти
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-login">Войти</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Auto Signal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

