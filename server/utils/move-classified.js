const fs = require("fs");

const UNCLASSIFIED = "./images/unclassified";
const POSITIVE = "./images/classified/positive";
const NEGATIVE = "./images/classified/negative";
const FOLDERS = [POSITIVE, NEGATIVE];

function rename(file, folderIndex) {
  fs.rename(UNCLASSIFIED + file, FOLDERS[folderIndex] + file, function(err) {
    if (err) throw err;
  });
}

function moveClassifiedFile(file) {
  if (file.indexOf("/like_") == 0) {
    rename(file, 0);
  }
  if (file.indexOf("/dislike_") == 0) {
    rename(file, 1);
  }
}

function moveClassifiedFiles() {
  const allFiles = fs.readdirSync(FOLDER);
  allFiles.forEach(file => {
    moveClassifiedFile(file);
  });
}

module.exports = {
  file: moveClassifiedFile,
  files: moveClassifiedFiles
};
