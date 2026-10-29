# Revisión de Microsoft Entra 1.0.0

Fecha: 2026-10-29. Carpeta: [`entra-from-scratch/`](../entra-from-scratch/).

## Veredicto

[LEÍDO] El curso mantiene el foco en explicar decisiones entre Angular, Entra, Spring y PostgreSQL. La entrega local es utilizable, con el recorrido de tenant expresamente pendiente. No equivale a una certificación de seguridad ni a una aplicación lista para producción.

## Qué se revisó

[LEÍDO] 24 lecciones, 72 escenas, 72 preguntas, 97 pasos, 44 términos, orientación, modelos, código Angular/Java/SQL y kit. Se revisaron audience frente a client ID, scope frente a rol, identidad de usuario frente a conexión JDBC, límites de RLS, estado de las transacciones y diferencia entre fixture y tenant.

[EJECUTADO] Compilación de Spring Boot 4.1.2 y Angular 21.2.25. Suite local de 50 aserciones y 22 comandos del currículo recorridos en orden desde Windows PowerShell. Las pruebas usan la API y PostgreSQL reales, con credenciales locales de prueba.

[EJECUTADO] Navegación de las 24 lecciones en las cuatro apariencias, portada por archivo, glosario, controles del modelo y activación por teclado. Controles completos con explicaciones expandidas en 1440x900, 1366x620 y 390x844; se alcanza el último bloque. Angular mostró 200 para lectura propia, 404 para otro dueño, 401 para audience incorrecto y 403 para falta de rol. No hubo errores de JavaScript en esas pruebas.

## Antes de publicar

[NO VERIFICADO] No se ejecutó el recorrido con tenant real ni el workflow alojado. La [planilla](../entra-from-scratch/labs/TENANT-EVIDENCE.txt) define la evidencia necesaria. Su estado está en el [tablero](../tablero.md), junto con la comprobación posterior al despliegue público.

## Defectos encontrados y corregidos

- [EJECUTADO] El primer conjunto Angular dejaba que el resolvedor eligiera otro patch de compiler-cli; se fijó la línea completa 21.2.25 y se generó el lockfile. La compilación final pasa sin advertencias.
- [LEÍDO] Se retiraron funciones de foro y una referencia de visor heredadas que el curso no usa. La página pública no consulta el servicio local ni carga scripts externos.
- [EJECUTADO] Se agregaron comprobaciones del principal PostgreSQL, los permisos de columna, el desafío HTTP y la ausencia de la descripción protegida en un 404. La suite final pasó de 46 a 50 aserciones.
- [LEÍDO] Se agregó una espera de disponibilidad acotada antes de la suite, para no confundir el arranque de la API con un defecto de autorización.

## Vigencia

[FUENTE] Se contrastaron los documentos primarios enlazados en cada lección y los hitos históricos de la orientación. El ejemplo incluye el redirect bridge de MSAL Browser 5.27.0. Angular 21 se usa como línea LTS, con fin publicado en junio de 2027; PostgreSQL 18 tiene soporte hasta noviembre de 2030. Las versiones y los límites de reproducción están en [VALIDATION](../entra-from-scratch/docs/VALIDATION.md).

## Pedagogía

[LEÍDO] Las preguntas evalúan diferencias conceptuales y los distractores corresponden a errores de diseño posibles. Las respuestas correctas se colocan con una distribución estable sin patrón periódico. Los modelos declaran que son ilustrativos. Los comandos se consultan, no se memorizan. La integradora exige trazar un pedido, justificar cada denegación y registrar lo que no se probó.

## Empaquetado

[EJECUTADO] Build y control estático verifican versión, estructura, modelos en cuatro apariencias, sintaxis, codificación y exclusión de configuración local, caches y evidencia del ZIP. La app y el sitio son artefactos separados con políticas de red diferentes. El kit incluye el código completo y su guía independiente.

## Prioridad

[NO VERIFICADO] La próxima evidencia sustantiva es el recorrido de tenant: registro, consentimiento, sign-in, roles, requests reales y rechazo del fixture. Luego, validación en el host público y pruebas de operación específicas del entorno. No se debe convertir una aprobación local en prueba de esas propiedades.
