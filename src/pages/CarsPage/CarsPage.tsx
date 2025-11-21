import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import { getBrandsRequest, getModelsRequest, selectBrand, selectModel } from '../../store/cars/carsSlice'
import './CarsPage.css'

const CarsPage = () => {
  const dispatch = useAppDispatch()
  const { brands, models, selectedBrand, loading } = useAppSelector((state) => state.cars)

  useEffect(() => {
    dispatch(getBrandsRequest())
  }, [dispatch])

  const handleBrandSelect = (brand: typeof brands[0]) => {
    dispatch(selectBrand(brand))
    dispatch(getModelsRequest(brand.id))
  }

  return (
    <div className="cars-page">
      <h1>Автомобили</h1>
      
      {loading && <p>Загрузка...</p>}
      
      <div className="cars-content">
        <div className="brands-section">
          <h2>Марки</h2>
          <div className="brands-list">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className={`brand-item ${selectedBrand?.id === brand.id ? 'active' : ''}`}
                onClick={() => handleBrandSelect(brand)}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {selectedBrand && (
          <div className="models-section">
            <h2>Модели {selectedBrand.name}</h2>
            {models.length > 0 ? (
              <div className="models-list">
                {models.map((model) => (
                  <div key={model.id} className="model-item">
                    {model.name}
                  </div>
                ))}
              </div>
            ) : (
              <p>Модели не найдены</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CarsPage



