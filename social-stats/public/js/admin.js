

document.addEventListener('DOMContentLoaded', () => {

 
  fetch('/api/session')
    .then(res => res.json())
    .then(data => {
     
      if (!data.loggedIn || data.user.role !== 'admin') {
        alert("Accesso negato.");
        window.location.href = '/login.html';
      } else {
        
        loadUsers();
        loadLeaderboard();
      }
    })
    .catch(() => {
        alert("Accesso negato.");
        window.location.href = '/login.html';
    });
});



// Carica utenti
function loadUsers() {
  fetch('/api/users') 
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#usersTable tbody');
      tbody.innerHTML = '';
      data.users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}
            <select onchange="changeRole(${user.id}, this.value)">
              <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </td>
          <td>${user.points}</td>
          <td>${user.level}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Elimina</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

// Cambia ruolo
function changeRole(userId, newRole) {
  fetch(`/api/users/${userId}/role`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: newRole })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}

// Elimina utente
function deleteUser(userId) {
  if (confirm("Sei sicuro di voler eliminare questo utente?")) {
    fetch(`/api/users/${userId}`, { method: 'DELETE' }) 
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        loadUsers();
      });
  }
}


// Carica leaderboard
function loadLeaderboard() {
  
  fetch('/api/users') 
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById('leaderboard');
      ul.innerHTML = '';

      data.users.forEach(u => {
        const li = document.createElement('li');
        
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        li.textContent = `${u.username} (Livello ${u.level})`;
        
        // Creiamo un "badge" per i punti
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary rounded-pill';
        badge.textContent = `${u.points} Punti`;
        
        li.appendChild(badge);
        ul.appendChild(li);
      });
    });
}


loadUsers();
loadLeaderboard();