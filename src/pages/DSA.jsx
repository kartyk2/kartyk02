import { useState } from 'react'
import Badge from '../components/Badge'
import { DSA_TOPICS } from '../data/content'
import './DSA.css'

const DIFF_COLOR = { easy: 'green', medium: 'amber', hard: 'red' }

export default function DSA() {
  const [done, setDone] = useState(() => {
    const all = DSA_TOPICS.flatMap(t => t.problems)
    return new Set(all.filter(p => p.done).map(p => p.id))
  })

  const toggle = id => setDone(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const allProbs = DSA_TOPICS.flatMap(t => t.problems)
  const pct = Math.round((done.size / allProbs.length) * 100)

  return (
    <div className="page-wrap">
      <div className="page-head fade-up">
        <span className="eyebrow">Practice</span>
        <h1 className="page-title">DSA Grind</h1>
        <p className="page-sub">Track problems by topic. Click to mark done.</p>
      </div>

      <div className="dsa-progress fade-up d1">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-label">
          {done.size} / {allProbs.length} solved · {pct}%
        </span>
      </div>

      <div className="dsa-topics">
        {DSA_TOPICS.map((topic, i) => {
          const topicDone = topic.problems.filter(p => done.has(p.id)).length
          return (
            <div key={topic.id} className={`topic-block fade-up d${(i % 4) + 1}`}>
              <div className="topic-head">
                <span className="topic-name">{topic.title}</span>
                <span className="topic-count">{topicDone}/{topic.problems.length}</span>
              </div>
              <div className="problem-list">
                {topic.problems.map(p => (
                  <div
                    key={p.id}
                    className={`problem-row ${done.has(p.id) ? 'done' : ''}`}
                  >
                    <button className="prob-check" onClick={() => toggle(p.id)}>
                      {done.has(p.id) ? '✓' : '○'}
                    </button>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prob-title"
                    >
                      {p.title}
                    </a>
                    <Badge color={DIFF_COLOR[p.difficulty]}>{p.difficulty}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
