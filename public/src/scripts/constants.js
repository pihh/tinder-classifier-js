const IMAGE_WIDTH = 28;
const IMAGE_HEIGHT = 28;
const IMAGE_CHANNELS = 1;
const TRAIN_TEST_RATIO = 5 / 6;

const NUM_CLASSES = 2;
const NUM_DATASET_ELEMENTS = 65000;
const NUM_TRAIN_ELEMENTS = Math.floor(TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS);
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

const CLASS_NAMES = ["like", "dislike"];

export const CONSTANTS = {
  CLASS_NAMES,
  IMAGE_SIZE: IMAGE_WIDTH * IMAGE_HEIGHT, // the size of an image (width and height of 28x28 = 784)
  IMAGE_CHANNELS,
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  NUM_CLASSES, // number of label categories (a number can be 0-9, so there's 10 classes)
  NUM_DATASET_ELEMENTS, //  number of images total (65,000)
  NUM_TRAIN_ELEMENTS, // number of training images (55,000)
  NUM_TEST_ELEMENTS, // number of test images (10,000, aka the remainder)
  TRAIN_TEST_RATIO
};