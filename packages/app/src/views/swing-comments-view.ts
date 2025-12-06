import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";

interface Comment {
  _id?: string;
  author: string;
  content: string;
  posted: string;
  topic?: string;
}

export class SwingCommentsViewElement extends LitElement {
  @state()
  private comments: Comment[] = [];

  @state()
  private loading = true;

  @state()
  private error?: string;

  @state()
  private showForm = false;

  connectedCallback() {
    super.connectedCallback();
    this.loadComments();
  }

  async loadComments() {
    this.loading = true;
    this.error = undefined;

    try {
      const response = await fetch("/api/comments");
      if (!response.ok) {
        throw new Error("Failed to load comments");
      }
      this.comments = await response.json();
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load comments";
      console.error("Error loading comments:", err);
    } finally {
      this.loading = false;
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  render() {
    return html`
      <main>
        <div class="header">
          <h1>Advice Comment Thread</h1>
          <button class="btn" @click=${this.toggleForm}>
            ${this.showForm ? "- Hide Form" : "+ Add Comment"}
          </button>
        </div>

        ${this.showForm
          ? html`
              <section class="form-section">
                <h2>Post a Comment</h2>
                <comment-form></comment-form>
              </section>
            `
          : ""}

        <section class="comments-section">
          <h2>Recent Comments</h2>
          ${this.loading
            ? html`<p>Loading comments...</p>`
            : this.error
            ? html`<p class="error">${this.error}</p>`
            : this.comments.length === 0
            ? html`<p>No comments yet. Be the first to share your advice!</p>`
            : html`
                <div class="comments-list">
                  ${this.comments.map(
                    comment => html`
                      <article>
                        <h3>${comment.author}</h3>
                        ${comment.topic ? html`<p><strong>Topic:</strong> ${comment.topic}</p>` : ""}
                        <p class="date">Posted: ${comment.posted}</p>
                        <p>${comment.content}</p>
                      </article>
                    `
                  )}
                </div>
              `}
        </section>

        <nav>
          <a href="/app/swing/advice" class="btn">Back to Swing Advice</a>
        </nav>
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

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-large);
      flex-wrap: wrap;
      gap: var(--spacing-medium);
    }

    h1 {
      margin: 0;
      color: var(--color-accent);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      background-color: var(--color-accent);
      color: white;
      border: none;
      border-radius: var(--radius-medium);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    .form-section {
      margin-bottom: var(--spacing-large);
    }

    .comments-section {
      margin-bottom: var(--spacing-large);
    }

    h2 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-medium);
    }

    .error {
      color: #d32f2f;
      background-color: #ffebee;
      padding: var(--spacing-medium);
      border-radius: var(--radius-medium);
    }

    .comments-list {
      display: grid;
      gap: var(--spacing-medium);
    }

    article {
      background-color: var(--color-background-card);
      padding: var(--spacing-large);
      border-radius: var(--radius-medium);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    article h3 {
      color: var(--color-accent);
      margin-top: 0;
      margin-bottom: var(--spacing-small);
    }

    article p {
      margin: var(--spacing-small) 0;
    }

    .date {
      color: var(--color-text-secondary, #666);
      font-size: 0.9rem;
    }

    nav {
      margin-top: var(--spacing-large);
    }
  `;
}
