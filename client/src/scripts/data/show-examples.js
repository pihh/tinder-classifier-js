import * as tf from '@tensorflow/tfjs'
import {IMAGE_SIZE} from '../constants'

export async function showExamples(images, imgSize = IMAGE_SIZE, config = {
    canvasId: 'photo'
}){
    console.log('Will show 10 images')

    const canvas = document.getElementById( config.canvasId || 'photo' );
    const ctx = canvas.getContext('2d');

    for(let i = 0; i < 10; i++){
        let image = images[i];
        const putImage = new Promise(resolve => {
            setTimeout(()=>{
                console.log('set image !!!', image.map(el => el *250))
                const batchImagesArray = new Float32Array(1 * imgSize);
                batchImagesArray.set(image,0);
                const xs = tf.tensor2d(batchImagesArray, [1, imgSize]);

                const imageTensor = tf.tidy(() => {
                    // Reshape the image to 28x28 px
                    return xs.reshape([28, 28, 1]);
                });


                canvas.width = IMAGE_W;
                canvas.height = IMAGE_H;
                canvas.style = 'margin: 4px;';
                tf.browser.toPixels(imageTensor, canvas);


                // imageTensor.dispose();
                // const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);
                // Get a pointer to the current location in the image.
//                 var palette = ctx.getImageData(0,0,IMAGE_W,IMAGE_H); //x,y,w,h
// // Wrap your array as a Uint8ClampedArray
//                 palette.data.set(new Uint8ClampedArray(image.map(el => el *250))); // assuming values 0..255, RGBA, pre-mult.
// // Repost the data.
//                 ctx.putImageData(palette,0,0);
                resolve();
            }, 1000);
        });
        await putImage;
    }

}
