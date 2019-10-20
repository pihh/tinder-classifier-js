import {State} from "../state";
import * as tf from "@tensorflow/tfjs";
import {IMAGE_WIDTH} from "../constants";

export async function showExample(image,label, state = new State(), config = {
    canvasId: 'photo',
    likeId: 'like-probability',
    dislikeId: 'dislike-probability',
    fitCanvasWidth: false
}){
    const IMAGE_SIZE = state.IMAGE_SIZE;
    const LABEL_SIZE = state.NUM_CLASSES;
    const LABEL_NAMES = state.CLASS_NAMES;

    const canvas = document.getElementById( config.canvasId || 'photo' );
    const like = document.getElementById( config.likeId || 'like-probability' );
    const dislike = document.getElementById( config.dislikeId || 'dislike-probability' );
    const ctx = canvas.getContext('2d');

    const batchImagesArray = new Float32Array(1 * IMAGE_SIZE);
    batchImagesArray.set(image,0);
    const xs = tf.tensor2d(batchImagesArray, [1, IMAGE_SIZE]);

    const imageTensor = tf.tidy(() => {
        // Reshape the image to 28x28 px
        // let newShape = [state.IMAGE_WIDTH, state.IMAGE_HEIGHT, 1];
        let newShape = [state.IMAGE_WIDTH, state.IMAGE_HEIGHT, 1];
        return xs.reshape(newShape);
    });

    canvas.width = state.IMAGE_W;
    canvas.height = state.IMAGE_H;

    like.innerHTML = label[0] * 100;
    dislike.innerHTML = label[1] * 100;
    await tf.browser.toPixels(imageTensor, canvas);


}