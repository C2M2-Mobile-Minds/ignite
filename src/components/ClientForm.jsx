import { useState } from 'react';
import { GOALS, LOCATION_OPTIONS } from '../data/goals';
import IgniteLogo from './IgniteLogo';
import SectionLabel from './SectionLabel';
import { PrimaryButton, GhostButton } from './Button';

const TOTAL_STEPS = 6;
const STEP_LABELS = ['Nome', 'Instagram', 'Telemóvel', 'Objetivos', 'Local de Treino', 'Dificuldade'];
const STEP_QUESTIONS = [
  'Qual é o teu nome?',
  'Qual é o teu Instagram?',
  'Qual é o teu telemóvel?',
  'Quais são os teus objetivos?',
  'Onde costumas treinar?',
  'Qual é a tua maior dificuldade?',
];

const initialForm = {
  firstName: '',
  lastName: '',
  instagram: '',
  phone: '',
  goals: [],
  location: '',
  difficulty: '',
};

function isStepValid(step, form) {
  if (step === 1) return form.firstName.trim() && form.lastName.trim();
  if (step === 2) return form.instagram.trim();
  if (step === 3) return form.phone.trim();
  if (step === 4) return form.goals.length > 0;
  if (step === 5) return Boolean(form.location);
  if (step === 6) return form.difficulty.trim();
  return false;
}

export default function ClientForm({ trainer, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [finished, setFinished] = useState(false);

  function changeField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleGoal(id) {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(id) ? prev.goals.filter((goal) => goal !== id) : [...prev.goals, id],
    }));
  }

  function nextStep() {
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
    }
  }

  function previousStep() {
    if (step === 1) {
      onBack();
      return;
    }
    setStep((current) => current - 1);
  }

  function submitForm() {
    const entry = {
      ...form,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };
    const saved = JSON.parse(localStorage.getItem('ignite_clients_v1') || '[]');
    saved.unshift(entry);
    localStorage.setItem('ignite_clients_v1', JSON.stringify(saved));
    setFinished(true);
  }

  if (finished) {
    return (
      <main className="page">
        <div className="pulse-ring" />
        <div className="page-content" style={{ paddingTop: 80, textAlign: 'center' }}>
          <IgniteLogo size={44} />
          <div style={{ margin: '32px 0' }} className="green-line" />
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 42, color: '#f2f2f0', letterSpacing: '0.06em', lineHeight: 1.1, marginBottom: 12 }}>
            BEM-VINDO,
            <br />
            {form.firstName.toUpperCase()}.
          </div>
          <p style={{ color: 'rgba(242,242,240,0.45)', fontSize: 14, lineHeight: 1.8, marginBottom: 40 }}>
            A tua candidatura foi recebida com sucesso.
            <br />Entraremos em contacto em breve.
          </p>
          <GhostButton onClick={onBack}>Voltar ao Início</GhostButton>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-content" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <button onClick={previousStep} style={{ background: 'none', color: '#888', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}>
            ←
          </button>
          <IgniteLogo size={22} />
        </div>

        <div style={{ display: 'flex', gap: 3, marginBottom: 24 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: 2,
                background: index < step ? '#4a783a' : '#1a1a1a',
                transition: 'background 0.35s',
                boxShadow: index < step ? '0 0 6px rgba(74,120,58,0.6)' : 'none',
              }}
            />
          ))}
        </div>

        <SectionLabel>{STEP_LABELS[step - 1]} · {step}/{TOTAL_STEPS}</SectionLabel>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, color: '#f2f2f0', lineHeight: 1.1, marginBottom: 28 }}>
          {STEP_QUESTIONS[step - 1]}
        </h2>

        <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
          {step === 1 && (
            <>
              <input
                className="input-field"
                placeholder="Primeiro nome"
                value={form.firstName}
                onChange={(event) => changeField('firstName', event.target.value)}
                autoFocus
              />
              <input
                className="input-field"
                placeholder="Último nome"
                value={form.lastName}
                onChange={(event) => changeField('lastName', event.target.value)}
              />
            </>
          )}

          {step === 2 && (
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    color: '#6aaa55',
                    fontSize: 15,
                    lineHeight: 1,
                  }}
                >
                  @
                </span>
                <input
                  className="input-field"
                  style={{ paddingLeft: 46 }}
                  placeholder="seuinstagram"
                  value={form.instagram.replace('@', '')}
                  onChange={(event) => changeField('instagram', event.target.value ? `@${event.target.value.replace('@', '')}` : '')}
                  autoFocus
                />
              </div>
              <p style={{ color: '#888', fontSize: 11, marginTop: 10, letterSpacing: '0.08em', lineHeight: 1.6 }}>
                Utilizado para acompanhamento e comunicação.
              </p>
            </div>
          )}

          {step === 3 && (
            <input
              className="input-field"
              placeholder="+351 9XX XXX XXX"
              type="tel"
              value={form.phone}
              onChange={(event) => changeField('phone', event.target.value)}
              autoFocus
            />
          )}

          {step === 4 && (
            <div style={{ display: 'grid', gap: 6 }}>
              <p style={{ color: '#888', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.6 }}>
                Escolhe todos os que se aplicam a ti.
              </p>
              {GOALS.map((goal) => {
                const selected = form.goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    className={`option-button ${selected ? 'selected' : ''}`}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <span>{goal.label}</span>
                    <span className="option-mark">{selected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'grid', gap: 6 }}>
              {LOCATION_OPTIONS.map((option) => {
                const selected = option.value === form.location;
                return (
                  <button
                    key={option.value}
                    className={`option-button ${selected ? 'selected' : ''}`}
                    type="button"
                    onClick={() => changeField('location', option.value)}
                  >
                    <div>
                      <div style={{ color: selected ? '#f2f2f0' : '#888' }}>{option.label}</div>
                      <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{option.subtitle}</div>
                    </div>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: `1px solid ${selected ? '#4a783a' : 'rgba(255,255,255,0.07)'}`,
                        background: selected ? '#4a783a' : 'transparent',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {step === 6 && (
            <>
              <textarea
                className="textarea-field"
                rows={6}
                placeholder="Ex: Falta de motivação, não sei por onde começar, pouco tempo disponível..."
                value={form.difficulty}
                onChange={(event) => changeField('difficulty', event.target.value)}
                autoFocus
              />
              <p style={{ color: '#888', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.6 }}>
                Esta informação é confidencial e permite-nos personalizar o teu programa de raiz.
              </p>
            </>
          )}
        </div>

        <div style={{ paddingBottom: 52 }}>
          {step < TOTAL_STEPS ? (
            <PrimaryButton onClick={nextStep} disabled={!isStepValid(step, form)}>
              Continuar
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={submitForm} disabled={!isStepValid(step, form)}>
              Submeter Candidatura
            </PrimaryButton>
          )}
        </div>
      </div>
    </main>
  );
}
