// router.js - Client-side router for SPA
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  // Register a route
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  // Handle route changes
  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    // Extract path without query parameters
    const path = hash.split('?')[0] || '/';
    const route = this.routes[path] || this.routes['/'];
    
    if (route) {
      this.currentRoute = hash;
      await route();
    }
  }

  // Navigate to a route
  navigate(path) {
    window.location.hash = path;
  }
}

// Create global router instance
const router = new Router();
