# Códigos de error de Cauce 3xxx: canales y consumidores

Los códigos de la familia 3xxx vienen de los canales que guardan los mensajes y de los consumidores que los leen. La mayoría se resuelve sola; reintentá cuando termine la condición.

## CAU-3001

Un grupo de consumidores se está rebalanceando: se reasignan sus miembros. Las lecturas se pausan unos segundos. Reintentá cuando termine el rebalanceo; si termina en menos de un minuto, no hace falta hacer nada. Severidad: baja.

## CAU-3002

Un grupo de consumidores se rebalancea una y otra vez. Probablemente un miembro es demasiado lento y sale del grupo por timeout. Buscá el miembro lento en las métricas del grupo antes de reintentar. Severidad: media.

## CAU-3011

Cambió el líder de una partición del canal. Las escrituras esperan al nuevo líder. Reintentá en unos segundos. Severidad: baja.

## CAU-3012

Una partición del canal no tiene líder. Las escrituras a esa partición fallan hasta que se elija uno. No reintentes en un ciclo: llamá al equipo de plataforma. Severidad: alta.

## CAU-3021

Un consumidor está demasiado atrasado: su lag supera el umbral de alerta. No se pierden mensajes, pero llegan tarde. Agregá consumidores o buscá qué los frena. Severidad: media.

## CAU-3022

Un consumidor confirmó una posición más allá del final del canal. Cauce rechaza la confirmación. Revisá el código del consumidor que calcula las posiciones. Severidad: media.
