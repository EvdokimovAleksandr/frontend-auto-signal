import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../utils/hooks'
import { logout } from '../../store/auth/authSlice'
import styles from './Layout.module.css'

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
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            Auto Signal
          </Link>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Главная</Link>
            <Link to="/cars" className={styles.navLink}>Автомобили</Link>
            <Link to="/help" className={styles.navLink}>Справка</Link>
            {isAuthenticated && (
              <>
                <Link to="/subscriptions" className={styles.navLink}>Подписки</Link>
                {isAdmin && (
                  <Link to="/admin" className={styles.navLink}>Админ</Link>
                )}
              </>
            )}
            {isAuthenticated ? (
              <div className={styles.userInfo}>
                {isPremium && <span className={styles.premiumBadge}>💎 Premium</span>}
                {isAdmin && <span className={styles.adminBadge}>👑 Admin</span>}
                <span className={styles.userName}>
                  {user?.name || user?.username || `User ${user?.user_id}`}
                </span>
                <button onClick={handleLogout} className={styles.btnLogout}>
                  Выйти
                </button>
              </div>
            ) : (
              <Link to="/login" className={styles.btnLogin}>Войти</Link>
            )}
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>&copy; 2025 Auto Signal. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
