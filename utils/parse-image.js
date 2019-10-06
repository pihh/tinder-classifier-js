/*
The first part is as easy as using Pillow to open up our image and convert it to greyscale.
For the second part, we use the Tensorflow Object Detection API with the mobilenet network architecture, pretrained on the coco dataset that also contains a label for "Person".
Our script for person detection has four parts:
Part 1: Opening the pretrained mobilenet coco dataset as a Tensorflow graph
You find the .bp file for the tensorflow mobilenet coco graph in my Github repository.
Let's open it as a Tensorflow graph:
 */
const FOLDER = "./images/unclassified";
const Jimp = require("jimp");
const moveClassified = require("./move-classified");

/*
Part 1: Opening the pretrained mobilenet coco dataset as a Tensorflow graph
Part 2: Load in images as numpy arrays
Part 3: Call object detection API
Part 4: Bringing it all together to find the person
Part 5: Move all images into according classified folder
 */

// STEP 0
async function convertToGrayScale(image) {
  try {
    const img = await Jimp.read(image);
    await img.greyscale().write(image); // save

    return {
      success: true
    };
  } catch (ex) {
    throw ex;
  }
}

const parseImage = async function(image) {
  try {
    await convertToGrayScale(FOLDER + image);
    await moveClassified.file(image);

    return true;
  } catch (ex) {
    throw ex;
  }
};

module.exports = parseImage;
