const fs = require("fs");

const FOLDERS = [
  "unclassified",
  "classified/positive",
  "classified/negative"
].map(el => `./storage/${el}`);

const _listFolder = function(folder) {
  return fs.readdirSync(folder).filter(el => el != ".gitignore");
};

const negative = function() {
  return _listFolder(FOLDERS[2]);
};

const positive = function() {
  return _listFolder(FOLDERS[1]);
};

const unclassified = function() {
  return _listFolder(FOLDERS[0]).filter(
    el => el.indexOf("like_") == -1 && el.indexOf("dislike_") == -1
  );
};

module.exports = {
  unclassified,
  positive,
  negative
};
