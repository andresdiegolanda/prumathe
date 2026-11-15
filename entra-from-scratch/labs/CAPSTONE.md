# Capstone: defend one request / Trabajo final: defendé un pedido

Deliver a request diagram, separate read/approve policies, a prediction table, observed local results, a separate tenant evidence sheet and a residual-risk note. Use invented data and sanitized output only.

Entregá un diagrama del pedido, políticas separadas para leer y para aprobar, una tabla de predicciones, los resultados locales observados, una planilla de evidencia del tenant aparte y una nota sobre el riesgo que queda. Usá solo datos inventados y salidas saneadas.

| Criterion / Criterio | 0 | 1 | 2 |
|---|---|---|---|
| Principals and recipients / Principals y destinatarios | Conflates users and services / Confunde usuarios y servicios | Names components / Nombra componentes | Names every principal, credential, recipient and trust decision / Nombra cada principal, credencial, destinatario y decisión de confianza |
| Token contract / Contrato del token | Relies on decoding or any signature / Confía en decodificar o en cualquier firma | Checks some claims / Verifica algunos claims | Explains trusted issuer/key, audience, time, tenant, subject and permitted client / Explica el issuer y la clave de confianza, la audiencia, el tiempo, el tenant, el sujeto y el cliente permitido |
| Operation policy / Política de la operación | Sign-in grants access / Iniciar sesión da acceso | Uses scope or role alone / Usa solo el scope o solo el rol | Distinguishes delegated scope, app role and caller type / Distingue el scope delegado, el app role y el tipo de quien llama |
| Object policy / Política del objeto | Trusts an ID or caller-supplied owner / Confía en un ID o en un dueño que manda quien llama | Filters one route / Filtra una ruta | Explains tenant, owner, state, RLS role and every data path / Explica el tenant, el dueño, el estado, el rol de RLS y cada camino a los datos |
| Transactions / Transacciones | Ignores pools or races / Ignora los pools o las carreras | Names one risk / Nombra un riesgo | Explains context lifetime, atomic update and external-effect limit / Explica la vida del contexto, el update atómico y el límite de los efectos externos |
| Evidence / Evidencia | Shows only PASS / Muestra solo PASS | Shows allowed and denied results / Muestra resultados permitidos y rechazados | Connects predictions to observations and detects a removed-control regression / Conecta predicciones con observaciones y detecta la regresión de un control quitado |
| Limits / Límites | Claims production certification / Afirma una certificación de producción | Lists generic cautions / Enumera precauciones genéricas | Separates tenant evidence and specifies unverified operational dependencies / Separa la evidencia del tenant y especifica las dependencias operativas sin verificar |

A strong submission scores at least 12/14, with no zero for token, operation or object policy. This is a course rubric, not a security certification.

Una entrega sólida suma al menos 12/14, sin ningún cero en token, política de la operación ni política del objeto. Es una rúbrica del curso, no una certificación de seguridad.

Required negative cases: wrong audience, forged signature, expired token, missing scope, missing role, wrong owner, wrong tenant, app-only caller and competing approvals. Explain why a valid signature cannot compensate for a wrong audience, and why Approver cannot compensate for self-approval.

Casos negativos obligatorios: audiencia equivocada, firma falsificada, token vencido, scope que falta, rol que falta, dueño equivocado, tenant equivocado, quien llama app-only y aprobaciones que compiten. Explicá por qué una firma válida no puede compensar una audiencia equivocada, y por qué Approver no puede compensar que alguien apruebe lo propio.

Extension: add a nightly workload or downstream Graph request on paper. Specify the grant, recipient, permission vocabulary, audit principal and tests. Do not weaken the user endpoint merely to reuse it.

Extensión: agregá en papel un workload nocturno o un pedido a Graph, más abajo. Especificá el grant, el destinatario, el vocabulario de permisos, el principal de auditoría y las pruebas. No debilites el endpoint de usuario solo para reutilizarlo.

Production review: explain TLS at both network boundaries, secret custody, dependency maintenance, safe telemetry, tenant onboarding, role-removal latency, key discovery failures and the effect of a compromised frontend or API. State an owner and an evidence requirement for each unresolved item.

Revisión de producción: explicá el TLS en los dos límites de red, la custodia de los secretos, el mantenimiento de las dependencias, la telemetría segura, el alta de tenants, la demora al quitar un rol, las fallas al descubrir claves y el efecto de un frontend o una API comprometidos. Indicá un responsable y un requisito de evidencia para cada punto sin resolver.
