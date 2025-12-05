import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

interface Comment {
  author: string;
  content: string;
  topic?: string;
}

export class CommentFormElement extends LitElement {
  @state()
  private formData: Partial<Comment> = {};

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
          <label for="topic">
            <span>Topic (optional)</span>
            <input
              type="text"
              id="topic"
              name="topic"
              placeholder="e.g., Bunker shots, Putting tips"
              @input=${this.handleInput}
            />
          </label>
        </div>

        <div class="form-group">
          <label for="content">
            <span>Comment *</span>
            <textarea
              id="content"
              name="content"
              required
              rows="4"
              placeholder="Share your advice or ask a question..."
              @input=${this.handleInput}
            ></textarea>
          </label>
        </div>

        ${this.error
          ? html`<p class="error-message">${this.error}</p>`
          : ""}
        ${this.success
          ? html`<p class="success-message">${this.success}</p>`
          : ""}

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" ?disabled=${this.isSubmitting}>
            ${this.isSubmitting ? "Posting..." : "Post Comment"}
          </button>
          <button type="button" class="btn btn-secondary" @click=${this.handleCancel}>
            Cancel
          </button>
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
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--radius-medium, 4px);
      font-family: inherit;
      font-size: 1rem;
    }

    input:focus,
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
  `;

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const name = target.name;
    const value = target.value;

    this.formData = {
      ...this.formData,
      [name]: value
    };
  }

  handleCancel() {
    this.formData = {};
    this.error = undefined;
    this.success = undefined;
    const form = this.shadowRoot?.querySelector('form');
    if (form) form.reset();
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.error = undefined;
    this.success = undefined;
    this.isSubmitting = true;

    if (!this.authToken || !this.username) {
      this.error = "You must be logged in to post a comment";
      this.isSubmitting = false;
      return;
    }

    const comment = {
      ...this.formData,
      author: this.username,
      posted: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`
        },
        body: JSON.stringify(comment)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Comment created:", result);

      this.success = "Comment posted successfully! Reloading...";
      this.formData = {};

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to create comment:", error);
      this.error = error instanceof Error ? error.message : "Failed to post comment";
    } finally {
      this.isSubmitting = false;
    }
  }
}
