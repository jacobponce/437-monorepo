import express, { Request, Response } from "express";
import { ClubListing } from "../models/club-listing";
import ClubListings from "../services/club-listing-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  ClubListings.index()
    .then((list: ClubListing[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  ClubListings.get(id)
    .then((listing: ClubListing) => res.json(listing))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newListing = req.body;
  ClubListings.create(newListing)
    .then((listing: ClubListing) => 
      res.status(201).json(listing)
  )
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedListing = req.body;
  ClubListings.update(id, updatedListing)
    .then((listing: ClubListing) => res.json(listing))
    .catch((err) => res.status(404).end());
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  
  ClubListings.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
