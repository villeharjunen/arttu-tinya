// RSVP-vastaanotin: liitä tämä Google Sheetin Apps Scriptiin (Laajennukset → Apps Script)
// ja julkaise verkkosovelluksena: Suorita käyttäjänä "Minä", Käyttöoikeus "Kuka tahansa".
const SHEET_NAME = 'Vastaukset';
const BASE_HEADERS = ['Aika', 'Nimi', 'Osallistuminen', 'Avec', 'Viesti', 'Biisitoive', 'Sähköposti'];
const BASE_FIELDS = ['name', 'attendance', 'guest', 'message', 'song_request', 'email'];
const EVENT_FIELDS = ['thursdayRun', 'thursdayPizzaParty', 'fridayWedding', 'saturdayPoolParty'];
const EVENT_HEADERS = ['Torstain yhteislenkki', 'Torstain tervetuliaispizzaparty', 'Perjantain hääpäivä', 'Lauantain pool party'];
const BORGO_PREFERENCE_HEADER = 'Borgo Backyardin osallistumistapa';
const QUIZ_HEADERS = ['Aloitettu', 'Tallennettu', 'Nimimerkki', 'Vastaus 1', 'Vastaus 2', 'Vastaus 3', 'Pisteet'];
const QUIZ_OPTIONS = [
  ['Umbria', 'Toscana', 'Lazio'],
  ['Antico Borgo Carceri', 'Ostello Bello Assisi Bevagna', 'Palazzo Brunamonti Boutique Hotel'],
  ['Vuokra-auto', 'Polkupyörä', 'Linja-auto']
];

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Roskapostiansa: oikea vieras ei näe eikä täytä tätä kenttää.
  if (p.website) return json({ ok: true });
  if (p.type === 'quiz') return saveQuiz(p);
  if (!String(p.name || '').trim()) return json({ ok: false, error: 'name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email || '').trim())) return json({ ok: false, error: 'email' });
  const attending = String(p.attendance || '') === 'Osallistun mielelläni';
  const eventChoices = EVENT_FIELDS.map(field => isTrue(p[field]));
  if (attending && !eventChoices.some(Boolean)) return json({ ok: false, error: 'events' });
  const message = String(p.message || '');
  // Vanhan lomakkeen lisäämä viimeinen rivi erotetaan vain vanhoista lähetyksistä.
  let legacyPreference = attending && p.borgoPayloadVersion !== '2'
    ? message.match(/(?:^|\n)Borgo Backyard: (Juoksen|Kävelen|Kannustusjoukoissa|En osallistu)$/)
    : null;
  if (legacyPreference && Object.prototype.hasOwnProperty.call(p, 'borgoPreference') &&
      p.borgoPreference !== legacyPreference[1]) legacyPreference = null;
  const messageValue = legacyPreference ? message.slice(0, legacyPreference.index) : message;
  const preferenceValue = legacyPreference ? legacyPreference[1] : p.borgoPreference;

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(BASE_HEADERS.concat(EVENT_HEADERS, [BORGO_PREFERENCE_HEADER]));
    } else {
      if (!sheet.getRange(1, BASE_HEADERS.length).getValue()) {
        sheet.getRange(1, BASE_HEADERS.length).setValue(BASE_HEADERS[BASE_HEADERS.length - 1]);
      }
      const existingHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), BASE_HEADERS.length)).getValues()[0];
      EVENT_HEADERS.concat([BORGO_PREFERENCE_HEADER]).forEach(header => {
        if (existingHeaders.indexOf(header) !== -1) return;
        const column = Math.max(sheet.getLastColumn(), BASE_HEADERS.length) + 1;
        sheet.getRange(1, column).setValue(header);
        existingHeaders[column - 1] = header;
      });
    }
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = Array(headers.length).fill('');
    row[0] = new Date();
    BASE_FIELDS.forEach((field, index) => { row[index + 1] = clean(field === 'message' ? messageValue : p[field]); });
    EVENT_HEADERS.forEach((header, index) => {
      row[headers.indexOf(header)] = attending ? eventChoices[index] : false;
    });
    row[headers.indexOf(BORGO_PREFERENCE_HEADER)] = attending ? clean(preferenceValue) : '';
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

function saveQuiz(p) {
  const nickname = String(p.nickname || '').trim();
  const answers = [p.question1Answer, p.question2Answer, p.question3Answer].map(value => String(value || '').trim());
  if (!nickname || !p.startedAt || isNaN(Date.parse(p.startedAt)) ||
      answers.some((answer, index) => QUIZ_OPTIONS[index].indexOf(answer) === -1)) {
    return json({ ok: false, error: 'quiz' });
  }
  const score = answers.filter((answer, index) => answer === QUIZ_OPTIONS[index][0]).length;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Tietovisa') || ss.insertSheet('Tietovisa');
    if (sheet.getLastRow() === 0) sheet.appendRow(QUIZ_HEADERS);
    sheet.appendRow([new Date(p.startedAt), new Date(), clean(nickname)].concat(answers.map(clean), [score]));
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
