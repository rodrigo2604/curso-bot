const builder = require('botbuilder');
const { pizzaSizes } = require('../data');

const setRecoger = (bot) => {
  bot.dialog('recoger', [
    startRecoger,
    handleSize,
    askForIngredients,
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
    session.send(`De acuerdo, será una pizza ${size.description}`);
  }
}

function askForIngredients(session, results, next){
  
}
