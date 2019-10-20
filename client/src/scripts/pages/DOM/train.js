import {State} from "../../state";

const buttons = ['train','show-examples', 'do-prediction'];
const examplesLog = ['like-probability-container','dislike-probability-container']

export function hideImage(){
    document.getElementById('image').style.display = "none";
}
export function showImage(){
    document.getElementById('image').style.display = "block";
}
export function loaded(){
    const state = new State();
    document.getElementById('number-of-samples-container').style.display ="block"
    document.getElementById('number-of-samples').innerText = state.NUM_DATASET_ELEMENTS;
    unlockButtons();
    showExamplesLog();
    showSuccessImage();
    setStateMessage('All images and labels loaded with success. <br>');
}
export function setStateMessage(message){
    document.getElementById('state').innerHTML = message;
}

export function showLoadingImage(message = ''){
    document.getElementById('image').src = 'public/images/loading.gif';
    setStateMessage(message);
    showImage();
}

export function showSuccessImage(message = ''){
    document.getElementById('image').src = 'public/images/check-mark.gif';
    setStateMessage(message);
    showImage();
}
export function lockButtons(){
    buttons.forEach((button) => {
        document.getElementById(button).classList.add('cursor-not-allowed');
    });
}

export function unlockButtons(){
    buttons.forEach((button) => {
        document.getElementById(button).classList.remove('cursor-not-allowed');
    });
}

export function showExamplesLog(){
    examplesLog.forEach(log => {
        document.getElementById(log).style.display ="block"
    })
}

export function hideExamplesLog(){
    examplesLog.forEach(log => {
        document.getElementById(log).style.display ="none"
    })
}