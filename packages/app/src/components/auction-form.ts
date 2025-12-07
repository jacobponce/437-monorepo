import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

interface AuctionListing {
  title: string;
  startingBid: number;
  seller: string;
  endDate: string;
  posted: string;
  itemType: string;
  brand: string;
}

export class AuctionFormElement extends LitElement {
  @state()
  private formData: Partial<AuctionListing> = {};

  @state()
  private error?: string;

  @state()
  private success?: string;

  @state()
  private isSubmitting = false;

  private _authObserver?: Observer<Auth.Model>;
  private authToken?: string;
  private username?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver = new Observer<Auth.Model>(
      this,
      "golf:auth"
    );

    this._authObserver.observe(({ user }) => {
      if (user && user.authenticated) {
        this.authToken = (user as Auth.AuthenticatedUser).token;
        this.username = user.username;
      } else {
        this.authToken = undefined;
        this.username = undefined;
      }
    });
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="title">
            <span>Auction Title *</span>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g., TaylorMade Driver - Like New"
              @input=${this.handleInput}
            />
          </label>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="brand">
              <span>Brand *</span>
              <input
                type="text"
                id="brand"
                name="brand"
                required
                placeholder="e.g., TaylorMade"
                @input=${this.handleInput}
              />
            </label>
          </div>

          <div class="form-group">
            <label for="itemType">
              <span>Item Type *</span>
              <select id="itemType" name="itemType" required @change=${this.handleInput}>
                <option value="">Select type...</option>
                <option value="driver">Driver</option>
                <option value="wood">Wood</option>
                <option value="hybrid">Hybrid</option>
                <option value="iron">Iron</option>
                <option value="wedge">Wedge</option>
                <option value="putter">Putter</option>
                <option value="bag">Golf Bag</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startingBid">
              <span>Starting Bid ($) *</span>
              <input
                type="number"
                id="startingBid"
                name="startingBid"
                required
                step="0.01"
                min="0"
                placeholder="50.00"
                @input=${this.handleInput}
              />
            </label>
          </div>

          <div class="form-group">
            <label for="endDate">
              <span>Auction End Date *</span>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                required
                min=${this.getMinDateTime()}
                @input=${this.handleInput}
              />
            </label>
          </div>
        </div>

        ${this.error
          ? html`<p class="error-message">${this.error}</p>`
          : ""}
        ${this.success
          ? html`<p class="success-message">${this.success}</p>`
          : ""}

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" ?disabled=${this.isSubmitting}>
            ${this.isSubmitting ? "Creating..." : "Create Auction"}
          </button>
          <a href="/app/auctions" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    `;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
    }

    form {
      background: var(--color-background-card, white);
      padding: var(--spacing-large, 2rem);
      border-radius: var(--radius-large, 8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: var(--spacing-medium, 1rem);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-medium, 1rem);
    }

    label {
      display: block;
    }

    label span {
      display: block;
      margin-bottom: var(--spacing-small, 0.5rem);
      font-weight: 500;
      color: var(--color-text-primary, #333);
    }

    input[type="text"],
    input[type="number"],
    input[type="datetime-local"],
    select,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--radius-medium, 4px);
      font-family: inherit;
      font-size: 1rem;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: var(--color-accent, #4CAF50);
    }

    textarea {
      resize: vertical;
    }

    .error-message {
      color: #d32f2f;
      background-color: #ffebee;
      padding: var(--spacing-medium, 1rem);
      border-radius: var(--radius-medium, 4px);
      margin-bottom: var(--spacing-medium, 1rem);
    }

    .success-message {
      color: #2e7d32;
      background-color: #e8f5e9;
      padding: var(--spacing-medium, 1rem);
      border-radius: var(--radius-medium, 4px);
      margin-bottom: var(--spacing-medium, 1rem);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-medium, 1rem);
      margin-top: var(--spacing-large, 2rem);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: var(--radius-medium, 4px);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      transition: opacity 0.2s;
    }

    .btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: var(--color-accent, #4CAF50);
      color: white;
    }

    .btn-secondary {
      background-color: var(--color-border, #ddd);
      color: var(--color-text-primary, #333);
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `;

  getMinDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  }

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = target.name;
    let value: string | number = target.value;

    if (name === "startingBid") {
      value = parseFloat(value);
    }

    this.formData = {
      ...this.formData,
      [name]: value
    };
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.error = undefined;
    this.success = undefined;
    this.isSubmitting = true;

    if (!this.authToken || !this.username) {
      this.error = "You must be logged in to create an auction";
      this.isSubmitting = false;
      return;
    }

    const auction = {
      ...this.formData,
      currentBid: this.formData.startingBid,
      bids: 0,
      seller: this.username,
      posted: new Date().toISOString().split("T")[0]
    };

    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`
        },
        body: JSON.stringify(auction)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Auction created:", result);

      this.success = "Auction created successfully! Redirecting...";
      this.formData = {};

      setTimeout(() => {
        window.location.href = "/app/auctions";
      }, 2000);
    } catch (error) {
      console.error("Failed to create auction:", error);
      this.error = error instanceof Error ? error.message : "Failed to create auction";
    } finally {
      this.isSubmitting = false;
    }
  }
}
