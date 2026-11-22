// Sivuston asetukset, joita todennäköisimmin muutetaan.
const CONFIG = {
  // Väliaikainen julkinen laskeutumissivu ja sen avautumisaika.
  COMING_SOON_MODE: true,
  SITE_LAUNCH_DATE: '2026-11-28T00:00:00+02:00',
  // Kun asetus on false, kutsu avautuu ilman tietovisaa.
  QUIZ_MODE: true,
  // Kutsun salasana. Selainpuolen portti: näkyy lähdekoodissa eikä suojaa sivun sisältöä.
  password: 'umbria',
  // Alustava vihkimisaika: 21.5.2027 klo 14.00 Italian kesäaikaa (UTC+02:00).
  weddingTime: '2027-05-21T14:00:00+02:00',
  // RSVP-vastaukset Google Sheetiin: Apps Script -verkkosovelluksen osoite (ks. apps-script/Code.gs).
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbx7iJ8kGfzy0JLxMyBW68cjkAVSR8-F9JtvkIInKZ89IlcDjVT08c9DCwTtoqJsfF_FXQ/exec'
};
