import * as express from "express";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import * as Constants from "./constants";
dotenv.config({ path: __dirname + "/.env" });

const client = new MongoClient(process.env.MONGODB_URI);

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

class App {
  public express;
  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private async mountRoutes() {
    const router = express.Router();

    router.get("/", (req, res) => {
      res.json({ message: "Go away, world!" });
    });

    ///cloudinary 123345ccc
    router.get("/images", async function (req, res) {
      const { resources } = await cloudinary.search
        .expression("folder:cards")
        .sort_by("public_id", "desc")
        .execute();
      const ids = resources.map((file) => file.public_id);
      res.send(ids);
    });

    //Mongo data base
    router.get("/db/cards:id", async function (req, res) {
      await client.connect().then(async () => {
        console.log("connected");
        let catId = Number(req.params.id);
        let arrCards = [];
        if (!catId) {
          const cards = client.db().collection("cards").find({ categoryId: 1 });
          await cards.forEach((el) => {
            arrCards.push(el);
          });
          res.send(arrCards);
        } else {
          return res.status(404);
        }
      });
      client.close();
    });

    router.get("/db/categories", async function (req, res) {
      await client.connect().then(async () => {
        console.log("connected");
        const categories = client.db().collection("category").find();
        let arrCat = [];
        await categories.forEach((el) => {
          arrCat.push(el);
        });
        res.send(arrCat);
      });
      client.close();
    });

    this.express.use("/", router);
  }
}

export default new App().express;
