# Report: File Non Utilizzati nella Cartella social-stats

Questo documento elenca tutti i file che non vengono utilizzati all'interno della cartella `social-stats`.

## Riepilogo

L'applicazione è stata migrata da un'architettura multi-pagina a una **Single Page Application (SPA)**. Di conseguenza, molti file legacy non sono più utilizzati.

**Totale file non utilizzati: 29 file**

> **Nota:** Questa analisi riguarda solo i file frontend nella cartella `/public`. Tutti i file nella cartella `/src` (backend: controllers, routes, DAO, middleware, config) sono attualmente in uso e NON devono essere rimossi.

---

## 📄 File HTML Non Utilizzati (8 file)

### Cartella: `/public/old-pages/`

Tutti i file in questa cartella sono **obsoleti** e non vengono più utilizzati. L'applicazione moderna usa `index.html` con routing lato client.

1. **`admin.html`** - NON utilizzato (nessuna rotta nell'app SPA)
2. **`classifiche.html`** - Sostituito da `js/views/classifiche.js`
3. **`dashboard.html`** - Sostituito da `js/views/dashboard.js`
4. **`dettclassifica.html`** - NON utilizzato (nessuna vista corrispondente)
5. **`login.html`** - Sostituito da `js/views/login.js`
6. **`profile.html`** - Sostituito da `js/views/profile.js`
7. **`signup.html`** - Sostituito da `js/views/signup.js`

### File HTML Legacy:

8. **`index-old.html`** - Versione precedente di index.html, non più utilizzato

---

## 📜 File JavaScript Non Utilizzati (8 file)

### Cartella: `/public/js/`

Questi file sono stati sostituiti da moduli equivalenti nella cartella `js/views/`:

1. **`admin.js`** - NON utilizzato (nessuna rotta admin nell'app SPA)
2. **`classifiche.js`** - Sostituito da `views/classifiche.js`
3. **`dashboard.js`** - Sostituito da `views/dashboard.js`
4. **`dettclassifica.js`** - NON utilizzato (nessuna vista/rotta corrispondente)
5. **`index.js`** - Usato solo da `index-old.html` (che non è utilizzato)
6. **`login.js`** - Sostituito da `views/login.js`
7. **`profile.js`** - Sostituito da `views/profile.js`
8. **`signup.js`** - Sostituito da `views/signup.js`

### File JavaScript Attivi (da NON rimuovere):
- ✅ `app-spa.js` - Entry point dell'applicazione
- ✅ `router.js` - Router SPA
- ✅ `components.js` - Componenti riutilizzabili
- ✅ `views/home.js` - Vista home
- ✅ `views/login.js` - Vista login
- ✅ `views/signup.js` - Vista registrazione
- ✅ `views/dashboard.js` - Vista dashboard
- ✅ `views/profile.js` - Vista profilo
- ✅ `views/classifiche.js` - Vista classifiche

---

## 🖼️ File Immagine Non Utilizzati (~13 file)

### Cartella: `/public/img/`

Questi file immagine non sono referenziati in nessun file HTML, CSS o JavaScript attivo:

1. **`faxsimilehome.png`** - NON referenziato
2. **`faxsimileprofilo.png`** - NON referenziato
3. **`iconaplayer.png`** - NON referenziato
4. **`iconegiuste.jpg`** - NON referenziato
5. **`livello.png`** - Sostituito da `livello1.png` e `livello2.png`
6. **`livello2.png`** - NON utilizzato (solo `livello1.png` è usato)
7. **`logo.png`** - NON referenziato
8. **`podio.png`** - Sostituito da `podio6.png`
9. **`podio2.png`** - NON utilizzato
10. **`podio2prova.png`** - NON utilizzato
11. **`podio3.png`** - NON utilizzato
12. **`podio4.png`** - NON utilizzato
13. **`podio5.png`** - NON utilizzato

### Immagini Attive (da NON rimuovere):
- ✅ `navbartop.png` - Usato nella navbar
- ✅ `imgprofilo.jpg` - Usato nella vista profilo
- ✅ `livello1.png` - Usato nelle tabelle
- ✅ `podio6.png` - Usato nelle tabelle classifica
- ✅ `primo.png` - Usato per il 1° posto
- ✅ `secondo.png` - Usato per il 2° posto
- ✅ `terzo.png` - Usato per il 3° posto

### Favicon (tutti utilizzati):
- ✅ `favicon/android-chrome-192x192.png`
- ✅ `favicon/android-chrome-512x512.png`
- ✅ `favicon/apple-touch-icon.png`
- ✅ `favicon/favicon-16x16.png`
- ✅ `favicon/favicon-32x32.png`
- ✅ `favicon/favicon.ico`

---

## 📊 Dettagli Tecnici

### File Utilizzati dall'App Moderna (index.html)

**File HTML attivo:**
- `index.html` - Entry point dell'applicazione SPA

**JavaScript caricati:**
```html
<script src="js/router.js"></script>
<script src="js/components.js"></script>
<script src="js/views/home.js"></script>
<script src="js/views/login.js"></script>
<script src="js/views/signup.js"></script>
<script src="js/views/dashboard.js"></script>
<script src="js/views/profile.js"></script>
<script src="js/views/classifiche.js"></script>
<script src="js/app-spa.js"></script>
```

**Immagini utilizzate:**
- `img/navbartop.png`
- `img/imgprofilo.jpg`
- `img/livello1.png`
- `img/podio6.png`
- `img/primo.png`
- `img/secondo.png`
- `img/terzo.png`
- `favicon/*` (tutti)

---

## 🗑️ Raccomandazioni

### Azione suggerita:

È possibile rimuovere in sicurezza i seguenti file/cartelle per pulire il repository:

1. **Cartella completa:** `/public/old-pages/` (7 file HTML)
2. **File HTML:** `index-old.html`
3. **File JS:** `admin.js`, `classifiche.js`, `dashboard.js`, `dettclassifica.js`, `index.js`, `login.js`, `profile.js`, `signup.js`
4. **Immagini:** I 13 file immagine elencati sopra

### Benefici della pulizia:

- ✅ Riduzione delle dimensioni del repository
- ✅ Maggiore chiarezza del codice
- ✅ Prevenzione di confusione tra file vecchi e nuovi
- ✅ Manutenzione più semplice

---

## ⚠️ Note

**Importante:** Questa analisi copre solo i file frontend nella cartella `/public`. La cartella `/src` contiene il backend dell'applicazione (controllers, routes, DAO, middleware, configurazioni) e **tutti i file in essa sono utilizzati e necessari** per il funzionamento dell'applicazione.

Prima di eliminare i file frontend non utilizzati, si consiglia di:

1. Verificare che l'applicazione funzioni correttamente
2. Creare un backup o un commit separato
3. Testare l'applicazione dopo la rimozione
4. Verificare che non ci siano link diretti ai file obsoleti

---

**Versione Repository:** D8 - social-stats
