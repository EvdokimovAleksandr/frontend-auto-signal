import { useEffect, useState } from 'react'
import { infoService } from '../../services/infoService'
import './HelpPage.css'

const HelpPage = () => {
  const [helpText, setHelpText] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHelp = async () => {
      try {
        const data = await infoService.getHelp()
        setHelpText(data.help)
      } catch (error) {
        setHelpText('Ошибка при загрузке справки')
      } finally {
        setLoading(false)
      }
    }

    fetchHelp()
  }, [])

  return (
    <div className="help-page">
      <h1>📖 Справка</h1>
      
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="help-content">
          <div 
            className="help-text" 
            dangerouslySetInnerHTML={{ __html: helpText.replace(/\n/g, '<br />') }}
          />
        </div>
      )}
    </div>
  )
}

export default HelpPage

