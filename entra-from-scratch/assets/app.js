(() => {
    'use strict';
    const course = window.ENTRA_COURSE, refs = window.ENTRA_REFERENCE, $ = (s) => document.querySelector(s);
    const id = document.body.dataset.lesson, about = document.body.dataset.page === 'about', home = id === undefined && !about, prefix = id === undefined ? '' : '../';
    let lang = 'en', progress = {}, currentTab = 'learn', frame = 0, labStep = 0, answers = {}, sim = {}, surface = 'visual', inspected = null, glossaryIndex = 0, glossarySearch = '', mapUnit = id === undefined ? 0 : course.lessons[Number(id)].unit, lastFocus = null, homeUnit = 0;
    try {
        lang = localStorage.getItem('entra-course-language') || 'en';
        progress = JSON.parse(localStorage.getItem('entra-course-progress') || '{}');
        if (!progress || typeof progress !== 'object' || Array.isArray(progress))
            progress = {};
    }
    catch { }
    if (!['en', 'es'].includes(lang))
        lang = 'en';
    // The skin. assets/theme.js already put the chosen one on <html data-theme> before the
    // stylesheet was applied; here it only has to be read, shown in the picker and saved.
    const THEMES = ['light', 'dark', 'reading', 'projector'];
    let theme = document.documentElement.dataset.theme;
    if (!THEMES.includes(theme))
        theme = 'light';
    const reading = () => theme === 'reading' && id !== undefined;
    const query = new URLSearchParams(location.search);
    if (['en', 'es'].includes(query.get('lang')))
        lang = query.get('lang');
    if (id !== undefined) {
        if (['learn', 'lab', 'check', 'sources'].includes(query.get('view')))
            currentTab = query.get('view');
        frame = Math.max(0, Math.min(2, Number(query.get('step')) || 0));
        labStep = Math.max(0, Math.min(course.lessons[Number(id)].lab.length - 1, Number(query.get('labstep')) || 0));
    }
    if (currentTab === 'lab')
        surface = 'notes';
    const lesson = id === undefined ? null : course.lessons[Number(id)];
    const t = (a, b) => (lang === 'es' ? b : a), L = (x) => x?.[lang] || '', e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const pad = (n) => String(n).padStart(2, '0');
    const courseName = () => t('Microsoft Entra from scratch', 'Microsoft Entra desde cero');
    /* The Prumathe mark: an Etruscan-style open P drawn as one stroke, with a flame on the stem, in
       the palette of the active skin. */
    const icon = `<svg viewBox="99 21 142 298" aria-hidden="true"><path d="M131 313V133C176 133 217 159 217 199" fill="none" stroke="var(--green)" stroke-width="36" stroke-linecap="butt" stroke-linejoin="round"/><path d="M131 27C103 59 105 91 131 117C157 91 159 59 131 27Z" fill="var(--orange)"/></svg>`;
    const themeName = (x) => ({
        light: t('Classic', 'Clásico'),
        dark: t('Dark', 'Oscuro'),
        reading: t('Reading', 'Lectura'),
        projector: t('Projector', 'Proyector'),
    })[x];
    const MONTHS = {
        en: 'January February March April May June July August September October November December'.split(' '),
        es: 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' '),
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
    function pictureLink() {
        return `${prefix}big-picture.html?lang=${lang}&theme=${theme}`;
    }
    function aboutLink() {
        return `${prefix}what-entra-is.html?lang=${lang}&theme=${theme}`;
    }
    function save() {
        try {
            localStorage.setItem('entra-course-language', lang);
            localStorage.setItem('entra-course-theme', theme);
            localStorage.setItem('entra-course-progress', JSON.stringify(progress));
        }
        catch { }
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
        return `<header><a class="brand" href="${homeLink()}" aria-label="${t('Course home', 'Inicio del curso')}">${icon}<span><strong>${courseName()}</strong><small>${t('A visual field guide', 'Una guía visual de campo')}</small></span></a><span class="header-meta">${course.lessons.length} ${t('LESSONS', 'LECCIONES')} / ANGULAR / SPRING / POSTGRESQL</span><div class="header-actions"><button class="btn drawer-only" data-action="map">${t('Course', 'Curso')}</button><button class="btn extra" data-action="glossary">${t('Glossary', 'Glosario')} <span aria-hidden="true">↗</span></button><a class="btn extra" href="${prefix}downloads/entra-labs.zip" download>${t('Download labs', 'Descargar labs')} ↓</a><label class="theme-pick"><span class="sr-only">${t('Skin', 'Apariencia')}</span><select data-theme-pick aria-label="${t('Skin', 'Apariencia')}">${THEMES.map((x) => `<option value="${x}" ${x === theme ? 'selected' : ''}>${themeName(x)}</option>`).join('')}</select></label><div class="language" role="group" aria-label="${t('Language', 'Idioma')}"><button data-lang="en" aria-pressed="${lang === 'en'}" lang="en">EN</button><button data-lang="es" aria-pressed="${lang === 'es'}" lang="es-AR" title="Español rioplatense">ES</button></div><button class="btn extra" data-action="help" aria-label="${t('Help and keyboard shortcuts', 'Ayuda y atajos de teclado')}">?</button></div></header>`;
    }
    // The published version, when the site build wrote it into the page: date and commit,
    // shown on the course home in place of the motto.
    function published() {
      const meta = (name) => document.querySelector(`meta[name="prumathe-published-${name}"]`)?.content || '';
      const at = meta('at'), commit = meta('commit');
      if (!at) return '';
      return `${t('Published', 'Publicado')} ${e(at)}${commit ? ` · commit <a href="https://github.com/andresdiegolanda/prumathe/commit/${e(commit)}">${e(commit.slice(0, 7))}</a>` : ''}`;
    }
    function footer() {
        return `<footer class="footer"><span>${(home && published()) || t('Built to understand. Designed to experiment.', 'Hecho para entender. Diseñado para experimentar.')}</span><span class="center">${!lesson ? t('ENTRA / FROM SCRATCH', 'ENTRA / DESDE CERO') : pad(Number(id)) + ' / ' + course.lessons.length}</span><div class="footer-nav">${!home ? `<a href="${homeLink()}">${t('All lessons', 'Todas las lecciones')}</a>` : ''}<button class="btn" data-action="help">${t('Help', 'Ayuda')}</button>${lesson && lesson.id < course.lessons.length - 1 ? `<a href="${link(course.lessons[lesson.id + 1])}">${t('Next lesson', 'Siguiente lección')} →</a>` : ''}</div></footer>`;
    }
    function sidebar() {
        const unit = lesson.unit;
        return `<aside class="sidebar"><span class="eyebrow">${t('Your learning path', 'Tu recorrido')}</span><label class="sr-only" for="unit-select">${t('Select unit', 'Elegí una unidad')}</label><select id="unit-select" class="unit-select">${course.units.map((u, i) => `<option value="${i}" ${i === unit ? 'selected' : ''}>${pad(i)} / ${e(L(u))}</option>`).join('')}</select><h2>${e(L(course.units[unit]))}</h2><nav aria-label="${t('Lessons in this unit', 'Lecciones de esta unidad')}">${lessonLinks(unit)}</nav><div class="sidebar-bottom"><span>${score()} / ${course.lessons.length} ${t('completed', 'completadas')}</span><div class="progress-track"><span style="width:${(score() / course.lessons.length) * 100}%"></span></div>${t('Completion combines the checkpoint and your declaration of the activity. Keep the kind of evidence in your notebook.', 'Completar combina el control y tu declaración de la actividad. Anotá en tu cuaderno qué tipo de evidencia tenés.')}<button class="btn" data-action="map">${t('Explore all ' + course.units.length + ' units', 'Recorré las ' + course.units.length + ' unidades')} ↗</button></div></aside>`;
    }
    function lessonLinks(unit) {
        return course.lessons
            .filter((l) => l.unit === unit)
            .map((l) => `<a class="lesson-link ${lesson?.id === l.id ? 'current' : ''} ${progress[l.slug]?.quiz && progress[l.slug]?.lab ? 'completed' : ''}" ${lesson?.id === l.id ? 'aria-current="page"' : ''} href="${link(l)}"><span>${progress[l.slug]?.quiz && progress[l.slug]?.lab ? '✓' : pad(l.id)}</span><span>${e(L(l.title))}</span></a>`)
            .join('');
    }
    // The topics of each unit, under its name on the home page.
    const UNIT_TOPICS = [
        ['Predict, observe, explain', 'Predecí, observá, explicá'],
        ['Identity, principals and registrations', 'Identidad, principals y registros'],
        ['Windows sign-in, PKCE, tokens, scopes and roles', 'Inicio de sesión de Windows, PKCE, tokens, scopes y roles'],
        ['Validation, authorities and denials', 'Validación, authorities y rechazos'],
        ['Ownership, RLS and transactions', 'Propiedad, RLS y transacciones'],
        ['Lifecycles, tenants and threats', 'Ciclos de vida, tenants y amenazas'],
        ['Review, evidence and capstone', 'Revisión, evidencia y trabajo final'],
    ];
    function homeView() {
        const next = course.lessons.find((l) => !progress[l.slug]?.quiz || !progress[l.slug]?.lab) || course.lessons[0];
        const count = (i) => course.lessons.filter((l) => l.unit === i).length;
        return `<main class="home" id="main"><section class="home-intro"><span class="eyebrow">${t('FROM SIGN-IN TO A PROTECTED ROW', 'DEL INICIO DE SESIÓN A UNA FILA PROTEGIDA')}</span><h1>${t('Identity is<br>the beginning.<br><em>Follow the trust.</em>', 'La identidad es<br>el comienzo.<br><em>Seguí la confianza.</em>')}</h1><p class="home-lead">${t('Understand Microsoft Entra through one Angular, Spring and PostgreSQL application. Trace the evidence. Challenge each permission. Explain every denial.', 'Entendé Microsoft Entra con una sola aplicación de Angular, Spring y PostgreSQL. Seguí la evidencia. Cuestioná cada permiso. Explicá cada rechazo.')}</p><div class="home-actions"><a class="btn primary" href="${link(next)}">${score() ? t('Continue learning', 'Seguí aprendiendo') : t('Start from zero', 'Empezá desde cero')} →</a><a class="btn picture" href="${pictureLink()}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="6" r="2.4"/><circle cx="19" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M7.4 6h9.2M6.2 8.1l4.6 7.8M17.8 8.1l-4.6 7.8"/></svg>${t('Big picture', 'Panorama')}</a><a class="btn" href="${aboutLink()}">${t('What Entra ID does', 'Qué hace Entra ID')}</a><a class="btn" href="${prefix}downloads/entra-labs.zip" download>${t('Get the lab kit', 'Descargá el kit')} ↓</a></div><div class="home-tag"><span>${course.lessons.length} ${t('VISUAL LESSONS', 'LECCIONES VISUALES')}</span><span>${t('50 LOCAL ASSERTIONS', '50 ASERCIONES LOCALES')}</span><span>EN / ES</span></div><div class="hero-art" aria-hidden="true">${hero()}</div></section><section class="home-curriculum" aria-label="${t('Course curriculum', 'Programa del curso')}"><div class="eyebrow"><span>${t('THE LEARNING PATH', 'EL RECORRIDO')}</span><span>00 ${t('to', 'a')} ${pad(course.lessons.at(-1).id)}</span></div>${course.units.map((u, i) => `<a class="unit-row ${i === homeUnit ? 'mobile-active' : ''}" href="${link(course.lessons.find((l) => l.unit === i))}"><span class="num">${pad(i)}</span><span><strong>${e(L(u))}</strong><small>${count(i)} ${count(i) === 1 ? t('lesson', 'lección') : t('lessons', 'lecciones')} · ${t(...UNIT_TOPICS[i])}</small></span><span class="unit-arrow">↗</span></a>`).join('')}<div class="home-mobile-pager"><button class="btn" data-home-prev aria-label="${t('Previous unit', 'Unidad anterior')}">←</button><span>${t('Unit', 'Unidad')} ${homeUnit} / ${course.units.length - 1}</span><button class="btn" data-home-next aria-label="${t('Next unit', 'Siguiente unidad')}">→</button></div><p class="home-footnote">${t('Models work offline. The local application uses fixture tokens.<br>The Entra tenant workbook records separate online evidence.', 'Los modelos funcionan sin conexión. La aplicación local usa tokens de prueba.<br>El recorrido del tenant de Entra registra aparte la evidencia en línea.')}</p></section></main>`;
    }
    let aboutModel = null;

    function aboutView() {
        const A = window.ENTRA_ABOUT;
        aboutModel = EntraVisuals.render('boundaries', 0, {}, lang, theme);
        const P = EntraVisuals.palette(theme);
        const points = A.origin.timeline;
        const stepX = 640 / (points.length - 1);
        const timeline = `<svg viewBox="0 0 720 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('Timeline', 'Línea de tiempo')}"><path d="M40 52H680" stroke="${P.line}" stroke-width="2"/>${points
            .map((p, i) => `<circle cx="${40 + i * stepX}" cy="52" r="7" fill="${i === points.length - 1 ? P.orange : P.green}"/><text x="${40 + i * stepX}" y="28" text-anchor="middle" font-family="Consolas,monospace" font-size="14" fill="${P.ink}">${p.year}</text><text x="${40 + i * stepX}" y="86" text-anchor="middle" font-family="Segoe UI,system-ui,sans-serif" font-size="12" fill="${P.muted}">${e(L(p.label))}</text>`)
            .join('')}</svg>`;
        const section = (title, body, cls = '') => `<section class="about-section ${cls}"><h2>${e(L(title))}</h2>${body}</section>`;
        const paras = (list) => list.map((p) => `<p>${e(L(p))}</p>`).join('');
        const what = section(A.what.title, `${paras(A.what.text)}<div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(A.what.rule))}</div><div class="about-model"><div class="diagram" id="diagram">${aboutModel.svg}</div><p class="model-note">${e(L(A.what.modelNote))}</p></div>`);
        const origin = section(A.origin.title, `${paras(A.origin.text)}<div class="about-timeline">${timeline}</div><ol class="about-milestones">${points.map((p) => `<li><strong>${p.year} · ${e(L(p.label))}</strong>${e(L(p.text))}</li>`).join('')}</ol>`);
        const fits = section(A.fits.title, `<p>${e(L(A.fits.intro))}</p><div class="about-grid">${A.fits.items.map((x) => `<article><h3>${e(L(x.title))}</h3><p>${e(L(x.text))}</p></article>`).join('')}</div>`);
        const misfits = section(A.misfits.title, `<p>${e(L(A.misfits.intro))}</p><div class="about-table" role="table">${A.misfits.headers.map((h) => `<div class="head" role="columnheader">${e(L(h))}</div>`).join('')}${A.misfits.items.map((x) => `<div class="case" role="cell">${e(L(x.title))}</div><div class="why" role="cell">${e(L(x.why))}</div><div class="instead" role="cell" data-label="${e(L(A.misfits.headers[2]))}">${e(L(x.instead))}</div>`).join('')}</div>`);
        const decide = section(A.decide.title, `<ol class="about-questions">${A.decide.questions.map((q) => `<li>${e(L(q))}</li>`).join('')}</ol><p>${e(L(A.decide.closing))}</p><div class="home-actions"><a class="btn primary" href="${link(course.lessons[0])}">${e(L(A.decide.start))} <span aria-hidden="true">→</span></a><a class="btn" href="${homeLink()}">${e(L(A.decide.back))}</a></div>`);
        const sources = section(A.sources.title, `<p>${e(L(A.sources.intro))} ${dateText()}.</p><ul>${A.sources.items.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${e(name)} ↗</a></li>`).join('')}</ul>`, 'about-sources');
        return `<main class="about" id="main"><div class="about-inner"><span class="eyebrow">${e(L(A.eyebrow))}</span><h1>${e(L(A.title))}</h1><p class="about-lead">${e(L(A.lead))}</p>${what}${origin}${fits}${misfits}${decide}${sources}</div></main>`;
    }
    function hero() {
        const p = EntraVisuals.palette(theme);
        return `<svg viewBox="0 0 620 190" xmlns="http://www.w3.org/2000/svg"><path d="M115 95H505" stroke="${p.green}" stroke-width="2"/>${[[95, 'Angular', t('PRESENT', 'PRESENTA')], [310, 'Spring', t('DECIDE', 'DECIDE')], [525, 'PostgreSQL', t('CONSTRAIN', 'RESTRINGE')]].map(([x, title, sub]) => `<rect x="${x - 80}" y="55" width="160" height="80" rx="12" fill="${p.white}" stroke="${p.green}" stroke-width="2"/><text x="${x}" y="88" text-anchor="middle" fill="${p.ink}" font-size="18">${title}</text><text x="${x}" y="113" text-anchor="middle" fill="${p.muted}" font-size="11">${sub}</text>`).join('')}<text x="310" y="170" text-anchor="middle" fill="${p.orange}" font-size="13">${t('One request. Explicit boundaries.', 'Un pedido. Límites explícitos.')}</text></svg>`;
    }
    function mainView() {
        if (reading())
            return documentView();
        return `<div class="workspace">${sidebar()}<main class="lesson-main" id="main" tabindex="-1"><div class="lesson-heading"><div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${lesson.unit} / ${e(L(course.units[lesson.unit]))}</span><h1>${e(L(lesson.title))}</h1><p>${e(L(lesson.intro))}</p></div><span class="lesson-number" aria-hidden="true">${pad(lesson.id)}</span></div><nav class="tabs" role="tablist" aria-label="${t('Lesson sections', 'Secciones de la lección')}">${[
            ['learn', t('Understand', 'Entendé'), '3'],
            ['lab', t('Activity', 'Actividad'), lesson.lab.length],
            ['check', t('Checkpoint', 'Control'), progress[lesson.slug]?.quiz ? '✓' : lesson.quiz.length],
            ['sources', t('Go deeper', 'Profundizá'), '↗'],
        ]
            .map(([a, b, c]) => `<button role="tab" id="tab-${a}" aria-controls="lesson-panel" aria-selected="${currentTab === a}" tabindex="${currentTab === a ? 0 : -1}" data-tab="${a}">${b}<span class="tab-count">${c}</span></button>`)
            .join('')}</nav><div id="lesson-panel" class="${['learn', 'lab'].includes(currentTab) ? 'content-grid ' + (currentTab === 'lab' ? 'lab-grid' : '') : currentTab === 'check' ? 'quiz-wrap' : 'reference-wrap'}" role="tabpanel" aria-labelledby="tab-${currentTab}" data-surface="${surface}">${panelContent()}</div></main></div>`;
    }
    const MODEL_NOTE = () => t('Illustrative model. The activity separates local application tests from Entra tenant evidence.', 'Modelo ilustrativo. La actividad separa las pruebas de la aplicación local de la evidencia del tenant de Entra.');
    function modelTools(data) {
        return `<div class="diagram-tools">${controlsHTML(data.controls)}<button class="btn" data-action="expand" aria-label="${t('Expand the visual model', 'Ampliá el modelo visual')}" title="${t('Expand the visual model', 'Ampliá el modelo visual')}">⤢</button><button class="btn" data-action="reset-model" title="${t('Reset visual model', 'Reiniciá el modelo visual')}">↺</button></div>`;
    }
    function panelContent() {
        if (currentTab === 'check')
            return quizView();
        if (currentTab === 'sources')
            return sourcesView();
        const data = window.EntraVisuals.render(lesson.visual, frame, sim, lang, theme);
        return `<div class="mobile-surface"><button data-surface="visual" class="${surface === 'visual' ? 'active' : ''}">${t('Visual model', 'Modelo visual')}</button><button data-surface="notes" class="${surface === 'notes' ? 'active' : ''}">${currentTab === 'lab' ? t('Activity steps', 'Pasos de la actividad') : t('Explanation', 'Explicación')}</button></div><section class="scene-column" aria-label="${t('Interactive model', 'Modelo interactivo')}"><div class="scene-top"><span><i class="live-dot"></i>${t('ILLUSTRATIVE MODEL', 'MODELO ILUSTRATIVO')}</span><span>${t('Select an object to inspect', 'Seleccioná un objeto para inspeccionar')}</span></div><div class="diagram" id="diagram">${data.svg}</div>${modelTools(data)}<p class="model-note">${MODEL_NOTE()}</p>${currentTab === 'lab' ? `<div class="lab-context">${labContext()} <a href="${prefix}downloads/entra-labs.zip" download>${t('Download kit', 'Descargá el kit')} ↓</a></div>` : ''}</section><section class="inspector" aria-label="${currentTab === 'lab' ? t('Activity', 'Actividad') : t('Explanation', 'Explicación')}">${currentTab === 'lab' ? labView() : frameView()}</section>`;
    }
    // A select option is either a plain value or { value, label: { en, es } }: the value drives the
    // model, the label is what the learner reads.
    const optionValue = (x) => (typeof x === 'object' ? x.value : x);
    const optionLabel = (x) => (typeof x === 'object' ? L(x.label) : x);
    function controlsHTML(controls) {
        return controls
            .map((c) => c.kind === 'button'
            ? `<button class="btn" data-sim-action="${c.action}">${e(c.label)}</button>`
            : c.kind === 'range'
                ? `<label>${e(c.label)} <input type="range" data-sim="${c.key}" min="${c.min}" max="${c.max}" value="${c.value}" aria-label="${e(c.label)}"><output>${c.value}</output></label>`
                : c.kind === 'text'
                    ? `<label>${e(c.label)} <input type="text" data-sim="${c.key}" value="${e(c.value)}" maxlength="40" spellcheck="false"></label>`
                    : `<label>${e(c.label)} <select data-sim="${c.key}">${c.options.map((x) => `<option value="${e(optionValue(x))}" ${optionValue(x) === c.value ? 'selected' : ''}>${e(optionLabel(x))}</option>`).join('')}</select></label>`)
            .join('');
    }
    function frameView() {
        const f = lesson.frames[frame];
        return `<div class="frame-label"><span>${t('SCENE', 'ESCENA')} ${frame + 1} / 3</span><div class="steps">${lesson.frames.map((_, i) => `<button class="step-dot ${i === frame ? 'active' : ''}" data-frame="${i}" aria-label="${t('Scene', 'Escena')} ${i + 1}" aria-pressed="${i === frame}"></button>`).join('')}</div></div><h2>${e(L(f.title))}</h2><p>${e(L(f.text))}</p><div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(f.rule))}</div><div class="experiment-tip"><strong>${t('Try the model.', 'Probá el modelo.')}</strong> ${e(L(lesson.experiment))}</div><div class="scene-navigation"><button class="btn" data-action="prev" ${frame === 0 ? 'disabled' : ''}>← ${t('Back', 'Atrás')}</button><button class="btn primary" data-action="next">${frame === 2 ? t('Open Activity', 'Abrí la actividad') : t('Next scene', 'Siguiente escena')} →</button></div>`;
    }
    function labContext() {
        return lesson.mode === 'local'
            ? t('LOCAL EVIDENCE. Use the extracted <strong>labs</strong> folder. The kit runs real Spring and PostgreSQL with fixture credentials; the fixture never signs in a person. Follow lesson 00 first.', 'EVIDENCIA LOCAL. Usá la carpeta <strong>labs</strong> descomprimida. El kit corre Spring y PostgreSQL reales con credenciales de prueba; el fixture nunca inicia la sesión de una persona. Seguí primero la lección 00.')
            : t('ENTRA / TENANT OR CASE STUDY. Follow TENANT.md with a practice tenant. Without access, use the labeled case study. This page does not verify tenant actions.', 'ENTRA / TENANT O CASO DE ESTUDIO. Seguí TENANT.md con un tenant de práctica. Sin acceso, usá el caso de estudio indicado. Esta página no verifica acciones en el tenant.');
    }
    function commandBlock(step, index) {
        if (!step.command)
            return '';
        return `<details class="command-reference"><summary>${t('Command reference (no memorization needed)', 'Referencia del comando (no hace falta memorizarlo)')}</summary><div class="lab-command"><div class="command-title"><span>TERMINAL / labs</span><button data-copy="${index}">${t('Copy', 'Copiar')} ⧉</button></div><pre><code>${e(step.command)}</code></pre></div></details>`;
    }
    const DONE = () => t('I completed it and can explain it', 'Lo completé y lo puedo explicar');
    function labView() {
        const s = lesson.lab[labStep];
        return `<div class="frame-label"><span>${t('STEP', 'PASO')} ${labStep + 1} / ${lesson.lab.length}</span><span>${lesson.mode === 'local' ? 'LOCAL / FIXTURE' : t('ENTRA / CASE', 'ENTRA / CASO')}</span></div><h2>${e(L(s.title))}</h2><p>${e(L(s.text))}</p>${commandBlock(s, labStep)}<div class="expected"><strong>${t('What to observe', 'Qué observar')}</strong>${e(L(s.expected))}</div>${visorNote()}<div class="scene-navigation"><button class="btn" data-action="prev" ${labStep === 0 ? 'disabled' : ''}>← ${t('Back', 'Atrás')}</button><button class="btn primary" data-action="next">${labStep === lesson.lab.length - 1 ? DONE() : t('Next step', 'Siguiente paso')} →</button></div>`;
    }
    /* Every lesson says what to follow in the live viewer (labs/visor.mjs), opened in lesson 00. */
    function visorNote() { return ''; }
    function quizQuestion(q, qi) {
        const chosen = answers[qi], done = chosen !== undefined, correct = chosen === q.correct;
        return `<div class="quiz-block"><span class="eyebrow">${t('QUESTION', 'PREGUNTA')} ${qi + 1} / ${lesson.quiz.length}</span><h2 class="quiz-question">${e(L(q.question))}</h2>${q.options.map((o, i) => `<button class="answer ${chosen === i ? (correct ? 'selected' : 'incorrect') : ''}" data-answer="${qi}:${i}" aria-pressed="${chosen === i}"><span class="letter">${String.fromCharCode(65 + i)}</span>${e(L(o))}</button>`).join('')}${done ? `<div class="quiz-feedback" aria-live="polite"><strong>${correct ? t('That’s the distinction.', 'Esa es la distinción.') : t('Revisit the boundary.', 'Revisá el límite.')}</strong>${e(L(q.explanation))}</div>` : ''}</div>`;
    }
    function quizCompletion() {
        return `<div class="quiz-completion"><span class="eyebrow">${progress[lesson.slug]?.lab ? '✓' : '○'} ${t('Activity', 'Actividad')} &nbsp; ${progress[lesson.slug]?.quiz ? '✓' : '○'} ${t('Checkpoint', 'Control')}</span>${reading() ? '' : `<button class="btn" data-tab="lab">${t('Return to the activity', 'Volvé a la actividad')}</button>`}${progress[lesson.slug]?.lab && progress[lesson.slug]?.quiz && lesson.id < course.lessons.length - 1 ? `<a class="btn primary" href="${link(course.lessons[lesson.id + 1])}">${t('Next lesson', 'Siguiente lección')} →</a>` : ''}</div>`;
    }
    function quizView() {
        const total = lesson.quiz.length, right = lesson.quiz.filter((q, i) => answers[i] === q.correct).length, answered = Object.keys(answers).length;
        const headline = answered === 0
            ? t('Make a prediction.', 'Hacé una predicción.')
            : right === total
                ? t('Every distinction, named.', 'Todas las distinciones, nombradas.')
                : answered < total
                    ? t('Keep going.', 'Seguí.')
                    : t('Revisit the boundaries you missed.', 'Revisá los límites que fallaste.');
        return `<div class="quiz-layout"><section><span class="eyebrow">${t('RETRIEVE IT. THEN EXPLAIN IT.', 'RECORDALO. DESPUÉS EXPLICALO.')}</span>${lesson.quiz.map(quizQuestion).join('')}${quizCompletion()}</section><aside class="feedback"><p class="quiz-score" aria-live="polite">${right} / ${total}</p><h2>${headline}</h2><p>${t('Choose an answer before looking back at the model. The explanation matters more than the score; a wrong answer can be tried again.', 'Elegí una respuesta antes de volver al modelo. La explicación importa más que el puntaje; una respuesta incorrecta se puede volver a intentar.')}</p><p>${t('Afterward, explain your answers aloud as if you were teaching a teammate.', 'Después, explicá tus respuestas en voz alta como si se las enseñaras a alguien de tu equipo.')}</p>${reading() ? '' : `<button class="btn" data-tab="learn">${t('Revisit the model', 'Volvé al modelo')} ↗</button>`}</aside></div>`;
    }
    function documentView() {
        const data = EntraVisuals.render(lesson.visual, frame, sim, lang, theme);
        const unit = lesson.unit;
        const sections = [
            ['model', t('Model', 'Modelo')],
            ['learn', t('Understand', 'Entendé')],
            ['lab', t('Activity', 'Actividad')],
            ['check', t('Checkpoint', 'Control')],
            ['sources', t('Go deeper', 'Profundizá')],
        ];
        const heading = `<div class="lesson-heading"><div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${unit} / ${e(L(course.units[unit]))}</span><h1>${e(L(lesson.title))}</h1><p>${e(L(lesson.intro))}</p></div><span class="lesson-number" aria-hidden="true">${pad(lesson.id)}</span></div><nav class="doc-nav" aria-label="${t('Lesson sections', 'Secciones de la lección')}">${sections.map(([a, b]) => `<a href="#doc-${a}">${b}</a>`).join('')}</nav>`;
        const model = `<section class="doc-section doc-model" id="doc-model" aria-label="${t('Interactive model', 'Modelo interactivo')}"><div class="scene-top"><span><i class="live-dot"></i>${t('ILLUSTRATIVE MODEL', 'MODELO ILUSTRATIVO')}</span><span>${t('Select an object to inspect', 'Seleccioná un objeto para inspeccionar')}</span></div><div class="diagram" id="diagram">${data.svg}</div>${modelTools(data)}<div class="doc-scenes"><span>${t('SCENE', 'ESCENA')} ${frame + 1} / 3</span>${lesson.frames.map((_, i) => `<button class="step-dot ${i === frame ? 'active' : ''}" data-frame="${i}" aria-label="${t('Scene', 'Escena')} ${i + 1}" aria-pressed="${i === frame}"></button>`).join('')}<span>${e(L(lesson.frames[frame].title))}</span></div><p class="model-note">${MODEL_NOTE()}</p></section>`;
        const learn = `<section class="doc-section" id="doc-learn"><h2 class="doc-title">${t('Understand', 'Entendé')}</h2>${lesson.frames.map((f, i) => `<article class="doc-frame"><span class="eyebrow">${t('SCENE', 'ESCENA')} ${i + 1} / 3</span><h3>${e(L(f.title))}</h3><p>${e(L(f.text))}</p><div class="principle"><span class="eyebrow">${t('TAKE THIS WITH YOU', 'QUEDATE CON ESTO')}</span>${e(L(f.rule))}</div></article>`).join('')}<div class="experiment-tip"><strong>${t('Try the model.', 'Probá el modelo.')}</strong> ${e(L(lesson.experiment))}</div></section>`;
        const lab = `<section class="doc-section" id="doc-lab"><h2 class="doc-title">${t('Activity', 'Actividad')}</h2><div class="lab-context">${labContext()} <a href="${prefix}downloads/entra-labs.zip" download>${t('Download kit', 'Descargá el kit')} ↓</a></div>${visorNote()}${lesson.lab.map((st, i) => `<article class="doc-step"><span class="eyebrow">${t('STEP', 'PASO')} ${i + 1} / ${lesson.lab.length}</span><h3>${e(L(st.title))}</h3><p>${e(L(st.text))}</p>${commandBlock(st, i)}<div class="expected"><strong>${t('What to observe', 'Qué observar')}</strong>${e(L(st.expected))}</div></article>`).join('')}<div class="lab-done">${progress[lesson.slug]?.lab ? `<span class="eyebrow">✓ ${t('Activity declared complete', 'Actividad declarada completa')}</span>` : `<button class="btn primary" data-action="lab-done">${DONE()} ✓</button>`}</div></section>`;
        const check = `<section class="doc-section" id="doc-check"><h2 class="doc-title">${t('Checkpoint', 'Control')}</h2>${quizView()}</section>`;
        const sources = `<section class="doc-section" id="doc-sources"><h2 class="doc-title">${t('Go deeper', 'Profundizá')}</h2><div class="reference-wrap">${sourcesView()}</div></section>`;
        return `<div class="workspace"><main class="lesson-main document" id="main" tabindex="-1">${heading}${model}${learn}${lab}${check}${sources}</main></div>`;
    }
    function sourcesView() {
        const sources = [refs.sources[lesson.source], ...(refs.more[lesson.source] || [])];
        return `<section class="source-card"><span class="eyebrow">${t('PRIMARY REFERENCES', 'FUENTES PRIMARIAS')}</span><h2>${t('Follow the idea to its source.', 'Seguí la idea hasta su fuente.')}</h2><p>${t(`Reviewed on ${dateText()}. The sample pins Angular ${course.angular}, MSAL Browser ${course.msal}, Spring Boot ${course.spring} and PostgreSQL ${course.postgres}.`, `Revisadas el ${dateText()}. El ejemplo fija Angular ${course.angular}, MSAL Browser ${course.msal}, Spring Boot ${course.spring} y PostgreSQL ${course.postgres}.`)}</p>${sources.map(([title, url]) => `<p><a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(title)} ↗</a></p>`).join('')}</section><section class="source-card"><h2>${t('Inspect the implementation.', 'Inspeccioná la implementación.')}</h2><p>${t('The kit contains readable Angular, Spring and SQL source, a local test runner, the tenant workbook and an evidence sheet. Local assertions do not establish tenant policy.', 'El kit trae código legible de Angular, Spring y SQL, un ejecutor de pruebas local, el recorrido del tenant y una planilla de evidencia. Las aserciones locales no establecen la política del tenant.')}</p><p><a href="${prefix}downloads/entra-labs.zip" download>${t('Complete lab kit', 'Kit completo')} ↓</a></p><p><a href="${prefix}downloads/course-notes-${lang}.txt" download>${t('Complete English course notes', 'Apuntes completos en español')} ↓</a></p><button class="btn" data-action="glossary">${t('Visual glossary', 'Glosario visual')} →</button></section><section class="source-card"><h2>${t('Teach it back.', 'Enseñalo vos.')}</h2><p>${t('Record prediction, observation, explanation and limit. Name the principal, recipient and enforcing component at every boundary. Explain the result before naming a command.', 'Anotá predicción, observación, explicación y límite. Nombrá el principal, el destinatario y el componente que hace cumplir la regla en cada límite. Explicá el resultado antes de nombrar un comando.')}</p><a href="${aboutLink()}">${t('What Entra ID does', 'Qué hace Entra ID')} →</a></section>`;
    }
    function render() {
        document.documentElement.lang = lang === 'es' ? 'es-AR' : 'en';
        document.documentElement.dataset.theme = theme;
        document.title = about
            ? L(window.ENTRA_ABOUT.title) + ' · ' + courseName()
            : home
                ? t('Microsoft Entra from scratch. A visual field guide', 'Microsoft Entra desde cero. Una guía visual de campo')
                : L(lesson.title) + ' · ' + courseName();
        const scrolled = window.scrollY;
        $('#app').innerHTML =
            `<a class="skip-link" href="#main">${t('Skip to lesson', 'Ir a la lección')}</a><div class="shell">${header()}${about ? aboutView() : home ? homeView() : mainView()}${footer()}</div><dialog class="dialog" id="dialog"></dialog><div class="sr-only" aria-live="polite" id="announce"></div>`;
        bind();
        // The reading skin scrolls the document; a re-render must not send the reader back to the top.
        if (theme === 'reading' && scrolled)
            window.scrollTo(0, scrolled);
    }
    function updateURL() {
        const u = new URL(location.href);
        u.searchParams.set('lang', lang);
        u.searchParams.set('theme', theme);
        if (lesson) {
            u.searchParams.set('view', currentTab);
            u.searchParams.set('labstep', labStep);
            if (currentTab === 'learn')
                u.searchParams.set('step', frame);
            else
                u.searchParams.delete('step');
        }
        try {
            history.replaceState({}, '', u);
        }
        catch { }
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
        document.querySelectorAll('[data-lang]').forEach((el) => (el.onclick = () => {
            lang = el.dataset.lang;
            save();
            render();
            updateURL();
        }));
        document.querySelectorAll('[data-tab]').forEach((el) => (el.onclick = () => {
            currentTab = el.dataset.tab;
            surface = currentTab === 'lab' ? 'notes' : 'visual';
            updatePanel();
        }));
        document.querySelectorAll('[data-frame]').forEach((el) => (el.onclick = () => {
            frame = +el.dataset.frame;
            sim = {};
            updatePanel();
        }));
        document.querySelectorAll('[data-surface]').forEach((el) => {
            if (el.tagName === 'BUTTON')
                el.onclick = () => {
                    surface = el.dataset.surface;
                    updatePanel();
                };
        });
        document.querySelectorAll('[data-answer]').forEach((el) => (el.onclick = () => {
            const [qi, choice] = el.dataset.answer.split(':').map(Number);
            answers[qi] = choice;
            if (lesson.quiz.every((q, i) => answers[i] === q.correct)) {
                progress[lesson.slug] = { ...progress[lesson.slug], quiz: true };
                save();
            }
            render();
        }));
        document
            .querySelectorAll('[data-action]')
            .forEach((el) => (el.onclick = () => action(el.dataset.action)));
        document.querySelectorAll('[data-sim-action]').forEach((el) => (el.onclick = () => {
            const a = el.dataset.simAction;
            if (a === 'toggle')
                sim.toggle = !sim.toggle;
            if (a === 'append')
                sim.count = Math.min(8, (sim.count || 4) + 1);
            if (a === 'read')
                sim.pos = Math.min(sim.count || 4, (sim.pos || 0) + 1);
            if (a === 'commit')
                sim.commit = sim.pos || 0;
            refreshModel();
        }));
        document.querySelectorAll('[data-sim]').forEach((el) => (el.oninput = () => {
            sim[el.dataset.sim] = el.type === 'range' ? +el.value : el.value;
            const out = el.nextElementSibling;
            if (out?.tagName === 'OUTPUT')
                out.textContent = el.value;
            refreshSVG();
        }));
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
        const v = EntraVisuals.render(lesson.visual, frame, sim, lang, theme);
        $('#diagram').innerHTML = v.svg;
        bindObjects();
    }
    function refreshModel() {
        const focused = document.activeElement?.dataset.simAction;
        const v = EntraVisuals.render(lesson.visual, frame, sim, lang, theme);
        $('#diagram').innerHTML = v.svg;
        bindObjects();
        if (focused)
            document.querySelector(`[data-sim-action="${focused}"]`)?.focus();
    }
    function inspect(key, model = null, area = null) {
        const v = model || aboutModel || EntraVisuals.render(lesson.visual, frame, sim, lang, theme), text = v.details[key];
        if (!text)
            return;
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
        }
        catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            ta.remove();
            toast(ok
                ? t('Copied to clipboard', 'Copiado al portapapeles')
                : t('Select and copy the command text manually.', 'Seleccioná y copiá el comando a mano.'));
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
                }
                else {
                    currentTab = 'lab';
                    surface = 'notes';
                }
            }
            else if (currentTab === 'lab') {
                if (labStep < lesson.lab.length - 1)
                    labStep++;
                else {
                    progress[lesson.slug] = { ...progress[lesson.slug], lab: true };
                    save();
                    currentTab = 'check';
                }
            }
            updatePanel();
        }
        else if (a === 'prev') {
            if (currentTab === 'learn')
                frame = Math.max(0, frame - 1);
            if (currentTab === 'lab')
                labStep = Math.max(0, labStep - 1);
            updatePanel();
        }
        else if (a === 'reset-model') {
            sim = {};
            updatePanel();
        }
        else if (a === 'copy') {
            copyText(lesson.lab[labStep].command);
        }
        else if (a === 'glossary') {
            glossaryIndex = 0;
            glossarySearch = '';
            openGlossary();
        }
        else if (a === 'expand') {
            const v = EntraVisuals.render(lesson.visual, frame, sim, lang, theme);
            dialog(L(lesson.title), '<div class="expanded-model">' + v.svg + '</div><p>' + e(L(lesson.experiment)) + '</p>');
            $('#dialog').classList.add('wide-dialog');
            bindObjects();
        }
        else if (a === 'map')
            openMap();
        else if (a === 'help')
            openHelp();
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
        d.classList.remove('wide-dialog', 'glossary-dialog');
        if (!d.open)
            lastFocus = document.activeElement;
        d.innerHTML = `<div class="dialog-head"><h2>${e(title)}</h2><button class="btn" data-close aria-label="${t('Close', 'Cerrar')}">×</button></div><div class="dialog-body">${body}</div>`;
        d.querySelector('[data-close]').onclick = () => d.close();
        d.onclose = () => lastFocus?.focus();
        d.onclick = (event) => {
            if (event.target === d) {
                const r = d.getBoundingClientRect();
                if (event.clientX < r.left ||
                    event.clientX > r.right ||
                    event.clientY < r.top ||
                    event.clientY > r.bottom)
                    d.close();
            }
        };
        if (!d.open)
            d.showModal();
    }
    function openGlossary() {
        const entries = refs.glossary.filter((g) => g.slice(0, 4).join(' ').toLowerCase().includes(glossarySearch.toLowerCase()));
        glossaryIndex = Math.max(0, Math.min(glossaryIndex, entries.length - 1));
        const g = entries[glossaryIndex], model = g ? EntraVisuals.render(course.lessons[g[4]].visual, 0, refs.glossaryStates[g[0]] || {}, lang, theme) : null;
        dialog(t('Visual glossary', 'Glosario visual'), `<label class="sr-only" for="glossary-search">${t('Search glossary', 'Buscá en el glosario')}</label><input type="search" id="glossary-search" placeholder="${t('Find a concept…', 'Buscá un concepto…')}" value="${e(glossarySearch)}">${g ? `<span class="eyebrow">${glossaryIndex + 1} / ${entries.length}</span><h3 class="glossary-term">${e(g[lang === 'es' ? 1 : 0])}</h3><p>${e(g[lang === 'es' ? 3 : 2])}</p><div class="glossary-art">${model.svg}</div><a href="${link(course.lessons[g[4]])}">${t('See it in lesson', 'Miralo en la lección')} ${pad(course.lessons[g[4]].id)}: ${e(L(course.lessons[g[4]].title))} →</a><div class="dialog-footer"><button class="btn" id="gloss-prev" ${glossaryIndex === 0 ? 'disabled' : ''}>← ${t('Previous', 'Anterior')}</button><button class="btn" id="gloss-next" ${glossaryIndex === entries.length - 1 ? 'disabled' : ''}>${t('Next', 'Siguiente')} →</button></div>` : `<p>${t('No matching concept. Try another term.', 'No hay coincidencias. Probá con otro término.')}</p>`}`);
        $('#dialog').classList.add('glossary-dialog');
        if (model)
            bindObjects(model, $('.glossary-art'));
        const input = $('#glossary-search');
        input.oninput = () => {
            const pos = input.selectionStart;
            glossarySearch = input.value;
            glossaryIndex = 0;
            openGlossary();
            $('#glossary-search').focus();
            try {
                $('#glossary-search').setSelectionRange(pos, pos);
            }
            catch { }
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
        dialog(t('Your learning path', 'Tu recorrido'), `<div class="map-units" role="group" aria-label="${t('Units', 'Unidades')}">${course.units.map((u, i) => `<button class="btn ${i === mapUnit ? 'active' : ''}" data-unit="${i}" aria-label="${e(L(u))}">${i}</button>`).join('')}</div><span class="eyebrow">${t('UNIT', 'UNIDAD')} ${mapUnit}</span><h3 class="glossary-term">${e(L(course.units[mapUnit]))}</h3><nav>${lessonLinks(mapUnit)}</nav><p>${score()} / ${course.lessons.length} ${t('lessons complete. Progress is stored on this browser only.', 'lecciones completas. El avance queda solo en este navegador.')}</p>`);
        document.querySelectorAll('[data-unit]').forEach((el) => (el.onclick = () => {
            mapUnit = +el.dataset.unit;
            openMap();
        }));
    }
    function announce(text) {
        const live = $('#announce');
        if (live)
            live.textContent = text;
    }
    function openHelp() {
        dialog(t('Learn with evidence', 'Aprendé con evidencia'), lang === 'es'
            ? '<p>Cada lección tiene tres escenas, un modelo que se puede manipular, una actividad y tres preguntas. Primero predecí, después observá y al final explicá el límite. Los comandos son referencias desplegables.</p><p>Podés cambiar entre inglés y español cuando quieras sin perder tu lugar. Usá Clásico, Oscuro, Lectura o Proyector. Lectura presenta la lección completa como un documento que se desplaza. Las flechas cambian de escena; Escape cierra las ventanas. En pantallas chicas, alterná entre el modelo y la explicación.</p><p>El avance queda en este navegador y registra tu declaración. El curso no hace pedidos externos. Las pruebas de la aplicación local usan credenciales de prueba. El inicio de sesión real y la política del tenant requieren el recorrido del tenant, aparte.</p><p><a href="' + aboutLink() + '">Leé la orientación</a> o abrí el glosario visual.</p>'
            : '<p>Each lesson has three scenes, a manipulable model, an activity and three questions. Predict first, observe, then explain the limit. Commands are expandable references.</p><p>Switch between English and Spanish at any time; your place stays the same. Use Classic, Dark, Reading or Projector. Reading presents the complete lesson as a scrolling document. Arrow keys change scenes; Escape closes dialogs. On narrow screens, switch between the model and explanation.</p><p>Progress stays in this browser and records your declaration. The course makes no external requests. Local application tests use fixture credentials. Real sign-in and tenant policy require the separate tenant workbook.</p><p><a href="' + aboutLink() + '">Read the overview</a> or open the visual glossary.</p>');
    }

    render();
})();
