class Profile {
  constructor(data, api) {
    this._api = api;
    this.email = data.account.email;
    this.phone_number = data.account.account_phone_number;
    this.age_min = data.user.age_filter_min;
    this.age_max = data.user.age_filter_max;
    this.max_distance = data.user.distance_filter;
    this.gender_filter = data.user.gender_filter;
  }
}

module.exports = Profile;

/*
class Profile(Person):

    def __init__(self, data, api):

        super().__init__(data["user"], api)

        self.email = data["account"].get("email")
        self.phone_number = data["account"].get("account_phone_number")

        self.age_min = data["user"]["age_filter_min"]
        self.age_max = data["user"]["age_filter_max"]

        self.max_distance = data["user"]["distance_filter"]
        self.gender_filter = ["Male", "Female"][data["user"]["gender_filter"]]
 */
