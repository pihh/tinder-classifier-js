/*

// Links :
// https://medium.com/@joel.barmettler/train-an-ai-to-swipe-tinder-for-you-bc226df8709d
// https://www.youtube.com/watch?v=ogzNx_TgmFU&list=PL2Rze1Dshha3tK21ky-wXdntH9rBwnWaO&index=5

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

const token = "04d180b2-9c59-4f9f-adae-49300994aac0";

const Api = require("./objects/api");
const Classifier = require("./objects/classifier");

const TinderApi = new Api(token);
const GirlClassifier = new Classifier();

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

const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

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

app.use("/images", express.static(__dirname + "/images"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/", router);
app.listen(process.env.port || 3000);
