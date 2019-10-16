/*
Now that we have a bunch of storage to work with, let's build a really simple and ugly classifier.

It shall just loop over all the storage in our "unclassified" folder and open the image in a GUI window. By right-clicking a person, we can mark the person as "dislike", while a left-click marks the person as "like".
This will be represented in the filename later on: 4tz3kjldfj3482.jpg will be renamed to 1_4tz3kjldfj3482.jpg if we mark the image as "like", or 0_4tz3kjldfj3482.jpg otherwise.
The label like/dislike is encoded as 1/0 in the beginning of the filenmae.
*/

const FOLDER = "./storage/unclassified";
const FAIL_RESPONSE = { success: false, data: "No more files..." };

const fs = require("fs");
const parseImage = require("../utils/parse-image");
const listFolder = require("../utils/list-folder");
const TinderImage = require("../factories/image");

function getUnclassefiedImages() {
  return listFolder.unclassified();
}

let instance;

class Classifier {
  constructor() {
    if (instance) return instance;
    // Get all the storage from folder

    instance = this;
  }

  render() {
    try {
      this.images = getUnclassefiedImages();
      return {
        success: true, data: this.images
      };

      throw "No storage";
    } catch (ex) {
      return FAIL_RESPONSE;
    }
  }

  evaluate(likes, image) {
    return new Promise((res, rej) => {
      const path = likes ? "/like_" : "/dislike_";
      fs.rename(FOLDER + "/" + image, FOLDER + path + image, err => {
        if (err) rej(err);
        parseImage(path + image)
          .then(data => {
            res({success: true});
          })
          .catch(ex => {
            rej({success: false, ex});
          });
      });
    });
  }

  like(image) {
    return this.evaluate(true, image);
  }

  dislike(image) {
    return this.evaluate(false, image);
  }


}

module.exports = new Classifier();
