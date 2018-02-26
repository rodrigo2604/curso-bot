const builder = require('botbuilder');

const setInformacion = (bot) => {
  bot.dialog('informacion', [
    startInformacion,
    handleInformationType,
  ])
    .triggerAction({
      matches: /^informacion$/i
    });
}

module.exports = setInformacion;

// =====================================Waterfall functions==============================================

function startInformacion(session, results, next) {
  const msg = new builder.Message(session);

  msg.attachments([
    new builder.HeroCard(session)
      .title("Bienvenido al área de información")
      .subtitle('Puede solicitar información de las siguientes áreas')
      .images([builder.CardImage.create(session, 'https://www.osakidetza.euskadi.eus/contenidos/informacion/emer_infor_ciudadano/es_emer/images/informacion_al_ciudadano.jpg')])
      .buttons([
        builder.CardAction.imBack(session, "ofertas", "Ofertas"),
        builder.CardAction.imBack(session, "precios", "Precios"),
      ])
  ]);

  builder.Prompts.text(session, msg);
}

function handleInformationType(session, results, next) {
  switch (results.response) {
    case 'ofertas':
      session.enDialog('Estamos en mantenimiento');
      break;
    case 'precios':
      session.endDialog('Estamos en mantenimiento');
      break;
    default:
      session.replaceDialog('/');
  }
}
