import { useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { complaintApi } from '../../api/services.js'
import { useApi } from '../../hooks/useApi.js'
import Alert from '../../components/Alert.jsx'
import ComplaintForm from '../../components/ComplaintForm.jsx'
import Loader from '../../components/Loader.jsx'

function EditComplaint() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fetchComplaint = useCallback(() => complaintApi.getById(id), [id])
  const { data, loading, error, reload } = useApi(fetchComplaint)

  async function handleSubmit(values) {
    await complaintApi.update(id, values)
    navigate(`/complaints/${id}`, { state: { flash: 'Your changes have been saved.' } })
  }

  const complaint = data?.complaint

  return (
    <div className="page page--narrow">
      <Link to={`/complaints/${id}`} className="back-link">
        ← Back to complaint
      </Link>

      {loading && <Loader label="Loading complaint..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}

      {!loading && complaint && complaint.status !== 'SUBMITTED' && (
        <Alert type="info">
          This complaint is already {complaint.statusLabel} and can no longer be edited.
        </Alert>
      )}

      {!loading && complaint?.status === 'SUBMITTED' && (
        <div className="card">
          <h1>Edit {complaint.referenceNo}</h1>
          <p className="muted">You can change the details until the administration starts working on it.</p>
          <ComplaintForm
            initialValues={{
              category: complaint.category,
              title: complaint.title,
              location: complaint.location || '',
              description: complaint.description,
            }}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/complaints/${id}`)}
          />
        </div>
      )}
    </div>
  )
}

export default EditComplaint
