import { useState } from 'react';
import { getTrainer, saveClients, getClients } from './data/storage';
import Landing from './components/Landing';
import ClientForm from './components/ClientForm';
import PinGate from './components/PinGate';
import Editor from './components/Editor';

const MENU_ITEMS = [
  { key: 'landing', label: 'Página Inicial' },
  { key: 'form', label: 'Ver Formulário' },
];

export default function App() {
  const [trainer, setTrainer] = useState(getTrainer());
  const [view, setView] = useState('landing');
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(target) {
    setView(target);
    setMenuOpen(false);
  }

  function handleExit() {
    setView('landing');
  }

  function handleStartForm() {
    setView('form');
  }

  return (
    <div className="page page-body">
      <button
        className={`floating-menu-button ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Menu"
      >
        {menuOpen ? '✕' : '⋯'}
      </button>

      {menuOpen && (
        <div className="ghost-panel">
          {MENU_ITEMS.map((item) => (
            <button key={item.key} onClick={() => navigate(item.key)}>
              {item.label}
            </button>
          ))}
          <button onClick={() => navigate(view === 'editor' ? 'landing' : 'pin')}>
            {view === 'editor' ? 'Sair do Editor' : 'Modo Editor'}
          </button>
        </div>
      )}

      {view === 'landing' && <Landing trainer={trainer} onStart={handleStartForm} />}
      {view === 'form' && <ClientForm trainer={trainer} onBack={() => navigate('landing')} />}
      {view === 'pin' && <PinGate onSuccess={() => navigate('editor')} />}
      {view === 'editor' && (
        <Editor
          trainer={trainer}
          setTrainer={setTrainer}
          onExit={handleExit}
          clients={getClients()}
          saveClients={saveClients}
        />
      )}
    </div>
  );
}
