// js/main.js
import showHome from './home.js';
import showCatalogue from './catalogue.js';
import showCart from './cart.js';
import showCheckout from './checkout.js';
import showLogin from './login.js';
import showRegister from './register.js';
import showAdmin from './admin.js';

const app = document.getElementById('app');

function renderPage() {
  const hash = window.location.hash || '#home';
  app.innerHTML = '';

  switch (hash) {
    case '#home':
      showHome(app);
      break;
    case '#catalogue':
      showCatalogue(app);
      break;
    case '#cart':
      showCart(app);
      break;
    case '#checkout':
      showCheckout(app);
      break;
    case '#login':
      showLogin(app);
      break;
    case '#register':
      showRegister(app);
      break;
    case '#admin':
      showAdmin(app);
      break;
    default:
      app.innerHTML = `<div class="alert alert-danger">404 - Page not found</div>`;
  }
}

window.addEventListener('hashchange', renderPage);
window.addEventListener('load', renderPage);
