export function PrimaryButton({ children, disabled, onClick, style = {} }) {
  return (
    <button className="primary-button" disabled={disabled} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, danger = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: 'transparent',
        color: danger ? '#8b2020' : '#888',
        border: `1px solid ${danger ? 'rgba(139,32,32,0.3)' : 'rgba(255,255,255,0.07)'}`,
        padding: '16px 24px',
        fontSize: 11,
        fontFamily: "'Barlow Condensed',sans-serif",
        fontWeight: 500,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        borderRadius: 0,
        transition: 'all 0.2s',
        ...style,
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = danger ? 'rgba(139,32,32,0.6)' : 'rgba(74,120,58,0.35)';
        event.currentTarget.style.color = danger ? '#c03030' : '#f2f2f0';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = danger ? 'rgba(139,32,32,0.3)' : 'rgba(255,255,255,0.07)';
        event.currentTarget.style.color = danger ? '#8b2020' : '#888';
      }}
    >
      {children}
    </button>
  );
}
