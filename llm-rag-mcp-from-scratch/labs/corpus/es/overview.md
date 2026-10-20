# Qué es Cauce

Cauce es la plataforma de integración de la empresa. Mueve eventos entre sistemas: el servicio de pedidos publica un evento de pedido y Cauce lo entrega a facturación, stock y notificaciones.

## Partes

- Los canales guardan los mensajes en orden, divididos en particiones.
- Los productores escriben mensajes en un canal; los consumidores los leen, en grupos de consumidores.
- Los conectores mueven mensajes entre Cauce y sistemas externos.
- El registro de esquemas guarda el esquema de cada tipo de evento.
- Cada canal tiene una cola de mensajes muertos para los mensajes que no se pudieron entregar.

## Códigos de error

Cada falla lleva un código con la forma CAU- y cuatro dígitos. El primer dígito nombra la familia: 1 contenido del mensaje, 2 conectores, 3 canales y consumidores, 4 entrega al destino. Cada código tiene su sección de runbook con la causa, la acción y si se puede reintentar.
