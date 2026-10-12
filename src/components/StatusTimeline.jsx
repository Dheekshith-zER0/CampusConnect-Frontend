import StatusBadge from './StatusBadge.jsx'
import { formatDateTime } from '../utils/format.js'

// Chronological list of every status change for a complaint
function StatusTimeline({ history }) {
  if (!history?.length) {
    return <p className="muted">No updates yet.</p>
  }

  return (
    <ol className="timeline">
      {history.map((item) => (
        <li key={item.id} className={`timeline__item timeline__item--${item.status.toLowerCase()}`}>
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__body">
            <div className="timeline__head">
              <StatusBadge status={item.status} />
              <time className="muted small" dateTime={item.createdAt}>
                {formatDateTime(item.createdAt)}
              </time>
            </div>
            {item.remarks && <p className="timeline__remarks">{item.remarks}</p>}
            <p className="muted small">by {item.updatedBy}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default StatusTimeline
