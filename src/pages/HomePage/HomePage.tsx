import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { getBrandsRequest } from '../../store/cars/carsSlice'
import './HomePage.css'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const { brands, loading, error: carsError } = useAppSelector((state) => state.cars)
  const { isAuthenticated, isPremium, isAdmin } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getBrandsRequest())
  }, [dispatch])

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>🚗 Добро пожаловать в Auto Signal</h1>
        <p className="subtitle">Система управления автомобильными данными</p>
        <p className="description">
          Этот бот помогает подобрать и получить информацию о сигнализациях для автомобилей.
          <br />
          🔎 Выбирай марку → модель → год → и получай нужные файлы.
          <br />
          {isPremium ? (
            <span className="premium-text">💎 Вы являетесь премиум пользователем!</span>
          ) : (
            <span>💎 Премиум-пользователи получают доступ к расширенным материалам и эксклюзивным файлам.</span>
          )}
        </p>
      </div>

      <div className="actions-section">
        <Link to="/cars" className="action-card primary">
          <div className="action-icon">🔍</div>
          <h3>Найти авто</h3>
          <p>Выберите марку, модель и год для получения файлов</p>
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/subscriptions" className="action-card">
              <div className="action-icon">💎</div>
              <h3>Премиум</h3>
              <p>Управление подпиской и доступ к премиум контенту</p>
            </Link>

            {isAdmin && (
              <Link to="/admin" className="action-card admin">
                <div className="action-icon">🛠️</div>
                <h3>Админ панель</h3>
                <p>Управление системой и контентом</p>
              </Link>
            )}
          </>
        )}

        {!isAuthenticated && (
          <Link to="/login" className="action-card">
            <div className="action-icon">🔐</div>
            <h3>Войти</h3>
            <p>Войдите для доступа к дополнительным функциям</p>
          </Link>
        )}
      </div>

      {loading ? (
        <p>Загрузка статистики...</p>
      ) : carsError ? (
        <div className="error-message">
          <p>❌ Ошибка загрузки данных: {carsError}</p>
          <p>Проверьте, что backend сервер запущен на http://localhost:8000</p>
        </div>
      ) : (
        <div className="stats-section">
          <div className="stat-card">
            <h3>Марок автомобилей</h3>
            <p className="stat-number">{brands.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage

