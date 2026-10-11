import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MODULES, byId, ALL_QUESTIONS, PLAN } from '../content/index.js';
import { useProgress, recordQuiz, addXp, update } from '../lib/store.js';
import { Icon, Rich, ExtLink, ytShorts, igTag } from './ui.jsx';

const shuffle = (arr, seed = Math.random()) => {
  const a = [...arr];
  let s = Math.floor(seed * 2 ** 31) || 1;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/* ---------------- Quiz (module quiz + mock tests share it) ---------------- */
export function Quiz({ items, moduleId, title, timeLimit, onFinish }) {
  const [order, setOrder] = useState(() => items);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState(() => Array(items.length).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(null);
  const [left, setLeft] = useState(timeLimit || 0);
  const instant = !timeLimit; // practice mode: explanation after each question

  useEffect(() => {
    if (!timeLimit || done) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [timeLimit, done]);
  useEffect(() => { if (timeLimit && left === 0 && !done) finish(); }, [left]); // eslint-disable-line

  function finish(a = ans) {
    const res = recordQuiz(moduleId || null, order, a);
    setDone(res);
    onFinish && onFinish(res);
  }
  const q = order[i];
  const choose = (k) => {
    if (done || (instant && revealed)) return;
    const a = [...ans]; a[i] = k; setAns(a);
    if (instant) setRevealed(true);
  };
  const next = () => {
    setRevealed(false);
    if (i < order.length - 1) setI(i + 1); else finish();
  };
  const retry = () => { setOrder(shuffle(items)); setAns(Array(items.length).fill(null)); setI(0); setDone(null); setRevealed(false); setLeft(timeLimit || 0); };

  if (done) {
    return (
      <div className="quiz">
        <div className={'result ' + (done.pass ? 'pass' : 'fail')}>
          <div className="big">{done.score} / {done.total}</div>
          <div>{done.pass ? (moduleId ? 'Module cleared — next module unlocked! +300 XP' : 'Excellent!') : 'Below 80%. Read the explanations, then retry — questions reshuffle.'}</div>
        </div>
        <h4>Review</h4>
        {order.map((qq, k) => (
          <div key={qq.key} className={'review ' + (ans[k] === qq.a ? 'ok' : 'bad')}>
            <p><b>{k + 1}.</b> {qq.q}</p>
            <p className="small">Your answer: <b>{ans[k] == null ? '— (no answer)' : qq.o[ans[k]]}</b>{ans[k] !== qq.a && <> · Correct: <b>{qq.o[qq.a]}</b></>}</p>
            <p className="small muted">{qq.e}</p>
          </div>
        ))}
        <button className="btn" onClick={retry}><Icon name="shuffle" /> Retry (reshuffled)</button>
      </div>
    );
  }
  return (
    <div className="quiz">
      <div className="quiz-top">
        <span>{title || 'Quiz'} · Q {i + 1}/{order.length}</span>
        {timeLimit ? <span className={'timer ' + (left < 60 ? 'low' : '')}><Icon name="timer" size={14} /> {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span> : <span className="muted small">Pass mark 80%</span>}
      </div>
      <div className="bar"><i style={{ width: `${(i / order.length) * 100}%` }} /></div>
      <h3 className="q">{q.q}</h3>
      <div className="opts">
        {q.o.map((o, k) => {
          let cls = 'opt';
          if (ans[i] === k) cls += ' sel';
          if (instant && revealed) { if (k === q.a) cls += ' right'; else if (ans[i] === k) cls += ' wrong'; }
          return <button key={k} className={cls} onClick={() => choose(k)}><span className="letter">{String.fromCharCode(65 + k)}</span>{o}</button>;
        })}
      </div>
      {instant && revealed && <div className={'explain ' + (ans[i] === q.a ? 'ok' : 'bad')}><b>{ans[i] === q.a ? 'Correct.' : 'Not quite.'}</b> {q.e}</div>}
      <div className="row end">
        {!instant && i > 0 && <button className="btn ghost" onClick={() => setI(i - 1)}>Back</button>}
        <button className="btn" disabled={ans[i] == null} onClick={next}>{i === order.length - 1 ? 'Submit' : 'Next'} <Icon name="next" size={16} /></button>
      </div>
    </div>
  );
}

/* ---------------- Rapid fire (fun test) ---------------- */
function RapidFire({ onExit }) {
  const pool = useMemo(() => shuffle(ALL_QUESTIONS), []);
  const [k, setK] = useState(0), [score, setScore] = useState(0), [streak, setStreak] = useState(0), [left, setLeft] = useState(90), [flash, setFlash] = useState(null);
  const p = useProgress();
  const over = left <= 0 || k >= pool.length;
  useEffect(() => {
    if (over) return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [over]);
  useEffect(() => {
    if (over && score > 0) { addXp(score * 5); if (score > (p.best.rapid || 0)) update((s) => ({ best: { ...s.best, rapid: score } })); }
  }, [over]); // eslint-disable-line
  if (over) return (
    <div className="quiz center">
      <div className="result pass"><div className="big">{score} pts</div><div>Best: {Math.max(score, p.best.rapid || 0)} · +{score * 5} XP</div></div>
      <button className="btn" onClick={onExit}>Back to tests</button>
    </div>
  );
  const q = pool[k];
  const pick = (i) => {
    const ok = i === q.a;
    setFlash(ok ? 'ok' : 'bad');
    setTimeout(() => setFlash(null), 250);
    if (ok) { setScore(score + 10 + streak * 2); setStreak(streak + 1); } else { setStreak(0); setLeft((l) => Math.max(0, l - 5)); }
    setK(k + 1);
  };
  return (
    <div className={'quiz rapid ' + (flash || '')}>
      <div className="quiz-top"><span><Icon name="bolt" size={14} /> {score} pts · streak ×{streak}</span><span className={'timer ' + (left < 15 ? 'low' : '')}>{left}s</span></div>
      <p className="muted small">{byId[q.module].title}</p>
      <h3 className="q">{q.q}</h3>
      <div className="opts">{q.o.map((o, i) => <button key={i} className="opt" onClick={() => pick(i)}><span className="letter">{String.fromCharCode(65 + i)}</span>{o}</button>)}</div>
      <p className="muted small">Correct = 10 + streak bonus · wrong = −5 s</p>
    </div>
  );
}

export function TestsView({ unlocked }) {
  const [mode, setMode] = useState(null);
  const [mod, setMod] = useState(MODULES[0].id);
  const p = useProgress();
  if (mode === 'quick') return <><button className="btn ghost" onClick={() => setMode(null)}><Icon name="back" /> Tests</button><Quiz key={'q' + mod} items={shuffle(byId[mod].quiz).slice(0, 5)} title={`Quick quiz · ${byId[mod].title}`} /></>;
  if (mode === 'mock') {
    const pool = ALL_QUESTIONS.filter((q) => unlocked.includes(q.module));
    return <><button className="btn ghost" onClick={() => setMode(null)}><Icon name="back" /> Tests</button><Quiz items={shuffle(pool).slice(0, Math.min(20, pool.length))} title="Mock test" timeLimit={20 * 60} /></>;
  }
  if (mode === 'rapid') return <RapidFire onExit={() => setMode(null)} />;
  if (mode === 'weak') {
    const weak = ALL_QUESTIONS.filter((q) => p.missed[q.key]);
    return <><button className="btn ghost" onClick={() => setMode(null)}><Icon name="back" /> Tests</button>{weak.length ? <Quiz items={shuffle(weak).slice(0, 10)} title="Weak-spot drill" /> : <p className="card">No missed questions yet — take some quizzes first.</p>}</>;
  }
  const missedCount = Object.keys(p.missed).length;
  return (
    <div className="stack">
      <h2>Tests</h2>
      <div className="tiles">
        <div className="tile">
          <Icon name="test" size={26} />
          <h3>Quick quiz</h3><p className="muted">5 questions from one module with instant explanations.</p>
          <select value={mod} onChange={(e) => setMod(e.target.value)}>{MODULES.map((m) => <option key={m.id} value={m.id}>{m.n}. {m.title}</option>)}</select>
          <button className="btn" onClick={() => setMode('quick')}>Start</button>
        </div>
        <div className="tile">
          <Icon name="timer" size={26} />
          <h3>Mock test</h3><p className="muted">Up to 20 mixed questions from your unlocked modules, 20-minute timer, review at the end. Viva practice.</p>
          <button className="btn" onClick={() => setMode('mock')}>Start mock</button>
        </div>
        <div className="tile fun">
          <Icon name="bolt" size={26} />
          <h3>Rapid fire</h3><p className="muted">90 seconds. Streak bonuses. Wrong answers cost 5 s. Best: <b>{p.best.rapid || 0}</b></p>
          <button className="btn" onClick={() => setMode('rapid')}>Play</button>
        </div>
        <div className="tile">
          <Icon name="flame" size={26} />
          <h3>Weak-spot drill</h3><p className="muted">Only questions you've got wrong before ({missedCount}). They leave the list when you get them right.</p>
          <button className="btn" disabled={!missedCount} onClick={() => setMode('weak')}>Drill</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reel mode ---------------- */
function buildFeed(filter, p) {
  const mods = filter === 'all' ? MODULES : filter === 'revise' ? MODULES.filter((m) => p.passed[m.id]) : [byId[filter]];
  const cards = [];
  mods.forEach((m) => {
    m.reels.forEach((r, i) => cards.push({ type: 'flash', id: `${m.id}-r${i}`, m, ...r }));
    m.quiz.slice(0, 2).forEach((q) => cards.push({ type: 'mcq', id: q.key, m, q }));
    cards.push({ type: 'watch', id: `${m.id}-w`, m });
  });
  if (filter === 'revise') ALL_QUESTIONS.filter((q) => p.missed[q.key]).forEach((q) => cards.push({ type: 'mcq', id: 'miss-' + q.key, m: byId[q.module], q, missed: true }));
  return shuffle(cards, filter === 'all' ? Math.random() : 0.42);
}

function FlashCard({ c }) {
  const [flip, setFlip] = useState(false);
  return (
    <button className={'reel-card flash ' + (flip ? 'flipped' : '')} onClick={() => setFlip(!flip)}>
      <span className="chip" style={{ borderColor: c.m.color, color: c.m.color }}>{c.m.title}</span>
      <div className="reel-face">{flip ? <Rich text={c.back} /> : <h2>{c.front}</h2>}</div>
      <span className="muted small">{flip ? 'Tap to flip back · swipe up for next' : 'Think of the answer, then tap'}</span>
    </button>
  );
}
function McqCard({ c }) {
  const [pick, setPick] = useState(null);
  return (
    <div className="reel-card">
      <span className="chip" style={{ borderColor: c.m.color, color: c.m.color }}>{c.missed ? 'You missed this before · ' : ''}{c.m.title}</span>
      <h3>{c.q.q}</h3>
      <div className="opts small-opts">{c.q.o.map((o, i) => (
        <button key={i} className={'opt' + (pick != null && i === c.q.a ? ' right' : '') + (pick === i && i !== c.q.a ? ' wrong' : '')} onClick={() => { if (pick == null) { setPick(i); if (i === c.q.a) addXp(5); } }}>{o}</button>
      ))}</div>
      {pick != null && <p className="small">{c.q.e}</p>}
    </div>
  );
}
function WatchCard({ c }) {
  return (
    <div className="reel-card watch">
      <span className="chip" style={{ borderColor: c.m.color, color: c.m.color }}>{c.m.title}</span>
      <h3>Not in the mood to derive? Watch these.</h3>
      <div className="watch-list">
        {c.m.shorts.map((s) => <ExtLink key={s} className="pill yt" href={ytShorts(s)}><Icon name="play" size={14} /> YouTube Shorts: {s}</ExtLink>)}
        {['fpv', 'drone', 'droneengineering', 'quadcopter'].map((t) => <ExtLink key={t} className="pill ig" href={igTag(t)}>Instagram #{t}</ExtLink>)}
      </div>
      <p className="muted small">Search links open YouTube/Instagram with topic-matched results; individual videos aren't vetted, so cross-check facts with the module.</p>
    </div>
  );
}

export function ReelsView({ unlocked }) {
  const p = useProgress();
  const [filter, setFilter] = useState('all');
  const feed = useMemo(() => buildFeed(filter, p), [filter]); // eslint-disable-line
  const ref = useRef(null);
  return (
    <div className="reels-wrap">
      <div className="reels-filter">
        <select value={filter} onChange={(e) => { setFilter(e.target.value); ref.current && (ref.current.scrollTop = 0); }}>
          <option value="all">All topics (shuffle)</option>
          <option value="revise">Revision session: passed modules + your mistakes</option>
          {MODULES.map((m) => <option key={m.id} value={m.id}>{m.n}. {m.title}</option>)}
        </select>
      </div>
      <div className="reels" ref={ref}>
        {feed.length === 0 && <div className="reel-card"><h3>Nothing to revise yet</h3><p>Pass a module quiz and its cards will show up here for spaced revision.</p></div>}
        {feed.map((c) => (
          <section className="reel" key={c.id}>
            {c.type === 'flash' && <FlashCard c={c} />}
            {c.type === 'mcq' && <McqCard c={c} />}
            {c.type === 'watch' && <WatchCard c={c} />}
          </section>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Plan ---------------- */
export function PlanView({ go }) {
  return (
    <div className="stack plan">
      <div className="row between"><h2>Your drone project plan</h2>{!window.__AERONET_EMBED__ && <button className="btn ghost" onClick={() => window.print()}><Icon name="print" /> Print / PDF</button>}</div>
      <p className="muted">Your project starts in about 1–2 months. Six prep weeks get you to day 1 with requirements, sizing and a draft BOM already done; then eight project weeks with a review gate at the end of each.</p>
      <h3>Phase A — Preparation (6 weeks, ~8–10 h/week)</h3>
      <div className="timeline">
        {PLAN.prep.map((w) => (
          <div key={w.week} className="tl-item">
            <div className="tl-head"><b>{w.week}</b> · {w.focus}</div>
            <div className="chips">{w.modules.map((id) => <button key={id} className="chip link" onClick={() => go(`#/m/${id}`)}>{byId[id].title}</button>)}</div>
            <ul>{w.doing.map((d) => <li key={d}>{d}</li>)}</ul>
            <p className="small"><b>Output:</b> {w.output}</p>
          </div>
        ))}
      </div>
      <h3>Phase B — Project (8 weeks)</h3>
      <div className="timeline">
        {PLAN.project.map((w) => (
          <div key={w.week} className="tl-item">
            <div className="tl-head"><b>{w.week}</b></div>
            <ul>{w.tasks.map((d) => <li key={d}>{d}</li>)}</ul>
            <p className="small gate"><b>Gate:</b> {w.gate}</p>
          </div>
        ))}
      </div>
      <h3>Starter bill of materials (autonomous ~1.5 kg quad)</h3>
      <p className="muted small">Specs, not shopping links — final choices come from your own sizing. Check prices on Indian vendors when you order.</p>
      <div className="table-wrap"><table><thead><tr><th>Item</th><th>Spec</th><th>Note</th></tr></thead><tbody>{PLAN.bom.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table></div>
      <h3>Risks and mitigations</h3>
      <div className="table-wrap"><table><thead><tr><th>Risk</th><th>Mitigation</th></tr></thead><tbody>{PLAN.risks.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>)}</tbody></table></div>
    </div>
  );
}

/* ---------------- Tutor (server-side key via Netlify Function) ---------------- */
export function Tutor({ open, onClose, context }) {
  const [msgs, setMsgs] = useState([{ role: 'model', text: 'Ask me anything from the course — derivations, numericals, part selection. I see which module you are on.' }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);
  if (!open) return null;
  const send = async () => {
    const text = input.trim(); if (!text || busy) return;
    const next = [...msgs, { role: 'user', text }];
    setMsgs(next); setInput(''); setBusy(true);
    try {
      const res = await fetch('/.netlify/functions/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(1), context }) });
      const data = await res.json().catch(() => ({}));
      setMsgs((m) => [...m, { role: 'model', text: res.ok ? data.text : (data.error || `Tutor unavailable (HTTP ${res.status}). It works on the Netlify deployment once GEMINI_API_KEY is set.`) }]);
    } catch {
      setMsgs((m) => [...m, { role: 'model', text: 'Network error — the tutor needs an internet connection and the Netlify deployment.' }]);
    } finally { setBusy(false); }
  };
  return (
    <aside className="tutor">
      <div className="tutor-head"><b><Icon name="bot" /> Tutor</b><button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button></div>
      <div className="tutor-body">
        {msgs.map((m, i) => <div key={i} className={'msg ' + m.role}><Rich text={m.text} /></div>)}
        {busy && <div className="msg model muted">Thinking…</div>}
        <div ref={end} />
      </div>
      <div className="tutor-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="e.g. why is P ∝ T^1.5?" />
        <button className="btn" onClick={send} disabled={busy || !input.trim()} aria-label="Send"><Icon name="send" size={16} /></button>
      </div>
    </aside>
  );
}
