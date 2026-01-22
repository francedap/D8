// app-spa.js - Main SPA initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Check session and render navbar/footer
  const isLoggedIn = await checkSession();
  renderNavbar(isLoggedIn);
  renderFooter();

  // Setup routes
  router.addRoute('/', async () => {
    const loggedIn = await checkSession();
    renderNavbar(loggedIn);
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
    renderNavbar(true);
    await renderDashboard();
    renderFooter();
  });

  router.addRoute('/profile', async () => {
    renderNavbar(true);
    await renderProfile();
    renderFooter();
  });

  router.addRoute('/classifiche', async () => {
    renderNavbar(true);
    await renderClassifiche();
    renderFooter();
  });

  // Initial route
  router.handleRoute();
});
