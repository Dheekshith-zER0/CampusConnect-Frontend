import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import StatusBadge from '../components/StatusBadge.jsx'
import { CATEGORIES } from '../utils/constants.js'
import { homePathFor } from '../utils/format.js'

const STEPS = [
  { title: 'Report', text: 'Pick a category, describe the problem and where it is. It takes under a minute.' },
  { title: 'Track', text: 'Every complaint gets a reference number and a live status you can check any time.' },
  { title: 'Resolve', text: 'The administration updates the status and leaves remarks until the issue is fixed.' },
]

function Home() {
  const { user } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__text">
          <span className="eyebrow">Campus Issue &amp; Complaint Management</span>
          <h1>Report campus problems. Track them until they&apos;re fixed.</h1>
          <p className="lead">
            CampusConnect lets students raise issues about classrooms, electricity, water, Wi-Fi, cleanliness and
            more, and gives the administration one dashboard to manage and resolve every complaint.
          </p>
          <div className="hero__actions">
            {user ? (
              <Link className="btn btn--primary btn--large" to={homePathFor(user)}>
                Go to my dashboard
              </Link>
            ) : (
              <>
                <Link className="btn btn--primary btn--large" to="/register">
                  Register as a student
                </Link>
                <Link className="btn btn--outline btn--large" to="/login">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero__preview" aria-hidden="true">
          <div className="preview-card">
            <div className="preview-card__row">
              <span className="ref">CC-00042</span>
              <StatusBadge status="IN_PROGRESS" />
            </div>
            <strong>Projector not working in Lab 3</strong>
            <span className="muted small">🔬 Classroom or Laboratory Issues · Block C</span>
            <div className="preview-card__note">“Technician assigned, replacement lamp arriving tomorrow.”</div>
          </div>
          <div className="preview-card preview-card--offset">
            <div className="preview-card__row">
              <span className="ref">CC-00038</span>
              <StatusBadge status="RESOLVED" />
            </div>
            <strong>Water leakage near hostel mess</strong>
            <span className="muted small">🚰 Water Supply · Hostel B</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>How it works</h2>
        <div className="how-steps">
          {STEPS.map((step, index) => (
            <div key={step.title} className="card how-step">
              <span className="how-step__number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p className="muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>What you can report</h2>
        <div className="category-showcase">
          {CATEGORIES.map((category) => (
            <div key={category.value} className="category-chip">
              <span aria-hidden="true">{category.icon}</span>
              <div>
                <strong>{category.label}</strong>
                <small>{category.hint}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
