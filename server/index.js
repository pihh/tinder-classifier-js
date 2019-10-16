/*

// Links :
// https://medium.com/@joel.barmettler/train-an-ai-to-swipe-tinder-for-you-bc226df8709d
//

// Linear Regression Find if a set of predicted variables does a good job predicting output
// Logistic Regression Yes or no
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

const token = "a6a3ec60-22e1-4367-8436-d2c6f8b1b145";

const TinderApi = require("./services/api").setToken(token);
const TinderClassifier = require("./services/classifier");
const App = require("./server");

App.run();



