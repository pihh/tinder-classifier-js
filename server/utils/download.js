const fs = require("fs");
const fetch = require("node-fetch");
const randomIntFromInterval = require("./random-int-from-interval");

// Added a sleep so tinder servers dont think we are trying something
const image = async function(url) {
  try {
    const path =
      "./images/unclassified/" + url.substr(url.lastIndexOf("/") + 1);
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", err => {
        reject(err);
      });
      fileStream.on("finish", function() {
        setTimeout(() => {
          resolve();
        }, randomIntFromInterval(0, 10));
      });
    });
  } catch (ex) {
    throw ex;
  }
};

const images = async function(array) {
  try {
    for (_image of array) {
      await image(_image);
    }

    return "OK";
  } catch (ex) {
    throw ex;
  }
};

module.exports = {
  image,
  images
};
