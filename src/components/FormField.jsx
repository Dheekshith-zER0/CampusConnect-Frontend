// Label + input + validation message. Pass as="textarea" or as="select" for other controls.
function FormField({ label, name, error, hint, as: Control = 'input', children, ...props }) {
  const messageId = `${name}-message`

  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <Control
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        {...props}
      >
        {children}
      </Control>
      {error ? (
        <p id={messageId} className="field__error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="field__hint">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export default FormField
