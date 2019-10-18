export default function loadAndHandleImage(src , config = {
    arrayBuffer: false,
    byteOffset: false,
    length: false
}){
    return new Promise((res,rej) => {
        const img = new Image();
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const imgRequest = new Promise((resolve, reject) => {
            img.crossOrigin = '';
            img.onload = () => {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                if(config.arrayBuffer && config.byteOffset !== false && length){
                    const datasetBytesView = new Float32Array(config.arrayBuffer, config.byteOffset, config.length);
                    for (let j = 0; j < imageData.data.length / 4; j++) {
                        // All channels hold an equal value since the image is grayscale, so
                        // just read the red channel.
                        datasetBytesView[j] = imageData.data[j * 4] / 255;
                    }
                    resolve(config.arrayBuffer)
                }else{
                    resolve(imageData);
                }

            }

            img.onerror = (error) =>{
                rej(error)
                throw error;
            }
        });

        img.src = src;
    })

}