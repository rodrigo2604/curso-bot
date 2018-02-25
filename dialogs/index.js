
const builder = require('botbuilder');

class AppConversation {
  constructor(bot) {
    this.initRootDialog(bot);
  }

  initRootDialog(bot) {

    bot.dialog('/', [
      init,
      handleOrderType,
      askForElse,
      endChat,
    ]);
  }

  initDialogs(bot) {
    require('./recoger')(bot);
  }
}

module.exports = AppConversation;

// =====================================Root Waterfall functions==============================================
function init(session, args, next) {
  const msg = new builder.Message(session);

  msg.attachments([
    new builder.HeroCard(session)
      .title("Bienvenido a Pizza Bot")
      .subtitle('¿Cómo desea realizar el pedido?')
      .images([builder.CardImage.create(session, 'http://pizzagoodys.com/wp-content/uploads/2017/05/Pizza-icon.png')])
      .buttons([
        builder.CardAction.imBack(session, "local", "Para comer en local"),
        builder.CardAction.imBack(session, "recoger", "Para recoger"),
        builder.CardAction.imBack(session, "datos", "Que me lo traigan"),
      ])
  ]);

  if (args && args.noOption) {
    session.send('Solo tenemos estas opciones para su pedido, para más información contacte con...');
  }

  builder.Prompts.text(session, msg);
}

function handleOrderType(session, results, next) {
  switch (results.response) {
    case 'local':
      session.beginDialog('local');
      break;
    case 'recoger':
      session.beginDialog('recoger');
      break;
    case 'domicilio':
      session.beginDialog('domicilio');
      break;
    default:
      session.replaceDialog('/', { noOption: true });
  }
}

function askForElse(session, results, next) {
  builder.Prompts.confirm(session, '¿Te ayudo en algo más?');
}

function endChat(session, results, next) {
  if (results.response) {
    session.replaceDialog('/');
  } else {
    session.endConversation('Estaré aquí para ayudarte. Hasta luego!');
  }
}