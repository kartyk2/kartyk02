import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: "/revision", label: "Revision Mapper" },
  { to: "/projects", label: "Projects" },
  { to: "/media", label: "Media" },
];

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(10,10,10,0.75)',
  },

  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
  },

  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },

  link: {
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 500,
    transition: 'all .2s ease',
  },

  activeLink: {
    color: '#fff',
    fontWeight: 700,
  },
}

export default function Nav() {
  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <NavLink to="/" style={styles.brand}>
          kartik<span>.</span>
        </NavLink>

        <div style={styles.links}>
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}