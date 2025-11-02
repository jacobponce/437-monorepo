import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";

interface FeatureCard {
  icon: string;
  href: string;
  title: string;
  description: string;
  linkText: string;
}

export class FeatureGridElement extends LitElement {
  @property()
  src?: string;

  @state()
  features: Array<FeatureCard> = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  hydrate(src: string) {
    fetch(src)
      .then(res => res.json())
      .then((json: Array<FeatureCard>) => {
        if (json) {
          this.features = json;
        }
      });
  }

  render() {
    return html`
      <div class="feature-grid">
        ${this.features.map(feature => this.renderFeature(feature))}
      </div>
    `;
  }

  renderFeature(feature: FeatureCard) {
    return html`
      <golf-feature-card
        icon=${feature.icon}
        href=${feature.href}
      >
        <span slot="title">${feature.title}</span>
        <span slot="description">${feature.description}</span>
        <span slot="link-text">${feature.linkText}</span>
      </golf-feature-card>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
