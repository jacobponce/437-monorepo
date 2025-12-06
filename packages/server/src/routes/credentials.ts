import express, { Request, Response } from "express";
import { Credential } from "../models/credential";
import Credentials from "../services/credential-svc";

const router = express.Router();

router.get("/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  Credentials.get(username)
    .then((credential: Credential) => res.json(credential))
    .catch((err) => res.status(404).send(err));
});

router.put("/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  const updatedCredential = req.body;
  Credentials.update(username, updatedCredential)
    .then((credential: Credential) => res.json(credential))
    .catch((err) => res.status(404).send(err));
});

export default router;
