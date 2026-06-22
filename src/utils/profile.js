import defaultProfile from '../data/profile.json'

const STORAGE_KEY = 'profile-data'
const PASSWORD_KEY = 'admin-password'
const DEFAULT_PASSWORD = 'admin123'

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function getPassword() {
  return sessionStorage.getItem(PASSWORD_KEY) || null
}

export async function setPassword(newPassword) {
  const hashed = await hashPassword(newPassword)
  sessionStorage.setItem(PASSWORD_KEY, hashed)
}

export async function verifyPassword(input) {
  const stored = getPassword()
  if (!stored) return input === DEFAULT_PASSWORD
  const hashed = await hashPassword(input)
  return hashed === stored
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
