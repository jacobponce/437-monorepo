import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

interface ClubListing {
  _id: string;
  title: string;
  price: number;
  condition: string;
  brand?: string;
  clubType?: string;
  seller?: string;
}

export class MarketplaceViewElement extends LitElement {
  @state()
  private listings: ClubListing[] = [];

  @state()
  private loading = true;

  @state()
  private error?: string;

  private _authObserver?: Observer<Auth.Model>;
  private authToken?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver = new Observer<Auth.Model>(
      this,
      "golf:auth"
    );

    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this.authToken = (user as Auth.AuthenticatedUser).token;
      } else {
        this.authToken = undefined;
      }
      this.loadListings();
    });
  }

  async loadListings() {
    this.loading = true;
    this.error = undefined;

    try {
      const headers: Record<string, string> = {};
      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      const response = await fetch("/api/club-listings", { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.listings = await response.json();
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load listings";
      console.error("Failed to load listings:", err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <main>
        <section>
          <div class="header">
            <h2>
              <svg class="icon">
                <use href="/icons/transportation.svg#icon-golf-bag" />
              </svg>
              Marketplace - Golf Equipment
            </h2>
            <a href="/app/marketplace/create" class="btn btn-primary">
              + Create New Listing
            </a>
          </div>

          ${this.loading
            ? html`<p class="loading">Loading...</p>`
            : this.error
            ? html`<p class="error">${this.error}</p>`
            : this.listings.length === 0
            ? html`<p class="empty">No listings available.</p>`
            : html`
                <ul class="marketplace-list">
                  ${this.listings.map(
                    listing => html`
                      <li>
                        <a href="/app/marketplace/item/${listing._id}">
                          <strong>${listing.title}</strong>
                          ${listing.brand ? html` - ${listing.brand}` : ""}
                          ${listing.clubType ? html` ${listing.clubType}` : ""}
                          <br />
                          <span class="price">$${listing.price}</span>
                          <span class="condition">${listing.condition}</span>
                          ${listing.seller ? html`<span class="seller">by ${listing.seller}</span>` : ""}
                        </a>
                      </li>
                    `
                  )}
                </ul>
              `}
        </section>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    main {
      padding: var(--spacing-large);
      max-width: var(--max-width);
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-large);
      flex-wrap: wrap;
      gap: var(--spacing-medium);
    }

    h2 {
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      margin: 0;
      color: var(--color-accent);
    }

    svg.icon {
      height: 1.5em;
      width: 1.5em;
      fill: currentColor;
    }

    .btn {
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-medium);
      font-weight: 500;
      display: inline-block;
    }

    .btn-primary {
      background-color: var(--color-accent);
      color: white;
    }


    .loading,
    .error,
    .empty {
      padding: var(--spacing-large);
      text-align: center;
      background-color: var(--color-background-card);
      border-radius: var(--radius-medium);
    }

    .error {
      color: #d32f2f;
      background-color: #ffebee;
    }

    .marketplace-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--spacing-medium);
    }

    .marketplace-list li {
      background-color: var(--color-background-card);
      border-radius: var(--radius-medium);
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }


    .marketplace-list a {
      display: block;
      padding: var(--spacing-medium);
      text-decoration: none;
      color: var(--color-text);
    }

    .marketplace-list strong {
      font-size: 1.1rem;
      color: var(--color-accent);
    }

    .price {
      color: var(--color-accent);
      font-weight: 600;
      margin-right: var(--spacing-medium);
    }

    .condition {
      color: var(--color-text-secondary, #666);
      margin-right: var(--spacing-medium);
    }

    .seller {
      color: var(--color-text-secondary, #666);
      font-size: 0.9rem;
    }
  `;
}
