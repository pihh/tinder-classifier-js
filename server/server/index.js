const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const Router = require("./router");

const _app = express();
const _router = express.Router();

let instance;

const App = (function(app, router) {
  if (instance) return instance;

  function run() {
    // app.use(cors);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      if (req.method === "OPTIONS") {
        res.header(
          "Access-Control-Allow-Methods",
          "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
      }
      next();
    });

    Router(router);

    app.use("/images", express.static(path.resolve(__dirname, "../images")));
    app.use("/", router);
    app.listen(process.env.port || 3000);
  }

  instance = {
    run
  };

  return instance;
})(_app, _router);

module.exports = App;
