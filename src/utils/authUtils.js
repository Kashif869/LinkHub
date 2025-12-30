import bcrypt from 'bcryptjs'

const ADMIN_PASSWORD_HASH_KEY = 'linkInBio_adminPasswordHash'
const AUTH_TOKEN_KEY = 'linkInBio_authToken'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const setAdminPassword = async (password) => {
  const hash = await hashPassword(password)
  localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, hash)
  return hash
}

export const getAdminPasswordHash = () => {
  return localStorage.getItem(ADMIN_PASSWORD_HASH_KEY)
}

export const hasAdminPassword = () => {
  return !!getAdminPasswordHash()
}

export const isAuthenticated = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) return false

  try {
    const data = JSON.parse(token)
    const now = Date.now()
    return data.expiresAt > now
  } catch {
    return false
  }
}

export const login = async (password) => {
  const hash = getAdminPasswordHash()
  if (!hash) {
    throw new Error('No admin password set')
  }

  const isValid = await verifyPassword(password, hash)
  if (!isValid) {
    throw new Error('Invalid password')
  }

  const token = {
    expiresAt: Date.now() + SESSION_DURATION
  }
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token))
  return true
}

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const getRemainingSessionTime = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) return 0

  try {
    const data = JSON.parse(token)
    const remaining = data.expiresAt - Date.now()
    return Math.max(0, remaining)
  } catch {
    return 0
  }
}

export const extendSession = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) return

  const data = JSON.parse(token)
  data.expiresAt = Date.now() + SESSION_DURATION
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(data))
}
