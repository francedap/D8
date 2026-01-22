document.addEventListener('DOMContentLoaded', () => {
  loadLeaderboard();

});


// index.js — gestione classifica nella home page

async function loadLeaderboard() {
  try {
    const tbody = document.getElementById('leaderboard-body');
    const res = await fetch('/api/leaderboard/top3');
    const data = await res.json(); // 'data' ora è l'array [ ... ]
    tbody.innerHTML = ''; // Pulisce la tabella prima di riempirla
    if (data && data.length > 0) { // <-- Controlla direttamente 'data'
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

// Caricamento iniziale + aggiornamento ogni 60s
loadLeaderboard();
setInterval(loadLeaderboard, 60000);

