import { define, Auth } from "@calpoly/mustang";
import { ClubListingFormElement } from "../components/club-listing-form";
import "../components";

define({
  "mu-auth": Auth.Provider,
  "club-listing-form": ClubListingFormElement
});
