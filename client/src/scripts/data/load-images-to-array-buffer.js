import loadAndHandleImage from "./load-and-handle-image";
import {State} from "../state";

export async function loadImagesToArrayBuffer(
    imagesArray = [],
    instance,
    state = new State()){

    const IMAGE_SIZE = state.IMAGE_SIZE;
    const NUM_DATASET_ELEMENTS = state.NUM_DATASET_ELEMENTS;

    let datasetBytesBuffer = new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

    if(!instance) instance = {datasetLabels: [], datasetImages: null}
    
    try {
        for (let i = 0; i < imagesArray.length; i++) {
            datasetBytesBuffer = await loadAndHandleImage(imagesArray[i].src, {
                arrayBuffer: datasetBytesBuffer,
                byteOffset: i * IMAGE_SIZE * 4,
                length: IMAGE_SIZE
            });
            instance.datasetLabels.push(imagesArray[i].label[0]);
            instance.datasetLabels.push(imagesArray[i].label[1]);
        }
        instance.datasetImages = new Float32Array(datasetBytesBuffer)
        instance.datasetLabels = new Uint8Array(instance.datasetLabels);

        return instance;
    }catch(ex){
        console.error(ex)
        throw ex;
    }
}