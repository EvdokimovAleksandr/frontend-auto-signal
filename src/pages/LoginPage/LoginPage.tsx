import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { loginRequest, getCurrentUserRequest } from '@/store/auth/authSlice'
import { Button, ErrorMessage } from '@/components/ui'
import './LoginPage.scss'

const LoginPage = () => {
  const [telegramInput, setTelegramInput] = useState('')
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  // Проверяем, есть ли уже токен при загрузке
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      dispatch(getCurrentUserRequest())
    }
  }, [dispatch])

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (telegramInput.trim()) {
      dispatch(loginRequest({
        telegramInput: telegramInput.trim(),
      }))
    }
  }

  return (
        <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">🔐 Вход / Регистрация</h1>
        
        <div className="login-info-box">
          <p className="login-info-title">
            <strong>Как это работает:</strong>
          </p>
          <ul className="login-info-list">
            <li>✅ <strong>Логин и регистрация</strong> - это один процесс</li>
            <li>✅ Если вы <strong>новый пользователь</strong> - аккаунт создастся автоматически</li>
            <li>✅ Если вы <strong>уже зарегистрированы</strong> - просто войдите с вашим username или User ID</li>
            <li>✅ <strong>Можно ввести @username</strong> — система автоматически определит ваш User ID</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="telegramInput">
              Username или User ID <span className="required">*</span>
            </label>
            <input
              id="telegramInput"
              type="text"
              value={telegramInput}
              onChange={(e) => setTelegramInput(e.target.value)}
              placeholder="@username или 123456789"
              required
            />
            <div className="field-hint">
              <strong>Вариант 1 (рекомендуется):</strong> Введите ваш username с @ (например, @username)
              <br />
              <strong>Вариант 2:</strong> Введите числовой User ID (например, 123456789)
            </div>
          </div>
          {error && <ErrorMessage message={error} />}
          <Button
            type="submit"
            disabled={loading || !telegramInput.trim()}
            className="btn-submit"
          >
            {loading ? '⏳ Вход...' : '🚀 Войти / Зарегистрироваться'}
          </Button>
          <div className="login-help">
            <p><strong>💡 Подсказка:</strong> Введите username с @ или числовой User ID для входа.</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
