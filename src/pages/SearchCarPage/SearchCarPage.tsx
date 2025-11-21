import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { 
  getBrandsRequest, 
  getModelsRequest, 
  getYearsRequest,
  selectBrand, 
  selectModel, 
  clearSelections,
  clearModel
} from '../../store/cars/carsSlice'
import { getFilesByYearRequest } from '../../store/files/filesSlice'
import { API_BASE_URL } from '../../config/api'
import './SearchCarPage.css'

// Вспомогательная функция для нормализации URL изображения
const getImageUrl = (photoUrl: string | null | undefined): string => {
  if (!photoUrl) return '';
  
  // Если это относительный путь (начинается с /), добавляем базовый URL
  if (photoUrl.startsWith('/')) {
    return `${API_BASE_URL}${photoUrl}`;
  }
  
  // Если это уже полный URL, возвращаем как есть
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  
  // Иначе считаем, что это относительный путь
  return `${API_BASE_URL}/${photoUrl}`;
}

const SearchCarPage = () => {
  const dispatch = useAppDispatch()
  const { brands, models, years, selectedBrand, selectedModel, loading } = useAppSelector((state) => state.cars)
  const { filesByYear, loading: filesLoading } = useAppSelector((state) => state.files)
  const { user, isPremium } = useAppSelector((state) => state.auth)
  
  const [currentStep, setCurrentStep] = useState<'brand' | 'model' | 'year' | 'files'>('brand')
  const [selectedYear, setSelectedYear] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

  const handleYearSelect = async (year: any) => {
    setSelectedYear(year)
    setCurrentStep('files')
    dispatch(getFilesByYearRequest({ yearId: year.id, userId: user?.user_id }))
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

      <div className="breadcrumb">
        {selectedBrand && (
          <span className="breadcrumb-item">
            Марка: <strong>{selectedBrand.brand}</strong>
          </span>
        )}
        {selectedModel && (
          <span className="breadcrumb-item">
            Модель: <strong>{selectedModel.model}</strong>
          </span>
        )}
        {selectedYear && (
          <span className="breadcrumb-item">
            Год: <strong>{selectedYear.year}</strong>
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
                  {brand.brand}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {currentStep === 'model' && selectedBrand && (
        <div className="step-content">
          <h2>Выберите модель {selectedBrand.brand}</h2>
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
                  {model.model}
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
          <h2>Выберите год выпуска для {selectedBrand?.brand} {selectedModel.model}</h2>
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
                  {year.year}
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
          <h2>Файлы для {selectedBrand?.brand} {selectedModel?.model} {selectedYear.year}</h2>
          {filesLoading ? (
            <p>Загрузка файлов...</p>
          ) : filesByYear && filesByYear.files.length > 0 ? (
            <div className="files-container">
              {filesByYear.files.map((file) => (
                <div key={file.id} className="file-card">
                  {file.photo && (
                    <div className="file-item">
                      <img 
                        src={getImageUrl(file.photo)} 
                        alt="Photo" 
                        className="file-preview clickable"
                        onClick={() => setSelectedImage(getImageUrl(file.photo))}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          console.error('Ошибка загрузки изображения:', {
                            src: img.src,
                            original: file.photo,
                            fileId: file.id,
                            computedUrl: getImageUrl(file.photo)
                          });
                          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не загружено%3C/text%3E%3C/svg%3E';
                        }}
                        onLoad={() => {
                          console.log('✅ Изображение успешно загружено:', file.photo);
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
                            src={getImageUrl(file.premium_photo)} 
                            alt="Premium Photo" 
                            className="file-preview clickable"
                            onClick={() => setSelectedImage(getImageUrl(file.premium_photo))}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              console.error('Ошибка загрузки премиум изображения:', {
                                src: img.src,
                                original: file.premium_photo,
                                fileId: file.id
                              });
                              img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не загружено%3C/text%3E%3C/svg%3E';
                            }}
                            onLoad={() => {
                              console.log('✅ Премиум изображение успешно загружено:', file.premium_photo);
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
                      <a href={file.pdf} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 PDF файл
                      </a>
                    </div>
                  )}
                  {file.premium_pdf && (
                    <div className={`file-item premium ${!isPremium ? 'locked' : ''}`}>
                      {isPremium ? (
                        <a href={file.premium_pdf} target="_blank" rel="noopener noreferrer" className="file-link">
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
                  src={selectedImage.startsWith('/') ? `${API_BASE_URL}${selectedImage}` : selectedImage.startsWith('http') ? selectedImage : `${API_BASE_URL}/${selectedImage}`} 
                  alt="Preview" 
                  className="modal-image"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    console.error('Ошибка загрузки изображения в модальном окне:', {
                      src: img.src,
                      original: selectedImage
                    });
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EИзображение не загружено%3C/text%3E%3C/svg%3E';
                  }}
                  onLoad={() => {
                    console.log('✅ Изображение в модальном окне загружено');
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


