import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { 
  getBrandsRequest, 
  getModelsRequest, 
  getYearsRequest,
  selectBrand,
  selectModel,
  clearSelections
} from '../../store/cars/carsSlice'
import { carsService } from '../../services/carsService'
import './ManageCarsPage.css'

const ManageCarsPage = () => {
  const dispatch = useAppDispatch()
  const { brands, models, years, selectedBrand, selectedModel, loading } = useAppSelector((state) => state.cars)
  const { isAdmin } = useAppSelector((state) => state.auth)
  
  const [activeTab, setActiveTab] = useState<'brands' | 'models' | 'years'>('brands')
  const [action, setAction] = useState<'view' | 'add' | 'edit' | 'delete'>('view')
  const [inputValue, setInputValue] = useState('')
  const [editOldValue, setEditOldValue] = useState('')
  const [editNewValue, setEditNewValue] = useState('')

  useEffect(() => {
    dispatch(getBrandsRequest())
  }, [dispatch])

  useEffect(() => {
    if (selectedBrand) {
      dispatch(getModelsRequest(selectedBrand.id))
    }
  }, [selectedBrand, dispatch])

  useEffect(() => {
    if (selectedModel) {
      dispatch(getYearsRequest(selectedModel.id))
    }
  }, [selectedModel, dispatch])

  if (!isAdmin) {
    return (
      <div className="manage-cars-page">
        <div className="error-message">
          <h2>🔒 Доступ запрещен</h2>
          <p>У вас нет прав администратора для доступа к этой странице.</p>
        </div>
      </div>
    )
  }

  const handleBrandSelect = (brand: typeof brands[0]) => {
    dispatch(selectBrand(brand))
    setActiveTab('models')
    setAction('view')
  }

  const handleModelSelect = (model: typeof models[0]) => {
    dispatch(selectModel(model))
    setActiveTab('years')
    setAction('view')
  }

  const handleAddBrands = async () => {
    if (!inputValue.trim()) return
    
    const brandList = inputValue.split('\n').map(b => b.trim()).filter(b => b)
    try {
      await carsService.addBrands(brandList)
      alert('Марки успешно добавлены')
      setInputValue('')
      dispatch(getBrandsRequest())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при добавлении марок')
    }
  }

  const handleDeleteBrand = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту марку и все связанные данные?')) return
    
    try {
      await carsService.deleteBrand(id)
      alert('Марка успешно удалена')
      dispatch(getBrandsRequest())
      dispatch(clearSelections())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении марки')
    }
  }

  const handleUpdateBrand = async () => {
    if (!editOldValue.trim() || !editNewValue.trim()) return
    
    try {
      await carsService.updateBrand(editOldValue.trim(), editNewValue.trim())
      alert('Марка успешно обновлена')
      setEditOldValue('')
      setEditNewValue('')
      setAction('view')
      dispatch(getBrandsRequest())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении марки')
    }
  }

  const handleAddModels = async () => {
    if (!inputValue.trim() || !selectedBrand) return
    
    const modelList = inputValue.split('\n').map(m => m.trim()).filter(m => m)
    try {
      await carsService.addModels(modelList, selectedBrand.id)
      alert('Модели успешно добавлены')
      setInputValue('')
      dispatch(getModelsRequest(selectedBrand.id))
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при добавлении моделей')
    }
  }

  const handleDeleteModels = async (modelsToDelete: string[]) => {
    if (!selectedBrand) return
    if (!confirm('Вы уверены, что хотите удалить эти модели и все связанные данные?')) return
    
    try {
      await carsService.deleteModels(modelsToDelete, selectedBrand.id)
      alert('Модели успешно удалены')
      dispatch(getModelsRequest(selectedBrand.id))
      dispatch(clearSelections())
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении моделей')
    }
  }

  const handleUpdateModel = async () => {
    if (!editOldValue.trim() || !editNewValue.trim() || !selectedBrand) return
    
    try {
      await carsService.updateModel(editOldValue.trim(), editNewValue.trim(), selectedBrand.id)
      alert('Модель успешно обновлена')
      setEditOldValue('')
      setEditNewValue('')
      setAction('view')
      dispatch(getModelsRequest(selectedBrand.id))
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении модели')
    }
  }

  const handleAddYears = async () => {
    if (!inputValue.trim() || !selectedModel) return
    
    const yearList = inputValue.split('\n').map(y => y.trim()).filter(y => y)
    try {
      await carsService.addYears(yearList, selectedModel.id)
      alert('Годы успешно добавлены')
      setInputValue('')
      dispatch(getYearsRequest(selectedModel.id))
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при добавлении годов')
    }
  }

  const handleDeleteYears = async (yearsToDelete: string[]) => {
    if (!selectedModel) return
    if (!confirm('Вы уверены, что хотите удалить эти годы и все связанные данные?')) return
    
    try {
      await carsService.deleteYears(yearsToDelete, selectedModel.id)
      alert('Годы успешно удалены')
      dispatch(getYearsRequest(selectedModel.id))
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении годов')
    }
  }

  const handleUpdateYear = async () => {
    if (!editOldValue.trim() || !editNewValue.trim() || !selectedModel) return
    
    try {
      await carsService.updateYear(editOldValue.trim(), editNewValue.trim(), selectedModel.id)
      alert('Год успешно обновлен')
      setEditOldValue('')
      setEditNewValue('')
      setAction('view')
      dispatch(getYearsRequest(selectedModel.id))
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при обновлении года')
    }
  }

  return (
    <div className="manage-cars-page">
      <h1>🚗 Управление автомобилями</h1>
      
      <div className="manage-tabs">
        <button 
          className={activeTab === 'brands' ? 'active' : ''}
          onClick={() => {
            setActiveTab('brands')
            setAction('view')
            dispatch(clearSelections())
          }}
        >
          🏭 Марки
        </button>
        <button 
          className={activeTab === 'models' ? 'active' : ''}
          onClick={() => {
            if (selectedBrand) {
              setActiveTab('models')
              setAction('view')
            } else {
              alert('Сначала выберите марку')
            }
          }}
          disabled={!selectedBrand}
        >
          🚙 Модели
        </button>
        <button 
          className={activeTab === 'years' ? 'active' : ''}
          onClick={() => {
            if (selectedModel) {
              setActiveTab('years')
              setAction('view')
            } else {
              alert('Сначала выберите модель')
            }
          }}
          disabled={!selectedModel}
        >
          📅 Годы
        </button>
      </div>

      <div className="action-buttons">
        <button 
          className={action === 'view' ? 'active' : ''}
          onClick={() => setAction('view')}
        >
          👁️ Просмотр
        </button>
        <button 
          className={action === 'add' ? 'active' : ''}
          onClick={() => {
            setAction('add')
            setInputValue('')
          }}
        >
          ➕ Добавить
        </button>
        <button 
          className={action === 'edit' ? 'active' : ''}
          onClick={() => {
            setAction('edit')
            setEditOldValue('')
            setEditNewValue('')
          }}
        >
          ✏️ Редактировать
        </button>
        <button 
          className={action === 'delete' ? 'active' : ''}
          onClick={() => setAction('delete')}
        >
          🗑️ Удалить
        </button>
      </div>

      {activeTab === 'brands' && (
        <div className="manage-content">
          {action === 'view' && (
            <div className="items-list">
              <h2>Список марок</h2>
              {loading ? (
                <p>Загрузка...</p>
              ) : brands.length > 0 ? (
                <div className="items-grid">
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      className={`item-card ${selectedBrand?.id === brand.id ? 'selected' : ''}`}
                      onClick={() => handleBrandSelect(brand)}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p>Марки не найдены</p>
              )}
            </div>
          )}

          {action === 'add' && (
            <div className="add-form">
              <h2>Добавить марки</h2>
              <p>Введите марки, каждую с новой строки:</p>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={10}
                placeholder="Марка 1&#10;Марка 2&#10;Марка 3"
                className="input-textarea"
              />
              <button onClick={handleAddBrands} className="btn-submit">
                ➕ Добавить марки
              </button>
            </div>
          )}

          {action === 'edit' && (
            <div className="edit-form">
              <h2>Редактировать марку</h2>
              <input
                type="text"
                value={editOldValue}
                onChange={(e) => setEditOldValue(e.target.value)}
                placeholder="Старое название марки"
                className="input-text"
              />
              <input
                type="text"
                value={editNewValue}
                onChange={(e) => setEditNewValue(e.target.value)}
                placeholder="Новое название марки"
                className="input-text"
              />
              <button onClick={handleUpdateBrand} className="btn-submit">
                ✏️ Обновить марку
              </button>
            </div>
          )}

          {action === 'delete' && (
            <div className="delete-list">
              <h2>Удалить марку</h2>
              {brands.map((brand) => (
                <div key={brand.id} className="delete-item">
                  <span>{brand.name}</span>
                  <button 
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="btn-delete"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'models' && selectedBrand && (
        <div className="manage-content">
          <div className="breadcrumb">
            <span>Марка: <strong>{selectedBrand.name}</strong></span>
          </div>

          {action === 'view' && (
            <div className="items-list">
              <h2>Список моделей</h2>
              {loading ? (
                <p>Загрузка...</p>
              ) : models.length > 0 ? (
                <div className="items-grid">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className={`item-card ${selectedModel?.id === model.id ? 'selected' : ''}`}
                      onClick={() => handleModelSelect(model)}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p>Модели не найдены</p>
              )}
            </div>
          )}

          {action === 'add' && (
            <div className="add-form">
              <h2>Добавить модели</h2>
              <p>Введите модели, каждую с новой строки:</p>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={10}
                placeholder="Модель 1&#10;Модель 2&#10;Модель 3"
                className="input-textarea"
              />
              <button onClick={handleAddModels} className="btn-submit">
                ➕ Добавить модели
              </button>
            </div>
          )}

          {action === 'edit' && (
            <div className="edit-form">
              <h2>Редактировать модель</h2>
              <input
                type="text"
                value={editOldValue}
                onChange={(e) => setEditOldValue(e.target.value)}
                placeholder="Старое название модели"
                className="input-text"
              />
              <input
                type="text"
                value={editNewValue}
                onChange={(e) => setEditNewValue(e.target.value)}
                placeholder="Новое название модели"
                className="input-text"
              />
              <button onClick={handleUpdateModel} className="btn-submit">
                ✏️ Обновить модель
              </button>
            </div>
          )}

          {action === 'delete' && (
            <div className="delete-list">
              <h2>Удалить модели</h2>
              {models.map((model) => (
                <div key={model.id} className="delete-item">
                  <span>{model.name}</span>
                  <button 
                    onClick={() => handleDeleteModels([model.name])}
                    className="btn-delete"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'years' && selectedModel && (
        <div className="manage-content">
          <div className="breadcrumb">
            <span>Марка: <strong>{selectedBrand?.name}</strong></span>
            <span>Модель: <strong>{selectedModel.name}</strong></span>
          </div>

          {action === 'view' && (
            <div className="items-list">
              <h2>Список годов</h2>
              {loading ? (
                <p>Загрузка...</p>
              ) : years.length > 0 ? (
                <div className="items-grid">
                  {years.map((year) => (
                    <div key={year.id} className="item-card">
                      {year.value}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Годы не найдены</p>
              )}
            </div>
          )}

          {action === 'add' && (
            <div className="add-form">
              <h2>Добавить годы</h2>
              <p>Введите годы, каждое с новой строки:</p>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={10}
                placeholder="1971&#10;2001&#10;2031"
                className="input-textarea"
              />
              <button onClick={handleAddYears} className="btn-submit">
                ➕ Добавить годы
              </button>
            </div>
          )}

          {action === 'edit' && (
            <div className="edit-form">
              <h2>Редактировать год</h2>
              <input
                type="text"
                value={editOldValue}
                onChange={(e) => setEditOldValue(e.target.value)}
                placeholder="Старое значение года"
                className="input-text"
              />
              <input
                type="text"
                value={editNewValue}
                onChange={(e) => setEditNewValue(e.target.value)}
                placeholder="Новое значение года"
                className="input-text"
              />
              <button onClick={handleUpdateYear} className="btn-submit">
                ✏️ Обновить год
              </button>
            </div>
          )}

          {action === 'delete' && (
            <div className="delete-list">
              <h2>Удалить годы</h2>
              {years.map((year) => (
                <div key={year.id} className="delete-item">
                  <span>{year.value}</span>
                  <button 
                    onClick={() => handleDeleteYears([year.value])}
                    className="btn-delete"
                  >
                    🗑️ Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ManageCarsPage

