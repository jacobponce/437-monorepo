import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

interface Auction {
  _id: string;
  title: string;
  currentBid: number;
  endDate: string;
  bids: number;
  description?: string;
}

export class AuctionsViewElement extends LitElement {
  @state()
  private auctions: Auction[] = [];

  @state()
  private loading = true;

  @state()
  private error?: string;

  @state()
  private timeRemaining: Map<string, string> = new Map();

  private _authObserver?: Observer<Auth.Model>;
  private authToken?: string;
  private intervalId?: number;

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
      this.loadAuctions();
    });

    this.intervalId = window.setInterval(() => {
      this.updateTimeRemaining();
    }, 60000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async loadAuctions() {
    this.loading = true;
    this.error = undefined;

    try {
      const headers: Record<string, string> = {};
      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      const response = await fetch("/api/auctions", { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.auctions = await response.json();
      this.updateTimeRemaining();
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load auctions";
      console.error("Failed to load auctions:", err);
    } finally {
      this.loading = false;
    }
  }

  calculateTimeRemaining(endDate: string): string {
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
      return `${days} day${days > 1 ? "s" : ""}, ${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}, ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  }

  updateTimeRemaining() {
    const newTimeRemaining = new Map<string, string>();
    this.auctions.forEach(auction => {
      newTimeRemaining.set(auction._id, this.calculateTimeRemaining(auction.endDate));
    });
    this.timeRemaining = newTimeRemaining;
  }

  render() {
    return html`
      <main>
        <section>
          <div class="header">
            <h2>
              <svg class="icon">
                <use href="/icons/transportation.svg#icon-flag" />
              </svg>
              Active Auctions
            </h2>
            <a href="/app/auctions/create" class="btn">+ Create New Auction</a>
          </div>

          ${this.loading
            ? html`<p class="loading">Loading auctions...</p>`
            : this.error
            ? html`<p class="error">${this.error}</p>`
            : this.auctions.length === 0
            ? html`<p class="empty">No active auctions yet. Be the first to create one!</p>`
            : html`
                <div class="auctions-grid">
                  ${this.auctions.map(
                    auction => html`
                      <article>
                        <h3>${auction.title}</h3>
                        <dl>
                          <dt>Current Bid</dt>
                          <dd class="bid">$${auction.currentBid.toFixed(2)}</dd>
                          <dt>Time Remaining</dt>
                          <dd class="time">${this.timeRemaining.get(auction._id) || "Calculating..."}</dd>
                          <dt>Bids</dt>
                          <dd>${auction.bids}</dd>
                        </dl>
                      </article>
                    `
                  )}
                </div>
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
      background-color: var(--color-accent);
      color: white;
      border-radius: var(--radius-medium);
      font-weight: 500;
      display: inline-block;
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

    .auctions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-large);
    }

    article {
      background-color: var(--color-background-card);
      border-radius: var(--radius-large);
      padding: var(--spacing-large);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h3 {
      color: var(--color-accent);
      margin-top: 0;
      margin-bottom: var(--spacing-medium);
    }

    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--spacing-small) var(--spacing-medium);
    }

    dt {
      font-weight: 600;
      color: var(--color-text-secondary, #666);
    }

    dd {
      margin: 0;
    }

    .bid {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-accent);
    }

    .time {
      font-weight: 500;
      color: var(--color-accent);
    }
  `;
}
