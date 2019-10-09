import { MnistData } from "./data.js";
import { CONSTANTS } from "./constants";

export class Script {
  constructor() {}

  async showExamples(data) {
    // Create a container in the visor
    const surface = tfvis
      .visor()
      .surface({ name: "Input Data Examples", tab: "Input Data" });

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

  async run() {
    const data = new MnistData();
    await data.load();
    // await this.showExamples(data);

    // const model = this.getModel();
    // tfvis.show.modelSummary({ name: "Model Architecture" }, model);
    //
    // await this.train(model, data);
    // await this.showAccuracy(model, data);
    // await this.showConfusion(model, data);
  }

  async train(model, data) {}

  async showAccuracy(model, data) {}

  async showConfusion(model, data) {}

  getModel() {}
}
