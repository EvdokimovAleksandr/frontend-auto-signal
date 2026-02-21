import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigate } from '@/utils/navigation'

const NavigateSetter = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigate((path) => navigate(path))
    return () => setNavigate(null)
  }, [navigate])

  return null
}

export default NavigateSetter
