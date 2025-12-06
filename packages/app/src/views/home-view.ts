import { css, html, LitElement } from "lit";

export class HomeViewElement extends LitElement {
  render() {
    return html`
      <main>
        <section class="hero">
          <h2>Welcome to Golf @</h2>
          <p>Connect with fellow golfers, improve your game, and find the best equipment deals all in one place.</p>
        </section>

        <section class="features">
          <h2>What We Offer</h2>
          <feature-grid src="/features"></feature-grid>
        </section>

        <section class="about">
          <h2>About Golf @</h2>
          <p>Our platform combines expert instruction, peer feedback, and a thriving marketplace to create the ultimate golf resource.</p>
        </section>

        <section class="contact">
          <h2>Contact Us</h2>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          <dl>
            <dt>Email</dt>
            <dd><a href="mailto:support@golfatsymbol.com">support@golfatsymbol.com</a></dd>

            <dt>Phone</dt>
            <dd>(123) 123-4567</dd>

            <dt>Hours</dt>
            <dd>Monday - Friday: 9:00 AM - 6:00 PM PST</dd>

            <dt>Location</dt>
            <dd>San Luis Obispo, CA</dd>
          </dl>
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

    section {
      margin-bottom: var(--spacing-xlarge);
    }

    .hero {
      text-align: center;
      padding: var(--spacing-xlarge) var(--spacing-large);
      background-color: var(--color-background-card);
      border-radius: var(--radius-large);
      margin-bottom: var(--spacing-xlarge);
    }

    .hero h2 {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-medium);
      color: var(--color-accent);
    }

    .hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    h2 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-medium);
    }

    .contact dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--spacing-small) var(--spacing-medium);
    }

    .contact dt {
      font-weight: 600;
      color: var(--color-accent);
    }

    .contact dd {
      margin: 0;
    }

    .contact a {
      color: var(--color-link);
      text-decoration: none;
    }

  `;
}
