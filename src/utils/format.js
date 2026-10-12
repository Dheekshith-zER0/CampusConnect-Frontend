const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export function formatDateTime(iso) {
  return iso ? dateTimeFormat.format(new Date(iso)) : '-'
}

export function formatDate(iso) {
  return iso ? dateFormat.format(new Date(iso)) : '-'
}

// "3 hours ago", "2 days ago"
export function timeAgo(iso) {
  if (!iso) return ''
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, size] of units) {
    if (seconds >= size) {
      const value = Math.floor(seconds / size)
      return `${value} ${unit}${value > 1 ? 's' : ''} ago`
    }
  }
  return 'just now'
}

// Turns an Axios error into a message that can be shown to the user
export function getErrorMessage(error) {
  if (error?.response) {
    return error.response.data?.message || `Request failed with status ${error.response.status}`
  }
  if (error?.code === 'ECONNABORTED') {
    return 'The server took too long to respond. It may be waking up, so please try again.'
  }
  return 'Cannot reach the server. Check your internet connection and try again.'
}

// Field-level validation messages from the backend, e.g. { title: "Title is required" }
export function getFieldErrors(error) {
  return error?.response?.data?.fieldErrors || {}
}

export function homePathFor(user) {
  return user?.role === 'ADMIN' ? '/admin' : '/student'
}
