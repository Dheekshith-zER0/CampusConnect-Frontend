import { useState } from 'react'
import Alert from './Alert.jsx'
import FormField from './FormField.jsx'
import { CATEGORIES } from '../utils/constants.js'
import { getErrorMessage, getFieldErrors } from '../utils/format.js'

const EMPTY = { category: '', title: '', location: '', description: '' }

// Same limits as the backend's ComplaintRequest validation
function validate(values) {
  const errors = {}
  const title = values.title.trim()
  const description = values.description.trim()

  if (!values.category) errors.category = 'Choose the category that best fits the issue'
  if (title.length < 5) errors.title = 'Title must be at least 5 characters'
  else if (title.length > 150) errors.title = 'Title must be at most 150 characters'
  if (values.location.trim().length > 150) errors.location = 'Location must be at most 150 characters'
  if (description.length < 10) errors.description = 'Describe the issue in at least 10 characters'
  else if (description.length > 2000) errors.description = 'Description must be at most 2000 characters'

  return errors
}

// Used for both creating and editing a complaint. onSubmit receives the cleaned values.
function ComplaintForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    setServerError('')
    try {
      await onSubmit({
        category: values.category,
        title: values.title.trim(),
        location: values.location.trim(),
        description: values.description.trim(),
      })
    } catch (error) {
      setServerError(getErrorMessage(error))
      setErrors(getFieldErrors(error))
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Alert>{serverError}</Alert>

      <fieldset className={`field ${errors.category ? 'has-error' : ''}`}>
        <legend>Category</legend>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <label
              key={category.value}
              className={`category-option ${values.category === category.value ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={values.category === category.value}
                onChange={handleChange}
              />
              <span className="category-option__icon" aria-hidden="true">
                {category.icon}
              </span>
              <span className="category-option__text">
                <strong>{category.label}</strong>
                <small>{category.hint}</small>
              </span>
            </label>
          ))}
        </div>
        {errors.category && <p className="field__error">{errors.category}</p>}
      </fieldset>

      <FormField
        label="Title"
        name="title"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
        maxLength={150}
        placeholder="e.g. Ceiling fan not working in Room 204"
      />

      <FormField
        label="Location (optional)"
        name="location"
        value={values.location}
        onChange={handleChange}
        error={errors.location}
        maxLength={150}
        placeholder="e.g. Block A, 2nd floor, Room 204"
      />

      <FormField
        as="textarea"
        label="Description"
        name="description"
        rows={6}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
        hint={`${values.description.trim().length}/2000 characters - when did it start, how severe is it?`}
        maxLength={2000}
        placeholder="Describe the problem in detail"
      />

      <div className="form__actions">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ComplaintForm
