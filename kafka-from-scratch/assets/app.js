(() => {
  'use strict';
  const course = window.KAFKA_COURSE,
    refs = window.KAFKA_REFERENCE,
    $ = (s) => document.querySelector(s);
  const id = document.body.dataset.lesson,
    home = id === undefined,
    prefix = home ? '' : '../';
  let lang = 'en',
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
    mapUnit = home ? 0 : Math.floor(Number(id) / 4),
    lastFocus = null,
    homeUnit = 0;
  try {
    lang = localStorage.getItem('kafka-course-language') || 'en';
    progress = JSON.parse(localStorage.getItem('kafka-course-progress') || '{}');
    if (!progress || typeof progress !== 'object') progress = {};
  } catch {}
  if (!['en', 'es'].includes(lang)) lang = 'en';
  // The skin. assets/theme.js already put the chosen one on <html data-theme> before the
  // stylesheet was applied; here it only has to be read, shown in the picker and saved.
  const THEMES = ['light', 'dark', 'reading', 'projector'];
  let theme = document.documentElement.dataset.theme;
  if (!THEMES.includes(theme)) theme = 'light';
  const reading = () => theme === 'reading' && !home;
  const query = new URLSearchParams(location.search);
  if (['en', 'es'].includes(query.get('lang'))) lang = query.get('lang');
  if (!home) {
    if (['learn', 'lab', 'check', 'sources'].includes(query.get('view')))
      currentTab = query.get('view');
    frame = Math.max(0, Math.min(2, Number(query.get('step')) || 0));
  }
  if (currentTab === 'lab') surface = 'notes';
  const lesson = home ? null : course.lessons[Number(id)];
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
  function save() {
    try {
      localStorage.setItem('kafka-course-language', lang);
      localStorage.setItem('kafka-course-theme', theme);
      localStorage.setItem('kafka-course-progress', JSON.stringify(progress));
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
    return course.lessons.filter((l) => progress[l.id]?.quiz && progress[l.id]?.lab).length;
  }
  function header() {
    return `<header><a class="brand" href="${homeLink()}" aria-label="${t('Course home', 'Inicio del curso')}">${icon}<span><strong>Kafka from scratch</strong><small>${t('A visual field guide', 'Una guía visual de campo')}</small></span></a><span class="header-meta">${course.lessons.length} ${t('LESSONS', 'LECCIONES')} / APACHE KAFKA ${course.kafka}</span><div class="header-actions"><button class="btn drawer-only" data-action="map">${t('Course', 'Curso')}</button><button class="btn extra" data-action="glossary">${t('Glossary', 'Glosario')} <span aria-hidden="true">↗</span></button><a class="btn extra" href="${prefix}downloads/kafka-labs.zip" download>${t('Download labs', 'Descargar labs')} ↓</a><label class="theme-pick"><span class="sr-only">${t('Skin', 'Apariencia')}</span><select data-theme-pick aria-label="${t('Skin', 'Apariencia')}">${THEMES.map((x) => `<option value="${x}" ${x === theme ? 'selected' : ''}>${themeName(x)}</option>`).join('')}</select></label><div class="language" role="group" aria-label="${t('Language', 'Idioma')}"><button data-lang="en" aria-pressed="${lang === 'en'}" lang="en">EN</button><button data-lang="es" aria-pressed="${lang === 'es'}" lang="es-AR" title="Español rioplatense">ES</button></div><button class="btn extra" data-action="help" aria-label="${t('Help and keyboard shortcuts', 'Ayuda y atajos de teclado')}">?</button></div></header>`;
  }
  function footer() {
    return `<footer class="footer"><span>${t('Built to understand. Designed to experiment.', 'Hecho para entender. Diseñado para experimentar.')}</span><span class="center">${home ? 'KAFKA / FROM SCRATCH' : String(Number(id) + 1).padStart(2, '0') + ' / ' + course.lessons.length}</span><div class="footer-nav">${!home ? `<a href="${homeLink()}">${t('All lessons', 'Todas las lecciones')}</a>` : ''}<button class="btn" data-action="help">${t('Help', 'Ayuda')}</button>${lesson && lesson.id < course.lessons.length - 1 ? `<a href="${link(course.lessons[lesson.id + 1])}">${t('Next lesson', 'Siguiente')} →</a>` : ''}</div></footer>`;
  }
  function sidebar() {
    const unit = Math.floor(lesson.id / 4);
    return `<aside class="sidebar"><span class="eyebrow">${t('Your learning path', 'Tu recorrido')}</span><label class="sr-only" for="unit-select">${t('Select unit', 'Elegí una unidad')}</label><select id="unit-select" class="unit-select">${course.units.map((u, i) => `<option value="${i}" ${i === unit ? 'selected' : ''}>${String(i + 1).padStart(2, '0')} / ${e(L(u))}</option>`).join('')}</select><h2>${e(L(course.units[unit]))}</h2><nav aria-label="${t('Lessons in this unit', 'Lecciones de esta unidad')}">${lessonLinks(unit)}</nav><div class="sidebar-bottom"><span>${score()} / ${course.lessons.length} ${t('completed', 'completadas')}</span><div class="progress-track"><span style="width:${(score() / course.lessons.length) * 100}%"></span></div>${t('A lesson is complete after its checkpoint and hands-on lab. Progress stays on this browser.', 'Una lección se completa con su control y laboratorio. El avance queda en este navegador.')}<button class="btn" data-action="map">${t('Explore all ' + course.units.length + ' units', 'Explorá las ' + course.units.length + ' unidades')} ↗</button></div></aside>`;
  }
  function lessonLinks(unit) {
    return course.lessons
      .slice(unit * 4, unit * 4 + 4)
      .map(
        (l) =>
          `<a class="lesson-link ${lesson?.id === l.id ? 'current' : ''} ${progress[l.id]?.quiz && progress[l.id]?.lab ? 'completed' : ''}" ${lesson?.id === l.id ? 'aria-current="page"' : ''} href="${link(l)}"><span>${progress[l.id]?.quiz && progress[l.id]?.lab ? '✓' : String(l.id + 1).padStart(2, '0')}</span><span>${e(L(l.title))}</span></a>`,
      )
      .join('');
  }
  function homeView() {
    const next =
      course.lessons.find((l) => !progress[l.id]?.quiz || !progress[l.id]?.lab) ||
      course.lessons[0];
    return `<main class="home" id="main"><section class="home-intro"><span class="eyebrow">${t('FROM YOUR FIRST EVENT TO A RESILIENT SYSTEM', 'DE TU PRIMER EVENTO A UN SISTEMA RESISTENTE')}</span><h1>${t('Learn Kafka.<br>See every<br><em>moving part.</em>', 'Aprendé Kafka.<br>Entendé cada<br><em>pieza.</em>')}</h1><p class="home-lead">${t('Follow an event. Move a bookmark. Break a broker. Build an intuition you can test in a real Docker lab.', 'Seguí un evento. Mové un señalador. Hacé caer un broker. Construí una intuición que puedas probar en un laboratorio Docker real.')}</p><div class="home-actions"><a class="btn primary" href="${link(next)}">${score() ? t('Continue learning', 'Seguí aprendiendo') : t('Start from zero', 'Empezá desde cero')} <span aria-hidden="true">→</span></a><a class="btn" href="${prefix}downloads/kafka-labs.zip" download>${t('Get the lab kit', 'Descargá el kit')} ↓</a></div><div class="home-tag"><span>${course.lessons.length} ${t('VISUAL LESSONS', 'LECCIONES VISUALES')}</span><span>${course.lessons.length} ${t('DOCKER LABS', 'LABS DOCKER')}</span><span>EN / ES</span></div><div class="hero-art" aria-hidden="true">${hero()}</div></section><section class="home-curriculum" aria-label="${t('Course curriculum', 'Programa del curso')}"><div class="eyebrow"><span>${t('THE LEARNING PATH', 'EL RECORRIDO')}</span><span>01 ${t('to', 'a')} ${String(course.lessons.length).padStart(2, '0')}</span></div>${course.units.map((u, i) => `<a class="unit-row ${i === homeUnit ? 'mobile-active' : ''}" href="${link(course.lessons[i * 4])}"><span class="num">${String(i + 1).padStart(2, '0')}</span><span><strong>${e(L(u))}</strong><small>${i * 4 + 3 < course.lessons.length ? e(L(course.lessons[i * 4].title)) + ' → ' + e(L(course.lessons[i * 4 + 3].title)) : t('KafkaTemplate · @KafkaListener · JSON', 'KafkaTemplate · @KafkaListener · JSON')}</small></span><span class="unit-arrow" aria-hidden="true">↗</span></a>`).join('')}<div class="home-mobile-pager"><button class="btn" data-home-prev aria-label="${t('Previous unit', 'Unidad anterior')}">←</button><span>${t('Unit', 'Unidad')} ${homeUnit + 1} / ${course.units.length}</span><button class="btn" data-home-next aria-label="${t('Next unit', 'Siguiente unidad')}">→</button></div><p class="home-footnote">${t('No account. No external scripts. Open locally or host anywhere.<br>Docker is required for the labs, not for exploring the visual models.', 'Sin cuenta ni scripts externos. Abrilo localmente o publicalo donde quieras.<br>Docker es necesario para los laboratorios, no para explorar los modelos.')}</p></section></main>`;
  }
  function hero() {
    const P = KafkaVisuals.palette(theme);
    return `<svg viewBox="0 0 620 235" xmlns="http://www.w3.org/2000/svg"><path d="M30 90H590M30 150H590" stroke="${P.line}" stroke-width="1" stroke-dasharray="4 5"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${48 + i * 88}" y="70" width="68" height="43" rx="5" fill="${i === 4 ? P.amber : P.mint}" stroke="${P.green}"/><text x="${82 + i * 88}" y="97" text-anchor="middle" font-family="Consolas,monospace" font-size="13" fill="${P.ink}">${String(i).padStart(2, '0')}</text>`).join('')}<path d="M254 162v-38l-6 9m6-9 6 9" stroke="${P.orange}" stroke-width="2" fill="none"/><text x="254" y="187" font-family="Segoe UI,system-ui" font-size="12" text-anchor="middle" fill="${P.orange}">${t('your next event', 'tu próximo evento')}</text><text x="51" y="46" font-family="Consolas,monospace" font-size="10" letter-spacing="2" fill="${P.muted}">orders / partition 0</text><text x="510" y="143" font-family="Consolas,monospace" font-size="10" fill="${P.muted}">append →</text></svg>`;
  }
  function mainView() {
    if (reading()) return documentView();
    return `<div class="workspace">${sidebar()}<main class="lesson-main" id="main" tabindex="-1"><div class="lesson-heading"><div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${Math.floor(lesson.id / 4) + 1} / ${e(L(course.units[Math.floor(lesson.id / 4)]))}</span><h1>${e(L(lesson.title))}</h1><p>${e(L(lesson.intro))}</p></div><span class="lesson-number" aria-hidden="true">${String(lesson.id + 1).padStart(2, '0')}</span></div><nav class="tabs" role="tablist" aria-label="${t('Lesson sections', 'Secciones de la lección')}">${[
      ['learn', t('Understand', 'Entendé'), '3'],
      ['lab', t('Docker lab', 'Laboratorio'), lesson.lab.length],
      ['check', t('Checkpoint', 'Control'), progress[id]?.quiz ? '✓' : lesson.quiz.length],
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
    const data = window.KafkaVisuals.render(lesson.visual, frame, sim, lang, theme);
    return `<div class="mobile-surface"><button data-surface="visual" class="${surface === 'visual' ? 'active' : ''}">${t('Visual model', 'Modelo visual')}</button><button data-surface="notes" class="${surface === 'notes' ? 'active' : ''}">${currentTab === 'lab' ? t('Lab steps', 'Pasos del lab') : t('Explanation', 'Explicación')}</button></div><section class="scene-column" aria-label="${t('Interactive model', 'Modelo interactivo')}"><div class="scene-top"><span><i class="live-dot"></i>${t('ILLUSTRATIVE MODEL', 'MODELO ILUSTRATIVO')}</span><span>${t('Select an object to inspect', 'Seleccioná un objeto para inspeccionar')}</span></div><div class="diagram" id="diagram">${data.svg}</div><div class="diagram-tools">${controlsHTML(data.controls)}<button class="btn" data-action="expand" aria-label="${t('Expand the visual model', 'Ampliá el modelo visual')}" title="${t('Expand the visual model', 'Ampliá el modelo visual')}">⤢</button><button class="btn" data-action="reset-model" title="${t('Reset visual model', 'Reiniciá el modelo visual')}">↺</button></div><p class="model-note">${t('This model runs in your browser. The Docker lab is a separate, real experiment.', 'Este modelo corre en tu navegador. El laboratorio Docker es un experimento real y separado.')}</p>${currentTab === 'lab' ? `<div class="lab-context">${t('Run one step at a time in your terminal, from the extracted <strong>labs</strong> folder. Commands work in PowerShell, bash and zsh.', 'Ejecutá un paso por vez en tu terminal, desde la carpeta <strong>labs</strong> descomprimida. Los comandos funcionan en PowerShell, bash y zsh.')} <a href="${prefix}downloads/kafka-labs.zip" download>${t('Download kit', 'Descargá el kit')} ↓</a></div>` : ''}</section><section class="inspector" aria-label="${currentTab === 'lab' ? t('Docker activity', 'Actividad Docker') : t('Explanation', 'Explicación')}">${currentTab === 'lab' ? labView() : frameView()}</section>`;
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
    return `<div class="frame-label"><span>${t('SCENE', 'ESCENA')} ${frame + 1} / 3</span><div class="steps">${lesson.frames.map((_, i) => `<button class="step-dot ${i === frame ? 'active' : ''}" data-frame="${i}" aria-label="${t('Scene', 'Escena')} ${i + 1}" aria-pressed="${i === frame}"></button>`).join('')}</div></div><h2>${e(L(f.title))}</h2><p>${e(L(f.text))}</p><div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(f.rule))}</div><div class="experiment-tip"><strong>${t('Try the model.', 'Probá el modelo.')}</strong> ${e(L(lesson.experiment))}</div><div class="scene-navigation"><button class="btn" data-action="prev" ${frame === 0 ? 'disabled' : ''}>← ${t('Back', 'Atrás')}</button><button class="btn primary" data-action="next">${frame === 2 ? t('Open Docker lab', 'Abrí el laboratorio') : t('Next scene', 'Siguiente escena')} →</button></div>`;
  }
  function labView() {
    const s = lesson.lab[labStep];
    return `<div class="frame-label"><span>${t('STEP', 'PASO')} ${labStep + 1} / ${lesson.lab.length}</span><span>DOCKER / CLI</span></div><h2>${e(L(s.title))}</h2><p>${e(L(s.text))}</p><div class="lab-command"><div class="command-title"><span>TERMINAL</span><button data-action="copy">${t('Copy', 'Copiar')} ⧉</button></div><pre><code>${e(s.command)}</code></pre></div><div class="expected"><strong>${t('What to observe', 'Qué observar')}</strong>${e(L(s.expected))}</div><div class="scene-navigation"><button class="btn" data-action="prev" ${labStep === 0 ? 'disabled' : ''}>← ${t('Back', 'Atrás')}</button><button class="btn primary" data-action="next">${labStep === lesson.lab.length - 1 ? t('I ran & understood it', 'Lo ejecuté y entendí') : t('Next step', 'Siguiente paso')} →</button></div>`;
  }
  function quizQuestion(q, qi) {
    const chosen = answers[qi],
      done = chosen !== undefined,
      correct = chosen === q.correct;
    return `<div class="quiz-block"><span class="eyebrow">${t('QUESTION', 'PREGUNTA')} ${qi + 1} / ${lesson.quiz.length}</span><h2 class="quiz-question">${e(L(q.question))}</h2>${q.options.map((o, i) => `<button class="answer ${chosen === i ? (correct ? 'selected' : 'incorrect') : ''}" data-answer="${qi}:${i}" aria-pressed="${chosen === i}"><span class="letter">${String.fromCharCode(65 + i)}</span>${e(L(o))}</button>`).join('')}${done ? `<div class="quiz-feedback" aria-live="polite"><strong>${correct ? t('That’s the distinction.', 'Esa es la distinción.') : t('Revisit the boundary.', 'Revisá el límite.')}</strong>${e(L(q.explanation))}</div>` : ''}</div>`;
  }
  function quizCompletion() {
    return `<div class="quiz-completion"><span class="eyebrow">${progress[id]?.lab ? '✓' : '○'} ${t('Docker lab', 'Laboratorio Docker')} &nbsp; ${progress[id]?.quiz ? '✓' : '○'} ${t('Checkpoint', 'Control')}</span>${reading() ? '' : `<button class="btn" data-tab="lab">${t('Return to lab', 'Volvé al laboratorio')}</button>`}${progress[id]?.lab && progress[id]?.quiz && lesson.id < course.lessons.length - 1 ? `<a class="btn primary" href="${link(course.lessons[lesson.id + 1])}">${t('Next lesson', 'Siguiente lección')} →</a>` : ''}</div>`;
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
    const data = KafkaVisuals.render(lesson.visual, frame, sim, lang, theme);
    const unit = Math.floor(lesson.id / 4);
    const sections = [
      ['model', t('Model', 'Modelo')],
      ['learn', t('Understand', 'Entendé')],
      ['lab', t('Docker lab', 'Laboratorio')],
      ['check', t('Checkpoint', 'Control')],
      ['sources', t('Go deeper', 'Profundizá')],
    ];
    const heading = `<div class="lesson-heading"><div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${unit + 1} / ${e(L(course.units[unit]))}</span><h1>${e(L(lesson.title))}</h1><p>${e(L(lesson.intro))}</p></div><span class="lesson-number" aria-hidden="true">${String(lesson.id + 1).padStart(2, '0')}</span></div><nav class="doc-nav" aria-label="${t('Lesson sections', 'Secciones de la lección')}">${sections.map(([a, b]) => `<a href="#doc-${a}">${b}</a>`).join('')}</nav>`;
    const model = `<section class="doc-section doc-model" id="doc-model" aria-label="${t('Interactive model', 'Modelo interactivo')}"><div class="scene-top"><span><i class="live-dot"></i>${t('ILLUSTRATIVE MODEL', 'MODELO ILUSTRATIVO')}</span><span>${t('Select an object to inspect', 'Seleccioná un objeto para inspeccionar')}</span></div><div class="diagram" id="diagram">${data.svg}</div><div class="diagram-tools">${controlsHTML(data.controls)}<button class="btn" data-action="expand" aria-label="${t('Expand the visual model', 'Ampliá el modelo visual')}" title="${t('Expand the visual model', 'Ampliá el modelo visual')}">⤢</button><button class="btn" data-action="reset-model" title="${t('Reset visual model', 'Reiniciá el modelo visual')}">↺</button></div><div class="doc-scenes"><span>${t('SCENE', 'ESCENA')} ${frame + 1} / 3</span>${lesson.frames.map((_, i) => `<button class="step-dot ${i === frame ? 'active' : ''}" data-frame="${i}" aria-label="${t('Scene', 'Escena')} ${i + 1}" aria-pressed="${i === frame}"></button>`).join('')}<span>${e(L(lesson.frames[frame].title))}</span></div><p class="model-note">${t('This model runs in your browser. The Docker lab is a separate, real experiment.', 'Este modelo corre en tu navegador. El laboratorio Docker es un experimento real y separado.')}</p></section>`;
    const learn = `<section class="doc-section" id="doc-learn"><h2 class="doc-title">${t('Understand', 'Entendé')}</h2>${lesson.frames.map((f, i) => `<article class="doc-frame"><span class="eyebrow">${t('SCENE', 'ESCENA')} ${i + 1} / 3</span><h3>${e(L(f.title))}</h3><p>${e(L(f.text))}</p><div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(f.rule))}</div></article>`).join('')}<div class="experiment-tip"><strong>${t('Try the model.', 'Probá el modelo.')}</strong> ${e(L(lesson.experiment))}</div></section>`;
    const lab = `<section class="doc-section" id="doc-lab"><h2 class="doc-title">${t('Docker lab', 'Laboratorio Docker')}</h2><div class="lab-context">${t('Run one step at a time in your terminal, from the extracted <strong>labs</strong> folder. Commands work in PowerShell, bash and zsh.', 'Ejecutá un paso por vez en tu terminal, desde la carpeta <strong>labs</strong> descomprimida. Los comandos funcionan en PowerShell, bash y zsh.')} <a href="${prefix}downloads/kafka-labs.zip" download>${t('Download kit', 'Descargá el kit')} ↓</a></div>${lesson.lab.map((st, i) => `<article class="doc-step"><span class="eyebrow">${t('STEP', 'PASO')} ${i + 1} / ${lesson.lab.length}</span><h3>${e(L(st.title))}</h3><p>${e(L(st.text))}</p><div class="lab-command"><div class="command-title"><span>TERMINAL</span><button data-copy="${i}">${t('Copy', 'Copiar')} ⧉</button></div><pre><code>${e(st.command)}</code></pre></div><div class="expected"><strong>${t('What to observe', 'Qué observar')}</strong>${e(L(st.expected))}</div></article>`).join('')}<div class="lab-done">${progress[id]?.lab ? `<span class="eyebrow">✓ ${t('Lab marked as done', 'Laboratorio marcado como hecho')}</span>` : `<button class="btn primary" data-action="lab-done">${t('I ran & understood it', 'Lo ejecuté y entendí')} ✓</button>`}</div></section>`;
    const check = `<section class="doc-section" id="doc-check"><h2 class="doc-title">${t('Checkpoint', 'Control')}</h2>${quizView()}</section>`;
    const sources = `<section class="doc-section" id="doc-sources"><h2 class="doc-title">${t('Go deeper', 'Profundizá')}</h2><div class="reference-wrap">${sourcesView()}</div></section>`;
    return `<div class="workspace"><main class="lesson-main document" id="main" tabindex="-1">${heading}${model}${learn}${lab}${check}${sources}</main></div>`;
  }
  function sourcesView() {
    const source = refs.sources[lesson.source];
    return `<section class="source-card"><span class="eyebrow">${t('PRIMARY REFERENCE', 'REFERENCIA PRIMARIA')}</span><h2>${t('Follow the idea to its source.', 'Seguí la idea hasta su fuente.')}</h2><p>${t(`Course baseline: Apache Kafka ${course.kafka}. Official references were checked on ${dateText()}. The lessons are written independently; the diagrams are teaching models, not captured production traces.`, `Base del curso: Apache Kafka ${course.kafka}. Referencias oficiales verificadas el ${dateText()}. Las lecciones son originales; los diagramas son modelos didácticos, no trazas de producción.`)}</p><a href="${source[1]}" target="_blank" rel="noopener noreferrer">${e(source[0])} ↗</a></section><section class="source-card"><h2>${t('Read the experiment itself.', 'Leé el experimento por dentro.')}</h2><p>${t('Every activity uses the included Compose configuration and readable Java client. Keep the version pins when reproducing results. The source is the place to inspect the actual API calls, timing limits and recovery behavior. Lab.java dispatches each command to a small class next to it (Topics, Producing, Consuming, Transactions, Integrations, Security, Clusters); the complete source is in the lab kit.', 'Cada actividad usa la configuración Compose incluida y un cliente Java legible. Conservá las versiones fijadas para reproducir resultados. En el código podés inspeccionar las llamadas reales, límites de tiempo y recuperación. Lab.java deriva cada comando a una clase chica que está al lado (Topics, Producing, Consuming, Transactions, Integrations, Security, Clusters); el código completo viene en el kit.')}</p>${lesson.visual === 'spring' ? `<a href="${prefix}labs/spring/src/main/java/course/spring/OrderProducer.java" download>OrderProducer.java ↓</a> &nbsp; <a href="${prefix}labs/spring/src/main/java/course/spring/OrderConsumer.java" download>OrderConsumer.java ↓</a>` : `<a href="${prefix}labs/src/main/java/course/Lab.java" download>Lab.java ↓</a>`} &nbsp; <a href="${prefix}labs/compose.yaml" download>compose.yaml ↓</a> &nbsp; <a href="${prefix}downloads/kafka-labs.zip" download>${t('Complete lab kit', 'Kit completo')} ↓</a></section><section class="source-card"><h2>${t('Make it stick.', 'Hacé que te quede.')}</h2><p>${t('Predict the outcome before each command. Keep a small lab notebook: prediction, observed result, explanation, and what the experiment does not prove. Repeat the activity after a day without reading the steps first.', 'Predecí el resultado antes de cada comando. Llevá un cuaderno breve: predicción, resultado observado, explicación y qué no prueba el experimento. Repetí la actividad al día siguiente sin leer primero los pasos.')}</p><button class="btn" data-action="glossary">${t('Explore the visual glossary', 'Explorá el glosario visual')} →</button></section>`;
  }
  function render() {
    document.documentElement.lang = lang === 'es' ? 'es-AR' : 'en';
    document.documentElement.dataset.theme = theme;
    document.title = home
      ? t('Kafka from scratch. A visual field guide', 'Kafka desde cero. Una guía visual')
      : L(lesson.title) + ' · Kafka from scratch';
    const scrolled = window.scrollY;
    $('#app').innerHTML =
      `<a class="skip-link" href="#main">${t('Skip to lesson', 'Ir a la lección')}</a><div class="shell">${header()}${home ? homeView() : mainView()}${footer()}</div><dialog class="dialog" id="dialog"></dialog><div class="sr-only" aria-live="polite" id="announce"></div>`;
    bind();
    // The reading skin scrolls the document; a re-render must not send the reader back to the top.
    if (theme === 'reading' && scrolled) window.scrollTo(0, scrolled);
  }
  function updateURL() {
    if (home) return;
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    u.searchParams.set('theme', theme);
    u.searchParams.set('view', currentTab);
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
            progress[id] = { ...progress[id], quiz: true };
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
        location.href = link(course.lessons[+event.target.value * 4]);
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
    const v = KafkaVisuals.render(lesson.visual, frame, sim, lang, theme);
    $('#diagram').innerHTML = v.svg;
    bindObjects();
  }
  function refreshModel() {
    const focused = document.activeElement?.dataset.simAction;
    const v = KafkaVisuals.render(lesson.visual, frame, sim, lang, theme);
    $('#diagram').innerHTML = v.svg;
    bindObjects();
    if (focused) document.querySelector(`[data-sim-action="${focused}"]`)?.focus();
  }
  function inspect(key, model = null, area = null) {
    const v = model || KafkaVisuals.render(lesson.visual, frame, sim, lang, theme),
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
      progress[id] = { ...progress[id], lab: true };
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
          progress[id] = { ...progress[id], lab: true };
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
      const v = KafkaVisuals.render(lesson.visual, frame, sim, lang, theme);
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
      model = g ? KafkaVisuals.render(course.lessons[g[4]].visual, 0, {}, lang, theme) : null;
    dialog(
      t('Visual glossary', 'Glosario visual'),
      `<label class="sr-only" for="glossary-search">${t('Search glossary', 'Buscá en el glosario')}</label><input type="search" id="glossary-search" placeholder="${t('Find a concept…', 'Buscá un concepto…')}" value="${e(glossarySearch)}">${g ? `<span class="eyebrow">${glossaryIndex + 1} / ${entries.length}</span><h3 class="glossary-term">${e(g[lang === 'es' ? 1 : 0])}</h3><p>${e(g[lang === 'es' ? 3 : 2])}</p><div class="glossary-art">${model.svg}</div><a href="${link(course.lessons[g[4]])}">${t('See it in lesson', 'Miralo en la lección')} ${g[4] + 1}: ${e(L(course.lessons[g[4]].title))} →</a><div class="dialog-footer"><button class="btn" id="gloss-prev" ${glossaryIndex === 0 ? 'disabled' : ''}>← ${t('Previous', 'Anterior')}</button><button class="btn" id="gloss-next" ${glossaryIndex === entries.length - 1 ? 'disabled' : ''}>${t('Next', 'Siguiente')} →</button></div>` : `<p>${t('No matching concept. Try another term.', 'No hay coincidencias. Probá con otro término.')}</p>`}`,
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
      `<div class="map-units" role="group" aria-label="${t('Units', 'Unidades')}">${course.units.map((u, i) => `<button class="btn ${i === mapUnit ? 'active' : ''}" data-unit="${i}" aria-label="${e(L(u))}">${i + 1}</button>`).join('')}</div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${mapUnit + 1}</span><h3 class="glossary-term">${e(L(course.units[mapUnit]))}</h3><nav>${lessonLinks(mapUnit)}</nav><p>${score()} / ${course.lessons.length} ${t('lessons complete. Progress is stored on this browser only.', 'lecciones completas. El avance queda solo en este navegador.')}</p>`,
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
      `<p>${t('Each lesson has three visual scenes, a real Docker activity, and a checkpoint with three questions. Use the language switch at any time; your place stays the same. On small screens, switch between the visual model and the explanation.', 'Cada lección tiene tres escenas visuales, una actividad Docker real y un control de tres preguntas. Podés cambiar el idioma cuando quieras sin perder tu lugar. En pantallas chicas, alterná entre el modelo y la explicación.')}</p><p>${t('The skin picker next to the language offers Classic, Dark, Reading and Projector. Reading turns each lesson into one scrolling page with larger type; Projector enlarges everything for a classroom screen. The choice is kept on this browser and travels in the page address.', 'El selector de apariencia junto al idioma ofrece Clásico, Oscuro, Lectura y Proyector. Lectura convierte cada lección en una página que se desplaza, con letra más grande; Proyector agranda todo para una pantalla de aula. La elección queda en este navegador y viaja en la dirección de la página.')}</p>${[
        [t('Next / previous scene or lab step', 'Siguiente / anterior escena o paso'), '→ / ←'],
        [t('Open the course map', 'Abrí el mapa del curso'), 'M'],
        [t('Open the glossary', 'Abrí el glosario'), 'G'],
        [t('Close a dialog', 'Cerrá una ventana'), 'Esc'],
      ]
        .map(([a, b]) => `<div class="help-row"><span>${a}</span><kbd>${b}</kbd></div>`)
        .join(
          '',
        )}<p>${t('Progress is self-reported for labs. Completing a checkpoint does not prove that a Docker command ran. No account or telemetry is used. Diagrams work offline; downloading Docker images needs internet the first time.', 'El avance de laboratorios lo declarás vos. Resolver un control no prueba que se ejecutó un comando Docker. No hay cuenta ni telemetría. Los diagramas funcionan sin internet; la primera descarga de imágenes Docker necesita conexión.')}</p><a class="btn primary" href="${prefix}downloads/kafka-labs.zip" download>${t('Download the complete lab kit', 'Descargá el kit completo')} ↓</a>`,
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
      !home &&
      ['learn', 'lab'].includes(currentTab) &&
      ['ArrowRight', 'ArrowLeft'].includes(ev.key)
    ) {
      ev.preventDefault();
      action(ev.key === 'ArrowRight' ? 'next' : 'prev');
    } else if (ev.key === '?') openHelp();
  });
  render();
})();
