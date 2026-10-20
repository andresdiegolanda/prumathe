/* Live viewer of the Git experiments. Asks /api/state every half second and redraws only when a
   repository changed or the reader did something. Everything that comes from the repositories
   (names, messages, file contents) is escaped before it reaches the page. */
(() => {
  'use strict';

  const POLL_MS = 500;
  const NEW_MS = 4000;

  // Lessons the viewer points to: number -> [title EN, title ES]. scripts/check.mjs compares it with
  // the curriculum, so a lesson that changes its title fails the check until this table follows.
  const LESSONS = {"00":["Before you start","Antes de empezar"],"01":["Git and GitHub","Git y GitHub"],"02":["Commits: snapshots with a reason","Commits: instantáneas con un motivo"],"03":["Three places for a change","Tres lugares para un cambio"],"04":["Branches are movable names","Las ramas son nombres que se mueven"],"05":["Merging histories","Merge: unir historias"],"06":["Conflicts are unanswered questions","Los conflictos son preguntas sin responder"],"07":["Remotes and independent copies","Remotos y copias independientes"],"08":["Fetch, integrate, publish","Fetch, integrar, publicar"],"09":["Fork, clone and branch","Fork, clon y rama"],"13":["Same files, different histories","Mismos archivos, historias distintas"],"14":["Undo without losing the story","Deshacer sin perder la historia"],"17":["Tags, releases and deployments","Tags, releases y despliegues"],"18":["History remembers what you remove","La historia recuerda lo que quitás"]};

  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
  };
  const query = new URLSearchParams(location.search);
  let lang = query.get('lang') || store.get('github-visor-lang') || ((navigator.language || '').startsWith('es') ? 'es' : 'en');
  if (lang !== 'es') lang = 'en';
  const local = ['127.0.0.1', 'localhost'].includes(location.hostname);

  let data = null; // the last full state
  let version = 0;
  let status = { ok: false, readAt: 0, reached: false, lostAt: 0 };
  let paused = false;
  let pinnedRun = null; // run chosen by the reader; null follows the newest
  let pinnedRepo = null; // repository chosen by the reader; null follows the activity
  let sel = null; // selected object id
  const seenEvents = new Map(); // event seq -> first time on screen
  const seenCommits = new Map(); // repo:commit -> first time on screen
  let firstLoad = true;
  let hadNew = false;

  const L = (en, es) => (lang === 'es' ? es : en);
  const e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const $ = (s) => document.querySelector(s);
  const app = $('#app');
  const short = (id) => String(id || '').slice(0, 7);
  const fmtTime = (ms) => new Date(ms).toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-GB', { hour12: false });
  const lessonRef = (n) => (LESSONS[n] ? `${L('Lesson', 'Lección')} ${n}, ${L(LESSONS[n][0], LESSONS[n][1])}` : '');

  // ------------------------------------------------------------------ data helpers

  const run = () => (data && data.run) || null;
  const repos = () => (run() ? run().repos : []);
  const repoByName = (name) => repos().find((r) => r.name === name) || null;
  const textOf = (r, blob) => {
    if (!blob) return null;
    const t = r.blobs[blob];
    return t && typeof t === 'object' ? L('(binary file)', '(archivo binario)') : t ?? null;
  };
  const workText = (v) => (v && typeof v === 'object' ? L('(binary file)', '(archivo binario)') : v);
  const shortPath = (arg) => {
    const m = /[\\/]runs[\\/](.*)$/.exec(arg);
    return m ? 'runs/' + m[1].replace(/\\/g, '/') : arg;
  };
  const shownOp = (op) =>
    op.op === 'git'
      ? 'git ' + op.args.map((a) => shortPath(a)).map((a) => (/\s/.test(a) ? "'" + a + "'" : a)).join(' ')
      : `${L('write', 'escribir')} ${op.file}\n${String(op.text || '').replace(/\n$/, '')}`;
  const cmdIn = (repo, args) => `git -C runs/${run().name}/${repo} ${args}`;

  // The repository on screen: the one the reader chose, else the one the next operation touches,
  // else the one that changed last.
  function currentRepo() {
    const rs = repos();
    if (!rs.length) return null;
    if (pinnedRepo && repoByName(pinnedRepo)) return repoByName(pinnedRepo);
    const p = run().progress;
    if (p && p.next && repoByName(p.next.repo)) return repoByName(p.next.repo);
    for (const ev of data.events) if (ev.repo && repoByName(ev.repo)) return repoByName(ev.repo);
    return rs.find((r) => !r.bare) || rs[0];
  }

  // The repositories linked to this one through their remotes, in both directions.
  function component(repo) {
    const rs = repos();
    const out = new Set([repo.name]);
    let grew = true;
    while (grew) {
      grew = false;
      for (const r of rs) {
        const linked = r.links.some((l) => out.has(l[1])) || rs.some((o) => out.has(o.name) && o.links.some((l) => l[1] === r.name));
        if (linked && !out.has(r.name)) {
          out.add(r.name);
          grew = true;
        }
      }
    }
    return rs.filter((r) => out.has(r.name));
  }

  // A remote-tracking reference whose remote is in this run and points somewhere else.
  function staleOf(r) {
    const out = [];
    for (const [name, sha] of r.remotes) {
      const [remote, ...rest] = name.split('/');
      const link = r.links.find((l) => l[0] === remote);
      const target = link && link[1] ? repoByName(link[1]) : null;
      const there = target ? (target.branches.find((b) => b[0] === rest.join('/')) || [])[1] : null;
      if (there && there !== sha) out.push([name, sha, there, target.name]);
    }
    return out;
  }

  // Files of a commit, rebuilt from the changes along its first parents.
  function snapshotOf(r, id) {
    const byId = new Map(r.commits.map((c) => [c.id, c]));
    const chain = [];
    for (let c = byId.get(id); c; c = byId.get(c.parents[0])) chain.unshift(c);
    const files = new Map();
    for (const c of chain) for (const [st, p, blob] of c.changes) st === 'D' ? files.delete(p) : files.set(p, blob);
    return files;
  }

  function markNew() {
    const now = Date.now();
    for (const ev of data.events || []) if (!seenEvents.has(ev.seq)) seenEvents.set(ev.seq, firstLoad ? 0 : now);
    for (const r of repos()) for (const c of r.commits) if (!seenCommits.has(r.name + ':' + c.id)) seenCommits.set(r.name + ':' + c.id, firstLoad ? 0 : now);
    firstLoad = false;
  }
  const isNewEvent = (seq) => Date.now() - (seenEvents.get(seq) || 0) < NEW_MS;
  const isNewCommit = (repo, id) => Date.now() - (seenCommits.get(repo + ':' + id) || 0) < NEW_MS;
  const anyNew = () => [...seenEvents.values(), ...seenCommits.values()].some((t) => Date.now() - t < NEW_MS);

  // ------------------------------------------------------------------ events

  const how = (h) => (h === 'forward' ? L('it advanced', 'avanzó') : h === 'back' ? L('it went back', 'retrocedió') : L('it was rewritten: the old commit is not an ancestor of the new one', 'se reescribió: el commit anterior no es ancestro del nuevo'));

  function eventText(ev) {
    const repo = `<b>${e(ev.repo)}</b>`;
    switch (ev.code) {
      case 'watch':
        return L(`The viewer started reading ${e(ev.run)}: ${ev.repos} repositories.`, `El visor empezó a leer ${e(ev.run)}: ${ev.repos} repositorios.`);
      case 'repoCreated':
        return ev.from ? L(`${repo}: cloned from ${e(ev.from)}.`, `${repo}: clon de ${e(ev.from)}.`) : L(`${repo}: new repository.`, `${repo}: repositorio nuevo.`);
      case 'bareCreated':
        return L(`${repo}: new bare repository, with no working files.`, `${repo}: repositorio desnudo nuevo, sin archivos de trabajo.`);
      case 'repoGone':
        return L(`${repo} is no longer in the run.`, `${repo} ya no está en la corrida.`);
      case 'commit':
        return L(`${repo}: commit ${short(ev.id)} «${e(ev.s)}» on ${e(ev.on || 'HEAD')}, with ${ev.parents.length === 2 ? 'two parents' : ev.parents.length ? 'parent ' + short(ev.parents[0]) : 'no parent'}.`, `${repo}: commit ${short(ev.id)} «${e(ev.s)}» en ${e(ev.on || 'HEAD')}, ${ev.parents.length === 2 ? 'con dos padres' : ev.parents.length ? 'con padre ' + short(ev.parents[0]) : 'sin padre'}.`);
      case 'branchCreated':
        return L(`${repo}: branch ${e(ev.ref)} created at ${short(ev.to)}.`, `${repo}: rama ${e(ev.ref)} creada en ${short(ev.to)}.`);
      case 'branchMoved':
        return ev.bare
          ? L(`${repo} received a push: ${e(ev.ref)} went from ${short(ev.from)} to ${short(ev.to)} (${how(ev.how)}).`, `${repo} recibió un push: ${e(ev.ref)} pasó de ${short(ev.from)} a ${short(ev.to)} (${how(ev.how)}).`)
          : L(`${repo}: ${e(ev.ref)} went from ${short(ev.from)} to ${short(ev.to)} (${how(ev.how)}).`, `${repo}: ${e(ev.ref)} pasó de ${short(ev.from)} a ${short(ev.to)} (${how(ev.how)}).`);
      case 'branchDeleted':
        return L(`${repo}: branch ${e(ev.ref)} deleted.`, `${repo}: se borró la rama ${e(ev.ref)}.`);
      case 'remoteCreated':
        return L(`${repo}: ${e(ev.ref)} now records ${short(ev.to)}.`, `${repo}: ${e(ev.ref)} ahora registra ${short(ev.to)}.`);
      case 'remoteMoved':
        return L(`${repo}: ${e(ev.ref)} went from ${short(ev.from)} to ${short(ev.to)}; the local branches did not move.`, `${repo}: ${e(ev.ref)} pasó de ${short(ev.from)} a ${short(ev.to)}; las ramas locales no se movieron.`);
      case 'remoteDeleted':
        return L(`${repo}: ${e(ev.ref)} deleted.`, `${repo}: se borró ${e(ev.ref)}.`);
      case 'tagCreated':
        return L(`${repo}: ${ev.annotated ? 'annotated' : 'lightweight'} tag ${e(ev.ref)} on ${short(ev.to)}.`, `${repo}: tag ${ev.annotated ? 'anotado' : 'ligero'} ${e(ev.ref)} en ${short(ev.to)}.`);
      case 'headMoved':
        return ev.detached ? L(`${repo}: HEAD detached at ${short(ev.to)}.`, `${repo}: HEAD quedó separado en ${short(ev.to)}.`) : L(`${repo}: HEAD went from ${e(ev.from)} to ${e(ev.to)}; the working files follow the new branch.`, `${repo}: HEAD pasó de ${e(ev.from)} a ${e(ev.to)}; los archivos de trabajo siguen a la rama nueva.`);
      case 'mergeStopped':
        return L(`${repo}: the merge stopped at a conflict in ${e(ev.files.join(', '))}: three versions in the index and markers in the file.`, `${repo}: el merge se detuvo en un conflicto en ${e(ev.files.join(', '))}: tres versiones en el index y marcas en el archivo.`);
      case 'mergeAborted':
        return L(`${repo}: the merge was abandoned.`, `${repo}: se abandonó el merge.`);
      case 'fileCreated':
        return L(`${repo}: ${e(ev.file)} created in the working folder.`, `${repo}: se creó ${e(ev.file)} en la carpeta de trabajo.`);
      case 'fileEdited':
        return L(`${repo}: ${e(ev.file)} changed in the working folder.`, `${repo}: ${e(ev.file)} cambió en la carpeta de trabajo.`);
      case 'fileRemoved':
        return L(`${repo}: ${e(ev.file)} removed from the working folder.`, `${repo}: ${e(ev.file)} se quitó de la carpeta de trabajo.`);
      case 'fileStaged':
        return L(`${repo}: ${e(ev.file)} prepared in the index for the next commit.`, `${repo}: ${e(ev.file)} quedó preparado en el index para el próximo commit.`);
      case 'fileUnstaged':
        return L(`${repo}: ${e(ev.file)} left the index.`, `${repo}: ${e(ev.file)} salió del index.`);
      case 'rejected':
        return L(`${repo}: <span class="mono">${e(shownOp(ev.op))}</span> ended with code ${ev.op.exit}, as the experiment expects.`, `${repo}: <span class="mono">${e(shownOp(ev.op))}</span> terminó con código ${ev.op.exit}, como espera el experimento.`);
      default:
        return e(ev.code);
    }
  }

  // ------------------------------------------------------------------ detail panel

  function detail(id) {
    if (!id || !run()) return null;
    const [kind, repoName, ...rest] = id.split('|');
    const r = repoByName(repoName);
    const gone = { kind: L('GONE', 'YA NO ESTÁ'), title: rest.join(' ') || repoName, what: L('It is no longer in this run.', 'Ya no está en esta corrida.'), why: '', now: [], where: [], cmd: '' };
    if (!r) return gone;
    const branchesAt = (sha) => r.branches.filter((b) => b[1] === sha).map((b) => b[0]);
    if (kind === 'commit') {
      const c = r.commits.find((x) => x.id === rest[0]);
      if (!c) return gone;
      const files = snapshotOf(r, c.id);
      const changed = c.changes.map((x) => `${x[0] === 'A' ? '+' : x[0] === 'D' ? '−' : '~'} ${x[1]}`).join(', ');
      return {
        kind: 'COMMIT',
        title: `${short(c.id)} «${c.s}»`,
        what: L('A snapshot of every tracked file, with a message and a link to its parents. It never changes: a new commit is a new identity.', 'Una instantánea de todos los archivos seguidos, con un mensaje y un enlace a sus padres. No cambia nunca: un commit nuevo es una identidad nueva.'),
        why: L('To return to any recorded state and to explain why the history moved.', 'Para volver a cualquier estado registrado y explicar por qué se movió la historia.'),
        now: [
          c.parents.length === 0 ? L('First commit: it has no parent.', 'Primer commit: no tiene padre.') : c.parents.length === 2 ? L(`Two parents: ${short(c.parents[0])} and ${short(c.parents[1])}. It joins two histories.`, `Dos padres: ${short(c.parents[0])} y ${short(c.parents[1])}. Une dos historias.`) : L(`Parent: ${short(c.parents[0])}.`, `Padre: ${short(c.parents[0])}.`),
          changed ? L(`Changed against its first parent: ${changed}.`, `Cambió respecto de su primer padre: ${changed}.`) : '',
          branchesAt(c.id).length ? L(`Branches here: ${branchesAt(c.id).join(', ')}.`, `Ramas acá: ${branchesAt(c.id).join(', ')}.`) : '',
        ].filter(Boolean),
        files: [...files].map(([p, blob]) => [p, textOf(r, blob)]),
        where: c.parents.length === 2 ? ['02', '05'] : ['02'],
        cmd: cmdIn(r.name, `show --stat ${short(c.id)}`),
      };
    }
    if (kind === 'branch') {
      const b = r.branches.find((x) => x[0] === rest[0]);
      if (!b) return gone;
      const isHead = r.head.ref === 'refs/heads/' + b[0];
      return {
        kind: L('BRANCH', 'RAMA'),
        title: `${b[0]} ${L('in', 'en')} ${r.name}`,
        what: L('A name that points to one commit and moves forward when you commit on it. Creating a branch copies nothing.', 'Un nombre que apunta a un commit y avanza cuando hacés commit sobre él. Crear una rama no copia nada.'),
        why: L('To work on a change without moving the others, and to say which history you are talking about.', 'Para trabajar en un cambio sin mover los demás, y para decir de qué historia hablás.'),
        now: [L(`Points to ${short(b[1])}.`, `Apunta a ${short(b[1])}.`), isHead ? L('HEAD is on this branch: the next commit moves it.', 'HEAD está en esta rama: el próximo commit la mueve.') : '', r.bare ? L('This is a bare repository: its branches move only when it receives a push.', 'Es un repositorio desnudo: sus ramas se mueven solo cuando recibe un push.') : ''].filter(Boolean),
        where: r.bare ? ['07', '08'] : ['04'],
        cmd: cmdIn(r.name, 'log --oneline --graph --decorate --all'),
      };
    }
    if (kind === 'remote') {
      const ref = r.remotes.find((x) => x[0] === rest[0]);
      if (!ref) return gone;
      const stale = staleOf(r).find((x) => x[0] === ref[0]);
      return {
        kind: L('REMOTE-TRACKING REFERENCE', 'REFERENCIA DE SEGUIMIENTO'),
        title: `${ref[0]} ${L('in', 'en')} ${r.name}`,
        what: L('What this copy knows about a branch of the remote, since it last talked to it. It is not a live window: it moves only with fetch, pull or push.', 'Lo que esta copia sabe de una rama del remoto, desde la última vez que habló con él. No es una ventana en vivo: solo se mueve con fetch, pull o push.'),
        why: L('To compare local work with the team’s without connecting, and so that fetch brings news without touching your branches or files.', 'Para comparar el trabajo local con el del equipo sin conectarse, y para que fetch traiga novedades sin tocar tus ramas ni tus archivos.'),
        now: [L(`Points to ${short(ref[1])}.`, `Apunta a ${short(ref[1])}.`), stale ? L(`The branch in ${stale[3]} is already at ${short(stale[2])}: this copy does not know it yet.`, `La rama en ${stale[3]} ya está en ${short(stale[2])}: esta copia todavía no lo sabe.`) : ''].filter(Boolean),
        where: ['07', '08'],
        cmd: cmdIn(r.name, 'log --oneline --decorate --all'),
      };
    }
    if (kind === 'tag') {
      const t = r.tags.find((x) => x[0] === rest[0]);
      if (!t) return gone;
      return {
        kind: 'TAG',
        title: `${t[0]} ${L('in', 'en')} ${r.name}`,
        what: L('A fixed name for one commit. It does not move when the branches advance.', 'Un nombre fijo para un commit. No se mueve cuando avanzan las ramas.'),
        why: L('To name a version you can find again: the one you delivered, released or deployed.', 'Para nombrar una versión que podés volver a encontrar: la que entregaste, publicaste o desplegaste.'),
        now: [L(`Points to ${short(t[1])}.`, `Apunta a ${short(t[1])}.`), t[2] ? L('Annotated: it is an object of its own, with author, date and message.', 'Anotado: es un objeto propio, con autor, fecha y mensaje.') : L('Lightweight: only a name for the commit.', 'Ligero: solo un nombre para el commit.')],
        where: ['17'],
        cmd: cmdIn(r.name, `show --no-patch ${t[0]}`),
      };
    }
    if (kind === 'head') {
      return {
        kind: 'HEAD',
        title: `HEAD ${L('in', 'en')} ${r.name}`,
        what: L('Where you are: usually a branch, sometimes a commit directly (detached). The next commit is recorded there.', 'Dónde estás: casi siempre una rama, a veces un commit directamente (separado). El próximo commit se registra ahí.'),
        why: L('It decides which snapshot the working files show and which branch moves with the next commit.', 'Decide qué instantánea muestran los archivos de trabajo y qué rama se mueve con el próximo commit.'),
        now: [r.head.ref ? L(`On ${r.head.ref.replace('refs/heads/', '')}, at ${short(r.head.sha) || L('no commit yet', 'ningún commit todavía')}.`, `En ${r.head.ref.replace('refs/heads/', '')}, en ${short(r.head.sha) || 'ningún commit todavía'}.`) : L(`Detached at ${short(r.head.sha)}.`, `Separado en ${short(r.head.sha)}.`), r.reflog.length ? L(`Its last moves (reflog): ${r.reflog.slice(0, 4).map((x) => x[1]).join(' · ')}.`, `Sus últimos movimientos (reflog): ${r.reflog.slice(0, 4).map((x) => x[1]).join(' · ')}.`) : ''].filter(Boolean),
        where: ['04', '14'],
        cmd: cmdIn(r.name, 'log -g --oneline -n 5 HEAD'),
      };
    }
    if (kind === 'merge') {
      return {
        kind: 'MERGE_HEAD',
        title: L(`Merge in progress in ${r.name}`, `Merge en curso en ${r.name}`),
        what: L('The commit being merged, while Git waits for someone to resolve the conflicts.', 'El commit que se está uniendo, mientras Git espera que alguien resuelva los conflictos.'),
        why: L('So that the commit that resolves the conflict keeps both parents.', 'Para que el commit que resuelve el conflicto conserve los dos padres.'),
        now: r.merge ? [L(`Merging ${short(r.merge)} into ${r.head.ref ? r.head.ref.replace('refs/heads/', '') : 'HEAD'}.`, `Uniendo ${short(r.merge)} con ${r.head.ref ? r.head.ref.replace('refs/heads/', '') : 'HEAD'}.`)] : [L('No merge in progress now.', 'Ahora no hay un merge en curso.')],
        where: ['06'],
        cmd: cmdIn(r.name, 'status'),
      };
    }
    if (kind === 'place') {
      const [path, where] = rest;
      const f = r.files.find((x) => x.path === path);
      if (!f) return gone;
      const conflict = f.index.some((x) => x.stage > 0);
      const texts = { head: textOf(r, f.head), index: conflict ? null : textOf(r, (f.index[0] || {}).blob), work: workText(f.work) };
      const kinds = { head: 'HEAD', index: 'INDEX', work: L('WORKING FILE', 'ARCHIVO DE TRABAJO') };
      const whats = {
        head: L('The file as the last commit recorded it.', 'El archivo como lo registró el último commit.'),
        index: conflict ? L('The preparation area: what goes into the next commit. During a merge with a conflict it keeps three versions of the file: the common base (1), ours (2) and theirs (3).', 'El área de preparación: lo que va a entrar en el próximo commit. Durante un merge con conflicto guarda tres versiones del archivo: la base común (1), la nuestra (2) y la suya (3).') : L('The preparation area: what goes into the next commit.', 'El área de preparación: lo que va a entrar en el próximo commit.'),
        work: L('The file in the folder, as you edit it.', 'El archivo en la carpeta, como lo editás.'),
      };
      const now = [];
      if (where === 'index' && conflict) now.push(L(`Three versions: ${f.index.map((x) => (textOf(r, x.blob) || '').trim().split('\n').pop()).join(', ')}. The merge does not end until the file has a single prepared version again.`, `Tres versiones: ${f.index.map((x) => (textOf(r, x.blob) || '').trim().split('\n').pop()).join(', ')}. El merge no termina hasta que el archivo vuelva a tener una sola versión preparada.`));
      else if (texts[where] == null) now.push(L('The file is not in this place.', 'El archivo no está en este lugar.'));
      else {
        if (where !== 'head' && texts.head !== texts[where]) now.push(L('Different from HEAD.', 'Distinto de HEAD.'));
        if (where === 'work' && !conflict && texts.index !== texts.work) now.push(L('Different from the index: this change is not prepared.', 'Distinto del index: este cambio no está preparado.'));
        if (!now.length) now.push(L('Same as in the other places.', 'Igual que en los otros lugares.'));
      }
      return {
        kind: kinds[where],
        title: `${path} ${L('in', 'en')} ${where === 'work' ? L('the folder', 'la carpeta') : where === 'index' ? L('the index', 'el index') : 'HEAD'}`,
        what: whats[where],
        why: L('Editing, preparing and recording are separate decisions: each place can hold a different version.', 'Editar, preparar y registrar son decisiones separadas: cada lugar puede tener una versión distinta.'),
        now,
        where: conflict ? ['03', '06'] : ['03'],
        cmd: cmdIn(r.name, where === 'index' ? 'ls-files --stage' : where === 'head' ? `show HEAD:${path}` : 'diff'),
      };
    }
    if (kind === 'repo') {
      return {
        kind: r.bare ? L('BARE REPOSITORY', 'REPOSITORIO DESNUDO') : L('REPOSITORY', 'REPOSITORIO'),
        title: r.name,
        what: r.bare ? L('A repository with history and branches but no working files: what a server keeps. Here it plays the remote.', 'Un repositorio con historia y ramas pero sin archivos de trabajo: lo que guarda un servidor. Acá hace de remoto.') : L('A working folder with its own history in .git: commits, branches, the index and its remotes.', 'Una carpeta de trabajo con su propia historia en .git: commits, ramas, el index y sus remotos.'),
        why: L('Each copy knows only what it recorded or fetched. Name the copy before saying what is true.', 'Cada copia sabe solo lo que registró o trajo. Nombrá la copia antes de decir qué es cierto.'),
        now: [L(`${r.commits.length} commits, ${r.branches.length} branches${r.links.length ? ', remotes: ' + r.links.map((l) => l[0] + ' → ' + (l[1] || '?')).join(', ') : ', no remotes'}.`, `${r.commits.length} commits, ${r.branches.length} ramas${r.links.length ? ', remotos: ' + r.links.map((l) => l[0] + ' → ' + (l[1] || '?')).join(', ') : ', sin remotos'}.`)],
        where: r.bare ? ['07', '09'] : ['01'],
        cmd: cmdIn(r.name, r.bare ? 'log --oneline --all' : 'remote -v'),
      };
    }
    return null;
  }

  // ------------------------------------------------------------------ rendering

  const MARK = '<svg width="28" height="28" viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" rx="2" fill="#f6f5ed"/><path d="M5.5 15.2V6.4C8.1 6.4 10.5 7.8 10.5 10.2" fill="none" stroke="#21664e" stroke-width="2.6" stroke-linejoin="round"/><path d="M5.5 0.8C4 2.4 4.1 4 5.5 5.3C6.9 4 7 2.4 5.5 0.8Z" fill="#d77936"/></svg>';

  const expLabel = (list) => (!list || !list.length ? '?' : list.length > 3 ? L(`all ${list.length} experiments`, `los ${list.length} experimentos`) : list.join(', '));
  const runStatus = (s, p) =>
    s === 'paused' ? (p ? L(`paused, operation ${p.done + 1}`, `en pausa, operación ${p.done + 1}`) : L('paused', 'en pausa')) : s === 'running' ? L('running', 'corriendo') : s === 'done' ? L('finished', 'terminada') : s === 'stopped' ? L('interrupted', 'interrumpida') : L('no progress recorded', 'sin progreso registrado');

  function statusInfo() {
    if (!status.reached) return { cls: 'down', text: status.lostAt ? L(`The viewer stopped answering at ${fmtTime(status.lostAt)}. Is the terminal with node lab.mjs visor still open?`, `El visor dejó de responder a las ${fmtTime(status.lostAt)}. ¿Sigue abierta la terminal de node lab.mjs visor?`) : L('Connecting…', 'Conectando…') };
    if (paused) return { cls: 'paused', text: L('Viewer paused', 'Visor en pausa') };
    const rn = run();
    if (!rn) return { cls: 'idle', text: L('No runs yet', 'Todavía no hay corridas') };
    return { cls: rn.status === 'paused' ? 'paused' : rn.status === 'running' ? '' : 'idle', text: `runs/${rn.name} · ${expLabel(rn.experiments)} · ${runStatus(rn.status, rn.progress)} · ${L('read', 'leído')} ${fmtTime(status.readAt)}` };
  }

  function header() {
    const { cls, text } = statusInfo();
    return `<header class="top"><div class="brand">${MARK}<div><span class="eyebrow green">${L('LIVE VIEWER', 'VISOR EN VIVO')}</span><strong>${L('GitHub from scratch', 'GitHub desde cero')}</strong></div></div><div class="controls"><span class="status" id="status"><span class="dot ${cls}"></span><span>${e(text)}</span></span><button data-act="pause" aria-pressed="${paused}">${paused ? L('Resume', 'Seguir') : L('Pause', 'Pausar')}</button><span class="langs"><button data-act="en" aria-pressed="${lang === 'en'}">EN</button><button data-act="es" aria-pressed="${lang === 'es'}">ES</button></span></div></header>`;
  }

  function resultText(op) {
    if (op.exit == null) return { cls: '', text: L('File written.', 'Archivo escrito.') };
    if (!op.exit) return { cls: '', text: L('Exit code 0.', 'Código 0.') };
    if (!op.expected) return { cls: 'reject', text: L(`Exit code ${op.exit}: it failed.`, `Código ${op.exit}: falló.`) };
    const why = op.op === 'git' && op.args[0] === 'merge' ? L('the merge stopped at a conflict', 'el merge se detuvo en un conflicto') : op.op === 'git' && op.args[0] === 'push' ? L('the remote rejected the push', 'el remoto rechazó el push') : L('a rejection the experiment expects', 'un rechazo que el experimento espera');
    return { cls: 'reject', text: L(`Exit code ${op.exit}, expected: ${why}.`, `Código ${op.exit}, esperado: ${why}.`) };
  }

  function band() {
    const rn = run();
    const p = rn && rn.progress;
    if (!p) return '';
    let next = '';
    if (rn.status === 'stopped') next = `<div class="last"><span class="eyebrow">${L('INTERRUPTED', 'INTERRUMPIDA')}</span><p>${L('The helper of this run is no longer running: it stopped before finishing. What you see is what it left.', 'El asistente de esta corrida ya no está corriendo: se cortó antes de terminar. Lo que ves es lo que dejó.')}</p></div>`;
    else if (p.next) next = `<div class="op"><span class="eyebrow">${L('NEXT OPERATION', 'PRÓXIMA OPERACIÓN')} · ${e(p.next.repo)}</span><code>${e(shownOp(p.next))}</code><p>${L('Predict what changes, then press Enter in the terminal.', 'Predecí qué cambia y apretá Enter en la terminal.')}</p></div>`;
    else if (rn.status !== 'done' && !p.step) next = `<div class="last"><span class="eyebrow">${L('NO PAUSES', 'SIN PAUSAS')}</span><p>${L('To stop before each operation, run the experiment with --step:', 'Para frenar antes de cada operación, corré el experimento con --step:')}</p><code>node lab.mjs ${e(p.current || 'staging')} --step</code></div>`;
    let last = '';
    if (p.last) {
      const res = resultText(p.last);
      last = `<div class="last"><span class="eyebrow">${rn.status === 'done' ? L('RUN FINISHED · LAST OPERATION', 'CORRIDA TERMINADA · ÚLTIMA OPERACIÓN') : L('LAST OPERATION', 'ÚLTIMA OPERACIÓN')} · ${e(p.last.repo)}</span><code>${e(shownOp(p.last))}</code><span class="result ${res.cls}">${e(res.text)}</span></div>`;
    }
    return next || last ? `<section class="band">${next}${last}</section>` : '';
  }

  function nav(cur) {
    const rn = run();
    const following = !pinnedRun && !pinnedRepo;
    let html = `<nav class="nav" aria-label="${L('Runs and repositories', 'Corridas y repositorios')}"><button class="follow ${following ? 'on' : ''}" data-act="follow" aria-pressed="${following}">${following ? '● ' : ''}${L('Follow the activity', 'Seguir la actividad')}</button><span class="eyebrow navhead">${L('RUNS', 'CORRIDAS')}</span>`;
    for (const r of data.runs || []) html += `<button class="navitem ${rn && r.name === rn.name ? 'current' : ''}" data-run="${e(r.name)}"><strong>${e(r.name)}</strong><small>${e(expLabel(r.experiments))} · ${e(runStatus(r.status))}</small></button>`;
    if (rn && rn.repos.length) {
      html += `<span class="eyebrow navhead">${L('REPOSITORIES', 'REPOSITORIOS')}</span>`;
      for (const r of rn.repos) html += `<button class="navitem sub ${cur && r.name === cur.name ? 'current' : ''}" data-repo="${e(r.name)}"><strong>${e(r.name)}</strong><small>${r.bare ? L('bare', 'desnudo') + ' · ' : ''}${r.head.ref ? e(r.head.ref.replace('refs/heads/', '')) + ' ' : ''}${short(r.head.sha) || L('no commits', 'sin commits')}${r.merge ? ' · ' + L('merge in progress', 'merge en curso') : ''}</small></button>`;
    }
    return html + '</nav>';
  }

  function refLines(r) {
    const stale = staleOf(r);
    const lines = r.branches.map((b) => `<span>${e(b[0])} <b>${short(b[1])}</b></span>`).concat(r.remotes.map((x) => `<span class="${stale.some((s) => s[0] === x[0]) ? 'stale' : ''}">${e(x[0])} <b>${short(x[1])}</b></span>`));
    return `<span class="reflines">${lines.join('') || `<span class="muted">${L('no branches yet', 'sin ramas todavía')}</span>`}</span>`;
  }

  function repoCard(r, cur) {
    const stale = staleOf(r);
    return `<button class="repo ${r.bare ? 'bare' : ''} ${cur && r.name === cur.name ? 'current' : ''} ${sel === 'repo|' + r.name ? 'selected' : ''}" data-repo="${e(r.name)}" data-sel="repo|${e(r.name)}"><strong>${e(r.name)}</strong>${refLines(r)}${r.bare ? `<small class="muted">${L('bare repository: no working files', 'repositorio desnudo: sin archivos de trabajo')}</small>` : ''}${stale.length ? `<span class="chips">${stale.map((s) => `<span class="chip warn">${e(s[0])} ${L('is stale: the remote is at', 'vieja: el remoto está en')} ${short(s[2])}</span>`).join('')}</span>` : ''}</button>`;
  }

  const arrow = (label, toRight) => `<div class="arrow"><svg viewBox="0 0 64 16" aria-hidden="true">${toRight ? '<path d="M2 8H56" stroke="#3f7099" stroke-width="2"/><path d="M56 3L63 8L56 13Z" fill="#3f7099"/>' : '<path d="M62 8H8" stroke="#3f7099" stroke-width="2"/><path d="M8 3L1 8L8 13Z" fill="#3f7099"/>'}</svg>${e(label)}</div>`;

  // The repositories linked to the current one. A remote with two clients is drawn between them.
  function topology(cur) {
    const group = component(cur);
    if (group.length < 2) return '';
    const bares = group.filter((r) => r.bare);
    const clients = group.filter((r) => !r.bare);
    let inner;
    if (bares.length === 1 && clients.length <= 2 && clients.every((c) => c.links.length === 1 && c.links[0][1] === bares[0].name)) {
      const [a, b] = clients;
      inner = repoCard(a, cur) + arrow(a.links[0][0], true) + repoCard(bares[0], cur) + (b ? arrow(b.links[0][0], false) + repoCard(b, cur) : '');
    } else {
      inner = group.map((r) => repoCard(r, cur)).join('') + `<span class="links-line">${group.filter((r) => r.links.length).map((r) => `${e(r.name)}: ${r.links.map((l) => e(l[0]) + ' → ' + e(l[1] || '?')).join(', ')}`).join(' · ')}</span>`;
    }
    return `<div class="box"><div class="box-head"><span class="eyebrow">${L('LINKED REPOSITORIES', 'REPOSITORIOS VINCULADOS')} · ${group.length}</span><span class="legend"><span><span class="chip">main</span> ${L('branch', 'rama')}</span><span><span class="chip remote">origin/main</span> ${L('tracking', 'seguimiento')}</span><span><span class="chip warn">${L('stale', 'vieja')}</span> ${L('differs from the remote', 'no coincide con el remoto')}</span></span></div><div class="topo">${inner}</div></div>`;
  }

  // Lanes: each commit takes the lane that was waiting for it; its first parent continues the lane.
  function layout(commits) {
    const lanes = [];
    const pos = new Map();
    commits.forEach((c, row) => {
      let lane = lanes.indexOf(c.id);
      if (lane < 0) lane = lanes.indexOf(null);
      if (lane < 0) lane = lanes.length;
      for (let i = 0; i < lanes.length; i++) if (i !== lane && lanes[i] === c.id) lanes[i] = null;
      pos.set(c.id, { row, lane });
      lanes[lane] = c.parents[0] || null;
      for (const p of c.parents.slice(1)) {
        if (lanes.includes(p)) continue;
        let free = lanes.indexOf(null);
        if (free < 0) free = lanes.length;
        lanes[free] = p;
      }
    });
    return { pos, width: Math.max(1, ...[...pos.values()].map((p) => p.lane + 1)) };
  }

  function graph(r) {
    if (!r.commits.length) return `<p class="muted">${L('No commits yet.', 'Todavía no hay commits.')}</p>`;
    const ROW = 40;
    const X = (lane) => 16 + lane * 24;
    const Y = (row) => ROW / 2 + row * ROW;
    const { pos, width } = layout(r.commits);
    const w = X(width - 1) + 16;
    const h = r.commits.length * ROW;
    let svg = `<svg class="graph" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><marker id="tip" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#7f978c"/></marker></defs>`;
    for (const c of r.commits) {
      const a = pos.get(c.id);
      for (const p of c.parents) {
        const b = pos.get(p);
        if (!b) {
          svg += `<path class="edge" marker-end="url(#tip)" d="M${X(a.lane)} ${Y(a.row) + 9}V${Y(a.row) + ROW / 2}"/>`;
          continue;
        }
        const x1 = X(a.lane), y1 = Y(a.row) + 9, x2 = X(b.lane), y2 = Y(b.row) - 11;
        svg += x1 === x2 ? `<path class="edge" marker-end="url(#tip)" d="M${x1} ${y1}V${y2}"/>` : `<path class="edge" marker-end="url(#tip)" d="M${x1} ${y1}C${x1} ${y1 + ROW * 0.6},${x2} ${y2 - ROW * 0.6},${x2} ${y2}"/>`;
      }
    }
    for (const c of r.commits) {
      const a = pos.get(c.id);
      svg += `<circle class="node ${c.id === r.head.sha ? 'head' : ''} ${isNewCommit(r.name, c.id) ? 'fresh' : ''}" cx="${X(a.lane)}" cy="${Y(a.row)}" r="8"/>`;
    }
    svg += '</svg>';
    const headBranch = r.head.ref ? r.head.ref.replace('refs/heads/', '') : null;
    const rows = r.commits
      .map((c) => {
        const chips = [];
        if (c.id === r.head.sha) chips.push(`<button class="chip head" data-sel="head|${e(r.name)}">${headBranch ? 'HEAD → ' + e(headBranch) : L('HEAD (detached)', 'HEAD (separado)')}</button>`);
        for (const b of r.branches) if (b[1] === c.id && b[0] !== headBranch) chips.push(`<button class="chip ${sel === 'branch|' + r.name + '|' + b[0] ? 'selected' : ''}" data-sel="branch|${e(r.name)}|${e(b[0])}">${e(b[0])}</button>`);
        if (headBranch && c.id === r.head.sha && r.branches.some((b) => b[0] === headBranch)) chips.splice(1, 0, `<button class="chip ${sel === 'branch|' + r.name + '|' + headBranch ? 'selected' : ''}" data-sel="branch|${e(r.name)}|${e(headBranch)}">${e(headBranch)}</button>`);
        for (const x of r.remotes) if (x[1] === c.id) chips.push(`<button class="chip remote ${sel === 'remote|' + r.name + '|' + x[0] ? 'selected' : ''}" data-sel="remote|${e(r.name)}|${e(x[0])}">${e(x[0])}</button>`);
        for (const t of r.tags) if (t[1] === c.id) chips.push(`<button class="chip tag ${sel === 'tag|' + r.name + '|' + t[0] ? 'selected' : ''}" data-sel="tag|${e(r.name)}|${e(t[0])}">${e(t[0])}</button>`);
        if (r.merge === c.id) chips.push(`<button class="chip merge" data-sel="merge|${e(r.name)}">MERGE_HEAD</button>`);
        const files = [...snapshotOf(r, c.id)].map(([p, blob]) => `${p}: ${String(textOf(r, blob) || '').trim().split('\n').pop()}`).join('\n');
        return `<div class="crow"><button class="cid ${isNewCommit(r.name, c.id) ? 'fresh' : ''} ${sel === 'commit|' + r.name + '|' + c.id ? 'selected' : ''}" data-sel="commit|${e(r.name)}|${e(c.id)}" title="${e(c.s + '\n' + files)}">${short(c.id)}</button>${chips.length ? `<span class="chips">${chips.join('')}</span>` : ''}<span class="msg">${e(c.s)}</span></div>`;
      })
      .join('');
    return `<div class="graph-wrap">${svg}<div class="rows">${rows}</div></div>${r.truncated ? `<p class="muted">${L('Only the 60 newest commits.', 'Solo los 60 commits más nuevos.')}</p>` : ''}`;
  }

  function places(r) {
    if (r.bare) return `<p class="muted">${L('A bare repository has no index and no working files: only history and branches.', 'Un repositorio desnudo no tiene index ni archivos de trabajo: solo historia y ramas.')}</p>`;
    if (!r.files.length) return `<p class="muted">${L('No files yet.', 'Todavía no hay archivos.')}</p>`;
    const where = { head: L('HEAD (LAST COMMIT)', 'HEAD (ÚLTIMO COMMIT)'), index: L('INDEX (NEXT COMMIT)', 'INDEX (PRÓXIMO COMMIT)'), work: L('WORKING FILE', 'ARCHIVO (DE TRABAJO)') };
    let html = `<div class="places"><span></span><span class="h">${where.head}</span><span class="h">${where.index}</span><span class="h">${where.work}</span>`;
    const none = L('not here', 'no está');
    for (const f of r.files) {
      const head = textOf(r, f.head);
      const conflict = f.index.some((x) => x.stage > 0);
      const idx = conflict ? null : textOf(r, (f.index[0] || {}).blob);
      const work = workText(f.work);
      const id = (w) => `place|${e(r.name)}|${e(f.path)}|${w}`;
      const cell = (w, text, cls) => `<button class="cell ${text == null ? 'none' : cls} ${sel === 'place|' + r.name + '|' + f.path + '|' + w ? 'selected' : ''}" data-sel="${id(w)}"><span class="where">${where[w]}</span>${text == null ? none : e(text.replace(/\n$/, ''))}</button>`;
      html += `<span class="f">${e(f.path)}</span>`;
      html += cell('head', head, '');
      if (conflict) {
        const names = { 1: L('1 BASE', '1 BASE'), 2: L('2 OURS', '2 NUESTRA'), 3: L('3 THEIRS', '3 SUYA') };
        html += `<button class="cell conf ${sel === 'place|' + r.name + '|' + f.path + '|index' ? 'selected' : ''}" data-sel="${id('index')}"><span class="where">${where.index}</span><span class="stages">${f.index.map((x) => `<span class="stage"><b>${names[x.stage] || x.stage}</b><span>${e(String(textOf(r, x.blob) || '').trim().split('\n').pop())}</span></span>`).join('')}</span></button>`;
      } else html += cell('index', idx, idx !== head ? 'diff' : '');
      html += cell('work', work, work !== (conflict ? null : idx) ? 'diff' : '');
    }
    return html + '</div>';
  }

  function repoBox(r) {
    const conflicts = r.files.filter((f) => f.index.some((x) => x.stage > 0)).length;
    const dirty = !r.bare && r.files.some((f) => textOf(r, f.head) !== (f.index.some((x) => x.stage > 0) ? null : textOf(r, (f.index[0] || {}).blob)) || workText(f.work) !== textOf(r, (f.index[0] || {}).blob));
    const chips = [];
    if (r.head.ref) chips.push(`<button class="chip head" data-sel="head|${e(r.name)}">HEAD → ${e(r.head.ref.replace('refs/heads/', ''))}</button>`);
    else if (r.head.sha) chips.push(`<button class="chip head" data-sel="head|${e(r.name)}">${L('HEAD detached at', 'HEAD separado en')} ${short(r.head.sha)}</button>`);
    if (r.bare) chips.push(`<span class="chip">${L('bare', 'desnudo')}</span>`);
    if (r.merge) chips.push(`<button class="chip merge" data-sel="merge|${e(r.name)}">${L('merge in progress', 'merge en curso')} (MERGE_HEAD ${short(r.merge)})</button>`);
    if (r.rebase) chips.push(`<span class="chip merge">${L('rebase in progress', 'rebase en curso')}</span>`);
    if (conflicts) chips.push(`<span class="chip bad">${conflicts} ${L(conflicts === 1 ? 'file in conflict' : 'files in conflict', conflicts === 1 ? 'archivo en conflicto' : 'archivos en conflicto')}</span>`);
    else if (!r.bare) chips.push(dirty ? `<span class="chip warn">${L('changes not recorded', 'cambios sin registrar')}</span>` : `<span class="chip ok">${L('nothing unrecorded', 'nada sin registrar')}</span>`);
    return `<div class="box"><div class="box-head"><button class="title title-btn" data-sel="repo|${e(r.name)}">${e(r.name)}</button><span class="chips">${chips.join('')}</span></div><span class="eyebrow">${L('HISTORY · ARROWS POINT TO THE PARENT', 'HISTORIA · LAS FLECHAS APUNTAN AL PADRE')}</span>${graph(r)}<span class="eyebrow">${L('THE THREE PLACES', 'LOS TRES LUGARES')}</span>${places(r)}</div>`;
  }

  function feed() {
    const evs = (data.events || []).slice(0, 14);
    return `<div class="feed"><span class="eyebrow">${L('WHAT HAPPENED', 'LO QUE PASÓ')}</span>${evs.map((ev) => `<div class="ev ${isNewEvent(ev.seq) ? 'fresh' : ''}"><span class="mono">${fmtTime(ev.at)}</span><span>${eventText(ev)}</span></div>`).join('') || `<p class="muted">${L('Nothing yet.', 'Nada todavía.')}</p>`}</div>`;
  }

  function aside() {
    const d = detail(sel);
    if (!d) return `<aside class="side"><div class="hintbox">${L('Select a commit, a branch, HEAD, a file in one of its three places or a repository to see what it is, what it is for and what it shows now.', 'Elegí un commit, una rama, HEAD, un archivo en uno de sus tres lugares o un repositorio para ver qué es, para qué sirve y qué muestra ahora.')}</div></aside>`;
    const files = d.files && d.files.length ? `<div class="block"><span class="eyebrow">${L('FILES IN THIS COMMIT', 'ARCHIVOS EN ESTE COMMIT')}</span><div class="snap">${d.files.map(([p, t]) => `<span class="snap-name">${e(p)}</span><span class="cell">${e(String(t ?? '').replace(/\n$/, ''))}</span>`).join('')}</div></div>` : '';
    const where = d.where && d.where.length ? `<div class="block"><span class="eyebrow">${L('WHERE IT IS SEEN', 'DÓNDE SE VE')}</span><p>${d.where.map((n) => e(lessonRef(n))).join('. ')}.</p></div>` : '';
    return `<aside class="side"><div class="detail"><div class="detail-head"><div><span class="eyebrow">${e(d.kind)}</span><h2>${e(d.title)}</h2></div><button class="close" data-act="close" aria-label="${L('Close', 'Cerrar')}">×</button></div><div class="block"><span class="eyebrow">${L('WHAT IT IS', 'QUÉ ES')}</span><p>${e(d.what)}</p></div>${d.why ? `<div class="block"><span class="eyebrow">${L('WHAT IT IS FOR', 'PARA QUÉ SIRVE')}</span><p>${e(d.why)}</p></div>` : ''}${d.now.length ? `<div class="block now"><span class="eyebrow">${L('WHAT IT SHOWS NOW', 'QUÉ MUESTRA AHORA')}</span>${d.now.map((x) => `<p>${e(x)}</p>`).join('')}</div>` : ''}${files}${where}${d.cmd ? `<details class="cmd"><summary>${L('See it in the terminal (from labs)', 'Verlo en la terminal (desde labs)')}</summary><code>${e(d.cmd)}</code></details>` : ''}</div></aside>`;
  }

  function footer() {
    return `<footer class="foot">${L('The viewer reads the repositories under labs/runs with Git commands that only query, without taking the index lock: it writes nothing there or anywhere else. It does not see GitHub: the online activities do not appear here.', 'El visor lee los repositorios de labs/runs con comandos de Git que solo consultan, sin tomar el lock del index: no escribe en ellos ni en ningún otro lado. No ve GitHub: las actividades en línea no aparecen acá.')}</footer>`;
  }

  function waitScreen(title, text, code) {
    return `<div class="wait"><h1>${e(title)}</h1><p>${e(text)}</p>${code ? `<code>${e(code)}</code>` : ''}</div>`;
  }

  let rendering = false;
  let queued = false;

  function render() {
    if (rendering) {
      queued = true;
      return;
    }
    rendering = true;
    try {
      draw();
    } finally {
      rendering = false;
    }
    if (queued) {
      queued = false;
      requestAnimationFrame(render);
    }
  }

  function draw() {
    document.documentElement.lang = lang;
    document.title = L('Live viewer · GitHub from scratch', 'Visor en vivo · GitHub desde cero');
    if (!local) {
      app.innerHTML = header() + waitScreen(L('This viewer runs on your computer', 'Este visor corre en tu computadora'), L('Start it from the labs folder of the kit and open http://127.0.0.1:18092:', 'Levantalo desde la carpeta labs del kit y abrí http://127.0.0.1:18092:'), 'node lab.mjs visor') + footer();
      return;
    }
    if (!data || !data.runs) {
      app.innerHTML = header() + waitScreen(L('Waiting for the viewer', 'Esperando el visor'), L('This page fills in by itself when node lab.mjs visor answers.', 'Esta página se completa sola cuando responde node lab.mjs visor.'), '') + footer();
      return;
    }
    if (!run()) {
      app.innerHTML = header() + waitScreen(L('Waiting for the first experiment', 'Esperando el primer experimento'), L('In another terminal, from labs, run an experiment; add --step to stop before each operation:', 'En otra terminal, desde labs, corré un experimento; agregá --step para frenar antes de cada operación:'), 'node lab.mjs setup --step') + footer();
      return;
    }
    const focused = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.sel || document.activeElement.dataset.repo || document.activeElement.dataset.run || document.activeElement.dataset.act : null;
    const cur = currentRepo();
    app.innerHTML = header() + band() + `<div class="body">${nav(cur)}<main class="main">${cur ? topology(cur) + repoBox(cur) : ''}${feed()}</main>${aside()}</div>` + footer();
    if (focused) {
      const again = app.querySelector(`[data-sel="${CSS.escape(focused)}"], [data-repo="${CSS.escape(focused)}"], [data-run="${CSS.escape(focused)}"], [data-act="${CSS.escape(focused)}"]`);
      if (again) again.focus({ preventScroll: true });
    }
  }

  function renderStatus() {
    const s = $('#status');
    if (!s) return render();
    const { cls, text } = statusInfo();
    s.firstChild.className = 'dot ' + cls;
    s.lastChild.textContent = text;
  }

  // ------------------------------------------------------------------ input

  app.addEventListener('click', (ev) => {
    if (rendering) return;
    const el = ev.target.closest('[data-act], [data-run], [data-sel], [data-repo]');
    if (!el) return;
    if (el.dataset.act) {
      const a = el.dataset.act;
      if (a === 'pause') paused = !paused;
      else if (a === 'en' || a === 'es') {
        lang = a;
        store.set('github-visor-lang', a);
      } else if (a === 'follow') {
        pinnedRun = null;
        pinnedRepo = null;
        version = 0;
      } else if (a === 'close') sel = null;
      render();
      return;
    }
    if (el.dataset.run) {
      pinnedRun = el.dataset.run;
      pinnedRepo = null;
      sel = null;
      version = 0;
      render();
      return;
    }
    if (el.dataset.repo) pinnedRepo = el.dataset.repo;
    if (el.dataset.sel) sel = el.dataset.sel;
    render();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && sel) {
      sel = null;
      render();
    }
  });

  // ------------------------------------------------------------------ polling

  async function tick() {
    let changed = false;
    try {
      const r = await fetch('/api/state?v=' + version + (pinnedRun ? '&run=' + encodeURIComponent(pinnedRun) : ''), { cache: 'no-store' });
      const j = await r.json();
      status = { ok: j.ok, readAt: j.readAt, reached: true, lostAt: 0 };
      if (j.same) {
        if (data && JSON.stringify(data.runs) !== JSON.stringify(j.runs)) {
          data.runs = j.runs;
          changed = true;
        }
      } else {
        data = j;
        version = j.version;
        if (pinnedRun && run() && run().name !== pinnedRun) pinnedRun = null;
        markNew();
        changed = true;
      }
    } catch {
      if (status.reached) status = { ...status, reached: false, lostAt: Date.now() };
    }
    const nowNew = anyNew();
    try {
      if (!paused && (changed || nowNew || hadNew || !data)) render();
      else renderStatus();
    } finally {
      hadNew = nowNew; // one more redraw once the highlight expires
      setTimeout(tick, POLL_MS); // a failed redraw must not stop the reading
    }
  }

  render();
  if (local) tick();
})();
