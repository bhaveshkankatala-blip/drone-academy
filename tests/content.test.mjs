// Content integrity checks for the beginner layer (run with: npm test).
import test from 'node:test';
import assert from 'node:assert/strict';
import { BEGINNER_A } from '../src/content/beginner-a.js';
import { BEGINNER_B } from '../src/content/beginner-b.js';
import { BEGINNER_C } from '../src/content/beginner-c.js';
import { GLOSSARY, GLOSS_RE } from '../src/content/glossary.js';

const B = { ...BEGINNER_A, ...BEGINNER_B, ...BEGINNER_C };
const IDS = ['start', 'systems', 'power', 'motors', 'esc', 'physics', 'mcu', 'sensing', 'dynamics', 'control', 'firmware', 'rf', 'design', 'autonomy', 'fixedwing', 'pcb', 'vision'];

test('every module has a beginner layer', () => {
  for (const id of IDS) assert.ok(B[id], 'missing beginner data for ' + id);
});

test('quick checks have valid answers', () => {
  for (const id of IDS) for (const q of B[id].check) {
    assert.ok(q.a >= 0 && q.a < q.o.length, id + ': bad answer index');
    assert.ok(q.e.length > 10, id + ': missing explanation');
  }
});

test('starter examples explain every step', () => {
  for (const id of IDS) {
    assert.ok(B[id].starters.length >= 2, id + ': needs 2 starters');
    for (const s of B[id].starters) for (const st of s.steps) assert.ok(st.s && st.why, id + ': step without why');
  }
});

test('videos are specific links with a first-watch video', () => {
  for (const id of IDS) {
    const v = B[id].videos;
    assert.ok(v.some((x) => x.role === 'first'), id + ': no first video');
    for (const x of v) {
      assert.ok(/^[A-Za-z0-9_-]{11}$/.test(x.id || '') || /^PL[A-Za-z0-9_-]+$/.test(x.list || ''), id + ': bad video id ' + (x.id || x.list));
      assert.ok(['first', 'deeper', 'extra'].includes(x.role));
    }
  }
});

test('glossary terms are unique and match their own spellings', () => {
  const names = GLOSSARY.map((g) => g.term);
  assert.equal(new Set(names).size, names.length);
  for (const g of GLOSSARY) for (const m of g.match) {
    GLOSS_RE.lastIndex = 0;
    assert.ok(GLOSS_RE.exec(' ' + m + ' '), 'glossary regex misses ' + m);
  }
});

test('starter arithmetic spot-checks', () => {
  assert.ok(Math.abs(920 * 14.8 * 2 * Math.PI / 60 - 1426) < 1); // motors
  assert.ok(Math.abs(2.4e-6 * 80 / 0.0088 - 0.0218) < 0.0002); // vision GSD
  assert.ok(Math.abs(1.7e-8 * 0.05 / (0.002 * 35e-6) - 0.01214) < 0.0001); // pcb trace
  assert.ok(Math.abs(16.8 * 2.2 / 12.2 - 3.03) < 0.01); // mcu divider
  assert.ok(Math.abs(10 * Math.log10(100) - 20) < 1e-9); // rf
});
