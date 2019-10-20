import {API, CONSTANTS} from "./constants";

let instance;
export class State{
    constructor(){
        if(instance) return instance;
        Object.assign(this,CONSTANTS)
        instance = this;
    }

    get IMAGE_SIZE(){
        return this.IMAGE_HEIGHT * this.IMAGE_HEIGHT;
    }

    set IMAGE_SIZE(value){
        return this.IMAGE_SIZE;
    }

    get NUM_CLASSES() {
        return this.CLASS_NAMES.length;
    }

    set NUM_CLASSES(value){
        return value;
    }

    get NUM_TRAIN_ELEMENTS() {
        return Math.floor(this.TRAIN_TEST_RATIO * this.NUM_DATASET_ELEMENTS);
    }

    set NUM_TRAIN_ELEMENTS(value){
        return value;
    }

    get NUM_TEST_ELEMENTS () {
        return this.NUM_DATASET_ELEMENTS - this.NUM_TRAIN_ELEMENTS;
    }

    set NUM_TEST_ELEMENTS(value){
        return value
    }

    get STORAGE(){
        return `${this.API}storage/classified/`;
    }

    set STORAGE(value){
        return value
    }
}