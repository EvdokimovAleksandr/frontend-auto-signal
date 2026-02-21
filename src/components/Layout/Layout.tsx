import { memo, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/utils/hooks'
import { logout } from '@/store/auth/authSlice'
import { getDisplayName } from '@/utils/user'
import { Button, Badge } from '@/components/ui'
import './Layout.scss'

interface LayoutProps {
  children: ReactNode
}

const Layout = memo(({ children }: LayoutProps) => {
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
                {isPremium && <Badge variant="premium">💎 Premium</Badge>}
                {isAdmin && <Badge variant="admin">👑 Admin</Badge>}
                <span className="user-name">{getDisplayName(user)}</span>
                <Button variant="danger" onClick={handleLogout}>
                  Выйти
                </Button>
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
        <p>&copy; 2025 Auto Signal. All rights reserved.</p>
      </footer>
    </div>
  )
})

Layout.displayName = 'Layout'

export default Layout
