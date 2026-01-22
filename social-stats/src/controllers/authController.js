'use strict';

const userDao = require('../dao/userDao');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//funzione per signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
   
    const existingUser = await userDao.getUserByIdentifier(username);
    const existingEmail = await userDao.getUserByIdentifier(email);

    if (existingUser || existingEmail) {
      return res.status(409).json({ message: 'Username o Email già in uso.' });
    }

    // 2. Cifra la password
    const hash = await bcrypt.hash(password, saltRounds);

    // 3. Inserisce il nuovo utente
    const userId = await userDao.insertUser(username, email, hash);
    
    // 4. Invia successo
    res.status(201).json({ message: 'Utente registrato con successo', userId: userId });

  } catch (err) {
    if (err.message === 'Username o Email già esistenti.') {
        return res.status(409).json({ message: err.message });
    }
    console.error("ERRORE Controller (signup):", err);
    res.status(500).json({ error: 'Errore interno del server.' });
  }
};

//funzione per login
const login = (req, res) => {
  res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
  });
};

//controllo sulla sessione
const checkSession = async (req, res) => {
  
  if (req.session && req.session.passport && req.session.passport.user) {
    try {
      const userId = req.session.passport.user;
      const user = await userDao.getUserById(userId);

      if (!user) {
        res.status(401).json({ loggedIn: false });
      } else {
        req.user = user; 
        res.status(200).json({
          loggedIn: true, 
          user: req.user
        });
      }
    } catch (err) {
      res.status(500).json({ error: 'Errore DB nel controllo sessione' });
    }
  } else {
    res.status(401).json({ loggedIn: false });
  }
};




module.exports = {
  signup,
  login,
  checkSession
};
