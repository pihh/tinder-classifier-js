const LABELS = ["like", "dislike"];

export function Image(src) {
  let label;

  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const imgRequest = new Promise((resolve, reject) => {
    img.crossOrigin = "";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      resolve({ img: tf.browser.fromPixels(canvas), label: this.getLabel() });
    };

    img.src = src;
  });

  const getLabel = src => {
    label = src.indexOf("like_") > -1 ? LABELS[0] : LABELS[1];
    return label;
  };

  return {
    load: imgRequest
  };
}
