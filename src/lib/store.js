import { useEffect, useState } from 'react';

const KEY = 'aeronet-progress-v2';
const empty = { passed: {}, attempts: {}, xp: 0, labs: {}, studyMode: false, streak: { day: '', count: 0 }, missed: {}, reelsSeen: 0, best: {} };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : { ...empty };
  } catch {
    return { ...empty };
  }
}

let state = load();
const subs = new Set();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: progress lives for this session only */ }
  subs.forEach((f) => f(state));
}

export function update(fn) {
  state = { ...state, ...fn(state) };
  save();
}

export function useProgress() {
  const [s, set] = useState(state);
  useEffect(() => { subs.add(set); return () => subs.delete(set); }, []);
  return s;
}

const today = () => new Date().toISOString().slice(0, 10);

/** Called on any study activity: keeps a daily streak. */
export function touchStreak() {
  const d = today();
  if (state.streak.day === d) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  update((s) => ({ streak: { day: d, count: s.streak.day === y ? s.streak.count + 1 : 1 } }));
}

export function addXp(n) { update((s) => ({ xp: s.xp + n })); touchStreak(); }

/** Record a quiz attempt; questions answered wrong go into the revision pool used by Reels. */
export function recordQuiz(moduleId, items, answers) {
  const total = items.length;
  const score = items.reduce((a, q, i) => a + (answers[i] === q.a ? 1 : 0), 0);
  update((s) => {
    const missed = { ...s.missed };
    items.forEach((q, i) => {
      if (answers[i] === q.a) delete missed[q.key];
      else missed[q.key] = (missed[q.key] || 0) + 1;
    });
    const pass = score / total >= 0.8;
    if (!moduleId) return { xp: s.xp + score * 10, missed }; // practice / mock tests don't unlock modules
    const wasPassed = !!s.passed[moduleId];
    return {
      attempts: { ...s.attempts, [moduleId]: { keys: items.map((q) => q.key), answers, score, total, at: Date.now() } },
      passed: pass ? { ...s.passed, [moduleId]: { score, total, at: Date.now() } } : s.passed,
      xp: s.xp + score * 20 + (pass && !wasPassed ? 300 : 0),
      missed,
    };
  });
  touchStreak();
  return { score, total, pass: score / total >= 0.8 };
}

export function resetAll() { state = { ...empty }; save(); }
