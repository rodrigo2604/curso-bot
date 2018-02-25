# curso-bot
## feature-simple
Esta rama sirve a modo de ejemplo. Vemos cómo funciona la pila de diálogos y las acciones o eventos de diálogos. Aquí se muestra un *rule-based bot*. Se le guía todo momento al usuario sin proporcionar un NLP.

### Características de la conversación
- Escribid cualquier cosa para que el bot nos responda (No hay NLP)
- El bot nos ofrece dos opciones
  - Proporcionar nuestro nombre
  - Poder consultar el tiempo (es un mock, queda a la libertad del alumno implementar un servicio a través de *Openweather* por ejemplo)
- Si el usuario no responde con una opción, se le vuelve a mostrar el carrusel de opciones con un mensaje de aclaración
- Cada conversación tendrá su cascada de funciones mediante la cual preguntaremos las entradas del usuario
- En cualquier momento el usuario puede solicitar el tiempo con la frase reservada *consultar el tiempo*
- Durante la petición del nombre el usuario puede preguntar la razoón por la cual le solicitamos el nombre con la frase reservada *es necesario mi nombre*
- Cuando se haya terminado alguno de los diálogos anteriores se le pregunta al usuario si desea algo más
  - Afirmativo, entonces se le muestra de nuevo el carrusel de opciones
  - Negativo, nos despedimos

### Pila o stack de diálogos
Toda conversación comienza con el el diálogo raíz:

    bot.dialog('/', waterfall);

Donde *waterfall* es la cascada o array de funciones desde donde vamos ir manejando los diferentes diálogos de la conversación.

Las funciones de la cascada siempre tendrán esta forma:

    function nombreFuncion (session:Session, results:Object, next:Function) {
      // lógica del tratamiento de entradas y salidas del usuario
      // y para pasar a la siguiente función o terminar diálogo o conversación
    }

Donde *session* es el objeto de sessión desde donde podremos ejecutar los métodos propios de un diálogo (promts, manejadores de diálogos, respuestas al usuario, metadata, etc). *results* son las entradas de la función. Aquí obtendremos las respuestas del usuario o argumentos de otro diálogo si es la primera función de la cascada. Con *next* controlamos el flujo de la cascada. Si no deseamos hacer nada más, ni pedir otro datos o mientras se cumpla alguna condición, podremos delegar la tarea a la siguiente función de la cascada, a la cual se le puede pasar argumentos con:

    next(results:Object);

Empezaremos un diálogo nuevo con:

    session.beginDialog(nombreDialogo: string, args: Object);

Esto provoca que el diálogo *nombreDialogo* se pondrá en la pila LIFO de los diálogos de la conversación. Podremos enviar argumentos los cuales tendremos acceso en la primera función de la cascada de funciones del diálogo que se invoca.

Cuando estemos en un diálogo que no sea el raíz, podremos terminarlo con:

    session.endDialog();

Esto provoca que el diálogo actual se elimina de la pila dando paso al que estaba anteriormente siempre respetendo el LIFO de la pila. Si deseamos pasar parámetros al diálogo que empezó el diálogo que estamos temrinando podremos utilizar:

    session.endDialogWithResult(results:Object);

Donde *results* es un objeto que será parámetro de entrada de la función donde se reanude el diálogo.

Si deseamos repetir un diálogo, ya sea por que no se ha validado una entrada de usuario o queremos ofrecer de nuevo nuestros servicios utilizaremos:

    session.replaceDialog(nombreDialogo);

Donde *nombreDialogo* es normalmente el mismo nombre del diálogo desde donde se invoca, de esta manera repetimos el proceso actual.

En cualquier momento podremos temrinar la conversacióm de manera global:

    session.endConversation();

Eliminando toda la pila de diálogos y volviendo a la raíz.

Para una información más detallada siempre podréis acceder a la [documentación oficial](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-overview).
