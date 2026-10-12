import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { homePathFor } from '../utils/format.js'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  async function handleLogout() {
    close()
    await logout()
    navigate('/login')
  }

  let links = []
  if (user?.role === 'ADMIN') {
    links = [{ to: '/admin', label: 'Dashboard' }]
  } else if (user) {
    links = [
      { to: '/student', label: 'My Complaints' },
      { to: '/student/new', label: 'New Complaint' },
    ]
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to={user ? homePathFor(user) : '/'} className="brand" onClick={close}>
          <img src="/favicon.svg" alt="" width="32" height="32" />
          <span>
            Campus<strong>Connect</strong>
          </span>
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__menu ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end className="navbar__link" onClick={close}>
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <div className="navbar__user">
              <span className="avatar" aria-hidden="true">
                {initials(user.name)}
              </span>
              <span className="navbar__user-text">
                <strong>{user.name}</strong>
                <small>{user.role === 'ADMIN' ? 'Administrator' : user.rollNumber}</small>
              </span>
              <button type="button" className="btn btn--outline btn--small" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="navbar__guest">
              <NavLink to="/login" className="navbar__link" onClick={close}>
                Log in
              </NavLink>
              <Link to="/register" className="btn btn--primary btn--small" onClick={close}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
