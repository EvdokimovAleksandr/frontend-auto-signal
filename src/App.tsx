import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { getCurrentUserRequest, resetLogoutFlag } from '@/store/auth/authSlice'
import Layout from '@/components/Layout/Layout'
import NavigateSetter from '@/components/NavigateSetter/NavigateSetter'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import HomePage from '@/pages/HomePage/HomePage'
import SearchCarPage from '@/pages/SearchCarPage/SearchCarPage'
import UsersPage from '@/pages/UsersPage/UsersPage'
import SubscriptionsPage from '@/pages/SubscriptionsPage/SubscriptionsPage'
import AdminPage from '@/pages/AdminPage/AdminPage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import HelpPage from '@/pages/HelpPage/HelpPage'
import ManageCarsPage from '@/pages/ManageCarsPage/ManageCarsPage'
import ManageFilesPage from '@/pages/ManageFilesPage/ManageFilesPage'
import ManageDescriptionsPage from '@/pages/ManageDescriptionsPage/ManageDescriptionsPage'

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { token, isLoggingOut, isAuthenticated } = useAppSelector((state) => state.auth)

  // Проверяем текущего пользователя при загрузке приложения
  useEffect(() => {
    if (token && !isLoggingOut) {
      dispatch(getCurrentUserRequest())
    }
  }, [dispatch, token, isLoggingOut])

  // Обрабатываем редирект при логауте
  useEffect(() => {
    if (isLoggingOut && location.pathname !== '/login') {
      navigate('/login')
      // Сбрасываем флаг после редиректа
      dispatch(resetLogoutFlag())
    }
  }, [isLoggingOut, navigate, location.pathname, dispatch])

  return (
    <Layout>
      <NavigateSetter />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<SearchCarPage />} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/manage-cars" element={<ProtectedRoute requireAdmin><ManageCarsPage /></ProtectedRoute>} />
        <Route path="/admin/manage-files" element={<ProtectedRoute requireAdmin><ManageFilesPage /></ProtectedRoute>} />
        <Route path="/admin/manage-descriptions" element={<ProtectedRoute requireAdmin><ManageDescriptionsPage /></ProtectedRoute>} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
