import { useEffect, useState } from 'react';
import { getTrainer, getClients, saveClient, deleteClient } from './data/storage';
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
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error('Failed to load clients:', error);
        setClients([]);
      } finally {
        setClientsLoading(false);
      }
    }

    loadClients();
  }, []);

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

  async function handleClientSaved(entry) {
    setClients((current) => [entry, ...current]);
    setView('landing');
  }

  async function handleClientDeleted(id) {
    try {
      await deleteClient(id);
      setClients((current) => current.filter((client) => client.id !== id));
      setView('editor');
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
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
      {view === 'form' && <ClientForm trainer={trainer} onBack={() => navigate('landing')} onSaved={handleClientSaved} />}
      {view === 'pin' && <PinGate onSuccess={() => navigate('editor')} />}
      {view === 'editor' && (
        <Editor
          trainer={trainer}
          setTrainer={setTrainer}
          onExit={handleExit}
          clients={clients}
          clientsLoading={clientsLoading}
          onClientDeleted={handleClientDeleted}
        />
      )}
    </div>
  );
}
