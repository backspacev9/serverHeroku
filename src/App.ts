import * as express from "express";
class App {
  public express;
  constructor() {
    this.express = express();
    this.mountRoutes();
  }
  private mountRoutes(): void {
    const router = express.Router();
    router.get("/", (req, res) => {
      res.json({ message: "Go away, world!" });
    });
    router.get("/about", function (req, res) {
      res.send("about");
    });
    this.express.use("/", router);
  }
}
export default new App().express;
