import { FeatureCardElement } from "../feature-card";
import { FeatureGridElement } from "../feature-grid";

customElements.define("golf-feature-card", FeatureCardElement);
customElements.define("golf-feature-grid", FeatureGridElement);

const label = document.getElementById("dark-mode-label");
if (label) {
  label.onchange = (event) => {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    const customEvent = new CustomEvent("darkmode:toggle", {
      bubbles: true,
      detail: { checked: target.checked }
    });
    target.dispatchEvent(customEvent);
  };
}

document.body.addEventListener("darkmode:toggle", (event: Event) => {
  const customEvent = event as CustomEvent;
  if (customEvent.detail.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});
