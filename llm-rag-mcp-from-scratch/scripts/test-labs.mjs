/* Runs the commands printed in the lessons, in order, and checks what each lesson says to look for.
   Usage, from the course folder: node scripts/test-labs.mjs [--from=N] [--only=N] [--remote]
   It needs the kit running on this machine (labs/), touches only the prumathe-llm project, and
   writes the evidence to .qa/. Optional steps run only with --remote and a labs/.env file. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cwd = path.join(root, 'labs');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/curriculum.js'), 'utf8'), context);
const course = context.window.LLM_COURSE;
const arg = name => process.argv.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
const from = Number(arg('from') ?? 0);
const only = arg('only') === undefined ? undefined : Number(arg('only'));
const remote = process.argv.includes('--remote') && fs.existsSync(path.join(cwd, '.env'));
for (const n of [from, only]) if (n !== undefined && (!Number.isInteger(n) || n < 0 || n >= course.lessons.length)) throw Error('Invalid lesson number');

/* The lessons quote with double quotes; single quotes appear only inside them (SQL), and a backslash
   stays as written, as in PowerShell and in double-quoted bash. */
function tokens(line) {
  return [...line.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(m => m[1] ?? m[2] ?? m[3]);
}

/* Without a terminal, docker compose run and exec get -T, the same command a person types otherwise. */
function run(line, input) {
  const words = tokens(line);
  const [cmd, ...args] = words;
  if (cmd === 'docker' && args[0] === 'compose' && ['run', 'exec'].includes(args[1]) && !args.includes('-T')) args.splice(2, 0, '-T');
  const p = spawnSync(cmd, args, {cwd, encoding: 'utf8', input, timeout: 900000, maxBuffer: 16 * 1024 * 1024});
  if (p.error) throw p.error;
  return {exit: p.status, output: (p.stdout || '') + (p.stderr || '')};
}

/* sameLines: the numbered lines of a sample (  1  "...") all carry the same text. */
function sameLines(output, n) {
  const texts = output.split(/\r?\n/).map(l => l.match(/^\s+\d+\s+(.*)$/)).filter(Boolean).map(m => m[1]);
  return texts.length >= n && texts.slice(0, n).every(t => t === texts[0]);
}

function check(c, output) {
  if (c.contains !== undefined) return output.includes(c.contains);
  if (c.absent !== undefined) return !output.includes(c.absent);
  if (c.matches !== undefined) return new RegExp(c.matches, 'm').test(output);
  if (c.sameLines !== undefined) return sameLines(output, c.sameLines);
  throw Error('Unknown check ' + JSON.stringify(c));
}

const versions = {docker: run('docker version --format {{.Server.Version}}').output.trim(), compose: run('docker compose version --short').output.trim(), node: process.version, platform: process.platform};
const results = [];
let failure;
try {
  if (!fs.existsSync(path.join(cwd, 'compose.yaml'))) throw Error('Missing labs/compose.yaml');
  for (const lesson of course.lessons) {
    if (lesson.id < from || (only !== undefined && lesson.id !== only)) continue;
    for (const [index, step] of lesson.lab.entries()) {
      const id = `${String(lesson.id).padStart(2, '0')}.${index + 1}`;
      if (step.optional && !remote) {
        results.push({lesson: lesson.id, step: index + 1, skipped: 'optional'});
        console.log(`SKIP ${id} ${step.title.en} (optional)`);
        continue;
      }
      const started = Date.now();
      let output = '';
      for (const line of step.command.split('\n')) {
        if (line === 'cd labs') continue;
        const r = run(line, step.input);
        output += r.output + '\n';
        if (r.exit !== (step.exit ?? 0)) throw Error(`${id}: exit ${r.exit}, expected ${step.exit ?? 0}\n${line}\n${r.output}`);
      }
      for (const c of step.checks || []) if (!check(c, output)) throw Error(`${id}: check failed ${JSON.stringify(c)}\n${output}`);
      results.push({lesson: lesson.id, step: index + 1, ok: true, ms: Date.now() - started, output});
      console.log(`PASS ${id} ${step.title.en} (${((Date.now() - started) / 1000).toFixed(1)} s)`);
    }
  }
} catch (error) {
  failure = String(error.stack || error);
  console.error(failure);
  process.exitCode = 1;
}
fs.mkdirSync(path.join(root, '.qa'), {recursive: true});
const report = `labs${only !== undefined ? '-only-' + only : from ? '-from-' + from : ''}.json`;
fs.writeFileSync(path.join(root, '.qa', report), JSON.stringify({date: new Date().toISOString(), from, only, remote, versions, results, failure}, null, 2) + '\n');
console.log(`${results.filter(r => r.ok).length} steps passed${failure ? '; one failed' : ''}. Evidence: .qa/${report}`);
