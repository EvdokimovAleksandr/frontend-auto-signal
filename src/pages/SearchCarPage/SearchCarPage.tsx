import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { 
  getBrandsRequest, 
  getModelsRequest, 
  getYearsRequest,
  selectBrand, 
  selectModel, 
  clearSelections,
  clearModel
} from '@/store/cars/carsSlice'
import { carsService } from '@/services/carsService'
import { getFilesByYearRequest } from '@/store/files/filesSlice'
import { API_BASE_URL, API_SERVER_URL } from '@/config/api'
import type { Brand, Model, Year } from '@/types'
import { logger } from '@/utils/logger'
import './SearchCarPage.scss'

/** Преобразует путь к файлу в полный URL (изображения, PDF). */
const getFileUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // /uploads/ — статика на корне бэкенда; /files/ — API routes под /api/files
  if (url.startsWith('/uploads/')) return `${API_SERVER_URL}${url}`;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return `${API_SERVER_URL}/${url}`;
}

const SearchCarPage = () => {
  const dispatch = useAppDispatch()
  const { brands, models, years, selectedBrand, selectedModel, loading } = useAppSelector((state) => state.cars)
  const { filesByYear, loading: filesLoading } = useAppSelector((state) => state.files)
  const { user, isPremium } = useAppSelector((state) => state.auth)
  
  const [currentStep, setCurrentStep] = useState<'brand' | 'model' | 'year' | 'files'>('brand')
  const [selectedYear, setSelectedYear] = useState<{ id: number; value: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{brands: typeof brands, models: typeof models, years: typeof years}>({brands: [], models: [], years: []})

  useEffect(() => {
    dispatch(getBrandsRequest())
  }, [dispatch])

  useEffect(() => {
    if (selectedBrand) {
      dispatch(getModelsRequest(selectedBrand.id))
      setCurrentStep('model')
    }
  }, [selectedBrand, dispatch])

  useEffect(() => {
    if (selectedModel) {
      dispatch(getYearsRequest(selectedModel.id))
      setCurrentStep('year')
    }
  }, [selectedModel, dispatch])

  const handleBrandSelect = (brand: typeof brands[0]) => {
    dispatch(selectBrand(brand))
  }

  const handleModelSelect = (model: typeof models[0]) => {
    dispatch(selectModel(model))
  }

  const handleBack = () => {
    if (currentStep === 'files') {
      setCurrentStep('year')
      setSelectedYear(null)
    } else if (currentStep === 'year') {
      setCurrentStep('model')
      dispatch(clearModel()) // Очищаем только модель, бренд остается
      // Перезагружаем модели для выбранного бренда
      if (selectedBrand) {
        dispatch(getModelsRequest(selectedBrand.id))
      }
    } else if (currentStep === 'model') {
      setCurrentStep('brand')
      dispatch(clearSelections()) // Очищаем все при возврате к выбору бренда
    }
  }

  const handleYearSelect = async (year: { id: number; value: string }) => {
    setSelectedYear(year)
    setCurrentStep('files')
    dispatch(getFilesByYearRequest({ yearId: year.id, userId: user?.user_id }))
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ brands: [], models: [], years: [] })
      return
    }

    try {
      const [brandsResult, modelsResult, yearsResult] = await Promise.all([
        carsService.searchBrand(searchQuery),
        carsService.searchModel(searchQuery),
        carsService.searchYear(searchQuery),
      ])
      
      setSearchResults({
        brands: brandsResult,
        models: modelsResult,
        years: yearsResult,
      })
    } catch (error) {
      logger.error('Ошибка поиска:', error)
    }
  }

  const handleSearchResultClick = async (type: 'brand' | 'model' | 'year', item: Brand | Model | Year) => {
    if (type === 'brand') {
      dispatch(selectBrand(item as Brand))
      setSearchQuery('')
      setSearchResults({ brands: [], models: [], years: [] })
    } else if (type === 'model') {
      const modelItem = item as Model
      let brand = brands.find(b => b.id === modelItem.brand_id)
      if (!brand && modelItem.brand_id) {
        await dispatch(getBrandsRequest())
        await new Promise(resolve => setTimeout(resolve, 200))
        const updatedBrands = brands.length > 0 ? brands : []
        brand = updatedBrands.find((b) => b.id === modelItem.brand_id)
      }
      if (brand) {
        dispatch(selectBrand(brand))
        await new Promise(resolve => setTimeout(resolve, 200))
        dispatch(selectModel(item as Model))
        setSearchQuery('')
        setSearchResults({ brands: [], models: [], years: [] })
      } else {
        alert('Не удалось найти марку для этой модели')
      }
    } else if (type === 'year') {
      const yearItem = item as Year
      let model = models.find(m => m.id === yearItem.model_id)
      if (!model && yearItem.model_id) {
        if (selectedBrand) {
          await dispatch(getModelsRequest(selectedBrand.id))
          await new Promise(resolve => setTimeout(resolve, 200))
          const updatedModels = models.length > 0 ? models : []
          model = updatedModels.find((m) => m.id === yearItem.model_id)
        }
      }
      if (model) {
        let brand = brands.find(b => b.id === model.brand_id)
        if (!brand && model.brand_id) {
          await dispatch(getBrandsRequest())
          await new Promise(resolve => setTimeout(resolve, 200))
          const updatedBrands = brands.length > 0 ? brands : []
          brand = updatedBrands.find((b: any) => b.id === model.brand_id)
        }
        if (brand) {
          dispatch(selectBrand(brand))
          await new Promise(resolve => setTimeout(resolve, 200))
          dispatch(selectModel(model))
          await new Promise(resolve => setTimeout(resolve, 200))
          handleYearSelect(item as Year)
          setSearchQuery('')
          setSearchResults({ brands: [], models: [], years: [] })
        } else {
          alert('Не удалось найти марку для этой модели')
        }
      } else {
        alert('Не удалось найти модель для этого года')
      }
    }
  }

  return (
    <div className="search-car-page">
      <div className="search-header">
        <h1>🔍 Найти авто</h1>
        {currentStep !== 'brand' && (
          <button onClick={handleBack} className="btn-back">
            ⬅️ Назад
          </button>
        )}
      </div>

      {currentStep === 'brand' && (
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="🔍 Поиск по марке, модели или году..."
            className="search-input"
          />
          <button onClick={handleSearch} className="btn-search">
            Найти
          </button>
        </div>
      )}

      {currentStep === 'brand' && searchQuery && (searchResults.brands.length > 0 || searchResults.models.length > 0 || searchResults.years.length > 0) && (
        <div className="search-results">
          {searchResults.brands.length > 0 && (
            <div className="search-results-group">
              <h3>Марки:</h3>
              <div className="items-grid">
                {searchResults.brands.map((brand) => (
                  <button
                    key={brand.id}
                    className="item-card"
                    onClick={() => handleSearchResultClick('brand', brand)}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {searchResults.models.length > 0 && (
            <div className="search-results-group">
              <h3>Модели:</h3>
              <div className="items-grid">
                {searchResults.models.map((model) => (
                  <button
                    key={model.id}
                    className="item-card"
                    onClick={() => handleSearchResultClick('model', model)}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {searchResults.years.length > 0 && (
            <div className="search-results-group">
              <h3>Годы:</h3>
              <div className="items-grid">
                {searchResults.years.map((year) => (
                  <button
                    key={year.id}
                    className="item-card"
                    onClick={() => handleSearchResultClick('year', year)}
                  >
                    {year.value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`${selectedBrand ? 'breadcrumb' : ''}`}>
        {selectedBrand && (
          <span className="breadcrumb-item">
            Марка: <strong>{selectedBrand.name}</strong>
          </span>
        )}
        {selectedModel && (
          <span className="breadcrumb-item">
            Модель: <strong>{selectedModel.name}</strong>
          </span>
        )}
        {selectedYear && (
          <span className="breadcrumb-item">
            Год: <strong>{selectedYear.value}</strong>
          </span>
        )}
      </div>

      {currentStep === 'brand' && (
        <div className="step-content">
          <h2>Выберите марку автомобиля</h2>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <div className="items-grid">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  className="item-card"
                  onClick={() => handleBrandSelect(brand)}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {currentStep === 'model' && selectedBrand && (
        <div className="step-content">
          <h2>Выберите модель {selectedBrand.name}</h2>
          {loading ? (
            <p>Загрузка...</p>
          ) : models.length > 0 ? (
            <div className="items-grid">
              {models.map((model) => (
                <button
                  key={model.id}
                  className="item-card"
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

      {currentStep === 'year' && selectedModel && (
        <div className="step-content">
          <h2>Выберите год выпуска для {selectedBrand?.name} {selectedModel.name}</h2>
          {loading ? (
            <p>Загрузка годов...</p>
          ) : years.length > 0 ? (
            <div className="items-grid">
              {years.map((year) => (
                <button
                  key={year.id}
                  className="item-card"
                  onClick={() => handleYearSelect(year)}
                >
                  {year.value}
                </button>
              ))}
            </div>
          ) : (
            <p>Годы не найдены</p>
          )}
        </div>
      )}

      {currentStep === 'files' && selectedYear && (
        <div className="step-content">
          <h2>Файлы для {selectedBrand?.name} {selectedModel?.name} {selectedYear.value}</h2>
          {filesLoading ? (
            <p>Загрузка файлов...</p>
          ) : filesByYear && filesByYear.files.length > 0 ? (
            <div className="files-container">
              {filesByYear.files.map((file) => (
                <div key={file.id} className="file-card">
                  {file.photo && (
                    <div className="file-item">
                      <img 
                        src={getFileUrl(file.photo)} 
                        alt="Photo" 
                        className="file-preview clickable"
                        onClick={() => setSelectedImage(getFileUrl(file.photo))}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          logger.error('Ошибка загрузки изображения:', { src: img.src, fileId: file.id })
                          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не загружено%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <p className="file-type">📷 Фото</p>
                    </div>
                  )}
                  {file.premium_photo && (
                    <div className={`file-item premium ${!isPremium ? 'locked' : ''}`}>
                      {isPremium ? (
                        <>
                          <img 
                            src={getFileUrl(file.premium_photo)} 
                            alt="Premium Photo" 
                            className="file-preview clickable"
                            onClick={() => setSelectedImage(getFileUrl(file.premium_photo))}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              logger.error('Ошибка загрузки премиум изображения:', { src: img.src, fileId: file.id })
                              img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не загружено%3C/text%3E%3C/svg%3E'
                            }}
                          />
                          <p className="file-type">💎 Премиум фото</p>
                        </>
                      ) : (
                        <div className="premium-locked">
                          <div className="premium-icon">🔒</div>
                          <p className="file-type">💎 Премиум фото</p>
                          <p className="premium-hint">Требуется премиум подписка</p>
                        </div>
                      )}
                    </div>
                  )}
                  {file.pdf && (
                    <div className="file-item">
                      <a href={getFileUrl(file.pdf)} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 PDF файл
                      </a>
                    </div>
                  )}
                  {file.premium_pdf && (
                    <div className={`file-item premium ${!isPremium ? 'locked' : ''}`}>
                      {isPremium ? (
                        <a href={getFileUrl(file.premium_pdf)} target="_blank" rel="noopener noreferrer" className="file-link">
                          💎 Премиум PDF
                        </a>
                      ) : (
                        <div className="premium-locked">
                          <div className="premium-icon">🔒</div>
                          <p className="file-type">💎 Премиум PDF</p>
                          <p className="premium-hint">Требуется премиум подписка</p>
                        </div>
                      )}
                    </div>
                  )}
                  {file.caption && <p className="file-caption">{file.caption}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p>Файлы не найдены</p>
          )}
          
          {/* Модальное окно для просмотра изображений */}
          {selectedImage && (
            <div className="image-modal" onClick={() => setSelectedImage(null)}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
                <img 
                  src={getFileUrl(selectedImage) || selectedImage} 
                  alt="Preview" 
                  className="modal-image"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    logger.error('Ошибка загрузки изображения в модальном окне:', img.src)
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не загружено%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchCarPage


