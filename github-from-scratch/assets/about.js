/* The "What Git and GitHub are" page: what they are, where they came from, where they fit and where
   they do not. Read once, before lesson 00. Bilingual like the curriculum; scripts/build.mjs puts it
   in what-git-and-github-are.html and in the course notes, scripts/check.mjs verifies it. Product
   facts come from the sources listed at the end; the "where they do not fit" part is the course's
   own judgment and says so. */
window.GITHUB_ABOUT = (() => {
  const B = (en, es) => ({ en, es });
  return {
    eyebrow: B('A FIVE MINUTE READ', 'CINCO MINUTOS DE LECTURA'),
    title: B('What Git and GitHub are', 'Qué son Git y GitHub'),
    lead: B(
      'What they are, where they came from, where they fit and where they do not. Read it once; the lessons do the rest.',
      'Qué son, de dónde salieron, dónde encajan y dónde no. Se lee una vez; el resto lo hacen las lecciones.',
    ),
    what: {
      title: B('Snapshots you keep, changes you agree on', 'Instantáneas que guardás, cambios que acordás'),
      text: [
        B(
          'Git is a distributed version control system. Each commit is a complete snapshot of the project, identified by the hash of its content and linked to the commit or commits it came from; a branch is a movable pointer to one of them. Every copy of the repository holds the whole history, so recording, comparing and branching happen on your machine, without a network.',
          'Git es un sistema de control de versiones distribuido. Cada commit es una instantánea completa del proyecto, identificada por el hash de su contenido y enlazada al commit o commits de los que viene; una rama es un puntero móvil a uno de ellos. Cada copia del repositorio tiene toda la historia, así que registrar, comparar y ramificar pasan en tu máquina, sin red.',
        ),
        B(
          'GitHub is a service that hosts Git repositories and adds what a team needs to agree on changes: issues, pull requests and reviews, rules on branches, Actions to automate, releases. It does not replace Git; it hosts it. A commit you record locally does not exist on GitHub until you publish it, and nothing on GitHub reaches your copy until you fetch it.',
          'GitHub es un servicio que aloja repositorios Git y agrega lo que un equipo necesita para ponerse de acuerdo sobre los cambios: issues, pull requests y revisiones, reglas sobre las ramas, Actions para automatizar, releases. No reemplaza a Git; lo aloja. Un commit que registrás en tu máquina no existe en GitHub hasta que lo publicás, y nada de GitHub llega a tu copia hasta que hacés fetch.',
        ),
      ],
      rule: B('Git records history; GitHub is where people agree on it.', 'Git registra la historia; GitHub es donde la gente se pone de acuerdo.'),
      modelNote: B(
        'The model from lesson 01. Move through edit, record and publish: only the last step reaches GitHub, and Bruno still has to obtain it.',
        'El modelo de la lección 01. Recorré editar, registrar y publicar: solo el último paso llega a GitHub, y Bruno todavía tiene que obtenerlo.',
      ),
    },
    origin: {
      title: B('Where they came from', 'De dónde salieron'),
      text: [
        B(
          'Git was written by Linus Torvalds in April 2005 for the development of the Linux kernel, after the project lost the use of BitKeeper, the proprietary tool it had relied on since 2002. The goals were set from the start: speed, a simple design, strong support for non-linear development with thousands of parallel branches, fully distributed, and able to handle a project the size of the kernel. Within months Torvalds handed maintenance to Junio Hamano, who has led the project since.',
          'Git lo escribió Linus Torvalds en abril de 2005 para el desarrollo del kernel de Linux, después de que el proyecto perdió el uso de BitKeeper, la herramienta propietaria con la que trabajaba desde 2002. Los objetivos estaban fijados desde el principio: velocidad, diseño simple, soporte fuerte para desarrollo no lineal con miles de ramas en paralelo, totalmente distribuido y capaz de manejar un proyecto del tamaño del kernel. A los pocos meses Torvalds pasó el mantenimiento a Junio Hamano, que lleva el proyecto desde entonces.',
        ),
        B(
          'GitHub was built by Tom Preston-Werner, Chris Wanstrath and PJ Hyett and launched in April 2008: hosting for Git repositories, with the collaboration around them on the web. Microsoft completed its acquisition in October 2018, with the commitment that GitHub would operate independently. It grew into the place where a large part of open source is published, and the tools around a change, issues, pull requests, Actions and releases, grew with it. The timeline keeps the changes that still shape how it is used.',
          'GitHub lo construyeron Tom Preston-Werner, Chris Wanstrath y PJ Hyett y se lanzó en abril de 2008: alojamiento de repositorios Git, con la colaboración alrededor en la web. Microsoft completó la compra en octubre de 2018, con el compromiso de que GitHub operaría de forma independiente. Creció hasta ser el lugar donde se publica buena parte del open source, y las herramientas alrededor de un cambio, issues, pull requests, Actions y releases, crecieron con él. La línea de tiempo conserva los cambios que todavía marcan cómo se usa.',
        ),
      ],
      timeline: [
        {
          year: '2005',
          label: B('Git', 'Git'),
          text: B(
            'Linus Torvalds records the first commit on 7 April; version 1.0 follows in December.',
            'Linus Torvalds registra el primer commit el 7 de abril; la versión 1.0 llega en diciembre.',
          ),
        },
        {
          year: '2008',
          label: B('GitHub', 'GitHub'),
          text: B(
            'Public launch in April: hosting for Git repositories with collaboration on the web.',
            'Lanzamiento público en abril: alojamiento de repositorios Git con colaboración en la web.',
          ),
        },
        {
          year: '2018',
          label: B('Microsoft', 'Microsoft'),
          text: B(
            'Microsoft completes the acquisition of GitHub in October, committing that it will operate independently and remain an open platform.',
            'Microsoft completa la compra de GitHub en octubre, con el compromiso de que opere de forma independiente y siga siendo una plataforma abierta.',
          ),
        },
        {
          year: '2019',
          label: B('Actions', 'Actions'),
          text: B(
            'GitHub Actions is generally available in November: workflows that run on events in the repository.',
            'GitHub Actions queda disponible en general en noviembre: workflows que corren con eventos del repositorio.',
          ),
        },
        {
          year: '2020',
          label: B('main', 'main'),
          text: B(
            'Git 2.28 adds init.defaultBranch in July; in October, main becomes the default name of the first branch in new GitHub repositories.',
            'Git 2.28 agrega init.defaultBranch en julio; en octubre, main pasa a ser el nombre por defecto de la primera rama en los repositorios nuevos de GitHub.',
          ),
        },
        {
          year: '2023',
          label: B('Rulesets', 'Rulesets'),
          text: B(
            'Repository rules (rulesets) are generally available in July: protections for branches and tags, visible to everyone who collaborates.',
            'Las reglas de repositorio (rulesets) quedan disponibles en general en julio: protecciones para ramas y tags, visibles para quien colabora.',
          ),
        },
      ],
    },
    fits: {
      title: B('Where they fit', 'Dónde encajan'),
      intro: B(
        'The official documentation of both describes what they are for. These are the cases you will meet in everyday development.',
        'La documentación oficial de los dos describe para qué sirven. Estos son los casos que vas a encontrar en el desarrollo de todos los días.',
      ),
      items: [
        {
          title: B('Source code and any text that changes bit by bit', 'Código fuente y cualquier texto que cambia de a poco'),
          text: B(
            'Configuration, documentation, infrastructure as code: anything written in lines, where a diff tells you what changed.',
            'Configuración, documentación, infraestructura como código: todo lo que se escribe en líneas, donde un diff te dice qué cambió.',
          ),
        },
        {
          title: B('Parallel work without stepping on each other', 'Trabajo en paralelo sin pisarse'),
          text: B(
            'Each line of work on its own branch; merge or rebase joins them when they are ready, and conflicts are shown instead of lost.',
            'Cada línea de trabajo en su propia rama; merge o rebase las juntan cuando están listas, y los conflictos se muestran en lugar de perderse.',
          ),
        },
        {
          title: B('Agreeing on a change before integrating it', 'Acordar un cambio antes de integrarlo'),
          text: B(
            'A pull request puts the proposal, the discussion, the review and the automatic checks in one place, before the change reaches the main branch.',
            'Un pull request junta la propuesta, la conversación, la revisión y los controles automáticos en un solo lugar, antes de que el cambio llegue a la rama principal.',
          ),
        },
        {
          title: B('A history you can audit and recover from', 'Una historia auditable y recuperable'),
          text: B(
            'Who changed what and when; revert undoes a change with a new commit; bisect finds the commit that broke something.',
            'Quién cambió qué y cuándo; revert deshace un cambio con un commit nuevo; bisect encuentra el commit que rompió algo.',
          ),
        },
        {
          title: B('Automation that runs with every change', 'Automatización que corre con cada cambio'),
          text: B(
            'Actions runs workflows on a push, on a pull request or on a schedule: build, tests, checks, deployment.',
            'Actions corre workflows con cada push, con un pull request o por calendario: build, tests, controles, despliegue.',
          ),
        },
        {
          title: B('Deliveries you can name', 'Entregas identificables'),
          text: B(
            'A tag fixes a point in history; a release adds notes and files to it, so everyone knows which version was delivered.',
            'Un tag fija un punto de la historia; una release le agrega notas y archivos, así todos saben qué versión se entregó.',
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
          title: B('Large binary files that keep changing', 'Archivos binarios grandes que cambian'),
          why: B(
            'Videos, datasets and compiled artifacts have no useful diff, and every version stays in every clone. GitHub blocks files over 100 MiB and recommends keeping repositories small, ideally under 1 GB.',
            'Videos, datasets y artefactos compilados no tienen un diff útil, y cada versión queda en cada clon. GitHub bloquea archivos de más de 100 MiB y recomienda repositorios chicos, idealmente de menos de 1 GB.',
          ),
          instead: B(
            'Git LFS for the files that must travel with the code; an artifact store or object storage for the rest.',
            'Git LFS para los archivos que tienen que viajar con el código; un almacén de artefactos u object storage para el resto.',
          ),
        },
        {
          title: B('Secrets and credentials', 'Secretos y credenciales'),
          why: B(
            'Once committed they are in the history of every clone and fork, and rewriting history does not reach other people\'s copies. The first step is always to revoke the secret.',
            'Una vez en un commit quedan en la historia de cada clon y cada fork, y reescribir la historia no llega a las copias de los demás. El primer paso siempre es revocar el secreto.',
          ),
          instead: B(
            'A secrets manager, values injected at deploy time, and rotation.',
            'Un gestor de secretos, valores inyectados al desplegar y rotación.',
          ),
        },
        {
          title: B('Generated artifacts', 'Artefactos generados'),
          why: B(
            'Build output is rebuilt from the code; versioning it doubles the history and produces a conflict on every build.',
            'Lo que produce el build se reconstruye desde el código; versionarlo duplica la historia y genera un conflicto en cada build.',
          ),
          instead: B(
            'An artifact registry (Maven, npm, container images) or the files attached to a release.',
            'Un registro de artefactos (Maven, npm, imágenes de contenedores) o los archivos adjuntos a una release.',
          ),
        },
        {
          title: B('Business data and databases', 'Datos de negocio y bases de datos'),
          why: B(
            'Git versions files, not rows: no queries, no concurrent writers, no transactions.',
            'Git versiona archivos, no filas: sin consultas, sin escritores concurrentes, sin transacciones.',
          ),
          instead: B(
            'The database, plus versioned migrations in the repository so the schema has a history.',
            'La base de datos, más migraciones versionadas en el repositorio para que el esquema tenga historia.',
          ),
        },
        {
          title: B('Editing a document together in real time', 'Edición simultánea de un documento en tiempo real'),
          why: B(
            'Git integrates finished changes; it does not merge keystrokes. Two people in the same paragraph at the same time end in conflicts.',
            'Git integra cambios terminados; no mezcla pulsaciones. Dos personas en el mismo párrafo al mismo tiempo terminan en conflictos.',
          ),
          instead: B(
            'A collaborative editor for the writing; Git for the result, once it is text worth keeping.',
            'Un editor colaborativo para escribir; Git para el resultado, cuando ya es un texto que vale la pena guardar.',
          ),
        },
        {
          title: B('As the deployment or backup tool itself', 'Como herramienta de despliegue o respaldo en sí misma'),
          why: B(
            'A repository says which version exists, not that it is running or safe: no environments, no rollback of state, no retention policy.',
            'Un repositorio dice qué versión existe, no que esté corriendo ni a salvo: sin entornos, sin rollback de estado, sin política de retención.',
          ),
          instead: B(
            'Git as the source for both: a pipeline that deploys from a tag, and backups of the repository and of the data it does not hold.',
            'Git como fuente de los dos: un pipeline que despliega desde un tag, y respaldos del repositorio y de los datos que no contiene.',
          ),
        },
      ],
    },
    decide: {
      title: B('How to decide', 'Cómo decidir'),
      questions: [
        B('Does it change bit by bit, and is it text?', '¿Cambia de a poco y es texto?'),
        B('Does more than one person work on it at the same time?', '¿Trabaja más de una persona a la vez?'),
        B('Does someone need to agree before a change is integrated?', '¿Hace falta que alguien acuerde antes de integrar un cambio?'),
        B('Do you need to go back, and to know who changed what?', '¿Hay que poder volver atrás y saber quién cambió qué?'),
        B('Does something have to run with every change: tests, checks, a deployment?', '¿Hay que correr algo con cada cambio: tests, controles, un despliegue?'),
      ],
      closing: B(
        'Three yes answers and you are in the right place. Lesson 00 shows how the course works and what your machine needs.',
        'Tres síes y estás en el lugar correcto. La lección 00 muestra cómo funciona el curso y qué necesita tu máquina.',
      ),
      start: B('Start with lesson 00', 'Empezá por la lección 00'),
      back: B('Back to the course', 'Volver al inicio'),
    },
    sources: {
      title: B('Sources', 'Fuentes'),
      intro: B('Official pages, checked on', 'Páginas oficiales, contrastadas el'),
      items: [
        ['Pro Git · A Short History of Git', 'https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git'],
        ['Pro Git · What is Git?', 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F'],
        ['Git · tag v1.0.0 (December 2005)', 'https://github.com/git/git/releases/tag/v1.0.0'],
        ['GitHub Docs · What is GitHub?', 'https://docs.github.com/en/get-started/start-your-journey/what-is-github'],
        ['GitHub Blog · Git turns 20, a Q&A with Linus Torvalds (April 2025)', 'https://github.blog/open-source/git/git-turns-20-a-qa-with-linus-torvalds/'],
        ['GitHub Blog · Three Million Users (January 2013)', 'https://github.blog/news-insights/the-library/three-million-users/'],
        ['Microsoft Blog · Microsoft completes GitHub acquisition (October 2018)', 'https://blogs.microsoft.com/blog/2018/10/26/microsoft-completes-github-acquisition/'],
        ['GitHub Changelog · GitHub Actions is generally available (November 2019)', 'https://github.blog/changelog/2019-11-11-github-actions-is-generally-available/'],
        ['GitHub Changelog · The default branch for newly-created repositories is now main (October 2020)', 'https://github.blog/changelog/2020-10-01-the-default-branch-for-newly-created-repositories-is-now-main/'],
        ['GitHub Changelog · Repository rules are generally available (July 2023)', 'https://github.blog/changelog/2023-07-24-repository-rules-are-generally-available/'],
        ['GitHub Docs · About large files on GitHub', 'https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github'],
        ['GitHub Docs · Removing sensitive data from a repository', 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository'],
      ],
    },
  };
})();
