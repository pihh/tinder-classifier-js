import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs";
import { Data } from "../data";
import {State} from "../state";
import {loaded, hideImage, showLoadingImage, hideExamplesLog, showSuccessImage} from "./DOM/train";

const state = new State();
const data = new Data();
const model = tf.sequential();

async function showExamples() {
  setTimeout(hideImage, state.SHOW_IMAGE_TIMEOUT);
  data.showExamples(10)
}

async function run() {
  try {
    await data.load();
    loaded();
    console.log(data, tf)
  }catch(ex){
    alert('There was some error loading the data. Please check your internet connection and try again later');
  }
}

async function showExamplesAtTf() {
  const _state = new State();
  // Create a container in the visor
  const surface =
      tfvis.visor().surface({ name: 'Input Data Examples', tab: 'Input Data'});

  // Get the examples
  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];

  // Create a canvas element to render each example
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      // Reshape the image to 28x28 px
      return examples.xs
          .slice([i, 0], [1, examples.xs.shape[1]])
          .reshape([_state.IMAGE_WIDTH, _state.IMAGE_HEIGHT, 1]);
    });

    const canvas = document.createElement('canvas');
    canvas.width = _state.IMAGE_WIDTH;
    canvas.height = _state.IMAGE_HEIGHT;

    await tf.browser.toPixels(imageTensor, canvas);
    surface.drawArea.appendChild(canvas);

    imageTensor.dispose();
  }
}

async function trainModel() {
  showLoadingImage('Training Model');
  hideExamplesLog();
  const t0 = performance.now();
  getModel();

  await showExamplesAtTf();
  tfvis.show.modelSummary({name: 'Model Architecture'}, model);


  const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
  const container = {
    name: 'Model Training', styles: { height: '1000px' }
  };
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

  const BATCH_SIZE = 1;
  const TRAIN_DATA_SIZE = state.NUM_TRAIN_ELEMENTS;
  const TEST_DATA_SIZE = state.NUM_TRAIN_ELEMENTS;

  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
      return [
        d.xs.reshape([TRAIN_DATA_SIZE, state.IMAGE_WIDTH, state.IMAGE_HEIGHT, 1]),
        d.labels
      ];
    });

  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [
      d.xs.reshape([TEST_DATA_SIZE, state.IMAGE_WIDTH, state.IMAGE_HEIGHT, 1]),
      d.labels
    ];
  });

  await model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: 1,
    shuffle: true,
    callbacks: fitCallbacks
  });

  await showAccuracy();
  await showConfusion();
  const t1 = performance.now();
  showSuccessImage('Training done in: ', t1 - t0 , ' ms.')

}

function getModel() {

  const IMAGE_WIDTH = state.IMAGE_WIDTH;
  const IMAGE_HEIGHT = state.IMAGE_HEIGHT;
  const IMAGE_CHANNELS = 1;
  const NUM_OUTPUT_CLASSES = state.NUM_CLASSES;
  const optimizer = tf.train.adam();

  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({
    units: NUM_OUTPUT_CLASSES,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

function doPrediction(many, showAll = false) {
  const testDataSize = many || new State().NUM_TEST_ELEMENTS;
  const IMAGE_WIDTH = state.IMAGE_WIDTH;
  const IMAGE_HEIGHT = state.IMAGE_WIDTH;
  const testData = data.nextTestBatch(testDataSize);
  const testxs = testData.xs.reshape([testDataSize, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
  const labels = testData.labels.argMax([-1]);
  const preds = model.predict(testxs).argMax([-1]);

  testxs.dispose();
  return (showAll) ? [preds, labels, testData, data]: [preds, labels];
}

async function showAccuracy() {
  const [preds, labels] = doPrediction();
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = {name: 'Accuracy', tab: 'Evaluation'};
  tfvis.show.perClassAccuracy(container, classAccuracy, state.CLASS_NAMES);

  labels.dispose();
}

async function showConfusion() {
  const [preds, labels] = doPrediction();
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = {name: 'Confusion Matrix', tab: 'Evaluation'};
  tfvis.render.confusionMatrix(
      container, {values: confusionMatrix}, state.CLASS_NAMES);

  labels.dispose();
}

export const Train = {
  run,
  showExamples,
  trainModel,
  doPrediction: function(){
    console.log(doPrediction(1, true));
  }
};
