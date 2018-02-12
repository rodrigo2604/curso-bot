const builder = require('botbuilder');
const iata = require('../services/iata');

const setFlightBillingDialog = bot => (
  bot.dialog('flightBilling', [
    askForOrigin,
    handleOrigin,
  ])
    .triggerAction({
      matches: /^(Quiero ver vuelos)/i
    })
);

function askForOrigin(session) {
  builder.Prompts.text(session, 'De acuerdo, ¿desde qué ciudad vas a salir?')
}

function handleOrigin(session, results, next) {
  iata.getCityCode(results.response)
    .then((city) => {
      session.dialogData.origin = city.code;
      next();
    })
    .catch(err => console.error(err));
}

module.exports = setFlightBillingDialog;
