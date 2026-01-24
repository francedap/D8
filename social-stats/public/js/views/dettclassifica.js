// views/dettclassifica.js - Classification detail page view
async function renderDettClassifica() {
  const app = document.getElementById('app');
  
  // Get classification ID from URL hash
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split('?')[1]);
  const classificaId = params.get('id');

  if (!classificaId) {
    app.innerHTML = `
      <div class="pt-5 mt-5"></div>
      <div class="container">
        <div class="row contenitorigrossi pt-3 mt-5">
          <div class="alert alert-danger">Errore: Classifica non trovata.</div>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="pt-5 mt-2"></div>
    <div class="container col-sm-12">
      <div class="row contenitorigrossi pt-3 mt-5">
        <div class="container pt-3 mt-3 col-sm-12">
          <h2 class="testo fw-bold" id="titoloClassifica">Caricamento...</h2>
          <p class="testopic" id="descrizioneClassifica"></p>
          
          <div class="mt-4">
            <button class="bottone btn btn-outline-info" id="iscriviti">Iscriviti a questa classifica</button>
          </div>

          <div class="px-5 pb-3 mt-4">
            <h3 class="testo">Top 10 Classifica</h3>
            <table class="tabellina mt-3">
              <thead>
                <tr>
                  <th>Posizione</th>
                  <th>Username</th>
                  <th>Valore</th>
                </tr>
              </thead>
              <tbody id="classificaBody">
                <tr><td colspan="3">Caricamento...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Load classification details
  await loadClassificationDetails(classificaId);
}

async function loadClassificationDetails(classificaId) {
  try {
    // Check session
    const sessionRes = await fetch('/api/session');
    const sessionData = await sessionRes.json();
    
    if (!sessionData.loggedIn) {
      router.navigate('/login');
      return;
    }
    
    const userId = sessionData.user.id;

    // Load classification details
    const res = await fetch(`/api/classifications/${classificaId}/details`);
    const result = await res.json();

    document.getElementById('titoloClassifica').innerText = `Dettagli Classifica: ${result.name}`;
    document.getElementById('descrizioneClassifica').innerText = result.description || "Partecipa e scala la classifica!";

    const tbody = document.getElementById('classificaBody');
    tbody.innerHTML = '';

    if (result.ranking && result.ranking.length > 0) {
      result.ranking.forEach((r, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index + 1}°</td>
          <td>${r.username}</td>
          <td>${r.value}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="3">Nessun dato disponibile</td></tr>';
    }

    // Setup subscribe button
    document.getElementById('iscriviti').onclick = async () => {
      try {
        const subscribeRes = await fetch(`/api/users/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classification_id: classificaId, user_id: userId })
        });
        
        const resp = await subscribeRes.json();
        
        if (resp.error) {
          alert("Errore: " + resp.error);
        } else {
          alert(resp.message);
          // Reload the page to update data
          await loadClassificationDetails(classificaId);
        }
      } catch (err) {
        console.error('Errore durante l\'iscrizione:', err);
        alert('Errore durante l\'iscrizione');
      }
    };

  } catch (err) {
    console.error('Errore nel caricamento dettagli classifica:', err);
    document.getElementById('titoloClassifica').innerText = 'Errore nel caricamento';
    document.getElementById('descrizioneClassifica').innerText = '';
    document.getElementById('classificaBody').innerHTML = 
      '<tr><td colspan="3" class="text-danger">Errore nel caricamento dei dati</td></tr>';
  }
}
