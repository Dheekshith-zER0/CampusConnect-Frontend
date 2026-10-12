import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { useApi } from '../../hooks/useApi.js'
import { complaintApi } from '../../api/services.js'
import Alert from '../../components/Alert.jsx'
import ComplaintCard from '../../components/ComplaintCard.jsx'
import Loader from '../../components/Loader.jsx'
import StatCards from '../../components/StatCards.jsx'

function countByStatus(complaints) {
  const count = (status) => complaints.filter((c) => c.status === status).length
  return {
    total: complaints.length,
    submitted: count('SUBMITTED'),
    inProgress: count('IN_PROGRESS'),
    resolved: count('RESOLVED'),
    rejected: count('REJECTED'),
  }
}

function StudentDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const [flash, setFlash] = useState(location.state?.flash || '')
  const [filter, setFilter] = useState('')
  const { data: complaints, loading, error, reload } = useApi(complaintApi.getMine)

  const stats = useMemo(() => countByStatus(complaints || []), [complaints])
  const visible = (complaints || []).filter((c) => !filter || c.status === filter)
  const firstName = user.name.split(' ')[0]

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Hello, {firstName}</h1>
          <p className="muted">Here is every complaint you have raised and where it stands.</p>
        </div>
        <Link className="btn btn--primary" to="/student/new">
          + New complaint
        </Link>
      </div>

      <Alert type="success" onClose={() => setFlash('')}>
        {flash}
      </Alert>

      {loading && !complaints && <Loader label="Loading your complaints..." />}
      {error && (
        <Alert onRetry={reload}>
          {error}
        </Alert>
      )}

      {complaints && (
        <>
          <StatCards stats={stats} active={filter} onSelect={setFilter} />

          {complaints.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-state__icon" aria-hidden="true">📝</span>
              <h2>No complaints yet</h2>
              <p className="muted">Noticed something broken, unsafe or unclean on campus? Let the administration know.</p>
              <Link className="btn btn--primary" to="/student/new">
                Report your first issue
              </Link>
            </div>
          ) : visible.length === 0 ? (
            <p className="muted center">No complaints with this status.</p>
          ) : (
            <ul className="complaint-list">
              {visible.map((complaint) => (
                <li key={complaint.id}>
                  <ComplaintCard complaint={complaint} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default StudentDashboard
