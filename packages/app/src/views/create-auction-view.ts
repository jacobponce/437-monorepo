import { css, html, LitElement } from "lit";

export class CreateAuctionViewElement extends LitElement {
  render() {
    return html`
      <main>
        <h1>Create New Auction</h1>
        <p>Auction creation form coming soon...</p>
        <a href="/app/auctions" class="btn">Back to Auctions</a>
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
      text-align: center;
    }

    h1 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-large);
    }

    .btn {
      display: inline-block;
      margin-top: var(--spacing-large);
      padding: 0.75rem 1.5rem;
      background-color: var(--color-accent);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-medium);
      font-weight: 500;
    }
  `;
}
