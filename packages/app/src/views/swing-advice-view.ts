import { css, html, LitElement } from "lit";

export class SwingAdviceViewElement extends LitElement {
  render() {
    return html`
      <main>
        <h1>Swing Advice</h1>
        <section>
          <h2>Improve Your Golf Swing</h2>
          <p>Get expert tips and advice to improve your swing technique.</p>
          <nav>
            <a href="/app/swing/videos" class="btn">Watch Videos</a>
            <a href="/app/swing/comments" class="btn">Read Comments</a>
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
