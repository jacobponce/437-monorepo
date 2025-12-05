import { define, Auth } from "@calpoly/mustang";
import { AuctionListingFormElement } from "../components/auction-listing-form";
import "../components";

define({
  "mu-auth": Auth.Provider,
  "auction-listing-form": AuctionListingFormElement
});
