import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, View } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import { Credential } from "server/models";

export class AccountViewElement extends View<Model, Msg> {
  @state()
  get credential(): Credential | undefined {
    return this.model.credential;
  }

  private _authObserver = new Observer<Auth.Model>(this, "golf:auth");

  constructor() {
    super("golf:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }: Auth.Model) => {
      if (user && user.authenticated) {
        this.dispatchMessage([
          "credential/request",
          { username: user.username }
        ]);
      }
    });
  }

  private _handleSignout() {
    const event = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"]
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.credential) {
      return html`
        <main>
          <p>Loading account information...</p>
        </main>
      `;
    }

    return html`
      <main>
        <h1>My Account</h1>
        <dl>
          <dt>Username</dt>
          <dd>${this.credential.username}</dd>
        </dl>
        <div class="actions">
          <a href="/app/account/edit">
            <button>Edit</button>
          </a>
          <button class="signout-btn" @click=${this._handleSignout}>
            Sign Out
          </button>
        </div>
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

    .actions {
      display: flex;
      gap: var(--spacing-medium);
      margin-top: var(--spacing-large);
    }

    a {
      text-decoration: none;
    }

    button {
      padding: var(--spacing-medium);
      background-color: var(--color-accent);
      color: white;
      border: none;
      border-radius: var(--radius-small);
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
    }

    button:hover {
      opacity: 0.9;
    }

    button.signout-btn {
      background-color: #d32f2f;
    }
  `;
}
