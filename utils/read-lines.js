const fs = require("fs");

function readLines(path) {
  const array = fs
    .readFileSync(path)
    .toString()
    .split("\n");
  // for (i in array) {
  //   console.log(array[i]);
  // }
  return array;
}

module.exports = readLines;
