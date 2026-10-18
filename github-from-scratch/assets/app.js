(() => {
  'use strict';
  const course = window.GITHUB_COURSE,
    refs = window.GITHUB_REFERENCE,
    $ = (s) => document.querySelector(s);
  const id = document.body.dataset.lesson,
    about = document.body.dataset.page === 'about',
    home = id === undefined && !about,
    prefix = id === undefined ? '' : '../';
  let lang = 'es',
    progress = {},
    currentTab = 'learn',
    frame = 0,
    labStep = 0,
    answers = {},
    sim = {},
    surface = 'visual',
    inspected = null,
    glossaryIndex = 0,
    glossarySearch = '',
    mapUnit = id === undefined ? 0 : course.lessons[Number(id)].unit,
    lastFocus = null,
    homeUnit = 0;
  try {
    lang = localStorage.getItem('github-course-language') || 'es';
    progress = JSON.parse(localStorage.getItem('github-course-progress') || '{}');
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) progress = {};
  } catch {}
  if (!['en', 'es'].includes(lang)) lang = 'en';
  // The skin. assets/theme.js already put the chosen one on <html data-theme> before the
  // stylesheet was applied; here it only has to be read, shown in the picker and saved.
  const THEMES = ['light', 'dark', 'reading', 'projector'];
  let theme = document.documentElement.dataset.theme;
  if (!THEMES.includes(theme)) theme = 'light';
  const reading = () => theme === 'reading' && id !== undefined;
  const query = new URLSearchParams(location.search);
  if (['en', 'es'].includes(query.get('lang'))) lang = query.get('lang');
  if (id !== undefined) {
    if (['learn', 'lab', 'check', 'sources'].includes(query.get('view')))
      currentTab = query.get('view');
    frame = Math.max(0, Math.min(2, Number(query.get('step')) || 0));
    labStep = Math.max(0, Math.min(course.lessons[Number(id)].lab.length - 1, Number(query.get('labstep')) || 0));
  }
  if (currentTab === 'lab') surface = 'notes';
  const lesson = id === undefined ? null : course.lessons[Number(id)];
  const t = (a, b) => (lang === 'es' ? b : a),
    L = (x) => x?.[lang] || '',
    e = (s) =>
      String(s ?? '').replace(
        /[&<>"']/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
      );
  /* The Prumathe mark: an Etruscan-style open P drawn as one stroke, with a flame on the stem, in
     the palette of the active skin. */
  const icon = `<svg viewBox="99 21 142 298" aria-hidden="true"><path d="M131 313V133C176 133 217 159 217 199" fill="none" stroke="var(--green)" stroke-width="36" stroke-linecap="butt" stroke-linejoin="round"/><path d="M131 27C103 59 105 91 131 117C157 91 159 59 131 27Z" fill="var(--orange)"/></svg>`;
  const themeName = (x) =>
    ({
      light: t('Classic', 'Clásico'),
      dark: t('Dark', 'Oscuro'),
      reading: t('Reading', 'Lectura'),
      projector: t('Projector', 'Proyector'),
    })[x];
  const MONTHS = {
    en: 'January February March April May June July August September October November December'.split(
      ' ',
    ),
    es: 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(
      ' ',
    ),
  };
  function dateText() {
    const [y, m, d] = course.date.split('-').map(Number);
    return lang === 'es' ? `${d} de ${MONTHS.es[m - 1]} de ${y}` : `${d} ${MONTHS.en[m - 1]} ${y}`;
  }
  function link(l) {
    return `${prefix}lessons/${l.slug}.html?lang=${lang}&theme=${theme}`;
  }
  function homeLink() {
    return `${prefix}index.html?lang=${lang}&theme=${theme}`;
  }
  function aboutLink() {
    return `${prefix}what-git-and-github-are.html?lang=${lang}&theme=${theme}`;
  }
  function save() {
    try {
      localStorage.setItem('github-course-language', lang);
      localStorage.setItem('github-course-theme', theme);
      localStorage.setItem('github-course-progress', JSON.stringify(progress));
    } catch {}
  }
  function setTheme(value) {
    theme = THEMES.includes(value) ? value : 'light';
    document.documentElement.dataset.theme = theme;
    save();
    render();
    updateURL();
  }
  function score() {
    return course.lessons.filter((l) => progress[l.slug]?.quiz && progress[l.slug]?.lab).length;
  }
  function header() {
    return `<header><a class="brand" href="${homeLink()}" aria-label="${t('Course home', 'Inicio del curso')}">${icon}<span><strong>GitHub from scratch</strong><small>${t('A visual field guide', 'Una guía visual de campo')}</small></span></a><span class="header-meta">${course.lessons.length} ${t('LESSONS', 'LECCIONES')} / GIT + GITHUB</span><div class="header-actions"><button class="btn drawer-only" data-action="map">${t('Course', 'Curso')}</button><button class="btn extra" data-action="glossary">${t('Glossary', 'Glosario')} <span aria-hidden="true">↗</span></button><a class="btn extra" href="${prefix}downloads/github-labs.zip" download>${t('Download labs', 'Descargá los labs')} ↓</a><label class="theme-pick"><span class="sr-only">${t('Skin', 'Apariencia')}</span><select data-theme-pick aria-label="${t('Skin', 'Apariencia')}">${THEMES.map((x) => `<option value="${x}" ${x === theme ? 'selected' : ''}>${themeName(x)}</option>`).join('')}</select></label><div class="language" role="group" aria-label="${t('Language', 'Idioma')}"><button data-lang="en" aria-pressed="${lang === 'en'}" lang="en">EN</button><button data-lang="es" aria-pressed="${lang === 'es'}" lang="es-AR" title="Español rioplatense">ES</button></div><button class="btn extra" data-action="help" aria-label="${t('Help and keyboard shortcuts', 'Ayuda y atajos de teclado')}">?</button></div></header>`;
  }
  function footer() {
    return `<footer class="footer"><span>${t('Built to understand. Designed to experiment.', 'Hecho para entender. Diseñado para experimentar.')}</span><span class="center">${!lesson ? 'GITHUB / FROM SCRATCH' : String(Number(id)).padStart(2, '0') + ' / ' + course.lessons.length}</span><div class="footer-nav">${!home ? `<a href="${homeLink()}">${t('All lessons', 'Todas las lecciones')}</a>` : ''}<button class="btn" data-action="help">${t('Help', 'Ayuda')}</button>${lesson && lesson.id < course.lessons.length - 1 ? `<a href="${link(course.lessons[lesson.id + 1])}">${t('Next lesson', 'Siguiente')} →</a>` : ''}</div></footer>`;
  }
  function sidebar() {
    const unit = lesson.unit;
    return `<aside class="sidebar"><span class="eyebrow">${t('Your learning path', 'Tu recorrido')}</span><label class="sr-only" for="unit-select">${t('Select unit', 'Elegí una unidad')}</label><select id="unit-select" class="unit-select">${course.units.map((u, i) => `<option value="${i}" ${i === unit ? 'selected' : ''}>${String(i).padStart(2, '0')} / ${e(L(u))}</option>`).join('')}</select><h2>${e(L(course.units[unit]))}</h2><nav aria-label="${t('Lessons in this unit', 'Lecciones de esta unidad')}">${lessonLinks(unit)}</nav><div class="sidebar-bottom"><span>${score()} / ${course.lessons.length} ${t('completed', 'completadas')}</span><div class="progress-track"><span style="width:${(score() / course.lessons.length) * 100}%"></span></div>${t('Completion combines the checkpoint and your declaration of the activity. Keep the kind of evidence in your notebook.', 'Completar combina el control y tu declaración de la actividad. Anotá el tipo de evidencia en tu cuaderno.')}<button class="btn" data-action="map">${t('Explore all ' + course.units.length + ' units', 'Explorá las ' + course.units.length + ' unidades')} ↗</button></div></aside>`;
  }
  function lessonLinks(unit) {
    return course.lessons
      .filter((l) => l.unit === unit)
      .map(
        (l) =>
          `<a class="lesson-link ${lesson?.id === l.id ? 'current' : ''} ${progress[l.slug]?.quiz && progress[l.slug]?.lab ? 'completed' : ''}" ${lesson?.id === l.id ? 'aria-current="page"' : ''} href="${link(l)}"><span>${progress[l.slug]?.quiz && progress[l.slug]?.lab ? '✓' : String(l.id).padStart(2, '0')}</span><span>${e(L(l.title))}</span></a>`,
      )
      .join('');
  }
  function homeView() {
    const next =
      course.lessons.find((l) => !progress[l.slug]?.quiz || !progress[l.slug]?.lab) ||
      course.lessons[0];
    return `<main class="home" id="main"><section class="home-intro"><span class="eyebrow">${t('FROM AN EDIT TO A SHARED DECISION', 'DE UNA EDICIÓN A UNA DECISIÓN COMPARTIDA')}</span><h1>${t('Understand GitHub.<br>Follow every<br><em>decision.</em>', 'Entendé GitHub.<br>Seguí cada<br><em>decisión.</em>')}</h1><p class="home-lead">${t('Move a branch. Compare two histories. Review a proposal. Learn what changes and why; consult commands when you need them.', 'Mové una rama. Compará dos historias. Revisá una propuesta. Aprendé qué cambia y por qué; consultá los comandos cuando los necesites.')}</p><div class="home-actions"><a class="btn primary" href="${link(next)}">${score() ? t('Continue learning', 'Seguí aprendiendo') : t('Start from zero', 'Empezá desde cero')} <span aria-hidden="true">→</span></a><a class="btn" href="${aboutLink()}">${t('What Git and GitHub are', '¿Qué son Git y GitHub?')}</a><a class="btn" href="${prefix}downloads/github-labs.zip" download>${t('Get the lab kit', 'Descargá el kit')} ↓</a></div><div class="home-tag"><span>${course.lessons.length} ${t('VISUAL LESSONS', 'LECCIONES VISUALES')}</span><span>${t('14 GIT EXPERIMENTS', '14 EXPERIMENTOS GIT')}</span><span>EN / ES</span></div><div class="hero-art" aria-hidden="true">${hero()}</div></section><section class="home-curriculum" aria-label="${t('Course curriculum', 'Programa del curso')}"><div class="eyebrow"><span>${t('THE LEARNING PATH', 'EL RECORRIDO')}</span><span>00 ${t('to', 'a')} ${String(course.lessons.at(-1).id).padStart(2, '0')}</span></div>${course.units.map((u, i) => `<a class="unit-row ${i === homeUnit ? 'mobile-active' : ''}" href="${link(course.lessons.find((l) => l.unit === i))}"><span class="num">${String(i).padStart(2, '0')}</span><span><strong>${e(L(u))}</strong><small>${(() => { const group = course.lessons.filter((l) => l.unit === i); return group.length === 1 ? e(L(group[0].intro)) : e(L(group[0].title)) + ' → ' + e(L(group.at(-1).title)); })()}</small></span><span class="unit-arrow" aria-hidden="true">↗</span></a>`).join('')}<div class="home-mobile-pager"><button class="btn" data-home-prev aria-label="${t('Previous unit', 'Unidad anterior')}">←</button><span>${t('Unit', 'Unidad')} ${String(homeUnit).padStart(2, '0')} / ${String(course.units.length - 1).padStart(2, '0')}</span><button class="btn" data-home-next aria-label="${t('Next unit', 'Siguiente unidad')}">→</button></div><p class="home-footnote">${t('Models work offline. Local experiments need Git and Node.js.<br>Six GitHub activities include an alternative case study without an account.', 'Los modelos funcionan sin conexión. Los experimentos locales usan Git y Node.js.<br>Seis actividades de GitHub incluyen un caso alternativo sin cuenta.')}</p></section></main>`;
  }
  /* The "What Git and GitHub are" page: one scrolling document built from assets/about.js, with the model
     of one lesson as its only interactive piece. */
  let aboutModel = null;
  function aboutView() {
    const A = window.GITHUB_ABOUT;
    aboutModel = GitHubVisuals.render('git-and-github', 0, {}, lang, theme);
    const P = GitHubVisuals.palette(theme);
    const points = A.origin.timeline;
    const stepX = 640 / (points.length - 1);
    const timeline = `<svg viewBox="0 0 720 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('Timeline', 'Línea de tiempo')}"><path d="M40 52H680" stroke="${P.line}" stroke-width="2"/>${points
      .map(
        (p, i) =>
          `<circle cx="${40 + i * stepX}" cy="52" r="7" fill="${i === points.length - 1 ? P.orange : P.green}"/><text x="${40 + i * stepX}" y="28" text-anchor="middle" font-family="Consolas,monospace" font-size="14" fill="${P.ink}">${p.year}</text><text x="${40 + i * stepX}" y="86" text-anchor="middle" font-family="Segoe UI,system-ui,sans-serif" font-size="12" fill="${P.muted}">${e(L(p.label))}</text>`,
      )
      .join('')}</svg>`;
    const section = (title, body, cls = '') =>
      `<section class="about-section ${cls}"><h2>${e(L(title))}</h2>${body}</section>`;
    const paras = (list) => list.map((p) => `<p>${e(L(p))}</p>`).join('');
    const what = section(
      A.what.title,
      `${paras(A.what.text)}<div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(A.what.rule))}</div><div class="about-model"><div class="diagram" id="diagram">${aboutModel.svg}</div><p class="model-note">${e(L(A.what.modelNote))}</p></div>`,
    );
    const origin = section(
      A.origin.title,
      `${paras(A.origin.text)}<div class="about-timeline">${timeline}</div><ol class="about-milestones">${points.map((p) => `<li><strong>${p.year} · ${e(L(p.label))}</strong>${e(L(p.text))}</li>`).join('')}</ol>`,
    );
    const fits = section(
      A.fits.title,
      `<p>${e(L(A.fits.intro))}</p><div class="about-grid">${A.fits.items.map((x) => `<article><h3>${e(L(x.title))}</h3><p>${e(L(x.text))}</p></article>`).join('')}</div>`,
    );
    const misfits = section(
      A.misfits.title,
      `<p>${e(L(A.misfits.intro))}</p><div class="about-table" role="table">${A.misfits.headers.map((h) => `<div class="head" role="columnheader">${e(L(h))}</div>`).join('')}${A.misfits.items.map((x) => `<div class="case" role="cell">${e(L(x.title))}</div><div class="why" role="cell">${e(L(x.why))}</div><div class="instead" role="cell" data-label="${e(L(A.misfits.headers[2]))}">${e(L(x.instead))}</div>`).join('')}</div>`,
    );
    const decide = section(
      A.decide.title,
      `<ol class="about-questions">${A.decide.questions.map((q) => `<li>${e(L(q))}</li>`).join('')}</ol><p>${e(L(A.decide.closing))}</p><div class="home-actions"><a class="btn primary" href="${link(course.lessons[0])}">${e(L(A.decide.start))} <span aria-hidden="true">→</span></a><a class="btn" href="${homeLink()}">${e(L(A.decide.back))}</a></div>`,
    );
    const sources = section(
      A.sources.title,
      `<p>${e(L(A.sources.intro))} ${dateText()}.</p><ul>${A.sources.items.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${e(name)} ↗</a></li>`).join('')}</ul>`,
      'about-sources',
    );
    return `<main class="about" id="main"><div class="about-inner"><span class="eyebrow">${e(L(A.eyebrow))}</span><h1>${e(L(A.title))}</h1><p class="about-lead">${e(L(A.lead))}</p>${what}${origin}${fits}${misfits}${decide}${sources}</div></main>`;
  }
  function hero() {
    const P = GitHubVisuals.palette(theme);
    return `<svg viewBox="0 0 620 220" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${P.green}" stroke-width="2"><path d="M80 135H275Q320 135 340 80T440 65Q485 65 510 135H565"/><path d="M275 135H565"/></g>${[[80,135,'A'],[275,135,'B'],[440,65,'C'],[565,135,'M']].map(([x,y,n])=>`<circle cx="${x}" cy="${y}" r="19" fill="${P.white}" stroke="${P.green}" stroke-width="2"/><text x="${x}" y="${y+5}" fill="${P.ink}" text-anchor="middle" font-size="14">${n}</text>`).join('')}<text x="440" y="28" fill="${P.orange}" text-anchor="middle" font-size="13">${t('a proposed change','un cambio propuesto')}</text><text x="300" y="190" fill="${P.muted}" text-anchor="middle" font-size="13">${t('One history. Parallel decisions. A shared result.','Una historia. Decisiones paralelas. Un resultado compartido.')}</text></svg>`;
  }
  function mainView() {
    if (reading()) return documentView();
    return `<div class="workspace">${sidebar()}<main class="lesson-main" id="main" tabindex="-1"><div class="lesson-heading"><div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${lesson.unit} / ${e(L(course.units[lesson.unit]))}</span><h1>${e(L(lesson.title))}</h1><p>${e(L(lesson.intro))}</p></div><span class="lesson-number" aria-hidden="true">${String(lesson.id).padStart(2, '0')}</span></div><nav class="tabs" role="tablist" aria-label="${t('Lesson sections', 'Secciones de la lección')}">${[
      ['learn', t('Understand', 'Entendé'), '3'],
      ['lab', t('Activity', 'Actividad'), lesson.lab.length],
      ['check', t('Checkpoint', 'Control'), progress[lesson.slug]?.quiz ? '✓' : lesson.quiz.length],
      ['sources', t('Go deeper', 'Profundizá'), '↗'],
    ]
      .map(
        ([a, b, c]) =>
          `<button role="tab" id="tab-${a}" aria-controls="lesson-panel" aria-selected="${currentTab === a}" tabindex="${currentTab === a ? 0 : -1}" data-tab="${a}">${b}<span class="tab-count">${c}</span></button>`,
      )
      .join(
        '',
      )}</nav><div id="lesson-panel" class="${['learn', 'lab'].includes(currentTab) ? 'content-grid ' + (currentTab === 'lab' ? 'lab-grid' : '') : currentTab === 'check' ? 'quiz-wrap' : 'reference-wrap'}" role="tabpanel" aria-labelledby="tab-${currentTab}" data-surface="${surface}">${panelContent()}</div></main></div>`;
  }
  function panelContent() {
    if (currentTab === 'check') return quizView();
    if (currentTab === 'sources') return sourcesView();
    const data = window.GitHubVisuals.render(lesson.visual, frame, sim, lang, theme);
    return `<div class="mobile-surface"><button data-surface="visual" class="${surface === 'visual' ? 'active' : ''}">${t('Visual model', 'Modelo visual')}</button><button data-surface="notes" class="${surface === 'notes' ? 'active' : ''}">${currentTab === 'lab' ? t('Lab steps', 'Pasos del lab') : t('Explanation', 'Explicación')}</button></div><section class="scene-column" aria-label="${t('Interactive model', 'Modelo interactivo')}"><div class="scene-top"><span><i class="live-dot"></i>${t('ILLUSTRATIVE MODEL', 'MODELO ILUSTRATIVO')}</span><span>${t('Select an object to inspect', 'Seleccioná un objeto para inspeccionar')}</span></div><div class="diagram" id="diagram">${data.svg}</div><div class="diagram-tools">${controlsHTML(data.controls)}<button class="btn" data-action="expand" aria-label="${t('Expand the visual model', 'Ampliá el modelo visual')}" title="${t('Expand the visual model', 'Ampliá el modelo visual')}">⤢</button><button class="btn" data-action="reset-model" title="${t('Reset visual model', 'Reiniciá el modelo visual')}">↺</button></div><p class="model-note">${t('This model is illustrative. The activity distinguishes local Git, GitHub and case-study evidence.', 'Este es un modelo ilustrativo. La actividad identifica su evidencia: Git local, GitHub o caso de estudio.')}</p>${currentTab === 'lab' ? `<div class="lab-context">${labContext()} <a href="${prefix}downloads/github-labs.zip" download>${t('Download kit', 'Descargá el kit')} ↓</a></div>` : ''}</section><section class="inspector" aria-label="${currentTab === 'lab' ? t('Activity', 'Actividad') : t('Explanation', 'Explicación')}">${currentTab === 'lab' ? labView() : frameView()}</section>`;
  }
  function controlsHTML(controls) {
    return controls
      .map((c) =>
        c.kind === 'button'
          ? `<button class="btn" data-sim-action="${c.action}">${e(c.label)}</button>`
          : c.kind === 'range'
            ? `<label>${e(c.label)} <input type="range" data-sim="${c.key}" min="${c.min}" max="${c.max}" value="${c.value}" aria-label="${e(c.label)}"><output>${c.value}</output></label>`
            : c.kind === 'text'
              ? `<label>${e(c.label)} <input type="text" data-sim="${c.key}" value="${e(c.value)}" maxlength="40" spellcheck="false"></label>`
              : `<label>${e(c.label)} <select data-sim="${c.key}">${c.options.map((x) => `<option ${x === c.value ? 'selected' : ''}>${x}</option>`).join('')}</select></label>`,
      )
      .join('');
  }
  function frameView() {
    const f = lesson.frames[frame];
    return `<div class="frame-label"><span>${t('SCENE', 'ESCENA')} ${frame + 1} / 3</span><div class="steps">${lesson.frames.map((_, i) => `<button class="step-dot ${i === frame ? 'active' : ''}" data-frame="${i}" aria-label="${t('Scene', 'Escena')} ${i + 1}" aria-pressed="${i === frame}"></button>`).join('')}</div></div><h2>${e(L(f.title))}</h2><p>${e(L(f.text))}</p><div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(f.rule))}</div><div class="experiment-tip"><strong>${t('Try the model.', 'Probá el modelo.')}</strong> ${e(L(lesson.experiment))}</div><div class="scene-navigation"><button class="btn" data-action="prev" ${frame === 0 ? 'disabled' : ''}>← ${t('Back', 'Atrás')}</button><button class="btn primary" data-action="next">${frame === 2 ? t('Open Activity', 'Abrí la actividad') : t('Next scene', 'Siguiente escena')} →</button></div>`;
  }
  function labContext() {
    return lesson.mode === 'local'
      ? t('REAL GIT / LOCAL. Extract the kit and open a terminal in <strong>labs</strong>. Git 2.32+ and Node.js 22+ are required. Every run creates a new practice folder. Commands are available as a reference below.', 'GIT REAL / LOCAL. Descomprimí el kit y abrí una terminal en <strong>labs</strong>. Necesitás Git 2.32+ y Node.js 22+. Cada ejecución crea una carpeta de práctica nueva. Los comandos están disponibles abajo como referencia.')
      : t('GITHUB / ONLINE OR CASE STUDY. Use your own practice repository with invented content. Without an account, follow the labeled case study. Record which route you used; this browser does not verify online actions.', 'GITHUB / EN LÍNEA O CASO DE ESTUDIO. Usá tu repositorio de práctica con contenido inventado. Sin cuenta, seguí el caso identificado. Registrá qué recorrido usaste; este navegador no verifica acciones en línea.');
  }
  function commandBlock(step, index) {
    if (!step.command) return '';
    return `<details class="command-reference"><summary>${t('Command reference (no memorization needed)', 'Comando de apoyo (no hace falta memorizarlo)')}</summary><div class="lab-command"><div class="command-title"><span>TERMINAL / labs</span><button data-copy="${index}">${t('Copy','Copiar')} ⧉</button></div><pre><code>${e(step.command)}</code></pre></div></details>`;
  }
  function labView() {
    const s = lesson.lab[labStep];
    return `<div class="frame-label"><span>${t('STEP', 'PASO')} ${labStep + 1} / ${lesson.lab.length}</span><span>${lesson.mode === 'local' ? 'GIT / LOCAL' : 'GITHUB / ' + t('CASE','CASO')}</span></div><h2>${e(L(s.title))}</h2><p>${e(L(s.text))}</p>${commandBlock(s, labStep)}<div class="expected"><strong>${t('What to observe', 'Qué observar')}</strong>${e(L(s.expected))}</div><div class="scene-navigation"><button class="btn" data-action="prev" ${labStep === 0 ? 'disabled' : ''}>← ${t('Back', 'Atrás')}</button><button class="btn primary" data-action="next">${labStep === lesson.lab.length - 1 ? t('I completed it and can explain it', 'Lo completé y puedo explicarlo') : t('Next step', 'Siguiente paso')} →</button></div>`;
  }
  function quizQuestion(q, qi) {
    const chosen = answers[qi],
      done = chosen !== undefined,
      correct = chosen === q.correct;
    return `<div class="quiz-block"><span class="eyebrow">${t('QUESTION', 'PREGUNTA')} ${qi + 1} / ${lesson.quiz.length}</span><h2 class="quiz-question">${e(L(q.question))}</h2>${q.options.map((o, i) => `<button class="answer ${chosen === i ? (correct ? 'selected' : 'incorrect') : ''}" data-answer="${qi}:${i}" aria-pressed="${chosen === i}"><span class="letter">${String.fromCharCode(65 + i)}</span>${e(L(o))}</button>`).join('')}${done ? `<div class="quiz-feedback" aria-live="polite"><strong>${correct ? t('That’s the distinction.', 'Esa es la distinción.') : t('Revisit the boundary.', 'Revisá el límite.')}</strong>${e(L(q.explanation))}</div>` : ''}</div>`;
  }
  function quizCompletion() {
    return `<div class="quiz-completion"><span class="eyebrow">${progress[lesson.slug]?.lab ? '✓' : '○'} ${t('Activity', 'Actividad')} &nbsp; ${progress[lesson.slug]?.quiz ? '✓' : '○'} ${t('Checkpoint', 'Control')}</span>${reading() ? '' : `<button class="btn" data-tab="lab">${t('Return to the activity', 'Volvé a la actividad')}</button>`}${progress[lesson.slug]?.lab && progress[lesson.slug]?.quiz && lesson.id < course.lessons.length - 1 ? `<a class="btn primary" href="${link(course.lessons[lesson.id + 1])}">${t('Next lesson', 'Siguiente lección')} →</a>` : ''}</div>`;
  }
  function quizView() {
    const total = lesson.quiz.length,
      right = lesson.quiz.filter((q, i) => answers[i] === q.correct).length,
      answered = Object.keys(answers).length;
    const headline =
      answered === 0
        ? t('Make a prediction.', 'Hacé una predicción.')
        : right === total
          ? t('Every distinction, named.', 'Todas las distinciones, nombradas.')
          : answered < total
            ? t('Keep going.', 'Seguí.')
            : t('Revisit the boundaries you missed.', 'Revisá los límites que fallaste.');
    return `<div class="quiz-layout"><section><span class="eyebrow">${t('RETRIEVE IT. THEN EXPLAIN IT.', 'RECORDALO. DESPUÉS EXPLICALO.')}</span>${lesson.quiz.map(quizQuestion).join('')}${quizCompletion()}</section><aside class="feedback"><p class="quiz-score" aria-live="polite">${right} / ${total}</p><h2>${headline}</h2><p>${t('Choose an answer before looking back at the model. The explanation matters more than the score; a wrong answer can be tried again.', 'Elegí una respuesta antes de volver al modelo. La explicación importa más que el puntaje; una respuesta incorrecta se puede volver a intentar.')}</p><p>${t('Afterward, explain your answers aloud as if you were teaching a teammate.', 'Después, explicá tus respuestas en voz alta como si se las enseñaras a alguien de tu equipo.')}</p>${reading() ? '' : `<button class="btn" data-tab="learn">${t('Revisit the model', 'Volvé al modelo')} ↗</button>`}</aside></div>`;
  }
  function documentView() {
    const data = GitHubVisuals.render(lesson.visual, frame, sim, lang, theme);
    const unit = lesson.unit;
    const sections = [
      ['model', t('Model', 'Modelo')],
      ['learn', t('Understand', 'Entendé')],
      ['lab', t('Activity', 'Actividad')],
      ['check', t('Checkpoint', 'Control')],
      ['sources', t('Go deeper', 'Profundizá')],
    ];
    const heading = `<div class="lesson-heading"><div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${unit} / ${e(L(course.units[unit]))}</span><h1>${e(L(lesson.title))}</h1><p>${e(L(lesson.intro))}</p></div><span class="lesson-number" aria-hidden="true">${String(lesson.id).padStart(2, '0')}</span></div><nav class="doc-nav" aria-label="${t('Lesson sections', 'Secciones de la lección')}">${sections.map(([a, b]) => `<a href="#doc-${a}">${b}</a>`).join('')}</nav>`;
    const model = `<section class="doc-section doc-model" id="doc-model" aria-label="${t('Interactive model', 'Modelo interactivo')}"><div class="scene-top"><span><i class="live-dot"></i>${t('ILLUSTRATIVE MODEL', 'MODELO ILUSTRATIVO')}</span><span>${t('Select an object to inspect', 'Seleccioná un objeto para inspeccionar')}</span></div><div class="diagram" id="diagram">${data.svg}</div><div class="diagram-tools">${controlsHTML(data.controls)}<button class="btn" data-action="expand" aria-label="${t('Expand the visual model', 'Ampliá el modelo visual')}" title="${t('Expand the visual model', 'Ampliá el modelo visual')}">⤢</button><button class="btn" data-action="reset-model" title="${t('Reset visual model', 'Reiniciá el modelo visual')}">↺</button></div><div class="doc-scenes"><span>${t('SCENE', 'ESCENA')} ${frame + 1} / 3</span>${lesson.frames.map((_, i) => `<button class="step-dot ${i === frame ? 'active' : ''}" data-frame="${i}" aria-label="${t('Scene', 'Escena')} ${i + 1}" aria-pressed="${i === frame}"></button>`).join('')}<span>${e(L(lesson.frames[frame].title))}</span></div><p class="model-note">${t('This model is illustrative. The activity distinguishes local Git, GitHub and case-study evidence.', 'Este es un modelo ilustrativo. La actividad identifica su evidencia: Git local, GitHub o caso de estudio.')}</p></section>`;
    const learn = `<section class="doc-section" id="doc-learn"><h2 class="doc-title">${t('Understand', 'Entendé')}</h2>${lesson.frames.map((f, i) => `<article class="doc-frame"><span class="eyebrow">${t('SCENE', 'ESCENA')} ${i + 1} / 3</span><h3>${e(L(f.title))}</h3><p>${e(L(f.text))}</p><div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(f.rule))}</div></article>`).join('')}<div class="experiment-tip"><strong>${t('Try the model.', 'Probá el modelo.')}</strong> ${e(L(lesson.experiment))}</div></section>`;
    const lab = `<section class="doc-section" id="doc-lab"><h2 class="doc-title">${t('Activity', 'Actividad')}</h2><div class="lab-context">${labContext()} <a href="${prefix}downloads/github-labs.zip" download>${t('Download kit', 'Descargá el kit')} ↓</a></div>${lesson.lab.map((st, i) => `<article class="doc-step"><span class="eyebrow">${t('STEP', 'PASO')} ${i + 1} / ${lesson.lab.length}</span><h3>${e(L(st.title))}</h3><p>${e(L(st.text))}</p>${commandBlock(st, i)}<div class="expected"><strong>${t('What to observe', 'Qué observar')}</strong>${e(L(st.expected))}</div></article>`).join('')}<div class="lab-done">${progress[lesson.slug]?.lab ? `<span class="eyebrow">✓ ${t('Activity declared complete', 'Actividad declarada completa')}</span>` : `<button class="btn primary" data-action="lab-done">${t('I completed it and can explain it', 'Lo completé y puedo explicarlo')} ✓</button>`}</div></section>`;
    const check = `<section class="doc-section" id="doc-check"><h2 class="doc-title">${t('Checkpoint', 'Control')}</h2>${quizView()}</section>`;
    const sources = `<section class="doc-section" id="doc-sources"><h2 class="doc-title">${t('Go deeper', 'Profundizá')}</h2><div class="reference-wrap">${sourcesView()}</div></section>`;
    return `<div class="workspace"><main class="lesson-main document" id="main" tabindex="-1">${heading}${model}${learn}${lab}${check}${sources}</main></div>`;
  }
  function sourcesView() {
    const sources = [refs.sources[lesson.source], ...(refs.more[lesson.source] || [])];
    return `<section class="source-card"><span class="eyebrow">${t('PRIMARY REFERENCES','REFERENCIAS PRIMARIAS')}</span><h2>${t('Follow the idea to its source.','Seguí la idea hasta su fuente.')}</h2><p>${t('Official documentation reviewed on '+dateText()+'. GitHub is a changing service; availability depends on your repository and plan. Diagrams are illustrative.', 'Documentación oficial revisada el '+dateText()+'. GitHub es un servicio que cambia; la disponibilidad depende del repositorio y plan. Los diagramas son ilustrativos.')}</p>${sources.map(([label,url])=>`<p><a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a></p>`).join('')}</section><section class="source-card"><h2>${t('Inspect the experiment.','Inspeccioná el experimento.')}</h2><p>${t('The local helper prints real Git operations and checks repository state. Each run uses new isolated folders and no network. GitHub activities require separate observation; a local PASS does not verify a hosted workflow.', 'El asistente local imprime operaciones reales de Git y comprueba el estado del repositorio. Cada ejecución usa carpetas aisladas nuevas y ninguna red. Las actividades de GitHub requieren observación separada; un PASS local no verifica un workflow alojado.')}</p><p><a href="${prefix}labs/lab.mjs" download>lab.mjs ↓</a></p><p><a href="${prefix}downloads/github-labs.zip" download>${t('Complete kit','Kit completo')} ↓</a></p></section><section class="source-card"><h2>${t('Teach it back.','Explicalo con tus palabras.')}</h2><p>${t('Record prediction, observation, explanation and limit. Explain the state change without naming a command. Then identify which tool could perform it.', 'Registrá predicción, observación, explicación y límite. Explicá el cambio de estado sin nombrar un comando. Después identificá qué herramienta podría hacerlo.')}</p><p><a href="${prefix}downloads/course-notes-${lang}.txt" download>${t('Complete course notes','Apuntes completos')} ↓</a></p><button class="btn" data-action="glossary">${t('Visual glossary','Glosario visual')} →</button></section>${lesson.id === 0 ? `<section class="source-card"><h2>${t('Not sure what Git and GitHub are yet?', '¿Todavía no sabés qué son Git y GitHub?')}</h2><p>${t('Five minutes on what they are, where they came from, where they fit and where they do not, before the first lesson.', 'Cinco minutos sobre qué son, de dónde salieron, dónde encajan y dónde no, antes de la primera lección.')}</p><a href="${aboutLink()}">${t('What Git and GitHub are', 'Qué son Git y GitHub')} →</a></section>` : ''}`;
  }
  function render() {
    document.documentElement.lang = lang === 'es' ? 'es-AR' : 'en';
    document.documentElement.dataset.theme = theme;
    document.title = about
      ? L(window.GITHUB_ABOUT.title) + ' · GitHub from scratch'
      : home
      ? t('GitHub from scratch. A visual field guide', 'GitHub desde cero. Una guía visual')
      : L(lesson.title) + ' · GitHub from scratch';
    const scrolled = window.scrollY;
    $('#app').innerHTML =
      `<a class="skip-link" href="#main">${t('Skip to lesson', 'Ir a la lección')}</a><div class="shell">${header()}${about ? aboutView() : home ? homeView() : mainView()}${footer()}</div><dialog class="dialog" id="dialog"></dialog><div class="sr-only" aria-live="polite" id="announce"></div>`;
    bind();
    // The reading skin scrolls the document; a re-render must not send the reader back to the top.
    if (theme === 'reading' && scrolled) window.scrollTo(0, scrolled);
  }
  function updateURL() {
    if (!lesson) return;
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    u.searchParams.set('theme', theme);
    u.searchParams.set('view', currentTab);
    u.searchParams.set('labstep', labStep);
    if (currentTab === 'learn') u.searchParams.set('step', frame);
    else u.searchParams.delete('step');
    try {
      history.replaceState({}, '', u);
    } catch {}
  }
  function updatePanel() {
    inspected = null;
    render();
    updateURL();
  }
  function bind() {
    if (document.querySelector('[data-home-prev]'))
      document.querySelector('[data-home-prev]').onclick = () => {
        homeUnit = (homeUnit + course.units.length - 1) % course.units.length;
        render();
      };
    if (document.querySelector('[data-home-next]'))
      document.querySelector('[data-home-next]').onclick = () => {
        homeUnit = (homeUnit + 1) % course.units.length;
        render();
      };
    document
      .querySelectorAll('[data-theme-pick]')
      .forEach((el) => (el.onchange = () => setTheme(el.value)));
    document
      .querySelectorAll('[data-copy]')
      .forEach((el) => (el.onclick = () => copyText(lesson.lab[+el.dataset.copy].command)));
    document.querySelectorAll('[data-lang]').forEach(
      (el) =>
        (el.onclick = () => {
          lang = el.dataset.lang;
          save();
          render();
          updateURL();
        }),
    );
    document.querySelectorAll('[data-tab]').forEach(
      (el) =>
        (el.onclick = () => {
          currentTab = el.dataset.tab;
          surface = currentTab === 'lab' ? 'notes' : 'visual';
          updatePanel();
        }),
    );
    document.querySelectorAll('[data-frame]').forEach(
      (el) =>
        (el.onclick = () => {
          frame = +el.dataset.frame;
          sim = {};
          updatePanel();
        }),
    );
    document.querySelectorAll('[data-surface]').forEach((el) => {
      if (el.tagName === 'BUTTON')
        el.onclick = () => {
          surface = el.dataset.surface;
          updatePanel();
        };
    });
    document.querySelectorAll('[data-answer]').forEach(
      (el) =>
        (el.onclick = () => {
          const [qi, choice] = el.dataset.answer.split(':').map(Number);
          answers[qi] = choice;
          if (lesson.quiz.every((q, i) => answers[i] === q.correct)) {
            progress[lesson.slug] = { ...progress[lesson.slug], quiz: true };
            save();
          }
          render();
        }),
    );
    document
      .querySelectorAll('[data-action]')
      .forEach((el) => (el.onclick = () => action(el.dataset.action)));
    document.querySelectorAll('[data-sim-action]').forEach(
      (el) =>
        (el.onclick = () => {
          const a = el.dataset.simAction;
          if (a === 'toggle') sim.toggle = !sim.toggle;
          if (a === 'append') sim.count = Math.min(8, (sim.count || 4) + 1);
          if (a === 'read') sim.pos = Math.min(sim.count || 4, (sim.pos || 0) + 1);
          if (a === 'commit') sim.commit = sim.pos || 0;
          refreshModel();
        }),
    );
    document.querySelectorAll('[data-sim]').forEach(
      (el) =>
        (el.oninput = () => {
          sim[el.dataset.sim] = el.type === 'range' ? +el.value : el.value;
          const out = el.nextElementSibling;
          if (out?.tagName === 'OUTPUT') out.textContent = el.value;
          refreshSVG();
        }),
    );
    if ($('#unit-select'))
      $('#unit-select').onchange = (event) => {
        location.href = link(course.lessons.find((l) => l.unit === +event.target.value));
      };
    bindObjects();
  }
  function bindObjects(model = null, target = null) {
    (target || document).querySelectorAll('[data-node]').forEach((el) => {
      el.onclick = () => inspect(el.dataset.node, model, target);
      el.onkeydown = (event) => {
        if (['Enter', ' '].includes(event.key)) {
          event.preventDefault();
          inspect(el.dataset.node, model, target);
        }
      };
    });
  }
  function refreshSVG() {
    const v = GitHubVisuals.render(lesson.visual, frame, sim, lang, theme);
    $('#diagram').innerHTML = v.svg;
    bindObjects();
  }
  function refreshModel() {
    const focused = document.activeElement?.dataset.simAction;
    const v = GitHubVisuals.render(lesson.visual, frame, sim, lang, theme);
    $('#diagram').innerHTML = v.svg;
    bindObjects();
    if (focused) document.querySelector(`[data-sim-action="${focused}"]`)?.focus();
  }
  function inspect(key, model = null, area = null) {
    const v = model || aboutModel || GitHubVisuals.render(lesson.visual, frame, sim, lang, theme),
      text = v.details[key];
    if (!text) return;
    const target = area || $('#dialog[open] .expanded-model') || $('#diagram');
    target.querySelector('.object-info')?.remove();
    const div = document.createElement('div');
    div.className = 'object-info';
    div.innerHTML = `${e(text)}<button aria-label="${t('Close details', 'Cerrá los detalles')}">×</button>`;
    target.appendChild(div);
    div.querySelector('button').onclick = () => div.remove();
    $('#announce').textContent = text;
  }
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(t('Copied to clipboard', 'Copiado al portapapeles'));
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      toast(
        ok
          ? t('Copied to clipboard', 'Copiado al portapapeles')
          : t(
              'Select and copy the command text manually.',
              'Seleccioná y copiá el comando manualmente.',
            ),
      );
    }
  }
  async function action(a) {
    if (reading() && (a === 'next' || a === 'prev')) {
      // In the reading skin the arrows only move the model between its three scenes.
      frame = Math.max(0, Math.min(2, frame + (a === 'next' ? 1 : -1)));
      sim = {};
      updatePanel();
      return;
    }
    if (a === 'lab-done') {
      progress[lesson.slug] = { ...progress[lesson.slug], lab: true };
      save();
      updatePanel();
      return;
    }
    if (a === 'next') {
      if (currentTab === 'learn') {
        if (frame < 2) {
          frame++;
          sim = {};
        } else {
          currentTab = 'lab';
          surface = 'notes';
        }
      } else if (currentTab === 'lab') {
        if (labStep < lesson.lab.length - 1) labStep++;
        else {
          progress[lesson.slug] = { ...progress[lesson.slug], lab: true };
          save();
          currentTab = 'check';
        }
      }
      updatePanel();
    } else if (a === 'prev') {
      if (currentTab === 'learn') frame = Math.max(0, frame - 1);
      if (currentTab === 'lab') labStep = Math.max(0, labStep - 1);
      updatePanel();
    } else if (a === 'reset-model') {
      sim = {};
      updatePanel();
    } else if (a === 'copy') {
      copyText(lesson.lab[labStep].command);
    } else if (a === 'glossary') {
      glossaryIndex = 0;
      glossarySearch = '';
      openGlossary();
    } else if (a === 'expand') {
      const v = GitHubVisuals.render(lesson.visual, frame, sim, lang, theme);
      dialog(
        L(lesson.title),
        '<div class="expanded-model">' + v.svg + '</div><p>' + e(L(lesson.experiment)) + '</p>',
      );
      $('#dialog').classList.add('wide-dialog');
      bindObjects();
    } else if (a === 'map') openMap();
    else if (a === 'help') openHelp();
  }
  function toast(text) {
    document.querySelector('.toast')?.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.role = 'status';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
  function dialog(title, body) {
    const d = $('#dialog');
    d.classList.remove('wide-dialog');
    if (!d.open) lastFocus = document.activeElement;
    d.innerHTML = `<div class="dialog-head"><h2>${e(title)}</h2><button class="btn" data-close aria-label="${t('Close', 'Cerrar')}">×</button></div><div class="dialog-body">${body}</div>`;
    d.querySelector('[data-close]').onclick = () => d.close();
    d.onclose = () => lastFocus?.focus();
    d.onclick = (event) => {
      if (event.target === d) {
        const r = d.getBoundingClientRect();
        if (
          event.clientX < r.left ||
          event.clientX > r.right ||
          event.clientY < r.top ||
          event.clientY > r.bottom
        )
          d.close();
      }
    };
    if (!d.open) d.showModal();
  }
  function openGlossary() {
    const entries = refs.glossary.filter((g) =>
      g.slice(0, 4).join(' ').toLowerCase().includes(glossarySearch.toLowerCase()),
    );
    glossaryIndex = Math.max(0, Math.min(glossaryIndex, entries.length - 1));
    const g = entries[glossaryIndex],
      model = g ? GitHubVisuals.render(course.lessons[g[4]].visual, 0, refs.glossaryStates[g[0]] || {}, lang, theme) : null;
    dialog(
      t('Visual glossary', 'Glosario visual'),
      `<label class="sr-only" for="glossary-search">${t('Search glossary', 'Buscá en el glosario')}</label><input type="search" id="glossary-search" placeholder="${t('Find a concept…', 'Buscá un concepto…')}" value="${e(glossarySearch)}">${g ? `<span class="eyebrow">${glossaryIndex + 1} / ${entries.length}</span><h3 class="glossary-term">${e(g[lang === 'es' ? 1 : 0])}</h3><p>${e(g[lang === 'es' ? 3 : 2])}</p><div class="glossary-art">${model.svg}</div><a href="${link(course.lessons[g[4]])}">${t('See it in lesson', 'Miralo en la lección')} ${String(course.lessons[g[4]].id).padStart(2, '0')}: ${e(L(course.lessons[g[4]].title))} →</a><div class="dialog-footer"><button class="btn" id="gloss-prev" ${glossaryIndex === 0 ? 'disabled' : ''}>← ${t('Previous', 'Anterior')}</button><button class="btn" id="gloss-next" ${glossaryIndex === entries.length - 1 ? 'disabled' : ''}>${t('Next', 'Siguiente')} →</button></div>` : `<p>${t('No matching concept. Try another term.', 'No hay coincidencias. Probá con otro término.')}</p>`}`,
    );
    if (model) bindObjects(model, $('.glossary-art'));
    const input = $('#glossary-search');
    input.oninput = () => {
      const pos = input.selectionStart;
      glossarySearch = input.value;
      glossaryIndex = 0;
      openGlossary();
      $('#glossary-search').focus();
      try {
        $('#glossary-search').setSelectionRange(pos, pos);
      } catch {}
    };
    if ($('#gloss-prev'))
      $('#gloss-prev').onclick = () => {
        glossaryIndex--;
        openGlossary();
      };
    if ($('#gloss-next'))
      $('#gloss-next').onclick = () => {
        glossaryIndex++;
        openGlossary();
      };
  }
  function openMap() {
    dialog(
      t('Your learning path', 'Tu recorrido'),
      `<div class="map-units" role="group" aria-label="${t('Units', 'Unidades')}">${course.units.map((u, i) => `<button class="btn ${i === mapUnit ? 'active' : ''}" data-unit="${i}" aria-label="${e(L(u))}">${i}</button>`).join('')}</div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${mapUnit}</span><h3 class="glossary-term">${e(L(course.units[mapUnit]))}</h3><nav>${lessonLinks(mapUnit)}</nav><p>${score()} / ${course.lessons.length} ${t('lessons complete. Progress is stored on this browser only.', 'lecciones completas. El avance queda solo en este navegador.')}</p>`,
    );
    document.querySelectorAll('[data-unit]').forEach(
      (el) =>
        (el.onclick = () => {
          mapUnit = +el.dataset.unit;
          openMap();
        }),
    );
  }
  function openHelp() {
    dialog(
      t('A small guide to the guide', 'Una guía breve de la guía'),
      `<p>${t('Each lesson has three visual scenes, a real Activity, and a checkpoint with three questions. Use the language switch at any time; your place stays the same. On small screens, switch between the visual model and the explanation.', 'Cada lección tiene tres escenas visuales, un experimento local de Git o un caso de GitHub y un control de tres preguntas. Podés cambiar el idioma cuando quieras sin perder tu lugar. En pantallas chicas, alterná entre el modelo y la explicación.')}</p><p>${t('The skin picker next to the language offers Classic, Dark, Reading and Projector. Reading turns each lesson into one scrolling page with larger type; Projector enlarges everything for a classroom screen. The choice is kept on this browser and travels in the page address.', 'El selector de apariencia junto al idioma ofrece Clásico, Oscuro, Lectura y Proyector. Lectura convierte cada lección en una página que se desplaza, con letra más grande; Proyector agranda todo para una pantalla de aula. La elección queda en este navegador y viaja en la dirección de la página.')}</p>${[
        [t('Next / previous scene or lab step', 'Siguiente / anterior escena o paso'), '→ / ←'],
        [t('Open the course map', 'Abrí el mapa del curso'), 'M'],
        [t('Open the glossary', 'Abrí el glosario'), 'G'],
        [t('Close a dialog', 'Cerrá una ventana'), 'Esc'],
      ]
        .map(([a, b]) => `<div class="help-row"><span>${a}</span><kbd>${b}</kbd></div>`)
        .join(
          '',
        )}<p>${t('Progress is self-reported. Completing a checkpoint does not verify Git or GitHub execution. The course uses no account or telemetry. Local experiments work offline after installing Git and Node.js. Online practice uses your own GitHub account.', 'El avance lo declarás vos. Resolver un control no verifica ejecuciones de Git o GitHub. El curso no usa cuenta ni telemetría. Los experimentos locales funcionan sin conexión después de instalar Git y Node.js. La práctica en línea usa tu cuenta de GitHub.')}</p><p>${t('New to Git? Read', '¿Nuevo en Git? Leé')} <a href="${aboutLink()}">${t('What Git and GitHub are', 'Qué son Git y GitHub')}</a>${t(' first: five minutes on what Git and GitHub are, where they came from and where they fit.', ' primero: cinco minutos sobre qué son Git y GitHub, de dónde salieron y dónde encajan.')}</p><a class="btn primary" href="${prefix}downloads/github-labs.zip" download>${t('Download the complete lab kit', 'Descargá el kit completo')} ↓</a>`,
    );
  }
  document.addEventListener('keydown', (ev) => {
    if (
      $('#dialog')?.open ||
      /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName) ||
      ev.ctrlKey ||
      ev.metaKey ||
      ev.altKey
    )
      return;
    if (ev.target.getAttribute('role') === 'tab' && ['ArrowRight', 'ArrowLeft'].includes(ev.key)) {
      ev.preventDefault();
      const tabs = ['learn', 'lab', 'check', 'sources'];
      currentTab = tabs[(tabs.indexOf(currentTab) + (ev.key === 'ArrowRight' ? 1 : 3)) % 4];
      surface = currentTab === 'lab' ? 'notes' : 'visual';
      updatePanel();
      $('#tab-' + currentTab)?.focus();
      return;
    }
    if (ev.key.toLowerCase() === 'g') openGlossary();
    else if (ev.key.toLowerCase() === 'm') openMap();
    else if (
      lesson &&
      ['learn', 'lab'].includes(currentTab) &&
      ['ArrowRight', 'ArrowLeft'].includes(ev.key)
    ) {
      ev.preventDefault();
      action(ev.key === 'ArrowRight' ? 'next' : 'prev');
    } else if (ev.key === '?') openHelp();
  });
  render();
})();
