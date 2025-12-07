import { Schema, model } from "mongoose";
import { AuctionListing } from "../models/auction-listing";

const AuctionListingSchema = new Schema<AuctionListing>(
  {
    title: { type: String, required: true, trim: true },
    startingBid: { type: Number, required: true },
    currentBid: { type: Number, required: true },
    condition: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
    seller: { type: String, required: true, trim: true },
    endDate: { type: String, required: true },
    posted: { type: String, required: true },
    itemType: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    bids: { type: Number, default: 0 }
  },
  { collection: "auction_listings" }
);

const AuctionListingModel = model<AuctionListing>(
  "AuctionListing",
  AuctionListingSchema
);

function index(): Promise<AuctionListing[]> {
  return AuctionListingModel.find();
}

function get(id: string): Promise<AuctionListing> {
  return AuctionListingModel.findById(id)
    .then((listing) => {
      if (!listing) throw `${id} Not Found`;
      return listing;
    })
    .catch((err) => {
      throw `${id} Not Found`;
    });
}

function create(json: AuctionListing): Promise<AuctionListing> {
  const listing = new AuctionListingModel(json);
  return listing.save();
}

function update(id: string, listing: AuctionListing): Promise<AuctionListing> {
  return AuctionListingModel.findByIdAndUpdate(id, listing, {
    new: true
  }).then((updated) => {
      if (!updated) throw `${id} not updated`;
      else return updated as AuctionListing;
    });
}

function remove(id: string): Promise<void> {
  return AuctionListingModel.findByIdAndDelete(id).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}

export default { index, get, create, update, remove };
