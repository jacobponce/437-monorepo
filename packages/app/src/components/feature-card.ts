import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";

export class FeatureCardElement extends LitElement {
  @property()
  icon?: string;

  @property()
  href?: string;

  override render() {
    return html`
      <article>
        <h3>
          <svg class="icon">
            <use href="/icons/transportation.svg#${this.icon}" />
          </svg>
          <slot name="title"></slot>
        </h3>
        <p><slot name="description"></slot></p>
        <a href="${this.href}"><slot name="link-text"></slot></a>
      </article>
    `;
  }

  static styles = [
    reset.styles,
    css`
      article {
        background-color: var(--color-background-card);
        padding: var(--spacing-medium);
        border-radius: var(--radius-small);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
      }


      h3 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-small);
        color: var(--color-accent);
        margin-top: 0;
        margin-bottom: var(--spacing-small);
      }

      p {
        margin-bottom: var(--spacing-small);
      }

      a {
        display: inline-block;
        margin-top: var(--spacing-small);
        font-weight: 600;
        color: var(--color-link);
        text-decoration: none;
      }


      svg.icon {
        display: inline;
        height: 2em;
        width: 2em;
        vertical-align: top;
        fill: currentColor;
      }
    `
  ];
}
