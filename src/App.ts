import * as express from "express";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config({ path: __dirname + "/.env" });

const client = new MongoClient(process.env.MONGO_URI);

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

    //connection db

    router.get("/", (req, res) => {
      res.json({ message: "Go away, world!" });
    });

    ///cloudinary
    router.get("/images", async function (req, res) {
      const { resources } = await cloudinary.search
        .expression("folder:cards")
        .sort_by("public_id", "desc")
        .execute();
      const ids = resources.map((file) => file.public_id);
      res.send(ids);
    });

    //Mongo data base
    router.get("/db", async function (req, res) {
      await client.connect().then(async () => {
        console.log("connected");
        const categories = client.db().collection("category").find();
        let arrCat = [];
        await categories.forEach((el) => {
          arrCat.push(el);
        });
        res.send(arrCat);
      });
    });

    this.express.use("/", router);
  }
}

export default new App().express;
