import loadAndHandleImage from "./load-and-handle-image";
import {NUM_DATASET_ELEMENTS, IMAGE_SIZE} from '../constants'

export default async function loadImagesToArrayBuffer(
    imagesArray = [],
    numDatasetElements = NUM_DATASET_ELEMENTS ,
    imageSize = IMAGE_SIZE ){

    let images;
    let labels = [];
    let datasetBytesBuffer = new ArrayBuffer(numDatasetElements * imageSize * 4);
    try {
        for (let i = 0; i < imagesArray.length; i++) {
            datasetBytesBuffer = await loadAndHandleImage(imagesArray[i].src, {
                arrayBuffer: datasetBytesBuffer,
                byteOffset: i * imageSize * 4,
                length: imageSize
            });
            labels.push(imagesArray[i].label[0]);
            labels.push(imagesArray[i].label[1]);
        }
        images = new Float32Array(datasetBytesBuffer)
        labels = new Uint8Array(labels);

        return {images,labels}
    }catch(ex){

    }
}