import { CONSTANTS } from "./constants";
import { Image } from "./image";
import * as tf from "@tensorflow/tfjs";

console.dir("@TODO: get image set meta and update NUM_DATASET_ELEMENTS");

export class MnistData {
  constructor() {
    this.shuffledTrainIndex = 0;
    this.shuffledTestIndex = 0;
    this.imgResponse = [];
    this.labelsResponse = [];
    this.datasetImages = [];
    this.datasetLabels = [];
  }
  //
  async getImages() {
    return [];
  }

  async load() {
    try {
      // Make a request for the MNIST sprited image.
      const images = await this.getImages();
      // Add them to it's place
      for (let image of images) {
        const { img, label } = await new Image(image);
        this.imgResponse.push(img);
        this.labelsResponse.push(label);
      }

      // DID not quite get this one
      // this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

      // Shuffle training data
      this.trainIndices = tf.util.createShuffledIndices(
        CONSTANTS.NUM_TRAIN_ELEMENTS
      );
      this.testIndices = tf.util.createShuffledIndices(
        CONSTANTS.NUM_TEST_ELEMENTS
      );

      // Slice the the images and labels into train and test sets.
      // Understand this slices
      this.trainImages = this.datasetImages.slice(
        0,
        CONSTANTS.IMAGE_SIZE * CONSTANTS.NUM_TRAIN_ELEMENTS
      );
      this.testImages = this.datasetImages.slice(
        CONSTANTS.IMAGE_SIZE * CONSTANTS.NUM_TRAIN_ELEMENTS
      );
      this.trainLabels = this.datasetLabels.slice(
        0,
        CONSTANTS.NUM_CLASSES * CONSTANTS.NUM_TRAIN_ELEMENTS
      );
      this.testLabels = this.datasetLabels.slice(
        CONSTANTS.NUM_CLASSES * CONSTANTS.NUM_TRAIN_ELEMENTS
      );
      console.dir("@TODO: Please dir this to understand wtf we are doing here");
    } catch (ex) {
      //...
      throw new Error(ex);
    }
  }

  nextTrainBatch() {}

  nextTestBatch() {}

  nextBatch() {}
}
