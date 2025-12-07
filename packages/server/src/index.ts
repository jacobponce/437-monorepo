import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import FeatureCards from "./services/feature-card-svc";
import clubListings from "./routes/club-listings";
import auctions from "./routes/auctions";
import comments from "./routes/comments";
import credentials from "./routes/credentials";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "../app/dist";

connect("golf_features");

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);
app.use("/api/credentials", authenticateUser, credentials);
app.use("/api/club-listings", authenticateUser, clubListings);
app.use("/api/auctions", authenticateUser, auctions);
app.use("/api/comments", comments);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/features", (req: Request, res: Response) => {
  FeatureCards.index().then((data) => {
    res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
  });
});

app.get("/features/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  FeatureCards.get(id).then((data) => {
    if (data) {
      res
        .set("Content-Type", "application/json")
        .send(JSON.stringify(data));
    } else {
      res.status(404).send();
    }
  });
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
