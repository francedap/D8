// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifier = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!identifier || !password) {
      showError("Inserisci username/email e password");
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
        credentials: 'include'
      });

  
      if (!res.ok) {
        let errorData = { error: "Errore sconosciuto" };
        try {
            errorData = await res.json();
        } catch (e) {
            if (res.statusText=='Unauthorized')
              {errorData = { error: 'Credenziali non valide' };}
            else
              {errorData = { error: `${res.statusText}` };}
        }
        showError(errorData.message || errorData.error || 'Credenziali non valide');
        return;
      }


      const data = await res.json(); 

     
      if (data.success && data.redirect) {
        window.location.href = data.redirect; 
      } else {

        showError("Login riuscito ma reindirizzamento fallito.");
        window.location.href = 'profile.html'; 
      }
      
    } catch (err) {
      console.error("Errore nel login:", err);
      showError("Si è verificato un errore. Riprova più tardi.");
    }
  });
});



function showError(message) {

  const existingPopup = document.getElementById('error-popup');
  if (existingPopup) {
    existingPopup.remove();
  }


  const popup = document.createElement('div');
  popup.id = 'error-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 1050;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    font-family: 'Montserrat', sans-serif;
  `;
  popup.textContent = message;


  const closeButton = document.createElement('button');
  closeButton.textContent = 'Chiudi';
  closeButton.style.cssText = `
    margin-left: 15px;
    padding: 5px 10px;
    border: 1px solid #721c24;
    background-color: transparent;
    color: #721c24;
    border-radius: 5px;
    cursor: pointer;
  `;
  closeButton.onclick = () => popup.remove();
  
  popup.appendChild(closeButton);
  document.body.appendChild(popup);

  
  setTimeout(() => {
    if (document.getElementById('error-popup')) {
      popup.remove();
    }
  }, 5000);
}