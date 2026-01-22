// views/home.js - Home page view
async function renderHome() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <!-- Logo centrale -->
    <div class="concentrata pt-3 mt-5 text-center">
      <span class="logocentrale fw-bold">D8</span>
    </div>

    <!-- Sezione Classifica -->
    <div class="container pt-3">
      <div class="row contenitorigrossi pt-2 mt-2">
        <div class="col-sm-4 d-flex align-items-center justify-content-center text-center">
          <p class="testoall paragindex">
            <b>Cosa raccontano le tue giornate</b><br>
            Dai passi che fai al tuo umore, passando per le ore di studio e le piccole vittorie quotidiane: ogni dato dice qualcosa di te.
            Su D8 puoi confrontarti con il mondo, trovare ispirazione dagli altri e dare forma al tuo stile di vita.
            Le statistiche non sono numeri… sono storie.
          </p>
        </div>

        <div class="col-sm-8 text-center pt-3">
          <table class="tabellina testo mx-auto">
            <thead>
              <tr>
                <th><img src="img/podio6.png" alt="Podio" class="icona"></th>
                <th>Nickname</th>
                <th><img src="img/livello1.png" alt="Livello" class="icona"></th>
              </tr>
            </thead>
            <tbody id="leaderboard-body">
              <tr><td colspan="3" class="text-muted">Caricamento classifica...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Sezione Statistiche personali -->
    <div class="container pt-3">
      <div class="row contenitorigrossi pt-2 mt-2">
        <div class="col-sm-8 text-center pt-3">
          <table class="tabellina testo mx-auto">
            <thead>
              <tr><th>Statistiche personali</th></tr>
            </thead>
            
            <tbody>
              <tr>
                <td>Passi totali:&nbsp; 150.000</td>
              </tr>
              <tr>
                <td>Cibo preferito:&nbsp; Pizza</td>
              </tr>
              <tr>
                <td>Umore medio:&nbsp; Felice</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-sm-4 d-flex align-items-center justify-content-center text-center">
          <p class="testoall paragindex">
            <b>Statistiche personali</b><br>
            Le statistiche personali ti aiutano a capire i tuoi progressi. Ogni traguardo raggiunto racconta qualcosa di unico su di te e ti motiva a migliorarti ogni giorno.
          </p>
        </div>
      </div>
    </div>
  `;

  // Load leaderboard data
  loadLeaderboard();
}

async function loadLeaderboard() {
  try {
    const tbody = document.getElementById('leaderboard-body');
    const res = await fetch('/api/leaderboard/top3');
    const data = await res.json();
    tbody.innerHTML = '';
    if (data && data.length > 0) {
      data.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="img/${['primo', 'secondo', 'terzo'][index]}.png" class="iconanumero"</td>
          <td>${user.username}</td>
          <td>Livello ${user.level}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="3" class="text-secondary">Nessun dato disponibile</td></tr>';
    }
  } catch (err) {
    console.error('Errore nel caricamento classifica:', err);
    document.getElementById('leaderboard-body').innerHTML =
      '<tr><td colspan="3" class="text-danger">Errore nel caricamento</td></tr>';
  }
}
