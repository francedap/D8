// views/profile.js - Profile page view
async function renderProfile() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="pt-5 mt-3"></div>
    <div class="container">
      <div class="row contenitorigrossi pt-3 mt-5">
        <!-- Foto profilo e informazioni utente -->
        <div class="col-sm-4 text-center">
          <br>
          <img src="img/imgprofilo.jpg" alt="Foto Profilo" class="rounded-circle mb-3" style="width: 150px; height: 150px;">
          <h3 class="testo fw-bold"><span id="profileName"></span></h3>
        </div>
        <!-- Statistiche personali -->
        <div class="col-sm-8">
          <h3 class="testo fw-bold mt-3">Classifiche Iscritte</h3>
          <table class="tabellina">
            <thead>
              <tr>
                <th>Classifica</th>
                <th>Posizione</th>
                <th>Punti</th>
              </tr>
            </thead>
            <tbody id="classificationsTable">
              <!-- Qui inseriremo le righe via JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Contenitore grafico -->
      <div class="contenitorigrossi mt-4 mb-3">
        <div class="container pt-3">
          <div class="row contenitorigrossi pt-2 mt-2">
            <div class="container pt-1 mt-1 col-sm-4 " style="display: flex; ">
              <div class="testo-grafico-sinistra">
                <p class="testo">
                  <a class="testoall fw-bold">Informazioni Utente</a><br><br>
                  📧 <strong>Email: </strong> <span id="profileEmail"></span><br>
                  🕐 <strong>Creato il:</strong> <span id="profileFirstAction"></span><br>
                  ⚡ <strong>Livello attuale:</strong> <span id="userLevel"></span><br>
                  💎 <strong>Punti totali:</strong> <span id="userPoints"></span><br>
                  🧮 <strong>Attività totali:</strong> <span id="profileActions"></span><br>
                  🗂️ <strong>Classifiche iscritte:</strong> <span id="profileClassifications"></span><br>
                </p>
              </div>
            </div>
            <div class="container pt-3 col-sm-8" style="align-items: center;">
              <!-- Azioni recenti -->
              <h3 class="testo fw-bold ">Azioni recenti</h3>
              <table class="tabellina">
                <thead>
                  <tr>
                    <th>Azione</th>
                    <th>Punti</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody id="actionsTable">
                  <!-- Riempito via JS -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Load profile data
  await loadProfileData();
}

async function loadProfileData() {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    
    if (!data.loggedIn) {
      router.navigate('/login');
      return;
    }
    
    const userId = data.user.id;
    loadUserProfile(userId, data.user);
    loadUserStats(userId);
    loadUserActions(userId);
    loadUserClassifications(userId);
  } catch (err) {
    console.error("Errore sessione:", err);
    router.navigate('/login');
  }
}

function loadUserProfile(userId, userData) {
  document.getElementById('profileName').innerText = userData.username;
  document.getElementById('profileEmail').innerText = userData.email;

  fetch(`/api/users/${userId}/profile`)
    .then(res => res.json())
    .then(data => {
      const profile = data.profile;
      document.getElementById('profileActions').innerText = profile.totalActions;
      document.getElementById('profileFirstAction').innerText = profile.firstActionDate 
        ? new Date(profile.firstActionDate).toLocaleDateString('it-IT')
        : "N/A";
      document.getElementById('profileClassifications').innerText = profile.totalClassifications;
    })
    .catch(err => console.error("Errore caricamento profilo:", err));
}

function loadUserStats(userId) {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => {
      const user = data.users.find(u => u.id === userId);
      if (user) {
        document.getElementById('userPoints').innerText = user.points;
        document.getElementById('userLevel').innerText = user.level;
      }
    })
    .catch(err => console.error("Errore caricamento statistiche:", err));
}

function loadUserActions(userId) {
  fetch(`/api/users/${userId}/actions`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('actionsTable');
      tbody.innerHTML = '';
      if (!data.actions || data.actions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nessuna azione recente</td></tr>';
        return;
      }
      data.actions.forEach(act => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${act.action}</td>
          <td>+${act.points}</td>
          <td>${new Date(act.date).toLocaleString('it-IT')}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error("Errore caricamento azioni:", err));
}

function loadUserClassifications(userId) {
  fetch(`/api/users/${userId}/classifications`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('classificationsTable');
      tbody.innerHTML = '';
      if (!data.classifications || data.classifications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nessuna classifica iscritta</td></tr>';
        return;
      }
      data.classifications.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.classification}</td>
          <td>${c.position ? c.position + '°' : '-'}</td>
          <td>${c.value}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error("Errore caricamento classifiche:", err));
}
