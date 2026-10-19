/* Canonical bilingual content. Generated HTML and notes are built from this file. */
window.DK_COURSE = {
  "version": "1.3.1",
  "date": "2026-10-18",
  "kubernetes": "1.37.0",
  "kind": "0.33.0",
  "units": [
    {
      "en": "Start here",
      "es": "Antes de empezar"
    },
    {
      "en": "Inside a container",
      "es": "Dentro de un contenedor"
    },
    {
      "en": "Data and connections",
      "es": "Datos y conexiones"
    },
    {
      "en": "Ship and operate",
      "es": "Distribuir y operar"
    },
    {
      "en": "Enter Kubernetes",
      "es": "Entrar a Kubernetes"
    },
    {
      "en": "Connect and configure",
      "es": "Conectar y configurar"
    },
    {
      "en": "Operate with evidence",
      "es": "Operar con evidencia"
    }
  ],
  "lessons": [
    {
      "id": 0,
      "unit": 0,
      "slug": "before-you-start",
      "title": {
        "en": "Before you start",
        "es": "Antes de empezar"
      },
      "intro": {
        "en": "See the model, predict a result, run the experiment.",
        "es": "Mirá el modelo, predecí un resultado y ejecutá el experimento."
      },
      "visual": "method",
      "frames": [
        {
          "title": {
            "en": "Two workspaces",
            "es": "Dos espacios"
          },
          "text": {
            "en": "The browser simulates mechanisms. Your terminal runs real containers. Each lesson has three scenes, a lab and three questions; a diagram cannot verify your machine.",
            "es": "El navegador simula mecanismos. Tu terminal ejecuta contenedores reales. Cada lección tiene tres escenas, un lab y tres preguntas; un diagrama no puede verificar tu máquina."
          },
          "rule": {
            "en": "A model explains; a lab produces evidence.",
            "es": "Un modelo explica; un lab produce evidencia."
          }
        },
        {
          "title": {
            "en": "One application, two environments",
            "es": "Una aplicación, dos entornos"
          },
          "text": {
            "en": "Signal is a tiny HTTP service. First you build and run it with Docker; later you declare its desired state in Kubernetes. Follow lessons 00 to 24 in order the first time. The site works offline; initial image downloads need internet.",
            "es": "Signal es un servicio HTTP pequeño. Primero lo construís y ejecutás con Docker; después declarás su estado deseado en Kubernetes. La primera vez, seguí las lecciones 00 a 24 en orden. El sitio funciona sin conexión; las primeras descargas de imágenes necesitan internet."
          },
          "rule": {
            "en": "Keep the application small so the platform stays visible.",
            "es": "Mantené la aplicación pequeña para que la plataforma siga visible."
          }
        },
        {
          "title": {
            "en": "Prepare the tools",
            "es": "Prepará las herramientas"
          },
          "text": {
            "en": "Use Docker with Linux containers and Compose v2. Lesson 13 adds kind 0.33.0 and kubectl 1.37.x for Kubernetes 1.37.0. Our kind nodes are containers on one machine, not independent failure domains. Progress is stored in this browser and lab completion is self-reported.",
            "es": "Usá Docker con contenedores Linux y Compose v2. La lección 13 agrega kind 0.33.0 y kubectl 1.37.x para Kubernetes 1.37.0. Los nodos de kind son contenedores en una máquina, no dominios de falla independientes. El avance queda en este navegador y vos declarás los labs completados."
          },
          "rule": {
            "en": "Local success is not proof of production resilience.",
            "es": "Que funcione localmente no prueba resistencia en producción."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What does the model test?",
            "es": "¿Qué prueba el modelo?"
          },
          "options": [
            {
              "en": "A real cluster failover",
              "es": "Una recuperación real del clúster"
            },
            {
              "en": "Your reasoning within its assumptions",
              "es": "Tu razonamiento dentro de sus supuestos"
            },
            {
              "en": "Your Docker installation",
              "es": "Tu instalación de Docker"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Only terminal commands contact the real runtime.",
            "es": "Solo los comandos de terminal contactan el entorno real."
          }
        },
        {
          "question": {
            "en": "Why keep one application throughout?",
            "es": "¿Por qué mantener una aplicación?"
          },
          "options": [
            {
              "en": "To isolate platform changes",
              "es": "Para aislar los cambios de plataforma"
            },
            {
              "en": "Because Kubernetes only runs Python",
              "es": "Porque Kubernetes solo ejecuta Python"
            },
            {
              "en": "To avoid building images",
              "es": "Para evitar construir imágenes"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "The same service lets you compare packaging, networking and recovery.",
            "es": "El mismo servicio te permite comparar empaquetado, red y recuperación."
          }
        },
        {
          "question": {
            "en": "Two kind nodes on one laptop survive what?",
            "es": "¿Qué pueden sobrevivir dos nodos de kind en una laptop?"
          },
          "options": [
            {
              "en": "Any hardware failure",
              "es": "Cualquier falla de hardware"
            },
            {
              "en": "A deleted cluster and all its data",
              "es": "Un clúster borrado y todos sus datos"
            },
            {
              "en": "Some process failures, not loss of the laptop",
              "es": "Algunas fallas de proceso, no la pérdida de la laptop"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "All nodes depend on the same host.",
            "es": "Todos los nodos dependen del mismo host."
          }
        }
      ],
      "source": "compose",
      "lab": [
        {
          "title": {
            "en": "Check the runtime",
            "es": "Verificá el entorno"
          },
          "text": {
            "en": "Start Docker with Linux containers. Use Compose v2 with support for up --wait; the verified versions are in labs/README.md.",
            "es": "Arrancá Docker con contenedores Linux. Usá Compose v2 con up --wait; las versiones verificadas están en labs/README.md."
          },
          "command": "docker version\ndocker compose version",
          "expected": {
            "en": "A reachable Server and Compose v2. If Server is missing, start Docker first.",
            "es": "Un Server accesible y Compose v2. Si falta Server, primero arrancá Docker."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Open the kit",
            "es": "Abrí el kit"
          },
          "text": {
            "en": "Download labs, extract the ZIP, and open a terminal in its extracted directory. The following command enters the folder containing compose.yaml.",
            "es": "Descargá labs, descomprimí el ZIP y abrí una terminal en el directorio descomprimido. Este comando entra donde está compose.yaml."
          },
          "command": "cd labs",
          "expected": {
            "en": "Your current directory contains app, k8s and compose.yaml.",
            "es": "Tu directorio contiene app, k8s y compose.yaml."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Build the shared image",
            "es": "Construí la imagen común"
          },
          "text": {
            "en": "The first build downloads a pinned Python base image. No host Python is needed. Wait for success before continuing.",
            "es": "El primer build descarga la imagen Python fijada. No necesitás Python en tu máquina. Esperá éxito antes de seguir."
          },
          "command": "docker compose build app",
          "expected": {
            "en": "The image prumathe-signal:1.0.0 is built; no application dependency installation is needed.",
            "es": "Se construye prumathe-signal:1.0.0; no hay dependencias de aplicación que instalar."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Run and assert the response",
            "es": "Ejecutá y comprobá la respuesta"
          },
          "text": {
            "en": "The probe checks HTTP status and expected response text. Visit http://127.0.0.1:18080 in a browser too.",
            "es": "La sonda comprueba estado HTTP y texto esperado. Visitá también http://127.0.0.1:18080 en el navegador."
          },
          "command": "docker compose up -d --wait app\ndocker compose run --rm --no-deps toolbox",
          "expected": {
            "en": "A healthy app and a JSON response containing hello-compose followed by PASS.",
            "es": "Una aplicación healthy y JSON con hello-compose seguido de PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Move the stage marker. Which actions run in the browser and which need a terminal?",
        "es": "Mové la etapa. ¿Qué acciones corren en el navegador y cuáles necesitan terminal?"
      }
    },
    {
      "id": 1,
      "unit": 1,
      "slug": "containers",
      "title": {
        "en": "A process with boundaries",
        "es": "Un proceso con límites"
      },
      "intro": {
        "en": "A container starts with a process, not a miniature computer.",
        "es": "Un contenedor empieza con un proceso, no con una computadora pequeña."
      },
      "visual": "process",
      "frames": [
        {
          "title": {
            "en": "The main process",
            "es": "El proceso principal"
          },
          "text": {
            "en": "A container runs a command with an isolated view of processes, networking and files. On Linux it shares the host kernel. Docker Desktop runs Linux containers inside its Linux environment.",
            "es": "Un contenedor ejecuta un comando con una vista aislada de procesos, red y archivos. En Linux comparte el kernel del host. Docker Desktop ejecuta los contenedores Linux dentro de su entorno Linux."
          },
          "rule": {
            "en": "Isolation does not create a separate kernel.",
            "es": "El aislamiento no crea un kernel separado."
          }
        },
        {
          "title": {
            "en": "An image becomes a container",
            "es": "Una imagen se vuelve contenedor"
          },
          "text": {
            "en": "The image supplies files and defaults. Docker adds runtime configuration and a writable layer for each container. Two containers from one image can have different names and different files.",
            "es": "La imagen aporta archivos y valores por defecto. Docker agrega configuración de ejecución y una capa escribible por contenedor. Dos contenedores de una imagen pueden tener nombres y archivos distintos."
          },
          "rule": {
            "en": "Same image does not mean shared writable state.",
            "es": "La misma imagen no implica compartir estado escribible."
          }
        },
        {
          "title": {
            "en": "A bounded experiment",
            "es": "Un experimento acotado"
          },
          "text": {
            "en": "Run id and inspect the process list inside the image. Our app uses UID 10001, not root. That reduces privileges but does not make untrusted code harmless or replace host security.",
            "es": "Ejecutá id e inspeccioná los procesos dentro de la imagen. Nuestra aplicación usa UID 10001, no root. Eso reduce privilegios, pero no vuelve inofensivo al código no confiable ni reemplaza la seguridad del host."
          },
          "rule": {
            "en": "Name the boundary you actually observed.",
            "es": "Nombrá el límite que observaste."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What is shared by Linux containers on one Linux host?",
            "es": "¿Qué comparten los contenedores Linux en un host Linux?"
          },
          "options": [
            {
              "en": "The kernel",
              "es": "El kernel"
            },
            {
              "en": "Every writable file",
              "es": "Todos los archivos escribibles"
            },
            {
              "en": "The same process ID namespace by default",
              "es": "El mismo espacio de PID por defecto"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Namespaces isolate views; they do not boot another kernel.",
            "es": "Los namespaces aíslan vistas; no arrancan otro kernel."
          }
        },
        {
          "question": {
            "en": "A second container changes /tmp. What happens to the first?",
            "es": "Otro contenedor cambia /tmp. ¿Qué pasa con el primero?"
          },
          "options": [
            {
              "en": "Its /tmp always changes too",
              "es": "Su /tmp siempre cambia también"
            },
            {
              "en": "The image is rebuilt",
              "es": "Se reconstruye la imagen"
            },
            {
              "en": "Its own writable layer stays separate",
              "es": "Su capa escribible sigue separada"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Only an explicitly shared mount changes this boundary.",
            "es": "Solo un montaje compartido explícito cambia ese límite."
          }
        },
        {
          "question": {
            "en": "Does non-root eliminate all risk?",
            "es": "¿Ejecutar sin root elimina todo riesgo?"
          },
          "options": [
            {
              "en": "Yes; the network is disabled",
              "es": "Sí; la red está deshabilitada"
            },
            {
              "en": "No; it limits one set of privileges",
              "es": "No; limita un conjunto de privilegios"
            },
            {
              "en": "Yes; the kernel is separate",
              "es": "Sí; el kernel está separado"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "The application can still access its granted files and network.",
            "es": "La aplicación todavía puede acceder a sus archivos y su red permitidos."
          }
        }
      ],
      "source": "container",
      "lab": [
        {
          "title": {
            "en": "Inspect the runtime user",
            "es": "Inspeccioná el usuario"
          },
          "text": {
            "en": "Run a short command instead of the default server command. --rm removes this temporary container after exit.",
            "es": "Ejecutá un comando corto en vez del servidor por defecto. --rm borra este contenedor temporal cuando termina."
          },
          "command": "docker run --rm prumathe-signal:1.0.0 id",
          "expected": {
            "en": "UID 10001, not root.",
            "es": "UID 10001, no root."
          },
          "checks": [
            {
              "contains": "uid=10001"
            }
          ]
        },
        {
          "title": {
            "en": "See isolated processes",
            "es": "Mirá procesos aislados"
          },
          "text": {
            "en": "Run ps inside a new container. The process list is the container view, not a list of every host application.",
            "es": "Ejecutá ps en otro contenedor. La lista es su vista, no la de todas las aplicaciones del host."
          },
          "command": "docker run --rm prumathe-signal:1.0.0 ps",
          "expected": {
            "en": "A small process list containing ps; host applications are absent.",
            "es": "Una lista pequeña con ps; no aparecen aplicaciones del host."
          },
          "checks": [
            {
              "contains": "PID"
            }
          ]
        },
        {
          "title": {
            "en": "Write to a temporary layer",
            "es": "Escribí en una capa temporal"
          },
          "text": {
            "en": "Create a marker inside this container. The shell and marker disappear when this --rm container exits.",
            "es": "Creá una marca dentro de este contenedor. El shell y la marca desaparecen cuando termina."
          },
          "command": "docker run --rm prumathe-signal:1.0.0 sh -c 'echo isolated > /tmp/marker; cat /tmp/marker'",
          "expected": {
            "en": "isolated is printed.",
            "es": "Se imprime isolated."
          },
          "checks": [
            {
              "contains": "isolated"
            }
          ]
        },
        {
          "title": {
            "en": "Start from the image again",
            "es": "Partí de la imagen otra vez"
          },
          "text": {
            "en": "Check the same path in another new container. test asserts absence and prints PASS only when the assertion holds.",
            "es": "Revisá la misma ruta en otro contenedor nuevo. test comprueba ausencia e imprime PASS solo si se cumple."
          },
          "command": "docker run --rm prumathe-signal:1.0.0 sh -c 'test ! -f /tmp/marker && echo PASS'",
          "expected": {
            "en": "PASS: the previous container did not edit the image.",
            "es": "PASS: el contenedor anterior no editó la imagen."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Stop one process. Does the other container stop? Inspect the shared kernel.",
        "es": "Detené un proceso. ¿Se detiene el otro contenedor? Inspeccioná el kernel compartido."
      }
    },
    {
      "id": 2,
      "unit": 1,
      "slug": "lifecycle",
      "title": {
        "en": "Start, stop, remove",
        "es": "Arrancar, parar, borrar"
      },
      "intro": {
        "en": "A stopped container and a deleted container are different states.",
        "es": "Un contenedor detenido y uno borrado son estados distintos."
      },
      "visual": "lifecycle",
      "frames": [
        {
          "title": {
            "en": "Run means create and start",
            "es": "Run crea y arranca"
          },
          "text": {
            "en": "docker run creates a container and starts its command. docker start starts an existing stopped container. A foreground process keeps the container alive; completing the main command stops it.",
            "es": "docker run crea un contenedor y arranca su comando. docker start arranca uno existente que está detenido. Un proceso en primer plano mantiene vivo al contenedor; al terminar el comando principal, se detiene."
          },
          "rule": {
            "en": "A container is alive while its main process runs.",
            "es": "El contenedor vive mientras corre su proceso principal."
          }
        },
        {
          "title": {
            "en": "Stop is a lifecycle event",
            "es": "Parar cambia el ciclo de vida"
          },
          "text": {
            "en": "docker stop requests graceful termination, then forcibly kills the process if its timeout expires. Application signal handling determines whether work finishes cleanly. Our teaching server handles SIGTERM and exits at once; it does not drain in-flight requests.",
            "es": "docker stop solicita una terminación ordenada y fuerza la finalización si vence el plazo. El manejo de señales de la aplicación determina si termina bien el trabajo. Nuestro servidor didáctico atiende SIGTERM y termina enseguida; no drena los pedidos en curso."
          },
          "rule": {
            "en": "Receiving a signal is not the same as finishing work.",
            "es": "Recibir una señal no equivale a terminar el trabajo."
          }
        },
        {
          "title": {
            "en": "Removal ends this writable layer",
            "es": "Borrar termina esta capa escribible"
          },
          "text": {
            "en": "Stopping preserves the container writable layer. Removing the container removes that layer; volumes have their own lifecycle. Inspect status before removing the named practice container.",
            "es": "Detener conserva la capa escribible. Borrar el contenedor elimina esa capa; los volúmenes tienen otro ciclo de vida. Inspeccioná el estado antes de borrar el contenedor de práctica."
          },
          "rule": {
            "en": "Stop preserves; remove discards the container layer.",
            "es": "Stop conserva; remove descarta la capa del contenedor."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "How do you resume a stopped container?",
            "es": "¿Cómo retomás un contenedor detenido?"
          },
          "options": [
            {
              "en": "docker run creates the same identity",
              "es": "docker run crea la misma identidad"
            },
            {
              "en": "docker build",
              "es": "docker build"
            },
            {
              "en": "docker start",
              "es": "docker start"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "start reuses the existing container; run creates another.",
            "es": "start reutiliza el contenedor existente; run crea otro."
          }
        },
        {
          "question": {
            "en": "When does the container stop normally?",
            "es": "¿Cuándo se detiene normalmente?"
          },
          "options": [
            {
              "en": "When its image tag changes",
              "es": "Cuando cambia el tag de la imagen"
            },
            {
              "en": "When its main command exits",
              "es": "Cuando termina su comando principal"
            },
            {
              "en": "When all logs have been read",
              "es": "Cuando se leyeron todos los logs"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "The runtime tracks the main process.",
            "es": "El entorno sigue al proceso principal."
          }
        },
        {
          "question": {
            "en": "What survives stop but not removal without a mount?",
            "es": "¿Qué sobrevive a stop pero no al borrado sin montaje?"
          },
          "options": [
            {
              "en": "Files in the writable layer",
              "es": "Archivos de la capa escribible"
            },
            {
              "en": "The running process",
              "es": "El proceso en ejecución"
            },
            {
              "en": "An open TCP connection",
              "es": "Una conexión TCP abierta"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Stopped containers keep their files until removed.",
            "es": "Los contenedores detenidos conservan archivos hasta que los borrás."
          }
        }
      ],
      "source": "lifecycle",
      "lab": [
        {
          "title": {
            "en": "Create the named process",
            "es": "Creá el proceso con nombre"
          },
          "text": {
            "en": "Use the course-only name dk-life. If repeating after interruption, remove just dk-life with docker rm -f dk-life before this step.",
            "es": "Usá el nombre propio dk-life. Si repetís después de interrumpir, borrá solo dk-life con docker rm -f dk-life antes de este paso."
          },
          "command": "docker run -d --name dk-life prumathe-signal:1.0.0",
          "expected": {
            "en": "A container ID. The server stays in the foreground inside it.",
            "es": "Un ID de contenedor. El servidor queda en primer plano dentro."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Write and stop",
            "es": "Escribí y detené"
          },
          "text": {
            "en": "Write a marker, then stop the process. Inspect the resulting lifecycle state.",
            "es": "Escribí una marca y detené el proceso. Inspeccioná el estado resultante."
          },
          "command": "docker exec dk-life sh -c 'echo retained > /tmp/life'\ndocker stop dk-life\ndocker inspect --format '{{.State.Status}} {{.State.ExitCode}}' dk-life",
          "expected": {
            "en": "exited 0: the process handled SIGTERM; 137 would mean it had to be killed. The container still exists.",
            "es": "exited 0: el proceso atendió SIGTERM; 137 significaría que hubo que matarlo. El contenedor todavía existe."
          },
          "checks": [
            {
              "contains": "exited 0"
            }
          ]
        },
        {
          "title": {
            "en": "Restart the same container",
            "es": "Reiniciá el mismo contenedor"
          },
          "text": {
            "en": "start reuses the container and its layer. Read the marker after restart.",
            "es": "start reutiliza el contenedor y su capa. Leé la marca después."
          },
          "command": "docker start dk-life\ndocker exec dk-life cat /tmp/life",
          "expected": {
            "en": "retained: stopping did not delete the layer.",
            "es": "retained: detener no borró la capa."
          },
          "checks": [
            {
              "contains": "retained"
            }
          ]
        },
        {
          "title": {
            "en": "Remove this instance",
            "es": "Borrá esta instancia"
          },
          "text": {
            "en": "Stop and remove only the named practice container. A fresh temporary container cannot see its marker.",
            "es": "Detené y borrá solo el contenedor de práctica. Uno temporal nuevo no ve su marca."
          },
          "command": "docker stop dk-life\ndocker rm dk-life\ndocker run --rm prumathe-signal:1.0.0 sh -c 'test ! -f /tmp/life && echo PASS'",
          "expected": {
            "en": "PASS. The image is still available.",
            "es": "PASS. La imagen sigue disponible."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Move from running to stopped to removed. Which state keeps the writable layer?",
        "es": "Pasá de running a stopped y removed. ¿Qué estado conserva la capa escribible?"
      }
    },
    {
      "id": 3,
      "unit": 1,
      "slug": "images",
      "title": {
        "en": "Images and layers",
        "es": "Imágenes y capas"
      },
      "intro": {
        "en": "Read-only building blocks, one writable layer per container.",
        "es": "Bloques de solo lectura, una capa escribible por contenedor."
      },
      "visual": "layers",
      "frames": [
        {
          "title": {
            "en": "An image is a recipe result",
            "es": "Una imagen es el resultado de una receta"
          },
          "text": {
            "en": "An image contains filesystem layers and configuration, such as its default command and user. It is not a running process. A tag is a human-readable reference to an image, not an immutable guarantee.",
            "es": "Una imagen contiene capas del sistema de archivos y configuración, como el comando y usuario por defecto. No es un proceso en ejecución. Un tag es una referencia legible, no una garantía de inmutabilidad."
          },
          "rule": {
            "en": "Files plus metadata, before execution.",
            "es": "Archivos más metadatos, antes de ejecutar."
          }
        },
        {
          "title": {
            "en": "Changes belong to the container",
            "es": "Los cambios son del contenedor"
          },
          "text": {
            "en": "Writing a file while running does not edit the underlying image. Another new container starts from the image again. Deleting a file in a later image layer can hide it without removing its bytes from earlier layers.",
            "es": "Escribir un archivo durante la ejecución no edita la imagen. Otro contenedor nuevo parte de la imagen otra vez. Borrar un archivo en una capa posterior puede ocultarlo sin quitar sus bytes de las capas anteriores."
          },
          "rule": {
            "en": "Never bake secrets into a layer.",
            "es": "Nunca metas secretos en una capa."
          }
        },
        {
          "title": {
            "en": "Inspect what you ship",
            "es": "Inspeccioná lo que distribuís"
          },
          "text": {
            "en": "docker image history shows build history; image inspect shows configuration and identifiers. The local image ID describes image configuration, while a registry digest identifies a registry object. Do not assume they are the same hash.",
            "es": "docker image history muestra la historia de construcción; image inspect muestra configuración e identificadores. El ID local describe configuración; un digest de registro identifica un objeto del registro. No supongas que son el mismo hash."
          },
          "rule": {
            "en": "Inspect content and identity separately from names.",
            "es": "Inspeccioná contenido e identidad aparte del nombre."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Does writing inside a container update its image?",
            "es": "¿Escribir dentro de un contenedor actualiza su imagen?"
          },
          "options": [
            {
              "en": "No, it changes its writable layer",
              "es": "No, cambia su capa escribible"
            },
            {
              "en": "Yes, for all new containers",
              "es": "Sí, para todos los contenedores nuevos"
            },
            {
              "en": "Only when using exec",
              "es": "Solo al usar exec"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "The image remains the starting point.",
            "es": "La imagen sigue siendo el punto de partida."
          }
        },
        {
          "question": {
            "en": "A secret is copied then deleted in a later layer. Safe?",
            "es": "Copiás un secreto y lo borrás en otra capa. ¿Está protegido?"
          },
          "options": [
            {
              "en": "Yes; history encrypts files",
              "es": "Sí; history cifra los archivos"
            },
            {
              "en": "No; earlier layer bytes may retain it",
              "es": "No; una capa anterior puede conservarlo"
            },
            {
              "en": "Yes; delete rewrites all layers",
              "es": "Sí; borrar reescribe todas las capas"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Use build secret mounts when a build needs credentials.",
            "es": "Usá montajes de secretos de build si necesitás credenciales."
          }
        },
        {
          "question": {
            "en": "Can a tag point to another image later?",
            "es": "¿Un tag puede apuntar a otra imagen después?"
          },
          "options": [
            {
              "en": "No, tags are cryptographic hashes",
              "es": "No, los tags son hashes"
            },
            {
              "en": "Only if all containers stop",
              "es": "Solo si paran todos los contenedores"
            },
            {
              "en": "Yes",
              "es": "Sí"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Use a digest to identify immutable registry content.",
            "es": "Usá un digest para identificar contenido inmutable del registro."
          }
        }
      ],
      "source": "image",
      "lab": [
        {
          "title": {
            "en": "Read image defaults",
            "es": "Leé los valores por defecto"
          },
          "text": {
            "en": "Inspect the configured user and command without starting a process.",
            "es": "Inspeccioná usuario y comando sin arrancar un proceso."
          },
          "command": "docker image inspect --format '{{.Config.User}} {{json .Config.Cmd}}' prumathe-signal:1.0.0",
          "expected": {
            "en": "10001:10001 and the Python server command.",
            "es": "10001:10001 y el comando del servidor Python."
          },
          "checks": [
            {
              "contains": "10001:10001"
            }
          ]
        },
        {
          "title": {
            "en": "Inspect build history",
            "es": "Inspeccioná la historia"
          },
          "text": {
            "en": "Read the image steps. Metadata-only instructions need not add filesystem bytes.",
            "es": "Leé los pasos de imagen. Las instrucciones solo de metadatos no necesitan agregar archivos."
          },
          "command": "docker image history prumathe-signal:1.0.0",
          "expected": {
            "en": "Build instructions, sizes and metadata entries.",
            "es": "Instrucciones de build, tamaños y metadatos."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Change one runtime layer",
            "es": "Cambiá una capa de ejecución"
          },
          "text": {
            "en": "Write a temporary file and prove it exists in that container.",
            "es": "Escribí un archivo temporal y comprobá que existe ahí."
          },
          "command": "docker run --rm prumathe-signal:1.0.0 sh -c 'echo runtime > /tmp/image-test; test -f /tmp/image-test && echo PASS'",
          "expected": {
            "en": "PASS.",
            "es": "PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Check the original artifact",
            "es": "Comprobá el artefacto original"
          },
          "text": {
            "en": "A new container starts without that runtime file.",
            "es": "Un contenedor nuevo arranca sin ese archivo de ejecución."
          },
          "command": "docker run --rm prumathe-signal:1.0.0 sh -c 'test ! -f /tmp/image-test && echo PASS'",
          "expected": {
            "en": "PASS: no image mutation occurred.",
            "es": "PASS: no se modificó la imagen."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Change the writable layer. Which image layers remain shared?",
        "es": "Cambiá la capa escribible. ¿Qué capas de imagen siguen compartidas?"
      }
    },
    {
      "id": 4,
      "unit": 1,
      "slug": "dockerfile",
      "title": {
        "en": "Build an image",
        "es": "Construí una imagen"
      },
      "intro": {
        "en": "Turn source files into an explicit, repeatable package.",
        "es": "Convertí archivos fuente en un paquete explícito y repetible."
      },
      "visual": "build",
      "frames": [
        {
          "title": {
            "en": "The build context",
            "es": "El contexto de build"
          },
          "text": {
            "en": "docker build sends a selected directory as context. COPY can read files from that context; .dockerignore excludes unnecessary or sensitive files. Our Dockerfile copies only server.py and probe.py and installs no Python packages.",
            "es": "docker build usa un directorio como contexto. COPY lee archivos de ese contexto; .dockerignore excluye archivos innecesarios o sensibles. Nuestro Dockerfile copia solo server.py y probe.py y no instala paquetes de Python."
          },
          "rule": {
            "en": "Control what enters the build.",
            "es": "Controlá lo que entra al build."
          }
        },
        {
          "title": {
            "en": "Cache follows inputs",
            "es": "La caché sigue a los insumos"
          },
          "text": {
            "en": "An unchanged instruction with unchanged inputs can reuse cached results. Changing copied source invalidates that step and following dependent steps. Keep stable setup before frequently changing source.",
            "es": "Una instrucción sin cambios y con los mismos insumos puede reutilizar resultados. Cambiar el código copiado invalida ese paso y los dependientes posteriores. Dejá la preparación estable antes del código que cambia seguido."
          },
          "rule": {
            "en": "Order layers by their rate of change.",
            "es": "Ordená las capas según cuánto cambian."
          }
        },
        {
          "title": {
            "en": "Defaults are part of the artifact",
            "es": "Los valores por defecto son parte del artefacto"
          },
          "text": {
            "en": "USER selects the runtime user. CMD supplies the default command; exec form avoids an extra shell. EXPOSE documents a port but does not publish it. We pin the base image digest and set APP_VERSION as a non-secret build argument.",
            "es": "USER elige el usuario de ejecución. CMD aporta el comando por defecto; la forma exec evita un shell extra. EXPOSE documenta un puerto pero no lo publica. Fijamos el digest base y APP_VERSION es un argumento de build sin secretos."
          },
          "rule": {
            "en": "Build configuration is not runtime configuration.",
            "es": "La configuración del build no es la de ejecución."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What can COPY read here?",
            "es": "¿Qué puede leer COPY acá?"
          },
          "options": [
            {
              "en": "Any file on any host",
              "es": "Cualquier archivo de cualquier host"
            },
            {
              "en": "Only files in running containers",
              "es": "Solo archivos de contenedores activos"
            },
            {
              "en": "Files in the build context that are not excluded",
              "es": "Archivos del contexto que no fueron excluidos"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The context defines the input boundary.",
            "es": "El contexto define el límite de entrada."
          }
        },
        {
          "question": {
            "en": "What does EXPOSE 8080 do?",
            "es": "¿Qué hace EXPOSE 8080?"
          },
          "options": [
            {
              "en": "Documents the intended port",
              "es": "Documenta el puerto previsto"
            },
            {
              "en": "Publishes 8080 on the host",
              "es": "Publica 8080 en el host"
            },
            {
              "en": "Creates a Kubernetes Service",
              "es": "Crea un Service de Kubernetes"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Publishing requires explicit runtime configuration.",
            "es": "Publicar requiere configuración explícita de ejecución."
          }
        },
        {
          "question": {
            "en": "Why copy source after stable setup?",
            "es": "¿Por qué copiar código después de la preparación estable?"
          },
          "options": [
            {
              "en": "To run without an image",
              "es": "Para ejecutar sin imagen"
            },
            {
              "en": "To reuse the earlier cached steps",
              "es": "Para reutilizar pasos anteriores de caché"
            },
            {
              "en": "To encrypt source code",
              "es": "Para cifrar código"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "A source edit need not rerun stable setup.",
            "es": "Editar código no necesita repetir la preparación estable."
          }
        }
      ],
      "source": "build",
      "lab": [
        {
          "title": {
            "en": "Build from explicit context",
            "es": "Construí desde un contexto explícito"
          },
          "text": {
            "en": "The final argument app selects the context directory. Inspect app/Dockerfile and app/.dockerignore before running.",
            "es": "El argumento final app elige el contexto. Leé app/Dockerfile y app/.dockerignore antes."
          },
          "command": "docker build -t prumathe-signal:1.0.0 app",
          "expected": {
            "en": "A successful image build.",
            "es": "Un build exitoso."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Repeat unchanged inputs",
            "es": "Repetí los mismos insumos"
          },
          "text": {
            "en": "Run the same build. Look for cached steps; timing alone does not prove cache reuse.",
            "es": "Repetí el build. Buscá pasos en caché; el tiempo solo no prueba reutilización."
          },
          "command": "docker build --progress=plain -t prumathe-signal:1.0.0 app",
          "expected": {
            "en": "Eligible unchanged steps report CACHED.",
            "es": "Los pasos sin cambios elegibles informan CACHED."
          },
          "checks": [
            {
              "contains": "CACHED"
            }
          ]
        },
        {
          "title": {
            "en": "Change a non-secret build argument",
            "es": "Cambiá un argumento sin secretos"
          },
          "text": {
            "en": "Build a second artifact with a different version value. The original 1.0.0 tag stays available.",
            "es": "Construí otro artefacto con distinto valor de versión. El tag 1.0.0 sigue disponible."
          },
          "command": "docker build --build-arg APP_VERSION=1.1.0 -t prumathe-signal:1.1.0 app",
          "expected": {
            "en": "A second image tagged 1.1.0.",
            "es": "Otra imagen con el tag 1.1.0."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Inspect the result",
            "es": "Inspeccioná el resultado"
          },
          "text": {
            "en": "Read the environment in each artifact. These are defaults before runtime overrides.",
            "es": "Leé el entorno de cada artefacto. Son valores por defecto antes de reemplazos de ejecución."
          },
          "command": "docker run --rm prumathe-signal:1.0.0 printenv APP_VERSION\ndocker run --rm prumathe-signal:1.1.0 printenv APP_VERSION",
          "expected": {
            "en": "1.0.0 then 1.1.0.",
            "es": "1.0.0 y después 1.1.0."
          },
          "checks": [
            {
              "contains": "1.1.0"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Move the changed input. Which later steps lose their cached result?",
        "es": "Mové el insumo que cambió. ¿Qué pasos posteriores pierden la caché?"
      }
    },
    {
      "id": 5,
      "unit": 2,
      "slug": "storage",
      "title": {
        "en": "Data that outlives a container",
        "es": "Datos que sobreviven al contenedor"
      },
      "intro": {
        "en": "Separate the lifetime of a process from the lifetime of its data.",
        "es": "Separá la vida del proceso de la vida de sus datos."
      },
      "visual": "volume",
      "frames": [
        {
          "title": {
            "en": "Three places to write",
            "es": "Tres lugares para escribir"
          },
          "text": {
            "en": "The writable layer belongs to one container. A named volume is managed by Docker and can be mounted again. A bind mount exposes a specified host path; host layout and permissions now matter.",
            "es": "La capa escribible pertenece a un contenedor. Docker administra un volumen con nombre y permite volver a montarlo. Un bind mount expone una ruta del host; importan su organización y sus permisos."
          },
          "rule": {
            "en": "Choose storage by its owner and lifetime.",
            "es": "Elegí almacenamiento según su dueño y duración."
          }
        },
        {
          "title": {
            "en": "Replace the process",
            "es": "Reemplazá el proceso"
          },
          "text": {
            "en": "Compose mounts signal-data at /data. Write a marker, replace the app container, then read it. The same volume is attached to the replacement. Mounting storage does not automatically coordinate concurrent writers.",
            "es": "Compose monta signal-data en /data. Escribí una marca, reemplazá el contenedor y leela. El reemplazo usa el mismo volumen. Montar almacenamiento no coordina automáticamente escrituras simultáneas."
          },
          "rule": {
            "en": "Persistence is independent of process identity.",
            "es": "La persistencia es independiente de la identidad del proceso."
          }
        },
        {
          "title": {
            "en": "Retention is not backup",
            "es": "Retener no es respaldar"
          },
          "text": {
            "en": "docker compose down preserves named volumes by default; down -v removes project volumes. Neither a volume nor a bind mount is a backup. The lab never asks you to prune unrelated Docker resources.",
            "es": "docker compose down conserva volúmenes con nombre por defecto; down -v elimina los del proyecto. Ni un volumen ni un bind mount son un respaldo. El lab nunca te pide purgar recursos de Docker ajenos."
          },
          "rule": {
            "en": "Know the deletion boundary before cleaning up.",
            "es": "Conocé qué se borra antes de limpiar."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What survives replacing this app container?",
            "es": "¿Qué sobrevive al reemplazo de este contenedor?"
          },
          "options": [
            {
              "en": "Its process ID",
              "es": "Su ID de proceso"
            },
            {
              "en": "The named volume",
              "es": "El volumen con nombre"
            },
            {
              "en": "All writable layer files",
              "es": "Todos los archivos de su capa escribible"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "The replacement mounts the same volume.",
            "es": "El reemplazo monta el mismo volumen."
          }
        },
        {
          "question": {
            "en": "What makes a bind mount host-dependent?",
            "es": "¿Qué hace que un bind mount dependa del host?"
          },
          "options": [
            {
              "en": "Its image tag",
              "es": "El tag de la imagen"
            },
            {
              "en": "Its HTTP status",
              "es": "Su estado HTTP"
            },
            {
              "en": "Its source path and permissions",
              "es": "Su ruta de origen y sus permisos"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The host supplies the mounted files.",
            "es": "El host aporta los archivos montados."
          }
        },
        {
          "question": {
            "en": "Does persistence prove recoverability after disk loss?",
            "es": "¿Persistir prueba recuperación tras perder el disco?"
          },
          "options": [
            {
              "en": "No; you need a tested backup strategy",
              "es": "No; necesitás una estrategia de respaldo probada"
            },
            {
              "en": "Yes, Docker replicates every volume",
              "es": "Sí, Docker replica todo volumen"
            },
            {
              "en": "Yes, down always takes a backup",
              "es": "Sí, down siempre respalda"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "This experiment only replaces the container, not the storage device.",
            "es": "Este experimento reemplaza el contenedor, no el dispositivo de almacenamiento."
          }
        }
      ],
      "source": "volume",
      "lab": [
        {
          "title": {
            "en": "Start the practice service",
            "es": "Arrancá el servicio de práctica"
          },
          "text": {
            "en": "From labs, after lesson 00. This starts only the course Compose project.",
            "es": "Desde labs, después de la lección 00. Arranca solo el proyecto Compose del curso."
          },
          "command": "docker compose up -d --wait app",
          "expected": {
            "en": "The app is healthy. No other project is reset.",
            "es": "La aplicación está healthy. No se reinicia otro proyecto."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Write to the mounted volume",
            "es": "Escribí en el volumen"
          },
          "text": {
            "en": "The app runs as UID 10001 and owns /data. Store a marker there.",
            "es": "La app corre como UID 10001 y es dueña de /data. Guardá una marca."
          },
          "command": "docker compose exec -T app sh -c 'echo volume-survived > /data/marker'",
          "expected": {
            "en": "The write succeeds without root.",
            "es": "La escritura funciona sin root."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Replace the app container",
            "es": "Reemplazá el contenedor"
          },
          "text": {
            "en": "Recreate only app while retaining the named volume.",
            "es": "Recreá solo app conservando el volumen."
          },
          "command": "docker compose up -d --wait --force-recreate app",
          "expected": {
            "en": "A replacement app becomes healthy.",
            "es": "Una app reemplazada llega a healthy."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Read retained data",
            "es": "Leé datos conservados"
          },
          "text": {
            "en": "Check the marker and the mount type. Do not use down -v unless you intend to delete practice data.",
            "es": "Revisá la marca y el tipo de montaje. No uses down -v salvo que quieras borrar datos de práctica."
          },
          "command": "docker compose exec -T app cat /data/marker\ndocker inspect --format '{{json .Mounts}}' prumathe-dk-app-1",
          "expected": {
            "en": "volume-survived and a volume mounted at /data.",
            "es": "volume-survived y un volumen montado en /data."
          },
          "checks": [
            {
              "contains": "volume-survived"
            },
            {
              "contains": "/data"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Replace the container. Follow the marker stored in the volume.",
        "es": "Reemplazá el contenedor. Seguí la marca del volumen."
      }
    },
    {
      "id": 6,
      "unit": 2,
      "slug": "networks",
      "title": {
        "en": "Names on a network",
        "es": "Nombres en una red"
      },
      "intro": {
        "en": "Find a service without memorizing its container address.",
        "es": "Encontrá un servicio sin memorizar la dirección del contenedor."
      },
      "visual": "network",
      "frames": [
        {
          "title": {
            "en": "A network has a scope",
            "es": "Una red tiene un alcance"
          },
          "text": {
            "en": "Compose creates a network for its project. Containers on it can find services by service name. app resolves inside that network; it is not automatically a hostname on your laptop.",
            "es": "Compose crea una red para el proyecto. Los contenedores conectados encuentran servicios por nombre. app se resuelve dentro de esa red; no se vuelve automáticamente un nombre de tu laptop."
          },
          "rule": {
            "en": "DNS names belong to a network scope.",
            "es": "Los nombres DNS pertenecen a un ámbito de red."
          }
        },
        {
          "title": {
            "en": "Localhost means here",
            "es": "Localhost significa acá"
          },
          "text": {
            "en": "Inside the toolbox container, localhost points back to the toolbox. Use app:8080 to reach the app container. Replacing the app can change its address while the service name remains usable.",
            "es": "Dentro del contenedor toolbox, localhost apunta al propio toolbox. Usá app:8080 para llegar a la aplicación. Reemplazarla puede cambiar su dirección, mientras el nombre de servicio sigue siendo útil."
          },
          "rule": {
            "en": "A remote service is not your loopback address.",
            "es": "Un servicio remoto no es tu dirección de loopback."
          }
        },
        {
          "title": {
            "en": "Connectivity is not authorization",
            "es": "Conectividad no es autorización"
          },
          "text": {
            "en": "A shared Docker network permits communication; it does not authenticate application requests. The lab checks DNS and HTTP separately so a name-resolution failure is not confused with an application error.",
            "es": "Una red compartida permite comunicar; no autentica pedidos de la aplicación. El lab revisa DNS y HTTP por separado para no confundir una falla de resolución con un error de aplicación."
          },
          "rule": {
            "en": "Diagnose name, connection, then response.",
            "es": "Diagnosticá nombre, conexión y después respuesta."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Where does localhost point inside toolbox?",
            "es": "¿Adónde apunta localhost dentro de toolbox?"
          },
          "options": [
            {
              "en": "To toolbox itself",
              "es": "Al propio toolbox"
            },
            {
              "en": "To the Docker host automatically",
              "es": "Al host Docker automáticamente"
            },
            {
              "en": "To the app service",
              "es": "Al servicio app"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Each network namespace has its own loopback.",
            "es": "Cada espacio de red tiene su loopback."
          }
        },
        {
          "question": {
            "en": "Which address should a peer use here?",
            "es": "¿Qué dirección debería usar otro servicio acá?"
          },
          "options": [
            {
              "en": "A hardcoded container IP",
              "es": "Una IP fija de contenedor"
            },
            {
              "en": "localhost:18080",
              "es": "localhost:18080"
            },
            {
              "en": "app:8080",
              "es": "app:8080"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The service name resolves on the Compose network.",
            "es": "El nombre se resuelve en la red de Compose."
          }
        },
        {
          "question": {
            "en": "Does shared network access authenticate a request?",
            "es": "¿Compartir red autentica un pedido?"
          },
          "options": [
            {
              "en": "Yes, by container ID",
              "es": "Sí, por ID de contenedor"
            },
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes, by service name",
              "es": "Sí, por nombre de servicio"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Applications still need their own access controls when required.",
            "es": "Las aplicaciones necesitan sus controles de acceso cuando corresponda."
          }
        }
      ],
      "source": "network",
      "lab": [
        {
          "title": {
            "en": "Start the practice service",
            "es": "Arrancá el servicio de práctica"
          },
          "text": {
            "en": "From labs, after lesson 00. This starts only the course Compose project.",
            "es": "Desde labs, después de la lección 00. Arranca solo el proyecto Compose del curso."
          },
          "command": "docker compose up -d --wait app",
          "expected": {
            "en": "The app is healthy. No other project is reset.",
            "es": "La aplicación está healthy. No se reinicia otro proyecto."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Resolve the service name",
            "es": "Resolvé el nombre"
          },
          "text": {
            "en": "Use a one-off peer on the Compose network. Overriding entrypoint lets us inspect DNS with the same image. From the host, the name app does not resolve: the name exists only inside the Compose network.",
            "es": "Usá un contenedor temporal de la red. Reemplazar entrypoint permite inspeccionar DNS con la misma imagen. Desde el host, el nombre app no resuelve: el nombre existe solo dentro de la red de Compose."
          },
          "command": "docker compose run --rm --no-deps --entrypoint python toolbox -c \"import socket; print(socket.gethostbyname('app'))\"",
          "expected": {
            "en": "An internal IP address, which you do not hardcode.",
            "es": "Una IP interna que no tenés que fijar."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Request the internal endpoint",
            "es": "Consultá el endpoint interno"
          },
          "text": {
            "en": "The toolbox default URL is http://app:8080. The host port is not involved.",
            "es": "La URL de toolbox es http://app:8080. No interviene el puerto del host."
          },
          "command": "docker compose run --rm --no-deps toolbox",
          "expected": {
            "en": "hello-compose and PASS.",
            "es": "hello-compose y PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Inspect network membership",
            "es": "Inspeccioná miembros de red"
          },
          "text": {
            "en": "Read only this course network. Container addresses are runtime details, not durable configuration.",
            "es": "Leé solo la red del curso. Las direcciones son detalles de ejecución, no configuración durable."
          },
          "command": "docker network inspect prumathe-dk_default",
          "expected": {
            "en": "The app is attached to the project network.",
            "es": "La app está conectada a la red del proyecto."
          },
          "checks": [
            {
              "contains": "prumathe-dk-app-1"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Disconnect the peer. Why does a service name only help inside its network?",
        "es": "Desconectá el cliente. ¿Por qué el nombre de servicio ayuda solo dentro de su red?"
      }
    },
    {
      "id": 7,
      "unit": 2,
      "slug": "ports",
      "title": {
        "en": "Publish a port deliberately",
        "es": "Publicá un puerto a propósito"
      },
      "intro": {
        "en": "Distinguish listening, exposing and publishing.",
        "es": "Distinguí escuchar, declarar y publicar."
      },
      "visual": "ports",
      "frames": [
        {
          "title": {
            "en": "The application listens",
            "es": "La aplicación escucha"
          },
          "text": {
            "en": "Signal listens on 0.0.0.0:8080 inside the container. Listening only on 127.0.0.1 inside it would prevent peers from reaching that socket. The process must actually listen even if the image declares EXPOSE.",
            "es": "Signal escucha en 0.0.0.0:8080 dentro del contenedor. Escuchar solo en 127.0.0.1 interno impediría que otros contenedores lleguen a ese socket. El proceso tiene que escuchar aunque la imagen declare EXPOSE."
          },
          "rule": {
            "en": "A declared port is not an open socket.",
            "es": "Un puerto declarado no es un socket abierto."
          }
        },
        {
          "title": {
            "en": "The host forwards traffic",
            "es": "El host reenvía tráfico"
          },
          "text": {
            "en": "Compose publishes 127.0.0.1:18080 to container port 8080. Your browser uses the host port; peers use the internal port. Binding to loopback limits this published endpoint to the local host.",
            "es": "Compose publica 127.0.0.1:18080 hacia el puerto 8080 del contenedor. Tu navegador usa el puerto del host; otros contenedores usan el interno. Vincularlo a loopback limita ese punto publicado al host local."
          },
          "rule": {
            "en": "Host port and container port are different coordinates.",
            "es": "El puerto del host y el del contenedor son coordenadas distintas."
          }
        },
        {
          "title": {
            "en": "Follow the failed hop",
            "es": "Seguí el salto que falla"
          },
          "text": {
            "en": "Check the port mapping, then request the published URL and the internal URL. A port already in use prevents a new bind. Do not solve a collision by exposing every interface without understanding the scope.",
            "es": "Revisá el mapeo y consultá la URL publicada y la interna. Un puerto ocupado impide un nuevo enlace. No resuelvas una colisión exponiendo todas las interfaces sin entender el alcance."
          },
          "rule": {
            "en": "Trace the route before changing the binding.",
            "es": "Seguí la ruta antes de cambiar el enlace."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Which port does the host browser use?",
            "es": "¿Qué puerto usa el navegador del host?"
          },
          "options": [
            {
              "en": "8080 always",
              "es": "8080 siempre"
            },
            {
              "en": "The container process ID",
              "es": "El ID de proceso del contenedor"
            },
            {
              "en": "18080",
              "es": "18080"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The mapping forwards host 18080 to container 8080.",
            "es": "El mapeo lleva 18080 del host a 8080 del contenedor."
          }
        },
        {
          "question": {
            "en": "Can EXPOSE start a listener?",
            "es": "¿EXPOSE puede arrancar un listener?"
          },
          "options": [
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only on Linux",
              "es": "Solo en Linux"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "The process opens the socket.",
            "es": "El proceso abre el socket."
          }
        },
        {
          "question": {
            "en": "What does 127.0.0.1 in this mapping limit?",
            "es": "¿Qué limita 127.0.0.1 en este mapeo?"
          },
          "options": [
            {
              "en": "The container image size",
              "es": "El tamaño de imagen"
            },
            {
              "en": "The host interfaces used by the published endpoint",
              "es": "Las interfaces del host usadas por el puerto publicado"
            },
            {
              "en": "The app CPU",
              "es": "La CPU de la aplicación"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "It binds the host side to loopback.",
            "es": "Vincula el lado del host a loopback."
          }
        }
      ],
      "source": "ports",
      "lab": [
        {
          "title": {
            "en": "Start the practice service",
            "es": "Arrancá el servicio de práctica"
          },
          "text": {
            "en": "From labs, after lesson 00. This starts only the course Compose project.",
            "es": "Desde labs, después de la lección 00. Arranca solo el proyecto Compose del curso."
          },
          "command": "docker compose up -d --wait app",
          "expected": {
            "en": "The app is healthy. No other project is reset.",
            "es": "La aplicación está healthy. No se reinicia otro proyecto."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Read the published address",
            "es": "Leé la dirección publicada"
          },
          "text": {
            "en": "Ask Compose which host address maps to the internal port.",
            "es": "Consultá a Compose qué dirección del host mapea al puerto interno."
          },
          "command": "docker compose port app 8080",
          "expected": {
            "en": "127.0.0.1:18080.",
            "es": "127.0.0.1:18080."
          },
          "checks": [
            {
              "contains": "127.0.0.1:18080"
            }
          ]
        },
        {
          "title": {
            "en": "Trace the internal side",
            "es": "Seguí el lado interno"
          },
          "text": {
            "en": "This request originates inside the app container. Open http://127.0.0.1:18080 separately in your host browser to compare the host side.",
            "es": "Este pedido sale desde la app. Abrí http://127.0.0.1:18080 aparte en tu navegador del host para comparar."
          },
          "command": "docker compose exec -T app python /app/probe.py http://127.0.0.1:8080 hello-compose",
          "expected": {
            "en": "The same application payload and PASS. The host URL returns that service too.",
            "es": "El mismo contenido y PASS. La URL del host devuelve ese servicio también."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Inspect the explicit binding",
            "es": "Inspeccioná el enlace explícito"
          },
          "text": {
            "en": "Check HostIp and HostPort rather than assuming the image EXPOSE published anything.",
            "es": "Revisá HostIp y HostPort en vez de suponer que EXPOSE publicó algo."
          },
          "command": "docker inspect --format '{{json .HostConfig.PortBindings}}' prumathe-dk-app-1",
          "expected": {
            "en": "8080/tcp maps to 127.0.0.1 and 18080.",
            "es": "8080/tcp mapea a 127.0.0.1 y 18080."
          },
          "checks": [
            {
              "contains": "18080"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Switch the host binding. Trace host port 18080 to container port 8080.",
        "es": "Cambiá el enlace del host. Seguí 18080 del host hasta 8080 del contenedor."
      }
    },
    {
      "id": 8,
      "unit": 2,
      "slug": "compose",
      "title": {
        "en": "Describe the local system",
        "es": "Describí el sistema local"
      },
      "intro": {
        "en": "Services, networks and volumes in one readable file.",
        "es": "Servicios, redes y volúmenes en un archivo legible."
      },
      "visual": "compose",
      "frames": [
        {
          "title": {
            "en": "From commands to a model",
            "es": "De comandos a un modelo"
          },
          "text": {
            "en": "Compose names services and their runtime configuration. Our app and optional toolbox share a network; only app publishes a port. The project name prumathe-dk scopes the resources created by this kit.",
            "es": "Compose nombra servicios y su configuración. La aplicación y toolbox opcional comparten red; solo app publica un puerto. El proyecto prumathe-dk delimita los recursos creados por el kit."
          },
          "rule": {
            "en": "Read the configuration before starting it.",
            "es": "Leé la configuración antes de arrancarla."
          }
        },
        {
          "title": {
            "en": "Running versus healthy",
            "es": "Corriendo versus healthy"
          },
          "text": {
            "en": "up -d --wait waits for running or healthy service state. The image health check probes /health. This check does not test every business operation, and ordinary start order is not the same as dependency readiness.",
            "es": "up -d --wait espera estado running o healthy. El health check de la imagen consulta /health. No prueba toda operación de negocio, y el orden de arranque común no equivale a readiness de dependencias."
          },
          "rule": {
            "en": "Define what healthy actually measures.",
            "es": "Definí qué mide healthy."
          }
        },
        {
          "title": {
            "en": "A local lifecycle",
            "es": "Un ciclo de vida local"
          },
          "text": {
            "en": "config renders the resolved configuration; ps shows state; logs shows output; down removes project containers and networks. Compose on this host does not provide a distributed Kubernetes control plane.",
            "es": "config muestra la configuración resuelta; ps muestra estado; logs muestra salida; down elimina contenedores y redes del proyecto. Compose en este host no aporta un plano de control distribuido de Kubernetes."
          },
          "rule": {
            "en": "Use a tool within its operating boundary.",
            "es": "Usá una herramienta dentro de su alcance."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What does config help verify?",
            "es": "¿Qué ayuda a verificar config?"
          },
          "options": [
            {
              "en": "That every business operation passed",
              "es": "Que pasó toda operación de negocio"
            },
            {
              "en": "The Kubernetes scheduler",
              "es": "El scheduler de Kubernetes"
            },
            {
              "en": "The resolved Compose model",
              "es": "El modelo resuelto de Compose"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Configuration validation and runtime tests answer different questions.",
            "es": "Validar configuración y ejecutar pruebas responde preguntas distintas."
          }
        },
        {
          "question": {
            "en": "Does running imply ready for traffic?",
            "es": "¿Running implica estar listo para tráfico?"
          },
          "options": [
            {
              "en": "Only when logs are empty",
              "es": "Solo si no hay logs"
            },
            {
              "en": "No, define and check readiness",
              "es": "No, definí y comprobá readiness"
            },
            {
              "en": "Yes, a process always accepts traffic",
              "es": "Sí, un proceso siempre acepta tráfico"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "A started process can still be initializing.",
            "es": "Un proceso arrancado puede seguir inicializándose."
          }
        },
        {
          "question": {
            "en": "What does ordinary down preserve here?",
            "es": "¿Qué conserva down común acá?"
          },
          "options": [
            {
              "en": "Named volumes",
              "es": "Volúmenes con nombre"
            },
            {
              "en": "Running app processes",
              "es": "Procesos activos de app"
            },
            {
              "en": "Project networks",
              "es": "Redes del proyecto"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Volume deletion requires an explicit additional option.",
            "es": "Borrar volúmenes requiere una opción adicional explícita."
          }
        }
      ],
      "source": "compose",
      "lab": [
        {
          "title": {
            "en": "Read the resolved model",
            "es": "Leé el modelo resuelto"
          },
          "text": {
            "en": "Compose validates and renders configuration without starting containers. Only a fake secret is used.",
            "es": "Compose valida y muestra configuración sin arrancar contenedores. Se usa solo un secreto falso."
          },
          "command": "docker compose config",
          "expected": {
            "en": "app, the signal-data volume, the demo_token secret and the 127.0.0.1:18080 port mapping. toolbox does not appear: its tools profile is inactive.",
            "es": "app, el volumen signal-data, el secreto demo_token y el puerto 127.0.0.1:18080. toolbox no aparece: su perfil tools está inactivo."
          },
          "checks": [
            {
              "contains": "hello-compose"
            }
          ]
        },
        {
          "title": {
            "en": "Start the practice service",
            "es": "Arrancá el servicio de práctica"
          },
          "text": {
            "en": "From labs, after lesson 00. This starts only the course Compose project.",
            "es": "Desde labs, después de la lección 00. Arranca solo el proyecto Compose del curso."
          },
          "command": "docker compose up -d --wait app",
          "expected": {
            "en": "The app is healthy. No other project is reset.",
            "es": "La aplicación está healthy. No se reinicia otro proyecto."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Observe state and output",
            "es": "Observá estado y salida"
          },
          "text": {
            "en": "Generate a request, then inspect service state and recent logs.",
            "es": "Generá un pedido e inspeccioná estado y logs recientes."
          },
          "command": "docker compose run --rm --no-deps toolbox\ndocker compose ps\ndocker compose logs --tail 5 app",
          "expected": {
            "en": "A healthy app and HTTP request logs.",
            "es": "App healthy y logs de pedidos HTTP."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Exercise a local restart",
            "es": "Probá un reinicio local"
          },
          "text": {
            "en": "Restart the service, then wait for its health before checking the response again.",
            "es": "Reiniciá el servicio y esperá su salud antes de comprobar otra respuesta."
          },
          "command": "docker compose restart app\ndocker compose up -d --wait app\ndocker compose run --rm --no-deps toolbox",
          "expected": {
            "en": "PASS after recovery. A restart is not a rebuild.",
            "es": "PASS tras recuperarse. Reiniciar no reconstruye."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Stop app while keeping its volume. Which parts of the Compose model still exist?",
        "es": "Detené app conservando el volumen. ¿Qué partes del modelo siguen existiendo?"
      }
    },
    {
      "id": 9,
      "unit": 3,
      "slug": "configuration",
      "title": {
        "en": "Configuration and secrets",
        "es": "Configuración y secretos"
      },
      "intro": {
        "en": "Keep the artifact stable while runtime settings change.",
        "es": "Mantené estable el artefacto mientras cambia la configuración."
      },
      "visual": "config",
      "frames": [
        {
          "title": {
            "en": "Runtime inputs",
            "es": "Entradas de ejecución"
          },
          "text": {
            "en": "MESSAGE is an environment variable read when the process starts. Two containers from one image can print different messages. The image does not need rebuilding for this runtime setting.",
            "es": "MESSAGE es una variable de entorno leída al arrancar el proceso. Dos contenedores de una imagen pueden mostrar mensajes distintos. No hace falta reconstruir para cambiar ese valor de ejecución."
          },
          "rule": {
            "en": "Separate the release from its environment.",
            "es": "Separá la versión de su entorno."
          }
        },
        {
          "title": {
            "en": "Secrets are not build arguments",
            "es": "Los secretos no son argumentos de build"
          },
          "text": {
            "en": "Build arguments and ordinary environment variables are poor hiding places for credentials. The Compose fixture mounts a deliberately fake token at /run/secrets/demo_token. Local Compose secrets are file mounts, not an automatic encrypted vault.",
            "es": "Los argumentos de build y las variables comunes son malos escondites para credenciales. Compose monta un token deliberadamente falso en /run/secrets/demo_token. Los secretos locales de Compose son montajes de archivos, no una bóveda cifrada automática."
          },
          "rule": {
            "en": "A secret delivery mechanism still needs protection.",
            "es": "Un mecanismo de entrega de secretos también necesita protección."
          }
        },
        {
          "title": {
            "en": "Change and restart deliberately",
            "es": "Cambiá y reiniciá a propósito"
          },
          "text": {
            "en": "Editing an environment source does not rewrite an already running process environment. Recreate the container with the new configuration. Do not print real credentials while inspecting a system.",
            "es": "Editar la fuente de una variable no reescribe el entorno de un proceso activo. Recreá el contenedor con la nueva configuración. No imprimas credenciales reales al inspeccionar un sistema."
          },
          "rule": {
            "en": "Know when the application reads each setting.",
            "es": "Conocé cuándo lee cada valor la aplicación."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Do runtime settings always require a new image?",
            "es": "¿Cambiar valores de ejecución siempre requiere imagen nueva?"
          },
          "options": [
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only on Kubernetes",
              "es": "Solo en Kubernetes"
            },
            {
              "en": "No",
              "es": "No"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The same artifact can accept different runtime inputs.",
            "es": "El mismo artefacto admite entradas distintas."
          }
        },
        {
          "question": {
            "en": "Does a Compose secret automatically encrypt its host file?",
            "es": "¿Un secreto de Compose cifra automáticamente su archivo del host?"
          },
          "options": [
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only with EXPOSE",
              "es": "Solo con EXPOSE"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Protect source files and limit access yourself.",
            "es": "Protegé los archivos de origen y limitá su acceso."
          }
        },
        {
          "question": {
            "en": "A running process needs a new environment value. What next?",
            "es": "Un proceso necesita un nuevo valor de entorno. ¿Qué sigue?"
          },
          "options": [
            {
              "en": "Read logs again",
              "es": "Volvé a leer logs"
            },
            {
              "en": "Recreate it with the new configuration",
              "es": "Recrealo con la configuración nueva"
            },
            {
              "en": "Rename its image tag only",
              "es": "Renombrá solo su tag"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "An existing process environment does not update itself.",
            "es": "El entorno de un proceso existente no se actualiza solo."
          }
        }
      ],
      "source": "secrets",
      "lab": [
        {
          "title": {
            "en": "Start the practice service",
            "es": "Arrancá el servicio de práctica"
          },
          "text": {
            "en": "From labs, after lesson 00. This starts only the course Compose project.",
            "es": "Desde labs, después de la lección 00. Arranca solo el proyecto Compose del curso."
          },
          "command": "docker compose up -d --wait app",
          "expected": {
            "en": "The app is healthy. No other project is reset.",
            "es": "La aplicación está healthy. No se reinicia otro proyecto."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Override a runtime value",
            "es": "Reemplazá un valor de ejecución"
          },
          "text": {
            "en": "Start a short-lived container with a different MESSAGE. No image rebuild occurs.",
            "es": "Arrancá un contenedor temporal con otro MESSAGE. No reconstruye imagen."
          },
          "command": "docker run --rm -e MESSAGE=runtime-value prumathe-signal:1.0.0 printenv MESSAGE",
          "expected": {
            "en": "runtime-value.",
            "es": "runtime-value."
          },
          "checks": [
            {
              "contains": "runtime-value"
            }
          ]
        },
        {
          "title": {
            "en": "Check the fake secret mount",
            "es": "Comprobá el secreto falso montado"
          },
          "text": {
            "en": "Assert the file exists without printing its contents. The fixture is deliberately not a real credential.",
            "es": "Comprobá que existe sin imprimirlo. El ejemplo no es una credencial real."
          },
          "command": "docker compose exec -T app sh -c 'test -s /run/secrets/demo_token && echo PASS'",
          "expected": {
            "en": "PASS: a readable nonempty file was delivered.",
            "es": "PASS: se entregó un archivo legible y no vacío."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Compare with the Compose process",
            "es": "Compará con el proceso Compose"
          },
          "text": {
            "en": "The separate temporary override did not change the already running app.",
            "es": "El reemplazo temporal no cambió la app que ya corría."
          },
          "command": "docker compose exec -T app printenv MESSAGE",
          "expected": {
            "en": "hello-compose, unchanged.",
            "es": "hello-compose, sin cambios."
          },
          "checks": [
            {
              "contains": "hello-compose"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Change the configured value, then restart the model process. When does it read the new value?",
        "es": "Cambiá el valor configurado y reiniciá el proceso del modelo. ¿Cuándo lee el nuevo valor?"
      }
    },
    {
      "id": 10,
      "unit": 3,
      "slug": "health-resources",
      "title": {
        "en": "Health and resource limits",
        "es": "Salud y límites de recursos"
      },
      "intro": {
        "en": "A status signal and a resource budget solve different problems.",
        "es": "Una señal de salud y un presupuesto de recursos resuelven problemas distintos."
      },
      "visual": "health",
      "frames": [
        {
          "title": {
            "en": "Probe one property",
            "es": "Sondeá una propiedad"
          },
          "text": {
            "en": "Our Docker health check sends an HTTP request to /health. The /tmp/fail-live file makes that endpoint return 503 for an intentional exercise. An unhealthy container can still have a running main process.",
            "es": "El health check envía HTTP a /health. El archivo /tmp/fail-live hace que devuelva 503 para practicar. Un contenedor unhealthy puede seguir con su proceso principal activo."
          },
          "rule": {
            "en": "Unhealthy is not synonymous with stopped.",
            "es": "Unhealthy no es sinónimo de detenido."
          }
        },
        {
          "title": {
            "en": "Bound consumption",
            "es": "Limitá el consumo"
          },
          "text": {
            "en": "Compose sets 0.5 CPU and 128 MiB memory for the app. CPU limits constrain execution time; memory exhaustion can kill processes. A limit does not make the application efficient or prove adequate capacity.",
            "es": "Compose configura 0,5 CPU y 128 MiB para app. Limitar CPU restringe tiempo de ejecución; agotar memoria puede matar procesos. Un límite no vuelve eficiente la aplicación ni prueba capacidad suficiente."
          },
          "rule": {
            "en": "A limit is a boundary, not a performance target.",
            "es": "Un límite es una frontera, no un objetivo de rendimiento."
          }
        },
        {
          "title": {
            "en": "Observe recovery",
            "es": "Observá la recuperación"
          },
          "text": {
            "en": "Remove the failure file and wait for the health check to recover. Docker health status alone does not restart an unhealthy container. Restart policies concern process exit and require separate configuration.",
            "es": "Borrá el archivo de falla y esperá recuperación del health check. El estado de salud de Docker por sí solo no reinicia un contenedor unhealthy. Las políticas de reinicio se relacionan con la salida del proceso y necesitan configuración aparte."
          },
          "rule": {
            "en": "A detector and a recovery mechanism are separate.",
            "es": "El detector y el mecanismo de recuperación son distintos."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Does unhealthy mean the main process exited?",
            "es": "¿Unhealthy significa que terminó el proceso principal?"
          },
          "options": [
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only with HTTP probes",
              "es": "Solo con sondas HTTP"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "The probe can fail while the server runs.",
            "es": "La sonda puede fallar mientras corre el servidor."
          }
        },
        {
          "question": {
            "en": "Does a Docker health check automatically restart this app?",
            "es": "¿Este health check reinicia automáticamente app?"
          },
          "options": [
            {
              "en": "Yes, every failure",
              "es": "Sí, cada falla"
            },
            {
              "en": "Only after three successes",
              "es": "Solo después de tres éxitos"
            },
            {
              "en": "No",
              "es": "No"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "This lab observes status; it does not configure a health-based restarter.",
            "es": "El lab observa estado; no configura un reiniciador por salud."
          }
        },
        {
          "question": {
            "en": "What does the memory limit guarantee?",
            "es": "¿Qué garantiza el límite de memoria?"
          },
          "options": [
            {
              "en": "Unlimited swap",
              "es": "Swap ilimitado"
            },
            {
              "en": "A configured consumption boundary, not enough capacity",
              "es": "Un límite configurado, no capacidad suficiente"
            },
            {
              "en": "No possible application failure",
              "es": "Que nunca falle la aplicación"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Measure real workloads to choose useful budgets.",
            "es": "Medí cargas reales para elegir presupuestos útiles."
          }
        }
      ],
      "source": "healthcheck",
      "lab": [
        {
          "title": {
            "en": "Start the practice service",
            "es": "Arrancá el servicio de práctica"
          },
          "text": {
            "en": "From labs, after lesson 00. This starts only the course Compose project.",
            "es": "Desde labs, después de la lección 00. Arranca solo el proyecto Compose del curso."
          },
          "command": "docker compose up -d --wait app",
          "expected": {
            "en": "The app is healthy. No other project is reset.",
            "es": "La aplicación está healthy. No se reinicia otro proyecto."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Inspect resource configuration",
            "es": "Inspeccioná recursos configurados"
          },
          "text": {
            "en": "Read the runtime limits that Compose applied.",
            "es": "Leé los límites que aplicó Compose."
          },
          "command": "docker inspect --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' prumathe-dk-app-1",
          "expected": {
            "en": "134217728 bytes and 500000000 NanoCpus; 500000000 NanoCpus equals 0.5 CPU.",
            "es": "134217728 bytes y 500000000 NanoCpus; 500000000 NanoCpus equivalen a 0,5 CPU."
          },
          "checks": [
            {
              "contains": "134217728 500000000"
            }
          ]
        },
        {
          "title": {
            "en": "Make the health endpoint fail",
            "es": "Hacé fallar el endpoint de salud"
          },
          "text": {
            "en": "Create the teaching failure flag. Repeat the inspect command until unhealthy, allowing about 15 seconds for probe retries. The process stays running.",
            "es": "Creá la marca didáctica. Repetí inspect hasta unhealthy, dando unos 15 segundos a los reintentos. El proceso sigue corriendo."
          },
          "command": "docker compose exec -T app touch /tmp/fail-live\ndocker inspect --format '{{.State.Health.Status}} {{.State.Running}}' prumathe-dk-app-1",
          "expected": {
            "en": "Eventually unhealthy true.",
            "es": "Eventualmente unhealthy true."
          },
          "checks": [
            {
              "contains": "unhealthy true",
              "retry": 30
            }
          ]
        },
        {
          "title": {
            "en": "Restore health",
            "es": "Restaurá salud"
          },
          "text": {
            "en": "Remove only the failure flag and query the endpoint. Repeat the final inspect until healthy: status updates on the next probe. Compose up --wait can fail immediately while the old unhealthy status remains.",
            "es": "Borrá solo la marca y consultá el endpoint. Repetí inspect hasta healthy: el estado cambia con la próxima sonda. Compose up --wait puede fallar mientras queda el estado unhealthy anterior."
          },
          "command": "docker compose exec -T app rm /tmp/fail-live\ndocker compose exec -T app python /app/probe.py http://127.0.0.1:8080/health ok\ndocker inspect --format '{{.State.Health.Status}} {{.State.Running}}' prumathe-dk-app-1",
          "expected": {
            "en": "PASS and eventually healthy true, without restarting or rebuilding.",
            "es": "PASS y eventualmente healthy true, sin reiniciar ni reconstruir."
          },
          "checks": [
            {
              "contains": "PASS"
            },
            {
              "exactLine": "healthy true",
              "retry": 20
            }
          ]
        }
      ],
      "experiment": {
        "en": "Fail the Docker health check. Does the model process stop automatically?",
        "es": "Fallá el health check Docker. ¿El proceso se detiene automáticamente?"
      }
    },
    {
      "id": 11,
      "unit": 3,
      "slug": "shipping",
      "title": {
        "en": "Tags, digests and delivery",
        "es": "Tags, digests y distribución"
      },
      "intro": {
        "en": "Move an artifact without confusing its name with its identity.",
        "es": "Mové un artefacto sin confundir su nombre con su identidad."
      },
      "visual": "registry",
      "frames": [
        {
          "title": {
            "en": "Tags are references",
            "es": "Los tags son referencias"
          },
          "text": {
            "en": "docker tag gives an existing image another name. It does not copy or modify its layers. A registry stores image content for pull and push; this course uses local images and does not publish to a remote account.",
            "es": "docker tag le da otro nombre a una imagen. No copia ni modifica sus capas. Un registro guarda contenido para pull y push; este curso usa imágenes locales y no publica en cuentas remotas."
          },
          "rule": {
            "en": "A new tag is not a new build.",
            "es": "Un tag nuevo no es un build nuevo."
          }
        },
        {
          "title": {
            "en": "Pin content for reproduction",
            "es": "Fijá contenido para reproducir"
          },
          "text": {
            "en": "A digest addresses registry content. Our base image and kind node image include digests. A tag such as 1.0.0 communicates intent, but reproducibility requires preserving the actual artifact and its inputs.",
            "es": "Un digest identifica contenido del registro. La imagen base y la de nodos de kind incluyen digests. Un tag como 1.0.0 comunica intención, pero reproducir requiere conservar el artefacto y sus insumos."
          },
          "rule": {
            "en": "Names are convenient; content identity is stronger.",
            "es": "Los nombres son cómodos; la identidad del contenido es más fuerte."
          }
        },
        {
          "title": {
            "en": "Local is not on every node",
            "es": "Local no es estar en cada nodo"
          },
          "text": {
            "en": "An image in Docker on your laptop is not automatically in a Kubernetes node runtime. kind load docker-image copies the local artifact into the named cluster. We use imagePullPolicy: Never to make missing imports visible.",
            "es": "Una imagen en Docker de tu laptop no está automáticamente en el runtime del nodo Kubernetes. kind load docker-image copia el artefacto al clúster indicado. Usamos imagePullPolicy: Never para que se vea si falta importarlo."
          },
          "rule": {
            "en": "Delivery is an explicit step.",
            "es": "Distribuir es un paso explícito."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Does docker tag create new layers?",
            "es": "¿docker tag crea capas nuevas?"
          },
          "options": [
            {
              "en": "Only for version tags",
              "es": "Solo para tags de versión"
            },
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes",
              "es": "Sí"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "It adds a reference to existing content.",
            "es": "Agrega una referencia a contenido existente."
          }
        },
        {
          "question": {
            "en": "Which reference identifies registry content immutably?",
            "es": "¿Qué referencia identifica contenido inmutable del registro?"
          },
          "options": [
            {
              "en": "latest",
              "es": "latest"
            },
            {
              "en": "A container name",
              "es": "Un nombre de contenedor"
            },
            {
              "en": "A digest",
              "es": "Un digest"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Digests derive from content; tags can move.",
            "es": "Los digests dependen del contenido; los tags pueden moverse."
          }
        },
        {
          "question": {
            "en": "Why import the image into kind?",
            "es": "¿Por qué importar la imagen en kind?"
          },
          "options": [
            {
              "en": "Its nodes have separate image stores",
              "es": "Los nodos tienen almacenes de imágenes separados"
            },
            {
              "en": "To expose a host port",
              "es": "Para exponer un puerto del host"
            },
            {
              "en": "To create a volume",
              "es": "Para crear un volumen"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "The runtime that starts the Pod must have the image.",
            "es": "El runtime que arranca el Pod necesita la imagen."
          }
        }
      ],
      "source": "tag",
      "lab": [
        {
          "title": {
            "en": "Give an image another name",
            "es": "Dale otro nombre a la imagen"
          },
          "text": {
            "en": "Create a local alias. This does not publish to a registry.",
            "es": "Creá un alias local. No publica en un registro."
          },
          "command": "docker tag prumathe-signal:1.0.0 prumathe-signal:practice",
          "expected": {
            "en": "A second local reference exists.",
            "es": "Existe otra referencia local."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Compare identities",
            "es": "Compará identidades"
          },
          "text": {
            "en": "Inspect both local image IDs. They should match because tag did not rebuild anything.",
            "es": "Inspeccioná ambos IDs locales. Deben coincidir porque tag no reconstruyó."
          },
          "command": "docker image inspect --format '{{.Id}}' prumathe-signal:1.0.0\ndocker image inspect --format '{{.Id}}' prumathe-signal:practice",
          "expected": {
            "en": "Two equal local IDs. This is not a registry digest comparison.",
            "es": "Dos IDs locales iguales. No es una comparación de digests del registro."
          },
          "checks": [
            {
              "equalLines": true
            }
          ]
        },
        {
          "title": {
            "en": "Read the pinned base",
            "es": "Leé la base fijada"
          },
          "text": {
            "en": "Pull the base image by its digest, then inspect its RepoDigests. The Dockerfile uses this same content reference; a build may keep the base only in its cache, so the pull puts it in the local image store.",
            "es": "Descargá la imagen base por su digest y después inspeccioná sus RepoDigests. El Dockerfile usa esta misma referencia de contenido; un build puede dejar la base solo en su caché, así que el pull la pone en el almacén local de imágenes."
          },
          "command": "docker pull python:3.14.8-alpine3.24@sha256:f6a589d43c42b9e7f7dc67a12d37132491f362859a5d750607710cc56da3bc72\ndocker image inspect --format '{{json .RepoDigests}}' python:3.14.8-alpine3.24@sha256:f6a589d43c42b9e7f7dc67a12d37132491f362859a5d750607710cc56da3bc72",
          "expected": {
            "en": "The pull reports the digest and the inspection prints a sha256 registry reference.",
            "es": "El pull informa el digest y la inspección imprime una referencia sha256 de registro."
          },
          "checks": [
            {
              "contains": "sha256:"
            }
          ]
        },
        {
          "title": {
            "en": "Remove just the alias",
            "es": "Borrá solo el alias"
          },
          "text": {
            "en": "Remove the practice tag and confirm the original still starts.",
            "es": "Borrá el tag de práctica y confirmá que arranca la original."
          },
          "command": "docker image rm prumathe-signal:practice\ndocker run --rm prumathe-signal:1.0.0 printenv APP_VERSION",
          "expected": {
            "en": "1.0.0 still runs.",
            "es": "1.0.0 sigue ejecutándose."
          },
          "checks": [
            {
              "contains": "1.0.0"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Move a tag to a new artifact. Does the old content identity change?",
        "es": "Mové un tag a otro artefacto. ¿Cambia la identidad del contenido anterior?"
      }
    },
    {
      "id": 12,
      "unit": 3,
      "slug": "debugging",
      "title": {
        "en": "Follow the evidence",
        "es": "Seguí la evidencia"
      },
      "intro": {
        "en": "State, logs, connectivity, then configuration.",
        "es": "Estado, logs, conectividad y después configuración."
      },
      "visual": "debug",
      "frames": [
        {
          "title": {
            "en": "Ask one question per tool",
            "es": "Una pregunta por herramienta"
          },
          "text": {
            "en": "ps reports container state. logs shows stdout and stderr. inspect reveals configured values and runtime state. exec runs a new process in an existing container; it is not a record of earlier failures.",
            "es": "ps informa estado. logs muestra stdout y stderr. inspect revela configuración y estado. exec ejecuta un proceso nuevo en un contenedor existente; no es un registro de fallas anteriores."
          },
          "rule": {
            "en": "Choose evidence that answers the hypothesis.",
            "es": "Elegí evidencia que responda la hipótesis."
          }
        },
        {
          "title": {
            "en": "Separate the layers",
            "es": "Separá las capas"
          },
          "text": {
            "en": "If an HTTP request fails, check name resolution, connection, status and response content separately. Our probe script asserts both status and expected text. A successful TCP connection alone does not prove application correctness.",
            "es": "Si falla HTTP, revisá resolución de nombre, conexión, estado y contenido por separado. El script probe afirma estado y texto esperado. Una conexión TCP exitosa no prueba que la aplicación sea correcta."
          },
          "rule": {
            "en": "A reachable endpoint can still return the wrong result.",
            "es": "Un endpoint accesible puede devolver un resultado incorrecto."
          }
        },
        {
          "title": {
            "en": "Fix the source of truth",
            "es": "Corregí la fuente de verdad"
          },
          "text": {
            "en": "An emergency exec edit disappears when the container is replaced. Reproduce the issue, correct source or configuration, rebuild when needed and rerun the observation. Keep the smallest explanation that fits the evidence.",
            "es": "Un cambio de emergencia con exec desaparece al reemplazar el contenedor. Reproducí el problema, corregí código o configuración, reconstruí si hace falta y repetí la observación. Quedate con la explicación más pequeña que encaja con la evidencia."
          },
          "rule": {
            "en": "A live patch is not a durable release.",
            "es": "Un parche en vivo no es una versión durable."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Which tool reads earlier stdout?",
            "es": "¿Qué herramienta lee stdout anterior?"
          },
          "options": [
            {
              "en": "tag",
              "es": "tag"
            },
            {
              "en": "logs",
              "es": "logs"
            },
            {
              "en": "exec always",
              "es": "exec siempre"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "exec starts a new process; logs reads captured output.",
            "es": "exec arranca otro proceso; logs lee salida capturada."
          }
        },
        {
          "question": {
            "en": "Does HTTP 200 prove the expected business result?",
            "es": "¿HTTP 200 prueba el resultado esperado?"
          },
          "options": [
            {
              "en": "No; also inspect the body and semantics",
              "es": "No; inspeccioná contenido y semántica"
            },
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only on localhost",
              "es": "Solo en localhost"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "The probe checks content as well as status.",
            "es": "La sonda revisa contenido además de estado."
          }
        },
        {
          "question": {
            "en": "Where should a durable fix live?",
            "es": "¿Dónde debe vivir una corrección durable?"
          },
          "options": [
            {
              "en": "Only in a running container",
              "es": "Solo en un contenedor activo"
            },
            {
              "en": "Only in terminal history",
              "es": "Solo en la historia de terminal"
            },
            {
              "en": "In versioned source or configuration",
              "es": "En código o configuración versionados"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Recreation must reproduce the fix.",
            "es": "Recrear tiene que reproducir la corrección."
          }
        }
      ],
      "source": "logs",
      "lab": [
        {
          "title": {
            "en": "Start the practice service",
            "es": "Arrancá el servicio de práctica"
          },
          "text": {
            "en": "From labs, after lesson 00. This starts only the course Compose project.",
            "es": "Desde labs, después de la lección 00. Arranca solo el proyecto Compose del curso."
          },
          "command": "docker compose up -d --wait app",
          "expected": {
            "en": "The app is healthy. No other project is reset.",
            "es": "La aplicación está healthy. No se reinicia otro proyecto."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Test application semantics",
            "es": "Probá semántica de aplicación"
          },
          "text": {
            "en": "The probe checks status 200 and the expected message, not just a connection.",
            "es": "La sonda comprueba estado 200 y mensaje esperado, no solo conexión."
          },
          "command": "docker compose run --rm --no-deps toolbox http://app:8080 hello-compose",
          "expected": {
            "en": "PASS.",
            "es": "PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Read the evidence",
            "es": "Leé la evidencia"
          },
          "text": {
            "en": "Inspect recent request logs and the configured image reference.",
            "es": "Inspeccioná logs recientes y referencia de imagen."
          },
          "command": "docker compose logs --tail 5 app\ndocker inspect --format '{{.Config.Image}}' prumathe-dk-app-1",
          "expected": {
            "en": "HTTP request records and prumathe-signal:1.0.0.",
            "es": "Registros HTTP y prumathe-signal:1.0.0."
          },
          "checks": [
            {
              "contains": "prumathe-signal:1.0.0"
            }
          ]
        },
        {
          "title": {
            "en": "Assert an intentional failure response",
            "es": "Comprobá una respuesta de falla intencional"
          },
          "text": {
            "en": "Temporarily fail readiness, assert HTTP 503, then remove the flag. Docker health probes /health, so this exercise does not change that health endpoint.",
            "es": "Fallá readiness, comprobá HTTP 503 y borrá la marca. Docker sondea /health, así que esto no cambia ese endpoint."
          },
          "command": "docker compose exec -T app touch /tmp/not-ready\ndocker compose exec -T app python /app/probe.py http://127.0.0.1:8080/ready unavailable 503\ndocker compose exec -T app rm /tmp/not-ready",
          "expected": {
            "en": "The expected 503 body is asserted and prints PASS.",
            "es": "Se comprueba el contenido del 503 esperado y se imprime PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Choose the failed layer. Which observation distinguishes it from the next one?",
        "es": "Elegí la capa que falla. ¿Qué observación la distingue de la siguiente?"
      }
    },
    {
      "id": 13,
      "unit": 4,
      "slug": "cluster",
      "title": {
        "en": "Meet the cluster",
        "es": "Conocé el clúster"
      },
      "intro": {
        "en": "An API, controllers and nodes cooperate to run your application.",
        "es": "Una API, controladores y nodos cooperan para ejecutar tu aplicación."
      },
      "visual": "cluster",
      "frames": [
        {
          "title": {
            "en": "The control plane",
            "es": "El plano de control"
          },
          "text": {
            "en": "kubectl sends requests to the API server. The control plane records desired state and coordinates work. A node is a machine, physical or virtual, whose kubelet and container runtime run assigned Pods.",
            "es": "kubectl envía pedidos al API server. El plano de control registra el estado deseado y coordina trabajo. Un nodo es una máquina física o virtual cuyo kubelet y runtime ejecutan los Pods asignados."
          },
          "rule": {
            "en": "kubectl does not start containers directly.",
            "es": "kubectl no arranca contenedores directamente."
          }
        },
        {
          "title": {
            "en": "A cluster inside containers",
            "es": "Un clúster dentro de contenedores"
          },
          "text": {
            "en": "kind runs Kubernetes nodes as Docker containers. The kit creates one control-plane node and one worker. This is useful for learning orchestration, but both nodes share your host and its failure modes.",
            "es": "kind ejecuta nodos Kubernetes como contenedores Docker. El kit crea un nodo de control y un worker. Sirve para aprender orquestación, pero ambos comparten tu host y sus fallas."
          },
          "rule": {
            "en": "Two local nodes do not provide host redundancy.",
            "es": "Dos nodos locales no dan redundancia de host."
          }
        },
        {
          "title": {
            "en": "Select the destination explicitly",
            "es": "Elegí el destino explícitamente"
          },
          "text": {
            "en": "A kubeconfig contains connection and authentication information; a context selects a cluster, user and optional namespace. Every lab command names the course kubeconfig and kind-prumathe-dk context. Install kind and kubectl using the official links in labs/README.md before this lab.",
            "es": "Un kubeconfig contiene información de conexión y autenticación; un contexto elige clúster, usuario y un namespace opcional. Cada comando indica el kubeconfig del curso y el contexto kind-prumathe-dk. Instalá kind y kubectl con los enlaces oficiales de labs/README.md antes del lab."
          },
          "rule": {
            "en": "Check the destination before any mutation.",
            "es": "Revisá el destino antes de modificar."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Who receives kubectl requests?",
            "es": "¿Quién recibe pedidos de kubectl?"
          },
          "options": [
            {
              "en": "The browser model",
              "es": "El modelo del navegador"
            },
            {
              "en": "The API server",
              "es": "El API server"
            },
            {
              "en": "The Dockerfile",
              "es": "El Dockerfile"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "The API is the entry point for these operations.",
            "es": "La API es la entrada de estas operaciones."
          }
        },
        {
          "question": {
            "en": "What does kind provide here?",
            "es": "¿Qué aporta kind acá?"
          },
          "options": [
            {
              "en": "Independent physical machines",
              "es": "Máquinas físicas independientes"
            },
            {
              "en": "A managed cloud production service",
              "es": "Un servicio cloud productivo administrado"
            },
            {
              "en": "A local Kubernetes cluster with containerized nodes",
              "es": "Un clúster local con nodos en contenedores"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The cluster is real, but its infrastructure shares one host.",
            "es": "El clúster es real, pero su infraestructura comparte un host."
          }
        },
        {
          "question": {
            "en": "Why specify both kubeconfig and context?",
            "es": "¿Por qué indicar kubeconfig y contexto?"
          },
          "options": [
            {
              "en": "To select the intended practice destination",
              "es": "Para elegir el destino de práctica previsto"
            },
            {
              "en": "To increase replica count",
              "es": "Para aumentar réplicas"
            },
            {
              "en": "To disable authentication",
              "es": "Para deshabilitar autenticación"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Explicit selection avoids relying on your normal current context.",
            "es": "La selección explícita evita depender de tu contexto habitual."
          }
        }
      ],
      "source": "architecture",
      "lab": [
        {
          "title": {
            "en": "Verify cluster tools",
            "es": "Verificá herramientas"
          },
          "text": {
            "en": "Install kind 0.33.0 and kubectl 1.37.x first using the official instructions linked in labs/README.md. They must be on PATH.",
            "es": "Instalá kind 0.33.0 y kubectl 1.37.x con las instrucciones oficiales de labs/README.md. Tienen que estar en PATH."
          },
          "command": "kind version\nkubectl version --client",
          "expected": {
            "en": "kind v0.33.0 and kubectl v1.37.x.",
            "es": "kind v0.33.0 y kubectl v1.37.x."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Create the named local cluster",
            "es": "Creá el clúster local con nombre"
          },
          "text": {
            "en": "Run once from labs. If prumathe-dk already exists, keep it and continue. The explicit kubeconfig avoids merging into your usual config. The node download can take several minutes.",
            "es": "Ejecutá una vez desde labs. Si prumathe-dk ya existe, conservalo y seguí. El kubeconfig explícito evita mezclar con tu configuración habitual. La descarga puede tardar varios minutos."
          },
          "command": "kind create cluster --name prumathe-dk --config kind.yaml --kubeconfig kubeconfig --image kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5 --wait 180s",
          "expected": {
            "en": "One control-plane node and one worker become ready.",
            "es": "Un nodo de control y un worker quedan listos."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Import the course image",
            "es": "Importá la imagen del curso"
          },
          "text": {
            "en": "Build if needed, then copy the local image into the named cluster. Reimport after rebuilding a tag.",
            "es": "Construí si hace falta y copiá la imagen al clúster indicado. Reimportá si reconstruís un tag."
          },
          "command": "docker compose build app\nkind load docker-image prumathe-signal:1.0.0 --name prumathe-dk",
          "expected": {
            "en": "Both nodes have the application image.",
            "es": "Ambos nodos tienen la imagen."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Inspect the exact destination",
            "es": "Inspeccioná el destino exacto"
          },
          "text": {
            "en": "Wait for node readiness and create only the practice namespace.",
            "es": "Esperá nodos listos y creá solo el namespace de práctica."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk wait --for=condition=Ready nodes --all --timeout=90s\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk get nodes\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk apply -f k8s/namespace.yaml",
          "expected": {
            "en": "Two Ready nodes at v1.37.0 and namespace dk-lab.",
            "es": "Dos nodos Ready en v1.37.0 y namespace dk-lab."
          },
          "checks": [
            {
              "contains": "v1.37.0"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Change the desired Pod count and inspect the control plane and worker responsibilities.",
        "es": "Cambiá la cantidad de Pods e inspeccioná responsabilidades del control y worker."
      }
    },
    {
      "id": 14,
      "unit": 4,
      "slug": "pods",
      "title": {
        "en": "The Pod boundary",
        "es": "El límite del Pod"
      },
      "intro": {
        "en": "Kubernetes schedules Pods, which contain containers.",
        "es": "Kubernetes planifica Pods, que contienen contenedores."
      },
      "visual": "pod",
      "frames": [
        {
          "title": {
            "en": "One scheduling unit",
            "es": "Una unidad de scheduling"
          },
          "text": {
            "en": "A Pod groups one or more containers that share a network namespace and can share declared volumes. They run together on one node. Our first Pod has one container, so the process-to-Pod relationship stays visible.",
            "es": "Un Pod agrupa uno o más contenedores que comparten espacio de red y pueden compartir volúmenes declarados. Corren juntos en un nodo. Nuestro primer Pod tiene un contenedor para ver la relación entre proceso y Pod."
          },
          "rule": {
            "en": "A Pod is the smallest deployable unit here.",
            "es": "El Pod es la unidad desplegable mínima acá."
          }
        },
        {
          "title": {
            "en": "Identity is temporary",
            "es": "La identidad es temporal"
          },
          "text": {
            "en": "A Pod gets a name, UID and network address. Replacing a Pod creates a new identity, even if you reuse its name. Do not use a Pod IP as a durable client address.",
            "es": "Un Pod recibe nombre, UID y dirección de red. Reemplazarlo crea una identidad nueva aunque reutilices el nombre. No uses la IP de un Pod como dirección durable de clientes."
          },
          "rule": {
            "en": "Replacement is not resurrection.",
            "es": "Reemplazar no es resucitar."
          }
        },
        {
          "title": {
            "en": "Bare Pods have no replacement controller",
            "es": "Los Pods sueltos no tienen controlador de reemplazo"
          },
          "text": {
            "en": "The kubelet can restart a container according to its restart policy. Deleting this standalone Pod removes the object; no Deployment exists to recreate it. Later we introduce the controller that maintains replicas.",
            "es": "El kubelet puede reiniciar un contenedor según su política. Borrar este Pod suelto elimina el objeto; no existe un Deployment que lo recree. Después agregamos el controlador que mantiene réplicas."
          },
          "rule": {
            "en": "Container restart and Pod replacement are different.",
            "es": "Reiniciar un contenedor y reemplazar un Pod son cosas distintas."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Can two containers in one Pod run on different nodes?",
            "es": "¿Dos contenedores de un Pod pueden correr en nodos distintos?"
          },
          "options": [
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes, by default",
              "es": "Sí, por defecto"
            },
            {
              "en": "Only if they use HTTP",
              "es": "Solo si usan HTTP"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "The Pod is scheduled as one unit.",
            "es": "El Pod se planifica como una unidad."
          }
        },
        {
          "question": {
            "en": "Which address should not be treated as permanent?",
            "es": "¿Qué dirección no deberías considerar permanente?"
          },
          "options": [
            {
              "en": "The declared Service name",
              "es": "El nombre declarado del Service"
            },
            {
              "en": "The course folder name",
              "es": "El nombre de carpeta del curso"
            },
            {
              "en": "A Pod IP",
              "es": "La IP de un Pod"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Pods are replaced and addresses can change.",
            "es": "Los Pods se reemplazan y las direcciones pueden cambiar."
          }
        },
        {
          "question": {
            "en": "Delete a standalone Pod. Who recreates it?",
            "es": "Borrás un Pod suelto. ¿Quién lo recrea?"
          },
          "options": [
            {
              "en": "The image registry",
              "es": "El registro de imágenes"
            },
            {
              "en": "No workload controller in this example",
              "es": "Ningún controlador de carga en este ejemplo"
            },
            {
              "en": "The Service",
              "es": "El Service"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Restart policy handles containers inside an existing Pod, not deleted bare Pods.",
            "es": "La política reinicia contenedores en un Pod existente, no Pods sueltos borrados."
          }
        }
      ],
      "source": "pods",
      "lab": [
        {
          "title": {
            "en": "Create a standalone Pod",
            "es": "Creá un Pod suelto"
          },
          "text": {
            "en": "Complete lesson 13 first. Submit the single Pod manifest.",
            "es": "Completá antes la lección 13. Enviá el manifiesto del Pod suelto."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/pod.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab wait --for=condition=Ready pod/solo --timeout=90s",
          "expected": {
            "en": "solo becomes Ready.",
            "es": "solo llega a Ready."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Inspect identity and placement",
            "es": "Inspeccioná identidad y ubicación"
          },
          "text": {
            "en": "Read the UID, node and IP from the live object.",
            "es": "Leé UID, nodo e IP del objeto vivo."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pod solo -o wide\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pod solo -o 'jsonpath={.metadata.uid}'",
          "expected": {
            "en": "A unique UID and an assigned node/IP.",
            "es": "Un UID único y nodo/IP asignados."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Run a request inside the Pod",
            "es": "Consultá desde el Pod"
          },
          "text": {
            "en": "The app container and its loopback belong to this Pod.",
            "es": "La app y su loopback pertenecen a este Pod."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec solo -- python /app/probe.py http://127.0.0.1:8080 1.0.0",
          "expected": {
            "en": "1.0.0 and PASS.",
            "es": "1.0.0 y PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Delete the standalone object",
            "es": "Borrá el objeto suelto"
          },
          "text": {
            "en": "There is no controller maintaining this Pod. --ignore-not-found makes the final read return no object instead of an error. Kubernetes sends SIGTERM and waits up to 30 seconds (the grace period) before SIGKILL; Signal exits at once.",
            "es": "No hay controlador manteniendo este Pod. --ignore-not-found hace que la lectura final no devuelva objeto en vez de error. Kubernetes envía SIGTERM y espera hasta 30 segundos (el período de gracia) antes de SIGKILL; Signal termina enseguida."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod solo --wait=true\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pod solo --ignore-not-found -o name",
          "expected": {
            "en": "No solo object remains; it is not recreated.",
            "es": "No queda solo; no se recrea."
          },
          "checks": []
        }
      ],
      "experiment": {
        "en": "Replace the Pod. Which containers share its network address?",
        "es": "Reemplazá el Pod. ¿Qué contenedores comparten su dirección?"
      }
    },
    {
      "id": 15,
      "unit": 4,
      "slug": "declarative",
      "title": {
        "en": "Desired and observed state",
        "es": "Estado deseado y observado"
      },
      "intro": {
        "en": "Describe an outcome; watch the control loop approach it.",
        "es": "Describí un resultado y observá cómo se acerca el control."
      },
      "visual": "reconcile",
      "frames": [
        {
          "title": {
            "en": "Declare the object",
            "es": "Declará el objeto"
          },
          "text": {
            "en": "A manifest describes API objects with a kind, metadata and specification. apply submits that desired state. Successful acceptance means the API stored the request, not that all Pods are ready.",
            "es": "Un manifiesto describe objetos con kind, metadatos y especificación. apply envía ese estado deseado. Que la API acepte el pedido no significa que todos los Pods estén listos."
          },
          "rule": {
            "en": "Accepted and achieved are different milestones.",
            "es": "Aceptado y logrado son hitos distintos."
          }
        },
        {
          "title": {
            "en": "Reconciliation repeats",
            "es": "La reconciliación se repite"
          },
          "text": {
            "en": "Controllers compare desired and observed state and take actions to reduce the difference. Scheduling, image availability and health can delay convergence. The loop keeps working after kubectl exits.",
            "es": "Los controladores comparan estado deseado y observado y actúan para reducir diferencias. El scheduling, la disponibilidad de imágenes y la salud pueden demorar la convergencia. El bucle sigue trabajando después de que termina kubectl."
          },
          "rule": {
            "en": "The controller is a loop, not a one-time script.",
            "es": "El controlador es un bucle, no un script de una vez."
          }
        },
        {
          "title": {
            "en": "Keep the source consistent",
            "es": "Mantené consistente la fuente"
          },
          "text": {
            "en": "An imperative scale changes live desired state. Applying a manifest that still declares two replicas can restore two. For durable changes, update the owned manifest and review the difference before applying.",
            "es": "Un scale imperativo cambia el estado deseado en vivo. Aplicar un manifiesto que sigue declarando dos réplicas puede volver a dos. Para cambios durables, actualizá el manifiesto que mantenés y revisá diferencias antes de aplicar."
          },
          "rule": {
            "en": "Live state and versioned intent can diverge.",
            "es": "El estado vivo y la intención versionada pueden separarse."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Does successful apply mean the rollout finished?",
            "es": "¿Apply exitoso significa rollout terminado?"
          },
          "options": [
            {
              "en": "Only when the file is YAML",
              "es": "Solo si el archivo es YAML"
            },
            {
              "en": "No, observe readiness separately",
              "es": "No, observá readiness aparte"
            },
            {
              "en": "Yes",
              "es": "Sí"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "API acceptance comes before convergence.",
            "es": "La aceptación de la API precede a la convergencia."
          }
        },
        {
          "question": {
            "en": "What keeps acting after kubectl exits?",
            "es": "¿Qué sigue actuando al terminar kubectl?"
          },
          "options": [
            {
              "en": "The closed terminal",
              "es": "La terminal cerrada"
            },
            {
              "en": "The course browser",
              "es": "El navegador del curso"
            },
            {
              "en": "Controllers in the cluster",
              "es": "Los controladores del clúster"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The control loop belongs to Kubernetes.",
            "es": "El bucle de control pertenece a Kubernetes."
          }
        },
        {
          "question": {
            "en": "Why can applying the file undo a manual scale?",
            "es": "¿Por qué aplicar el archivo puede deshacer un scale manual?"
          },
          "options": [
            {
              "en": "The file still declares another replica count",
              "es": "El archivo todavía declara otra cantidad"
            },
            {
              "en": "YAML always deletes Pods",
              "es": "YAML siempre borra Pods"
            },
            {
              "en": "A Service fixes the count",
              "es": "Un Service fija la cantidad"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Keep declared configuration consistent with intended changes.",
            "es": "Mantené la configuración declarada consistente con los cambios deseados."
          }
        }
      ],
      "source": "controllers",
      "lab": [
        {
          "title": {
            "en": "Restore the declared baseline",
            "es": "Restaurá la base declarada"
          },
          "text": {
            "en": "Complete lesson 13 first. Apply the course manifest in dk-lab and wait for its rollout. This restores the image and replica count declared in the file.",
            "es": "Completá antes la lección 13. Aplicá el manifiesto en dk-lab y esperá el rollout. Restaura imagen y cantidad de réplicas declaradas."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Deployment signal finishes its rollout with two ready replicas.",
            "es": "El Deployment signal termina el rollout con dos réplicas listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Change live desired state",
            "es": "Cambiá el estado deseado vivo"
          },
          "text": {
            "en": "Scale the Deployment to three and wait for convergence.",
            "es": "Escalá el Deployment a tres y esperá convergencia."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab scale deployment/signal --replicas=3\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Three replicas are desired and ready.",
            "es": "Hay tres réplicas deseadas y listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Read specification and status",
            "es": "Leé especificación y estado"
          },
          "text": {
            "en": "Compare the desired count with the ready count rather than assuming apply equals readiness.",
            "es": "Compará cantidad deseada y lista en vez de suponer que apply equivale a readiness."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal -o 'jsonpath={.spec.replicas}/{.status.readyReplicas}'",
          "expected": {
            "en": "3/3 after convergence.",
            "es": "3/3 tras converger."
          },
          "checks": [
            {
              "contains": "3/3"
            }
          ]
        },
        {
          "title": {
            "en": "Reapply the declared file",
            "es": "Volvé a aplicar el archivo"
          },
          "text": {
            "en": "The file still declares two. Applying it resets the live desired count to two.",
            "es": "El archivo sigue declarando dos. Aplicarlo devuelve la cantidad deseada a dos."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal -o 'jsonpath={.spec.replicas}/{.status.readyReplicas}'",
          "expected": {
            "en": "2/2. A durable scale change belongs in the maintained manifest.",
            "es": "2/2. Un cambio durable de escala va en el manifiesto mantenido."
          },
          "checks": [
            {
              "contains": "2/2"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Change desired count, then simulate a missing instance. Read the difference the controller must close.",
        "es": "Cambiá la cantidad deseada y simulá una instancia faltante. Leé la diferencia que debe cerrar el controlador."
      }
    },
    {
      "id": 16,
      "unit": 4,
      "slug": "deployments",
      "title": {
        "en": "Keep replicas running",
        "es": "Mantené réplicas en marcha"
      },
      "intro": {
        "en": "A Deployment manages replacement through ReplicaSets.",
        "es": "Un Deployment administra reemplazos mediante ReplicaSets."
      },
      "visual": "deployment",
      "frames": [
        {
          "title": {
            "en": "A template and a count",
            "es": "Una plantilla y una cantidad"
          },
          "text": {
            "en": "A Deployment declares a Pod template and desired replicas. It manages ReplicaSets, which maintain the matching Pods. Labels connect selectors to the correct objects.",
            "es": "Un Deployment declara una plantilla de Pod y réplicas deseadas. Administra ReplicaSets que mantienen esos Pods. Las labels conectan selectores con los objetos correctos."
          },
          "rule": {
            "en": "The template creates replacements.",
            "es": "La plantilla crea los reemplazos."
          }
        },
        {
          "title": {
            "en": "Delete the instances",
            "es": "Borrá las instancias"
          },
          "text": {
            "en": "Delete the practice Pods and wait for the Deployment. The ReplicaSet creates replacements because the desired count remains two. New Pods get new identities; their writable container files do not transfer.",
            "es": "Borrá los Pods de práctica y esperá al Deployment. El ReplicaSet crea reemplazos porque la cantidad deseada sigue en dos. Los Pods nuevos reciben otras identidades; los archivos de sus capas escribibles no se transfieren."
          },
          "rule": {
            "en": "Recovery restores count, not arbitrary local state.",
            "es": "La recuperación restaura cantidad, no estado local arbitrario."
          }
        },
        {
          "title": {
            "en": "Replicas need real capacity",
            "es": "Las réplicas necesitan capacidad real"
          },
          "text": {
            "en": "Scaling changes desired count. Nodes still need resources to run those Pods. Two replicas on one worker help with individual Pod failures but do not survive losing that worker as independent running copies.",
            "es": "Escalar cambia la cantidad deseada. Los nodos necesitan recursos para esos Pods. Dos réplicas en un worker ayudan ante fallas de un Pod, pero no sobreviven como copias activas independientes si se pierde ese worker."
          },
          "rule": {
            "en": "Count alone is not availability architecture.",
            "es": "La cantidad sola no es una arquitectura de disponibilidad."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What does a Deployment manage directly?",
            "es": "¿Qué administra directamente un Deployment?"
          },
          "options": [
            {
              "en": "External DNS accounts",
              "es": "Cuentas externas de DNS"
            },
            {
              "en": "ReplicaSets",
              "es": "ReplicaSets"
            },
            {
              "en": "Host backups",
              "es": "Respaldos del host"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "ReplicaSets maintain the Pods for a template revision.",
            "es": "Los ReplicaSets mantienen Pods para una revisión de plantilla."
          }
        },
        {
          "question": {
            "en": "What survives deleting its Pods?",
            "es": "¿Qué sigue después de borrar sus Pods?"
          },
          "options": [
            {
              "en": "The declared desired replica count",
              "es": "La cantidad deseada declarada"
            },
            {
              "en": "Every Pod UID",
              "es": "Cada UID de Pod"
            },
            {
              "en": "Unshared files in their writable layers",
              "es": "Archivos no compartidos de sus capas escribibles"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Controllers create new instances from the template.",
            "es": "Los controladores crean instancias desde la plantilla."
          }
        },
        {
          "question": {
            "en": "Do two replicas guarantee two failure domains?",
            "es": "¿Dos réplicas garantizan dos dominios de falla?"
          },
          "options": [
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only if the image is small",
              "es": "Solo si la imagen es pequeña"
            },
            {
              "en": "No; placement and infrastructure matter",
              "es": "No; importan ubicación e infraestructura"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Both copies can run on the same machine.",
            "es": "Ambas copias pueden correr en la misma máquina."
          }
        }
      ],
      "source": "deployment",
      "lab": [
        {
          "title": {
            "en": "Restore the declared baseline",
            "es": "Restaurá la base declarada"
          },
          "text": {
            "en": "Complete lesson 13 first. Apply the course manifest in dk-lab and wait for its rollout. This restores the image and replica count declared in the file.",
            "es": "Completá antes la lección 13. Aplicá el manifiesto en dk-lab y esperá el rollout. Restaura imagen y cantidad de réplicas declaradas."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Deployment signal finishes its rollout with two ready replicas.",
            "es": "El Deployment signal termina el rollout con dos réplicas listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "See the ownership chain",
            "es": "Mirá la cadena de propiedad"
          },
          "text": {
            "en": "Read Deployments, ReplicaSets and Pods together.",
            "es": "Leé Deployments, ReplicaSets y Pods juntos."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment,replicaset,pod -l app=signal\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal",
          "expected": {
            "en": "The Deployment exists; its ReplicaSet owns matching Pods.",
            "es": "Existe el Deployment; su ReplicaSet es dueño de los Pods."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Remove only application instances",
            "es": "Borrá solo instancias de aplicación"
          },
          "text": {
            "en": "This deliberately deletes all app=signal Pods in the practice namespace. It can interrupt traffic. The controller still wants two.",
            "es": "Esto borra deliberadamente todos los Pods app=signal del namespace de práctica. Puede interrumpir tráfico. El controlador sigue queriendo dos."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod -l app=signal --wait=true\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "New Pod instances become ready.",
            "es": "Nuevas instancias de Pod quedan listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Assert restored count and behavior",
            "es": "Comprobá cantidad y comportamiento"
          },
          "text": {
            "en": "Check ready replicas and request the Service from a replacement. The Service signal comes from base.yaml; lesson 17 explains it. The Service probe allows up to 30 attempts, one second apart after failures, for endpoint updates to propagate.",
            "es": "Revisá réplicas listas y consultá el Service desde un reemplazo. El Service signal lo creó base.yaml; la lección 17 lo explica. La sonda del Service admite hasta 30 intentos, separados por un segundo tras fallar, para dar tiempo a propagar endpoints."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal -o 'jsonpath={.status.readyReplicas}'\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec deployment/signal -- python /app/probe.py http://signal 1.0.0 200 30",
          "expected": {
            "en": "Two ready replicas and PASS for version 1.0.0.",
            "es": "Dos réplicas listas y PASS para 1.0.0."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Remove the instances while leaving the template. Compare the missing and restored states.",
        "es": "Quitá las instancias conservando la plantilla. Compará estado faltante y restaurado."
      }
    },
    {
      "id": 17,
      "unit": 5,
      "slug": "services",
      "title": {
        "en": "A stable front door",
        "es": "Una entrada estable"
      },
      "intro": {
        "en": "A Service points traffic at matching ready endpoints.",
        "es": "Un Service lleva tráfico a endpoints listos que coinciden."
      },
      "visual": "service",
      "frames": [
        {
          "title": {
            "en": "Select by label",
            "es": "Elegí por label"
          },
          "text": {
            "en": "A Service selects Pods using labels. Its stable name and virtual IP decouple clients from Pod replacement. Our Service accepts port 80 and forwards to targetPort 8080.",
            "es": "Un Service selecciona Pods mediante labels. Su nombre e IP virtual estables separan clientes de reemplazos de Pods. Nuestro Service recibe en 80 y envía a targetPort 8080."
          },
          "rule": {
            "en": "Service port and targetPort have different jobs.",
            "es": "Port y targetPort cumplen funciones distintas."
          }
        },
        {
          "title": {
            "en": "Observe endpoints",
            "es": "Observá endpoints"
          },
          "text": {
            "en": "EndpointSlices record the backend addresses and readiness information. A Service with the wrong selector may exist without usable backends. A DNS answer is not proof of a healthy application.",
            "es": "Los EndpointSlices registran direcciones y readiness de los destinos. Un Service con selector incorrecto puede existir sin destinos útiles. Una respuesta DNS no prueba salud de la aplicación."
          },
          "rule": {
            "en": "Check selectors and readiness when traffic has nowhere to go.",
            "es": "Revisá selectores y readiness si el tráfico no tiene destino."
          }
        },
        {
          "title": {
            "en": "Internal does not mean public",
            "es": "Interno no significa público"
          },
          "text": {
            "en": "Our Service type is ClusterIP, reachable within the cluster. For local debugging, port-forward creates a temporary tunnel while its command runs. An Ingress or Gateway needs additional infrastructure and is outside this lab.",
            "es": "Nuestro Service es ClusterIP, accesible dentro del clúster. Para depurar localmente, port-forward crea un túnel temporal mientras corre el comando. Un Ingress o Gateway necesita infraestructura adicional y queda fuera de este lab."
          },
          "rule": {
            "en": "A Service does not automatically publish to the internet.",
            "es": "Un Service no publica automáticamente en internet."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What ties this Service to its Pods?",
            "es": "¿Qué une este Service con sus Pods?"
          },
          "options": [
            {
              "en": "Matching labels and selector",
              "es": "Labels y selector coincidentes"
            },
            {
              "en": "Their image size",
              "es": "El tamaño de imagen"
            },
            {
              "en": "The Docker project name",
              "es": "El nombre del proyecto Docker"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Selectors choose backends; names alone do not.",
            "es": "Los selectores eligen destinos; los nombres solos no."
          }
        },
        {
          "question": {
            "en": "Can a Service exist with no ready backends?",
            "es": "¿Puede existir un Service sin destinos listos?"
          },
          "options": [
            {
              "en": "Only if DNS is disabled",
              "es": "Solo si DNS está deshabilitado"
            },
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "No",
              "es": "No"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Inspect EndpointSlices and Pod readiness.",
            "es": "Inspeccioná EndpointSlices y readiness de Pods."
          }
        },
        {
          "question": {
            "en": "Is this ClusterIP public by default?",
            "es": "¿Este ClusterIP es público por defecto?"
          },
          "options": [
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only on kind",
              "es": "Solo en kind"
            },
            {
              "en": "No",
              "es": "No"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "External access requires an explicit mechanism.",
            "es": "El acceso externo requiere un mecanismo explícito."
          }
        }
      ],
      "source": "service",
      "lab": [
        {
          "title": {
            "en": "Restore the declared baseline",
            "es": "Restaurá la base declarada"
          },
          "text": {
            "en": "Complete lesson 13 first. Apply the course manifest in dk-lab and wait for its rollout. This restores the image and replica count declared in the file.",
            "es": "Completá antes la lección 13. Aplicá el manifiesto en dk-lab y esperá el rollout. Restaura imagen y cantidad de réplicas declaradas."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Deployment signal finishes its rollout with two ready replicas.",
            "es": "El Deployment signal termina el rollout con dos réplicas listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Inspect the port translation",
            "es": "Inspeccioná la traducción de puerto"
          },
          "text": {
            "en": "Read the ClusterIP Service and its targetPort.",
            "es": "Leé el Service ClusterIP y su targetPort."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get service signal -o yaml",
          "expected": {
            "en": "port 80, targetPort 8080, selector app: signal.",
            "es": "port 80, targetPort 8080, selector app: signal."
          },
          "checks": [
            {
              "contains": "targetPort: 8080"
            }
          ]
        },
        {
          "title": {
            "en": "Inspect discovered backends",
            "es": "Inspeccioná destinos descubiertos"
          },
          "text": {
            "en": "The endpoint addresses come from selected Pods, not a list typed into the Service.",
            "es": "Las direcciones vienen de Pods seleccionados, no de una lista escrita en el Service."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get endpointslices -l kubernetes.io/service-name=signal -o yaml",
          "expected": {
            "en": "Ready endpoints are listed with Pod references.",
            "es": "Hay endpoints listos con referencias a Pods."
          },
          "checks": [
            {
              "contains": "ready: true"
            }
          ]
        },
        {
          "title": {
            "en": "Use the stable DNS name",
            "es": "Usá el nombre DNS estable"
          },
          "text": {
            "en": "Inside dk-lab, the short Service name resolves. This is internal access, not an internet publication. The Service probe allows up to 30 attempts, one second apart after failures, for endpoint updates to propagate.",
            "es": "Dentro de dk-lab se resuelve el nombre corto. Es acceso interno, no publicación en internet. La sonda del Service admite hasta 30 intentos, separados por un segundo tras fallar, para dar tiempo a propagar endpoints."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec deployment/signal -- python /app/probe.py http://signal 1.0.0 200 30",
          "expected": {
            "en": "HTTP response through the Service and PASS.",
            "es": "Respuesta HTTP por el Service y PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Reduce ready endpoints to zero. Does the Service name disappear?",
        "es": "Reducí endpoints listos a cero. ¿Desaparece el nombre del Service?"
      }
    },
    {
      "id": 18,
      "unit": 5,
      "slug": "configmaps-secrets",
      "title": {
        "en": "Inject runtime configuration",
        "es": "Inyectá configuración de ejecución"
      },
      "intro": {
        "en": "Use API objects to deliver settings, with clear update semantics.",
        "es": "Usá objetos de API para entregar valores, con reglas claras de actualización."
      },
      "visual": "secret",
      "frames": [
        {
          "title": {
            "en": "Separate ordinary values",
            "es": "Separá valores comunes"
          },
          "text": {
            "en": "A ConfigMap stores non-confidential configuration. set env --from adds references to its keys in the Deployment template. The new Pods read MESSAGE when they start; changing the ConfigMap alone does not change an existing process environment.",
            "es": "Un ConfigMap guarda configuración no confidencial. set env --from agrega referencias a sus claves en la plantilla. Los Pods nuevos leen MESSAGE al arrancar; cambiar solo el ConfigMap no cambia el entorno de un proceso existente."
          },
          "rule": {
            "en": "Environment updates require new processes.",
            "es": "Actualizar el entorno requiere procesos nuevos."
          }
        },
        {
          "title": {
            "en": "Secrets have a different access boundary",
            "es": "Los secretos tienen otro límite de acceso"
          },
          "text": {
            "en": "A Secret stores sensitive values with specific API access controls, but base64 is encoding, not encryption. Kubernetes Secrets are not encrypted in etcd by default. The example uses only a clearly fake token.",
            "es": "Un Secret guarda valores sensibles con controles específicos de acceso a la API, pero base64 es codificación, no cifrado. Los Secrets no están cifrados en etcd por defecto. El ejemplo usa solo un token claramente falso."
          },
          "rule": {
            "en": "Protect storage, API access and application exposure.",
            "es": "Protegé almacenamiento, acceso a API y exposición en la aplicación."
          }
        },
        {
          "title": {
            "en": "Delivery mode changes update behavior",
            "es": "La entrega cambia cómo se actualiza"
          },
          "text": {
            "en": "ConfigMap and Secret volumes can receive eventual updates, with exceptions such as subPath mounts. Applications still need to reread files. This lab uses environment import explicitly, so you observe a rollout instead of assuming live reload.",
            "es": "Los volúmenes de ConfigMap y Secret pueden recibir actualizaciones eventuales, con excepciones como subPath. La aplicación tiene que releer archivos. Este lab importa entorno explícitamente para observar un rollout en vez de suponer recarga en vivo."
          },
          "rule": {
            "en": "Delivery and consumption are separate steps.",
            "es": "Entregar y consumir son pasos distintos."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Where should ordinary MESSAGE configuration live?",
            "es": "¿Dónde va una configuración común MESSAGE?"
          },
          "options": [
            {
              "en": "Inside a real password",
              "es": "Dentro de una contraseña real"
            },
            {
              "en": "Only in a Pod IP",
              "es": "Solo en una IP de Pod"
            },
            {
              "en": "A ConfigMap",
              "es": "Un ConfigMap"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "ConfigMaps separate non-confidential settings from images.",
            "es": "Los ConfigMaps separan valores no confidenciales de las imágenes."
          }
        },
        {
          "question": {
            "en": "Does base64 encrypt a Secret?",
            "es": "¿Base64 cifra un Secret?"
          },
          "options": [
            {
              "en": "Only in YAML",
              "es": "Solo en YAML"
            },
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes",
              "es": "Sí"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Encoding is reversible without a key.",
            "es": "La codificación se revierte sin una clave."
          }
        },
        {
          "question": {
            "en": "After changing an imported environment source, what must happen?",
            "es": "Tras cambiar el origen del entorno importado, ¿qué hace falta?"
          },
          "options": [
            {
              "en": "Start new processes that read the updated source",
              "es": "Arrancar procesos nuevos que lean el origen actualizado"
            },
            {
              "en": "Only refresh the browser",
              "es": "Solo refrescar el navegador"
            },
            {
              "en": "Only change the Service name",
              "es": "Solo cambiar el nombre del Service"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "An already running process does not gain new environment values.",
            "es": "Un proceso activo no recibe nuevos valores de entorno."
          }
        }
      ],
      "source": "configmap",
      "lab": [
        {
          "title": {
            "en": "Restore the declared baseline",
            "es": "Restaurá la base declarada"
          },
          "text": {
            "en": "Complete lesson 13 first. Apply the course manifest in dk-lab and wait for its rollout. This restores the image and replica count declared in the file.",
            "es": "Completá antes la lección 13. Aplicá el manifiesto en dk-lab y esperá el rollout. Restaura imagen y cantidad de réplicas declaradas."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Deployment signal finishes its rollout with two ready replicas.",
            "es": "El Deployment signal termina el rollout con dos réplicas listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Create configuration objects",
            "es": "Creá objetos de configuración"
          },
          "text": {
            "en": "Apply the non-confidential message and deliberately fake Secret. Inspect metadata without printing the token.",
            "es": "Aplicá el mensaje común y el Secret falso. Inspeccioná metadatos sin imprimir el token."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/config.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get configmap signal-settings\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get secret demo-token",
          "expected": {
            "en": "Both objects exist in dk-lab.",
            "es": "Ambos objetos existen en dk-lab."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Import values into a new template",
            "es": "Importá valores a una plantilla nueva"
          },
          "text": {
            "en": "set env adds ConfigMap key references to the Pod environment and changes the template. New processes read those keys; existing process environments do not refresh.",
            "es": "set env agrega referencias a claves del ConfigMap y cambia la plantilla. Los procesos nuevos leen esas claves; el entorno de los existentes no se refresca."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab set env deployment/signal --from=configmap/signal-settings\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "New processes start with MESSAGE=hello-kubernetes.",
            "es": "Procesos nuevos arrancan con MESSAGE=hello-kubernetes."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Assert then remove the override",
            "es": "Comprobá y quitá el reemplazo"
          },
          "text": {
            "en": "Verify the message, then remove MESSAGE from the template to leave the baseline for later labs. The Service probe allows up to 30 attempts, one second apart after failures, for endpoint updates to propagate.",
            "es": "Verificá el mensaje y quitá MESSAGE de la plantilla para dejar la base de los próximos labs. La sonda del Service admite hasta 30 intentos, separados por un segundo tras fallar, para dar tiempo a propagar endpoints."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec deployment/signal -- python /app/probe.py http://signal hello-kubernetes 200 30\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab set env deployment/signal MESSAGE-\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "PASS for the configured message, followed by a rollout restoring the default.",
            "es": "PASS para el mensaje configurado y rollout que restaura el valor por defecto."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Change a ConfigMap value. Compare stored configuration with the running process environment.",
        "es": "Cambiá un valor de ConfigMap. Compará configuración guardada y entorno del proceso activo."
      }
    },
    {
      "id": 19,
      "unit": 5,
      "slug": "persistent-volumes",
      "title": {
        "en": "Storage beyond a Pod",
        "es": "Almacenamiento más allá de un Pod"
      },
      "intro": {
        "en": "A claim asks for storage; it does not promise a backup.",
        "es": "Un claim pide almacenamiento; no promete un respaldo."
      },
      "visual": "pvc",
      "frames": [
        {
          "title": {
            "en": "Claim and volume",
            "es": "Claim y volumen"
          },
          "text": {
            "en": "A PersistentVolumeClaim requests storage with size and access requirements. A PersistentVolume represents supplied storage. A StorageClass can enable dynamic provisioning; kind includes a local provisioner for this exercise.",
            "es": "Un PersistentVolumeClaim solicita tamaño y acceso. Un PersistentVolume representa almacenamiento provisto. Un StorageClass puede habilitar provisión dinámica; kind incluye un provisioner local para este ejercicio."
          },
          "rule": {
            "en": "The request and the storage are different objects.",
            "es": "La solicitud y el almacenamiento son objetos distintos."
          }
        },
        {
          "title": {
            "en": "Reattach after replacement",
            "es": "Volvé a montar tras reemplazar"
          },
          "text": {
            "en": "The writer Pod mounts the notebook claim at /data. Write a marker, delete only the Pod, then recreate it with the same claim. ReadWriteOnce means read-write mounting by a single node, not necessarily a single Pod.",
            "es": "El Pod writer monta notebook en /data. Escribí una marca, borrá solo el Pod y recrealo con el mismo claim. ReadWriteOnce significa montaje de lectura y escritura por un nodo, no necesariamente un único Pod."
          },
          "rule": {
            "en": "Deleting the Pod does not itself delete its claim.",
            "es": "Borrar el Pod no borra por sí solo su claim."
          }
        },
        {
          "title": {
            "en": "Local storage has local limits",
            "es": "El almacenamiento local tiene límites locales"
          },
          "text": {
            "en": "This provisioned volume lives in the local kind environment. Deleting the cluster loses it. PVC deletion and the volume reclaim policy affect storage deletion; inspect them before cleanup. This is not a replicated database or backup exercise.",
            "es": "Este volumen vive en el entorno local de kind. Borrar el clúster lo pierde. Borrar el PVC y la política de reclamación afectan el borrado del almacenamiento; inspeccionalos antes de limpiar. Esto no es una base replicada ni un ejercicio de respaldos."
          },
          "rule": {
            "en": "Persistence must name its failure boundary.",
            "es": "La persistencia tiene que nombrar su límite de falla."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "Which object asks for storage?",
            "es": "¿Qué objeto pide almacenamiento?"
          },
          "options": [
            {
              "en": "RoleBinding",
              "es": "RoleBinding"
            },
            {
              "en": "PVC",
              "es": "PVC"
            },
            {
              "en": "Service",
              "es": "Service"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "The claim declares storage requirements.",
            "es": "El claim declara requisitos de almacenamiento."
          }
        },
        {
          "question": {
            "en": "What does ReadWriteOnce restrict?",
            "es": "¿Qué restringe ReadWriteOnce?"
          },
          "options": [
            {
              "en": "Read-write mounting to one node",
              "es": "El montaje de lectura y escritura a un nodo"
            },
            {
              "en": "Exactly one process forever",
              "es": "Exactamente un proceso para siempre"
            },
            {
              "en": "All reads to one request",
              "es": "Todas las lecturas a un pedido"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "It is not a single-Pod exclusivity guarantee.",
            "es": "No garantiza exclusividad de un Pod."
          }
        },
        {
          "question": {
            "en": "Will this local data survive deleting kind?",
            "es": "¿Estos datos locales sobreviven al borrado de kind?"
          },
          "options": [
            {
              "en": "Yes, every PVC is remote",
              "es": "Sí, todo PVC es remoto"
            },
            {
              "en": "Yes, Kubernetes backs it up",
              "es": "Sí, Kubernetes los respalda"
            },
            {
              "en": "No",
              "es": "No"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The storage shares the lifetime of this local environment.",
            "es": "El almacenamiento comparte la vida de este entorno local."
          }
        }
      ],
      "source": "pv",
      "lab": [
        {
          "title": {
            "en": "Provision a claim and writer",
            "es": "Creá un claim y writer"
          },
          "text": {
            "en": "Complete lesson 13 first. The local provisioner binds storage when the Pod is scheduled.",
            "es": "Completá antes la lección 13. El provisioner local asigna almacenamiento cuando se ubica el Pod."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/storage.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab wait --for=condition=Ready pod/writer --timeout=120s",
          "expected": {
            "en": "writer becomes Ready and notebook becomes Bound.",
            "es": "writer llega a Ready y notebook a Bound."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Write and inspect the claim",
            "es": "Escribí e inspeccioná el claim"
          },
          "text": {
            "en": "The image non-root user writes to the mount. User 10001 can write because the kind provisioner creates the directory with open permissions; fsGroup matters with volume types that support ownership changes.",
            "es": "El usuario sin root escribe en el montaje. El usuario 10001 puede escribir porque el provisioner de kind crea el directorio con permisos abiertos; fsGroup importa con tipos de volumen que admiten cambio de propietario."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec writer -- sh -c 'echo pvc-survived > /data/marker'\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pvc notebook",
          "expected": {
            "en": "The claim is Bound.",
            "es": "El claim está Bound."
          },
          "checks": [
            {
              "contains": "Bound"
            }
          ]
        },
        {
          "title": {
            "en": "Replace only the Pod",
            "es": "Reemplazá solo el Pod"
          },
          "text": {
            "en": "Keep notebook. Delete writer, then apply the same file and wait.",
            "es": "Conservá notebook. Borrá writer, volvé a aplicar y esperá."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod writer --wait=true\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/storage.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab wait --for=condition=Ready pod/writer --timeout=120s",
          "expected": {
            "en": "A new writer attaches the same claim.",
            "es": "Un writer nuevo usa el mismo claim."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Read across replacement",
            "es": "Leé después del reemplazo"
          },
          "text": {
            "en": "The marker should remain. This does not test host loss or backup restore.",
            "es": "La marca debe seguir. Esto no prueba pérdida del host ni restauración de respaldo."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec writer -- cat /data/marker",
          "expected": {
            "en": "pvc-survived.",
            "es": "pvc-survived."
          },
          "checks": [
            {
              "contains": "pvc-survived"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Replace the writer Pod but retain the claim. Where does the marker live?",
        "es": "Reemplazá writer conservando el claim. ¿Dónde vive la marca?"
      }
    },
    {
      "id": 20,
      "unit": 5,
      "slug": "probes",
      "title": {
        "en": "Alive, ready, started",
        "es": "Vivo, listo, arrancado"
      },
      "intro": {
        "en": "Choose the right question before choosing a probe.",
        "es": "Elegí la pregunta correcta antes de elegir una sonda."
      },
      "visual": "probes",
      "frames": [
        {
          "title": {
            "en": "Readiness gates traffic",
            "es": "Readiness habilita tráfico"
          },
          "text": {
            "en": "A failing readiness probe marks the Pod not ready. Normal Service routing excludes unready endpoints; the container can keep running. Use readiness for whether the instance can serve traffic now.",
            "es": "Una sonda de readiness fallida marca el Pod no listo. El Service normalmente excluye endpoints no listos; el contenedor puede seguir corriendo. Usala para decidir si la instancia puede atender ahora."
          },
          "rule": {
            "en": "Not ready means stop sending normal service traffic.",
            "es": "No listo significa dejar de enviar tráfico normal del servicio."
          }
        },
        {
          "title": {
            "en": "Liveness triggers restart",
            "es": "Liveness dispara reinicio"
          },
          "text": {
            "en": "Repeated liveness failures cause the kubelet to restart the container according to restart policy. A dependency outage is often a poor liveness test: restarting every instance may make recovery worse.",
            "es": "Fallas repetidas de liveness provocan reinicio del contenedor por el kubelet según la política. Una caída de dependencia suele ser una mala prueba de liveness: reiniciar todo puede empeorar la recuperación."
          },
          "rule": {
            "en": "Restart only when restarting can help.",
            "es": "Reiniciá cuando reiniciar pueda ayudar."
          }
        },
        {
          "title": {
            "en": "Startup grants initialization time",
            "es": "Startup da tiempo de inicialización"
          },
          "text": {
            "en": "A startup probe holds readiness and liveness probing until it succeeds. Its failure threshold and period define an initialization budget. In this lab, fail readiness, observe routing state, then restore it without restarting the process.",
            "es": "Una startup probe demora readiness y liveness hasta tener éxito. Su umbral y período definen un presupuesto de inicialización. En el lab fallás readiness, observás el estado de tráfico y lo restaurás sin reiniciar el proceso."
          },
          "rule": {
            "en": "Use separate signals for separate recovery decisions.",
            "es": "Usá señales distintas para decisiones de recuperación distintas."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What does failed readiness normally change?",
            "es": "¿Qué cambia normalmente readiness fallido?"
          },
          "options": [
            {
              "en": "Traffic eligibility",
              "es": "La aptitud para recibir tráfico"
            },
            {
              "en": "The image tag",
              "es": "El tag de imagen"
            },
            {
              "en": "The PVC size",
              "es": "El tamaño del PVC"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "It changes readiness, not necessarily process execution.",
            "es": "Cambia readiness, no necesariamente ejecución del proceso."
          }
        },
        {
          "question": {
            "en": "What can repeated liveness failures trigger?",
            "es": "¿Qué pueden disparar fallas repetidas de liveness?"
          },
          "options": [
            {
              "en": "A new image build",
              "es": "Un build nuevo"
            },
            {
              "en": "A guaranteed database repair",
              "es": "Una reparación garantizada de base"
            },
            {
              "en": "A container restart",
              "es": "Un reinicio del contenedor"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The kubelet restarts; the application must tolerate restart.",
            "es": "El kubelet reinicia; la aplicación tiene que tolerarlo."
          }
        },
        {
          "question": {
            "en": "Why use a startup probe?",
            "es": "¿Para qué usar startup probe?"
          },
          "options": [
            {
              "en": "To disable liveness forever",
              "es": "Para deshabilitar liveness para siempre"
            },
            {
              "en": "To allow initialization before other probes take effect",
              "es": "Para dar tiempo de inicio antes de las otras sondas"
            },
            {
              "en": "To publish an internet address",
              "es": "Para publicar una dirección de internet"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "After startup succeeds, the other probes can operate.",
            "es": "Tras startup exitoso, las otras sondas pueden operar."
          }
        }
      ],
      "source": "probes",
      "lab": [
        {
          "title": {
            "en": "Prepare a dedicated probe Pod",
            "es": "Prepará un Pod dedicado a sondas"
          },
          "text": {
            "en": "Complete lesson 13 first. A named Pod and Service isolate this experiment from Deployment scale transitions.",
            "es": "Completá antes la lección 13. Un Pod y Service con nombre aíslan el experimento de cambios de escala."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/probe.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab wait --for=condition=Ready pod/probe --timeout=90s",
          "expected": {
            "en": "Pod probe is Ready.",
            "es": "El Pod probe está Ready."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Inspect the three probes",
            "es": "Inspeccioná las tres sondas"
          },
          "text": {
            "en": "Read startup, readiness and liveness configuration before failing anything.",
            "es": "Leé startup, readiness y liveness antes de provocar fallas."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get pod probe -o yaml",
          "expected": {
            "en": "Separate HTTP endpoints for readiness and liveness; startup gates initialization.",
            "es": "Endpoints HTTP separados para readiness y liveness; startup controla inicialización."
          },
          "checks": [
            {
              "contains": "readinessProbe:"
            },
            {
              "contains": "livenessProbe:"
            }
          ]
        },
        {
          "title": {
            "en": "Fail readiness only",
            "es": "Fallá solo readiness"
          },
          "text": {
            "en": "Create the failure flag and wait for this exact Pod. Inspect endpoint propagation; repeat the last command until ready: false.",
            "es": "Creá la marca y esperá este Pod exacto. Inspeccioná propagación de endpoints; repetí el último comando hasta ready: false."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec probe -- touch /tmp/not-ready\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab wait --for=condition=Ready=false pod/probe --timeout=60s\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get endpointslices -l kubernetes.io/service-name=probe-entry -o yaml",
          "expected": {
            "en": "The endpoint becomes unready while the process stays running.",
            "es": "El endpoint deja de estar listo mientras el proceso sigue corriendo."
          },
          "checks": [
            {
              "contains": "ready: false",
              "retry": 20
            }
          ]
        },
        {
          "title": {
            "en": "Restore and verify",
            "es": "Restaurá y verificá"
          },
          "text": {
            "en": "Remove the flag, wait for Ready and assert the Service response. The probe allows up to 30 attempts for endpoint propagation. Then delete only these probe practice objects.",
            "es": "Borrá la marca, esperá Ready y comprobá la respuesta. La sonda admite hasta 30 intentos por propagación de endpoints. Después borrá solo estos objetos de práctica."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec probe -- rm /tmp/not-ready\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab wait --for=condition=Ready pod/probe --timeout=60s\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec probe -- python /app/probe.py http://probe-entry 1.0.0 200 30\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete -f k8s/probe.yaml --wait=true",
          "expected": {
            "en": "PASS after recovery; the dedicated Pod and Service are removed.",
            "es": "PASS tras recuperarse; se borran el Pod y Service dedicados."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Choose readiness or liveness failure. Which changes routing and which requests a restart?",
        "es": "Elegí falla de readiness o liveness. ¿Cuál cambia tráfico y cuál pide reinicio?"
      }
    },
    {
      "id": 21,
      "unit": 6,
      "slug": "scheduling",
      "title": {
        "en": "Requests, limits and placement",
        "es": "Requests, limits y ubicación"
      },
      "intro": {
        "en": "The scheduler needs a declared resource budget.",
        "es": "El scheduler necesita un presupuesto de recursos declarado."
      },
      "visual": "scheduler",
      "frames": [
        {
          "title": {
            "en": "Requests reserve scheduling capacity",
            "es": "Requests reservan capacidad de scheduling"
          },
          "text": {
            "en": "The scheduler uses requests when deciding where a Pod fits, along with constraints such as taints and node selection. CPU 50m means 0.05 CPU; memory 32Mi is 32 mebibytes. Live low usage does not erase declared requests.",
            "es": "El scheduler usa requests para ubicar un Pod, junto con restricciones como taints y selección de nodo. CPU 50m significa 0,05 CPU; memoria 32Mi son 32 mebibytes. Un uso actual bajo no borra los requests declarados."
          },
          "rule": {
            "en": "Placement uses declared needs, not wishful thinking.",
            "es": "La ubicación usa necesidades declaradas, no deseos."
          }
        },
        {
          "title": {
            "en": "Limits constrain execution",
            "es": "Limits restringen ejecución"
          },
          "text": {
            "en": "A CPU limit can throttle execution; exceeding a memory limit can lead to OOM termination. Requests and limits do different work. Limits alone do not guarantee latency or protection from every node failure.",
            "es": "Un límite CPU puede restringir ejecución; exceder memoria puede provocar terminación OOM. Requests y limits hacen trabajos distintos. Los límites solos no garantizan latencia ni protección ante cualquier falla del nodo."
          },
          "rule": {
            "en": "Scheduling budget and runtime ceiling differ.",
            "es": "El presupuesto de scheduling y el techo de ejecución son distintos."
          }
        },
        {
          "title": {
            "en": "Pending is evidence",
            "es": "Pending es evidencia"
          },
          "text": {
            "en": "The no-room Pod requests 1000 CPUs, deliberately more than this learning cluster provides. describe shows FailedScheduling and its reason. Diagnose the unsatisfied constraint before changing requests or adding nodes.",
            "es": "El Pod no-room pide 1000 CPU, deliberadamente más de lo que ofrece este clúster de estudio. describe muestra FailedScheduling y su causa. Diagnosticá la restricción antes de cambiar requests o agregar nodos."
          },
          "rule": {
            "en": "Pending is a state to explain, not a reason to restart blindly.",
            "es": "Pending es un estado para explicar, no para reiniciar a ciegas."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What does 250m CPU mean?",
            "es": "¿Qué significa CPU 250m?"
          },
          "options": [
            {
              "en": "One quarter of a CPU",
              "es": "Un cuarto de CPU"
            },
            {
              "en": "250 CPU cores",
              "es": "250 núcleos CPU"
            },
            {
              "en": "250 MiB",
              "es": "250 MiB"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "1000m equals one CPU.",
            "es": "1000m equivale a una CPU."
          }
        },
        {
          "question": {
            "en": "Which values inform normal resource fit?",
            "es": "¿Qué valores informan el encaje normal de recursos?"
          },
          "options": [
            {
              "en": "Container names",
              "es": "Nombres de contenedor"
            },
            {
              "en": "Requests",
              "es": "Requests"
            },
            {
              "en": "Only yesterday's usage",
              "es": "Solo el uso de ayer"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Requests are part of scheduling decisions.",
            "es": "Los requests son parte de la decisión de scheduling."
          }
        },
        {
          "question": {
            "en": "Where do you look for the reason a Pod stays Pending?",
            "es": "¿Dónde buscás por qué un Pod sigue Pending?"
          },
          "options": [
            {
              "en": "Only the browser console",
              "es": "Solo la consola del navegador"
            },
            {
              "en": "The license file",
              "es": "La licencia"
            },
            {
              "en": "Pod events and description",
              "es": "Eventos y descripción del Pod"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "FailedScheduling events identify unmet constraints.",
            "es": "Los eventos FailedScheduling identifican restricciones incumplidas."
          }
        }
      ],
      "source": "kresources",
      "lab": [
        {
          "title": {
            "en": "Inspect declared budgets",
            "es": "Inspeccioná presupuestos"
          },
          "text": {
            "en": "The app requests 50m CPU and 32Mi memory per replica, with higher limits.",
            "es": "La app pide 50m CPU y 32Mi por réplica, con límites mayores."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal -o 'jsonpath={.spec.template.spec.containers[0].resources}'",
          "expected": {
            "en": "Requests and limits are distinct fields.",
            "es": "Requests y limits son campos distintos."
          },
          "checks": [
            {
              "contains": "requests"
            }
          ]
        },
        {
          "title": {
            "en": "Submit an impossible request",
            "es": "Enviá un pedido imposible"
          },
          "text": {
            "en": "This practice Pod asks for 1000 CPUs. It should stay Pending in this local cluster.",
            "es": "Este Pod pide 1000 CPU. Debe quedar Pending en este clúster local."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/pending.yaml",
          "expected": {
            "en": "no-room is created but cannot be scheduled.",
            "es": "Se crea no-room pero no puede ubicarse."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Read the scheduling reason",
            "es": "Leé el motivo del FailedScheduling"
          },
          "text": {
            "en": "Wait a few seconds and repeat describe until its Events section explains FailedScheduling.",
            "es": "Esperá unos segundos y repetí describe hasta ver FailedScheduling en Events."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab describe pod no-room",
          "expected": {
            "en": "FailedScheduling with insufficient CPU and possibly control-plane taint details.",
            "es": "FailedScheduling por CPU insuficiente y posiblemente detalles del taint del nodo de control."
          },
          "checks": [
            {
              "contains": "FailedScheduling",
              "retry": 30
            }
          ]
        },
        {
          "title": {
            "en": "Remove only the failed exercise",
            "es": "Borrá solo el ejercicio fallido"
          },
          "text": {
            "en": "Delete no-room. This does not delete the application Deployment.",
            "es": "Borrá no-room. No borra el Deployment de la aplicación."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod no-room --wait=true\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal",
          "expected": {
            "en": "signal remains available.",
            "es": "signal sigue disponible."
          },
          "checks": [
            {
              "contains": "signal"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Raise the request above available capacity. Why does the Pod stay Pending?",
        "es": "Subí el request sobre la capacidad disponible. ¿Por qué queda Pending?"
      }
    },
    {
      "id": 22,
      "unit": 6,
      "slug": "rollouts",
      "title": {
        "en": "Change versions with a way back",
        "es": "Cambiá versiones con una vuelta posible"
      },
      "intro": {
        "en": "A rollout is a transition you must observe.",
        "es": "Un rollout es una transición que tenés que observar."
      },
      "visual": "rollout",
      "frames": [
        {
          "title": {
            "en": "A new template revision",
            "es": "Una revisión de plantilla nueva"
          },
          "text": {
            "en": "Changing the Deployment image updates its Pod template and creates a new ReplicaSet. A rolling update gradually replaces instances, governed by maxSurge and maxUnavailable. Our manifest allows one extra and zero unavailable replicas.",
            "es": "Cambiar la imagen actualiza la plantilla y crea otro ReplicaSet. Un rolling update reemplaza instancias gradualmente según maxSurge y maxUnavailable. Nuestro manifiesto admite una extra y cero no disponibles."
          },
          "rule": {
            "en": "Strategy controls the transition, not application compatibility.",
            "es": "La estrategia controla la transición, no la compatibilidad de la aplicación."
          }
        },
        {
          "title": {
            "en": "Watch for convergence",
            "es": "Observá convergencia"
          },
          "text": {
            "en": "Build version 1.1.0, load it into kind, then set the image. rollout status waits for completion or a timeout. With imagePullPolicy: Never, forgetting the import leaves new Pods unable to start.",
            "es": "Construí 1.1.0, importala en kind y cambiá la imagen. rollout status espera finalización o timeout. Con imagePullPolicy: Never, olvidar la importación impide arrancar Pods nuevos."
          },
          "rule": {
            "en": "An update request is not a successful release.",
            "es": "Pedir una actualización no equivale a publicar con éxito."
          }
        },
        {
          "title": {
            "en": "Rollback has a boundary",
            "es": "Rollback tiene un límite"
          },
          "text": {
            "en": "rollout undo restores a previous Pod template revision. It does not undo database migrations, restore external data or revert an independent ConfigMap. Verify both the deployed version and application behavior after reverting.",
            "es": "rollout undo restaura una revisión anterior de plantilla. No deshace migraciones, restaura datos externos ni revierte un ConfigMap independiente. Verificá versión y comportamiento después de volver."
          },
          "rule": {
            "en": "Rollback restores a template, not the whole world.",
            "es": "Rollback restaura una plantilla, no todo el mundo."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What triggers this new Deployment revision?",
            "es": "¿Qué dispara esta revisión nueva?"
          },
          "options": [
            {
              "en": "Reading logs",
              "es": "Leer logs"
            },
            {
              "en": "Opening a Service URL",
              "es": "Abrir la URL del Service"
            },
            {
              "en": "A Pod template change",
              "es": "Un cambio de plantilla de Pod"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The image field belongs to the Pod template.",
            "es": "La imagen pertenece a la plantilla."
          }
        },
        {
          "question": {
            "en": "What does maxSurge: 1 allow here?",
            "es": "¿Qué permite maxSurge: 1 acá?"
          },
          "options": [
            {
              "en": "One permanent additional replica",
              "es": "Una réplica extra permanente"
            },
            {
              "en": "One extra Pod above desired count during the rollout",
              "es": "Un Pod extra sobre la cantidad deseada durante el rollout"
            },
            {
              "en": "One guaranteed spare physical node",
              "es": "Un nodo físico de reserva garantizado"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Surge permits temporary extra capacity demand.",
            "es": "Surge permite demanda temporal adicional de capacidad."
          }
        },
        {
          "question": {
            "en": "Does rollout undo revert database changes?",
            "es": "¿Rollout undo revierte cambios de base?"
          },
          "options": [
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes",
              "es": "Sí"
            },
            {
              "en": "Only with readiness probes",
              "es": "Solo con readiness"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "External side effects need their own recovery plan.",
            "es": "Los efectos externos necesitan su plan de recuperación."
          }
        }
      ],
      "source": "deployment",
      "lab": [
        {
          "title": {
            "en": "Restore the declared baseline",
            "es": "Restaurá la base declarada"
          },
          "text": {
            "en": "Complete lesson 13 first. Apply the course manifest in dk-lab and wait for its rollout. This restores the image and replica count declared in the file.",
            "es": "Completá antes la lección 13. Aplicá el manifiesto en dk-lab y esperá el rollout. Restaura imagen y cantidad de réplicas declaradas."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Deployment signal finishes its rollout with two ready replicas.",
            "es": "El Deployment signal termina el rollout con dos réplicas listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Build and import the next artifact",
            "es": "Construí e importá el próximo artefacto"
          },
          "text": {
            "en": "Keep version 1.0.0 for rollback. Import 1.1.0 before changing the template.",
            "es": "Conservá 1.0.0 para volver. Importá 1.1.0 antes de cambiar la plantilla."
          },
          "command": "docker build --build-arg APP_VERSION=1.1.0 -t prumathe-signal:1.1.0 app\nkind load docker-image prumathe-signal:1.1.0 --name prumathe-dk",
          "expected": {
            "en": "Both versions are available to node runtimes.",
            "es": "Ambas versiones están disponibles en los nodos."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Roll forward and assert",
            "es": "Avanzá y comprobá"
          },
          "text": {
            "en": "Set the app image, wait for all updated replicas, then verify the Service response. The Service probe allows up to 30 attempts, one second apart after failures, for endpoint updates to propagate.",
            "es": "Cambiá imagen, esperá réplicas actualizadas y verificá respuesta. La sonda del Service admite hasta 30 intentos, separados por un segundo tras fallar, para dar tiempo a propagar endpoints."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab set image deployment/signal app=prumathe-signal:1.1.0\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec deployment/signal -- python /app/probe.py http://signal 1.1.0 200 30",
          "expected": {
            "en": "Version 1.1.0 and PASS.",
            "es": "Versión 1.1.0 y PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        },
        {
          "title": {
            "en": "Undo the template revision",
            "es": "Volvé a la revisión anterior"
          },
          "text": {
            "en": "Rollback the immediately preceding image update and verify behavior again. No external data is restored by undo. The Service probe allows up to 30 attempts, one second apart after failures, for endpoint updates to propagate.",
            "es": "Revertí la actualización de imagen anterior y verificá otra vez. undo no restaura datos externos. La sonda del Service admite hasta 30 intentos, separados por un segundo tras fallar, para dar tiempo a propagar endpoints."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout undo deployment/signal\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec deployment/signal -- python /app/probe.py http://signal 1.0.0 200 30",
          "expected": {
            "en": "Version 1.0.0 and PASS.",
            "es": "Versión 1.0.0 y PASS."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Advance the rollout. Count old and new replicas at each stage.",
        "es": "Avanzá el rollout. Contá réplicas viejas y nuevas en cada etapa."
      }
    },
    {
      "id": 23,
      "unit": 6,
      "slug": "rbac",
      "title": {
        "en": "Grant only the needed verbs",
        "es": "Otorgá solo los verbos necesarios"
      },
      "intro": {
        "en": "Identity, permissions and binding are separate objects.",
        "es": "Identidad, permisos y vínculo son objetos distintos."
      },
      "visual": "rbac",
      "frames": [
        {
          "title": {
            "en": "Identify the caller",
            "es": "Identificá quién llama"
          },
          "text": {
            "en": "A ServiceAccount gives workloads an identity for Kubernetes API access. Our observer is a practice identity. Most course Pods do not need API access, so their automatic service account token mount is disabled.",
            "es": "Un ServiceAccount da identidad a cargas para acceder a la API. observer es una identidad de práctica. La mayoría de los Pods del curso no necesita API, así que deshabilitamos el montaje automático del token."
          },
          "rule": {
            "en": "Do not mount API credentials without a need.",
            "es": "No montes credenciales de API sin necesidad."
          }
        },
        {
          "title": {
            "en": "Bind verbs to resources",
            "es": "Vinculá verbos con recursos"
          },
          "text": {
            "en": "A Role grants get, list and watch on Pods inside dk-lab. A RoleBinding attaches that Role to observer. It does not grant secret access or Pod deletion. RBAC permissions are additive; there is no deny rule here.",
            "es": "Un Role otorga get, list y watch sobre Pods dentro de dk-lab. Un RoleBinding lo vincula a observer. No otorga acceso a secretos ni borrado de Pods. Los permisos RBAC se suman; acá no hay una regla deny."
          },
          "rule": {
            "en": "Scope the subject, verbs, resources and namespace.",
            "es": "Acotá sujeto, verbos, recursos y namespace."
          }
        },
        {
          "title": {
            "en": "Check authorization",
            "es": "Comprobá autorización"
          },
          "text": {
            "en": "auth can-i asks whether an action is authorized. The lab administrator impersonates observer to check one allowed and two denied actions; impersonation itself requires permission. Authorization says nothing about network reachability or application login.",
            "es": "auth can-i pregunta si una acción está autorizada. El administrador del lab suplanta observer para comprobar una acción permitida y dos denegadas; suplantar también requiere permiso. La autorización no informa conectividad ni login de la aplicación."
          },
          "rule": {
            "en": "An authorization check tests one action for one identity.",
            "es": "Una comprobación prueba una acción para una identidad."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What attaches permissions to observer?",
            "es": "¿Qué vincula permisos a observer?"
          },
          "options": [
            {
              "en": "Service",
              "es": "Service"
            },
            {
              "en": "Dockerfile USER",
              "es": "Dockerfile USER"
            },
            {
              "en": "RoleBinding",
              "es": "RoleBinding"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "The Role defines permissions; the binding assigns them.",
            "es": "El Role define permisos; el vínculo los asigna."
          }
        },
        {
          "question": {
            "en": "Can this observer delete Pods?",
            "es": "¿Este observer puede borrar Pods?"
          },
          "options": [
            {
              "en": "No, delete is not granted",
              "es": "No, no se otorga delete"
            },
            {
              "en": "Yes, list includes delete",
              "es": "Sí, list incluye delete"
            },
            {
              "en": "Yes, all ServiceAccounts are admins",
              "es": "Sí, todos son administradores"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Verbs are explicit and permissions accumulate across bindings.",
            "es": "Los verbos son explícitos y los permisos se suman entre vínculos."
          }
        },
        {
          "question": {
            "en": "Does can-i prove network connectivity?",
            "es": "¿Can-i prueba conectividad de red?"
          },
          "options": [
            {
              "en": "Only for Secrets",
              "es": "Solo para Secrets"
            },
            {
              "en": "No",
              "es": "No"
            },
            {
              "en": "Yes",
              "es": "Sí"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "It evaluates authorization, not every path to a working request.",
            "es": "Evalúa autorización, no todo lo necesario para un pedido exitoso."
          }
        }
      ],
      "source": "rbac",
      "lab": [
        {
          "title": {
            "en": "Create a read-only identity",
            "es": "Creá una identidad de lectura"
          },
          "text": {
            "en": "Apply ServiceAccount, Role and RoleBinding inside dk-lab. No cluster-wide role is granted.",
            "es": "Aplicá ServiceAccount, Role y RoleBinding en dk-lab. No se otorga un rol de todo el clúster."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/rbac.yaml",
          "expected": {
            "en": "observer is bound to pod-reader.",
            "es": "observer queda vinculado a pod-reader."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Check the permitted action",
            "es": "Comprobá la acción permitida"
          },
          "text": {
            "en": "The lab administrator uses impersonation for this authorization check.",
            "es": "El administrador del lab usa suplantación para esta comprobación."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab auth can-i list pods --as=system:serviceaccount:dk-lab:observer",
          "expected": {
            "en": "yes.",
            "es": "yes."
          },
          "checks": [
            {
              "contains": "yes"
            }
          ]
        },
        {
          "title": {
            "en": "Check a denied destructive action",
            "es": "Comprobá una acción destructiva denegada"
          },
          "text": {
            "en": "This only asks for authorization; it does not delete a Pod. A no response and nonzero exit are expected.",
            "es": "Solo consulta autorización; no borra un Pod. Se espera no y salida distinta de cero."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab auth can-i delete pods --as=system:serviceaccount:dk-lab:observer",
          "expected": {
            "en": "no, exit code 1. That denial is the intended result.",
            "es": "no, código 1. La denegación es el resultado previsto."
          },
          "checks": [
            {
              "contains": "no",
              "exit": 1
            }
          ]
        },
        {
          "title": {
            "en": "Check a denied data read",
            "es": "Comprobá una lectura denegada"
          },
          "text": {
            "en": "The role permits Pods, not Secrets. Again, the expected nonzero exit represents successful restriction.",
            "es": "El rol permite Pods, no Secrets. Otra vez, la salida distinta de cero demuestra la restricción."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab auth can-i get secrets --as=system:serviceaccount:dk-lab:observer",
          "expected": {
            "en": "no, exit code 1.",
            "es": "no, código 1."
          },
          "checks": [
            {
              "contains": "no",
              "exit": 1
            }
          ]
        }
      ],
      "experiment": {
        "en": "Select an API verb. Which requests does the Role permit for observer?",
        "es": "Elegí un verbo de API. ¿Qué pedidos permite el Role de observer?"
      }
    },
    {
      "id": 24,
      "unit": 6,
      "slug": "capstone",
      "title": {
        "en": "Deploy, break, recover",
        "es": "Desplegá, rompé, recuperá"
      },
      "intro": {
        "en": "Explain the chain from an image to an available service.",
        "es": "Explicá la cadena de una imagen a un servicio disponible."
      },
      "visual": "capstone",
      "frames": [
        {
          "title": {
            "en": "State the acceptance criteria",
            "es": "Definí criterios de aceptación"
          },
          "text": {
            "en": "Deploy two replicas of Signal 1.0.0. Require ready Pods, a Service with ready endpoints and an HTTP response containing the expected version. These checks measure different layers of success.",
            "es": "Desplegá dos réplicas de Signal 1.0.0. Exigí Pods listos, Service con destinos listos y respuesta HTTP con la versión esperada. Esas comprobaciones miden capas distintas del éxito."
          },
          "rule": {
            "en": "A green status is useful only with a named criterion.",
            "es": "Un estado verde sirve con un criterio declarado."
          }
        },
        {
          "title": {
            "en": "Inject and explain a failure",
            "es": "Provocá y explicá una falla"
          },
          "text": {
            "en": "Delete the app Pods, wait for replacements and request the service again. Explain which controller acted, what identity changed and what data was not preserved. The experiment is a replacement test, not a zero-downtime benchmark.",
            "es": "Borrá los Pods, esperá reemplazos y consultá otra vez. Explicá qué controlador actuó, qué identidad cambió y qué datos no se conservaron. Es una prueba de reemplazo, no una medición de cero interrupciones."
          },
          "rule": {
            "en": "Report the guarantee and its limit together.",
            "es": "Informá la garantía junto con su límite."
          }
        },
        {
          "title": {
            "en": "Write the next operating questions",
            "es": "Anotá las próximas preguntas operativas"
          },
          "text": {
            "en": "Before a real deployment, decide image distribution, TLS and external routing, capacity, observability, backups and access policies. HPA needs metrics; NetworkPolicy needs an enforcing network implementation. Those extensions need separate validation and are outside this course baseline.",
            "es": "Antes de un despliegue real, decidí distribución de imágenes, TLS y acceso externo, capacidad, observabilidad, respaldos y políticas. HPA necesita métricas; NetworkPolicy necesita una red que la aplique. Esas extensiones requieren validación aparte y quedan fuera de esta base."
          },
          "rule": {
            "en": "A learning cluster teaches mechanisms, not a production checklist completed.",
            "es": "Un clúster de estudio enseña mecanismos; no completa la preparación productiva."
          }
        }
      ],
      "quiz": [
        {
          "question": {
            "en": "What proves the app returned the expected version?",
            "es": "¿Qué prueba que la aplicación devolvió la versión esperada?"
          },
          "options": [
            {
              "en": "Only an image tag in a file",
              "es": "Solo un tag en un archivo"
            },
            {
              "en": "An HTTP response with an asserted version",
              "es": "Una respuesta HTTP con versión comprobada"
            },
            {
              "en": "Only apply success",
              "es": "Solo apply exitoso"
            }
          ],
          "correct": 1,
          "explanation": {
            "en": "Observe the application as well as infrastructure state.",
            "es": "Observá aplicación y estado de infraestructura."
          }
        },
        {
          "question": {
            "en": "What does deleting and replacing Pods demonstrate?",
            "es": "¿Qué demuestra borrar y reemplazar Pods?"
          },
          "options": [
            {
              "en": "Controller-driven replacement in this environment",
              "es": "Reemplazo por controlador en este entorno"
            },
            {
              "en": "Guaranteed zero downtime",
              "es": "Cero interrupciones garantizado"
            },
            {
              "en": "Survival of host destruction",
              "es": "Supervivencia a la destrucción del host"
            }
          ],
          "correct": 0,
          "explanation": {
            "en": "Availability during every instant needs a different measurement.",
            "es": "La disponibilidad en cada instante necesita otra medición."
          }
        },
        {
          "question": {
            "en": "What is still needed for production data recovery?",
            "es": "¿Qué sigue haciendo falta para recuperar datos productivos?"
          },
          "options": [
            {
              "en": "Only two replicas",
              "es": "Solo dos réplicas"
            },
            {
              "en": "Only an image digest",
              "es": "Solo un digest de imagen"
            },
            {
              "en": "A tested backup and restoration plan",
              "es": "Un plan probado de respaldo y restauración"
            }
          ],
          "correct": 2,
          "explanation": {
            "en": "Replicas and images do not replace data backups.",
            "es": "Las réplicas y las imágenes no reemplazan respaldos de datos."
          }
        }
      ],
      "source": "deployment",
      "lab": [
        {
          "title": {
            "en": "Restore the declared baseline",
            "es": "Restaurá la base declarada"
          },
          "text": {
            "en": "Complete lesson 13 first. Apply the course manifest in dk-lab and wait for its rollout. This restores the image and replica count declared in the file.",
            "es": "Completá antes la lección 13. Aplicá el manifiesto en dk-lab y esperá el rollout. Restaura imagen y cantidad de réplicas declaradas."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab apply -f k8s/base.yaml\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Deployment signal finishes its rollout with two ready replicas.",
            "es": "El Deployment signal termina el rollout con dos réplicas listas."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Record a baseline response",
            "es": "Registrá una respuesta base"
          },
          "text": {
            "en": "Assert the version and inspect ready endpoints before injecting failure. The Service probe allows up to 30 attempts, one second apart after failures, for endpoint updates to propagate.",
            "es": "Comprobá versión e inspeccioná endpoints listos antes de fallar. La sonda del Service admite hasta 30 intentos, separados por un segundo tras fallar, para dar tiempo a propagar endpoints."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec deployment/signal -- python /app/probe.py http://signal 1.0.0 200 30\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get endpointslices -l kubernetes.io/service-name=signal -o yaml",
          "expected": {
            "en": "PASS and ready endpoints.",
            "es": "PASS y endpoints listos."
          },
          "checks": [
            {
              "contains": "PASS"
            },
            {
              "contains": "ready: true"
            }
          ]
        },
        {
          "title": {
            "en": "Delete and recover instances",
            "es": "Borrá y recuperá instancias"
          },
          "text": {
            "en": "Delete only app=signal Pods in dk-lab. This may interrupt traffic. Wait for the controller to restore the desired count.",
            "es": "Borrá solo Pods app=signal de dk-lab. Puede interrumpir tráfico. Esperá que el controlador restaure la cantidad."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab delete pod -l app=signal --wait=true\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab rollout status deployment/signal --timeout=90s",
          "expected": {
            "en": "Replacement Pods become ready.",
            "es": "Los Pods de reemplazo quedan listos."
          },
          "checks": []
        },
        {
          "title": {
            "en": "Assert the result and explain the limit",
            "es": "Comprobá y explicá el límite"
          },
          "text": {
            "en": "Verify the response again. Write what changed, what persisted and why this does not prove zero downtime. Cleanup commands and their data effects are in labs/README.md. The Service probe allows up to 30 attempts, one second apart after failures, for endpoint updates to propagate.",
            "es": "Verificá otra vez. Anotá qué cambió, qué persistió y por qué no prueba cero interrupciones. Los comandos de limpieza y sus efectos están en labs/README.md. La sonda del Service admite hasta 30 intentos, separados por un segundo tras fallar, para dar tiempo a propagar endpoints."
          },
          "command": "kubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab exec deployment/signal -- python /app/probe.py http://signal 1.0.0 200 30\nkubectl --kubeconfig kubeconfig --context kind-prumathe-dk -n dk-lab get deployment signal",
          "expected": {
            "en": "PASS and two ready replicas. You observed replacement, not host resilience.",
            "es": "PASS y dos réplicas listas. Observaste reemplazo, no resistencia del host."
          },
          "checks": [
            {
              "contains": "PASS"
            }
          ]
        }
      ],
      "experiment": {
        "en": "Break and recover the application instances. Which checks need to pass again?",
        "es": "Rompé y recuperá las instancias. ¿Qué comprobaciones tienen que volver a pasar?"
      }
    }
  ]
};
