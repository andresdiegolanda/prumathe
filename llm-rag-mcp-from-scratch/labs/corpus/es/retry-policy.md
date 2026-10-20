# Política de reintentos de Cauce

Cauce reintenta una entrega solo cuando el código de error dice que se puede reintentar. Los errores de contenido del mensaje (1xxx) nunca se reintentan.

## Espera exponencial

El primer reintento espera 2 segundos y cada espera siguiente se duplica: 2, 4, 8 y 16 segundos. Cada espera suma una variación al azar de hasta el 20 por ciento, para que muchos emisores no reintenten en el mismo instante.

## Intentos

Cauce hace cinco intentos en total: la primera entrega y cuatro reintentos. Después de la quinta falla, el mensaje va a la cola de mensajes muertos de su canal y no se vuelve a reintentar automáticamente.

## Quién cambia la política

La política es la misma para todos los canales. Un equipo que necesita otros valores se los pide al equipo de plataforma; cambiarla en la configuración de un conector no está permitido, porque un reintento más rápido puede sobrecargar al destino que ya está fallando.
