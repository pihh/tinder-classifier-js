const fs = require('fs');

const FOLDERS = ['unclassified', 'classified/positive', 'classified/negative'].map(el => `./images/${el}`);

const _listFolder(folder){
  return fs.readdirSync(folder).filter(el =>el != ".gitignore")
}

const negative(){
  return _listFolder(FOLDERS[2])
}

const positive(){
  return _listFolder(FOLDERS[1]);
}

const unclassifiedImages (){
  return _listFolder(FOLDERS[0]).filter(
      el =>
        el.indexOf("like_") == -1 &&
        el.indexOf("dislike_") == -1 &&
    );
}

module.exports = {
  unclassifiedImages,
  positive,
  negative
}
