# curso-bot
Aplicaciones chatbot para el curso de bots. Las aplicaciones son pequeños ejemplos para afrontar desarrollos más complejos atendiendo de manera especial a los conceptos básicos de un chatbot.

Las aplicaciones están desarrolladas con NodeJs y la librería [botbuilder](https://www.npmjs.com/package/botbuilder). El contenido se ha basado enteramente en la documentación oficial de la página de [Bot Framework](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-quickstart) para NodeJs.

Las aplicaciones se dividen en ramas de la siguiente manera:

- [feature-simple](https://github.com/rodrigo2604/curso-bot/tree/feature-simple): Pequeño ejemplo donde se muestran los conceptos básicos para el manejo de flujos de diálogos y acciones del chatbot. No posee NLP ya que se centra sólo en los conceptos básicos de botbuilder.
- [feature-rulebased](https://github.com/rodrigo2604/curso-bot/tree/feature-rulebased) Ejercicio propuesto en clase para el desarrollo de un bot real del tipo *rule-based*, es decir, se le guía al usuario en todo momento durante el diálogo careciendo de recnonocimiento de frases ni entidades.
- **feature-nlp** Es el mismo ejercicio anterior pero con NLP integrado. Nos servirá para ver la capacidad de un bot con inteligencia incorporada. El bot que hemos hecho se encuntra en la siguiente endpoint

https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/69bc5137-f7c1-4c54-ab6c-25d5d6ca7ca1?subscription-key=219435e45b61497ca3f87e495f978ad4&staging=true&verbose=true&timezoneOffset=0&q=
