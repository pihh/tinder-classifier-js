let instance;

const TinderScraper = require("../utils/scraper");
const TinderClassifier = require("../services/classifier");

const listFolder = require("../utils/list-folder");

const Router = router => {
  if (instance) return instance;

  router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
  });

  router.get("/classifier-render", function(req, res) {
    res.status(200);
    res.send(TinderClassifier.render());
  });

  router.get("/classifier-like", function(req, res) {
    TinderClassifier.like()
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
    TinderClassifier.dislike()
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
    TinderScraper()
      .then(data => {
        res.status(200);
        res.send(data);
      })
      .catch(ex => {
        res.status(500);
        res.send(ex);
      });
  });

  router.get("/list-classified-images", async function(req, res) {
    const positive = listFolder.positive();
    const negative = listFolder.negative();
    const length = [positive, negative].reduce(
      (cumulator, element) => (cumulator += element.length),
      0
    );
    res.status(200);
    res.send({
      success: true,
      data: {
        positive,
        negative,
        length
      }
    });
  });

  router.post("/crop-image", function(req, res) {
    if (req.body.name) {
      const name = req.body.name;
      const m = req.body.measures;
      res.send(TinderClassifier.cropImage(name, m[0], m[1], m[2], m[3]));
    } else {
      res.status(200);
      res.send({});
    }
  });

  instance = router;

  return instance;
};

module.exports = Router;
