/* The "What Docker and Kubernetes are" page: what they are, where they came from, where they fit
   and where they do not. Read once, before lesson 00. Bilingual like the curriculum; scripts/build.mjs
   puts it in what-docker-and-kubernetes-are.html and in the course notes, scripts/check.mjs verifies
   it. Product facts come from the sources listed at the end; the "where they do not fit" part is the
   course's own judgment and says so. */
window.DK_ABOUT = (() => {
  const B = (en, es) => ({ en, es });
  return {
    eyebrow: B('A FIVE MINUTE READ', 'CINCO MINUTOS DE LECTURA'),
    title: B('What Docker and Kubernetes are', 'Qué son Docker y Kubernetes'),
    lead: B(
      'What they are, where they came from, where they fit and where they do not. Read it once; the lessons do the rest.',
      'Qué son, de dónde salieron, dónde encajan y dónde no. Se lee una vez; el resto lo hacen las lecciones.',
    ),
    what: {
      title: B('An isolated process and a declared state', 'Un proceso aislado y un estado declarado'),
      text: [
        B(
          'A container is a process that the Linux kernel isolates with namespaces (its own view of processes, network and filesystem) and limits with cgroups (CPU and memory), and that shares the host kernel with every other container. It is not a virtual machine: there is no guest operating system, only a process with the files it needs. Those files travel as an image, immutable and made of layers. Docker is the tool that builds that image from a Dockerfile, runs it as a container and distributes it through a registry; Compose describes several containers on one host in a single file.',
          'Un contenedor es un proceso que el kernel de Linux aísla con namespaces (su propia vista de procesos, red y sistema de archivos) y limita con cgroups (CPU y memoria), y que comparte el kernel del host con todos los demás contenedores. No es una máquina virtual: no hay un sistema operativo huésped, solo un proceso con los archivos que necesita. Esos archivos viajan como una imagen, inmutable y hecha de capas. Docker es la herramienta que construye esa imagen a partir de un Dockerfile, la ejecuta como contenedor y la distribuye por un registro; Compose describe varios contenedores en un host en un solo archivo.',
        ),
        B(
          'Kubernetes is a platform for running many containers across many machines. You declare the desired state as objects of its API: a Deployment with three replicas of an image, a Service in front of them. Controllers compare that declaration with what exists and act on the difference; the scheduler places each Pod on a node; a Service gives the Pods a stable name and address while they come and go; a rollout replaces instances a few at a time. Kubernetes does not need Docker to run containers: it talks to a runtime through the Container Runtime Interface, usually containerd. The image you built with Docker is the same one that runtime pulls.',
          'Kubernetes es una plataforma para ejecutar muchos contenedores en muchas máquinas. Declarás el estado deseado como objetos de su API: un Deployment con tres réplicas de una imagen, un Service delante de ellas. Los controladores comparan esa declaración con lo que existe y actúan sobre la diferencia; el scheduler ubica cada Pod en un nodo; un Service da a los Pods un nombre y una dirección estables mientras aparecen y desaparecen; un rollout reemplaza instancias de a pocas. Kubernetes no necesita Docker para ejecutar contenedores: habla con un runtime a través de la Container Runtime Interface, normalmente containerd. La imagen que construiste con Docker es la misma que ese runtime descarga.',
        ),
      ],
      rule: B('Docker runs a container; Kubernetes keeps a declared state.', 'Docker ejecuta un contenedor; Kubernetes sostiene un estado declarado.'),
      modelNote: B(
        'The model from lesson 15. Move the desired replicas and lose an instance; the observed count follows the declaration, not the other way around.',
        'El modelo de la lección 15. Mové las réplicas deseadas y perdé una instancia; la cantidad observada sigue a la declaración, no al revés.',
      ),
    },
    origin: {
      title: B('Where they came from', 'De dónde salieron'),
      text: [
        B(
          'Docker was shown in public in March 2013, in a talk at PyCon by Solomon Hykes, from the team at dotCloud, which already used Linux containers. The kernel pieces existed: namespaces had been in Linux since 2008 and control groups with them, and LXC and union filesystems were in use. What Docker added was the image, the Dockerfile, the registry and one command line to build, run and share. In June 2015 Docker donated its container format and its runtime, runC, to the Open Container Initiative, formed under the Linux Foundation; the image and runtime specifications that came out of it are why an image built with Docker runs under any CRI runtime.',
          'Docker se mostró en público en marzo de 2013, en una charla en PyCon de Solomon Hykes, del equipo de dotCloud, que ya usaba contenedores Linux. Las piezas del kernel existían: los namespaces estaban en Linux desde 2008 y los control groups con ellos, y LXC y los union filesystems estaban en uso. Lo que Docker agregó fue la imagen, el Dockerfile, el registro y una sola línea de comandos para construir, ejecutar y compartir. En junio de 2015 Docker donó su formato de contenedor y su runtime, runC, a la Open Container Initiative, formada bajo la Linux Foundation; las especificaciones de imagen y de runtime que salieron de ahí son la razón de que una imagen construida con Docker corra bajo cualquier runtime CRI.',
        ),
        B(
          'Kubernetes came out of Google in 2014, written by engineers who had built and operated Borg, the system that had run Google\'s containers for more than a decade. Version 1.0 arrived on July 21, 2015, and on the same day Google, the Linux Foundation and a group of companies formed the Cloud Native Computing Foundation and seeded it with Kubernetes. Since then the changes that matter most to how it is used are the ones on the timeline.',
          'Kubernetes salió de Google en 2014, escrito por ingenieros que habían construido y operado Borg, el sistema que llevaba más de una década ejecutando los contenedores de Google. La versión 1.0 llegó el 21 de julio de 2015 y ese mismo día Google, la Linux Foundation y un grupo de empresas formaron la Cloud Native Computing Foundation y la sembraron con Kubernetes. Desde entonces, los cambios que más pesan en cómo se usa son los de la línea de tiempo.',
        ),
      ],
      timeline: [
        {
          year: '2013',
          label: B('Docker', 'Docker'),
          text: B(
            'Solomon Hykes shows Docker in public at PyCon on March 15, built on namespaces and control groups the kernel had had since 2008.',
            'Solomon Hykes muestra Docker en público en PyCon el 15 de marzo, construido sobre namespaces y control groups que el kernel tenía desde 2008.',
          ),
        },
        {
          year: '2014',
          label: B('Kubernetes', 'Kubernetes'),
          text: B(
            'Google open sources Kubernetes, built on what it had learned with Borg.',
            'Google libera Kubernetes como open source, construido sobre lo aprendido con Borg.',
          ),
        },
        {
          year: '2015',
          label: B('OCI and CNCF', 'OCI y CNCF'),
          text: B(
            'June 22: the Open Container Initiative is formed and Docker donates runC. July 21: Kubernetes 1.0 and the Cloud Native Computing Foundation.',
            '22 de junio: se forma la Open Container Initiative y Docker dona runC. 21 de julio: Kubernetes 1.0 y la Cloud Native Computing Foundation.',
          ),
        },
        {
          year: '2020',
          label: B('Compose spec', 'Compose spec'),
          text: B(
            'April: the Compose file format becomes an open specification. Late in the year, Kubernetes 1.20 announces that dockershim, the direct integration with Docker Engine, will be removed.',
            'Abril: el formato de archivo de Compose pasa a ser una especificación abierta. A fin de año, Kubernetes 1.20 anuncia que dockershim, la integración directa con Docker Engine, se va a quitar.',
          ),
        },
        {
          year: '2022',
          label: B('Kubernetes 1.24', 'Kubernetes 1.24'),
          text: B(
            'Dockershim is removed from the kubelet; a cluster needs a CRI runtime such as containerd or CRI-O. Images built with Docker keep working.',
            'Dockershim sale del kubelet; un clúster necesita un runtime CRI como containerd o CRI-O. Las imágenes construidas con Docker siguen funcionando.',
          ),
        },
        {
          year: '2026',
          label: B('Today', 'Hoy'),
          text: B(
            'Kubernetes 1.37 is the current minor release and kind 0.33.0 runs it as its default node image. The course pins both.',
            'Kubernetes 1.37 es la versión menor vigente y kind 0.33.0 la ejecuta como imagen de nodo por defecto. El curso fija las dos.',
          ),
        },
      ],
    },
    fits: {
      title: B('Where they fit', 'Dónde encajan'),
      intro: B(
        'The official documentation describes what each one is for. These are the cases you will meet in event driven systems and enterprise integration.',
        'La documentación oficial describe para qué sirve cada uno. Estos son los casos que vas a encontrar en sistemas orientados a eventos e integración empresarial.',
      ),
      items: [
        {
          title: B('One artifact with its dependencies', 'Un artefacto con sus dependencias'),
          text: B(
            'The runtime, the application and the files it expects, built once into an image that runs the same on a laptop and on a server.',
            'El runtime, la aplicación y los archivos que espera, construidos una vez en una imagen que corre igual en una laptop y en un servidor.',
          ),
        },
        {
          title: B('The same environment for the whole team', 'El mismo entorno para todo el equipo'),
          text: B(
            'A Compose file with the application, its database and its broker; everyone starts the same versions with one command, and so does the test suite.',
            'Un archivo Compose con la aplicación, su base y su broker; todos levantan las mismas versiones con un comando, y la batería de pruebas también.',
          ),
        },
        {
          title: B('Continuous integration', 'Integración continua'),
          text: B(
            'The image built from a commit is the one that passes the tests, goes to staging and reaches production; what changes between stages is configuration, not the artifact.',
            'La imagen construida desde un commit es la que pasa las pruebas, va a staging y llega a producción; entre etapas cambia la configuración, no el artefacto.',
          ),
        },
        {
          title: B('Many services that must stay up', 'Muchos servicios que tienen que seguir en pie'),
          text: B(
            'Kubernetes places each instance, restarts or replaces the ones that fail, and rolls out a new version without taking the service down.',
            'Kubernetes ubica cada instancia, reinicia o reemplaza las que fallan y hace el rollout de una versión nueva sin bajar el servicio.',
          ),
        },
        {
          title: B('Scaling across nodes', 'Escalar en varios nodos'),
          text: B(
            'More replicas of a consumer when the lag grows, spread over several machines, with requests and limits that say how much each one may take.',
            'Más réplicas de un consumidor cuando crece el atraso, repartidas en varias máquinas, con requests y limits que dicen cuánto puede tomar cada una.',
          ),
        },
        {
          title: B('One way to operate across teams', 'Una forma común de operar entre equipos'),
          text: B(
            'The same declarations, the same hooks for logs and metrics and the same permission model (RBAC) for every service, whoever wrote it.',
            'Las mismas declaraciones, los mismos puntos de enganche para logs y métricas y el mismo modelo de permisos (RBAC) para cada servicio, lo haya escrito quien lo haya escrito.',
          ),
        },
      ],
    },
    misfits: {
      title: B('Where they do not fit', 'Dónde no encajan'),
      intro: B(
        'This part is the course\'s judgment, not official documentation. Each row says what to use instead.',
        'Esta parte es criterio del curso, no documentación oficial. Cada fila dice qué usar en su lugar.',
      ),
      headers: [B('The case', 'El caso'), B('Why not', 'Por qué no'), B('Use instead', 'Usá en su lugar')],
      items: [
        {
          title: B('One application on one machine', 'Una aplicación sola en una máquina'),
          why: B(
            'A control plane, a node agent and a network layer to run one process is cost without return; most of what Kubernetes gives you solves problems you do not have yet.',
            'Un plano de control, un agente de nodo y una capa de red para correr un proceso es costo sin retorno; casi todo lo que Kubernetes te da resuelve problemas que todavía no tenés.',
          ),
          instead: B(
            'Docker or Compose on that machine, or a service managed by the operating system.',
            'Docker o Compose en esa máquina, o un servicio administrado por el sistema operativo.',
          ),
        },
        {
          title: B('A team with nobody to operate it', 'Un equipo sin quien lo opere'),
          why: B(
            'The official documentation says Kubernetes is not a traditional, all-inclusive PaaS: upgrades, networking, storage, certificates and monitoring are your choices and your work.',
            'La documentación oficial dice que Kubernetes no es un PaaS tradicional y completo: actualizaciones, red, almacenamiento, certificados y monitoreo son decisiones y trabajo tuyos.',
          ),
          instead: B(
            'A managed Kubernetes service from your provider, or a platform as a service that takes the image and runs it.',
            'Un Kubernetes administrado por tu proveedor, o una plataforma como servicio que toma la imagen y la ejecuta.',
          ),
        },
        {
          title: B('Desktop and GUI applications', 'Aplicaciones de escritorio o con interfaz gráfica'),
          why: B(
            'Containers are made for processes that serve over the network; a window, a graphics session or a sound card need the host in ways the model does not cover well.',
            'Los contenedores están hechos para procesos que atienden por la red; una ventana, una sesión gráfica o una placa de sonido necesitan el host de formas que el modelo no cubre bien.',
          ),
          instead: B(
            'A native installer or a package for the operating system.',
            'Un instalador nativo o un paquete del sistema operativo.',
          ),
        },
        {
          title: B('Workloads tied to a kernel, hard real time or specific hardware', 'Cargas atadas a un kernel, a tiempo real duro o a hardware específico'),
          why: B(
            'A container shares the host kernel: it cannot bring its own, cannot guarantee a latency the kernel does not guarantee, and reaches devices only through what the host passes in.',
            'Un contenedor comparte el kernel del host: no puede traer el suyo, no garantiza una latencia que el kernel no garantiza y llega a los dispositivos solo por lo que el host le pasa.',
          ),
          instead: B(
            'A virtual machine or a dedicated machine with the kernel and drivers the workload needs.',
            'Una máquina virtual o una máquina dedicada con el kernel y los drivers que la carga necesita.',
          ),
        },
        {
          title: B('Databases and stateful systems without the experience', 'Bases de datos y sistemas con estado sin la experiencia'),
          why: B(
            'Kubernetes replaces instances freely; a database needs ordered failover, backups, storage with known performance and someone who has done it before, usually through an operator.',
            'Kubernetes reemplaza instancias con libertad; una base necesita failover ordenado, respaldos, almacenamiento de rendimiento conocido y alguien que ya lo haya hecho, normalmente a través de un operator.',
          ),
          instead: B(
            'A managed database, with the application in the cluster pointing at it.',
            'Una base administrada, con la aplicación en el clúster apuntándole.',
          ),
        },
        {
          title: B('Small, sporadic jobs', 'Trabajos chicos y esporádicos'),
          why: B(
            'A report at night or a cleanup once a week does not justify a cluster that runs all day waiting for it.',
            'Un reporte de noche o una limpieza semanal no justifican un clúster que corre todo el día esperándolos.',
          ),
          instead: B(
            'A function in your provider, or a cron entry on a machine you already have; a CronJob later, if the cluster already exists.',
            'Una función de tu proveedor, o una entrada de cron en una máquina que ya tenés; un CronJob después, si el clúster ya existe.',
          ),
        },
      ],
    },
    decide: {
      title: B('How to decide', 'Cómo decidir'),
      questions: [
        B('Will more than a handful of services and instances run?', '¿Van a correr más que un puñado de servicios e instancias?'),
        B('Will they need more than one host?', '¿Van a necesitar más de un host?'),
        B('Is there someone to operate the platform, with the time it takes?', '¿Hay alguien que opere la plataforma, con el tiempo que lleva?'),
        B('Do you need automatic replacement of failed instances and updates without downtime?', '¿Necesitás reemplazo automático de instancias caídas y actualizaciones sin corte?'),
        B('Is there a managed Kubernetes offering you can start from, instead of building the cluster yourself?', '¿Hay una oferta de Kubernetes administrado desde la que empezar, en vez de armar el clúster vos?'),
      ],
      closing: B(
        'Three yes answers and Kubernetes is worth learning for real; Docker you will need either way. Lesson 00 shows how the course works and leaves Docker ready.',
        'Tres síes y Kubernetes vale la pena aprenderlo en serio; Docker lo vas a necesitar igual. La lección 00 muestra cómo funciona el curso y deja Docker listo.',
      ),
      start: B('Start with lesson 00', 'Empezá por la lección 00'),
      back: B('Back to the course', 'Volver al inicio'),
    },
    sources: {
      title: B('Sources', 'Fuentes'),
      intro: B('Official pages, checked on', 'Páginas oficiales, contrastadas el'),
      items: [
        ['Docker Docs · What is Docker?', 'https://docs.docker.com/get-started/docker-overview/'],
        ['Docker Docs · Docker Engine security: namespaces and control groups', 'https://docs.docker.com/engine/security/'],
        ['Docker Blog · Docker: Nine Years YOUNG (March 2022)', 'https://www.docker.com/blog/docker-nine-years-young/'],
        ['Open Container Initiative · About the OCI', 'https://opencontainers.org/about/overview/'],
        ['Docker Blog · Announcing the Compose Specification (April 2020)', 'https://www.docker.com/blog/announcing-the-compose-specification/'],
        ['Kubernetes · Overview, with "What Kubernetes is not"', 'https://kubernetes.io/docs/concepts/overview/'],
        ['Kubernetes Blog · Borg: the predecessor to Kubernetes (April 2015)', 'https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/'],
        ['Google Cloud Blog · Kubernetes v1 released and the CNCF formed (July 2015)', 'https://cloudplatform.googleblog.com/2015/07/Kubernetes-V1-Released.html'],
        ['Kubernetes Blog · Updated: dockershim removal FAQ (February 2022)', 'https://kubernetes.io/blog/2022/02/17/dockershim-faq/'],
        ['kind · Releases (v0.33.0, Kubernetes 1.37.0)', 'https://github.com/kubernetes-sigs/kind/releases'],
      ],
    },
  };
})();
