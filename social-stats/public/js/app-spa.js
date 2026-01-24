// app-spa.js - Main SPA initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Check session and render navbar/footer
  const sessionData = await getSessionData();
  await renderNavbar(sessionData.loggedIn, sessionData.user);
  renderFooter();

  // Setup routes
  router.addRoute('/', async () => {
    const sessionData = await getSessionData();
    await renderNavbar(sessionData.loggedIn, sessionData.user);
    await renderHome();
    renderFooter();
  });

  router.addRoute('/login', async () => {
    renderNavbar(false);
    await renderLogin();
    renderFooter();
  });

  router.addRoute('/signup', async () => {
    renderNavbar(false);
    await renderSignup();
    renderFooter();
  });

  router.addRoute('/dashboard', async () => {
    const sessionData = await getSessionData();
    await renderNavbar(sessionData.loggedIn, sessionData.user);
    await renderDashboard();
    renderFooter();
  });

  router.addRoute('/profile', async () => {
    const sessionData = await getSessionData();
    await renderNavbar(sessionData.loggedIn, sessionData.user);
    await renderProfile();
    renderFooter();
  });

  router.addRoute('/classifiche', async () => {
    const sessionData = await getSessionData();
    await renderNavbar(sessionData.loggedIn, sessionData.user);
    await renderClassifiche();
    renderFooter();
  });

  router.addRoute('/dettclassifica', async () => {
    const sessionData = await getSessionData();
    await renderNavbar(sessionData.loggedIn, sessionData.user);
    await renderDettClassifica();
    renderFooter();
  });

  router.addRoute('/admin', async () => {
    const sessionData = await getSessionData();
    await renderNavbar(sessionData.loggedIn, sessionData.user);
    await renderAdmin();
    renderFooter();
  });

  // Initial route
  router.handleRoute();
});

// Helper function to get session data
async function getSessionData() {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    return {
      loggedIn: data.loggedIn,
      user: data.user || null
    };
  } catch (err) {
    return { loggedIn: false, user: null };
  }
}
