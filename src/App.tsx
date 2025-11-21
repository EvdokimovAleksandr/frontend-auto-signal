import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './utils/hooks'
import { getCurrentUserRequest } from './store/auth/authSlice'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import SearchCarPage from './pages/SearchCarPage/SearchCarPage'
import UsersPage from './pages/UsersPage/UsersPage'
import SubscriptionsPage from './pages/SubscriptionsPage/SubscriptionsPage'
import AdminPage from './pages/AdminPage/AdminPage'
import LoginPage from './pages/LoginPage/LoginPage'
import HelpPage from './pages/HelpPage/HelpPage'
import ManageCarsPage from './pages/ManageCarsPage/ManageCarsPage'
import ManageFilesPage from './pages/ManageFilesPage/ManageFilesPage'
import ManageDescriptionsPage from './pages/ManageDescriptionsPage/ManageDescriptionsPage'

function App() {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)

  // Проверяем текущего пользователя при загрузке приложения
  useEffect(() => {
    if (token) {
      dispatch(getCurrentUserRequest())
    }
  }, [dispatch, token])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<SearchCarPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/manage-cars" element={<ManageCarsPage />} />
        <Route path="/admin/manage-files" element={<ManageFilesPage />} />
        <Route path="/admin/manage-descriptions" element={<ManageDescriptionsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Layout>
  )
}

export default App

