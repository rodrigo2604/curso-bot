const builder = require('botbuilder');
const iata = require('../services/iata');
const amadeus = require('../services/amadeus');

const setFlightBillingDialog = bot => (
  bot.dialog('flightBilling', [
    askForOrigin,
    askForDestination,
    askForTypeOfTravel,
    askForDepartureDate,
    handleFlightDates,
    askForDirectFlight,
    doBilling,
  ])
    .triggerAction({
      matches: /^(Quiero ver vuelos)/i
    })
);

function askForOrigin(session) {
  builder.Prompts.text(session, 'De acuerdo, ¿desde qué ciudad vas a salir?')
}

function askForDestination(session, results, next) {
  iata.getCityCode(results.response)
    .then((city) => {
      session.dialogData.origin = city.code;
      builder.Prompts.text(session, 'Estupendo, ¿y a dónde vas?');
    })
    .catch(err => console.error(err));
}

function askForTypeOfTravel(session, results, next) {
  iata.getCityCode(results.response)
    .then((city) => {
      session.dialogData.destination = city.code;
      builder.Prompts.choice(session, 'Ahora dime, ¿el viaje es de ida y vuelta?', ['Ida/vuelta', 'Ida']);
    })
    .catch(err => console.error(err));
}

function askForDepartureDate(session, results, next) {
  session.dialogData.oneWay = results.response.index === 1
  session.send('Estupendo, sigamos...');
  builder.Prompts.time(session, '¿Qué día quieres volar?');
}

function handleFlightDates(session, results, next) {
  if (results.response) {
    session.dialogData.departureDate = builder.EntityRecognizer.resolveTime([results.response]);
  }

  !session.dialogData.oneWay ? builder.Prompts.time(session, '¿Qué día quieres regresar?') : next();
}

function askForDirectFlight(session, results, next) {
  if (results.response) {
    session.dialogData.arrivalDate = builder.EntityRecognizer.resolveTime([results.response]);
  }

  builder.Prompts.choice(session, '¿Deseas vuelos directos?', ['Sí', 'No']);

}

// TODO: Enviar mensaje de confirmación con todo el resumen

function doBilling(session, results, next) {
  session.dialogData.direct = results.response.index === 0;

  amadeus.searchFlights(session.dialogData)
    .then(result => session.send(`Tu viaje te sale ${result.price}${result.currency}`).endDialog())
    .catch(err => session.send('Lo sentimos, ha ocurrido un error en el sistema :( ').endDialog());
}

module.exports = setFlightBillingDialog;
