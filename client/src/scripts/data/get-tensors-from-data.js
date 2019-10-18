import * as tf from '@tensorflow/tfjs';
import {IMAGE_SIZE, IMAGE_H, IMAGE_W, NUM_CLASSES} from '../constants';

export default function getTensorsFromData(
    images = new Float32Array([]),
    labels = new Uint8Array([]),
    imgSize =IMAGE_SIZE,
    imgH = IMAGE_H,
    imgW = IMAGE_W,
    numClasses = NUM_CLASSES){

    const xs = tf.tensor4d(images, [images.length / imgSize, imgH, imgW, 1]);
    labels = tf.tensor2d(labels, [labels.length / numClasses, numClasses]);

    return {xs, labels};
}