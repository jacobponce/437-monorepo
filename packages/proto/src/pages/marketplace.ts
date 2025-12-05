import { define, Auth, Observer } from "@calpoly/mustang";
import "../components";

define({ "mu-auth": Auth.Provider });

let authToken: string | undefined;

function loadListings() {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  fetch('http://localhost:3000/api/club-listings', { headers })
    .then(res => {
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(listings => {
      const listEl = document.getElementById('listings');
      if (listEl) {
        listEl.innerHTML = '';
        listings.forEach((listing: any) => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${listing.title}</strong> - $${listing.price} - ${listing.condition}`;
          listEl.appendChild(li);
        });
      }
    })
    .catch(error => {
      const listEl = document.getElementById('listings');
      if (listEl) {
        listEl.innerHTML = `<li style="color: red;">Error: ${error.message}</li>`;
      }
      console.error('Failed to load listings:', error);
    });
}

async function initAuth() {
  await customElements.whenDefined('mu-auth');

  await new Promise(resolve => setTimeout(resolve, 100));

  const muAuthenticatorElement = document.querySelector('mu-auth') as HTMLElement;

  const _authObserver = new Observer(muAuthenticatorElement || document.body, "golf:auth");

  _authObserver.observe((auth: Auth.Model) => {
    console.log('Auth state changed:', auth);
    if (auth?.user?.authenticated) {
      authToken = (auth.user as Auth.AuthenticatedUser).token;
      console.log('User authenticated with token');
    } else {
      console.log('User not authenticated');
    }
    loadListings();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
