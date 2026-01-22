// public/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  let currentUserId = null;

  // Carica sessione e classifiche
 
  fetch('/api/session')
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = '/login.html';
      } else {
        currentUserId = data.user.id; 

        // Carica classifiche
       
        fetch(`/api/users/${currentUserId}/classifications`)
          .then(res => res.json())
          .then(result => {
            console.log("Classifiche ricevute:", result); 
            const select = document.getElementById('classifica');
            
            if (result.classifications) {
              result.classifications.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.classification;
                opt.textContent = c.classification;
                select.appendChild(opt);
              });
            }
          });
      }
    })
    .catch(() => window.location.href = '/login.html'); // Fallback se la sessione fallisce
});

// Gestione submit form
document.getElementById('statsForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const classifica = document.getElementById('classifica').value;
  const meal = document.getElementById('meal').value; // Titolo attività
  const steps = document.getElementById('steps').value; // Quantità
  const category = document.getElementById('category').value; // Categoria

  if (!classifica) {
    alert("Errore: Devi selezionare una classifica");
    return;
  }

  
  fetch('/api/session')
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = '/login.html';
      } else {
        const userId = data.user.id;

        // Invia i dati al server
        
        fetch(`/api/users/${userId}/stats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classification: classifica, // Nome della classifica (es. "Corsa")
            title: meal,           // Nome azione (es. "Corsa mattutina")
            value: steps,          // Punti azione (es. 500)
            category: category
          })
        })
        .then(res => res.json())
        .then(resp => {
          if (resp.error) {
            alert("Errore: " + resp.error);
          } else {
            alert(resp.message + `\nPunti totali: ${resp.points}\nLivello: ${resp.level}`);
           
            e.target.reset();
          }
        })
        .catch(err => console.error("Errore salvataggio statistiche:", err));
      }
    });
});