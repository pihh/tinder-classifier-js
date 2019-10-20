import * as tf from '@tensorflow/tfjs';
import {State} from "../state";

export default function getTensorsFromData(
    images = new Float32Array([]),
    labels = new Uint8Array([]),
    state = new State()){

    const IMAGE_SIZE = state.IMAGE_SIZE;
    const IMAGE_H = state.IMAGE_H;
    const IMAGE_W = state.IMAGE_W;
    const NUM_CLASSES = state.NUM_CLASSES

    const xs = tf.tensor4d(images, [images.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
    labels = tf.tensor2d(labels, [labels.length / NUM_CLASSES, NUM_CLASSES]);

    return {xs, labels};
}