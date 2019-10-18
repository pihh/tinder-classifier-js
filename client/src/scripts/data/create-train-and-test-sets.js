import {NUM_DATASET_ELEMENTS, IMAGE_SIZE , NUM_TRAIN_ELEMENTS, NUM_TEST_ELEMENTS, NUM_CLASSES} from "../constants";

export function createTrainAndTestSets(
    images = [],
    labels = [],
    numDatasetElements = NUM_DATASET_ELEMENTS ,
    numTrainElements = NUM_TRAIN_ELEMENTS,
    numTestElements = NUM_TEST_ELEMENTS,
    imageSize = IMAGE_SIZE,
    numClasses = NUM_CLASSES
    ){

    return {
        train: {
            images: images.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS),
            labels: labels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS),
        },
        test:{
            images: images.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS),
            labels: labels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS),
        },
    }
}