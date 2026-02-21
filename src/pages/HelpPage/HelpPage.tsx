import { memo } from 'react'
import { Link } from 'react-router-dom'
import './HelpPage.scss'

const HELP_CONTENT = {
  title: 'Как пользоваться Auto Signal',
  sections: [
    {
      title: '🔍 Поиск автомобилей',
      text: 'Перейдите в раздел «Автомобили» и выберите марку, модель и год выпуска. Система покажет доступные материалы по сигнализациям для выбранной комплектации.',
    },
    {
      title: '🔐 Вход в систему',
      text: 'Для доступа к подписке и премиум-контенту войдите, указав ваш Telegram username (например, @username) или числовой User ID. Регистрация происходит автоматически при первом входе.',
    },
    {
      title: '💎 Премиум подписка',
      text: 'Премиум-пользователи получают доступ к эксклюзивным фото, расширенным материалам и файлам, недоступным обычным пользователям. Оформить подписку можно в разделе «Подписки».',
    },
    {
      title: '📁 Материалы',
      text: 'Для каждой модели доступны фото и PDF-инструкции по установке сигнализаций. Премиум-пользователи видят дополнительные материалы.',
    },
  ],
}

const HelpPage = memo(() => {
  return (
    <div className="help-page">
      <h1>📖 Справка</h1>
      <div className="help-content">
        <p className="help-intro">{HELP_CONTENT.title}</p>
        {HELP_CONTENT.sections.map((section) => (
          <section key={section.title} className="help-section">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <p className="help-nav">
          <Link to="/cars">→ Перейти к поиску автомобилей</Link>
        </p>
      </div>
    </div>
  )
})

HelpPage.displayName = 'HelpPage'

export default HelpPage
