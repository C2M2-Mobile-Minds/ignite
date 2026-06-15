import IgniteLogo from './IgniteLogo';
import SectionLabel from './SectionLabel';
import { PrimaryButton } from './Button';

export default function Landing({ trainer, onStart }) {
  return (
    <main className="page">
      <div className="smoke-ring" />
      <div className="page-content">
        <div className="page-header" />
        <div className="page-section" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 72 }}>
            <div className="logo-frame">
              <IgniteLogo size={62} />
            </div>
          </div>
          <div style={{ margin: '36px 0 28px' }}>
            <div className="green-line" />
          </div>
          <p
            style={{
              color: 'rgba(242,242,240,0.45)',
              fontSize: 14,
              lineHeight: 1.85,
              letterSpacing: '0.03em',
              marginBottom: 40,
            }}
          >
            {trainer.bio}
          </p>          
          <PrimaryButton onClick={onStart}>Inicia a Tua Transformação</PrimaryButton>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center', marginTop: 18 }}>
            <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <a
              href={`https://instagram.com/${trainer.instagram?.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                fontSize: 11,
                color: '#888',
                letterSpacing: '0.18em',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              {trainer.instagram}
            </a>
            <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>
        </div>
      </div>
    </main>
  );
}
