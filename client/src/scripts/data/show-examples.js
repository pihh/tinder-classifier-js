
import {State} from "../state";
import {showExample} from "./show-example";
import {SHOW_IMAGE_TIMEOUT} from "../constants";

export async function showExamples(images,labels,state = new State(), config = {
    canvasId: 'photo'
}){
    console.log('Will show 10 images')

    const IMAGE_SIZE = state.IMAGE_SIZE;
    const LABEL_SIZE = state.NUM_CLASSES;
    const canvas = document.getElementById( config.canvasId || 'photo' );
    const ctx = canvas.getContext('2d');

    const numImages = images.length / IMAGE_SIZE;

    for(let i = 0; i < numImages; i++){
        const startImg = i * IMAGE_SIZE;
        const endImg = startImg + IMAGE_SIZE;
        const startLabel = i * LABEL_SIZE;
        const endLabel = startLabel + LABEL_SIZE;

        const image = images.slice(startImg,endImg);
        const label = labels.slice(startLabel,endLabel)

        const putImage = new Promise(resolve => {
            setTimeout(()=>{
                showExample(image, label);
                resolve();
            }, state.SHOW_IMAGE_TIMEOUT);
        });
        await putImage;
    }

}
