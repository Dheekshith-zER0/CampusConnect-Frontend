import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'
import { authApi } from '../api/services.js'
import { setUnauthorizedHandler } from '../api/client.js'
import { readStoredAuth, writeStoredAuth } from '../utils/storage.js'

function AuthProvider({ children }) {
  // { token, user } restored from localStorage so a page refresh keeps the user logged in
  const [auth, setAuth] = useState(readStoredAuth)

  const saveAuth = useCallback((next) => {
    writeStoredAuth(next)
    setAuth(next)
  }, [])

  // Log out automatically when the backend rejects the token
  useEffect(() => {
    setUnauthorizedHandler(() => saveAuth(null))
    return () => setUnauthorizedHandler(null)
  }, [saveAuth])

  // Refresh the stored profile in the background (the token may have been revoked)
  useEffect(() => {
    const stored = readStoredAuth()
    if (!stored?.token) return
    authApi
      .me()
      .then((user) => saveAuth({ token: stored.token, user }))
      .catch(() => {
        // 401 is handled by the interceptor; network errors keep the cached session
      })
  }, [saveAuth])

  const login = useCallback(
    async (credentials) => {
      const result = await authApi.login(credentials)
      saveAuth(result)
      return result.user
    },
    [saveAuth],
  )

  const register = useCallback(
    async (details) => {
      const result = await authApi.register(details)
      saveAuth(result)
      return result.user
    },
    [saveAuth],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Even if the request fails, clear the local session
    }
    saveAuth(null)
  }, [saveAuth])

  const value = useMemo(
    () => ({ user: auth?.user || null, login, register, logout }),
    [auth, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
