import express, { Request, Response } from "express";
import { Credential } from "../models/credential";

const router = express.Router();

const credentials: Record<string, Credential> = {
  testuser: { username: "testuser", hashedPassword: "hashed_password_123" }
};

router.get("/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  const credential = credentials[username];

  if (credential) {
    res.json(credential);
  } else {
    res.status(404).json({ error: "Credential not found" });
  }
});

export default router;
