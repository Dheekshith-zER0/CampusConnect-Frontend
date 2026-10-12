import axios from 'axios'
import { readStoredAuth } from '../utils/storage.js'

// VITE_API_BASE_URL is the backend URL, e.g. https://campusconnect-backend.onrender.com
// A trailing slash or "/api" suffix is tolerated so a small typo in Vercel doesn't break the app.
const backendUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api$/, '')

export const API_BASE_URL = `${backendUrl}/api`

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render's free tier can take up to a minute to wake up
  timeout: 70000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = readStoredAuth()?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let unauthorizedHandler = null

// AuthProvider registers a callback that logs the user out when the token is rejected
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isLoginAttempt = url.includes('/auth/login') || url.includes('/auth/register')
    if (error.response?.status === 401 && !isLoginAttempt && unauthorizedHandler) {
      unauthorizedHandler()
    }
    return Promise.reject(error)
  },
)

export default api
