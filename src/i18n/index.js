import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

function getDefaultLocale() {
  const saved = localStorage.getItem('locale')
  if (saved) return saved
  const lang = navigator.language || navigator.userLanguage
  return lang.startsWith('zh') ? 'zh' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: { zh, en },
})

export default i18n
