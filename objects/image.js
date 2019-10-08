const fs = require("fs");
const Jimp = require("jimp2");
class TinderImage {
  constructor(name) {
    this.name = name;
  }

  // Search in folders and return it
  find() {
    const FOLDERS = [
      "unclassified/",
      "classified/positive/",
      "classified/negative/"
    ];
    let file;

    for (let i = 0; i < FOLDERS.length; i++) {
      const path = "./images/" + FOLDERS[i] + this.name;
      if (fs.existsSync(path)) {
        return path;
      }
    }

    throw "Cannot find file";
  }

  async convertToGrayScale() {
    try {
      const img = await Jimp.read(this.name);
      await img.greyscale().write(this.name); // save
      return img;
    } catch (ex) {
      throw ex;
    }
  }

  async crop(x0, y0, x1, y1) {
    try {
      const img = await Jimp.read(this.find());
      await img
        .greyscale()
        .resize(256, 256) // resize
        // .crop(x0, y0, x1 - x0, y1 - y0)
        .write(this.find()); // save

      return {
        img,
        path: this.find()
      };
    } catch (ex) {
      throw ex;
    }
    // return new Promise((res, rej) => {
    //   const file = this.find();
    //   Jimp.read(file)
    //     .then(image => {
    //       image.crop(x0, y0, x1 - x0, y1 - y0);
    //       image.write(this.find());
    //       res();
    //     })
    //     .catch(err => {
    //       rej("Cannot crop image");
    //     });
    // });
  }
}

module.exports = TinderImage;
