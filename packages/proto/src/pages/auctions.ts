import { define, Auth, Observer } from "@calpoly/mustang";
import "../components";

define({ "mu-auth": Auth.Provider });

let authToken: string | undefined;

function calculateTimeRemaining(endDate: string): string {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return "Auction ended";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}

function loadAuctions() {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  fetch('http://localhost:3000/api/auctions', { headers })
    .then(res => {
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(auctions => {
      const gridEl = document.getElementById('auctions-grid');
      if (gridEl) {
        if (auctions.length === 0) {
          gridEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary);">No active auctions yet. Be the first to create one!</p>';
        } else {
          gridEl.innerHTML = '';
          auctions.forEach((auction: any) => {
            const article = document.createElement('article');
            article.innerHTML = `
              <h3>${auction.title}</h3>
              <dl>
                <dt>Current Bid</dt>
                <dd>$${auction.currentBid.toFixed(2)}</dd>
                <dt>Time Remaining</dt>
                <dd>${calculateTimeRemaining(auction.endDate)}</dd>
                <dt>Bids</dt>
                <dd>${auction.bids}</dd>
              </dl>
            `;
            gridEl.appendChild(article);
          });
        }
      }
    })
    .catch(error => {
      const gridEl = document.getElementById('auctions-grid');
      if (gridEl) {
        gridEl.innerHTML = `<p style="grid-column: 1/-1; color: red;">Error loading auctions: ${error.message}</p>`;
      }
      console.error('Failed to load auctions:', error);
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
    loadAuctions();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
