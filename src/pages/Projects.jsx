import Badge from '../components/Badge'
import { PROJECTS, STATUS_STYLE } from '../data/content'
import './Projects.css'

const STATUS_COLOR = { active: 'green', shipped: 'blue', paused: 'amber', idea: 'default' }

export default function Projects() {
  return (
    <div className="page-wrap">
      <div className="page-head fade-up">
        <span className="eyebrow">Portfolio</span>
        <h1 className="page-title">Projects</h1>
        <p className="page-sub">Ongoing builds, side experiments, shipped things.</p>
      </div>

      <div className="proj-list">
        {PROJECTS.map((p, i) => (
          <div key={p.id} className={`proj-card fade-up d${i + 1}`}>
            <div className="proj-top">
              <span className="proj-title">{p.title}</span>
              <Badge color={STATUS_COLOR[p.status]}>{STATUS_STYLE[p.status].label}</Badge>
            </div>
            <p className="proj-desc">{p.desc}</p>
            <div className="proj-footer">
              {p.tags.map(t => <Badge key={t}>{t}</Badge>)}
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="proj-link">
                  view →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
