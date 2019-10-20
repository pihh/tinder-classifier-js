'use strict';

export function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue
        , randomIndex
    ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export function shuffleDataset(dataset){
    const length = dataset.length;
    let indexes = new Array(length).fill(0);
    indexes = shuffle(indexes.map((el,index) => {
        el = index;
        return el;
    }));


    let tmp = [];
    indexes.forEach((index, i) =>{
        tmp[i] = dataset[index];
    })

    return tmp;
}