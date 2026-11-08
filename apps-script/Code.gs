// RSVP-vastaanotin: liitä tämä Google Sheetin Apps Scriptiin (Laajennukset → Apps Script)
// ja julkaise verkkosovelluksena: Suorita käyttäjänä "Minä", Käyttöoikeus "Kuka tahansa".
const SHEET_NAME = 'Vastaukset';
const BASE_HEADERS = ['Aika', 'Nimi', 'Osallistuminen', 'Avec', 'Viesti', 'Biisitoive', 'Sähköposti'];
const BASE_FIELDS = ['name', 'attendance', 'guest', 'message', 'song_request', 'email'];
const EVENT_FIELDS = ['thursdayRun', 'thursdayPizzaParty', 'fridayWedding', 'saturdayPoolParty'];
const EVENT_HEADERS = ['Torstain yhteislenkki', 'Torstain tervetuliaispizzaparty', 'Perjantain hääpäivä', 'Lauantain pool party'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Roskapostiansa: oikea vieras ei näe eikä täytä tätä kenttää.
  if (p.website) return json({ ok: true });
  if (!String(p.name || '').trim()) return json({ ok: false, error: 'name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email || '').trim())) return json({ ok: false, error: 'email' });
  const attending = String(p.attendance || '') === 'Osallistun mielelläni';
  const eventChoices = EVENT_FIELDS.map(field => isTrue(p[field]));
  if (attending && !eventChoices.some(Boolean)) return json({ ok: false, error: 'events' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(BASE_HEADERS.concat(EVENT_HEADERS));
    } else {
      if (!sheet.getRange(1, BASE_HEADERS.length).getValue()) {
        sheet.getRange(1, BASE_HEADERS.length).setValue(BASE_HEADERS[BASE_HEADERS.length - 1]);
      }
      const existingHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), BASE_HEADERS.length)).getValues()[0];
      EVENT_HEADERS.forEach(header => {
        if (existingHeaders.indexOf(header) !== -1) return;
        const column = Math.max(sheet.getLastColumn(), BASE_HEADERS.length) + 1;
        sheet.getRange(1, column).setValue(header);
        existingHeaders[column - 1] = header;
      });
    }
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = Array(headers.length).fill('');
    row[0] = new Date();
    BASE_FIELDS.forEach((field, index) => { row[index + 1] = clean(p[field]); });
    EVENT_HEADERS.forEach((header, index) => {
      row[headers.indexOf(header)] = attending ? eventChoices[index] : false;
    });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

function isTrue(value) {
  return String(value || '').toUpperCase() === 'TRUE';
}

// Estää kaavojen suorittamisen taulukossa (esim. "=HYPERLINK(...)").
function clean(value) {
  const v = String(value || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
