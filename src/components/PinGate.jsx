import { useState } from 'react';
import IgniteLogo from './IgniteLogo';
import SectionLabel from './SectionLabel';
import { getPin } from '../data/storage';

const NUMPAD_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'];

export default function PinGate({ onSuccess }) {
  const [entered, setEntered] = useState('');
  const [error, setError] = useState(false);
  const pin = getPin();

  function addDigit(digit) {
    if (entered.length >= 4 || digit === '') return;
    const next = `${entered}${digit}`;
    setEntered(next);
    if (next.length === 4) {
      if (next === pin) {
        setTimeout(onSuccess, 250);
      } else {
        setTimeout(() => {
          setError(true);
          setEntered('');
          setTimeout(() => setError(false), 800);
        }, 150);
      }
    }
  }

  function deleteDigit() {
    setEntered((current) => current.slice(0, -1));
  }

  return (
    <main className="page">
      <div className="pulse-ring" />
      <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
        <IgniteLogo size={44} />
        <div style={{ margin: '36px 0' }} className="green-line" />
        <SectionLabel>Área Restrita — Editor</SectionLabel>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, margin: '40px 0' }}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: `1px solid ${error ? '#8b2020' : index < entered.length ? '#4a783a' : 'rgba(255,255,255,0.07)'}`,
                background: index < entered.length ? (error ? '#8b2020' : '#4a783a') : 'transparent',
                boxShadow: index < entered.length && !error ? '0 0 8px rgba(74,120,58,0.5)' : 'none',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>

        <div className="numpad">
          {NUMPAD_KEYS.map((key, index) =>
            key === '' ? (
              <div key={index} />
            ) : (
              <button
                key={index}
                type="button"
                className={key === '⌫' ? 'delete-key' : ''}
                onClick={() => (key === '⌫' ? deleteDigit() : addDigit(key))}
              >
                {key}
              </button>
            )
          )}
        </div>

        <p style={{ color: '#222', fontSize: 10, letterSpacing: '0.12em', marginTop: 20, fontFamily: "'Barlow Condensed',sans-serif" }}>
          PIN padrão: 1234
        </p>
      </div>
    </main>
  );
}
