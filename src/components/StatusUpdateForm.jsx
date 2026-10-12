import { useState } from 'react'
import Alert from './Alert.jsx'
import FormField from './FormField.jsx'
import { adminApi } from '../api/services.js'
import { STATUSES } from '../utils/constants.js'
import { getErrorMessage } from '../utils/format.js'

// Administrator panel for changing a complaint's status
function StatusUpdateForm({ complaint, onUpdated }) {
  const [status, setStatus] = useState(complaint.status)
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'REJECTED' && !remarks.trim()) {
      setError('Please give a reason when rejecting a complaint')
      return
    }

    setSaving(true)
    setError('')
    try {
      const updated = await adminApi.updateStatus(complaint.id, { status, remarks: remarks.trim() })
      onUpdated(`Status updated to ${updated.statusLabel}.`)
    } catch (err) {
      setError(getErrorMessage(err))
      setSaving(false)
    }
  }

  return (
    <form className="card status-form" onSubmit={handleSubmit}>
      <h2>Update status</h2>
      <Alert>{error}</Alert>

      <FormField as="select" label="Status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </FormField>

      <FormField
        as="textarea"
        label={status === 'REJECTED' ? 'Reason for rejection' : 'Remarks for the student (optional)'}
        name="remarks"
        rows={3}
        maxLength={500}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="e.g. Electrician assigned, expected fix by Friday"
      />

      <button type="submit" className="btn btn--primary btn--block" disabled={saving}>
        {saving ? 'Saving...' : 'Save status'}
      </button>
    </form>
  )
}

export default StatusUpdateForm
