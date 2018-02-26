const builder = require('botbuilder');
const moment = require('moment');
const {
  pizzaSizes,
} = require('../data');

const setRecoger = (bot) => {
  bot.dialog('recoger', [
    startRecoger,
    handleSize,
    handleIngredients,
    askForTime,
    handleTime,
    confirmOrder,
    endRecoger,
  ]);
}

module.exports = setRecoger;

// =====================================Waterfall functions==============================================

function startRecoger(session, results, next) {
  session.send('¡De acuerdo!, vamos a recoger los detalles de tu pedido. En primer lugar, ');
  builder.Prompts.choice(session, '¿De qué tamaño deseas tu pizza?', pizzaSizes);
}

function handleSize(session, results, next) {
  if (results.response) {
    const size = pizzaSizes[results.response.entity];
    session.dialogData.size = size;
    session.send(`De acuerdo, será una pizza ${size.description}`);
    session.beginDialog('ingredientes');
  }
}

function handleIngredients(session, results, next) {
  if (results.chosenIngredients) {
    session.dialogData.ingredients = results.chosenIngredients;
    session.dialogData.price = '7,95€';
  } else {
    session.dialogData.ingredients = 'Sin ingredientes';
    session.dialogData.price = '4,95€';
  }

  next();
}

function askForTime(session, results, next) {
  builder.Prompts.time(session, '¿A qué hora desea recogerlo?');
}

function handleTime(session, results, next) {
  if (results.response) {
    const timeResponse = builder.EntityRecognizer.resolveTime([results.response]);
    session.dialogData.time = moment(timeResponse).format('LT');
  } else {
    session.dialogData.time = 'en media hora';
  }

  next();
}

function confirmOrder(session, results, next) {
  const msg = `
    Este es el resumen de tu pedido:
      - Pizza ${session.dialogData.size.description}
      - Ingredientes: ${session.dialogData.ingredients.join()}
      - Hora de entrega: ${ session.dialogData.time}
      - Precio: ${session.dialogData.price}
    ¿Es correcto?
    `;

  builder.Prompts.confirm(session, msg);
}

function endRecoger(session, results, next) {
  if (results.response) {
    session.endDialog(`¡Gracias!, puede venir a recoger su pedido: ${session.dialogData.time}`);
  } else {
    session.send('De acuerdo, en ese caso comnecemos de nuevo');
    session.replaceDialog('recoger');
  }
}
