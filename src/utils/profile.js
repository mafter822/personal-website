import defaultProfile from '../data/profile.json'

const STORAGE_KEY = 'profile-data'
const PASSWORD_KEY = 'admin-password'
const DEFAULT_PASSWORD = 'admin123'

export function getPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD
}

export function setPassword(newPassword) {
  localStorage.setItem(PASSWORD_KEY, newPassword)
}

export function verifyPassword(input) {
  return input === getPassword()
}

export function getProfile() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed && parsed.profile) {
        return parsed
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
  return defaultProfile
}

export function saveProfile(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetProfile() {
  localStorage.removeItem(STORAGE_KEY)
  return defaultProfile
}

export function exportProfile() {
  const data = getProfile()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'profile.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importProfile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        saveProfile(data)
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function getLocalizedText(text, locale) {
  if (typeof text === 'string') return text
  if (text && typeof text === 'object') return text[locale] || text.en || ''
  return ''
}
