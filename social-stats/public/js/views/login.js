// views/login.js - Login page view
async function renderLogin() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="pt-5 mt-5"></div>
    <div class="container">
      <div class="row contenitorigrossi pt-3 mt-5">
        <div class="container pt-3 mt-3 col-sm-12">
          <div class="concentrata">
            <a class="logocentralepic fw-bold">D8</a>
          </div>
          <div class="text-center mt-3">
            <h1 class="fw-bold testo" style="font-size: 2.5rem;">LOG IN</h1>
            <p class="testo" style="font-size: 1.2rem;">Log in to your <b>D8</b> account now.</p>
          </div>
          <form id="loginForm" class="mx-auto" style="max-width: 400px;">
            <div class="mb-4">
              <input type="text" class="form-control" placeholder="Username o Email" id="loginUsername" required>
            </div>
            <div class="mb-4 position-relative">
              <input type="password" class="form-control" placeholder="Password" id="loginPassword" required>
            </div>
            <button type="submit" class="bottone btn btn-outline-info mb-5 mt-3 w-100">Log in</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Attach login form handler
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  
  const identifier = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || 'Login effettuato!');
      // Redirect admin users to admin panel, regular users to dashboard
      if (data.user && data.user.role === 'admin') {
        router.navigate('/admin');
      } else {
        router.navigate('/dashboard');
      }
    } else {
      alert(data.message || 'Errore di login');
    }
  } catch (err) {
    console.error('Errore nella richiesta di login:', err);
    alert('Errore di connessione');
  }
}
