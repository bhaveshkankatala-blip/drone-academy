import React, { useEffect, useMemo, useState } from 'react';
import { MODULES, byId, TRACKS } from './content/index.js';
import { useProgress, update, touchStreak, resetAll, setStep } from './lib/store.js';
import { Icon, Rich, ExtLink, ytSearch, GlossSheet } from './components/ui.jsx';
import { GLOSSARY } from './content/glossary.js';
import { SIMS } from './components/sims.jsx';
import { Quiz, TestsView, ReelsView, PlanView, Tutor, FormulasView, ToolsView } from './components/views.jsx';

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
  const topExtra = [['tools', 'code', 'Software', '#/tools'], ['formulas', 'calc', 'Formulas', '#/formulas'], ['glossary', 'book', 'Jargon', '#/glossary']];
  const active = view === 'm' ? 'learn' : view;
  return (
    <div className={'app ' + (view === 'reels' ? 'is-reels' : '')}>
      <header className="top">
        <a href="#/" className="brand"><span className="logo">◆</span> AeroNet <small>Drone Academy</small></a>
        <nav className="topnav">{[...nav, ...topExtra].map(([k, ic, label, to]) => <a key={k} href={to} className={active === k ? 'on' : ''}><Icon name={ic} size={16} /> {label}</a>)}</nav>
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
        {view === 'formulas' && <FormulasView />}
        {view === 'tools' && <ToolsView />}
        {view === 'glossary' && <GlossaryView />}
      </main>
      <GlossSheet />

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
  const last = p.last && byId[p.last.id];
  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="eyebrow">B.Tech EEE · drone engineering from first principles</p>
          <h1>Learn to design, build and fly drones like an engineer.</h1>
          <p className="muted">{MODULES.length} modules · every one in a <b>Simple</b> and an <b>Engineer</b> version · checked videos in watching order · worked examples · simulators · quizzes. Pass a quiz with 80% to unlock the next module.</p>
          <div className="row">
            {last ? (
              <button className="btn big" onClick={() => go(`#/m/${last.id}/${p.last.tab || 'learn'}`)}><Icon name="play" size={16} /> Resume: {last.title}</button>
            ) : (
              <button className="btn big" onClick={() => go(`#/m/${nextMod.id}`)}><Icon name="play" size={16} /> {passedCount ? `Continue: ${nextMod.title}` : 'Begin with Module 0: Start Here'}</button>
            )}
            {last && last.id !== nextMod.id && !p.passed[nextMod.id] && <button className="btn ghost" onClick={() => go(`#/m/${nextMod.id}`)}>Next to clear: {nextMod.title}</button>}
            <a className="btn ghost" href="#/reels"><Icon name="reels" size={16} /> Not in the mood? Reels</a>
            <a className="btn ghost" href="#/formulas"><Icon name="calc" size={16} /> Formula sheet</a>
            <a className="btn ghost" href="#/tools"><Icon name="code" size={16} /> Software toolkit</a>
            <a className="btn ghost" href="#/glossary"><Icon name="book" size={16} /> Jargon A–Z</a>
          </div>
        </div>
        <div className="ring" style={{ '--p': pct }}><b>{pct}%</b><span>{passedCount}/{MODULES.length} cleared</span></div>
        <div className="mini-progress" aria-label={`${passedCount} of ${MODULES.length} modules cleared`}><div className="bar"><i style={{ width: pct + '%' }} /></div><span>{passedCount}/{MODULES.length} modules cleared · {pct}%</span></div>
      </section>

      <section className="card how">
        <h3>How to study each module</h3>
        <ol className="how-steps">
          <li><b>Simple</b> read</li><li><b>Watch</b> the named video</li><li><b>2 quick</b> questions</li><li><b>Engineer</b> read</li><li><b>Starter</b> examples</li><li><b>Numericals</b> with hints</li><li><b>Quiz</b></li>
        </ol>
        <p className="muted small">Each module shows this as a checklist called "Your study path". Tap any <span className="term demo">dotted word</span> for its meaning.</p>
      </section>

      <label className="toggle">
        <input type="checkbox" checked={!!p.studyMode} onChange={(e) => update(() => ({ studyMode: e.target.checked }))} />
        <span>Study mode — unlock every module (progress and quizzes still count)</span>
      </label>

      {TRACKS.map((t) => (
        <section key={t.name}>
          <h2 className="track">{t.name}</h2>
          {t.note && <p className="muted small track-note">{t.note}</p>}
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
  const prev = MODULES[mod.n - 1];
  if (!prev) return null;
  return (
    <div className="card center stack">
      <Icon name="lock" size={36} />
      <h2>{mod.title} is locked</h2>
      <p>Pass the <b>{prev.title}</b> quiz with 80% or more to unlock it — or switch on study mode on the map.</p>
      <div className="row center"><button className="btn" onClick={() => go(`#/m/${prev.id}/quiz`)}>Take that quiz</button><button className="btn ghost" onClick={() => update(() => ({ studyMode: true }))}>Unlock all (study mode)</button></div>
    </div>
  );
}

const TABS = [['learn', 'Learn'], ['solved', 'Numericals'], ['sim', 'Simulator'], ['resources', 'Videos & books'], ['lab', 'Lab & industry'], ['quiz', 'Quiz']];

const ytUrl = (v) => (v.id ? 'https://www.youtube.com/watch?v=' + v.id : 'https://www.youtube.com/playlist?list=' + v.list);
const scrollToId = (id) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);

/** Ordered study steps for a module, generated from its content. */
function pathSteps(mod) {
  const b = mod.beginner || {};
  const vids = b.videos || [];
  const first = vids.filter((v) => v.role === 'first'), deeper = vids.filter((v) => v.role === 'deeper');
  const steps = [];
  if (b.simple) steps.push({ k: 'simple', t: 'Read the Simple explanation', tab: 'learn', level: 'simple' });
  else steps.push({ k: 'simple', t: 'Read this module', tab: 'learn', level: 'engineer' });
  if (first.length) steps.push({ k: 'watch1', t: `Watch ${first.length === 1 ? 'this video' : 'these ' + first.length + ' videos'}`, videos: first });
  if (b.check) steps.push({ k: 'check', t: 'Answer 2 quick questions', tab: 'learn', level: b.simple ? 'simple' : 'engineer', anchor: 'quick-check' });
  if (b.simple) steps.push({ k: 'engineer', t: 'Read the Engineer version (skip derivations on a first read)', tab: 'learn', level: 'engineer' });
  if (deeper.length) steps.push({ k: 'watch2', t: 'Watch the deeper video', videos: deeper });
  if (b.starters) steps.push({ k: 'starters', t: 'Work through the Level 1 starter examples', tab: 'solved', anchor: 'level-1' });
  steps.push({ k: 'guided', t: 'Solve Level 2 numericals with hints', tab: 'solved', anchor: 'level-2' });
  if (mod.sim) steps.push({ k: 'sim', t: 'Play with the simulator', tab: 'sim' });
  steps.push({ k: 'quiz', t: 'Take the quiz (80% unlocks the next module)', tab: 'quiz' });
  return steps;
}

function StudyPath({ mod, p, go }) {
  const steps = pathSteps(mod);
  const st = p.path[mod.id] || {};
  const isDone = (s) => (s.k === 'quiz' ? !!p.passed[mod.id] || !!st.quiz : !!st[s.k]);
  const doneN = steps.filter(isDone).length;
  const nextI = steps.findIndex((s) => !isDone(s));
  const [open, setOpen] = useState(false);
  const goStep = (s) => {
    if (s.level) update(() => ({ level: s.level }));
    if (s.tab) go(`#/m/${mod.id}/${s.tab}`);
    if (s.anchor) scrollToId(s.anchor);
  };
  return (
    <section className="card path" aria-label="Study path">
      <button className="path-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span><b>Your study path</b> <span className="muted small">· {doneN}/{steps.length} done</span></span>
        <span className="bar mini"><i style={{ width: (doneN / steps.length) * 100 + '%' }} /></span>
        <span className="muted small">{open ? 'Hide steps' : 'All steps'}</span>
      </button>
      {(
        <ol className="steps">
          {steps.map((s, i) => (open || i === nextI) && (
            <li key={s.k} className={(isDone(s) ? 'done ' : '') + (i === nextI ? 'next' : '')}>
              <input type="checkbox" aria-label={'Mark done: ' + s.t} checked={isDone(s)} disabled={s.k === 'quiz' && !!p.passed[mod.id]} onChange={(e) => setStep(mod.id, s.k, e.target.checked)} />
              <div>
                {s.tab ? <button className="linkish step-t" onClick={() => goStep(s)}>{s.t}</button> : <span className="step-t">{s.t}</span>}
                {i === nextI && <span className="next-chip">Next</span>}
                {s.videos && <ul className="step-vids">{s.videos.map((v) => <li key={v.id || v.list}><ExtLink href={ytUrl(v)} className="vid-link"><Icon name="play" size={12} /> {v.t}</ExtLink> <span className="muted small">· {v.by}</span></li>)}</ul>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function VideoCard({ v, n }) {
  const label = { first: 'Watch this first', deeper: 'After the Engineer read', extra: 'Optional extra' }[v.role];
  return (
    <ExtLink href={ytUrl(v)} className={'vcard ' + v.role}>
      <span className="vnum">{n}</span>
      <span className="vbody">
        <span className="vrole">{label}{v.list ? ' · playlist' : ''}</span>
        <b>{v.t}</b>
        <span className="muted small">{v.by}</span>
        {v.note && <span className="small">{v.note}</span>}
      </span>
      <Icon name="play" size={18} />
    </ExtLink>
  );
}

function QuickCheck({ mod }) {
  const qs = mod.beginner?.check || [];
  const [ans, setAns] = useState({});
  useEffect(() => { if (qs.length && Object.keys(ans).length === qs.length) setStep(mod.id, 'check', true); }, [ans]);
  if (!qs.length) return null;
  return (
    <section className="card qcheck" id="quick-check">
      <h3><Icon name="check" /> Quick check</h3>
      <p className="muted small">Two questions to see whether the idea landed. No marks; wrong answers just show the explanation.</p>
      {qs.map((q, qi) => (
        <div key={qi} className="qc">
          <p><b>{qi + 1}.</b> {q.q}</p>
          <div className="qc-opts">{q.o.map((o, oi) => {
            const picked = ans[qi] === oi, show = ans[qi] != null;
            return <button key={oi} className={'opt ' + (show && oi === q.a ? 'right ' : '') + (picked && oi !== q.a ? 'wrong' : '')} onClick={() => setAns({ ...ans, [qi]: oi })} disabled={show}>{o}</button>;
          })}</div>
          {ans[qi] != null && <p className={'small ' + (ans[qi] === q.a ? 'good' : 'bad')}>{ans[qi] === q.a ? 'Correct. ' : 'Not quite. '}<span className="muted">{q.e}</span></p>}
        </div>
      ))}
    </section>
  );
}

function LevelSwitch({ level, has }) {
  if (!has) return null;
  return (
    <div className="level-switch" role="tablist" aria-label="Reading level">
      {[['simple', 'Simple', 'Plain words, no derivations'], ['engineer', 'Engineer', 'Full equations and derivations']].map(([k, l, d]) => (
        <button key={k} role="tab" aria-selected={level === k} className={level === k ? 'on' : ''} onClick={() => update(() => ({ level: k }))}><b>{l}</b><span>{d}</span></button>
      ))}
    </div>
  );
}

function SimpleView({ mod }) {
  const b = mod.beginner;
  const first = b.videos.filter((v) => v.role === 'first');
  return (
    <div className="stack">
      <div className="callout why"><b>Why this matters:</b> {b.why}</div>
      {b.bridge?.length > 0 && (
        <div className="card bridge"><h3><Icon name="bolt" /> You already know this from…</h3>
          <ul>{b.bridge.map((x, i) => <li key={i}><span className="subj">{x.subject}</span> {x.text}</li>)}</ul>
        </div>
      )}
      {b.simple.map((s, i) => (
        <section key={s.h} id={'sec-' + i} className="sec simple"><h2>{s.h}</h2><Rich text={s.body} /></section>
      ))}
      {first.length > 0 && <div className="stack"><h3 className="track">Now watch</h3>{first.map((v, i) => <VideoCard key={v.id || v.list} v={v} n={i + 1} />)}</div>}
      <QuickCheck mod={mod} />
      <div className="card next-card">
        <p><b>Ready for the full version?</b> The Engineer view has the equations and derivations. Skip the derivations on a first read; the starter examples will show you how the formulas are used.</p>
        <div className="row"><button className="btn" onClick={() => { update(() => ({ level: 'engineer' })); window.scrollTo(0, 0); }}>Read the Engineer version <Icon name="next" size={16} /></button>
          <a className="btn ghost" href={`#/m/${mod.id}/solved`}>Go to starter examples</a></div>
      </div>
    </div>
  );
}

function ModuleView({ mod, tab, p, go }) {
  useEffect(() => { update(() => ({ last: { id: mod.id, tab } })); }, [mod.id, tab]);
  useEffect(() => { const el = document.querySelector('.tabs a.on'); if (el && el.scrollIntoView) el.scrollIntoView({ inline: 'center', block: 'nearest' }); }, [tab]);
  const tabs = TABS.filter(([k]) => k !== 'sim' || mod.sim);
  const prev = MODULES[mod.n - 1], next = MODULES[mod.n + 1];
  const Sim = mod.sim && SIMS[mod.sim];
  const b = mod.beginner;
  const hasSimple = !!b?.simple;
  const level = hasSimple ? p.level || 'simple' : 'engineer';
  const deeper = b ? b.videos.filter((v) => (hasSimple ? v.role === 'deeper' : v.role !== 'extra')) : [];
  return (
    <article className="module" style={{ '--c': mod.color }}>
      <div className="mod-head">
        <a href="#/" className="crumb"><Icon name="back" size={14} /> Map</a>
        <p className="eyebrow">Module {mod.n} · {mod.tag}</p>
        <h1>{mod.title}</h1>
        <p className="muted">{mod.summary}</p>
        <p className="eee"><Icon name="bolt" size={14} /> {mod.eee}</p>
      </div>
      <div className="tabs-wrap"><div className="tabs" role="tablist">{tabs.map(([k, l]) => <a key={k} role="tab" href={`#/m/${mod.id}/${k}`} className={tab === k ? 'on' : ''}>{l}{k === 'quiz' && p.passed[mod.id] ? ' ✓' : ''}</a>)}</div></div>

      {tab === 'learn' && (
        <div className="stack">
          <StudyPath mod={mod} p={p} go={go} />
          <LevelSwitch level={level} has={hasSimple} />
          <div className="learn-grid">
            <aside className="toc" aria-label="On this page">
              <b>On this page</b>
              {(level === 'simple' ? b.simple : mod.sections).map((s, i) => <button key={s.h} onClick={() => scrollToId('sec-' + i)}>{s.h}</button>)}
              <a href={`#/m/${mod.id}/solved`}>Numericals →</a>
              <a href={`#/m/${mod.id}/quiz`}>Quiz →</a>
            </aside>
            {level === 'simple' ? <SimpleView mod={mod} /> : (
              <div className="stack">
                <div className="card outcomes"><h3>By the end you can</h3><ul>{mod.outcomes.map((o) => <li key={o}><Rich text={o} gloss={false} /></li>)}</ul></div>
                {hasSimple && <p className="muted small">Lost? Switch to <button className="linkish" onClick={() => update(() => ({ level: 'simple' }))}>Simple</button>, or tap any dotted-underlined word for its meaning.</p>}
                {mod.sections.map((s, i) => (
                  <section key={s.h} id={'sec-' + i} className={s.type === 'derive' ? 'derive' : 'sec'}>
                    <h2>{s.type === 'derive' && <span className="hand">derivation ✎ </span>}{s.h}</h2>
                    {s.type === 'derive' && <p className="skip-note small">First read? You can skip this derivation. Just note the final result.</p>}
                    <Rich text={s.body} />
                  </section>
                ))}
                {!hasSimple && <QuickCheck mod={mod} />}
                {deeper.length > 0 && <div className="stack"><h3 className="track">Watch next</h3>{deeper.map((v, i) => <VideoCard key={v.id || v.list} v={v} n={i + 1} />)}</div>}
                <div className="row between"><span /><a className="btn" href={`#/m/${mod.id}/solved`}>Next: numericals <Icon name="next" size={16} /></a></div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'solved' && <NumericalsTab mod={mod} />}

      {tab === 'sim' && Sim && <Sim />}

      {tab === 'lab' && (
        <div className="stack">
          <LabCard mod={mod} p={p} />
          <div className="card"><h3><Icon name="brief" /> Skills industry will expect from this module</h3><div className="chips">{mod.industry.map((s) => <span key={s} className="chip">{s}</span>)}</div></div>
        </div>
      )}

      {tab === 'resources' && <ResourcesTab mod={mod} />}

      {tab === 'quiz' && <QuizTab mod={mod} p={p} />}

      <div className="row between pager">
        {prev ? <a className="btn ghost" href={`#/m/${prev.id}`}><Icon name="back" size={16} /> {prev.title}</a> : <span />}
        {next ? <a className="btn ghost" href={`#/m/${next.id}`}>{next.title} <Icon name="next" size={16} /></a> : <a className="btn ghost" href="#/plan">Project plan <Icon name="next" size={16} /></a>}
      </div>
    </article>
  );
}

function ResourcesTab({ mod }) {
  const vids = mod.beginner?.videos || [];
  const order = { first: 0, deeper: 1, extra: 2 };
  const sorted = [...vids].sort((a, b) => order[a.role] - order[b.role]);
  const other = mod.resources.filter((r) => !(r.kind === 'video' && r.yt));
  const searches = mod.resources.filter((r) => r.kind === 'video' && r.yt);
  return (
    <div className="stack">
      {sorted.length > 0 && (
        <section className="stack">
          <h2 className="track">Videos, in the order to watch them</h2>
          <p className="muted small">Each link goes to one specific video, not a search. Every link was checked to exist, with its title and channel confirmed. Watch "first" videos after the Simple read and "deeper" ones after the Engineer read.</p>
          {sorted.map((v, i) => <VideoCard key={v.id || v.list} v={v} n={i + 1} />)}
        </section>
      )}
      {other.length > 0 && (
        <section className="stack"><h2 className="track">Courses, docs and books</h2>
          <div className="res-grid">{other.map((r) => (
            <ExtLink key={r.t} href={r.url} className={'res ' + r.kind}><span className="kind">{r.kind}</span><b>{r.t}</b><span className="muted small">{r.by}</span></ExtLink>
          ))}</div>
        </section>
      )}
      <div className="card"><h3><Icon name="book" /> Books for this topic</h3><ul>{mod.practice.map((b) => <li key={b.book}><b>{b.book}</b> · {b.where}. <span className="muted">{b.note}</span></li>)}</ul></div>
      {searches.length > 0 && (
        <details className="card"><summary><b>More on YouTube</b> <span className="muted small">(search results, not checked: use after the videos above)</span></summary>
          <ul>{searches.map((r) => <li key={r.t}><ExtLink href={ytSearch(r.yt)}>{r.t}</ExtLink> <span className="muted small">· {r.by === 'YouTube search' ? 'search' : r.by}</span></li>)}</ul>
        </details>
      )}
    </div>
  );
}

function NumericalsTab({ mod }) {
  const starters = mod.beginner?.starters || [];
  const core = mod.numericals.slice(0, mod.nCore), hard = mod.numericals.slice(mod.nCore);
  return (
    <div className="stack">
      <div className="card levels-intro">
        <b>How to use this page.</b> Start at Level 1: fully worked examples where every step says <i>why</i>. Then try Level 2 on paper, revealing <b>one hint at a time</b> only when stuck. Level 3 is exam and interview style.
      </div>
      {starters.length > 0 && (
        <section className="stack" id="level-1">
          <h2 className="track"><span className="lvl l1">Level 1</span> Starter examples, fully explained</h2>
          {starters.map((n, i) => <Starter key={i} n={n} i={i} />)}
          <button className="btn ghost" onClick={() => { setStep(mod.id, 'starters', true); scrollToId('level-2'); }}>I understood these: go to Level 2 <Icon name="next" size={16} /></button>
        </section>
      )}
      <section className="stack" id="level-2">
        <h2 className="track"><span className="lvl l2">Level 2</span> Guided numericals with hints</h2>
        {core.map((n, i) => <Numerical key={i} n={n} i={i} mode="hints" />)}
      </section>
      {hard.length > 0 && (
        <section className="stack" id="level-3">
          <h2 className="track"><span className="lvl l3">Level 3</span> Challenge (exam and interview style)</h2>
          {hard.map((n, i) => <Numerical key={i} n={n} i={core.length + i} mode="full" />)}
        </section>
      )}
      <div className="card"><h3><Icon name="book" /> Practise more from books</h3>
        <ul>{mod.practice.map((b) => <li key={b.book}><b>{b.book}</b>: {b.where}. <span className="muted">{b.note}</span></li>)}</ul>
      </div>
    </div>
  );
}

function Starter({ n, i }) {
  const [shown, setShown] = useState(0);
  const all = shown >= n.steps.length;
  return (
    <div className="numerical starter">
      <p className="qn"><b>Example {i + 1}.</b> <Rich text={n.q} /></p>
      {shown === 0 && <p className="muted small">Try to guess the first step yourself, then reveal it.</p>}
      {shown > 0 && (
        <ol className="wsteps">{n.steps.slice(0, shown).map((s, k) => (
          <li key={k}><Rich text={s.s} gloss={false} /><p className="why"><b>Why:</b> {s.why}</p></li>
        ))}</ol>
      )}
      {all ? <p className="answer"><b>Answer:</b> {n.answer}</p> : (
        <div className="row"><button className="btn" onClick={() => setShown(shown + 1)}>{shown === 0 ? 'Show step 1' : `Show step ${shown + 1} of ${n.steps.length}`}</button>
          <button className="btn ghost" onClick={() => setShown(n.steps.length)}>Show all steps</button></div>
      )}
    </div>
  );
}

function Numerical({ n, i, mode }) {
  const [shown, setShown] = useState(0);
  const all = shown >= n.steps.length;
  return (
    <div className="numerical">
      <p className="qn"><b>Q{i + 1}.</b> <Rich text={n.q} /></p>
      {shown > 0 && (
        <div className="solution">
          <ol>{n.steps.slice(0, shown).map((s, k) => <li key={k}><Rich text={s} gloss={false} /></li>)}</ol>
          {all && <p className="answer"><b>Answer:</b> {n.answer}</p>}
          {all && n.why && <p className="muted small"><b>Why it matters:</b> {n.why}</p>}
        </div>
      )}
      {!all && (
        <div className="row">
          {mode === 'hints' && <button className="btn ghost" onClick={() => setShown(shown + 1)}>{shown === 0 ? 'Stuck? Show a hint (step 1)' : `Show next step (${shown + 1} of ${n.steps.length})`}</button>}
          <button className={mode === 'hints' ? 'linkish' : 'btn ghost'} onClick={() => setShown(n.steps.length)}>Show full solution</button>
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

function GlossaryView() {
  const [q, setQ] = useState('');
  const list = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)).filter((g) => !q || (g.term + ' ' + g.def + ' ' + g.match.join(' ')).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="stack">
      <div className="mod-head"><p className="eyebrow">Reference</p><h1>Jargon A–Z</h1><p className="muted">Every highlighted word in the course, explained in one or two lines.</p></div>
      <input className="search" type="search" placeholder="Search, e.g. KV, PWM, Kalman" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search jargon" />
      <dl className="glossary">{list.map((g) => <div key={g.term}><dt>{g.term}</dt><dd>{g.def}</dd></div>)}</dl>
      {!list.length && <p className="muted">No match. Try a shorter word.</p>}
    </div>
  );
}
