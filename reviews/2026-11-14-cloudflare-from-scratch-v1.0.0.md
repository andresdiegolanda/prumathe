# Revisión de Cloudflare 1.0.0

Fecha: 2026-11-14. Carpeta: [`cloudflare-from-scratch/`](../cloudflare-from-scratch/), en el árbol de trabajo antes de su primer commit.

Cada hallazgo dice cómo se estableció: **[LEÍDO]**, al leer el archivo citado; **[EJECUTADO]**, al correr algo en esta revisión; **[FUENTE]**, contrastado con la documentación oficial; **[NO VERIFICADO]**, sin confirmar, con el motivo.

## Veredicto

[EJECUTADO] El curso se sostiene: cada pieza dice qué es, para qué sirve y qué no hace, en la lección y en el mapa, y cada paso del laboratorio dice de dónde sale su evidencia. El kit corre el runtime real de Workers con sus bindings simulados y no se presenta como la red de Cloudflare: lo que no corre (anycast, zona, Workers Cache, el pool de Hyperdrive) está dicho donde aparece. El visor en vivo dibuja lo que pasa por el borde con el paso de la lección que lo causó, y solo lee. La entrega local es utilizable. Quedan sin ejecutar los 8 pasos de cuenta, y la zona es caso de estudio.

## Qué se revisó

- [LEÍDO] Las 78 preguntas con su respuesta correcta y su explicación. Los 1460 textos bilingües de lecciones, glosario, fuentes, página de presentación y mapa, comparados por par: los mismos números en los dos idiomas, sin pares iguales y sin formas de tuteo en el español. README, `labs/README.md` y `docs/`.
- [EJECUTADO] `npm run build` y `npm run check`. La suite completa de laboratorios en orden, desde cero, siete veces; la última, con el código final, en [VALIDATION](../cloudflare-from-scratch/docs/VALIDATION.md), seguida de `npm run test:visor` con sus 11 controles.
- [EJECUTADO] Las 29 páginas en Chromium sin interfaz, en los dos idiomas, a 1280 y 390 px; las 26 lecciones recorridas con el control respondido; los siete escenarios del mapa parada por parada; los 26 modelos en cada escena y cada valor de sus controles, midiendo que cada texto quede dentro de su caja. El visor, con cada evento y cada pieza elegidos, en los dos idiomas, en claro y en oscuro y en dos tamaños.
- [FUENTE] Límites de Workers (pedidos por día, CPU, subrequests, Cron Triggers, `waitUntil`), Queues (lotes, reintentos, cola de mensajes muertos, plan gratuito), alarmas de Durable Objects, el binding de rate limiting Workers Cache (configuración, versión mínima de Wrangler, TTL heurístico, Set-Cookie, clave por versión y precio) y el muestreo de los eventos de seguridad.

## Antes de publicar

[NO VERIFICADO] Los 8 pasos de cuenta no se ejecutaron: necesitan una cuenta de Cloudflare y un token en `labs/.env`. Su card está en el [tablero](../tablero.md), con la publicación y el foro.

## Defectos encontrados y corregidos

- [EJECUTADO] `lab webhook` daba por terminada una segunda entrega con el registro de la primera (falló el 22.2). Ahora marca cada envío con un valor propio y espera ese registro.
- [EJECUTADO] `lab spans` ordenaba por `start_ms`, y un span quedó registrado 2,2 s antes que el pedido anterior: el paso 13.3 no vio el último pedido. Ahora ordena los pedidos por `rowid`, el orden en que el explorador los guardó.
- [EJECUTADO] El túnel rápido no respondió en 50 s en una corrida: el nombre nuevo tardó en aparecer en el DNS (73 s en los servidores del nombre) y el borde lo enrutó antes (37 s). `lab tunnel` manda ahora el pedido a la dirección de trycloudflare.com con el nombre nuevo, y la lección 04 lo explica.
- [LEÍDO] `lab spans` decía "answered by the Worker alone" también para una alarma o un cron sin llamadas; ahora dice "no calls to other services" fuera de los pedidos HTTP.
- [EJECUTADO] En los modelos y el mapa, cuatro textos se salían de su caja o de su panel (`movements-dead`, "managed rules", la leyenda de la lección 00, el subtítulo del WAF en el mapa) y cinco piezas del mapa perdían su tercera línea por falta de lugar, una de ellas solo en inglés. Se acortaron o se reubicaron; la medición de todos los estados no encuentra más.
- [FUENTE] Workers Cache figuraba "sin cargo extra". La documentación dice que no tiene precio propio, pero cada pedido, acierto o no, cuenta como pedido del Worker; la lección 10 y la ficha del mapa lo dicen así. La introducción de R2 decía "sin cargo por sacarlos", y las lecturas sí se cobran como operaciones: ahora dice "sin costo de salida".
- [LEÍDO] La primera pregunta de la lección 13 preguntaba qué corre primero sobre un pedido, y la protección DDoS corre antes que las tres opciones; ahora dice "De estas tres".
- [EJECUTADO] La página del visor tenía estilos en línea que su propia CSP bloqueaba, y redibujaba la lista en cada consulta, así que se perdía el foco del teclado. Ahora ubica las barras por el DOM y redibuja solo cuando algo cambió.
- [EJECUTADO] La memoria de la lección 00 y el disco del README se volvieron a medir: unos 800 MB, casi todo del borde con su visor y del origen, y unos 3 GB de imágenes con la que construye el origen.

## Vigencia

[FUENTE] Wrangler 4.162.0, workerd 1.20261113.1, Spring Boot 4.1.2, PostgreSQL 18.7 y cloudflared 2026.11.0, fijados por digest o por lockfile. Los datos del plan gratuito se verificaron el 14 de noviembre de 2026 y llevan esa fecha en el curso. Wrangler anunció una versión mayor final con 18 meses de mantenimiento, ante la nueva CLI `cf` en beta; la lección 06 lo dice. Que R2 pida un medio de pago para activarse no se pudo verificar y está marcado.

## Pedagogía

[LEÍDO] Las preguntas evalúan distinciones (cifrar y autenticar, esconder una dirección y cerrar un puerto, la clave de cache y el usuario, un rate limit aproximado y una cuota, al menos una vez y exactamente una vez) y la respuesta correcta cambia de lugar sin patrón. Los valores marcados como medidos salen de la corrida del kit. El mapa sirve de índice del curso: cada parada lleva a su lección.

## Empaquetado

[EJECUTADO] El ZIP del kit tiene 49 archivos, sin `.env`, `.dev.vars`, dependencias ni estado local de wrangler. Solo se publican 127.0.0.1:18097 y, para el visor, 127.0.0.1:18098, puertos que no usa otro curso. Las salidas del lab no imprimen el token, la dirección pública ni encabezados de identidad.

## Prioridad

[NO VERIFICADO] Lo siguiente es correr los pasos de cuenta y publicar; después, el kit en macOS y Linux y en otra red, porque los tiempos de la lección 04 y el `colo` dependen de la conexión.
