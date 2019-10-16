var request = require('request');
var sharp = require('sharp');
var smartcrop = require('smartcrop-sharp');
var CONSTANTS = require('../constants')

function cropImage(src, dest, width = CONSTANTS.IMAGE.LENGTH, height= CONSTANTS.IMAGE.LENGTH) {
    console.log('Will crop image with arguments: ', [...arguments] )
    return new Promise((res,rej) =>{
        request(src, { encoding: null }, function process(error, response, body) {
            if (error) rej(error);
            smartcrop.crop(body, { width: width, height: height }).then(function(result) {
                var crop = result.topCrop;
                sharp(body)
                    .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
                    .resize(width, height)
                    .toFile(dest, (err, info) => {
                        if(err) rej(err);
                        res(info)
                    });
            });
        });
    })

}

// var src = 'https://raw.githubusercontent.com/jwagner/smartcrop-gm/master/test/flower.jpg';
// applySmartCrop(src, 'flower-square.jpg', 128, 128);

module.exports = cropImage;