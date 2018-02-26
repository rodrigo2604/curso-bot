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
  ])
    .reloadAction('empezarDeNuevo', 'De acuerdo, empecemos de nuevo.', {
      matches: /^empezar de nuevo$/i,
    })
    .cancelAction('cancelAction', 'Está bien, cancelamos el pedido', {
      matches: /^cancelar$|^ya no quiero$/i,
      confirmPrompt: '¿Está seguro de que desea cancelar el pedido?'
    })
    .beginDialogAction('mostrarEstado', 'mostrarEstado', {
      matches: /^mostrar pedido$/i,
    });

  bot.dialog('mostrarEstado', [
    session => session.endDialog(getOrderState(session.conversationData)),
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
    session.conversationData.size = size;
    session.send(`De acuerdo, será una pizza ${size.description}`);
    session.beginDialog('ingredientes');
  }
}

function handleIngredients(session, results, next) {
  if (results.chosenIngredients) {
    session.conversationData.ingredients = results.chosenIngredients;
    session.conversationData.price = '7,95€';
  } else {
    session.conversationData.price = '4,95€';
  }

  next();
}

function askForTime(session, results, next) {
  builder.Prompts.time(session, '¿A qué hora desea recogerlo?');
}

function handleTime(session, results, next) {
  if (results.response) {
    const timeResponse = builder.EntityRecognizer.resolveTime([results.response]);
    session.conversationData.time = moment(timeResponse).format('LT');
  } else {
    session.conversationData.time = 'en media hora';
  }

  next();
}

function confirmOrder(session, results, next) {
  const msg = setOrderState(session.conversationData);
  builder.Prompts.confirm(session, msg);
}

function endRecoger(session, results, next) {
  if (results.response) {
    session.endDialog(`¡Gracias!, puede venir a recoger su pedido: ${session.conversationData.time}`);
  } else {
    session.send('De acuerdo, en ese caso comnecemos de nuevo');
    session.replaceDialog('recoger');
  }
}

// =====================================Aux functions==============================================

function getOrderState({ size, ingredients, time, price }) {
  return `
  Este es el resumen de tu pedido:
    - Pizza ${size ? size.description : 'N/D'}
    - Ingredientes: ${ingredients ? ingredients.join() : 'N/D'}
    - Hora de entrega: ${time || ''}
    - Precio: ${price || 'N/D'}
  `;
}
