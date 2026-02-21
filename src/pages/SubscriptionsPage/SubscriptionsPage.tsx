import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { 
  getPricesRequest, 
  getUserSubscriptionRequest,
  createSubscriptionRequest,
  deleteSubscriptionRequest
} from '@/store/subscription/subscriptionSlice'
import { LoadingSpinner } from '@/components/ui'
import './SubscriptionsPage.scss'

const SubscriptionsPage = () => {
  const dispatch = useAppDispatch()
  const { prices, userSubscription, loading } = useAppSelector((state) => state.subscription)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getPricesRequest())
    if (user?.user_id) {
      dispatch(getUserSubscriptionRequest(user.user_id))
    }
  }, [dispatch, user])

  const handleSubscribe = async (periodMonths: number) => {
    if (!user?.user_id) {
      alert('Необходимо войти в систему')
      return
    }

    if (!confirm(`Вы уверены, что хотите оформить подписку на ${periodMonths} месяц(ев)?`)) {
      return
    }

    try {
      dispatch(createSubscriptionRequest({ userId: user.user_id, periodMonths }))
      alert('Подписка успешно оформлена!')
      dispatch(getUserSubscriptionRequest(user.user_id))
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при оформлении подписки')
    }
  }

  const handleCancelSubscription = async () => {
    if (!user?.user_id) {
      return
    }

    if (!confirm('Вы уверены, что хотите отменить подписку?')) {
      return
    }

    try {
      dispatch(deleteSubscriptionRequest(user.user_id))
      alert('Подписка отменена')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при отмене подписки')
    }
  }

  const getPeriodText = (months: number) => {
    if (months === 1) return 'месяц'
    if (months < 5) return `${months} месяца`
    return `${months} месяцев`
  }

  const isSubscriptionActive = () => {
    if (!userSubscription) return false
    const subEnd = new Date(userSubscription.sub_end)
    return subEnd > new Date()
  }

  return (
    <div className="subscriptions-page">
      <h1>💎 Премиум подписка</h1>
      
      {userSubscription && isSubscriptionActive() && (
        <div className="current-subscription">
          <h2>📅 Ваша текущая подписка</h2>
          <div className="subscription-info">
            <p><strong>Период:</strong> {getPeriodText(userSubscription.period_months || 1)}</p>
            <p><strong>Окончание:</strong> {new Date(userSubscription.sub_end).toLocaleDateString('ru-RU')}</p>
            <p><strong>Статус:</strong> <span className="status-active">✅ Активна</span></p>
            <button onClick={handleCancelSubscription} className="btn-cancel-subscription">
              ❌ Отменить подписку
            </button>
          </div>
        </div>
      )}

      {(!userSubscription || !isSubscriptionActive()) && (
        <div className="subscription-benefits">
          <h2>Оформи премиум и получи больше:</h2>
          <ul>
            <li>🔓 Доступ к эксклюзивным фото</li>
            <li>📦 Расширенные материалы по сигнализациям</li>
            <li>📁 Файлы, недоступные обычным пользователям</li>
            <li>🎯 Всё — сразу на сайте, без лишних запросов</li>
          </ul>
        </div>
      )}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="prices-list">
          <h2>⏳ Выберите период подписки:</h2>
          {prices.length > 0 ? (
            prices.map((price) => {
              const priceRub = price.price_rub ?? (price.price_kopecks ? price.price_kopecks / 100 : 0)
              
              return (
                <div key={price.period_months} className="price-card">
                  <h3>{getPeriodText(price.period_months)}</h3>
                  <p className="price">{priceRub.toFixed(2)} ₽</p>
                  {user ? (
                    <button 
                      onClick={() => handleSubscribe(price.period_months)}
                      className="btn-subscribe"
                      disabled={isSubscriptionActive()}
                    >
                      {isSubscriptionActive() ? '✅ У вас уже есть активная подписка' : '💳 Оформить подписку'}
                    </button>
                  ) : (
                    <p className="login-hint">Войдите в систему для оформления подписки</p>
                  )}
                </div>
              )
            })
          ) : (
            <p>Цены подписок не найдены</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SubscriptionsPage



