# Códigos de error de Cauce 1xxx: contenido del mensaje

Los códigos de la familia 1xxx dicen que el mensaje mismo está mal. Reintentar manda otra vez el mismo mensaje equivocado, así que estos errores nunca se reintentan: hay que corregir el productor.

## CAU-1001

El mensaje no es JSON válido. Cauce no pudo leerlo. No reintentes. Buscá el productor en los encabezados del mensaje, corregí su serializador y volvé a enviar el mensaje. Severidad: media.

## CAU-1002

El mensaje es JSON válido pero no tiene tipo de evento. Cauce no puede enrutarlo. No reintentes. Agregá el campo eventType en el productor. Severidad: media.

## CAU-1011

El mensaje no coincide con su esquema registrado. Un campo tiene el tipo equivocado o un nombre desconocido. No reintentes. Compará el mensaje con la versión de esquema de su encabezado y corregí el productor. Severidad: alta cuando afecta pagos, media en los demás casos.

## CAU-1012

Falta un campo obligatorio del esquema. No reintentes. El detalle del error nombra el campo que falta; agregalo en el productor. Severidad: media.

## CAU-1021

El mensaje supera el límite de 1 MB de un canal de Cauce. No reintentes. Partí el mensaje, o guardá la parte grande en otro lado y mandá una referencia. Severidad: baja.

## CAU-1022

El tipo de evento no está registrado en el canal. No reintentes. Registrá el tipo de evento con el equipo de plataforma antes de producirlo. Severidad: baja.
