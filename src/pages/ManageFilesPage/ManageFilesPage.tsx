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
import { filesService } from '../../services/filesService'
import './ManageFilesPage.css'

const ManageFilesPage = () => {
  const dispatch = useAppDispatch()
  const { brands, models, years, selectedBrand, selectedModel, loading } = useAppSelector((state) => state.cars)
  const { isAdmin } = useAppSelector((state) => state.auth)
  
  const [selectedYear, setSelectedYear] = useState<any>(null)
  const [fileType, setFileType] = useState<'photo' | 'premium_photo' | 'pdf' | 'premium_pdf'>('photo')
  const [googleDriveUrl, setGoogleDriveUrl] = useState('')
  const [filesForDeletion, setFilesForDeletion] = useState<any[]>([])
  const [showDeleteMode, setShowDeleteMode] = useState(false)

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

  useEffect(() => {
    if (selectedYear && showDeleteMode) {
      loadFilesForDeletion()
    }
  }, [selectedYear, fileType, showDeleteMode])

  if (!isAdmin) {
    return (
      <div className="manage-files-page">
        <div className="error-message">
          <h2>🔒 Доступ запрещен</h2>
          <p>У вас нет прав администратора для доступа к этой странице.</p>
        </div>
      </div>
    )
  }

  const loadFilesForDeletion = async () => {
    if (!selectedYear) return
    try {
      const files = await filesService.getFilesForPreview(selectedYear.id, fileType)
      setFilesForDeletion(files)
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error)
    }
  }

  const handleAddFile = async () => {
    if (!googleDriveUrl.trim() || !selectedYear) {
      alert('Заполните все поля')
      return
    }

    try {
      let result
      switch (fileType) {
        case 'photo':
          result = await filesService.addPhoto(googleDriveUrl.trim(), selectedYear.id)
          break
        case 'premium_photo':
          result = await filesService.addPremiumPhoto(googleDriveUrl.trim(), selectedYear.id)
          break
        case 'pdf':
          result = await filesService.addPdf(googleDriveUrl.trim(), selectedYear.id)
          break
        case 'premium_pdf':
          result = await filesService.addPremiumPdf(googleDriveUrl.trim(), selectedYear.id)
          break
      }
      alert('Файл успешно добавлен')
      setGoogleDriveUrl('')
      if (showDeleteMode) {
        loadFilesForDeletion()
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при добавлении файла')
    }
  }

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот файл?')) return

    try {
      switch (fileType) {
        case 'photo':
          await filesService.deletePhoto(fileId)
          break
        case 'premium_photo':
          await filesService.deletePremiumPhoto(fileId)
          break
        case 'pdf':
          await filesService.deletePdf(fileId)
          break
        case 'premium_pdf':
          await filesService.deletePremiumPdf(fileId)
          break
      }
      alert('Файл успешно удален')
      loadFilesForDeletion()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении файла')
    }
  }

  const getFileTypeLabel = () => {
    switch (fileType) {
      case 'photo': return 'Обычное фото'
      case 'premium_photo': return 'Премиум фото'
      case 'pdf': return 'Обычный PDF'
      case 'premium_pdf': return 'Премиум PDF'
    }
  }

  return (
    <div className="manage-files-page">
      <h1>📁 Управление файлами</h1>

      <div className="file-type-selector">
        <h2>Выберите тип файла:</h2>
        <div className="file-type-buttons">
          <button 
            className={fileType === 'photo' ? 'active' : ''}
            onClick={() => setFileType('photo')}
          >
            📷 Обычное фото
          </button>
          <button 
            className={fileType === 'premium_photo' ? 'active' : ''}
            onClick={() => setFileType('premium_photo')}
          >
            💎 Премиум фото
          </button>
          <button 
            className={fileType === 'pdf' ? 'active' : ''}
            onClick={() => setFileType('pdf')}
          >
            📄 Обычный PDF
          </button>
          <button 
            className={fileType === 'premium_pdf' ? 'active' : ''}
            onClick={() => setFileType('premium_pdf')}
          >
            💎 Премиум PDF
          </button>
        </div>
      </div>

      <div className="car-selection">
        <h2>Выберите автомобиль:</h2>
        <div className="selection-steps">
          <div className="selection-step">
            <h3>Марка:</h3>
            {!selectedBrand ? (
              <div className="items-grid">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    className="item-card"
                    onClick={() => dispatch(selectBrand(brand))}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="selected-item">
                <span>{selectedBrand.name}</span>
                <button onClick={() => {
                  dispatch(clearSelections())
                  setSelectedYear(null)
                }}>✕</button>
              </div>
            )}
          </div>

          {selectedBrand && (
            <div className="selection-step">
              <h3>Модель:</h3>
              {!selectedModel ? (
                <div className="items-grid">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className="item-card"
                      onClick={() => dispatch(selectModel(model))}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="selected-item">
                  <span>{selectedModel.name}</span>
                  <button onClick={() => {
                    dispatch(clearSelections())
                    setSelectedYear(null)
                  }}>✕</button>
                </div>
              )}
            </div>
          )}

          {selectedModel && (
            <div className="selection-step">
              <h3>Год:</h3>
              {!selectedYear ? (
                <div className="items-grid">
                  {years.map((year) => (
                    <button
                      key={year.id}
                      className="item-card"
                      onClick={() => setSelectedYear(year)}
                    >
                      {year.value}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="selected-item">
                  <span>{selectedYear.value}</span>
                  <button onClick={() => setSelectedYear(null)}>✕</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedYear && (
        <div className="file-management">
          <div className="action-tabs">
            <button 
              className={!showDeleteMode ? 'active' : ''}
              onClick={() => setShowDeleteMode(false)}
            >
              ➕ Добавить файл
            </button>
            <button 
              className={showDeleteMode ? 'active' : ''}
              onClick={() => setShowDeleteMode(true)}
            >
              🗑️ Удалить файл
            </button>
          </div>

          {!showDeleteMode ? (
            <div className="add-file-form">
              <h3>Добавить {getFileTypeLabel()}</h3>
              <p>Вставьте ссылку на файл в Google Drive:</p>
              <input
                type="text"
                value={googleDriveUrl}
                onChange={(e) => setGoogleDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="input-text"
              />
              <button onClick={handleAddFile} className="btn-submit">
                ➕ Добавить файл
              </button>
            </div>
          ) : (
            <div className="delete-files-list">
              <h3>Удалить {getFileTypeLabel()}</h3>
              {filesForDeletion.length > 0 ? (
                <div className="files-list">
                  {filesForDeletion.map((file) => (
                    <div key={file.id} className="file-item">
                      <div className="file-info">
                        <span>ID: {file.id}</span>
                        {file.caption && <span className="file-caption">{file.caption}</span>}
                      </div>
                      <button 
                        onClick={() => handleDeleteFile(file.id)}
                        className="btn-delete"
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Файлы этого типа не найдены</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ManageFilesPage

