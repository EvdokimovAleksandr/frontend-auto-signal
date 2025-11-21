import { useEffect, useState } from 'react'
import { useAppSelector } from '../../utils/hooks'
import { filesService } from '../../services/filesService'
import './ManageDescriptionsPage.css'

const ManageDescriptionsPage = () => {
  const { isAdmin } = useAppSelector((state) => state.auth)
  
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [years, setYears] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [selectedBrand, setSelectedBrand] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedYear, setSelectedYear] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState<'all' | 'photo' | 'pphoto' | 'pdf' | 'ppdf'>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      loadBrands()
    }
  }, [isAdmin])

  useEffect(() => {
    if (selectedBrand) {
      loadModels()
    }
  }, [selectedBrand])

  useEffect(() => {
    if (selectedModel) {
      loadYears()
    }
  }, [selectedModel])

  useEffect(() => {
    if (selectedYear) {
      loadFiles()
    }
  }, [selectedYear, filter])

  if (!isAdmin) {
    return (
      <div className="manage-descriptions-page">
        <div className="error-message">
          <h2>🔒 Доступ запрещен</h2>
          <p>У вас нет прав администратора для доступа к этой странице.</p>
        </div>
      </div>
    )
  }

  const loadBrands = async () => {
    try {
      setLoading(true)
      const data = await filesService.getBrandsForDescriptions(1, 100)
      setBrands(data.brands)
    } catch (error) {
      console.error('Ошибка загрузки марок:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadModels = async () => {
    if (!selectedBrand) return
    try {
      setLoading(true)
      const modelsData = await filesService.getModelsByBrandForDescriptions(selectedBrand.id)
      setModels(modelsData)
    } catch (error) {
      console.error('Ошибка загрузки моделей:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadYears = async () => {
    if (!selectedModel) return
    try {
      setLoading(true)
      const yearsData = await filesService.getYearsByModelForDescriptions(selectedModel.id)
      setYears(yearsData)
    } catch (error) {
      console.error('Ошибка загрузки годов:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFiles = async () => {
    if (!selectedYear) return
    try {
      setLoading(true)
      const filesData = await filesService.getFilesByYearForDescriptions(selectedYear.id, filter)
      setFiles(filesData)
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file: any) => {
    setSelectedFile(file)
    setDescription(file.caption || '')
  }

  const handleSaveDescription = async () => {
    if (!selectedFile) return

    try {
      await filesService.updateFileDescription(selectedFile.id, description)
      alert('Описание успешно сохранено')
      loadFiles()
      setSelectedFile(null)
      setDescription('')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при сохранении описания')
    }
  }

  const getFileTypeLabel = (file: any) => {
    if (file.photo) return '📷 Фото'
    if (file.premium_photo) return '💎 Премиум фото'
    if (file.pdf) return '📄 PDF'
    if (file.premium_pdf) return '💎 Премиум PDF'
    return '📁 Файл'
  }

  return (
    <div className="manage-descriptions-page">
      <h1>📝 Управление описаниями файлов</h1>

      <div className="selection-flow">
        <div className="selection-step">
          <h3>1. Выберите марку:</h3>
          {!selectedBrand ? (
            <div className="items-grid">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  className="item-card"
                  onClick={() => {
                    setSelectedBrand(brand)
                    setSelectedModel(null)
                    setSelectedYear(null)
                    setSelectedFile(null)
                  }}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="selected-item">
              <span>{selectedBrand.name}</span>
              <button onClick={() => {
                setSelectedBrand(null)
                setSelectedModel(null)
                setSelectedYear(null)
                setSelectedFile(null)
              }}>✕</button>
            </div>
          )}
        </div>

        {selectedBrand && (
          <div className="selection-step">
            <h3>2. Выберите модель:</h3>
            {!selectedModel ? (
              <div className="items-grid">
                {models.map((model) => (
                  <button
                    key={model.id}
                    className="item-card"
                    onClick={() => {
                      setSelectedModel(model)
                      setSelectedYear(null)
                      setSelectedFile(null)
                    }}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="selected-item">
                <span>{selectedModel.name}</span>
                <button onClick={() => {
                  setSelectedModel(null)
                  setSelectedYear(null)
                  setSelectedFile(null)
                }}>✕</button>
              </div>
            )}
          </div>
        )}

        {selectedModel && (
          <div className="selection-step">
            <h3>3. Выберите год:</h3>
            {!selectedYear ? (
              <div className="items-grid">
                {years.map((year) => (
                  <button
                    key={year.id}
                    className="item-card"
                    onClick={() => {
                      setSelectedYear(year)
                      setSelectedFile(null)
                    }}
                  >
                    {year.value}
                  </button>
                ))}
              </div>
            ) : (
              <div className="selected-item">
                <span>{selectedYear.value}</span>
                <button onClick={() => {
                  setSelectedYear(null)
                  setSelectedFile(null)
                }}>✕</button>
              </div>
            )}
          </div>
        )}

        {selectedYear && (
          <div className="selection-step">
            <h3>4. Выберите файл:</h3>
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                Все
              </button>
              <button 
                className={filter === 'photo' ? 'active' : ''}
                onClick={() => setFilter('photo')}
              >
                Фото
              </button>
              <button 
                className={filter === 'pphoto' ? 'active' : ''}
                onClick={() => setFilter('pphoto')}
              >
                Премиум фото
              </button>
              <button 
                className={filter === 'pdf' ? 'active' : ''}
                onClick={() => setFilter('pdf')}
              >
                PDF
              </button>
              <button 
                className={filter === 'ppdf' ? 'active' : ''}
                onClick={() => setFilter('ppdf')}
              >
                Премиум PDF
              </button>
            </div>
            <div className="files-list">
              {files.map((file) => (
                <button
                  key={file.id}
                  className={`file-item ${selectedFile?.id === file.id ? 'selected' : ''}`}
                  onClick={() => handleFileSelect(file)}
                >
                  <span className="file-type">{getFileTypeLabel(file)}</span>
                  <span className="file-id">ID: {file.id}</span>
                  {file.caption && <span className="file-caption-preview">{file.caption}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="description-editor">
            <h3>5. Редактировать описание:</h3>
            <p>Файл: {getFileTypeLabel(selectedFile)} (ID: {selectedFile.id})</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Введите описание файла..."
              className="description-input"
            />
            <div className="editor-actions">
              <button onClick={handleSaveDescription} className="btn-save">
                💾 Сохранить
              </button>
              <button 
                onClick={() => {
                  setSelectedFile(null)
                  setDescription('')
                }} 
                className="btn-cancel"
              >
                ❌ Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageDescriptionsPage

