import { STATUSES } from '../utils/constants.js'

const NORMAL_FLOW = ['SUBMITTED', 'IN_PROGRESS', 'RESOLVED']
const REJECTED_FLOW = ['SUBMITTED', 'REJECTED']

const labelOf = (value) => STATUSES.find((s) => s.value === value)?.label

// Progress tracker: Submitted -> In Progress -> Resolved (or Submitted -> Rejected)
function StatusStepper({ status }) {
  const steps = status === 'REJECTED' ? REJECTED_FLOW : NORMAL_FLOW
  const current = steps.indexOf(status)
  const finished = status === 'RESOLVED' || status === 'REJECTED'

  return (
    <ol className={`stepper stepper--${status.toLowerCase()}`} aria-label="Complaint progress">
      {steps.map((step, index) => {
        const done = index < current || (finished && index === current)
        return (
          <li key={step} className={`stepper__step ${index === current ? 'is-current' : ''} ${done ? 'is-done' : ''}`}>
            <span className="stepper__dot" aria-hidden="true">
              {step === 'REJECTED' ? '✕' : done ? '✓' : index + 1}
            </span>
            <span className="stepper__label">
              {labelOf(step)}
              {index === current && <span className="sr-only"> (current status)</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default StatusStepper
