const axios = require("axios");
const moment = require("moment");
const amadeus_url = "https://api.sandbox.amadeus.com/v1.2/flights";

const Amadeus = {
  searchFlights: async search => {
    const { origin, destination, oneWay, direct } = search;
    const departure_date = setDepartureDate(search);

    let response = await axios
      .get(`${amadeus_url}/inspiration-search?apikey=${process.env.AMADEUS_CONSUMER_KEY}&origin=${origin}&destination=${destination}&departure_date=${departure_date}&one-way=${oneWay}&direct=${direct}`);
    return response.data;
  }
};

function setDepartureDate({ departureDate, arrivalDate }) {
  return !arrivalDate
    ? moment(search.departureDate).format("YYYY-MM-DD")
    : `${moment(departureDate).format("YYYY-MM-DD")}--${moment(arrivalDate).format("YYYY-MM-DD")}`;
}

module.exports = Amadeus;
