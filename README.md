# curso-bot
## feature-rulebased
En esta rama se da una solución parcial al ejercicio propuesto en clase. En dicho ejercicio se debe desarrollar un bot que atienda pedidos en una pizzeria.

### Características de la conversación
- El bot tiene 3 funcionalidades
    - Atender pedido a *domicilio*
    - Atender pedido a *recoger*
    - Atender pedido para consumir en *local*
- Solo se desarrolla como solución el pedido a *recoger*. Queda a libertad del alumno programar los siguientes diálogos como práctica.
- Cuando se dispare el diálogo del pedido a *recoger* el bot debe preguntar lo siguiente:
    - Tamaño de pizza: *mediana* o *familiar*
    - Ingredientes mostrándo una lista de los disponibles. Repetir el diálogo tantas veces el usuario desee agregar más ingredientes.
    - Hora a la que el usuario desee recoger en la pizza en el local
    - Mostrar un resumen, precio y hora a la cual la pizza esté lista
- Durante el diálogo de pedido a *recoger* el usuario podrá solicitar el estado del pedido
- Durante el diálogo de pedido a *recoger* empezar de nuevo su pedido
- Durante el diálogo de pedido a *recoger* cancelar su pedido su pedido
- Durante el diálogo de petición de *ingredientes* el usuario puede solocitar los ingredientes pedidos
- Durante cualquier punto de la conversación el usuario podrá solicitar información de precios y promociones
