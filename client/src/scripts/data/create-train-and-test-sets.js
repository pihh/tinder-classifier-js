import {State} from "../state";

export function createTrainAndTestSets(
    images = [],
    labels = [],
    state = new State()
    ){

    const NUM_DATASET_ELEMENTS = state.NUM_DATASET_ELEMENTS;
    const IMAGE_SIZE = state.IMAGE_SIZE;
    const NUM_TRAIN_ELEMENTS = state.NUM_TRAIN_ELEMENTS;
    const NUM_TEST_ELEMENTS = state.NUM_TEST_ELEMENTS;
    const NUM_CLASSES = state.NUM_CLASSES;

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