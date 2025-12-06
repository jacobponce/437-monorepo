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
