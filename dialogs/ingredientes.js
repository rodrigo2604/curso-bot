const builder = require('botbuilder');
const { ingredients } = require('../data');

const setIngredientes = (bot) => {
  bot.dialog('ingredientes', [
    startIngredientes,
    handleIngredient,
    confirmIngredients,
  ])
    .beginDialogAction('mostrarIngredientes', 'mostrarIngredientes', {
      matches: /^mostrar ingredientes$/i,
    });

  bot.dialog('mostrarIngredientes', [
    session => {
      if (session.conversationData.ingredientes) {
        session.endDialog(`Ha pedido: ${session.conversationData.ingredientes.join()}`);
      }
    }
  ]);
}

module.exports = setIngredientes;

// =====================================Waterfall functions==============================================

function startIngredientes(session, results, next) {
  session.conversationData.ingredients = results && results.chosenIngredients ? results.chosenIngredients : [];
  builder.Prompts.choice(session, `Dime qué ingredientes deseas:`, ingredients);
}

function handleIngredient(session, results, next) {
  let chosenIngredients = session.dialogData.ingredients;

  if (results.response && results.response.index !== 0) {
    const ingredient = results.response.entity;

    chosenIngredients = [...chosenIngredients, ingredient];
    session.send(`Añadimos ${ingredient}`);
    session.replaceDialog('ingredientes', { chosenIngredients });
  } else {
    builder.Prompts.confirm(session, `Has pedido ${chosenIngredients.join()}, ¿es correcto?`);
  }
}

function confirmIngredients(session, results, next) {
  if (results.response) {
    session.endDialogWithResult({ chosenIngredients: session.dialogData.ingredients });
  } else {
    session.replaceDialog('ingredientes');
  }
}
