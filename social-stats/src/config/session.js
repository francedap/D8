const session = require('express-session');


const sessionConfig = {
  secret: 'AAA', 
  resave: false,
  saveUninitialized: false,
  credential : true,
  cookie: {
  secure: false, 
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60, 
  
}

};

module.exports = { sessionConfig };
