import loadAndHandleImage from "./load-and-handle-image";
import {NUM_DATASET_ELEMENTS, IMAGE_SIZE} from '../constants'

export default async function loadImagesToArrayBuffer(
    imagesArray = [],
    numDatasetElements = NUM_DATASET_ELEMENTS ,
    imageSize =IMAGE_SIZE ){

    let datasetBytesBuffer = new ArrayBuffer(numDatasetElements * imageSize * 4);
    try {
        for (let i = 0; i < imagesArray.length; i++) {
            datasetBytesBuffer = await loadAndHandleImage(imagesArray[i], {
                arrayBuffer: datasetBytesBuffer,
                byteOffset: i * imageSize * 4,
                length: imageSize
            });
        }
        datasetBytesBuffer = new Float32Array(datasetBytesBuffer)
    }catch(ex){

    }
}