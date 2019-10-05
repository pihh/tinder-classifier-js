/*

// Links :
// https://medium.com/@joel.barmettler/train-an-ai-to-swipe-tinder-for-you-bc226df8709d
// https://www.youtube.com/watch?v=ogzNx_TgmFU&list=PL2Rze1Dshha3tK21ky-wXdntH9rBwnWaO&index=5

const linearRegression = require("ml-regression").SLR;
const inputs = [80, 60, 10, 20, 30];
const outputs = [20, 40, 30, 50, 60];

let regression = new linearRegression(inputs, outputs);

console.log({
  linearRegression: {
    regression,
    predict: regression.predict(80)
  }
});
*/

const token = "04d180b2-9c59-4f9f-adae-49300994aac0";

const Api = require("./objects/api");

const TinderApi = new Api(token);

const run = async () => {
  try {
    const profile = await TinderApi.profile();
    const matches = await TinderApi.matches();
    const nearby = await TinderApi.nearby_persons();

    await nearby[0].download_images();
    // console.log({
    //   success: true,
    //   profile,
    //   matches,
    //   nearby
    // });

    return Promise.resolve({
      profile,
      matches,
      nearby
    });
  } catch (ex) {
    console.warn(ex);
    return promise.reject(ex);
  }
};

run();
