
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!username || !email || !password) {
      showError("Tutti i campi sono obbligatori");
      return;
    }

    try {
  
      
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

  
      if (!res.ok) {
        let errorData = { error: "Errore sconosciuto" };
        try {

          errorData = await res.json();
        } catch (e) {
          
          errorData = { error: `Errore: ${res.statusText}` };
        }
        
       
        showError(errorData.message || errorData.error);
        return;
      }

      
      const data = await res.json(); 
      
      window.location.href = 'login.html'; 

    } catch (err) {
      console.error("Errore nello signup:", err);
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