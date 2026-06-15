export default function SectionLabel({ children, style = {} }) {
  return (
    <div
      className="section-label"
      style={{
        marginBottom: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
