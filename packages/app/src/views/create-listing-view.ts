import { css, html, LitElement } from "lit";

export class CreateListingViewElement extends LitElement {
  render() {
    return html`
      <main>
        <h1>Create New Listing</h1>
        <club-listing-form></club-listing-form>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    main {
      padding: var(--spacing-large);
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-large);
      text-align: center;
    }
  `;
}
