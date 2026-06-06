import { NavLink } from 'react-router-dom'
import './Nav.css'

const LINKS = [
  { to: '/dsa',      label: 'DSA Grind' },
  { to: '/projects', label: 'Projects' },
  { to: '/media',    label: 'Media' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand">
          kartik<span>.</span>
        </NavLink>
        <div className="nav-links">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
