const CARDS = [
  { key: '', label: 'Total', field: 'total' },
  { key: 'SUBMITTED', label: 'Submitted', field: 'submitted' },
  { key: 'IN_PROGRESS', label: 'In Progress', field: 'inProgress' },
  { key: 'RESOLVED', label: 'Resolved', field: 'resolved' },
  { key: 'REJECTED', label: 'Rejected', field: 'rejected' },
]

// Summary counts per status. Clicking a card filters the list by that status.
function StatCards({ stats, active = '', onSelect }) {
  return (
    <div className="stats">
      {CARDS.map((card) => (
        <button
          key={card.field}
          type="button"
          className={`stat stat--${card.field} ${active === card.key ? 'is-active' : ''}`}
          aria-pressed={active === card.key}
          onClick={() => onSelect(card.key)}
        >
          <span className="stat__value">{stats ? stats[card.field] : '–'}</span>
          <span className="stat__label">{card.label}</span>
        </button>
      ))}
    </div>
  )
}

export default StatCards
