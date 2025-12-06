import {
  Auth,
  define,
  History,
  Store,
  Switch
} from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { AppHeaderElement } from "./components/app-header";
import { FeatureCardElement } from "./components/feature-card";
import { FeatureGridElement } from "./components/feature-grid";
import { ClubListingFormElement } from "./components/club-listing-form";
import { CommentFormElement } from "./components/comment-form";

import { HomeViewElement } from "./views/home-view";
import { MarketplaceViewElement } from "./views/marketplace-view";
import { MarketplaceItemViewElement } from "./views/marketplace-item-view";
import { CreateListingViewElement } from "./views/create-listing-view";
import { AuctionsViewElement } from "./views/auctions-view";
import { CreateAuctionViewElement } from "./views/create-auction-view";
import { ShopViewElement } from "./views/shop-view";
import { SwingAdviceViewElement } from "./views/swing-advice-view";
import { SwingVideosViewElement } from "./views/swing-videos-view";
import { VideoViewElement } from "./views/video-view";
import { SwingCommentsViewElement } from "./views/swing-comments-view";
import { AccountViewElement } from "./views/account-view";
import { AccountEditViewElement } from "./views/account-edit-view";

const routes = [
  {
    path: "/app",
    view: () => html`<home-view></home-view>`
  },
  {
    path: "/app/marketplace",
    view: () => html`<marketplace-view></marketplace-view>`
  },
  {
    path: "/app/marketplace/item/:id",
    view: (params: Switch.Params) => html`
      <marketplace-item-view item-id=${params.id}></marketplace-item-view>
    `
  },
  {
    path: "/app/marketplace/create",
    view: () => html`<create-listing-view></create-listing-view>`
  },
  {
    path: "/app/auctions",
    view: () => html`<auctions-view></auctions-view>`
  },
  {
    path: "/app/auctions/create",
    view: () => html`<create-auction-view></create-auction-view>`
  },
  {
    path: "/app/shop",
    view: () => html`<shop-view></shop-view>`
  },
  {
    path: "/app/swing/advice",
    view: () => html`<swing-advice-view></swing-advice-view>`
  },
  {
    path: "/app/swing/videos",
    view: () => html`<swing-videos-view></swing-videos-view>`
  },
  {
    path: "/app/swing/video/:id",
    view: (params: Switch.Params) => html`
      <video-view video-id=${params.id}></video-view>
    `
  },
  {
    path: "/app/swing/comments",
    view: () => html`<swing-comments-view></swing-comments-view>`
  },
  {
    path: "/app/account",
    view: () => html`<account-view></account-view>`
  },
  {
    path: "/app/account/edit",
    view: () => html`<account-edit-view></account-edit-view>`
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "golf:auth");
    }
  },
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "golf:history", "golf:auth");
    }
  },
  "app-header": AppHeaderElement,
  "feature-card": FeatureCardElement,
  "feature-grid": FeatureGridElement,
  "club-listing-form": ClubListingFormElement,
  "comment-form": CommentFormElement,
  "home-view": HomeViewElement,
  "marketplace-view": MarketplaceViewElement,
  "marketplace-item-view": MarketplaceItemViewElement,
  "create-listing-view": CreateListingViewElement,
  "auctions-view": AuctionsViewElement,
  "create-auction-view": CreateAuctionViewElement,
  "shop-view": ShopViewElement,
  "swing-advice-view": SwingAdviceViewElement,
  "swing-videos-view": SwingVideosViewElement,
  "video-view": VideoViewElement,
  "swing-comments-view": SwingCommentsViewElement,
  "account-view": AccountViewElement,
  "account-edit-view": AccountEditViewElement
});
