import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { complaintApi } from '../api/services.js'
import { useApi } from '../hooks/useApi.js'
import { useAuth } from '../hooks/useAuth.js'
import Alert from '../components/Alert.jsx'
import Loader from '../components/Loader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import StatusStepper from '../components/StatusStepper.jsx'
import StatusTimeline from '../components/StatusTimeline.jsx'
import StatusUpdateForm from '../components/StatusUpdateForm.jsx'
import { categoryOf } from '../utils/constants.js'
import { formatDateTime, getErrorMessage } from '../utils/format.js'

// Shared by students (view / edit / withdraw) and administrators (update status / delete)
function ComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [flash, setFlash] = useState(location.state?.flash || '')
  const [actionError, setActionError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const fetchComplaint = useCallback(() => complaintApi.getById(id), [id])
  const { data, loading, error, reload } = useApi(fetchComplaint)

  const isAdmin = user.role === 'ADMIN'
  const backPath = isAdmin ? '/admin' : '/student'
  const backLink = (
    <Link to={backPath} className="back-link">
      ← Back to {isAdmin ? 'dashboard' : 'my complaints'}
    </Link>
  )

  if (!data) {
    return (
      <div className="page">
        {backLink}
        {loading ? <Loader label="Loading complaint..." /> : <Alert onRetry={reload}>{error}</Alert>}
      </div>
    )
  }

  const { complaint, history } = data
  const category = categoryOf(complaint.category)
  const canEdit = !isAdmin && complaint.status === 'SUBMITTED'

  async function handleDelete() {
    const question = isAdmin
      ? `Delete complaint ${complaint.referenceNo} permanently?`
      : `Withdraw complaint ${complaint.referenceNo}? This cannot be undone.`
    if (!window.confirm(question)) return

    setDeleting(true)
    setActionError('')
    try {
      await complaintApi.remove(complaint.id)
      navigate(backPath, {
        state: { flash: `Complaint ${complaint.referenceNo} was ${isAdmin ? 'deleted' : 'withdrawn'}.` },
      })
    } catch (err) {
      setActionError(getErrorMessage(err))
      setDeleting(false)
    }
  }

  function handleStatusUpdated(message) {
    setFlash(message)
    reload()
  }

  return (
    <div className="page">
      {backLink}
      <Alert type="success" onClose={() => setFlash('')}>
        {flash}
      </Alert>
      <Alert onClose={() => setActionError('')}>{actionError}</Alert>
      {error && <Alert onRetry={reload}>{error}</Alert>}

      <div className="detail-layout">
        <article className="card detail">
          <div className="detail__top">
            <span className="ref">{complaint.referenceNo}</span>
            <StatusBadge status={complaint.status} />
          </div>
          <h1 className="detail__title">{complaint.title}</h1>

          <StatusStepper status={complaint.status} />

          <dl className="detail__meta">
            <div>
              <dt>Category</dt>
              <dd>
                <span aria-hidden="true">{category.icon}</span> {complaint.categoryLabel}
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{complaint.location || 'Not specified'}</dd>
            </div>
            <div>
              <dt>Submitted</dt>
              <dd>{formatDateTime(complaint.createdAt)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDateTime(complaint.updatedAt)}</dd>
            </div>
          </dl>

          <h2>Description</h2>
          <p className="detail__description">{complaint.description}</p>

          {complaint.adminRemarks && (
            <div className="remarks">
              <strong>Remarks from the administration</strong>
              <p>{complaint.adminRemarks}</p>
            </div>
          )}

          {canEdit && (
            <div className="detail__actions">
              <Link className="btn btn--outline" to={`/student/complaints/${complaint.id}/edit`}>
                Edit complaint
              </Link>
              <button type="button" className="btn btn--danger-outline" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Withdrawing...' : 'Withdraw complaint'}
              </button>
            </div>
          )}
          {!isAdmin && !canEdit && (
            <p className="muted small detail__note">
              This complaint is being handled by the administration, so it can no longer be edited.
            </p>
          )}
        </article>

        <aside className="detail-side">
          {isAdmin && (
            <StatusUpdateForm key={complaint.updatedAt} complaint={complaint} onUpdated={handleStatusUpdated} />
          )}

          {isAdmin && (
            <section className="card">
              <h2>Submitted by</h2>
              <dl className="person">
                <dt>Name</dt>
                <dd>{complaint.student.name}</dd>
                <dt>Roll number</dt>
                <dd>{complaint.student.rollNumber || '-'}</dd>
                <dt>Department</dt>
                <dd>{complaint.student.department || '-'}</dd>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${complaint.student.email}`}>{complaint.student.email}</a>
                </dd>
              </dl>
            </section>
          )}

          <section className="card">
            <h2>Status history</h2>
            <StatusTimeline history={history} />
          </section>

          {isAdmin && (
            <button type="button" className="btn btn--danger-outline btn--block" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete complaint'}
            </button>
          )}
        </aside>
      </div>
    </div>
  )
}

export default ComplaintDetails
