import * as tfvis from "@tensorflow/tfjs-vis";
import { Data } from "../data";
import {State} from "../state";

const state = new State();
const data = new Data();


async function showExamples() {
  setTimeout(removeImage, state.SHOW_IMAGE_TIMEOUT);
  data.showExamples()
  // Create a container in the visor
  // const surface = tfvis
  //   .visor()
  //   .surface({ name: "Input Data Examples", tab: "Input Data" });

  // Get the examples
  // const examples = data.nextTestBatch(20);
  // const numExamples = examples.xs.shape[0];

  // Create a canvas element to render each example
  // for (let i = 0; i < numExamples; i++) {
  //   const imageTensor = tf.tidy(() => {
  //     // Reshape the image to 28x28 px
  //     return examples.xs
  //       .slice([i, 0], [1, examples.xs.shape[1]])
  //       .reshape([28, 28, 1]);
  //   });
  //
  //   const canvas = document.createElement("canvas");
  //   canvas.width = 28;
  //   canvas.height = 28;
  //   canvas.style = "margin: 4px;";
  //   await tf.browser.toPixels(imageTensor, canvas);
  //   surface.drawArea.appendChild(canvas);
  //
  //   imageTensor.dispose();
  // }
}

function removeImage(){
  const el = document.getElementById('image');
  el.parentNode.removeChild(el);
}
function loaded(){
  try {
    document.getElementById('image').src = 'public/images/check-mark.gif';
    document.getElementById('like-percentage-container').style.display = "block";
    document.getElementById('dislike-percentage-container').style.display = "block";
    document.getElementById('number-of-samples-container').style.display = "block";
    document.getElementById('number-of-samples').innerText = state.NUM_DATASET_ELEMENTS;
    document.getElementById('train').classList.remove('cursor-not-allowed');
    document.getElementById('show-examples').classList.remove('cursor-not-allowed');
    setStateMessage('All images and labels loaded with success');
  }catch(ex){
    // ... Silence is golden
  }
}

function setStateMessage(message){
  try{
    const el = document.getElementById('state');
    el.innerHtml = message;
  }catch(ex){
    // ... Silence is golden
  }
}

async function run() {
  try {
    await data.load();
    loaded();
  }catch(ex){
    alert('There was some error loading the data. Please check your internet connection and try again later');
  }
}

async function train(model, data) {}

async function showAccuracy(model, data) {}

async function showConfusion(model, data) {}

function getModel() {}

export const Train = {
  run,
  showExamples
};
