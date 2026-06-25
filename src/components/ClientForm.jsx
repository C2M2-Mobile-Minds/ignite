import { useState } from 'react';
import { GOALS, LOCATION_OPTIONS } from '../data/goals';
import { saveClient } from '../data/storage';
import IgniteLogo from './IgniteLogo';
import SectionLabel from './SectionLabel';
import { PrimaryButton, GhostButton } from './Button';

const TOTAL_STEPS = 6;
const MAX_DIFFICULTY_LENGTH = 500;
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

function validateInstagram(value) {
  const username = value.replace(/^@/, '').trim();
  return username.length > 0 && /^[a-zA-Z0-9._]{1,30}$/.test(username);
}

function validatePhone(value) {
  const normalized = value.trim();
  if (!normalized) return false;
  if (!/^\+?[0-9\s().-]{7,20}$/.test(normalized)) return false;
  const digits = normalized.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function validateDifficulty(value) {
  return value.trim().length > 0 && value.trim().length <= MAX_DIFFICULTY_LENGTH;
}

function isStepValid(step, form) {
  if (step === 1) return form.firstName.trim() && form.lastName.trim();
  if (step === 2) return validateInstagram(form.instagram);
  if (step === 3) return validatePhone(form.phone);
  if (step === 4) return form.goals.length > 0;
  if (step === 5) return Boolean(form.location);
  if (step === 6) return validateDifficulty(form.difficulty);
  return false;
}

export default function ClientForm({ trainer, onBack, onSaved }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  async function submitForm() {
    if (submitting) return;

    setSubmitting(true);

    const entry = {
      ...form,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };

    try {
      await saveClient(entry);
      setFinished(true);
      if (typeof onSaved === 'function') {
        onSaved(entry);
      }
    } catch (error) {
      console.error('Failed to save client remotely:', error);
      setFinished(true);
      if (typeof onSaved === 'function') {
        onSaved(entry);
      }
    } finally {
      setSubmitting(false);
    }
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
                  onChange={(event) => {
                    const nextValue = event.target.value.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
                    changeField('instagram', nextValue ? `@${nextValue}` : '');
                  }}
                  autoFocus
                />
              </div>
              <p style={{ color: '#888', fontSize: 11, marginTop: 10, letterSpacing: '0.08em', lineHeight: 1.6 }}>
                Apenas letras, números, ponto e underline. Máx. 30 caracteres.
              </p>
            </div>
          )}

          {step === 3 && (
            <>
              <input
                className="input-field"
                placeholder="+351 9XX XXX XXX"
                type="tel"
                value={form.phone}
                onChange={(event) => changeField('phone', event.target.value.replace(/[^\d+().\s-]/g, '').slice(0, 20))}
                autoFocus
              />
              <p style={{ color: '#888', fontSize: 11, marginTop: 4, letterSpacing: '0.08em', lineHeight: 1.6 }}>
                Aceita números internacionais com +, espaços, parêntesis e hífen.
              </p>
            </>
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
                maxLength={MAX_DIFFICULTY_LENGTH}
                placeholder="Ex: Falta de motivação, não sei por onde começar, pouco tempo disponível..."
                value={form.difficulty}
                onChange={(event) => changeField('difficulty', event.target.value.slice(0, MAX_DIFFICULTY_LENGTH))}
                autoFocus
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <p style={{ color: '#888', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.6 }}>
                  Esta informação é confidencial e permite-nos personalizar o teu programa de raiz.
                </p>
                <span style={{ color: form.difficulty.length >= MAX_DIFFICULTY_LENGTH ? '#6aaa55' : '#888', fontSize: 11 }}>
                  {form.difficulty.length}/{MAX_DIFFICULTY_LENGTH}
                </span>
              </div>
            </>
          )}
        </div>

        <div style={{ paddingBottom: 52 }}>
          {step < TOTAL_STEPS ? (
            <PrimaryButton onClick={nextStep} disabled={!isStepValid(step, form)}>
              Continuar
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={submitForm} disabled={!isStepValid(step, form) || submitting}>
              {submitting ? 'A enviar…' : 'Submeter Candidatura'}
            </PrimaryButton>
          )}
        </div>
      </div>
    </main>
  );
}
