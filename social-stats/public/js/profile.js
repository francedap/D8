

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});


function checkSession() {
  
  fetch('/api/session') 
    .then(res => {
      if (!res.ok) {
        throw new Error('Sessione non valida'); 
      }
      return res.json();
    })
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = '/login.html';
      } else {
        const userId = data.user.id;
        loadUserProfile(userId, data.user); 
        loadUserStats(userId);
        loadUserActions(userId);
        loadUserClassifications(userId);
      }
    })
    .catch(err => {
      console.error("Errore sessione:", err);
      window.location.href = '/login.html';
    });
}

/**
 *  Gestisce il Logout
 */
function handleLogout(event) {
  event.preventDefault(); 
  // --- CORREZIONE: Aggiunto /api ---
  fetch('/api/logout', { method: 'POST' }) 
    .then(() => {
      window.location.href = '/login.html';
    })
    .catch(err => console.error("Errore logout:", err));
}

/**
 * Carica i dati del profilo
 */
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

/**
 * Carica statistiche utente (Punti e Livello)
 */
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

/**
 * Carica le azioni recenti
 */
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

/**
 *Carica le classifiche iscritte
 */
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