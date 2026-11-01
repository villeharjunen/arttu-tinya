// Kielen valinta ja sivun sisältöjen ruotsinkieliset vastineet.
(() => {
  'use strict';
  const sv = {
    'Avaa hääkutsu': 'Öppna bröllopsinbjudan',
    'Avaa kutsu': 'Öppna inbjudan',
    'Sivuston osiot': 'Webbplatsens avsnitt',
    'Meistä': 'Om oss',
    'Ohjelma': 'Program',
    'Matka': 'Resa',
    'Kuvat': 'Bilder',
    'RSVP': 'OSA',
    'Valitse kieli': 'Välj språk',
    'Vaihda kieleksi suomi': 'Byt språk till finska',
    'Byt språk till svenska': 'Byt språk till svenska',
    'Edellinen kuva': 'Föregående bild',
    'Seuraava kuva': 'Nästa bild',
    'Pysäytä kuvanauha': 'Pausa bildspelet',
    'Jatka kuvanauhaa': 'Fortsätt bildspelet',
    'Wedding countdown': 'Nedräkning till bröllopet',
    'päivää': 'dagar',
    'tuntia': 'timmar',
    'minuuttia': 'minuter',
    'sekuntia': 'sekunder',
    'Kohti hääpäivää · 21.5.2027 klo 14.00 Italian aikaa': 'Nedräkning till bröllopsdagen · 21.5.2027 kl. 14.00 italiensk tid',
    'Häähetki on täällä!': 'Bröllopsdagen är här!',
    'Yksi juhla. Kokonainen viikonloppu.': 'Ett firande. En hel helg.',
    'Toukokuisessa Umbriassa haluamme pysähtyä muutamaksi päiväksi läheistemme kanssa. Ei vain yhdeksi juhlaillaksi, vaan kokonaiseksi pieneksi italialaiseksi viikonlopuksi.': 'I maj vill vi tillbringa några dagar tillsammans med våra nära och kära i Umbrien. Inte bara en festkväll, utan en hel liten italiensk helg.',
    'Neljä päivää hyvää ruokaa, Italian iltoja ja kaikkein tärkeimpiä ihmisiä. Tervetuloa juhlimaan kanssamme.': 'Fyra dagar med god mat, italienska kvällar och våra allra viktigaste människor. Välkommen att fira med oss.',
    'Ilmoittaudu mukaan': 'Anmäl dig',
    'The wedding weekend': 'Bröllopshelgen',
    'Neljä päivää yhdessä': 'Fyra dagar tillsammans',
    'Neljän päivän ohjelma, vieritä pienellä näytöllä sivusuunnassa': 'Program för fyra dagar, rulla i sidled på en liten skärm',
    'Benvenuti: näytä tai piilota aikataululuonnos': 'Välkommen: visa eller dölj programutkastet',
    'The Wedding: näytä tai piilota aikataululuonnos': 'Bröllopet: visa eller dölj programutkastet',
    'Dolce Vita by the Pool: näytä tai piilota aikataululuonnos': 'La Dolce Vita vid poolen: visa eller dölj programutkastet',
    'Arrivederci: näytä tai piilota aikataululuonnos': 'På återseende: visa eller dölj programutkastet',
    'Torstai 20.5.': 'Torsdag 20.5.',
    'Perjantai 21.5.': 'Fredag 21.5.',
    'Lauantai 22.5.': 'Lördag 22.5.',
    'Sunnuntai 23.5.': 'Söndag 23.5.',
    'Benvenuti': 'Välkommen',
    'The Wedding': 'Bröllopet',
    'Dolce Vita by the Pool': 'La Dolce Vita vid poolen',
    'Arrivederci': 'På återseende',
    'Saapuminen ja tervetuliaispizza party. Ensimmäinen ilta yhdessä, italialaiseen tyyliin.': 'Ankomst och välkomstfest med pizza. Den första kvällen tillsammans på italienskt vis.',
    'Näytä aikataulu ↻': 'Visa programmet ↻',
    'Takaisin ↻': 'Tillbaka ↻',
    'Torstai 20.5. · aikataululuonnos': 'Torsdag 20.5. · programutkast',
    'Perjantai 21.5. · aikataululuonnos': 'Fredag 21.5. · programutkast',
    'Lauantai 22.5. · aikataululuonnos': 'Lördag 22.5. · programutkast',
    'Sunnuntai 23.5. · aikataululuonnos': 'Söndag 23.5. · programutkast',
    'Saapuminen ja majoittuminen': 'Ankomst och inkvartering',
    'Yhteislenkki': 'Gemensam löprunda',
    'Vapaata aikaa ja tutustumista': 'Fri tid och möjlighet att lära känna varandra',
    'Tervetulomalja': 'Välkomstskål',
    'Pizza party': 'Pizzafest',
    'Ilta jatkuu yhdessä': 'Kvällen fortsätter tillsammans',
    'Hääpäivä: vihkiminen, aperitivo, illallinen ja juhlat Italian iltaan asti.': 'Bröllopsdag: vigsel, aperitivo, middag och fest in på den italienska kvällen.',
    'Aamiainen': 'Frukost',
    'Aamiaisen jälkeen': 'Efter frukosten',
    'Vapaata aikaa, valmistautumista ja omatoiminen lounas': 'Fri tid, förberedelser och lunch på egen hand',
    'Kokoontuminen vihkimiseen': 'Samling inför vigseln',
    'Vihkiminen': 'Vigsel',
    'Aperitivo': 'Aperitivo',
    'Illallinen': 'Middag',
    'Kakku ja ensimmäinen tanssi': 'Tårta och första dansen',
    'Party': 'Fest',
    'Aurinkoa (toivottavasti), musiikkia ja pool party. Rento päivä porukassa.': 'Förhoppningsvis sol, musik och poolparty. En avslappnad dag tillsammans.',
    'Rento aamiainen': 'Avslappnad frukost',
    'Pool party alkaa': 'Poolpartyt börjar',
    'Lounas': 'Lunch',
    'Viimeiset halaukset ennen kotimatkaa.': 'De sista kramarna före hemresan.',
    'Pakkaaminen ja viimeiset halaukset': 'Packning och de sista kramarna',
    'majoitus': 'boende',
    'Borgon rakennukset, uima-allas ja ympäröivä maisema': 'Borgons byggnader, pool och det omgivande landskapet',
    '01 · Getting there': '01 · Resan hit',
    'Umbriaan': 'till Umbrien',
    'Yhteinen viikonloppumme alkaa torstaina 20. toukokuuta. Saavu perille omaan tahtiin ja liity illalla tervetulojuhlaan.': 'Vår gemensamma helg börjar torsdagen den 20 maj. Kom fram i din egen takt och anslut till välkomstfesten på kvällen.',
    'Saapuminen': 'Ankomst',
    'Lähimmät ja parhaiten saavutettavat lentokentät ovat Roomassa ja Firenzessä, joista vuokra-autolla pääsee perille kohteeseen parissa tunnissa. Hääpari suosittelee lentoja Roomaan, josta sopivalla porukalla vuokra-auto alle!': 'De närmaste och smidigaste flygplatserna finns i Rom och Florens. Därifrån tar det ett par timmar att köra till boendet. Vi rekommenderar att flyga till Rom och hyra bil tillsammans med andra gäster!',
    'Rooman lentokentältä pääsee myös junalla Folignoon, josta on järjestettävissä kyyti hääpaikalle.': 'Från flygplatsen i Rom går det också att ta tåget till Foligno. Därifrån kan skjuts till bröllopsplatsen ordnas.',
    '02 · Where to stay': '02 · Boende',
    'Viivy': 'Stanna',
    'hetki pidempään': 'lite längre',
    'Neljä päivää yhdessä, torstaista sunnuntaihin. Hääviikonlopun kotina toimii Antico Borgo Carceri, joka majoittaa osan vieraista.': 'Fyra dagar tillsammans, från torsdag till söndag. Antico Borgo Carceri är vårt hem under bröllopshelgen och här bor några av gästerna.',
    'Majoitus & varaukset': 'Boende och bokning',
    'Suosittelemme seuraavia hotelleja majoittumiseen:': 'Vi rekommenderar följande hotell:',
    '[Täydennä hotellin nimi]': '[Fyll i hotellets namn]',
    'Sijaitsee kävelyetäisyydellä hääpaikasta': 'Hotellet ligger på gångavstånd från bröllopsplatsen',
    'Sijaitsee 4 km päässä Bevagnan kylässä. Hääpäivänä on järjestetty kyyditys hääpaikalle ja takaisin hotellille.': 'Hotellet ligger i byn Bevagna, 4 km bort. På bröllopsdagen ordnas skjuts till och från bröllopsplatsen.',
    'Borgon kivirakennukset ja puutarha': 'Borgons stenbyggnader och trädgård',
    'Antico Borgo Carceri Google Maps -kartalla': 'Antico Borgo Carceri på Google Maps',
    'Avaa Google Mapsissa': 'Öppna i Google Maps',
    'Osoitelähde:': 'Adresskälla:',
    'juhlapaikan yhteystiedot': 'bröllopsplatsens kontaktuppgifter',
    'Kuvagalleria': 'Bildgalleri',
    'Kuvagallerian kuva 1': 'Bild 1 i galleriet',
    'Kuvagallerian kuva 2': 'Bild 2 i galleriet',
    'Kuvagallerian kuva 3': 'Bild 3 i galleriet',
    'Muistaminen': 'Gåvor',
    'Meille tärkeintä on, että saavut paikalle juhlistamaan kanssamme. Jos kuitenkin haluat myös tukea häämatkaamme, niin muistamisen voi suorittaa tilille XXX.': 'Det viktigaste för oss är att du kommer och firar med oss. Om du ändå vill bidra till vår bröllopsresa går det bra att sätta in en gåva på konto XXX.',
    'Répondez s’il vous plaît': 'OSA',
    'Tuletko mukaan?': 'Kommer du?',
    'Nimi': 'Namn',
    'Sähköposti': 'E-post',
    'Osallistuminen': 'Deltagande',
    'Osallistun mielelläni': 'Jag deltar gärna',
    'Valitettavasti en pääse': 'Tyvärr kan jag inte komma',
    'Avecin nimi': 'Namn på följeslagare',
    'Ruokavaliot, allergiat tai muu viesti': 'Kostönskemål, allergier eller annat meddelande',
    'Tämän biisin haluan soivan viikonlopun aikana': 'Den här låten vill jag höra under helgen',
    'Kappale ja esittäjä': 'Låt och artist',
    'Jätä tämä tyhjäksi': 'Lämna det här tomt',
    'Lähetä ilmoittautuminen': 'Skicka anmälan',
    'Lähetetään…': 'Skickar…',
    'Lähetys epäonnistui. Tarkista nettiyhteys ja yritä uudelleen. Jos ongelma jatkuu, ilmoittaudu suoraan Arttulle tai Tinyalle.': 'Det gick inte att skicka anmälan. Kontrollera internetanslutningen och försök igen. Om problemet kvarstår kan du anmäla dig direkt till Arttu eller Tinya.',
    'Grazie!': 'Tack!',
    'Kiitos, ilmoittautumisesi on tallennettu.': 'Tack, din anmälan har sparats.',
    'Ilmoita toinen vieras': 'Anmäl en gäst till',
    'Takaisin kirjekuoreen': 'Tillbaka till kuvertet',
    'Tervetuloa juhlimaan': 'Välkommen att fira',
    'Kirjoita kutsun salasana avataksesi sivuston.': 'Ange inbjudans lösenord för att öppna webbplatsen.',
    'Salasana': 'Lösenord',
    'Salasana ei ollut oikein. Kokeile uudelleen.': 'Fel lösenord. Försök igen.',
    'Takaisin': 'Tillbaka'
  };
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const translatableAttributes = ['aria-label', 'alt', 'placeholder', 'title'];
  const header = document.querySelector('#site > header .nav');
  const selector = document.createElement('div');
  selector.className = 'language-switch';
  selector.setAttribute('role', 'group');
  selector.setAttribute('aria-label', 'Valitse kieli');

  for (const [language, label] of [['fi', 'FI'], ['sv', 'SV']]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('data-language', language);
    button.setAttribute('aria-label', language === 'fi' ? 'Vaihda kieleksi suomi' : 'Byt språk till svenska');
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => setLanguage(language, true));
    selector.appendChild(button);
  }
  header.appendChild(selector);

  function translateText(language) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!textSources.has(node)) textSources.set(node, node.nodeValue);
      const source = textSources.get(node);
      if (!source.trim()) {
        node.nodeValue = source;
        continue;
      }
      const leading = source.match(/^\s*/)[0];
      const trailing = source.match(/\s*$/)[0];
      const phrase = source.slice(leading.length, source.length - trailing.length);
      node.nodeValue = leading + (language === 'sv' ? (sv[phrase] || phrase) : phrase) + trailing;
    }

    document.querySelectorAll('body *').forEach(element => {
      let sources = attributeSources.get(element);
      if (!sources) {
        sources = new Map();
        attributeSources.set(element, sources);
      }
      for (const name of translatableAttributes) {
        if (!element.hasAttribute(name)) continue;
        if (!sources.has(name)) sources.set(name, element.getAttribute(name));
        const source = sources.get(name);
        element.setAttribute(name, language === 'sv' ? (sv[source] || source) : source);
      }
    });
  }

  function setLanguage(language, updateUrl) {
    const selected = language === 'sv' ? 'sv' : 'fi';
    document.documentElement.lang = selected;
    translateText(selected);
    selector.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === selected));
    });
    try { localStorage.setItem('arttu-tinya-language', selected); } catch (error) {}
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('lang', selected);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    window.dispatchEvent(new CustomEvent('site-language-change', { detail: { language: selected } }));
  }

  function savedLanguage() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'fi' || fromUrl === 'sv') return fromUrl;
    try {
      const saved = localStorage.getItem('arttu-tinya-language');
      if (saved === 'fi' || saved === 'sv') return saved;
    } catch (error) {}
    return 'fi';
  }

  window.SITE_LANGUAGE = {
    get current() { return document.documentElement.lang; },
    t(text) { return this.current === 'sv' ? (sv[text] || text) : text; }
  };
  setLanguage(savedLanguage(), false);
})();
