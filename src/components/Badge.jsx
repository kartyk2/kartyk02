export default function Badge({ children, color = 'default' }) {
  const styles = {
    default: { background: '#f4f3f0', color: '#706e68' },
    blue:    { background: '#eef3ff', color: '#2d5be3' },
    green:   { background: '#e8faf2', color: '#1a7a4a' },
    amber:   { background: '#fff8e1', color: '#b45309' },
    red:     { background: '#fef2f2', color: '#c0392b' },
  }
  return (
    <span style={{
      ...styles[color] || styles.default,
      fontFamily: 'var(--mono)',
      fontSize: 10,
      letterSpacing: '.05em',
      padding: '2px 8px',
      borderRadius: 20,
      display: 'inline-block',
      textTransform: 'uppercase',
    }}>
      {children}
    </span>
  )
}
