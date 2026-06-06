import { Link } from 'react-router-dom'
import './Home.css'

const SECTIONS = [
  {
    to: "/revision",
    emoji: "🧠",
    name: "Revision Mapper",
    hint: "Spaced repetition and knowledge tracking."
  },
  {
    to: '/projects',
    emoji: '🛠',
    name: 'Projects',
    hint: 'Builds, experiments, systems and software.'
  },
  {
    to: '/media',
    emoji: '📚',
    name: 'Media & Docs',
    hint: 'Notes, PDFs, journals, references and archives.'
  }
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero fade-up">
        <span className="eyebrow">Digital garden</span>
        <h1 className="hero-title">
          Everything I'm building,<br />
          <em>thinking &amp; making.</em>
        </h1>
        <p className="hero-sub">
          A private space for projects, references, and notes.
          Everything lives here so I don't lose it.
        </p>
      </section>

      <div className="sections-grid">
        {SECTIONS.map((s, i) => (
          <Link key={s.to} to={s.to} className={`sec-card fade-up d${i + 1}`}>
            <span className="sc-emoji">{s.emoji}</span>
            <div className="sc-name">{s.name}</div>
            <div className="sc-hint">{s.hint}</div>
            <div className="sc-arrow">open →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
