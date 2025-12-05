import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import FeatureCards from "./services/feature-card-svc";
import clubListings from "./routes/club-listings";
import auctions from "./routes/auctions";
import auth, { authenticateUser } from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "../proto/dist";

connect("golf_features");

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);
app.use("/api/club-listings", authenticateUser, clubListings);
app.use("/api/auctions", authenticateUser, auctions);

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
