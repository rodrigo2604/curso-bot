// Importamos las librerías necesarias 
// para instancias nuestro bot e iniciar el API Rest
const builder = require('botbuilder');
const restify = require('restify');
const AppConversation = require('./dialogs');

const server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 4000, () => {
  console.log('%s listening to %s', server.name, server.url);
});

// Creamos un conector para nuestro bot
// a través de él se enviarán y recibirán los mensajes
const connector = new builder.ChatConnector({
  // Estas propiedades serán necesarias cuando despleguemos nuestro bot
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Todos los mensajes llegarán por llamadas POST de nuestra API Rest
server.post('/api/messages', connector.listen());

// Los objetos de persistencia (conversationData, userData, etc)
// se guardarán en memoria.
// Si reiniciamos el servidor se resetarán dichos datos.
const inMemoryStorage = new builder.MemoryBotStorage();

// Creamos nuestro bot. A él le iremos creando diálogos, acciones, interceptores, etc.
const bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);

const appConversation = new AppConversation(bot);
appConversation.initDialogs(bot);

/*
bot.dialog('recoger', [
  askForSize,
  comprobarNombre,
  confirmarNombre,
])
  .beginDialogAction('mostrarNumeroDatos', 'mostrarDatos', {
    matches: /^es necesario mi nombre$/i
  });

bot.dialog('mostrarDatos', (session) => session.endDialog('Te pido tu nombre para dirigirme hacia a tí'));

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
//=========================================================================

//=========================================================================
bot.dialog('consultarTiempo', [
  pedirCiudad,
  llamarOpenWeather,
]).triggerAction({// En cualquier momento puedes solicitar el tiempo, pero se reiniciará la conversación
  matches: /^(Consultar el tiempo)/i
});

function pedirCiudad(session, results, next) {
  const msg = session.userData.name ? `${session.userData.name}, ¿en qué ciudad vives?` : '¿Cuál es tu cuidad?';
  builder.Prompts.text(session, msg);
}

function llamarOpenWeather(session, results, next) {
  session.sendTyping();// SendTyping se elimina cuando tiene un mensaje que mostrar
  setTimeout(function () {
    session.endDialog(`Hace 23°C en ${results.response}`);
  }, 3500);
}
//=========================================================================

bot.customAction({// Como el triggerAction pero no modifica la pila de diálogos
  matches: /ayuda|ayudame/gi,
  onSelectAction: (session, args, next) => {
    session.send('Claro, puedes pedirme que calcule el tiempo o darme tus datos');
  }
});
//=========================================================================
bot.use({// Interceptor, se ejecuta siempre la función botbuilder al entrar un mensaje
  botbuilder: (session, next) => {
    if (session.message.text.includes('tonto')) {
      session.send('Aun no soy muy inteligente :(');
    }
    next();
  }
});*/
