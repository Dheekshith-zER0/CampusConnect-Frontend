import { STATUSES } from '../utils/constants.js'

function StatusBadge({ status }) {
  const label = STATUSES.find((s) => s.value === status)?.label || status
  return <span className={`badge badge--${status.toLowerCase()}`}>{label}</span>
}

export default StatusBadge
