export default function IgniteLogo({ size = 48, style = {}, align = 'center' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, ...style }}>
      <img
        src="/ignite.png"
        alt="Ignite Individual Coaching"
        style={{ width: size * 4, height: 'auto', display: 'block' }}
      />
    </div>
  );
}
