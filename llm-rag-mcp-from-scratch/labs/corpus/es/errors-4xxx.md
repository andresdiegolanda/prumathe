# Códigos de error de Cauce 4xxx: entrega al destino

Los códigos de la familia 4xxx dicen que Cauce no pudo entregar un mensaje al sistema de destino. Algunos se reintentan con espera exponencial; otros necesitan primero a una persona.

## CAU-4001

No se llega al sistema de destino: su nombre no resuelve o rechaza la conexión. Revisá la ruta de red y la dirección del destino antes de reintentar. Severidad: alta.

## CAU-4002

Falló el handshake TLS con el destino: su certificado venció o no es de confianza. No reintentes; primero renová el certificado o agregalo a los de confianza. Severidad: alta.

## CAU-4011

El destino respondió HTTP 503: está levantado pero no está listo. Reintentá con espera exponencial, según la política de reintentos. Severidad: media.

## CAU-4012

El destino respondió HTTP 429: Cauce está enviando demasiado rápido. Esperá el tiempo del encabezado Retry-After y después reintentá. No subas el ritmo. Severidad: baja.

## CAU-4021

La cola de destino está llena. El destino recibe los mensajes en un buffer que ya no tiene lugar. Esperá a que el consumidor del destino se ponga al día y reintentá con espera exponencial. No agregues productores. Severidad: media.

## CAU-4022

El dueño de la cola de destino la pausó. Los mensajes esperan en Cauce mientras está pausada. No reintentes hasta que el dueño la reanude. Severidad: baja.
