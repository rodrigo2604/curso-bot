// Importamos las librerías necesarias 
// para instancias nuestro bot e iniciar el API Rest
const builder = require('botbuilder');
const restify = require('restify');

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

//=========================================================================
// Toda conversación empieza en el diálogo raíz.
// cada vez que se termine la conversación, se ejecutará
bot.dialog('/', [
  // pila de funciones que se irán ejecutando por orden
  init,
  irA,
  pedirAlgoMas,
  endChat,
]);

function init(session, args, next) {
  const msg = new builder.Message(session);

  msg.attachmentLayout(builder.AttachmentLayout.carousel);
  msg.attachments([
    new builder.HeroCard(session)
      .title("Peticion de datos")
      .images([builder.CardImage.create(session, 'https://s-media-cache-ak0.pinimg.com/originals/95/a4/90/95a4901802f4b06b5ed829bb4139b053.png')])
      .buttons([
        builder.CardAction.imBack(session, "datos", "Dar mis datos")
      ]),
    new builder.HeroCard(session)
      .title("Consulta el tiempo")
      .text("Qué temperatura hace ahora mismo")
      .images([builder.CardImage.create(session, 'https://s-media-cache-ak0.pinimg.com/originals/db/29/6f/db296fa3df7cb6780f7d8cd990b4a5e5.png')])
      .buttons([
        builder.CardAction.imBack(session, "tiempo", "El tiempo en tu ciudad")
      ])
  ]);

  if (args && args.noOption) {
    session.send('Debes seleccionar una tarea de la lista, aun no soy inteligente :\'(');
  } else {
    session.send('Hola soy Larry, te puedo ayudar con las siguientes tareas :)');
  }
  builder.Prompts.text(session, msg);

}

function irA(session, results, next) {
  if (results.response === 'datos') {
    session.beginDialog('pedirDatos');
  } else if (results.response === 'tiempo') {
    session.beginDialog('consultarTiempo');
  } else {
    session.replaceDialog('/', { noOption: true });
  }
}

function pedirAlgoMas(session, results, next) {
  builder.Prompts.confirm(session, '¿Te ayudo en algo más?');
}

function endChat(session, results, next) {
  if (results.response) {
    session.replaceDialog('/');
  } else {
    session.endConversation('Estaré aquí para ayudarte. Hasta luego!');
  }
}

//=========================================================================
bot.dialog('pedirDatos', [
  pedirNombre,
  comprobarNombre,
  confirmarNombre,
])
  .beginDialogAction('mostrarNumeroDatos', 'mostrarDatos', {
    matches: /^datos necesarios$/i
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
});
