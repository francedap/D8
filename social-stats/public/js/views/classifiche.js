// views/classifiche.js - Classifications page view
let allClassifiche = [];

async function renderClassifiche() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="pt-5 mt-2"></div>
    <div class="container col-sm-12">
      <div class="row contenitorigrossi pt-3 mt-5">
        <div class="container pt-3 mt-3 col-sm-12">
          <div class="row">
            <div class="col-12 col-lg-9">
              <h2 class="testo fw-bold">Classifiche Globali</h2>
              <p class="testopic">Scopri le classifiche globali e iscriviti per competere con altri utenti!</p>
            </div>
            <div class="col-12 col-lg-3">
              <div class="mb-3">
                <div class="input-group mb-3">
                  <input type="text" id="searchInput" class="form-control" placeholder="Cerca una classifica...">
                  <button class="bottone btn btn-outline-info" id="searchButton">Cerca</button>
                </div>
              </div>      
            </div>
          </div>
        </div>
        <div class="px-5 pb-3">
          <table class="tabellina mt-4">
            <thead>
              <tr>
                <th>Classifica</th>
                <th>Top Utente</th>
                <th>iscritti</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody id="classifiche-body">
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Load classifications and setup search
  await loadClassificheData();
}

async function loadClassificheData() {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    
    if (!data.loggedIn) {
      router.navigate('/login');
      return;
    }
    
    const classRes = await fetch('/api/classifications');
    const result = await classRes.json();
    
    allClassifiche = result.classifications;
    renderClassificheTable(allClassifiche);
    
    // Setup search handlers
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    searchButton.addEventListener('click', filterClassifiche);
    searchInput.addEventListener('keyup', filterClassifiche);
    
  } catch (err) {
    console.error("Errore caricamento classifiche:", err);
    router.navigate('/login');
  }
}

function renderClassificheTable(classifiche) {
  const tbody = document.getElementById('classifiche-body');
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
        <a href="#/dettclassifica?id=${c.id}" class="btn btn-sm btn-outline-info">Dettagli</a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterClassifiche() {
  const searchInput = document.getElementById('searchInput');
  const filter = searchInput.value.toLowerCase();
  const filteredData = allClassifiche.filter(c => {
    return c.name.toLowerCase().includes(filter);
  });
  renderClassificheTable(filteredData);
}
