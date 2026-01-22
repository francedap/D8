// views/dashboard.js - Dashboard page view
async function renderDashboard() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="pt-5 mt-4"></div>
    <div class="container">
      <div class="row contenitorigrossi pt-3 mt-5">
        <div class="contenitorigrossi pt-3 mt-3 col-sm-12">
          <div class="text-center mt-3 mb-5">
            <h1 class="fw-bold testo" style="font-size: 2.5rem;">Aggiorna le tue statistiche!</h1>
          </div>
          
          <form class="mx-auto" id="statsForm" style="max-width: 500px;">
            <div class="mb-4">
              <select class="form-select" id="classifica" required>
                <option value="" disabled selected>Seleziona la classifica</option>
              </select>
            </div>
            <div class="mb-4">
              <input type="text" class="form-control" id="meal" placeholder="Titolo attività" required>
            </div>
            <div class="mb-4">
              <input type="number" class="form-control" id="steps" placeholder="Quantità" required>
            </div>
            <div class="mb-4">
              <input type="text" class="form-control" id="category" placeholder="Categoria" required>
            </div>
            <button type="submit" class="bottone btn btn-outline-info mb-5 mt-3 w-100">Aggiorna Statistiche</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Load classifications and setup form
  await loadDashboardData();
}

async function loadDashboardData() {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    
    if (!data.loggedIn) {
      router.navigate('/login');
      return;
    }
    
    const currentUserId = data.user.id;
    
    // Load classifications
    const classRes = await fetch(`/api/users/${currentUserId}/classifications`);
    const result = await classRes.json();
    
    const select = document.getElementById('classifica');
    if (result.classifications) {
      result.classifications.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.classification;
        opt.textContent = c.classification;
        select.appendChild(opt);
      });
    }
    
    // Attach form handler
    document.getElementById('statsForm').addEventListener('submit', handleStatsSubmit);
    
  } catch (err) {
    console.error('Error loading dashboard:', err);
    router.navigate('/login');
  }
}

async function handleStatsSubmit(e) {
  e.preventDefault();

  const classifica = document.getElementById('classifica').value;
  const meal = document.getElementById('meal').value;
  const steps = document.getElementById('steps').value;
  const category = document.getElementById('category').value;

  if (!classifica) {
    alert("Errore: Devi selezionare una classifica");
    return;
  }

  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    
    if (!data.loggedIn) {
      router.navigate('/login');
      return;
    }

    const userId = data.user.id;

    const statsRes = await fetch(`/api/users/${userId}/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classification: classifica,
        title: meal,
        value: steps,
        category: category
      })
    });
    
    const resp = await statsRes.json();
    
    if (resp.error) {
      alert("Errore: " + resp.error);
    } else {
      alert(resp.message + `\nPunti totali: ${resp.points}\nLivello: ${resp.level}`);
      e.target.reset();
    }
  } catch (err) {
    console.error("Errore salvataggio statistiche:", err);
    alert("Si è verificato un errore. Riprova più tardi.");
  }
}
