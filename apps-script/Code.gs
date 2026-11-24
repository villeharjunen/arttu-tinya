// RSVP-vastaanotin: liitä tämä Google Sheetin Apps Scriptiin (Laajennukset → Apps Script)
// ja julkaise verkkosovelluksena: Suorita käyttäjänä "Minä", Käyttöoikeus "Kuka tahansa".
const SHEET_NAME = 'Vastaukset';
const BASE_HEADERS = ['Aika', 'Nimi', 'Osallistuminen', 'Viesti', 'Biisitoive', 'Sähköposti'];
const BASE_FIELDS = ['name', 'attendance', 'message', 'song_request', 'email'];
const BASE_FIELD_HEADERS = ['Nimi', 'Osallistuminen', 'Viesti', 'Biisitoive', 'Sähköposti'];
// Otsikkomappaukset: BASE_FIELDS ↔ BASE_FIELD_HEADERS, EVENT_FIELDS ↔ EVENT_HEADERS,
// TRANSPORT_DAY_FIELDS ↔ TRANSPORT_DAY_HEADERS ja TRANSPORT_DETAIL_FIELDS ↔ TRANSPORT_DETAIL_HEADERS.
// Vanhan taulukon Avec-sarake säilyy historiatietoja varten, mutta uusia avec-tietoja ei tallenneta.
const LEGACY_BASE_HEADERS = ['Aika', 'Nimi', 'Osallistuminen', 'Avec', 'Viesti', 'Biisitoive', 'Sähköposti'];
const EVENT_FIELDS = ['thursdayRun', 'thursdayPizzaParty', 'fridayWedding', 'saturdayPoolParty'];
const EVENT_HEADERS = ['Torstain yhteislenkki', 'Torstain tervetuliaispizzaparty', 'Perjantain hääpäivä', 'Lauantain pool party'];
const BORGO_PREFERENCE_HEADER = 'Borgo Backyardin osallistumistapa';
// Kuljetuspäivät tallentuvat omiin sarakkeisiinsa; majoitus ja henkilömäärä säilyvät erillisinä.
const TRANSPORT_DAY_FIELDS = ['transportThursday', 'transportFriday', 'transportSaturday'];
const TRANSPORT_DAY_HEADERS = ['Torstain kuljetus', 'Perjantain kuljetus', 'Lauantain kuljetus'];
const TRANSPORT_DETAIL_FIELDS = ['transportDestination', 'transportPeople'];
const TRANSPORT_DETAIL_HEADERS = ['Kuljetuksen majoituspaikka', 'Kuljetusta tarvitsevien määrä'];
const LEGACY_TRANSPORT_HEADER = 'Kuljetustarve';
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
    ? message.match(/(?:^|\n)Borgo Backyard: (Juoksen tai kävelen|Juoksen|Kävelen|Kannustusjoukoissa|En osallistu)$/)
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
      sheet.appendRow(BASE_HEADERS.concat(EVENT_HEADERS, [BORGO_PREFERENCE_HEADER], TRANSPORT_DAY_HEADERS, TRANSPORT_DETAIL_HEADERS));
    } else {
      const existingHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), LEGACY_BASE_HEADERS.length)).getValues()[0];
      if (existingHeaders.indexOf('Avec') !== -1 && existingHeaders.indexOf('Sähköposti') === -1 &&
          !sheet.getRange(1, LEGACY_BASE_HEADERS.length).getValue()) {
        sheet.getRange(1, LEGACY_BASE_HEADERS.length).setValue('Sähköposti');
        existingHeaders[LEGACY_BASE_HEADERS.length - 1] = 'Sähköposti';
      }
      BASE_HEADERS.concat(EVENT_HEADERS, [BORGO_PREFERENCE_HEADER], TRANSPORT_DAY_HEADERS, TRANSPORT_DETAIL_HEADERS).forEach(header => {
        if (existingHeaders.indexOf(header) !== -1) return;
        const column = Math.max(sheet.getLastColumn(), BASE_HEADERS.length) + 1;
        sheet.getRange(1, column).setValue(header);
        existingHeaders[column - 1] = header;
      });
    }
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = Array(headers.length).fill('');
    const timeColumn = headers.indexOf('Aika');
    if (timeColumn !== -1) row[timeColumn] = new Date();
    BASE_FIELDS.forEach((field, index) => {
      const column = headers.indexOf(BASE_FIELD_HEADERS[index]);
      if (column !== -1) row[column] = clean(field === 'message' ? messageValue : p[field]);
    });
    EVENT_HEADERS.forEach((header, index) => {
      row[headers.indexOf(header)] = attending ? eventChoices[index] : false;
    });
    row[headers.indexOf(BORGO_PREFERENCE_HEADER)] = attending ? clean(preferenceValue) : '';
    const transportDays = TRANSPORT_DAY_FIELDS.map(field => isTrue(p[field]));
    const hasTransport = attending && (transportDays.some(Boolean) || p.transportNeed === 'Kyllä');
    TRANSPORT_DAY_HEADERS.forEach((header, index) => {
      row[headers.indexOf(header)] = attending && transportDays[index];
    });
    TRANSPORT_DETAIL_HEADERS.forEach((header, index) => {
      row[headers.indexOf(header)] = hasTransport ? clean(p[TRANSPORT_DETAIL_FIELDS[index]]) : '';
    });
    const legacyTransportColumn = headers.indexOf(LEGACY_TRANSPORT_HEADER);
    if (legacyTransportColumn !== -1) {
      row[legacyTransportColumn] = attending
        ? clean(p.transportNeed || (hasTransport ? 'Kyllä' : ''))
        : '';
    }
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
