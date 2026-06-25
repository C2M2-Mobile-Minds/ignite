// Replace these values after deploying your Google Apps Script web app.
// The sheet itself stays private; only the script endpoint is public.
const DEFAULT_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzjtTD8UkADCUp6iC7ahoN72i6tdAvqukHh0Y_lTD59NhQysBGLfDOClc7hwpSUI9nH/exec';
const DEFAULT_SHEETS_API_TOKEN = 'ignite-secret-2026-06-15';
const S_TRAINER = 'ignite_trainer_v1';
const S_PIN = 'ignite_pin_v1';
const S_SHEETS_API_URL = 'ignite_sheets_api_url_v1';
const S_SHEETS_API_TOKEN = 'ignite_sheets_api_token_v1';

const DEFAULT_TRAINER = {
  name: 'Ignite Coaching',
  tagline: 'Individual Coaching',
  bio: 'Transformamos o teu potencial em resultados reais. Programa personalizado, acompanhamento contínuo, evolução garantida.',
  instagram: '@_ignitecoaching_',
  phone: '',
};

export function getSheetConfig() {
  try {
    return {
      url: localStorage.getItem(S_SHEETS_API_URL) || DEFAULT_SHEETS_API_URL,
      token: localStorage.getItem(S_SHEETS_API_TOKEN) || DEFAULT_SHEETS_API_TOKEN,
    };
  } catch {
    return {
      url: DEFAULT_SHEETS_API_URL,
      token: DEFAULT_SHEETS_API_TOKEN,
    };
  }
}

export function saveSheetConfig(url, token) {
  localStorage.setItem(S_SHEETS_API_URL, url);
  localStorage.setItem(S_SHEETS_API_TOKEN, token);
}

async function requestSheetApi(payload) {
  const { url, token } = getSheetConfig();

  if (!url || !token) {
    throw new Error('Ainda não configuraste o Google Sheets. Abre o editor, preenche a URL do Apps Script e o token secreto, e guarda.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify({ token, ...payload }),
  });

  if (!response.ok) {
    let message = 'Google Sheets API error';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      // Ignore JSON parsing failures and keep the fallback message.
    }
    throw new Error(message);
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = { success: true };
  }

  if (data.success === false) {
    throw new Error(data.error || 'Google Sheets API error');
  }

  return data;
}

export async function getClients() {
  const data = await requestSheetApi({ action: 'list' });
  return data.clients || [];
}

export async function saveClient(client) {
  await requestSheetApi({ action: 'append', client });
}

export async function deleteClient(id) {
  await requestSheetApi({ action: 'delete', id });
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
