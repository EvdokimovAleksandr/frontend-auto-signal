import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { 
  getStatsRequest, 
  getAdminsRequest, 
  getPricesRequest 
} from '../../store/admin/adminSlice'
import { adminService } from '../../services/adminService'
import './AdminPage.css'

const AdminPage = () => {
  const dispatch = useAppDispatch()
  const { stats, admins, prices, loading } = useAppSelector((state) => state.admin)
  const { isAdmin } = useAppSelector((state) => state.auth)
  
  const [activeTab, setActiveTab] = useState<'stats' | 'admins' | 'prices'>('stats')
  const [newAdminInput, setNewAdminInput] = useState('')
  const [editingPrice, setEditingPrice] = useState<{ periodMonths: number; priceKopecks: number } | null>(null)

  useEffect(() => {
    if (isAdmin) {
      dispatch(getStatsRequest())
      dispatch(getAdminsRequest())
      dispatch(getPricesRequest())
    }
  }, [dispatch, isAdmin])

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          <h2>🔒 Доступ запрещен</h2>
          <p>У вас нет прав администратора для доступа к этой странице.</p>
        </div>
      </div>
    )
  }

  const handleAddAdmin = async () => {
    if (!newAdminInput.trim()) return
    
    try {
      await adminService.addAdmin(newAdminInput.trim())
      setNewAdminInput('')
      dispatch(getAdminsRequest())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при добавлении администратора')
    }
  }

  const handleRemoveAdmin = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого администратора?')) return
    
    try {
      await adminService.removeAdmin(userId)
      dispatch(getAdminsRequest())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении администратора')
    }
  }

  const handleUpdatePrice = async (periodMonths: number, priceKopecks: number) => {
    try {
      await adminService.updatePrice(periodMonths, priceKopecks)
      setEditingPrice(null)
      dispatch(getPricesRequest())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении цены')
    }
  }

  return (
    <div className="admin-page">
      <h1>⚙️ Админ панель</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          📊 Статистика
        </button>
        <button 
          className={activeTab === 'admins' ? 'active' : ''}
          onClick={() => setActiveTab('admins')}
        >
          👥 Администраторы
        </button>
        <button 
          className={activeTab === 'prices' ? 'active' : ''}
          onClick={() => setActiveTab('prices')}
        >
          💰 Цены подписок
        </button>
      </div>

      {loading && <p className="loading">Загрузка...</p>}

      {activeTab === 'stats' && stats && (
        <div className="stats-section">
          <h2>Статистика системы</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Всего пользователей</h3>
              <p className="stat-number">{stats.total_users}</p>
            </div>
            <div className="stat-card">
              <h3>Премиум пользователей</h3>
              <p className="stat-number">{stats.premium_users}</p>
            </div>
            <div className="stat-card">
              <h3>Обычных пользователей</h3>
              <p className="stat-number">{stats.regular_users}</p>
            </div>
            <div className="stat-card">
              <h3>Марок</h3>
              <p className="stat-number">{stats.brands_count}</p>
            </div>
            <div className="stat-card">
              <h3>Моделей</h3>
              <p className="stat-number">{stats.models_count}</p>
            </div>
            <div className="stat-card">
              <h3>Годов</h3>
              <p className="stat-number">{stats.years_count}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="admins-section">
          <h2>Управление администраторами</h2>
          
          <div className="add-admin-form">
            <input
              type="text"
              placeholder="User ID или @username"
              value={newAdminInput}
              onChange={(e) => setNewAdminInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAdmin()}
            />
            <button onClick={handleAddAdmin} className="btn-add">
              ➕ Добавить администратора
            </button>
          </div>

          <div className="admins-list">
            <h3>Список администраторов</h3>
            {admins.length > 0 ? (
              <table className="admins-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Добавлен</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.id}</td>
                      <td>{admin.user_id.toString()}</td>
                      <td>{admin.username || '-'}</td>
                      <td>{admin.added_at ? new Date(admin.added_at).toLocaleDateString() : '-'}</td>
                      <td>
                        <button 
                          onClick={() => handleRemoveAdmin(admin.user_id.toString())}
                          className="btn-remove"
                        >
                          🗑️ Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Администраторы не найдены</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'prices' && (
        <div className="prices-section">
          <h2>Управление ценами подписок</h2>
          
          {prices.length > 0 ? (
            <div className="prices-list">
              <table className="prices-table">
                <thead>
                  <tr>
                    <th>Период (месяцы)</th>
                    <th>Цена (копейки)</th>
                    <th>Цена (рубли)</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price) => (
                    <tr key={price.period_months}>
                      <td>{price.period_months}</td>
                      <td>
                        {editingPrice?.periodMonths === price.period_months ? (
                          <input
                            type="number"
                            value={editingPrice.priceKopecks}
                            onChange={(e) => setEditingPrice({
                              ...editingPrice,
                              priceKopecks: parseInt(e.target.value) || 0
                            })}
                            min="0"
                          />
                        ) : (
                          price.price_kopecks
                        )}
                      </td>
                      <td>{(price.price_kopecks / 100).toFixed(2)} ₽</td>
                      <td>
                        {editingPrice?.periodMonths === price.period_months ? (
                          <>
                            <button
                              onClick={() => handleUpdatePrice(price.period_months, editingPrice.priceKopecks)}
                              className="btn-save"
                            >
                              ✅ Сохранить
                            </button>
                            <button
                              onClick={() => setEditingPrice(null)}
                              className="btn-cancel"
                            >
                              ❌ Отмена
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingPrice({
                              periodMonths: price.period_months,
                              priceKopecks: price.price_kopecks
                            })}
                            className="btn-edit"
                          >
                            ✏️ Редактировать
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Цены не найдены</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPage
