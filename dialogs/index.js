const builder = require('botbuilder');
const setFlightBilling = require('./flightBilling');

function setDialogs(bot) {
  setFlightBilling(bot);
}

function startConversation(bot) {
  setDialogs(bot);

  return bot.dialog('/', [
    function (session) {

      const msg = new builder.Message(session);

      msg.attachmentLayout(builder.AttachmentLayout.carousel);
      msg.attachments([
        new builder.HeroCard(session)
          .title("Precio de tu vuelo")
          .text("Calcula el precio de tu vuelo")
          .images([builder.CardImage.create(session, 'https://s-media-cache-ak0.pinimg.com/originals/95/a4/90/95a4901802f4b06b5ed829bb4139b053.png')])
          .buttons([
            builder.CardAction.imBack(session, "Quiero ver vuelos", "Quiero ver vuelos")
          ]),
        new builder.HeroCard(session)
          .title("Mira el tiempo")
          .text("Mira el pronostico del tiempo de la ciudad de destino")
          .images([builder.CardImage.create(session, 'https://s-media-cache-ak0.pinimg.com/originals/db/29/6f/db296fa3df7cb6780f7d8cd990b4a5e5.png')])
          .buttons([
            builder.CardAction.imBack(session, "Dime el tiempo", "El tiempo en tu destino")
          ])
      ]);

      session
        .send('¡Hola! Soy Larry, el bot que te ayuda en tus viajes')
        .send(msg)
        .endDialog();
    }
  ]);
}

module.exports = { startConversation };
