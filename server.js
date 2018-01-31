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

const bot = new builder.UniversalBot(connector);

bot.dialog('/', [
  function (session) {
    builder.Prompts.text(session, 'Hola soy Larry, ¿cómo te llamas?');
  },
  function (session, results) {
    session.send(`¡Hola ${results.response}!`);
  }
]);
