/* The Prumathe home page: one bilingual document rendered from the data below. The course links
   are relative to data-courses-base on <body>: "../" when this folder sits beside the courses in
   the repository, "" when scripts/build.mjs assembles the published site with the courses inside. */
(() => {
  const B = (en, es) => ({ en, es });
  const base = document.body.dataset.coursesBase ?? '../';
  const repo = 'https://github.com/andresdiegolanda/prumathe';

  const site = {
    eyebrow: B('Courses for learning complex technologies', 'Cursos para aprender tecnologías complejas'),
    title: B(
      ['See the mechanism.', 'Test it by hand.', 'Name the limit.'],
      ['Se ve el mecanismo.', 'Se prueba con las manos.', 'Se nombra el límite.'],
    ),
    lead: B(
      'Prumathe makes the technologies that run everyday systems learnable for developers and architects: the ones official documentation explains to people who already understand them. Between that documentation and the person who has to build something with it there is a distance that usually gets covered the hard way, in production. These courses cover it first.',
      'Prumathe vuelve aprendibles las tecnologías que sostienen los sistemas de todos los días, las que la documentación oficial explica para quien ya las entiende. Entre esa documentación y la persona que tiene que construir algo con ellas hay una distancia que suele cubrirse a golpes, en producción. Estos cursos la cubren antes.',
    ),
    facts: [
      B('Open in a browser, no account', 'Se abre en un navegador, sin cuenta'),
      B('English and Rioplatense Spanish', 'Inglés y español rioplatense'),
      B('Labs on your own machine', 'Laboratorios en tu propia máquina'),
      B('MIT license', 'Licencia MIT'),
    ],
    coursesTitle: B('The courses', 'Los cursos'),
    coursesIntro: B(
      'Each course is a folder: open it, follow the lessons in order, run the labs. The first lesson of each one explains what the course proves and what your machine needs.',
      'Cada curso es una carpeta: abrila, seguí las lecciones en orden, ejecutá los laboratorios. La lección 00 de cada uno explica qué prueba el curso y qué necesita tu máquina.',
    ),
    courses: [
      {
        slug: 'kafka-from-scratch',
        tech: 'Apache Kafka',
        title: B('Kafka from scratch', 'Kafka desde cero'),
        text: B(
          'The log, partitions, replication, consumer groups, exactly once and its boundary, Connect, Streams, security and share groups, on a three-node KRaft cluster that runs in Docker on your computer.',
          'El log, las particiones, la replicación, los grupos de consumidores, exactly once y su frontera, Connect, Streams, seguridad y share groups, sobre un clúster KRaft de tres nodos que corre en Docker en tu computadora.',
        ),
        stats: [B('30 lessons', '30 lecciones'), B('134 lab steps', '134 pasos de lab'), B('Java and Spring Boot', 'Java y Spring Boot')],
        needs: B('Docker Desktop or Docker Engine with Compose v2.', 'Docker Desktop o Docker Engine con Compose v2.'),
        links: [
          ['index.html', B('Open the course', 'Abrir el curso'), true],
          ['what-kafka-is.html', B('What it is', 'Qué es'), false],
        ],
      },
      {
        slug: 'docker-kubernetes-from-scratch',
        tech: 'Docker + Kubernetes',
        title: B('Docker & Kubernetes from scratch', 'Docker y Kubernetes desde cero'),
        text: B(
          'One small HTTP application followed from a process to a Kubernetes deployment: images, volumes, networks, Compose, Pods, Deployments, Services, storage, probes, resources, rollouts and RBAC, on a kind cluster.',
          'Una aplicación HTTP pequeña seguida desde su proceso hasta un despliegue en Kubernetes: imágenes, volúmenes, redes, Compose, Pods, Deployments, Services, almacenamiento, sondas, recursos, rollouts y RBAC, sobre un clúster kind.',
        ),
        stats: [B('25 lessons', '25 lecciones'), B('100 lab steps', '100 pasos de lab'), B('Compose and kind', 'Compose y kind')],
        needs: B('Docker with Linux containers; kind and kubectl for the second half.', 'Docker con contenedores Linux; kind y kubectl para la segunda mitad.'),
        links: [
          ['index.html', B('Open the course', 'Abrir el curso'), true],
          ['what-docker-and-kubernetes-are.html', B('What they are', 'Qué son'), false],
        ],
      },
      {
        slug: 'github-from-scratch',
        tech: 'Git + GitHub',
        title: B('GitHub from scratch', 'GitHub desde cero'),
        text: B(
          'What changes, where and for whom: snapshots, the index, branches, merge and conflicts, remotes, forks, pull requests, reviews, integration strategies, Actions, rules, releases and exposed secrets, with real Git experiments and activities on GitHub.',
          'Qué cambia, dónde y para quién: instantáneas, el index, ramas, merge y conflictos, remotos, forks, pull requests, revisiones, estrategias de integración, Actions, reglas, releases y secretos expuestos, con experimentos reales de Git y actividades en GitHub.',
        ),
        stats: [B('20 lessons', '20 lecciones'), B('14 Git experiments', '14 experimentos Git'), B('6 GitHub activities', '6 actividades en GitHub')],
        needs: B('Git and Node.js; a GitHub account for the service activities, with an account-free alternative.', 'Git y Node.js; una cuenta de GitHub para las actividades del servicio, con alternativa sin cuenta.'),
        links: [
          ['index.html', B('Open the course', 'Abrir el curso'), true],
          ['what-git-and-github-are.html', B('What they are', 'Qué son'), false],
        ],
      },
    ],
    startLesson: B('Start with lesson 00', 'Empezar por la lección 00'),
    methodTitle: B('Always the same way', 'Siempre de la misma manera'),
    methodIntro: B(
      'A Prumathe course takes a base technology and makes it learnable for developers and architects who work on event-driven systems, Java and Spring, and enterprise integration.',
      'Un curso de Prumathe toma una tecnología de base y la vuelve aprendible para desarrolladores y arquitectos que trabajan en sistemas orientados a eventos, Java y Spring e integración empresarial.',
    ),
    method: [
      {
        title: B('The mechanism is visible', 'Se ve el mecanismo'),
        text: B(
          'Every idea has a visual model you can manipulate: move a pointer, take a broker down, change a key. Intuition first, then the name.',
          'Cada idea tiene un modelo visual que se puede manipular: mover un puntero, hacer caer un broker, cambiar una clave. Primero la intuición, después el nombre.',
        ),
      },
      {
        title: B('You test it by hand', 'Se prueba con las manos'),
        text: B(
          'Every lesson has a real activity on your own machine, with the expected result written before you run it. Local experiments assert real states; a diagram explains a mechanism, it does not prove it ran.',
          'Cada lección tiene una actividad real en tu propia máquina, con el resultado esperado escrito antes de ejecutar. Los experimentos locales verifican estados reales; un diagrama explica un mecanismo, no prueba que se ejecutó.',
        ),
      },
      {
        title: B('The guarantee and its limit are named', 'Se nombra la garantía y su límite'),
        text: B(
          'Every claim says inside which boundary it holds, because what breaks in production is not what the technology does but what it was assumed to do.',
          'Cada afirmación dice dentro de qué frontera vale, porque lo que da problemas en producción no es lo que la tecnología hace, sino lo que se supuso que hacía.',
        ),
      },
      {
        title: B('Two languages, the same content', 'En dos idiomas, el mismo contenido'),
        text: B(
          'English and Rioplatense Spanish, with technical terms as they appear in the tools.',
          'Inglés y español rioplatense, con los términos técnicos tal como aparecen en las herramientas.',
        ),
      },
      {
        title: B('Verified and dated', 'Verificado y fechado'),
        text: B(
          'Every statement about a product is checked against its official documentation, versions are pinned, and what was not executed is said.',
          'Cada afirmación sobre un producto se contrasta con su documentación oficial, las versiones se fijan y lo que no se ejecutó se dice.',
        ),
      },
      {
        title: B('Open and portable', 'Abierto y portable'),
        text: B(
          'A course is a folder that opens in a browser, with no account, no server and nothing to install. Each kit declares its tools. MIT license.',
          'Un curso es una carpeta que se abre en un navegador, sin cuenta, sin servidor, sin instalar nada. Cada kit declara sus herramientas. Licencia MIT.',
        ),
      },
    ],
    lessonTitle: B('What a lesson looks like', 'Cómo es una lección'),
    lesson: [
      B('Three scenes explain one idea, each with a rule to take with you.', 'Tres escenas explican una idea, cada una con una regla para llevarse.'),
      B('An interactive model lets you change one variable and predict what happens.', 'Un modelo interactivo te deja cambiar una variable y predecir qué pasa.'),
      B('A lab runs the real thing on your machine, with the expected observation written first.', 'Un laboratorio ejecuta lo real en tu máquina, con la observación esperada escrita antes.'),
      B('A checkpoint with three questions and plausible wrong answers tests the distinction, not the syntax.', 'Un control de tres preguntas con distractores plausibles evalúa la distinción, no la sintaxis.'),
    ],
    lessonNote: B(
      'Progress stays in your browser. Classic, Dark, Reading and Projector appearances. Downloadable notes for reading without a browser.',
      'El avance queda en tu navegador. Apariencias Clásico, Oscuro, Lectura y Proyector. Apuntes descargables para leer sin navegador.',
    ),
    nameTitle: B('The name', 'El nombre'),
    nameText: B(
      'Prumathe is what the Etruscans called Prometheus, who brought people fire and, with fire, the crafts. Here the fire is the technologies that move everyday systems, and bringing it closer means that anyone willing can open them, touch them and understand them.',
      'Prumathe es como los etruscos llamaban a Prometeo, el que le acercó a la gente el fuego y, con el fuego, los oficios. Acá el fuego son las tecnologías que mueven los sistemas de todos los días, y acercarlo quiere decir que cualquiera con ganas pueda abrirlas, tocarlas y entenderlas.',
    ),
    footer: B('Built to understand. Designed to experiment.', 'Hecho para entender. Diseñado para experimentar.'),
    repoLabel: B('Source and courses on GitHub', 'Código y cursos en GitHub'),
    license: B('MIT license', 'Licencia MIT'),
    languageLabel: B('Language', 'Idioma'),
    themeLabel: B('Appearance', 'Apariencia'),
    themeNames: { light: B('Light', 'Claro'), dark: B('Dark', 'Oscuro') },
    skip: B('Skip to content', 'Ir al contenido'),
  };

  const mark =
    '<svg viewBox="99 21 142 298" aria-hidden="true"><path d="M131 313V133C176 133 217 159 217 199" fill="none" stroke="var(--green)" stroke-width="36" stroke-linecap="butt" stroke-linejoin="round"/><path d="M131 27C103 59 105 91 131 117C157 91 159 59 131 27Z" fill="var(--orange)"/></svg>';

  let lang = 'en';
  try {
    const asked = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem('prumathe-site-language');
    const browser = (navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
    lang = ['en', 'es'].includes(asked) ? asked : ['en', 'es'].includes(saved) ? saved : browser;
  } catch {}
  let theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

  const L = (v) => v[lang];
  const e = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const courseLink = (slug, page) => `${base}${slug}/${page}?lang=${lang}`;

  function render() {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = theme;
    document.title = lang === 'en' ? 'Prumathe. Courses for learning complex technologies' : 'Prumathe. Cursos para aprender tecnologías complejas';
    const other = theme === 'light' ? 'dark' : 'light';
    const header = `<header class="top"><a class="brand" href="index.html?lang=${lang}">${mark}<span><strong>Prumathe</strong><small>${e(L(site.eyebrow))}</small></span></a><div class="controls"><div class="switch" role="group" aria-label="${e(L(site.languageLabel))}"><button type="button" data-lang="en" class="${lang === 'en' ? 'on' : ''}" aria-pressed="${lang === 'en'}">EN</button><button type="button" data-lang="es" class="${lang === 'es' ? 'on' : ''}" aria-pressed="${lang === 'es'}">ES</button></div><button type="button" class="ghost" data-theme-toggle aria-label="${e(L(site.themeLabel))}: ${e(L(site.themeNames[other]))}">${e(L(site.themeNames[other]))}</button></div></header>`;
    const hero = `<section class="hero"><span class="eyebrow">${e(L(site.eyebrow))}</span><h1>${L(site.title)
      .map((line, i) => `<span class="${i === 2 ? 'accent' : ''}">${e(line)}</span>`)
      .join('')}</h1><p class="lead">${e(L(site.lead))}</p><ul class="facts">${site.facts.map((f) => `<li>${e(L(f))}</li>`).join('')}</ul></section>`;
    const courses = `<section class="courses" id="courses"><div class="section-head"><span class="eyebrow">${e(L(site.coursesTitle))}</span><p>${e(L(site.coursesIntro))}</p></div><div class="cards">${site.courses
      .map(
        (c) => `<article class="card"><span class="tech">${e(c.tech)}</span><h2>${e(L(c.title))}</h2><p>${e(L(c.text))}</p><ul class="stats">${c.stats.map((s) => `<li>${e(L(s))}</li>`).join('')}</ul><p class="needs">${e(L(c.needs))}</p><div class="actions">${c.links
          .map(([page, label, primary]) => `<a class="btn ${primary ? 'primary' : ''}" href="${courseLink(c.slug, page)}">${e(L(label))}${primary ? ' <span aria-hidden="true">→</span>' : ''}</a>`)
          .join('')}<a class="link" href="${courseLink(c.slug, 'lessons/before-you-start.html')}">${e(L(site.startLesson))}</a></div></article>`,
      )
      .join('')}</div></section>`;
    const method = `<section class="method"><div class="section-head"><span class="eyebrow">${e(L(site.methodTitle))}</span><p>${e(L(site.methodIntro))}</p></div><div class="grid">${site.method
      .map((m, i) => `<article><span class="num">0${i + 1}</span><h3>${e(L(m.title))}</h3><p>${e(L(m.text))}</p></article>`)
      .join('')}</div></section>`;
    const lesson = `<section class="lesson"><div class="section-head"><span class="eyebrow">${e(L(site.lessonTitle))}</span></div><ol class="steps">${site.lesson.map((s) => `<li>${e(L(s))}</li>`).join('')}</ol><p class="note">${e(L(site.lessonNote))}</p></section>`;
    const name = `<section class="name"><div class="section-head"><span class="eyebrow">${e(L(site.nameTitle))}</span></div><div class="name-body">${mark}<p>${e(L(site.nameText))}</p></div></section>`;
    const footer = `<footer class="bottom"><span>${e(L(site.footer))}</span><span><a href="${repo}" target="_blank" rel="noopener noreferrer">${e(L(site.repoLabel))} ↗</a> · ${e(L(site.license))}</span></footer>`;
    document.getElementById('app').innerHTML = `<a class="skip-link" href="#courses">${e(L(site.skip))}</a><div class="page">${header}<main id="main">${hero}${courses}${method}${lesson}${name}</main>${footer}</div>`;
    for (const b of document.querySelectorAll('[data-lang]')) {
      b.addEventListener('click', () => {
        lang = b.dataset.lang;
        try {
          localStorage.setItem('prumathe-site-language', lang);
        } catch {}
        history.replaceState(null, '', `?lang=${lang}${theme ? `&theme=${theme}` : ''}`);
        render();
      });
    }
    document.querySelector('[data-theme-toggle]').addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('prumathe-site-theme', theme);
      } catch {}
      history.replaceState(null, '', `?lang=${lang}&theme=${theme}`);
      render();
    });
  }
  render();
})();
