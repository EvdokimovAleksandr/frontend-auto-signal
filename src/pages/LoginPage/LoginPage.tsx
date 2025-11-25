import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { loginRequest, getCurrentUserRequest } from '../../store/auth/authSlice'
import { Button, Input } from '../../components'
import styles from './LoginPage.module.css'

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
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>🔐 Вход / Регистрация</h1>
        
        <div className={styles.infoBox}>
          <p className={styles.infoTitle}>
            <strong>Как это работает:</strong>
          </p>
          <ul className={styles.infoList}>
            <li>✅ <strong>Логин и регистрация</strong> — это один процесс</li>
            <li>✅ Если вы <strong>новый пользователь</strong> — аккаунт создастся автоматически</li>
            <li>✅ Если вы <strong>уже зарегистрированы</strong> — просто войдите</li>
            <li>✅ <strong>Можно ввести @username</strong> — система получит ваш User ID</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Telegram Username или User ID"
            value={telegramInput}
            onChange={(e) => setTelegramInput(e.target.value)}
            placeholder="@NucWinter или 123456789"
            required
            fullWidth
            hint={
              <>
                <strong>Вариант 1:</strong> Введите ваш Telegram username с @<br />
                <strong>Вариант 2:</strong> Введите числовой User ID<br />
                <strong>💡</strong> Система автоматически получит User ID через Telegram Bot API
              </>
            }
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button
            type="submit"
            disabled={!telegramInput.trim()}
            loading={loading}
            fullWidth
            size="large"
          >
            🚀 Войти / Зарегистрироваться
          </Button>

          <div className={styles.helpBox}>
            <p>
              <strong>💡 Подсказка:</strong> Просто введите ваш Telegram username 
              (например, @NucWinter) и система автоматически получит ваш User ID.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
