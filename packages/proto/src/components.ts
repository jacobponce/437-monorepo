import { AppHeaderElement } from "./app-header";
import { FeatureCardElement } from "./feature-card";
import { FeatureGridElement } from "./feature-grid";
import { AuctionListingFormElement } from "./components/auction-listing-form";

customElements.define("app-header", AppHeaderElement);
customElements.define("golf-feature-card", FeatureCardElement);
customElements.define("golf-feature-grid", FeatureGridElement);
customElements.define("auction-listing-form", AuctionListingFormElement);

export { AppHeaderElement, FeatureCardElement, FeatureGridElement, AuctionListingFormElement };
