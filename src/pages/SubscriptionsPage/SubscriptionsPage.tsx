import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { getPricesRequest } from '../../store/subscription/subscriptionSlice'
import './SubscriptionsPage.css'

const SubscriptionsPage = () => {
  const dispatch = useAppDispatch()
  const { prices, loading } = useAppSelector((state) => state.subscription)

  useEffect(() => {
    dispatch(getPricesRequest())
  }, [dispatch])

  return (
    <div className="subscriptions-page">
      <h1>Подписки</h1>
      
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="prices-list">
          {prices.length > 0 ? (
            prices.map((price) => (
              <div key={price.id} className="price-card">
                <h3>{price.period_months} месяц(ев)</h3>
                <p className="price">{(price.price_kopecks / 100).toFixed(2)} ₽</p>
              </div>
            ))
          ) : (
            <p>Цены подписок не найдены</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SubscriptionsPage


