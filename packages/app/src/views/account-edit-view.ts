import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Auth, define, Form, History, Observer, View } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import { Credential } from "server/models";

export class AccountEditViewElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element
  });

  @state()
  username?: string;

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
        if (this.model.credential) {
          this.username = this.model.credential.username;
        } else {
          this.username = user.username;
          this.dispatchMessage([
            "credential/request",
            { username: user.username }
          ]);
        }
      }
    });
  }

  render() {
    if (!this.credential) {
      return html`
        <main>
          <p>Loading...</p>
        </main>
      `;
    }

    return html`
      <main>
        <h1>Edit Account</h1>
        <mu-form .init=${this.credential} @mu-form:submit=${this.handleSubmit}>
          <label>
            <span>Username</span>
            <input name="username" />
          </label>
          <label>
            <span>Password</span>
            <input name="hashedPassword" type="password" readonly />
          </label>
          <button type="submit">Save</button>
        </mu-form>
      </main>
    `;
  }

  handleSubmit(event: Form.SubmitEvent<Credential>) {
    const usernameChanged = event.detail.username !== this.username;
    this.dispatchMessage([
      "credential/save",
      {
        username: this.username!,
        credential: event.detail
      },
      {
        onSuccess: () => {
          if (usernameChanged) {
            alert("Username changed. Please login again with your new username.");
            Auth.dispatch(this, "auth/signout");
            History.dispatch(this, "history/navigate", { href: "/app/login.html" });
          } else {
            alert("Password updated successfully!");
            History.dispatch(this, "history/navigate", { href: "/app/account" });
          }
        },
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      }
    ]);
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

    mu-form {
      background-color: var(--color-background-card);
      padding: var(--spacing-large);
      border-radius: var(--radius-large);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-medium);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-small);
    }

    label span {
      font-weight: 600;
      color: var(--color-accent);
    }

    input {
      padding: var(--spacing-small);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-small);
      font-size: 1rem;
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
  `;
}
