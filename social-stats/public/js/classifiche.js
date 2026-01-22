

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const tbody = document.getElementById('classifiche-body'); 
  const logoutButton = document.querySelector('.bottonelog[href="index.html"]');

  let allClassifiche = []; 

 
  fetch('/api/session')
    .then(res => {
      if (!res.ok) throw new Error('Sessione non valida');
      return res.json();
    })
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = '/login.html';
      } else {
        fetch('/api/classifications')
          .then(res => res.json())
          .then(result => {
            allClassifiche = result.classifications;
            renderClassifiche(allClassifiche);
          })
          .catch(err => {
            console.error("Errore caricamento classifiche:", err);
            tbody.innerHTML = '<tr><td colspan="4">Errore nel caricare le classifiche.</td></tr>';
          });
      }
    })
    .catch(() => window.location.href = '/login.html');

 
  function renderClassifiche(classifiche) {
    tbody.innerHTML = '';
    if (classifiche.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">Nessuna classifica trovata.</td></tr>';
      return;
    }

    classifiche.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.topUser || '-'}</td>
        <td>${c.subscribers}</td>
        <td>
          <a href="dettclassifica.html?id=${c.id}" class="btn btn-sm btn-outline-info">Dettagli</a>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  
  function filterClassifiche() {
    const filter = searchInput.value.toLowerCase();
    const filteredData = allClassifiche.filter(c => {
      return c.name.toLowerCase().includes(filter);
    });
    renderClassifiche(filteredData);
  }
  
  searchButton.addEventListener('click', filterClassifiche);
  searchInput.addEventListener('keyup', filterClassifiche);

  if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
          e.preventDefault();
          fetch('/api/logout', { method: 'POST' }) 
              .then(() => window.location.href = '/login.html')
              .catch(err => console.error("Errore logout:", err));
      });
  }
});

