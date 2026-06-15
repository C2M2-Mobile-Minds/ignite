const S_CLIENTS = 'ignite_clients_v1';
const S_TRAINER = 'ignite_trainer_v1';
const S_PIN = 'ignite_pin_v1';

const DEFAULT_TRAINER = {
  name: 'Ignite Coaching',
  tagline: 'Individual Coaching',
  bio: 'Transformamos o teu potencial em resultados reais. Programa personalizado, acompanhamento contínuo, evolução garantida.',
  instagram: '@_ignitecoaching_',
  phone: '',
};

export function getClients() {
  try {
    return JSON.parse(localStorage.getItem(S_CLIENTS) || '[]');
  } catch {
    return [];
  }
}

export function saveClients(clients) {
  localStorage.setItem(S_CLIENTS, JSON.stringify(clients));
}

export function getTrainer() {
  try {
    return { ...DEFAULT_TRAINER, ...JSON.parse(localStorage.getItem(S_TRAINER) || '{}') };
  } catch {
    return DEFAULT_TRAINER;
  }
}

export function saveTrainer(trainer) {
  localStorage.setItem(S_TRAINER, JSON.stringify(trainer));
}

export function getPin() {
  return localStorage.getItem(S_PIN) || '1234';
}

export function savePin(pin) {
  localStorage.setItem(S_PIN, pin);
}
