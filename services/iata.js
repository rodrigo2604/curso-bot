const axios = require('axios');
const iata_url = 'https://aviation-edge.com/api/public';

const Iata = {
  getCityCode: async (name) => {
    let response = await axios.get(`${iata_url}/autocomplete?key=${process.env.IATA_KEY}&query=${name}`);
    return response.data.cities[0];
  }
}

module.exports = Iata;
