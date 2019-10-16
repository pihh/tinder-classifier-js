import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

// let model;
let locked;
let currentImage;
let images = [];
let imageIndex = 0;

const API = "http://localhost:3000/";

const $image = document.getElementById("image");

function loadManualClassifier() {
  lock();
  // cocoSsd.load().then(_model => {
  //   unlock();
  //   model = _model;
  //
    fetch(`${API}classifier-render`)
      .then(response => response.json())
      .then(data => {
        resetImages(data)
        next();
      });
  // });
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

function evaluate(type = 'like'){
  if (locked) return;
  lock();

  fetch(`${API}classifier-${type}`,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: images[imageIndex]
    })
  }).then(response => response.json())
      .then(data => {
        console.log(data)
      }).catch(ex =>{
        console.warn(ex);
      });
  next();
}
function like() {
  evaluate('like')
}

function dislike() {
  evaluate('dislike')
}

function next() {
  if (images[imageIndex]) {
    imageIndex++;
    var img = new Image();
    img.crossOrigin = "";
    img.onerror = function() {
      next();
    };
    img.onload = function() {
      $image.src = img.src;
      unlock();
    };
    currentImage = `storage/unclassified/${images[imageIndex]}`;
    img.src = API + currentImage;
  } else {
    lock();
    alert("No more storage, will scrape for more and try run again");
    fetch(`${API}scrape`)
      .then(response => response.json())
      .then(() => {
        fetch(`${API}classifier-render`)
          .then(_response => _response.json())
          .then(_data => {
            resetImages(_data);
            next();
          });
      });
  }
}

function resetImages(data){
  images = data.data;
  imageIndex = 0;
}
//

export const ManualClassifier = {
  load: loadManualClassifier,
  like,
  dislike
};
