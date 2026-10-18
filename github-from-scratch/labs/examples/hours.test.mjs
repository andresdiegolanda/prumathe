import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('guide contains the agreed opening hour / la guía contiene el horario acordado', () => {
  const guide = readFileSync('README.md', 'utf8');
  assert.match(guide, /\b10:00\b/, 'Expected 10:00 in README / Se esperaba 10:00 en README');
});
