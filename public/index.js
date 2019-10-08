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

    fetch("http://localhost:3000/classifier-render")
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
  fetch("http://localhost:3000/classifier-like")
    .then(response => response.json())
    .then(data => {
      next(data);
    });
}

function dislike() {
  if (locked) return;
  lock();
  fetch("http://localhost:3000/classifier-dislike")
    .then(response => response.json())
    .then(data => {
      next(data);
    });
}

function next(data = {}) {
  if (data.success) {
    var img = new Image();

    img.onerror = function() {
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

    img.src = "http://localhost:3000/images/unclassified/" + data.data;
    $image.src = img.src;
  } else {
    alert("No more images, will scrape for more and try run again");

    fetch("http://localhost:3000/scrape")
      .then(response => response.json())
      .then(() => {
        fetch("http://localhost:3000/classifier-render")
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
  return fetch("http://localhost:3000/crop-image", {
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

// Bind clicks
document.getElementById("like").addEventListener("click", like);
document.getElementById("dislike").addEventListener("click", dislike);
