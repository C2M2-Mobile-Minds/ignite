import { useState } from 'react';
import IgniteLogo from './IgniteLogo';
import SectionLabel from './SectionLabel';
import Tag from './Tag';
import { PrimaryButton, GhostButton } from './Button';
import { saveTrainer, savePin } from '../data/storage';

export default function Editor({ trainer, setTrainer, onExit, clients, saveClients }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [draftTrainer, setDraftTrainer] = useState({ ...trainer });
  const [newPin, setNewPin] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSaveProfile() {
    saveTrainer(draftTrainer);
    setTrainer(draftTrainer);
    if (newPin.length === 4) {
      savePin(newPin);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function deleteClient(id) {
    if (!window.confirm('Eliminar este cliente?')) return;
    const updated = clients.filter((client) => client.id !== id);
    saveClients(updated);
    setSelectedClient(null);
  }

  if (selectedClient) {
    const labels = selectedClient.goals
      .map((goalId) => {
        switch (goalId) {
          case 'a':
            return 'Tonificar e ganhar força';
          case 'b':
            return 'Melhorar a confiança';
          case 'c':
            return 'Perder peso / eliminar gordura';
          case 'd':
            return 'Melhorar saúde e bem-estar';
          case 'e':
            return 'Criar consistência no treino';
          case 'f':
            return 'Aumentar massa muscular';
          default:
            return null;
        }
      })
      .filter(Boolean);

    return (
      <main className="page">
        <div className="page-content" style={{ paddingTop: 20 }}>
          <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={() => setSelectedClient(null)} style={{ background: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>
              ←
            </button>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#f2f2f0', letterSpacing: '0.06em' }}>
                {selectedClient.firstName} {selectedClient.lastName}
              </div>
              <div style={{ color: '#888', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {new Date(selectedClient.submittedAt).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div style={{ padding: '24px 0', display: 'grid', gap: 16 }}>
            {[
              ['Instagram', selectedClient.instagram],
              ['Telemóvel', selectedClient.phone],
              ['Local de treino', selectedClient.location],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <SectionLabel style={{ marginBottom: 6 }}>{label}</SectionLabel>
                <div style={{ color: 'rgba(242,242,240,0.6)', fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>
                  {value || '—'}
                </div>
              </div>
            ))}

            <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionLabel style={{ marginBottom: 12 }}>Objetivos</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {labels.map((label) => (
                  <Tag key={label}>{label}</Tag>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionLabel style={{ marginBottom: 10 }}>Maior dificuldade</SectionLabel>
              <p style={{ color: 'rgba(242,242,240,0.5)', fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>
                {selectedClient.difficulty}
              </p>
            </div>

            <div className="client-actions">
              {selectedClient.phone && (
                <a
                  className="action-button"
                  href={`https://wa.me/${selectedClient.phone.replace(/[\s\-\+]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              )}
              {selectedClient.instagram && (
                <a
                  className="action-button"
                  href={`https://instagram.com/${selectedClient.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              )}
            </div>

            <GhostButton danger onClick={() => deleteClient(selectedClient.id)}>
              Eliminar registo
            </GhostButton>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-content" style={{ paddingTop: 20 }}>
        <div style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <SectionLabel style={{ marginBottom: 6 }}>Painel de Controlo</SectionLabel>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: '#f2f2f0', letterSpacing: '0.06em' }}>
                IGNITE
              </div>
            </div>
            <button
              onClick={onExit}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#888',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '9px 14px',
                fontFamily: "'Barlow Condensed',sans-serif",
                cursor: 'pointer',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = '#4a783a';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              Sair
            </button>
          </div>

          <div style={{ display: 'flex' }}>
            {[
              { key: 'clients', label: `Clientes (${clients.length})` },
              { key: 'profile', label: 'Perfil' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'clients' && (
          <div style={{ padding: '0 0 60px', display: 'grid', gap: 0 }}>
            {clients.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <div className="green-line" style={{ marginBottom: 32 }} />
                <p style={{ color: '#1e1e1e', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Nenhum cliente registado
                </p>
              </div>
            ) : (
              clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  className="client-card"
                  onClick={() => setSelectedClient(client)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="client-avatar">
                        {client.firstName[0]}{client.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: '#f2f2f0' }}>
                          {client.firstName} {client.lastName}
                        </div>
                        <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>
                          {client.instagram} · {client.location}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: '#2a2a2a', fontSize: 16 }}>›</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ padding: '24px 0 60px', display: 'grid', gap: 18 }}>
            {[
              { key: 'name', label: 'Nome', placeholder: 'Ignite Coaching' },
              { key: 'tagline', label: 'Tagline', placeholder: 'Individual Coaching' },
              { key: 'instagram', label: 'Instagram', placeholder: '@_ignitecoaching_' },
              { key: 'phone', label: 'Telemóvel', placeholder: '+351 9XX XXX XXX' },
            ].map((field) => (
              <div key={field.key}>
                <SectionLabel>{field.label}</SectionLabel>
                <input
                  className="input-field"
                  placeholder={field.placeholder}
                  value={draftTrainer[field.key] || ''}
                  onChange={(event) => setDraftTrainer((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              </div>
            ))}

            <div>
              <SectionLabel>Bio</SectionLabel>
              <textarea
                className="textarea-field"
                rows={4}
                value={draftTrainer.bio}
                onChange={(event) => setDraftTrainer((current) => ({ ...current, bio: event.target.value }))}
              />
            </div>

            <div>
              <SectionLabel>Novo PIN (4 dígitos)</SectionLabel>
              <input
                className="input-field"
                type="password"
                placeholder="••••"
                maxLength={4}
                value={newPin}
                onChange={(event) => setNewPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>

            <PrimaryButton onClick={handleSaveProfile}>
              {saved ? 'Guardado ✓' : 'Guardar Alterações'}
            </PrimaryButton>
          </div>
        )}
      </div>
    </main>
  );
}
