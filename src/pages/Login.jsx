import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Alert from '../components/Alert.jsx'
import FormField from '../components/FormField.jsx'
import { getErrorMessage, homePathFor } from '../utils/format.js'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      setError('Enter your email and password')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const user = await login({ email: form.email.trim(), password: form.password })
      // Return to the page the user originally tried to open, if any
      navigate(location.state?.from || homePathFor(user), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Welcome back</h1>
        <p className="muted">Log in to report issues or manage complaints.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <Alert>{error}</Alert>
          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@college.edu"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-card__footer">
          New student? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-card__note muted small">
          Administrators log in here with the account configured on the server.
        </p>
      </div>
    </div>
  )
}

export default Login
