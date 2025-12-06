import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class VideoViewElement extends LitElement {
  @property({ attribute: "video-id" })
  videoId?: string;

  render() {
    return html`
      <main>
        <h1>Video Player</h1>
        <p>Viewing video: ${this.videoId}</p>
        <p>Video player coming soon...</p>
        <a href="/app/swing/videos" class="btn">Back to Videos</a>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    main {
      padding: var(--spacing-large);
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }

    h1 {
      color: var(--color-accent);
      margin-bottom: var(--spacing-large);
    }

    .btn {
      display: inline-block;
      margin-top: var(--spacing-large);
      padding: 0.75rem 1.5rem;
      background-color: var(--color-accent);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-medium);
      font-weight: 500;
    }
  `;
}
