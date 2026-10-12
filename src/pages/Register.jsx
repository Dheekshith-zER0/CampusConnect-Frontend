import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Alert from '../components/Alert.jsx'
import FormField from '../components/FormField.jsx'
import { DEPARTMENTS } from '../utils/constants.js'
import { getErrorMessage, getFieldErrors } from '../utils/format.js'

const EMPTY = { name: '', rollNumber: '', department: '', email: '', password: '', confirmPassword: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Same rules as the backend's RegisterRequest validation
function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.rollNumber.trim()) errors.rollNumber = 'Roll number is required'
  if (!form.department.trim()) errors.department = 'Department is required'
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Enter a valid email address'
  if (form.password.length < 6 || form.password.length > 64) errors.password = 'Password must be 6 to 64 characters'
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match'
  return errors
}

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: undefined })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    setServerError('')
    try {
      await register({
        name: form.name.trim(),
        rollNumber: form.rollNumber.trim(),
        department: form.department.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/student', { replace: true, state: { flash: 'Your account is ready. You can now report campus issues.' } })
    } catch (err) {
      setServerError(getErrorMessage(err))
      setErrors(getFieldErrors(err))
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card auth-card--wide">
        <h1>Create your student account</h1>
        <p className="muted">Register to submit complaints and follow their progress.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <Alert>{serverError}</Alert>
          <FormField label="Full name" name="name" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
          <div className="form__row">
            <FormField
              label="Roll number"
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              error={errors.rollNumber}
              placeholder="e.g. 22CS101"
            />
            <FormField
              label="Department"
              name="department"
              list="department-options"
              value={form.department}
              onChange={handleChange}
              error={errors.department}
              placeholder="Choose or type"
            />
            <datalist id="department-options">
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department} />
              ))}
            </datalist>
          </div>
          <FormField
            label="College email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@college.edu"
          />
          <div className="form__row">
            <FormField
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              hint="At least 6 characters"
            />
            <FormField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
