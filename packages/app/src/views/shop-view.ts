import { css, html, LitElement } from "lit";

export class ShopViewElement extends LitElement {
  render() {
    return html`
      <main>
        <h1>Golf Shop</h1>
        <section>
          <h2>Browse Our Collection</h2>
          <p>Explore golf equipment, apparel, and accessories.</p>
          <nav>
            <a href="/app/marketplace" class="btn">Marketplace</a>
            <a href="/app/auctions" class="btn">Auctions</a>
          </nav>
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

    h1 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-large);
    }

    section {
      background-color: var(--color-background-card);
      padding: var(--spacing-large);
      border-radius: var(--radius-large);
    }

    nav {
      margin-top: var(--spacing-large);
      display: flex;
      gap: var(--spacing-medium);
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
  `;
}
