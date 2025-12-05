import { AppHeaderElement } from "./app-header";
import { FeatureCardElement } from "./feature-card";
import { FeatureGridElement } from "./feature-grid";
import { AuctionListingFormElement } from "./components/auction-listing-form";
import { CommentFormElement } from "./components/comment-form";

customElements.define("app-header", AppHeaderElement);
customElements.define("golf-feature-card", FeatureCardElement);
customElements.define("golf-feature-grid", FeatureGridElement);
customElements.define("auction-listing-form", AuctionListingFormElement);
customElements.define("comment-form", CommentFormElement);

export { AppHeaderElement, FeatureCardElement, FeatureGridElement, AuctionListingFormElement, CommentFormElement };
