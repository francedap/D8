// views/admin.js - Admin panel view
async function renderAdmin() {
  const app = document.getElementById('app');
  
  // Check if user is admin
  const session = await fetch('/api/session').then(res => res.json());
  
  if (!session.loggedIn || session.user.role !== 'admin') {
    alert("Accesso negato. Solo gli amministratori possono accedere.");
    router.navigate('/');
    return;
  }
  
  app.innerHTML = `
    <div class="pt-5 mt-5"></div>
    <div class="container">
      <div class="row contenitorigrossi pt-3 mt-5">
        <div class="container pt-3 mt-3">
          <h1 class="testo fw-bold text-center mb-4">Pannello di Amministrazione</h1>
          
          <!-- Users Management Section -->
          <div class="card mb-4" style="background-color: #2a2a2a; border: 1px solid #3a3a3a;">
            <div class="card-header" style="background-color: #1a1a1a;">
              <h2 class="testo h4 mb-0">Gestione Utenti</h2>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-dark table-striped" id="usersTable">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Ruolo</th>
                      <th>Punti</th>
                      <th>Livello</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Users will be loaded here -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <!-- Leaderboard Section -->
          <div class="card" style="background-color: #2a2a2a; border: 1px solid #3a3a3a;">
            <div class="card-header" style="background-color: #1a1a1a;">
              <h2 class="testo h4 mb-0">Classifica Globale</h2>
            </div>
            <div class="card-body">
              <ul class="list-group" id="leaderboard">
                <!-- Leaderboard will be loaded here -->
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Load users and leaderboard
  await loadUsers();
  await loadLeaderboard();
}

// Load users
async function loadUsers() {
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    data.users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>
          ${user.role}
          <select class="form-select form-select-sm d-inline-block w-auto ms-2" data-user-id="${user.id}">
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td>${user.points}</td>
        <td>${user.level}</td>
        <td>
          <button class="btn btn-danger btn-sm" data-user-id="${user.id}">Elimina</button>
        </td>
      `;
      tbody.appendChild(tr);
      
      // Attach event listeners programmatically
      const roleSelect = tr.querySelector('select[data-user-id]');
      roleSelect.addEventListener('change', (e) => {
        const userId = parseInt(e.target.dataset.userId, 10);
        if (!isNaN(userId)) {
          changeRole(userId, e.target.value);
        }
      });
      
      const deleteBtn = tr.querySelector('button[data-user-id]');
      deleteBtn.addEventListener('click', (e) => {
        const userId = parseInt(e.target.dataset.userId, 10);
        if (!isNaN(userId)) {
          deleteUser(userId);
        }
      });
    });
  } catch (err) {
    console.error('Errore nel caricamento degli utenti:', err);
  }
}

// Change user role
async function changeRole(userId, newRole) {
  try {
    const res = await fetch(`/api/users/${userId}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    const data = await res.json();
    alert(data.message);
    await loadUsers();
  } catch (err) {
    console.error('Errore nel cambio ruolo:', err);
    alert('Errore nel cambio ruolo');
  }
}

// Delete user
async function deleteUser(userId) {
  try {
    // Fetch current users to get user details
    const res = await fetch('/api/users');
    const data = await res.json();
    const user = data.users.find(u => u.id === userId);
    
    if (!user) {
      alert('Utente non trovato');
      return;
    }
    
    // Enhanced confirmation with user details
    const confirmMsg = `Sei sicuro di voler eliminare questo utente?\n\n` +
                       `Username: ${user.username}\n` +
                       `Email: ${user.email}\n` +
                       `Ruolo: ${user.role}\n\n` +
                       `Questa azione non può essere annullata.`;
    
    if (confirm(confirmMsg)) {
      const deleteRes = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      const deleteData = await deleteRes.json();
      alert(deleteData.message);
      await loadUsers();
    }
  } catch (err) {
    console.error('Errore nell\'eliminazione dell\'utente:', err);
    alert('Errore nell\'eliminazione dell\'utente');
  }
}

// Load leaderboard
async function loadLeaderboard() {
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    const ul = document.getElementById('leaderboard');
    ul.innerHTML = '';

    // Sort users by points (descending)
    const sortedUsers = data.users.sort((a, b) => b.points - a.points);

    sortedUsers.forEach((u, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.style.backgroundColor = '#2a2a2a';
      li.style.borderColor = '#3a3a3a';
      li.style.color = '#fff';
      
      li.innerHTML = `
        <span><strong>#${index + 1}</strong> ${u.username} (Livello ${u.level})</span>
        <span class="badge bg-primary rounded-pill">${u.points} Punti</span>
      `;
      
      ul.appendChild(li);
    });
  } catch (err) {
    console.error('Errore nel caricamento della classifica:', err);
  }
}
