import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

let model;
let locked;
let imageHadError;

const API = "http://localhost:3000/";

const $image = document.getElementById("image");

function loadManualClassifier() {
  lock();
  cocoSsd.load().then(_model => {
    unlock();
    model = _model;

    fetch(`${API}classifier-render`)
      .then(response => response.json())
      .then(data => {
        next(data);
      });
  });
  // bind key press listeners
  document.addEventListener("keyup", function(event) {
    if (event.defaultPrevented) {
      return;
    }
    const key = event.key || event.keyCode;
    switch (key) {
      case "ArrowLeft":
        dislike();
        break;
      case "ArrowRight":
        like();
        break;
    }
  });
  // Bind clicks
  document.getElementById("like").addEventListener("click", like);
  document.getElementById("dislike").addEventListener("click", dislike);
}

function lock() {
  // https://cdn.dribbble.com/users/63485/screenshots/4388983/liquid-preloader_dribbble_v2.gif
  if (locked) return;
  $image.src = "public/images/loading.gif";
  locked = true;
}

function unlock() {
  locked = false;
}

function like() {
  if (locked) return;
  lock();
  fetch(`${API}classifier-like`)
    .then(response => response.json())
    .then(data => {
      next(data);
    });
}

function dislike() {
  if (locked) return;
  lock();
  fetch(`${API}classifier-dislike`)
    .then(response => response.json())
    .then(data => {
      next(data);
    });
}

function next(data = {}) {
  if (data.success) {
    var img = new Image();
    img.crossOrigin = "";
    img.onerror = function() {
      dislike();
    };
    img.onload = function() {
      $image.src = img.src;
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

    img.src = `${API}storage/unclassified/` + data.data;
  } else {
    alert("No more storage, will scrape for more and try run again");

    fetch(`${API}scrape`)
      .then(response => response.json())
      .then(() => {
        fetch(`${API}classifier-render`)
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
  return fetch(`${API}crop-image`, {
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

export const ManualClassifier = {
  load: loadManualClassifier,
  like,
  dislike
};
