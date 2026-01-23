# D8 - Social Stats Application

Applicazione web per il tracciamento e la condivisione di statistiche personali con sistema di gamification.

## Funzionalità

- 🔐 Sistema di autenticazione con registrazione e login
- 📊 Dashboard personale per gestire le statistiche
- 🏆 Classifiche e leaderboard
- 👤 Profili utente personalizzati
- 👨‍💼 **Pannello di amministrazione** per gestire utenti e visualizzare statistiche globali

## Requisiti

- Node.js (v14 o superiore)
- npm

## Installazione

1. Clona il repository
2. Naviga nella cartella `social-stats`:
   ```bash
   cd social-stats
   ```

3. Installa le dipendenze:
   ```bash
   npm install
   ```

4. Inizializza il database:
   ```bash
   node init-db.js
   ```

5. Avvia il server:
   ```bash
   node app.js
   ```

6. Apri il browser all'indirizzo: `http://localhost:3000`

## Accesso al Pannello Admin

Per accedere al pannello di amministrazione:

1. Vai su `http://localhost:3000`
2. Clicca su "Log in" nella navbar
3. Inserisci le credenziali dell'amministratore:
   - **Username:** `admin`
   - **Password:** `admin`
   - **Email:** `admin@example.it`
4. Dopo il login, sarai automaticamente reindirizzato al pannello admin
5. Il link "Admin Panel" sarà visibile nella navbar (solo per utenti admin)

### Funzionalità del Pannello Admin

- Visualizzazione di tutti gli utenti registrati
- Modifica del ruolo degli utenti (user/admin)
- Eliminazione di utenti
- Visualizzazione della classifica globale ordinata per punti

## Utenti di Test

Il database viene inizializzato con i seguenti utenti:

| Username | Email | Password | Ruolo | Punti | Livello |
|----------|-------|----------|-------|-------|---------|
| admin | admin@example.it | admin | admin | 100 | 5 |
| test | test@example.com | test | user | 50 | 3 |
| giulio | giulio@example.it | giulio | user | 75 | 4 |
| luca | luca@example.it | luca | user | 25 | 2 |

## Struttura del Progetto

```
social-stats/
├── app.js              # Entry point dell'applicazione
├── init-db.js          # Script di inizializzazione database
├── package.json        # Dipendenze del progetto
├── social_stats.db     # Database SQLite (creato dopo init-db.js)
├── public/             # File statici (HTML, CSS, JS, immagini)
│   ├── index.html      # Pagina principale SPA
│   ├── js/
│   │   ├── app-spa.js  # Configurazione router SPA
│   │   ├── components.js
│   │   ├── router.js
│   │   └── views/      # Viste dell'applicazione
│   │       ├── admin.js     # Vista pannello admin
│   │       ├── dashboard.js
│   │       ├── home.js
│   │       ├── login.js
│   │       ├── profile.js
│   │       └── ...
│   └── stile.css
└── src/
    ├── config/         # Configurazioni
    ├── controllers/    # Controller delle routes
    ├── dao/           # Data Access Objects
    ├── middleware/    # Middleware Express
    └── routes/        # Definizione routes API

```

## Tecnologie Utilizzate

- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Autenticazione:** Passport.js con strategia Local
- **Sessioni:** express-session
- **Hashing Password:** bcrypt
- **Frontend:** Vanilla JavaScript (SPA), Bootstrap 5

## Note di Sicurezza

⚠️ **IMPORTANTE:** Le credenziali di default sono solo per scopi di sviluppo. In produzione:
- Cambia le password di default
- Usa variabili d'ambiente per le credenziali
- Configura HTTPS
- Implementa rate limiting per le route di autenticazione
