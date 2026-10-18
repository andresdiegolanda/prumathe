# Docker and Kubernetes kit / Kit de Docker y Kubernetes

Version 1.2.0. Open a terminal in this folder before running the lesson commands. Commands keep their technical names in both languages and use quoting that works in PowerShell, bash and zsh. The `sh` shell used by some commands runs inside the Linux container.

Versión 1.2.0. Abrí una terminal en esta carpeta antes de ejecutar los comandos de las lecciones. Los comandos conservan los nombres técnicos en ambos idiomas y usan comillas que funcionan en PowerShell, bash y zsh. El shell `sh` de algunos comandos corre dentro del contenedor Linux.

## Tools and first run / Herramientas y primera ejecución

1. Install [Docker Desktop](https://docs.docker.com/desktop/) or [Docker Engine](https://docs.docker.com/engine/install/) with [Compose v2](https://docs.docker.com/compose/install/). Choose Linux containers and check `docker version` and `docker compose version`. You need `docker compose up --wait`. Reserve RAM and disk for the Python image and two kind nodes. / Instalá [Docker Desktop](https://docs.docker.com/desktop/) o [Docker Engine](https://docs.docker.com/engine/install/) con [Compose v2](https://docs.docker.com/compose/install/). Elegí contenedores Linux y verificá `docker version` y `docker compose version`. Necesitás `docker compose up --wait`. Reservá RAM y disco para la imagen Python y dos nodos kind.
2. From this folder, run `docker compose build app` and `docker compose up -d --wait app`. / Desde esta carpeta, ejecutá `docker compose build app` y `docker compose up -d --wait app`.
3. Run `docker compose run --rm --no-deps toolbox`. The probe requires HTTP 200 and `hello-compose`; it prints `PASS` only if both hold. / Ejecutá `docker compose run --rm --no-deps toolbox`. La sonda exige HTTP 200 y `hello-compose`; imprime `PASS` solo si ambos se cumplen.
4. Open `http://127.0.0.1:18080`. If that port is taken, find its owner before changing it. If you choose another port in Compose, adjust the URL you use as well. / Abrí `http://127.0.0.1:18080`. Si ese puerto está ocupado, identificá su dueño antes de cambiarlo. Si elegís otro puerto en Compose, ajustá también la URL que usás.

For lessons 13 to 24, install [kind 0.33.0](https://kind.sigs.k8s.io/docs/user/quick-start/) and [kubectl](https://kubernetes.io/docs/tasks/tools/) 1.37.x. On Windows, the official kind binary is [kind-windows-amd64](https://kind.sigs.k8s.io/dl/v0.33.0/kind-windows-amd64) and its checksum is [kind-windows-amd64.sha256sum](https://kind.sigs.k8s.io/dl/v0.33.0/kind-windows-amd64.sha256sum). Verify the SHA256, rename it to `kind.exe` and add its folder to the PATH. On macOS and Linux, pick the artifact for your architecture from the official instructions. Check `kind version` and `kubectl version --client` before continuing.

Para las lecciones 13 a 24, instalá [kind 0.33.0](https://kind.sigs.k8s.io/docs/user/quick-start/) y [kubectl](https://kubernetes.io/docs/tasks/tools/) 1.37.x. En Windows, el binario oficial de kind está en [kind-windows-amd64](https://kind.sigs.k8s.io/dl/v0.33.0/kind-windows-amd64) y su checksum en [kind-windows-amd64.sha256sum](https://kind.sigs.k8s.io/dl/v0.33.0/kind-windows-amd64.sha256sum). Verificá el SHA256, renombralo a `kind.exe` y agregá su carpeta al PATH. En macOS y Linux, elegí el artefacto de tu arquitectura en las instrucciones oficiales. Verificá `kind version` y `kubectl version --client` antes de seguir.

The [version skew policy](https://kubernetes.io/releases/version-skew-policy/) limits the gap between client and API server. The pinned base is Kubernetes 1.37.0 with kubectl 1.37.x; it is the default node image of kind 0.33.0, whose [release page](https://github.com/kubernetes-sigs/kind/releases/tag/v0.33.0) publishes the digest the course uses.

La política de [compatibilidad de versiones](https://kubernetes.io/releases/version-skew-policy/) limita el desfase entre cliente y API server. La base fijada es Kubernetes 1.37.0 con kubectl 1.37.x; es la imagen de nodo predeterminada de kind 0.33.0, cuya [página de release](https://github.com/kubernetes-sigs/kind/releases/tag/v0.33.0) publica el digest que usa el curso.

```text
kind create cluster --name prumathe-dk --config kind.yaml --kubeconfig kubeconfig --image kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5 --wait 180s
kind load docker-image prumathe-signal:1.0.0 --name prumathe-dk
kubectl --kubeconfig kubeconfig --context kind-prumathe-dk wait --for=condition=Ready nodes --all --timeout=90s
kubectl --kubeconfig kubeconfig --context kind-prumathe-dk apply -f k8s/namespace.yaml
```

Create the cluster once. If it already exists, keep using the course's own cluster. If you only lost its access file, recover it with `kind export kubeconfig --name prumathe-dk --kubeconfig kubeconfig`. Do not merge that file into your usual configuration and do not publish it: it contains credentials. The ZIP and the build exclude it. Every command names its context explicitly. The practice namespace is `dk-lab`.

Creá el clúster una sola vez. Si ya existe, seguí usando el propio del curso. Si perdiste solo su archivo de acceso, recuperalo con `kind export kubeconfig --name prumathe-dk --kubeconfig kubeconfig`. No mezcles ese archivo con tu configuración habitual ni lo publiques: contiene credenciales. El ZIP y el build lo excluyen. Cada comando nombra su contexto explícitamente. El namespace de práctica es `dk-lab`.

## What is included / Qué incluye

| File / Archivo | Role / Función |
| --- | --- |
| `app/server.py` | Signal service: JSON with version, message and host. `/health` and `/ready` accept deliberate failures through files in `/tmp`. Handles SIGTERM and exits at once. / Servicio Signal: JSON con versión, mensaje y host. `/health` y `/ready` admiten fallas didácticas mediante archivos en `/tmp`. Atiende SIGTERM y termina enseguida. |
| `app/probe.py` | Client that requires an HTTP status and a text. Optional arguments allow up to 60 attempts; the course uses 30 for endpoint convergence, one second between failures and a 5 second timeout per request. / Cliente que exige estado HTTP y texto. Los argumentos opcionales permiten hasta 60 intentos; el curso usa 30 para convergencia de endpoints, con un segundo entre fallas y timeout de 5 segundos por pedido. |
| `app/Dockerfile` | Base Python 3.14.8 on Alpine 3.24 pinned by digest; user 10001; port 8080; health check. / Base Python 3.14.8 sobre Alpine 3.24 fijada por digest; usuario 10001; puerto 8080; health check. |
| `compose.yaml` | Project `prumathe-dk`, local port 18080, volume, limits and optional toolbox. / Proyecto `prumathe-dk`, puerto local 18080, volumen, límites y toolbox opcional. |
| `demo-token.txt` | Fake practice token, never a real credential. / Token falso de práctica, nunca una credencial real. |
| `kind.yaml` | One control-plane node and one worker on the same host. / Un nodo de control y un worker sobre el mismo host. |
| `k8s/base.yaml` | Deployment with two replicas, probes, resources and a ClusterIP Service. / Deployment de dos réplicas, sondas, recursos y Service ClusterIP. |
| `k8s/pod.yaml` | Standalone Pod to contrast restart and replacement. / Pod suelto para contrastar reinicio y reemplazo. |
| `k8s/config.yaml` | ConfigMap and Secret with deliberately non sensitive data. / ConfigMap y Secret con datos deliberadamente no sensibles. |
| `k8s/storage.yaml` | Local PVC and writer Pod. Deleting the kind cluster deletes that storage. / PVC local y Pod writer. Borrar el clúster kind elimina ese almacenamiento. |
| `k8s/probe.yaml` | Dedicated Pod and Service to fail readiness without mixing in Pods that terminate because of a scale change. / Pod y Service propios para fallar readiness sin mezclar Pods que terminan por un cambio de escala. |
| `k8s/pending.yaml` | Pod that requests 1000 CPU to observe FailedScheduling. / Pod que pide 1000 CPU para observar FailedScheduling. |
| `k8s/rbac.yaml` | Identity observer with read permission on Pods, without access to Secrets or delete. / Identidad observer con permiso de lectura de Pods, sin acceso a Secrets ni delete. |

The application is teaching material: it implements no TLS, authentication, business storage or ordered request draining. The volume holds markers written from the labs. Do not expose this service as a public product.

La aplicación es material didáctico: no implementa TLS, autenticación, almacenamiento de negocio ni drenaje ordenado de pedidos. El volumen se usa para marcadores escritos desde los labs. No expongas este servicio como producto público.

## Repeat and diagnose / Repetir y diagnosticar

The Docker lessons reuse the image built in lesson 00. The Kubernetes lessons start at 13; every practice that uses the Deployment applies its baseline. If you interrupted a lesson, remove only its failure marker or temporary resource before repeating. For `dk-life`, use `docker rm -f dk-life` only if it was left over from lesson 02. `docker system prune` is never needed.

Las lecciones Docker reutilizan la imagen construida en la lección 00. Las de Kubernetes parten de la 13; cada práctica que usa el Deployment aplica su base. Si interrumpiste una lección, quitá solo su marca de falla o recurso temporal antes de repetir. Para `dk-life`, usá `docker rm -f dk-life` únicamente si quedó de la lección 02. No hace falta `docker system prune`.

- A resolution error for `app` usually means the client is not on the Compose network. From the host you use `127.0.0.1:18080`. / Un error de resolución de `app` suele indicar que el cliente no está en la red Compose. Desde el host usás `127.0.0.1:18080`.
- `ErrImageNeverPull` means the image is missing on the node: repeat `kind load docker-image` for the tag in use. Rebuilding locally does not update the node images automatically. / `ErrImageNeverPull` indica que falta la imagen en el nodo: repetí `kind load docker-image` para el tag usado. Reconstruir localmente no actualiza automáticamente las imágenes de los nodos.
- In lesson 10, after removing `/tmp/fail-live`, wait for the next health check. `up --wait` can fail immediately while the previous `unhealthy` state persists. / En la lección 10, después de quitar `/tmp/fail-live`, esperá el siguiente health check. `up --wait` puede fallar inmediatamente mientras persiste el estado anterior `unhealthy`.
- In lesson 23, `no` with exit code 1 is the expected result of an authorization check; nothing is deleted or read. / En la lección 23, `no` y código de salida 1 son resultados esperados de una comprobación de autorización; no se intenta borrar ni leer el recurso.
- If kubectl fails with `x509: certificate signed by unknown authority`, a local proxy or security product is probably intercepting TLS on the loopback endpoint of the cluster. Do not use `--insecure-skip-tls-verify`. Exempt the endpoint in that software, or run the same commands inside the control-plane node: copy the manifests once with `docker cp k8s/. prumathe-dk-control-plane:/course-k8s`, then replace the prefix `kubectl --kubeconfig kubeconfig --context kind-prumathe-dk` with `docker exec prumathe-dk-control-plane kubectl --kubeconfig=/etc/kubernetes/admin.conf --context=kubernetes-admin@prumathe-dk` and the paths `k8s/file.yaml` with `/course-k8s/file.yaml`; keep `-n dk-lab` and the other arguments. That route uses the admin credentials of the practice cluster; it is not a production access pattern. / Si kubectl falla con `x509: certificate signed by unknown authority`, probablemente un proxy o producto de seguridad local intercepta TLS en el endpoint de loopback del clúster. No uses `--insecure-skip-tls-verify`. Exceptuá el endpoint en ese software, o ejecutá los mismos comandos dentro del nodo de control: copiá los manifiestos una vez con `docker cp k8s/. prumathe-dk-control-plane:/course-k8s` y reemplazá el prefijo `kubectl --kubeconfig kubeconfig --context kind-prumathe-dk` por `docker exec prumathe-dk-control-plane kubectl --kubeconfig=/etc/kubernetes/admin.conf --context=kubernetes-admin@prumathe-dk` y las rutas `k8s/archivo.yaml` por `/course-k8s/archivo.yaml`; conservá `-n dk-lab` y los demás argumentos. Esa vía usa las credenciales administrativas del clúster de práctica; no es un patrón de acceso productivo.

## Stop and clean up / Detener y limpiar

To stop the application and keep its data: / Para detener la aplicación conservando sus datos:

```text
docker compose down
```

To also delete the practice Docker volume, use `docker compose down -v`. To delete the cluster **and all its local data**, use `kind delete cluster --name prumathe-dk --kubeconfig kubeconfig`. Do it when you no longer need the markers. These commands do not touch other projects or clusters. Local images stay as cache for taking the course again.

Para borrar también el volumen Docker de práctica, usá `docker compose down -v`. Para borrar el clúster **y todos sus datos locales**, usá `kind delete cluster --name prumathe-dk --kubeconfig kubeconfig`. Hacelo cuando no necesites conservar los marcadores. Estos comandos no operan sobre otros proyectos o clústeres. Las imágenes locales quedan como caché para volver a cursar.
