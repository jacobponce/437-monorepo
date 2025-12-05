import express, { Request, Response } from "express";
import { AuctionListing } from "../models/auction-listing";
import AuctionListings from "../services/auction-listing-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  AuctionListings.index()
    .then((list: AuctionListing[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  AuctionListings.get(id)
    .then((listing: AuctionListing) => res.json(listing))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newListing = req.body;
  AuctionListings.create(newListing)
    .then((listing: AuctionListing) =>
      res.status(201).json(listing)
  )
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedListing = req.body;
  AuctionListings.update(id, updatedListing)
    .then((listing: AuctionListing) => res.json(listing))
    .catch((err) => res.status(404).end());
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  AuctionListings.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
