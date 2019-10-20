export const IMAGE_WIDTH = 256; // 28
export const IMAGE_HEIGHT = 256;// 28
export const IMAGE_CHANNELS = 1;
export const IMAGE_SIZE = IMAGE_WIDTH * IMAGE_HEIGHT;
export const TRAIN_TEST_RATIO = 5 / 6;

export const CLASS_NAMES = ["like", "dislike"];

export const NUM_CLASSES = CLASS_NAMES.length;
export const NUM_DATASET_ELEMENTS = 65000;
export const NUM_TRAIN_ELEMENTS = Math.floor(TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS);
export const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;
export const SHOW_IMAGE_TIMEOUT = 2000;

export const API = "http://localhost:3000/";
export const STORAGE = `${API}storage/classified/`;

export const CONSTANTS = {
  CLASS_NAMES,
  IMAGE_SIZE,// the size of an image (width and height of 28x28 = 784)
  IMAGE_CHANNELS,
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  NUM_CLASSES, // number of label categories (a number can be 0-9, so there's 10 classes)
  NUM_DATASET_ELEMENTS, //  number of storage total (65,000)
  NUM_TRAIN_ELEMENTS, // number of training storage (55,000)
  NUM_TEST_ELEMENTS, // number of test storage (10,000, aka the remainder)
  TRAIN_TEST_RATIO,
  API,
  STORAGE,
  SHOW_IMAGE_TIMEOUT
};

