import * as tf from "@tensorflow/tfjs";
import {State} from "./state";
import {loadImagesToArrayBuffer} from "./data/load-images-to-array-buffer";
import {showExample} from "./data/show-example";
import {showExamples} from "./data/show-examples";


export class Data {
  constructor() {
      this.state = new State();
    this.shuffledTrainIndex = 0;
    this.shuffledTestIndex = 0;
    this.imgResponse = [];
    this.labelsResponse = [];
    this.datasetImages = [];
    this.datasetLabels = [];
    this.trainImages = [];
    this.trainLabels = [];
    this.testImages = [];
    this.testLabels = [];

  }

    async load() {
        try {

            const data = await fetch(`${this.state.API}list-classified-storage`)
            const jsonData = await data.json();
            const positive = jsonData.data.positive.map(el => {
                const obj = {
                    src: 'positive/' + el,
                    label: [1,0]
                }
                return obj;
            })
            const negative = jsonData.data.negative.map(el => {
                const obj = {
                    src: 'negative/' +el,
                    label: [0,1]
                }
                return obj;
            });

            const dataset = positive.concat(negative)

            this.state.NUM_DATASET_ELEMENTS = dataset.length;

            this.datasetLabels = [];
            this.datasetImages = new Float32Array(this.state.NUM_DATASET_ELEMENTS * this.state.IMAGE_SIZE * 4)

            await loadImagesToArrayBuffer(dataset,this, this.state);

            this.trainIndices = tf.util.createShuffledIndices(this.state.NUM_TRAIN_ELEMENTS);
            this.testIndices = tf.util.createShuffledIndices(this.state.NUM_TEST_ELEMENTS);

            this.trainImages =
                this.datasetImages.slice(0, this.state.IMAGE_SIZE * this.state.NUM_TRAIN_ELEMENTS);
            this.testImages = this.datasetImages.slice(this.state.IMAGE_SIZE * this.state.NUM_TRAIN_ELEMENTS);
            this.trainLabels =
                this.datasetLabels.slice(0, this.state.NUM_CLASSES * this.state.NUM_TRAIN_ELEMENTS);
            this.testLabels =
                this.datasetLabels.slice(this.state.NUM_CLASSES * this.state.NUM_TRAIN_ELEMENTS);

        } catch (ex) {
            console.error(ex)
            //...
            throw new Error(ex);
        }
    }



    nextTrainBatch(batchSize) {
        return this.nextBatch(batchSize, 'TRAIN');
    }

    nextTestBatch(batchSize) {
        return this.nextBatch(batchSize, 'TEST');
    }

    nextBatch(batchSize, type = 'TEST') {
        const batchImagesArray = new Float32Array(batchSize * this.state.IMAGE_SIZE);
        const batchLabelsArray = new Uint8Array(batchSize * this.state.NUM_CLASSES);

        let idx = 0;
        let data = [];
        if(type === 'TEST'){
            data = [this.testImages, this.testLabels];
            this.shuffledTestIndex =
                (this.shuffledTestIndex + 1) % this.testIndices.length;
            idx = this.testIndices[this.shuffledTestIndex];
        }else {
            data = [this.trainImages, this.trainLabels];
            this.shuffledTrainIndex =
                (this.shuffledTrainIndex + 1) % this.trainIndices.length;
            idx = this.trainIndices[this.shuffledTrainIndex];
        }

        for (let i = 0; i < batchSize; i++) {

            const image =
                data[0].slice(idx * this.state.IMAGE_SIZE, idx * this.state.IMAGE_SIZE + this.state.IMAGE_SIZE);
            batchImagesArray.set(image, i * this.state.IMAGE_SIZE);

            const label =
                data[1].slice(idx * this.state.NUM_CLASSES, idx * this.state.NUM_CLASSES + this.state.NUM_CLASSES);
            batchLabelsArray.set(label, i * this.state.NUM_CLASSES);
        }

        const xs = tf.tensor2d(batchImagesArray, [batchSize, this.state.IMAGE_SIZE]);
        const labels = tf.tensor2d(batchLabelsArray, [batchSize, this.state.NUM_CLASSES]);

        return {xs, labels};
  }

  async showExamples(howMany = 2){
    // Vai buscar 1 imagem e mete-a no canvas -> easy
    const index = 0;
    const imgStart = index * this.state.IMAGE_SIZE;
    const imgEnd = imgStart + this.state.IMAGE_SIZE * howMany;

    const labelStart = index * this.state.NUM_CLASSES;
    const labelEnd = labelStart + this.state.NUM_CLASSES * howMany;

    const images = this.datasetImages.slice(imgStart,imgEnd);
    const labels = this.datasetLabels.slice(labelStart,labelEnd);

    await showExamples(images,labels)
  }
}


