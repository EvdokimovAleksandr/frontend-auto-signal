import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { 
  getStatsRequest, 
  getAdminsRequest, 
  getPricesRequest,
  getDetailedStatsRequest,
  getTopModelsRequest,
  getSettingsRequest,
  updateStartMessageRequest
} from '../../store/admin/adminSlice'
import { adminService } from '../../services/adminService'
import './AdminPage.css'

const AdminPage = () => {
  const dispatch = useAppDispatch()
  const { stats, detailedStats, topModels, admins, prices, settings, loading } = useAppSelector((state) => state.admin)
  const { isAdmin } = useAppSelector((state) => state.auth)
  
  const [activeTab, setActiveTab] = useState<'stats' | 'detailed' | 'top-models' | 'admins' | 'prices' | 'settings'>('stats')
  const [newAdminInput, setNewAdminInput] = useState('')
  const [editingPrice, setEditingPrice] = useState<{ periodMonths: number; priceKopecks: number } | null>(null)
  const [startMessage, setStartMessage] = useState('')
  const [editingStartMessage, setEditingStartMessage] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      dispatch(getStatsRequest())
      dispatch(getAdminsRequest())
      dispatch(getPricesRequest())
      dispatch(getSettingsRequest())
    }
  }, [dispatch, isAdmin])

  useEffect(() => {
    if (activeTab === 'detailed') {
      dispatch(getDetailedStatsRequest())
    }
    if (activeTab === 'top-models') {
      dispatch(getTopModelsRequest())
    }
  }, [dispatch, activeTab])

  useEffect(() => {
    const startMessageSetting = settings.find(s => s.setting_key === 'start_message')
    if (startMessageSetting) {
      setStartMessage(startMessageSetting.setting_value)
    }
  }, [settings])

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

  const handleUpdateStartMessage = async () => {
    try {
      dispatch(updateStartMessageRequest(startMessage))
      setEditingStartMessage(false)
      dispatch(getSettingsRequest())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении сообщения')
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
          className={activeTab === 'detailed' ? 'active' : ''}
          onClick={() => setActiveTab('detailed')}
        >
          📈 Детальная статистика
        </button>
        <button 
          className={activeTab === 'top-models' ? 'active' : ''}
          onClick={() => setActiveTab('top-models')}
        >
          🏆 Топ-20 моделей
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
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Настройки
        </button>
      </div>

      <div className="admin-quick-links">
        <a href="/admin/manage-cars" className="quick-link">
          🚗 Управление автомобилями
        </a>
        <a href="/admin/manage-files" className="quick-link">
          📁 Управление файлами
        </a>
        <a href="/admin/manage-descriptions" className="quick-link">
          📝 Управление описаниями
        </a>
      </div>

      {loading && <p className="loading">Загрузка...</p>}

      {activeTab === 'stats' && stats && (
        <div className="stats-section">
          {/* Пользователи */}
          <div className="stats-group">
            <h3 className="stats-group-title">👥 Пользователи</h3>
            <div className="stats-grid">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon">👤</div>
                <div className="stat-content">
                  <p className="stat-label">Всего пользователей</p>
                  <p className="stat-number">{stats.total_users}</p>
                </div>
              </div>
              <div className="stat-card stat-card-success">
                <div className="stat-icon">💎</div>
                <div className="stat-content">
                  <p className="stat-label">Премиум пользователей</p>
                  <p className="stat-number">{stats.premium_users}</p>
                </div>
              </div>
              <div className="stat-card stat-card-info">
                <div className="stat-icon">👋</div>
                <div className="stat-content">
                  <p className="stat-label">Обычных пользователей</p>
                  <p className="stat-number">{stats.regular_users}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Автомобили */}
          <div className="stats-group">
            <h3 className="stats-group-title">🚗 Автомобили</h3>
            <div className="stats-grid">
              <div className="stat-card stat-card-warning">
                <div className="stat-icon">🏭</div>
                <div className="stat-content">
                  <p className="stat-label">Марок</p>
                  <p className="stat-number">{stats.brands_count}</p>
                </div>
              </div>
              <div className="stat-card stat-card-danger">
                <div className="stat-icon">🚙</div>
                <div className="stat-content">
                  <p className="stat-label">Моделей</p>
                  <p className="stat-number">{stats.models_count}</p>
                </div>
              </div>
              <div className="stat-card stat-card-secondary">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <p className="stat-label">Годов выпуска</p>
                  <p className="stat-number">{stats.years_count}</p>
                </div>
              </div>
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
                  {prices.map((price) => {
                    // Обрабатываем данные: бэкенд может вернуть price_rub или price_kopecks
                    const priceKopecks = price.price_kopecks || (price.price_rub ? Math.round(price.price_rub * 100) : 0);
                    const priceRub = price.price_rub || (price.price_kopecks ? price.price_kopecks / 100 : 0);
                    
                    return (
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
                            priceKopecks || '-'
                          )}
                        </td>
                        <td>
                          {priceKopecks > 0 ? `${priceRub.toFixed(2)} ₽` : '-'}
                        </td>
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
                                priceKopecks: priceKopecks
                              })}
                              className="btn-edit"
                            >
                              ✏️ Редактировать
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Цены не найдены</p>
          )}
        </div>
      )}

      {activeTab === 'detailed' && (
        <div className="stats-section">
          {loading ? (
            <p className="loading">Загрузка...</p>
          ) : detailedStats ? (
            <>
              <div className="stats-group">
                <h3 className="stats-group-title">👥 Пользователи</h3>
                <div className="stats-grid">
                  <div className="stat-card stat-card-primary">
                    <div className="stat-icon">👤</div>
                    <div className="stat-content">
                      <p className="stat-label">Всего пользователей</p>
                      <p className="stat-number">{detailedStats.total_users}</p>
                    </div>
                  </div>
                  <div className="stat-card stat-card-success">
                    <div className="stat-icon">💎</div>
                    <div className="stat-content">
                      <p className="stat-label">Премиум пользователей</p>
                      <p className="stat-number">{detailedStats.premium_users}</p>
                    </div>
                  </div>
                  <div className="stat-card stat-card-info">
                    <div className="stat-icon">👋</div>
                    <div className="stat-content">
                      <p className="stat-label">Обычных пользователей</p>
                      <p className="stat-number">{detailedStats.regular_users}</p>
                    </div>
                  </div>
                  {detailedStats.new_users_last_month !== undefined && (
                    <div className="stat-card stat-card-secondary">
                      <div className="stat-icon">📈</div>
                      <div className="stat-content">
                        <p className="stat-label">Новых за месяц</p>
                        <p className="stat-number">{detailedStats.new_users_last_month}</p>
                      </div>
                    </div>
                  )}
                  {detailedStats.admins_count !== undefined && (
                    <div className="stat-card stat-card-warning">
                      <div className="stat-icon">👑</div>
                      <div className="stat-content">
                        <p className="stat-label">Администраторов</p>
                        <p className="stat-number">{detailedStats.admins_count}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="stats-group">
                <h3 className="stats-group-title">🚗 Автомобили</h3>
                <div className="stats-grid">
                  <div className="stat-card stat-card-warning">
                    <div className="stat-icon">🏭</div>
                    <div className="stat-content">
                      <p className="stat-label">Марок</p>
                      <p className="stat-number">{detailedStats.brands_count}</p>
                    </div>
                  </div>
                  <div className="stat-card stat-card-danger">
                    <div className="stat-icon">🚙</div>
                    <div className="stat-content">
                      <p className="stat-label">Моделей</p>
                      <p className="stat-number">{detailedStats.models_count}</p>
                    </div>
                  </div>
                  <div className="stat-card stat-card-secondary">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                      <p className="stat-label">Годов выпуска</p>
                      <p className="stat-number">{detailedStats.years_count}</p>
                    </div>
                  </div>
                </div>
              </div>

              {detailedStats.total_files !== undefined && (
                <div className="stats-group">
                  <h3 className="stats-group-title">📁 Файлы</h3>
                  <div className="stats-grid">
                    <div className="stat-card stat-card-primary">
                      <div className="stat-icon">📦</div>
                      <div className="stat-content">
                        <p className="stat-label">Всего файлов</p>
                        <p className="stat-number">{detailedStats.total_files}</p>
                      </div>
                    </div>
                    {detailedStats.photos_count !== undefined && (
                      <div className="stat-card stat-card-info">
                        <div className="stat-icon">📷</div>
                        <div className="stat-content">
                          <p className="stat-label">Фото</p>
                          <p className="stat-number">{detailedStats.photos_count}</p>
                        </div>
                      </div>
                    )}
                    {detailedStats.premium_photos_count !== undefined && (
                      <div className="stat-card stat-card-success">
                        <div className="stat-icon">💎📷</div>
                        <div className="stat-content">
                          <p className="stat-label">Премиум фото</p>
                          <p className="stat-number">{detailedStats.premium_photos_count}</p>
                        </div>
                      </div>
                    )}
                    {detailedStats.pdfs_count !== undefined && (
                      <div className="stat-card stat-card-warning">
                        <div className="stat-icon">📄</div>
                        <div className="stat-content">
                          <p className="stat-label">PDF</p>
                          <p className="stat-number">{detailedStats.pdfs_count}</p>
                        </div>
                      </div>
                    )}
                    {detailedStats.premium_pdfs_count !== undefined && (
                      <div className="stat-card stat-card-danger">
                        <div className="stat-icon">💎📄</div>
                        <div className="stat-content">
                          <p className="stat-label">Премиум PDF</p>
                          <p className="stat-number">{detailedStats.premium_pdfs_count}</p>
                        </div>
                      </div>
                    )}
                    {detailedStats.files_with_descriptions !== undefined && (
                      <div className="stat-card stat-card-secondary">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                          <p className="stat-label">С описаниями</p>
                          <p className="stat-number">{detailedStats.files_with_descriptions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailedStats.total_file_accesses !== undefined && (
                <div className="stats-group">
                  <h3 className="stats-group-title">📊 Статистика доступа</h3>
                  <div className="stats-grid">
                    <div className="stat-card stat-card-primary">
                      <div className="stat-icon">👁️</div>
                      <div className="stat-content">
                        <p className="stat-label">Всего обращений</p>
                        <p className="stat-number">{detailedStats.total_file_accesses}</p>
                      </div>
                    </div>
                    {detailedStats.unique_users_accessed !== undefined && (
                      <div className="stat-card stat-card-info">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                          <p className="stat-label">Уникальных пользователей</p>
                          <p className="stat-number">{detailedStats.unique_users_accessed}</p>
                        </div>
                      </div>
                    )}
                    {detailedStats.average_accesses_per_user !== undefined && (
                      <div className="stat-card stat-card-success">
                        <div className="stat-icon">📈</div>
                        <div className="stat-content">
                          <p className="stat-label">Среднее на пользователя</p>
                          <p className="stat-number">{detailedStats.average_accesses_per_user}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailedStats.new_subscriptions_last_month !== undefined && (
                <div className="stats-group">
                  <h3 className="stats-group-title">💎 Подписки</h3>
                  <div className="stats-grid">
                    <div className="stat-card stat-card-success">
                      <div className="stat-icon">📅</div>
                      <div className="stat-content">
                        <p className="stat-label">Новых за месяц</p>
                        <p className="stat-number">{detailedStats.new_subscriptions_last_month}</p>
                      </div>
                    </div>
                    {detailedStats.average_subscription_months !== undefined && (
                      <div className="stat-card stat-card-info">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-content">
                          <p className="stat-label">Средний период (мес.)</p>
                          <p className="stat-number">{detailedStats.average_subscription_months}</p>
                        </div>
                      </div>
                    )}
                    {detailedStats.subscriptions_by_period && Object.keys(detailedStats.subscriptions_by_period).length > 0 && (
                      <div className="stat-card stat-card-secondary" style={{ gridColumn: 'span 2' }}>
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                          <p className="stat-label">Распределение по периодам:</p>
                          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            {Object.entries(detailedStats.subscriptions_by_period).map(([period, count]) => (
                              <span key={period} style={{ marginRight: '1rem' }}>
                                {period} мес.: {count}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Данные не загружены</p>
          )}
        </div>
      )}

      {activeTab === 'top-models' && (
        <div className="top-models-section">
          <h2>🏆 Топ-20 самых популярных моделей</h2>
          {loading ? (
            <p className="loading">Загрузка...</p>
          ) : topModels.length > 0 ? (
            <table className="top-models-table">
              <thead>
                <tr>
                  <th>Место</th>
                  <th>Марка</th>
                  <th>Модель</th>
                  <th>Количество обращений</th>
                </tr>
              </thead>
              <tbody>
                {topModels.map((model) => (
                  <tr key={`${model.brand}-${model.model}`}>
                    <td>{model.rank}</td>
                    <td>{model.brand}</td>
                    <td>{model.model}</td>
                    <td>{model.accessCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Статистика доступа к моделям пока отсутствует</p>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-section">
          <h2>⚙️ Настройки бота</h2>
          
          <div className="setting-item">
            <h3>📝 Стартовое сообщение</h3>
            {editingStartMessage ? (
              <div className="edit-start-message">
                <textarea
                  value={startMessage}
                  onChange={(e) => setStartMessage(e.target.value)}
                  rows={6}
                  className="start-message-input"
                  placeholder="Введите стартовое сообщение..."
                />
                <div className="setting-actions">
                  <button onClick={handleUpdateStartMessage} className="btn-save">
                    ✅ Сохранить
                  </button>
                  <button 
                    onClick={() => {
                      setEditingStartMessage(false)
                      const startMessageSetting = settings.find(s => s.setting_key === 'start_message')
                      if (startMessageSetting) {
                        setStartMessage(startMessageSetting.setting_value)
                      }
                    }} 
                    className="btn-cancel"
                  >
                    ❌ Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="view-start-message">
                <p className="start-message-preview">{startMessage || 'Стартовое сообщение не установлено'}</p>
                <button 
                  onClick={() => setEditingStartMessage(true)} 
                  className="btn-edit"
                >
                  ✏️ Редактировать
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
