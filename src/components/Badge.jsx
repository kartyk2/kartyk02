export default function Badge({ children }) {
  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.05)',
      }}
    >
      {children}
    </span>
  );
}