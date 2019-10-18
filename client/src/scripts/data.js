import { CONSTANTS } from "./constants";
import * as tf from "@tensorflow/tfjs";

console.dir("@TODO: get image set meta and update NUM_DATASET_ELEMENTS");
const API = "http://localhost:3000/";
const STORAGE = `${API}storage/classified/`;

let IMAGE_H = 256;
let IMAGE_W = 256;
let IMAGE_SIZE = IMAGE_H * IMAGE_W;
let NUM_CLASSES = 2;
let NUM_DATASET_ELEMENTS = 65000;
let NUM_TRAIN_ELEMENTS = 55000;
let NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

export class Data {
  constructor() {
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

    this.img = new Image();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }
  //
  async getImages() {
    return [];
  }

  loadImage(src, config = {}){
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let image = [];
      return new Promise((res,rej) => {
          img.crossOrigin = '';
          img.onload = () => {
              img.width = img.naturalWidth;
              img.height = img.naturalHeight;
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0, img.width, img.height);

              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              if(!config.pushDataToSet) {
                  for (let j = 0; j < imageData.data.length / 4; j++) {
                      // All channels hold an equal value since the image is grayscale, so
                      // just read the red channel.
                      image.push(imageData.data[j * 4] / 255);
                  }
              }else{
                  let startingIndex = config.pushDataToSet.i * IMAGE_SIZE;
                  for (let j = 0; j < imageData.data.length / 4; j++) {
                      // All channels hold an equal value since the image is grayscale, so
                      // just read the red channel.
                      // this.datasetImages.push(imageData.data[j * 4] / 255);
                      this.datasetImages[startingIndex + j] = imageData.data[j * 4] / 255
                  }
              }
              res(image);
          }
          img.src = STORAGE + src
      });
  }
  async load() {
    try {
      const data = await fetch(`${API}list-classified-storage`)
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

      NUM_DATASET_ELEMENTS = dataset.length;
      NUM_TRAIN_ELEMENTS = Math.floor(NUM_DATASET_ELEMENTS * 4 / 5);
      NUM_TEST_ELEMENTS = Math.floor(NUM_DATASET_ELEMENTS / 5);

      this.datasetLabels = new Uint8Array(NUM_DATASET_ELEMENTS * NUM_CLASSES);
      this.datasetImages = new Float32Array(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4)


      for(let i = 0 ; i < dataset.length; i++){
        // SINGLE IMAGE, NO CHUNKS

        const d = dataset[i];
            await this.loadImage(dataset[i].src,{
                pushDataToSet: {
                    i
                }
            });
          this.datasetLabels[i*NUM_CLASSES] = d.label[0];
          this.datasetLabels[i*NUM_CLASSES+1] = d.label[1]
      }



        this.trainImages =
            this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
        this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
        this.trainLabels =
            this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
        this.testLabels =
            this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);

    } catch (ex) {
      //...
      throw new Error(ex);
    }
  }

  getTrainData(){

  }

  getTestData(size) {

  }

  async showImages(batchSize = 2) {
      debugger
      const canvas = document.getElementById( "photo" );
      const ctx = canvas.getContext('2d');
      const image =
          this.datasetImages.slice(0, IMAGE_SIZE);
      const batchImagesArray = new Float32Array(1 * IMAGE_SIZE);
      const xs = tf.tensor2d(batchImagesArray, [1, IMAGE_SIZE]);
      const imageTensor = tf.tidy(() => {
          // Reshape the image to 28x28 px
          return xs.reshape([IMAGE_H, IMAGE_W, 1]);
      });


      canvas.width = IMAGE_W;
      canvas.height = IMAGE_H;
      canvas.style = 'margin: 4px;';
      tf.browser.toPixels(imageTensor, canvas);

      //
      // imageTensor.dispose();

      /*
      const batchImagesArray = new Float32Array(1 * IMAGE_SIZE);
      const batchLabelsArray = new Uint8Array(1 * NUM_CLASSES);

      for (let i = 0; i < batchSize; i++) {


          const image =
              this.datasetImages.slice(i * IMAGE_SIZE, i * IMAGE_SIZE + IMAGE_SIZE);
          batchImagesArray.set(image, IMAGE_SIZE);

          const label =
              this.datasetLabels.slice(i * NUM_CLASSES, i * NUM_CLASSES + NUM_CLASSES);
          batchLabelsArray.set(label, NUM_CLASSES);

          const xs = tf.tensor2d(batchImagesArray, [1, IMAGE_SIZE]);
          const labels = tf.tensor2d(batchLabelsArray, [1, NUM_CLASSES]);

          console.log({xs,labels})
          const putImage = new Promise(resolve => {
              setTimeout(()=>{



                  const imageTensor = tf.tidy(() => {
                      // Reshape the image to 28x28 px
                      return xs.reshape([IMAGE_H, IMAGE_W, 1]);
                  });


                  canvas.width = IMAGE_W;
                  canvas.height = IMAGE_H;
                  canvas.style = 'margin: 4px;';
                  tf.browser.toPixels(imageTensor, canvas);


                  imageTensor.dispose();

                  resolve();
              }, 1000);
          });
          await putImage;
      }



      console.log({xs, labels})

    */


  }



}
