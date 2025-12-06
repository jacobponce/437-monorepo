import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

export class AccountViewElement extends LitElement {
  @state()
  private user?: { username: string; email?: string };

  private _authObserver?: Observer<Auth.Model>;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver = new Observer<Auth.Model>(
      this,
      "golf:auth"
    );

    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this.user = {
          username: user.username,
          email: (user as any).email
        };
      } else {
        this.user = undefined;
      }
    });
  }

  render() {
    if (!this.user) {
      return html`
        <main>
          <p>Please log in to view your account.</p>
        </main>
      `;
    }

    return html`
      <main>
        <h1>My Account</h1>
        <dl>
          <dt>Username</dt>
          <dd>${this.user.username}</dd>
          ${this.user.email ? html`
            <dt>Email</dt>
            <dd>${this.user.email}</dd>
          ` : ""}
        </dl>
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
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--spacing-medium) var(--spacing-large);
    }

    dt {
      font-weight: 600;
      color: var(--color-accent);
    }

    dd {
      margin: 0;
    }
  `;
}
