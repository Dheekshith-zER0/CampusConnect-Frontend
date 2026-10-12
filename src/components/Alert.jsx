// type: "error" | "success" | "info". Renders nothing when there is no message.
function Alert({ type = 'error', children, onRetry, onClose }) {
  if (!children) return null

  return (
    <div className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="alert__text">{children}</span>
      {onRetry && (
        <button type="button" className="btn btn--small btn--outline" onClick={onRetry}>
          Try again
        </button>
      )}
      {onClose && (
        <button type="button" className="alert__close" aria-label="Dismiss message" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}

export default Alert
