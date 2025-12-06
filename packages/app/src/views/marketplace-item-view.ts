import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

interface ClubListing {
  _id: string;
  title: string;
  price: number;
  condition: string;
  loft?: string;
  shaft?: string;
  description: string;
  seller: string;
  location: string;
  posted?: string;
  brand?: string;
  clubType?: string;
}

export class MarketplaceItemViewElement extends LitElement {
  @property({ attribute: "item-id" })
  itemId?: string;

  @state()
  private item?: ClubListing;

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
      if (this.itemId) {
        this.loadItem();
      }
    });
  }

  async loadItem() {
    if (!this.itemId) return;

    this.loading = true;
    this.error = undefined;

    try {
      const headers: Record<string, string> = {};
      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(`/api/club-listings/${this.itemId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.item = await response.json();
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load item";
      console.error("Failed to load item:", err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`<main class="loading">Loading...</main>`;
    }

    if (this.error) {
      return html`
        <main>
          <p class="error">${this.error}</p>
          <nav>
            <a href="/app/marketplace" class="btn">Back to Marketplace</a>
          </nav>
        </main>
      `;
    }

    if (!this.item) {
      return html`
        <main>
          <p class="error">Item not found</p>
          <nav>
            <a href="/app/marketplace" class="btn">Back to Marketplace</a>
          </nav>
        </main>
      `;
    }

    return html`
      <main>
        <h1>${this.item.title}</h1>

        <dl>
          <dt>Price</dt>
          <dd class="price">$${this.item.price}</dd>

          <dt>Condition</dt>
          <dd>${this.item.condition}</dd>

          ${this.item.brand
            ? html`
                <dt>Brand</dt>
                <dd>${this.item.brand}</dd>
              `
            : ""}
          ${this.item.clubType
            ? html`
                <dt>Club Type</dt>
                <dd>${this.item.clubType}</dd>
              `
            : ""}
          ${this.item.loft
            ? html`
                <dt>Loft</dt>
                <dd>${this.item.loft}</dd>
              `
            : ""}
          ${this.item.shaft
            ? html`
                <dt>Shaft</dt>
                <dd>${this.item.shaft}</dd>
              `
            : ""}

          <dt>Description</dt>
          <dd>${this.item.description}</dd>

          <dt>Seller</dt>
          <dd>${this.item.seller}</dd>

          <dt>Location</dt>
          <dd>${this.item.location}</dd>

          ${this.item.posted
            ? html`
                <dt>Posted</dt>
                <dd>${this.item.posted}</dd>
              `
            : ""}
        </dl>

        <nav>
          <a href="/app/marketplace" class="btn">Back to Marketplace</a>
        </nav>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    main {
      padding: var(--spacing-large);
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-large);
    }

    dl {
      background-color: var(--color-background-card);
      padding: var(--spacing-large);
      border-radius: var(--radius-large);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--spacing-medium) var(--spacing-large);
      margin-bottom: var(--spacing-large);
    }

    dt {
      font-weight: 600;
      color: var(--color-accent);
    }

    dd {
      margin: 0;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-accent);
    }

    nav {
      margin-top: var(--spacing-large);
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: var(--color-accent);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-medium);
      font-weight: 500;
    }


    .loading {
      text-align: center;
      padding: var(--spacing-xlarge);
    }

    .error {
      color: #d32f2f;
      background-color: #ffebee;
      padding: var(--spacing-large);
      border-radius: var(--radius-medium);
      margin-bottom: var(--spacing-large);
    }
  `;
}
