import { Link, useNavigate } from 'react-router-dom'
import { complaintApi } from '../../api/services.js'
import ComplaintForm from '../../components/ComplaintForm.jsx'

function NewComplaint() {
  const navigate = useNavigate()

  async function handleSubmit(values) {
    const created = await complaintApi.create(values)
    navigate(`/complaints/${created.id}`, {
      state: { flash: `Complaint ${created.referenceNo} submitted. You can track its status here.` },
    })
  }

  return (
    <div className="page page--narrow">
      <Link to="/student" className="back-link">
        ← Back to my complaints
      </Link>
      <div className="card">
        <h1>Report a campus issue</h1>
        <p className="muted">Give enough detail for the campus team to find and fix the problem.</p>
        <ComplaintForm submitLabel="Submit complaint" onSubmit={handleSubmit} onCancel={() => navigate('/student')} />
      </div>
    </div>
  )
}

export default NewComplaint
