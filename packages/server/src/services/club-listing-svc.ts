import { Schema, model } from "mongoose";
import { ClubListing } from "../models/club-listing";

const ClubListingSchema = new Schema<ClubListing>(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    condition: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    seller: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    posted: { type: String, required: true },
    loft: { type: String, trim: true },
    shaft: { type: String, trim: true },
    clubType: { type: String, trim: true },
    brand: { type: String, trim: true }
  },
  { collection: "club_listings" }
);

const ClubListingModel = model<ClubListing>(
  "ClubListing",
  ClubListingSchema
);

function index(): Promise<ClubListing[]> {
  return ClubListingModel.find();
}

function get(id: string): Promise<ClubListing> {
  return ClubListingModel.findById(id)
    .then((listing) => {
      if (!listing) throw `${id} Not Found`;
      return listing;
    })
    .catch((err) => {
      throw `${id} Not Found`;
    });
}

function create(json: ClubListing): Promise<ClubListing> {
  const listing = new ClubListingModel(json);
  return listing.save();
}

function update(id: string, listing: ClubListing): Promise<ClubListing> {
  return ClubListingModel.findByIdAndUpdate(id, listing, { 
    new: true
  }).then((updated) => {
      if (!updated) throw `${id} not updated`;
      else return updated as ClubListing;
    });
}

function remove(id: string): Promise<void> {
  return ClubListingModel.findByIdAndDelete(id).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}

export default { index, get, create, update, remove };
