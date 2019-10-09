/*
Now that we have a bunch of images to work with, let's build a really simple and ugly classifier.

It shall just loop over all the images in our "unclassified" folder and open the image in a GUI window. By right-clicking a person, we can mark the person as "dislike", while a left-click marks the person as "like".
This will be represented in the filename later on: 4tz3kjldfj3482.jpg will be renamed to 1_4tz3kjldfj3482.jpg if we mark the image as "like", or 0_4tz3kjldfj3482.jpg otherwise.
The label like/dislike is encoded as 1/0 in the beginning of the filenmae.
*/

const FOLDER = "./images/unclassified";
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
    // Get all the images from folder
    this.images = getUnclassefiedImages();
    this.index = 0;
    this.last = this.images.length - 1;

    instance = this;
  }

  render() {
    try {
      if (this.images[0]) {
        return {
          success: true,
          data: this.images[0]
        };
      }

      throw "No images";
    } catch (ex) {
      return FAIL_RESPONSE;
    }
  }

  next_image() {
    if (this.index === this.last) {
      return FAIL_RESPONSE;
    }

    this.index++;

    return {
      success: true,
      data: this.images[this.index]
    };
  }

  evaluate(likes) {
    return new Promise((res, rej) => {
      const image = this.images[this.index];
      const path = likes ? "/like_" : "/dislike_";
      fs.rename(FOLDER + "/" + image, FOLDER + path + image, err => {
        if (err) rej(err);
        parseImage(path + image)
          .then(data => {
            res(this.next_image());
          })
          .catch(ex => {
            rej(ex);
          });
      });
    });
  }

  like() {
    return this.evaluate(true);
  }

  dislike() {
    return this.evaluate(false);
  }

  cropImage(name, x0, y0, x1, y1) {
    return new TinderImage(name).crop(x0, y0, x1, y1);
  }
}

module.exports = new Classifier();
