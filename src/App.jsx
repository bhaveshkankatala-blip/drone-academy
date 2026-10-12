import React, { useEffect, useMemo, useState } from 'react';
import { MODULES, byId, TRACKS } from './content/index.js';
import { useProgress, update, touchStreak, resetAll } from './lib/store.js';
import { Icon, Rich, ExtLink, ytSearch } from './components/ui.jsx';
import { SIMS } from './components/sims.jsx';
import { Quiz, TestsView, ReelsView, PlanView, Tutor } from './components/views.jsx';

function useHash() {
  const [h, setH] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const f = () => { setH(window.location.hash || '#/'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return [h, (to) => { window.location.hash = to; }];
}

function unlockedIds(p) {
  if (p.studyMode) return MODULES.map((m) => m.id);
  const ids = [];
  for (const m of MODULES) { ids.push(m.id); if (!p.passed[m.id]) break; }
  return ids;
}

export default function App() {
  const [hash, go] = useHash();
  const p = useProgress();
  const [tutor, setTutor] = useState(false);
  const unlocked = useMemo(() => unlockedIds(p), [p]);
  const parts = hash.replace(/^#\/?/, '').split('/');
  const view = parts[0] || 'learn';
  const mod = view === 'm' ? byId[parts[1]] : null;

  useEffect(() => { touchStreak(); }, []);

  const nav = [
    ['learn', 'map', 'Learn', '#/'],
    ['reels', 'reels', 'Reels', '#/reels'],
    ['tests', 'test', 'Tests', '#/tests'],
    ['plan', 'plan', 'Project', '#/plan'],
  ];
  const active = view === 'm' ? 'learn' : view;
  return (
    <div className={'app ' + (view === 'reels' ? 'is-reels' : '')}>
      <header className="top">
        <a href="#/" className="brand"><span className="logo">◆</span> AeroNet <small>Drone Academy</small></a>
        <nav className="topnav">{nav.map(([k, ic, label, to]) => <a key={k} href={to} className={active === k ? 'on' : ''}><Icon name={ic} size={16} /> {label}</a>)}</nav>
        <div className="hud">
          <span title="Daily streak"><Icon name="flame" size={16} /> {p.streak.count}</span>
          <span title="Experience points"><Icon name="star" size={16} /> {p.xp}</span>
          <button className="icon-btn" onClick={() => setTutor(true)} aria-label="Open tutor"><Icon name="bot" /></button>
        </div>
      </header>

      <main className="main">
        {view === 'learn' && <MapView p={p} unlocked={unlocked} go={go} />}
        {view === 'm' && mod && (unlocked.includes(mod.id) ? <ModuleView key={mod.id} mod={mod} tab={parts[2] || 'learn'} p={p} go={go} /> : <Locked mod={mod} go={go} />)}
        {view === 'm' && !mod && <p className="card">Module not found. <a href="#/">Back to the map</a></p>}
        {view === 'reels' && <ReelsView unlocked={unlocked} />}
        {view === 'tests' && <TestsView unlocked={unlocked} />}
        {view === 'plan' && <PlanView go={go} />}
      </main>

      <nav className="bottomnav">{nav.map(([k, ic, label, to]) => <a key={k} href={to} className={active === k ? 'on' : ''}><Icon name={ic} size={20} /><span>{label}</span></a>)}
        <button onClick={() => setTutor(true)}><Icon name="bot" size={20} /><span>Tutor</span></button>
      </nav>
      <Tutor open={tutor} onClose={() => setTutor(false)} context={mod ? `${mod.title}: ${mod.summary}` : 'Course overview'} />
    </div>
  );
}

function MapView({ p, unlocked, go }) {
  const passedCount = MODULES.filter((m) => p.passed[m.id]).length;
  const nextMod = MODULES.find((m) => unlocked.includes(m.id) && !p.passed[m.id]) || MODULES[0];
  const pct = Math.round((passedCount / MODULES.length) * 100);
  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="eyebrow">B.Tech EEE · drone engineering from first principles</p>
          <h1>Learn to design, build and fly drones like an engineer.</h1>
          <p className="muted">{MODULES.length} modules · derivations · solved numericals · live simulators · labs · quizzes · reels for lazy days. Pass a quiz with 80% to unlock the next module.</p>
          <div className="row">
            <button className="btn big" onClick={() => go(`#/m/${nextMod.id}`)}><Icon name="play" size={16} /> {passedCount ? 'Continue' : 'Start'}: {nextMod.title}</button>
            <a className="btn ghost" href="#/reels"><Icon name="reels" size={16} /> Not in the mood? Reels</a>
          </div>
        </div>
        <div className="ring" style={{ '--p': pct }}><b>{pct}%</b><span>{passedCount}/{MODULES.length} cleared</span></div>
      </section>

      <label className="toggle">
        <input type="checkbox" checked={!!p.studyMode} onChange={(e) => update(() => ({ studyMode: e.target.checked }))} />
        <span>Study mode — unlock every module (progress and quizzes still count)</span>
      </label>

      {TRACKS.map((t) => (
        <section key={t.name}>
          <h2 className="track">{t.name}</h2>
          <div className="cards">
            {t.ids.map((id) => {
              const m = byId[id];
              const open = unlocked.includes(id);
              const done = p.passed[id];
              return (
                <button key={id} className={'mod-card ' + (open ? '' : 'locked ') + (done ? 'done' : '')} style={{ '--c': m.color }} onClick={() => go(`#/m/${id}`)}>
                  <div className="row between"><span className="num">{String(m.n).padStart(2, '0')}</span>
                    <span className={'status ' + (done ? 'ok' : open ? 'open' : '')}>{done ? <><Icon name="check" size={14} /> {done.score}/{done.total}</> : open ? 'Open' : <><Icon name="lock" size={14} /> Locked</>}</span>
                  </div>
                  <h3>{m.title}</h3>
                  <p className="muted small">{m.summary}</p>
                  <div className="meta"><span>{m.tag}</span><span>~{Math.round(m.mins / 6) / 10} h</span>{m.sim && <span>Simulator</span>}</div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
      <p className="muted small center">Progress is saved on this device. <button className="linkish" onClick={() => { if (confirm('Reset all progress on this device?')) resetAll(); }}>Reset progress</button></p>
    </div>
  );
}

function Locked({ mod, go }) {
  const prev = MODULES[mod.n - 2];
  return (
    <div className="card center stack">
      <Icon name="lock" size={36} />
      <h2>{mod.title} is locked</h2>
      <p>Pass the <b>{prev.title}</b> quiz with 80% or more to unlock it — or switch on study mode on the map.</p>
      <div className="row center"><button className="btn" onClick={() => go(`#/m/${prev.id}/quiz`)}>Take that quiz</button><button className="btn ghost" onClick={() => update(() => ({ studyMode: true }))}>Unlock all (study mode)</button></div>
    </div>
  );
}

const TABS = [['learn', 'Learn'], ['solved', 'Solved numericals'], ['sim', 'Simulator'], ['lab', 'Lab & industry'], ['resources', 'Resources'], ['quiz', 'Quiz']];

function ModuleView({ mod, tab, p, go }) {
  const tabs = TABS.filter(([k]) => k !== 'sim' || mod.sim);
  const prev = MODULES[mod.n - 2], next = MODULES[mod.n];
  const Sim = mod.sim && SIMS[mod.sim];
  return (
    <article className="module" style={{ '--c': mod.color }}>
      <div className="mod-head">
        <a href="#/" className="crumb"><Icon name="back" size={14} /> Map</a>
        <p className="eyebrow">Module {mod.n} · {mod.tag}</p>
        <h1>{mod.title}</h1>
        <p className="muted">{mod.summary}</p>
        <p className="eee"><Icon name="bolt" size={14} /> {mod.eee}</p>
      </div>
      <div className="tabs" role="tablist">{tabs.map(([k, l]) => <a key={k} role="tab" href={`#/m/${mod.id}/${k}`} className={tab === k ? 'on' : ''}>{l}{k === 'quiz' && p.passed[mod.id] ? ' ✓' : ''}</a>)}</div>

      {tab === 'learn' && (
        <div className="stack">
          <div className="card outcomes"><h3>By the end you can</h3><ul>{mod.outcomes.map((o) => <li key={o}><Rich text={o} /></li>)}</ul></div>
          {mod.sections.map((s) => (
            <section key={s.h} className={s.type === 'derive' ? 'derive' : 'sec'}>
              <h2>{s.type === 'derive' && <span className="hand">derivation ✎ </span>}{s.h}</h2>
              <Rich text={s.body} />
            </section>
          ))}
          <div className="row between"><span /><a className="btn" href={`#/m/${mod.id}/solved`}>Next: solved numericals <Icon name="next" size={16} /></a></div>
        </div>
      )}

      {tab === 'solved' && (
        <div className="stack">
          <p className="muted">Original problems written for this course in the style of university and textbook exercises. Try each one on paper before opening the solution.</p>
          {mod.numericals.map((n, i) => <Numerical key={i} n={n} i={i} />)}
          <div className="card"><h3><Icon name="book" /> Practise more from books</h3>
            <ul>{mod.practice.map((b) => <li key={b.book}><b>{b.book}</b> — {b.where}. <span className="muted">{b.note}</span></li>)}</ul>
          </div>
        </div>
      )}

      {tab === 'sim' && Sim && <Sim />}

      {tab === 'lab' && (
        <div className="stack">
          <LabCard mod={mod} p={p} />
          <div className="card"><h3><Icon name="brief" /> Skills industry will expect from this module</h3><div className="chips">{mod.industry.map((s) => <span key={s} className="chip">{s}</span>)}</div></div>
        </div>
      )}

      {tab === 'resources' && (
        <div className="stack">
          <div className="res-grid">{mod.resources.map((r) => (
            <ExtLink key={r.t} href={r.url || (r.yt ? ytSearch(r.yt) : ytSearch(r.t + ' ' + r.by))} className={'res ' + r.kind}>
              <span className="kind">{r.kind === 'video' && r.yt ? 'video · search' : r.kind}</span>
              <b>{r.t}</b><span className="muted small">{r.by}</span>
            </ExtLink>
          ))}</div>
          <div className="card"><h3>Books for this topic</h3><ul>{mod.practice.map((b) => <li key={b.book}>{b.book}</li>)}</ul></div>
        </div>
      )}

      {tab === 'quiz' && <QuizTab mod={mod} p={p} />}

      <div className="row between pager">
        {prev ? <a className="btn ghost" href={`#/m/${prev.id}`}><Icon name="back" size={16} /> {prev.title}</a> : <span />}
        {next ? <a className="btn ghost" href={`#/m/${next.id}`}>{next.title} <Icon name="next" size={16} /></a> : <a className="btn ghost" href="#/plan">Project plan <Icon name="next" size={16} /></a>}
      </div>
    </article>
  );
}

function Numerical({ n, i }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="numerical">
      <p className="qn"><b>Q{i + 1}.</b> <Rich text={n.q} /></p>
      {!open ? <button className="btn ghost" onClick={() => setOpen(true)}>Show solution</button> : (
        <div className="solution">
          <ol>{n.steps.map((s, k) => <li key={k}><Rich text={s} /></li>)}</ol>
          <p className="answer"><b>Answer:</b> {n.answer}</p>
          {n.why && <p className="muted small"><b>Why it matters:</b> {n.why}</p>}
        </div>
      )}
    </div>
  );
}

function LabCard({ mod, p }) {
  const done = p.labs[mod.id] || [];
  const toggle = (k) => update((s) => { const cur = [...(s.labs[mod.id] || [])]; cur[k] = !cur[k]; return { labs: { ...s.labs, [mod.id]: cur } }; });
  return (
    <div className="card lab">
      <h3><Icon name="flask" /> Lab: {mod.lab.title}</h3>
      <p className="small"><b>Kit:</b> {mod.lab.kit.join(' · ')}</p>
      <ul className="checklist">{mod.lab.steps.map((s, k) => <li key={k}><label><input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} /> <span>{s}</span></label></li>)}</ul>
      <p className="small"><b>Deliverable:</b> {mod.lab.deliverable}</p>
    </div>
  );
}

function QuizTab({ mod, p }) {
  const passed = p.passed[mod.id];
  const last = p.attempts[mod.id];
  const [review, setReview] = useState(false);
  return (
    <div className="stack">
      {passed && <div className="card ok-card"><Icon name="check" /> Passed with {passed.score}/{passed.total}. Retake any time to practise — your pass is kept.
        {last && <button className="linkish" onClick={() => setReview(!review)}>{review ? 'Hide' : 'Review'} last attempt</button>}</div>}
      {review && last && (
        <div className="stack">{last.keys.map((key, k) => { const q = mod.quiz.find((x) => x.key === key); if (!q) return null; const a = last.answers[k]; return (
          <div key={key} className={'review ' + (a === q.a ? 'ok' : 'bad')}><p>{q.q}</p><p className="small">Your answer: <b>{a == null ? '—' : q.o[a]}</b>{a !== q.a && <> · Correct: <b>{q.o[q.a]}</b></>}</p><p className="small muted">{q.e}</p></div>); })}</div>
      )}
      <Quiz key={mod.id} items={mod.quiz} moduleId={mod.id} title={mod.title} />
    </div>
  );
}
