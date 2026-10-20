# La cola de mensajes muertos

Cada canal de Cauce tiene una cola de mensajes muertos. Un mensaje llega ahí después de su quinto intento fallido, o enseguida cuando su código de error dice que no se debe reintentar.

## Qué se guarda

El mensaje se guarda tal como era, con sus encabezados, el último código de error, la cantidad de intentos y la hora del último intento. No se le cambia nada.

## Cómo se revisa

El equipo dueño del canal revisa su cola de mensajes muertos cada día hábil. Para cada mensaje decide una de tres cosas: volver a enviarlo después de corregir la causa, enviar una copia corregida, o descartarlo con una nota que diga por qué.

## Límites

Una cola de mensajes muertos guarda los mensajes durante 14 días. Después se borran, así que un mensaje que nadie revisó a tiempo se pierde.
