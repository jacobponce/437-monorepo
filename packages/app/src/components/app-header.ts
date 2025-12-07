import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

export class AppHeaderElement extends LitElement {
  @state()
  private darkMode = false;

  @state()
  private user: { username: string } | null = null;

  private _authObserver?: Observer<Auth.Model>;

  connectedCallback() {
    super.connectedCallback();
    const darkModePreference = localStorage.getItem("darkMode");
    this.darkMode = darkModePreference === "enabled";

    if (this.darkMode) {
      document.body.classList.add("dark-mode");
    }

    this._authObserver = new Observer<Auth.Model>(
      this,
      "golf:auth"
    );

    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this.user = { username: user.username };
      } else {
        this.user = null;
      }
    });
  }


  toggleDarkMode() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  }


  render() {
    return html`
      <header>
        <h1>
          <a href="/app" class="logo-link">
            <svg class="icon">
              <use href="/icons/transportation.svg#icon-golf" />
            </svg>
            Golf @
          </a>
        </h1>
        <nav>
          <ul>
            <li class="dropdown">
              <span>Swing Advice</span>
              <ul class="dropdown-menu">
                <li><a href="/app/swing/videos">Videos</a></li>
                <li><a href="/app/swing/comments">Comments</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <span>Golf Shop</span>
              <ul class="dropdown-menu">
                <li><a href="/app/auctions">Auctions</a></li>
                <li><a href="/app/marketplace">Marketplace</a></li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="auth-controls">
          ${this.user
            ? html`
                <a href="/app/account" class="username-link">Hi, ${this.user.username}!</a>
              `
            : html`
                <a href="/login.html" class="login-link" @click=${(e: Event) => {
                  e.preventDefault();
                  window.location.href = "/login.html";
                }}>Sign In</a>
              `}
        </div>
        <label>
          <input
            type="checkbox"
            autocomplete="off"
            .checked=${this.darkMode}
            @change=${this.toggleDarkMode}
          />
          Dark mode
        </label>
      </header>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-large);
      background-color: var(--color-background-header);
      color: var(--color-text-header);
      border-radius: var(--radius-large);
      margin-bottom: var(--spacing-large);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      flex-wrap: wrap;
      gap: var(--spacing-medium);
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      color: var(--color-text-header);
      text-decoration: none;
    }

    .logo-link:hover {
      opacity: 0.9;
    }

    svg.icon {
      height: 2em;
      width: 2em;
      fill: currentColor;
    }

    nav {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
    }

    nav ul {
      display: flex;
      gap: var(--spacing-medium);
      list-style: none;
      margin: 0;
      padding: 0;
      flex-wrap: wrap;
    }

    nav a {
      color: var(--color-link-inverted);
      text-decoration: none;
      font-weight: 500;
    }

    nav a:hover {
      text-decoration: underline;
    }

    .dropdown {
      position: relative;
      cursor: pointer;
    }

    .dropdown > span {
      color: var(--color-link-inverted);
      font-weight: 500;
      padding: 0.5rem;
      display: block;
    }

    .dropdown > span:hover {
      text-decoration: underline;
    }

    .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background-color: var(--color-background-header);
      border-radius: var(--radius-medium);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      min-width: 150px;
      padding: 0.5rem 0;
      z-index: 1000;
    }

    .dropdown:hover .dropdown-menu {
      display: block;
    }

    .dropdown-menu li {
      list-style: none;
    }

    .dropdown-menu a {
      display: block;
      padding: 0.5rem 1rem;
      white-space: nowrap;
    }

    .dropdown-menu a:hover {
      background-color: rgba(255, 255, 255, 0.1);
      text-decoration: none;
    }

    .auth-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      color: var(--color-text-header);
    }

    .username-link {
      color: var(--color-link-inverted);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-medium);
    }

    .username-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .login-link {
      color: var(--color-link-inverted);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border: 2px solid var(--color-link-inverted);
      border-radius: var(--radius-medium);
    }

    .login-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    label {
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      cursor: pointer;
      color: var(--color-text-header);
      white-space: nowrap;
    }

    input[type="checkbox"] {
      cursor: pointer;
    }

    @media (min-width: 768px) {
      header {
        flex-wrap: nowrap;
      }
    }
  `;
}
