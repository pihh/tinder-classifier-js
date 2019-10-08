/*

// Links :
// https://medium.com/@joel.barmettler/train-an-ai-to-swipe-tinder-for-you-bc226df8709d
//

// Linear Regression Find if a set of predicted variables does a good job predicting output
// Logistic Regression Yes or no
const linearRegression = require("ml-regression").SLR;
const inputs = [80, 60, 10, 20, 30];
const outputs = [20, 40, 30, 50, 60];

let regression = new linearRegression(inputs, outputs);

console.log({
  linearRegression: {
    regression,
    predict: regression.predict(80)
  }
});
*/

const token = "a470ac45-93af-439d-a912-51a101067606";

const Api = require("./objects/api");
const Classifier = require("./objects/classifier");
const Model = require("./objects/model");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const router = express.Router();

const TinderApi = new Api(token);
const GirlClassifier = new Classifier();

const _m = new Model();
const Scraper = async () => {
  try {
    const profile = await TinderApi.profile();
    const matches = await TinderApi.matches();
    const nearby = await TinderApi.nearby_persons();

    for (person of nearby) {
      await person.download_images();
    }

    return Promise.resolve({
      profile,
      matches,
      nearby
    });
  } catch (ex) {
    console.warn(ex);
    return promise.reject(ex);
  }
};

//app.use(bodyParser);
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
  //__dirname : It will resolve to your project folder.
});

router.get("/classifier-render", function(req, res) {
  res.status(200);
  res.send(GirlClassifier.render());
});

router.get("/classifier-like", function(req, res) {
  GirlClassifier.like()
    .then(data => {
      res.status(200);
      res.send(data);
    })
    .catch(ex => {
      res.status(500);
      res.send(ex);
    });
});

router.get("/classifier-dislike", function(req, res) {
  GirlClassifier.dislike()
    .then(data => {
      res.status(200);
      res.send(data);
    })
    .catch(ex => {
      res.status(500);
      res.send(ex);
    });
});

router.get("/scrape", function(req, res) {
  Scraper()
    .then(data => {
      res.status(200);
      res.send(data);
    })
    .catch(ex => {
      res.status(500);
      res.send(ex);
    });
});

router.post("/crop-image", function(req, res) {
  if (req.body.name) {
    const name = req.body.name;
    const m = req.body.measures;
    res.send(GirlClassifier.cropImage(name, m[0], m[1], m[2], m[3]));
  } else {
    res.status(200);
    res.send({});
  }
});

app.use("/images", express.static(__dirname + "/images"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/", router);
app.listen(process.env.port || 3000);
