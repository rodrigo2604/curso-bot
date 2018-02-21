const builder = require('botbuilder');
const restify = require('restify');

const server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 4000, () => {
  console.log('%s listening to %s', server.name, server.url);
});

const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

const inMemoryStorage = new builder.MemoryBotStorage();
const bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);

bot.dialog('/', [
  init,
  irA,
  endChat,
]);

function init(session, results, next) {
  const msg = new builder.Message(session);

  msg.attachmentLayout(builder.AttachmentLayout.carousel);
  msg.attachments([
    new builder.HeroCard(session)
      .title("Peticion de datos")
      .images([builder.CardImage.create(session, 'https://s-media-cache-ak0.pinimg.com/originals/95/a4/90/95a4901802f4b06b5ed829bb4139b053.png')])
      .buttons([
        builder.CardAction.imBack(session, "Dar mis datos", "Dar datos")
      ]),
    new builder.HeroCard(session)
      .title("Consulta el tiempo")
      .text("Qué temperatura hace ahora mismo")
      .images([builder.CardImage.create(session, 'https://s-media-cache-ak0.pinimg.com/originals/db/29/6f/db296fa3df7cb6780f7d8cd990b4a5e5.png')])
      .buttons([
        builder.CardAction.imBack(session, "Dummie", "Dummie"),
        builder.CardAction.imBack(session, "Dime el tiempo", "El tiempo en tu ciudad")
      ])
  ]);

  builder.Prompts.text(session, msg);
}

function irA(session, results, next) {
  if (results.response === 'Dar mis datos') {
    session.beginDialog('pedirDatos');
  } else if (results.response === 'Dime el tiempo') {
    session.beginDialog('consultarTiempo');
  }
}

function endChat(session, results, next) {
  session.endConversation('Vale gracias, hasta luego');
}

bot.dialog('pedirDatos', [
  pedirNombre,
  comprobarNombre,
  confirmarNombre,
]);

function pedirNombre(session, results, next) {
  if (session.userData.name) {
    next({ response: session.userData.name });
  } else if (results && results.reprompt) {
    builder.Prompts.text(session, 'Ah ok, entonces dime como te llamas?');
  } else {
    builder.Prompts.text(session, '¿Cómo te llamas?');
  }
}

function comprobarNombre(session, results, next) {
  session.userData.name = results.response;
  builder.Prompts.confirm(session, `Entonces eres ${results.response}`);
}

function confirmarNombre(session, results, next) {
  if (!results.response) {
    session.userData = {};
    session.replaceDialog('pedirDatos', { reprompt: true });
  } else {
    session.send(`Encantado ${session.userData.name}`);
    session.endDialog();
  }
}

bot.dialog('consultarTiempo', [
  pedirCiudad,
  llamarOpenWeather,
]);

function pedirCiudad(session, results, next) {
  builder.Prompts.text(session, '¿Cuál es tu cuidad?');
}

function llamarOpenWeather(session, results, next) {
  session.sendTyping();
}
