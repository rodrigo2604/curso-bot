const builder = require('botbuilder');
const restify = require('restify');
const AppConversation = require('./dialogs');

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

const appConversation = new AppConversation(bot);
appConversation.initDialogs(bot);
