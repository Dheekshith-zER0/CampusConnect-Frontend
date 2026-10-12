import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import { categoryOf } from '../utils/constants.js'
import { formatDate, timeAgo } from '../utils/format.js'

function ComplaintCard({ complaint }) {
  const category = categoryOf(complaint.category)

  return (
    <Link to={`/complaints/${complaint.id}`} className="complaint-card">
      <span className="complaint-card__icon" aria-hidden="true">
        {category.icon}
      </span>
      <div className="complaint-card__main">
        <div className="complaint-card__meta">
          <span className="ref">{complaint.referenceNo}</span>
          <span>{complaint.categoryLabel}</span>
        </div>
        <h3 className="complaint-card__title">{complaint.title}</h3>
        <p className="complaint-card__sub">
          {complaint.location && <span>📍 {complaint.location}</span>}
          <span title={formatDate(complaint.createdAt)}>Submitted {timeAgo(complaint.createdAt)}</span>
        </p>
        {complaint.adminRemarks && <p className="complaint-card__remarks">“{complaint.adminRemarks}”</p>}
      </div>
      <StatusBadge status={complaint.status} />
    </Link>
  )
}

export default ComplaintCard
