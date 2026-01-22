// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');  
const LocalStrategy = require('passport-local').Strategy;    
const bcrypt = require('bcrypt');    


// Config
const { sessionConfig } = require('./src/config/session');
// const db = require('./src/config/db'); // Importa la tua connessione DB

// DAO (ci serve per la strategia di login)
const userDao = require('./src/dao/userDao'); 

// Rotte
const routes = require('./src/routes'); // Rotte generali
const authRoutes = require('./src/routes/authRoutes'); // Rotte per autenticazione
const leaderboardRoutes = require('./src/routes/leaderboardRoutes'); // Rotte per la classifica dell'index
const userRoutes = require('./src/routes/userRoutes'); // Rotte per operazioni sugli utenti
const classificationRoutes = require('./src/routes/classificationRoutes'); // Rotte per le classifiche



// Inizializza app
const app = express();

// --- Middleware ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log per debug 
app.use((req, res, next) => {
  console.log(`Richiesta ricevuta: ${req.method} ${req.originalUrl}`);
  next();
});

// Servire file statici (va PRIMA delle rotte)
app.use(express.static(path.join(__dirname, 'public')));

// --- Configurazione Sessione e Passport ---
// (Deve venire DOPO express.json e PRIMA delle rotte API)

app.use(session(sessionConfig));

// --- 1. Inizializzazione Passport --- (<<< AGGIUNTO)
app.use(passport.initialize());
app.use(passport.session());

// --- 2. Definizione Strategia di Login (fondamentale!) --- (<<< AGGIUNTO)
passport.use(new LocalStrategy(
  // Passport usa 'username' di default, noi gli diciamo di usare
  // 'identifier' (come lo chiamavi tu) o 'email' o 'username'
  { usernameField: 'identifier' }, 
  async (identifier, password, done) => {
    try {
      // Cerca l'utente nel DB tramite email o username
      const user = await userDao.getUserByIdentifier(identifier);
      if (!user) {
        // Utente non trovato
        return done(null, false, { message: 'Credenziali non valide.' });
      }
      
      // Compara la password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // Password errata
        return done(null, false, { message: 'Credenziali non valide.' });
      }
      
      // Successo! Restituisce l'utente a Passport
      return done(null, user); 
      
    } catch (err) {
      return done(err); // Errore del server
    }
  }
));

// --- 3. Serializzazione e Deserializzazione ---
passport.serializeUser((user, done) => {
    done(null, user.id);
});



// Dice a Passport COME recuperare l'utente dall'ID nella sessione
passport.deserializeUser(async (id, done) => {
    
    // Log per vedere quale ID sta cercando
    console.log(`--- DESERIALIZE: Tentativo di deserializzare utente con ID: ${id} ---`); 

    try {
      const user = await userDao.getUserById(id);

      if (!user) {
        // Se l'utente non è nel DB, la deserializzazione fallisce
        console.error(`--- DESERIALIZE: FALLITO. Utente con ID: ${id} non trovato nel DB.`);
        done(null, false); // 'false' dice a Passport che l'utente non c'è
      } else {
        // L'utente è stato trovato, tutto ok
        console.log(`--- DESERIALIZE: SUCCESSO. Utente "${user.username}" trovato.`);
        done(null, user); // 'user' sarà messo in req.user
      }

    } catch (err) {
      // Errore del database
      console.error(`--- DESERIALIZE: ERRORE DB ---`, err); 
      done(err, null);
    }
});


// --- Rotte API ---
app.use('/api', authRoutes); 
app.use('/api', routes); 
app.use('/api/leaderboard', leaderboardRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/classifications', classificationRoutes);



app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
