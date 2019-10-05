/*
Now that we have a bunch of images to work with, let's build a really simple and ugly classifier.

It shall just loop over all the images in our "unclassified" folder and open the image in a GUI window. By right-clicking a person, we can mark the person as "dislike", while a left-click marks the person as "like".
This will be represented in the filename later on: 4tz3kjldfj3482.jpg will be renamed to 1_4tz3kjldfj3482.jpg if we mark the image as "like", or 0_4tz3kjldfj3482.jpg otherwise.
The label like/dislike is encoded as 1/0 in the beginning of the filenmae.
*/

const FOLDER = "./images/unclassified";

const fs = require("fs");

function getUnclassefiedImages() {
  return fs
    .readdirSync(FOLDER)
    .filter(
      el =>
        el.indexOf("like_") == -1 &&
        el.indexOf("dislike_") == -1 &&
        el != ".gitignore"
    );
}

class Classifier {
  constructor() {
    // Get all the images from folder
    this.images = getUnclassefiedImages();
    this.index = 0;
    this.last = this.images.length - 1;
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
      return {
        success: false,
        data: "No more files"
      };
    }
  }

  next_image() {
    if (this.index === this.last) {
      return {
        success: false,
        data: "No more files"
      };
    }

    this.index++;

    return {
      success: true,
      data: this.images[this.index]
    };
  }

  like() {
    fs.rename(
      FOLDER + "/" + this.images[this.index],
      FOLDER + "/like_" + this.images[this.index],
      function(err) {
        if (err) throw err;
      }
    );
    return this.next_image();
  }

  dislike() {
    fs.rename(
      FOLDER + "/" + this.images[this.index],
      FOLDER + "/dislike_" + this.images[this.index],
      function(err) {
        if (err) throw +err;
      }
    );
    return this.next_image();
  }
}

module.exports = Classifier;
