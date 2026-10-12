import { useEffect, useState } from 'react'

function Loader({ label = 'Loading...' }) {
  // After a few seconds, explain the delay: Render's free tier sleeps when idle
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
      {slow && (
        <p className="loader__hint">
          The server is waking up. On free hosting the first request can take up to a minute.
        </p>
      )}
    </div>
  )
}

export default Loader
