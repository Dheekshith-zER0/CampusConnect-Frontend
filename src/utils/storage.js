const AUTH_KEY = 'campusconnect.auth'

// Returns { token, user } or null. Storage can be unavailable (private mode), so never throw.
export function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeStoredAuth(auth) {
  try {
    if (auth) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  } catch {
    // Ignore - the session simply won't survive a page reload
  }
}
