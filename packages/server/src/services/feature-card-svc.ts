import { Schema, model } from "mongoose";
import { FeatureCard } from "../models/feature-card";

const FeatureCardSchema = new Schema<FeatureCard>(
  {
    icon: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    linkText: { type: String, required: true, trim: true }
  },
  { collection: "feature_cards" }
);

const FeatureCardModel = model<FeatureCard>(
  "FeatureCard",
  FeatureCardSchema
);

function index(): Promise<FeatureCard[]> {
  return FeatureCardModel.find();
}

function get(id: string): Promise<FeatureCard> {
  return FeatureCardModel.findById(id)
    .then((feature) => {
      if (!feature) throw `${id} Not Found`;
      return feature;
    })
    .catch((err) => {
      throw `${id} Not Found`;
    });
}

export default { index, get };
