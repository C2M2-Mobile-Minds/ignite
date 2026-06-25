// Apps Script template for Ignite Coaching
// 1. Open Google Sheets > Extensions > Apps Script
// 2. Paste this code into the script editor
// 3. Replace YOUR_SPREADSHEET_ID and YOUR_SECRET_TOKEN
// 4. Deploy as a Web App and copy the web app URL into the app settings

const SECRET_TOKEN = 'YOUR_SECRET_TOKEN';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Clients';

function corsResponse(payload, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    .setHeader('Access-Control-Max-Age', '86400');

  if (statusCode) {
    output.setStatusCode(statusCode);
  }

  return output;
}

function doGet() {
  return corsResponse({ success: true, message: 'Ignite Apps Script is running.' });
}

function doOptions(e) {
  return corsResponse({ success: true }, 200);
}

function doPost(e) {
  try {
    const rawBody = e.postData.contents || '{}';
    const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;

    if (payload.token !== SECRET_TOKEN) {
      return corsResponse({ success: false, error: 'invalid token' });
    }

    const sheet = getSheet();

    switch (payload.action) {
      case 'list':
        return corsResponse({ success: true, clients: listClients(sheet) }, 200);
      case 'append':
        appendClient(sheet, payload.client);
        return corsResponse({ success: true, message: 'client appended' }, 200);
      case 'delete':
        deleteClient(sheet, payload.id);
        return corsResponse({ success: true, message: 'client deleted' }, 200);
      default:
        return corsResponse({ success: false, error: 'unknown action' }, 200);
    }
  } catch (error) {
    return corsResponse({ success: false, error: error.message });
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  ensureHeaders(sheet);
  return sheet;
}

function ensureHeaders(sheet) {
  const headers = ['id', 'submittedAt', 'firstName', 'lastName', 'instagram', 'phone', 'goals', 'location', 'difficulty'];
  const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];

  if (existing.join('|') !== headers.join('|')) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function listClients(sheet) {
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const rows = values.slice(1);

  return rows
    .filter((row) => row.some((cell) => String(cell || '').trim()))
    .map((row) => {
      const client = {};
      headers.forEach((header, index) => {
        const value = row[index] || '';
        if (header === 'goals') {
          client[header] = value ? value.split(',') : [];
        } else {
          client[header] = value;
        }
      });
      return client;
    });
}

function appendClient(sheet, client) {
  const row = [
    client.id || '',
    client.submittedAt || '',
    client.firstName || '',
    client.lastName || '',
    client.instagram || '',
    client.phone || '',
    (client.goals || []).join(','),
    client.location || '',
    client.difficulty || '',
  ];
  sheet.appendRow(row);
}

function deleteClient(sheet, id) {
  const values = sheet.getDataRange().getValues();
  const rowIndex = values.findIndex((row) => String(row[0]) === String(id));
  if (rowIndex >= 0) {
    sheet.deleteRow(rowIndex + 1);
  }
}
