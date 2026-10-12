import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminApi } from '../../api/services.js'
import { useApi } from '../../hooks/useApi.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import Alert from '../../components/Alert.jsx'
import Loader from '../../components/Loader.jsx'
import StatCards from '../../components/StatCards.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { CATEGORIES, STATUSES, categoryOf } from '../../utils/constants.js'
import { formatDate, timeAgo } from '../../utils/format.js'

function AdminDashboard() {
  const location = useLocation()
  const [flash, setFlash] = useState(location.state?.flash || '')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())

  const fetchComplaints = useCallback(
    () => adminApi.getComplaints({ status, category, search: debouncedSearch }),
    [status, category, debouncedSearch],
  )
  const complaints = useApi(fetchComplaints)
  const stats = useApi(adminApi.getStats)

  const hasFilters = Boolean(status || category || search)

  function refresh() {
    complaints.reload()
    stats.reload()
  }

  function clearFilters() {
    setStatus('')
    setCategory('')
    setSearch('')
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Complaint dashboard</h1>
          <p className="muted">Review, prioritise and resolve complaints submitted by students.</p>
        </div>
        <button type="button" className="btn btn--outline" onClick={refresh}>
          ↻ Refresh
        </button>
      </div>

      <Alert type="success" onClose={() => setFlash('')}>
        {flash}
      </Alert>
      {stats.error && <Alert onRetry={stats.reload}>{stats.error}</Alert>}

      <StatCards stats={stats.data} active={status} onSelect={setStatus} />

      <section className="card table-card">
        <div className="toolbar">
          <input
            type="search"
            className="toolbar__search"
            aria-label="Search complaints"
            placeholder="Search by title, location, student name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button type="button" className="btn btn--ghost btn--small" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {complaints.error && <Alert onRetry={complaints.reload}>{complaints.error}</Alert>}
        {complaints.loading && !complaints.data && <Loader label="Loading complaints..." />}

        {complaints.data && complaints.data.length === 0 && (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">{hasFilters ? '🔍' : '🎉'}</span>
            <h2>{hasFilters ? 'No matching complaints' : 'No complaints yet'}</h2>
            <p className="muted">
              {hasFilters ? 'Try a different search or clear the filters.' : 'New complaints from students will appear here.'}
            </p>
          </div>
        )}

        {complaints.data && complaints.data.length > 0 && (
          <div className={`table-wrap ${complaints.loading ? 'is-refreshing' : ''}`}>
            <table className="table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Student</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {complaints.data.map((c) => (
                  <tr key={c.id}>
                    <td data-label="Complaint">
                      <span className="ref">{c.referenceNo}</span>
                      <Link to={`/complaints/${c.id}`} className="table__title">
                        {c.title}
                      </Link>
                      {c.location && <small className="muted">📍 {c.location}</small>}
                    </td>
                    <td data-label="Category">
                      <span aria-hidden="true">{categoryOf(c.category).icon}</span> {c.categoryLabel}
                    </td>
                    <td data-label="Student">
                      {c.student.name}
                      <small className="muted">
                        {[c.student.rollNumber, c.student.department].filter(Boolean).join(' · ')}
                      </small>
                    </td>
                    <td data-label="Submitted">
                      {formatDate(c.createdAt)}
                      <small className="muted">{timeAgo(c.createdAt)}</small>
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="table__actions">
                      <Link className="btn btn--small btn--outline" to={`/complaints/${c.id}`}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard
