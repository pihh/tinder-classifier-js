const TYPES = ["tinder"];

const TinderApi = require("../services/api");
const Scraper = async (type = "tinder") => {
  try {
    if (0 === TYPES.indexOf(type)) {
      const profile = await TinderApi.profile();
      const matches = await TinderApi.matches();
      const nearby = await TinderApi.nearby_persons();

      for (person of nearby) {
        await person.download_images();
      }

      return {
        profile,
        matches,
        nearby
      };
    }

    throw "Invalid Scraper type";
  } catch (ex) {
    console.warn(ex);
    throw ex
  }
};

module.exports = Scraper;
