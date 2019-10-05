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

// function readLines(file, func) {
//   const input = fs.createReadStream(file);
//   const remaining = '';
//
//   input.on('data', function(data) {
//     remaining += data;
//     const index = remaining.indexOf('\n');
//     while (index > -1) {
//       const line = remaining.substring(0, index);
//       remaining = remaining.substring(index + 1);
//       func(line);
//       index = remaining.indexOf('\n');
//     }
//   });
//
//   input.on('end', function() {
//     if (remaining.length > 0) {
//       func(remaining);
//     }
//   });
// }
//
// function func(data) {
//   console.log('Line: ' + data);
// }
//

// readLines(input, func);

module.exports = readLines;
