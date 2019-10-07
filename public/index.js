import * as tf from "@tensorflow/tfjs";

let model;
let locked;
let imageHadError;

const $image = document.getElementById("image");
// const ctx = canvas.getContext("2d");
// RUN THIS ON DOCUMENT LOAD
(function() {
  lock();
  cocoSsd.load().then(_model => {
    unlock();
    model = _model;

    fetch("classifier-render")
      .then(response => response.json())
      .then(data => {
        next(data);
      });
  });
})();

function lock() {
  locked = true;
}

function unlock() {
  locked = false;
}

function like() {
  if (locked) return;
  lock();
  fetch("classifier-like")
    .then(response => response.json())
    .then(data => {
      next(data);
    });
}

function dislike() {
  if (locked) return;
  lock();
  fetch("classifier-dislike")
    .then(response => response.json())
    .then(data => {
      next(data);
    });
}

function next(data = {}) {
  if (data.success) {
    var img = new Image();

    img.onerror = function() {
      console.log("error");
      dislike();
    };
    img.onload = function() {
      imageHadError = false;
      model
        .detect(img)
        .then(predictions => {
          console.log("Predictions: ");
          console.log({ predictions });
          cropImageFromPredictions(predictions, data.data);
          unlock();
        })
        .catch(ex => {
          console.warn(ex);
          unlock();
        });
    };

    img.src = "images/unclassified/" + data.data;
    $image.src = img.src;
  } else {
    alert("No more images, will scrape for more and try run again");

    fetch("scrape")
      .then(response => response.json())
      .then(() => {
        fetch("classifier-render")
          .then(_response => _response.json())
          .then(_data => {
            next(_data);
          });
      });
  }
}

function cropImageFromPredictions(predictions, src) {
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i].class.indexOf("person") > -1) {
      cropImageFromPrediction(predictions[i], src)
        .then(success => {
          console.log(success);
        })
        .catch(ex => {
          console.log(ex);
        });
    }
  }
}

function cropImageFromPrediction(prediction, src) {
  return fetch("crop-image", {
    method: "post",
    body: JSON.stringify({
      name: src,
      measures: prediction.bbox
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
}

/*
    renderPredictions = (predictions, ratio = []) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // Font options.
      const font = "16px sans-serif";
      ctx.font = font;
      ctx.textBaseline = "top";
      predictions.forEach(prediction => {
        const x = prediction.bbox[0] / (ratio[0] || 1);
        const y = prediction.bbox[1] / (ratio[1] || 1);
        const width = prediction.bbox[2] / (ratio[0] || 1);
        const height = prediction.bbox[3] / (ratio[1] || 1);
        // Draw the bounding box.
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = "#00FFFF";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      });

      var ct = document.getElementById("measure");
      ct.appendChild(img);
      var wrh = img.width / img.height;
      var newWidth = canvas.width;
      var newHeight = newWidth / wrh;
      if (newHeight > canvas.height) {
        newHeight = canvas.height;
        newWidth = newHeight * wrh;
      }
      ct.removeChild(img);
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      // var hRatio = canvas.width / img.width;
      // var vRatio = canvas.height / img.height;
      // var ratio = Math.min(hRatio, vRatio);
      // var centerShift_x = (canvas.width - img.width * ratio) / 2;
      // var centerShift_y = (canvas.height - img.height * ratio) / 2;
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.drawImage(
      //   img,
      //   0,
      //   0,
      //   img.width,
      //   img.height,
      //   centerShift_x,
      //   centerShift_y,
      //   img.width * ratio,
      //   img.height * ratio
      // );
      setTimeout(() => {
        try {
          model
            .detect(img)
            .then(predictions => {
              console.log("Predictions: ");
              console.log({ predictions });
              // renderPredictions(predictions);
              unlock();
            })
            .catch(ex => {
              console.warn(ex);
              unlock();
            });
        } catch (ex) {
          unlock();
          console.log("model not ready", ex);
        }
      }, 500);
    };

    };
      // predictions.forEach(prediction => {
      //   const x = prediction.bbox[0];
      //   const y = prediction.bbox[1];
      //   // Draw the text last to ensure it's on top.
      //   ctx.fillStyle = "#000000";
      //   ctx.fillText(prediction.class, x, y);
      // });
    };
    */
// bind key press listeners
document.addEventListener("keyup", function(event) {
  if (event.defaultPrevented) {
    return;
  }

  var key = event.key || event.keyCode;
  // console.log({ key });

  switch (key) {
    case "ArrowLeft":
      dislike();
      break;

    case "ArrowRight":
      like();
      break;
  }
});

class Model {
  constructor() {
    // Sequencial model

    this.model = tf.Sequential();
    console.dir("model created");
    console.dir("create layers");
    this.model.add(
      tf.layers.conv2d({
        inputShape: [256, 256, 1], // 256x256 px , greyscale
        kernelSize: 5, // 5x5 px filter window -> vai correndo pela imagem e filtrando
        filters: 8, //
        strides: 1, // How many px this is sliding?
        activation: "relu", // very commonm withimage classification and convultional networkds
        kernelInitializer: "VarianceScaling" //
      })
    );

    this.model.add(
      tf.layers.maxPooling2d({
        poolSize: [2, 2], // sliding window 2x2 pixels
        strides: [2, 2] // need to understand this
      })
    );

    // Second layer
    this.model.add(
      tf.layers.conv2d({
        //inputShape: [256, 256, 1], // 256x256 px , greyscale
        kernelSize: 5, // 5x5 px filter window -> vai correndo pela imagem e filtrando
        filters: 16, //
        strides: 1, // How many px this is sliding?
        activation: "relu", // very commonm withimage classification and convultional networkds
        kernelInitializer: "VarianceScaling" //
      })
    );

    this.model.add(
      tf.layers.maxPooling2d({
        poolSize: [2, 2], // sliding window 2x2 pixels
        strides: [2, 2] // need to understand this
      })
    );

    // Add Flat Layer
    this.model.add(tf.layers.flatten());

    // Dense Layer
    this.model.add(
      tf.layers.dense({
        units: 10,
        kernelInitializer: "VarianceScaling",
        activation: "softmax"
      })
    );
    createLogEntry("Layers created");
  }

  train() {}

  evaluate() {}
}

new Model();
