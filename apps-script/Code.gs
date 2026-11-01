// RSVP-vastaanotin: liitä tämä Google Sheetin Apps Scriptiin (Laajennukset → Apps Script)
// ja julkaise verkkosovelluksena: Suorita käyttäjänä "Minä", Käyttöoikeus "Kuka tahansa".
const SHEET_NAME = 'Vastaukset';
const HEADERS = ['Aika', 'Nimi', 'Osallistuminen', 'Avec', 'Viesti', 'Biisitoive', 'Sähköposti'];
const FIELDS = ['name', 'attendance', 'guest', 'message', 'song_request', 'email'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Roskapostiansa: oikea vieras ei näe eikä täytä tätä kenttää.
  if (p.website) return json({ ok: true });
  if (!String(p.name || '').trim()) return json({ ok: false, error: 'name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email || '').trim())) return json({ ok: false, error: 'email' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    } else if (!sheet.getRange(1, HEADERS.length).getValue()) {
      sheet.getRange(1, HEADERS.length).setValue(HEADERS[HEADERS.length - 1]);
    }
    sheet.appendRow([new Date()].concat(FIELDS.map(f => clean(p[f]))));
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

// Estää kaavojen suorittamisen taulukossa (esim. "=HYPERLINK(...)").
function clean(value) {
  const v = String(value || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
