/*
Similarly, we write a small Person class that takes the API response from Tinder
representing a Person and offers a few basic interfaces to the tinder API.

Let's start with the Person Class. It shall receive API data, a tinder-api
object and save all relevant data into instance variables. It shall
further offer some basic features like "like" or "dislike" that
make a request to the tinder-api, which allows us to
conveniently use "some_person.like()" in order
to like a profile we find interesting.
*/

const GENDERS = ["Any", "Female", "Male"];
const FILE = class Person {
  constructor(data, api) {
    // Add defaults
    data.jobs = data.jobs || [];
    data.schools = data.schools || [];
    data.photos = data.photos || [];

    this._api = api;
    this.id = data._id;
    this.name = data.name;
    this.bio = data.bio;
    this.birth_date = new Date(data.birth_date);
    this.gender = GENDERS[data.gender];

    this.jobs = data.jobs.map(el => {
      return {
        title: el.title,
        name: el.name,
        company: el.company
      };
    });

    this.schools = data.schools.map(el => el.name);
    this.photos = data.photos.map(el => el.url);
  }

  like() {
    return this._api.like(this._id);
  }

  dislike() {
    return this._api.dislike(this._id);
  }

  __repr__() {
    //return f"{self.id}  -  {self.name} ({self.birth_date.strftime('%d.%m.%Y')})"
  }

  download_images() {}
};

module.exports = Person;
