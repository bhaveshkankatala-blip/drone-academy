import React, { useEffect, useState, Fragment } from 'react';
import { FIGS } from './figures.jsx';

/* ---------- Icons (inline, no dependency) ---------- */
const P = {
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14',
  reels: 'M4 4h16v16H4zM4 9h16M9 4l3 5M15 4l3 5M10 12.5v5l4.5-2.5z',
  test: 'M9 11l3 3 8-8M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9',
  plan: 'M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  bot: 'M12 3v3M5 9h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Zm4 5h.01M15 14h.01M2 13v3M22 13v3',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  check: 'M5 12l5 5 9-10',
  back: 'M15 18l-6-6 6-6',
  next: 'M9 18l6-6-6-6',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM20 17v4H6.5',
  play: 'M6 4l14 8-14 8z',
  flame: 'M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7Z',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z',
  calc: 'M5 3h14v18H5zM8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0',
  flask: 'M9 3h6M10 3v6L4 19a1 1 0 0 0 .9 1.5h14.2A1 1 0 0 0 20 19L14 9V3',
  link: 'M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  x: 'M6 6l12 12M18 6 6 18',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  brief: 'M3 7h18v13H3zM8 7V4h8v3',
  print: 'M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z',
  shuffle: 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  timer: 'M10 2h4M12 14l3-3M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
};
export function Icon({ name, size = 18, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d={P[name] || P.star} />
    </svg>
  );
}

/* ---------- Math ---------- */
function useKatex() {
  const [ok, setOk] = useState(typeof window !== 'undefined' && !!window.katex);
  useEffect(() => {
    if (ok) return;
    const id = setInterval(() => { if (window.katex) { setOk(true); clearInterval(id); } }, 80);
    return () => clearInterval(id);
  }, [ok]);
  return ok;
}
export function Tex({ m, block }) {
  const ok = useKatex();
  if (!ok) return <code className="tex-fallback">{m}</code>;
  const html = window.katex.renderToString(m, { displayMode: !!block, throwOnError: false, strict: false });
  return <span className={block ? 'tex-block' : 'tex'} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---------- Rich text: a tiny markup so content files stay readable ----------
   Paragraphs split by blank lines. Lines starting "- " are bullets, "1. " numbered.
   $$...$$ display math, $...$ inline math, **bold**, `code`, ```code blocks```, > callout. */
function inline(text, keyBase) {
  const parts = [];
  const re = /(\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('$')) parts.push(<Tex key={keyBase + i++} m={tok.slice(1, -1)} />);
    else if (tok.startsWith('**')) parts.push(<strong key={keyBase + i++}>{tok.slice(2, -2)}</strong>);
    else parts.push(<code key={keyBase + i++}>{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
export function Rich({ text, className = '' }) {
  if (!text) return null;
  const blocks = [];
  const chunks = String(text).split(/```/);
  chunks.forEach((chunk, ci) => {
    if (ci % 2 === 1) {
      const nl = chunk.indexOf('\n');
      blocks.push(<pre key={'c' + ci} className="code"><code>{chunk.slice(nl + 1).replace(/\n$/, '')}</code></pre>);
      return;
    }
    chunk.split(/\n\s*\n/).forEach((para, pi) => {
      const p = para.trim();
      if (!p) return;
      const k = `${ci}-${pi}`;
      const lines = p.split('\n');
      if (/^\$\$[\s\S]*\$\$$/.test(p)) blocks.push(<Tex key={k} block m={p.slice(2, -2).trim()} />);
      else if (/^\[\[fig:\w+\]\]$/.test(p) && FIGS[p.slice(6, -2)]) { const F = FIGS[p.slice(6, -2)]; blocks.push(<F key={k} />); }
      else if (lines.every((l) => l.startsWith('|'))) {
        const rows = lines.filter((l) => !/^\|[\s:-|]+\|$/.test(l)).map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        blocks.push(<div key={k} className="table-wrap"><table><thead><tr>{rows[0].map((c, i) => <th key={i}>{inline(c, k + 'h' + i)}</th>)}</tr></thead><tbody>{rows.slice(1).map((r, ri) => <tr key={ri}>{r.map((c, i) => <td key={i}>{inline(c, k + ri + 'd' + i)}</td>)}</tr>)}</tbody></table></div>);
      }
      else if (lines.every((l) => /^- /.test(l))) blocks.push(<ul key={k}>{lines.map((l, li) => <li key={li}>{inline(l.slice(2), k + li)}</li>)}</ul>);
      else if (lines.every((l) => /^\d+\. /.test(l))) blocks.push(<ol key={k}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\d+\. /, ''), k + li)}</li>)}</ol>);
      else if (p.startsWith('> ')) blocks.push(<div key={k} className="callout">{inline(p.slice(2), k)}</div>);
      else blocks.push(<p key={k}>{lines.map((l, li) => <Fragment key={li}>{li > 0 && <br />}{inline(l, k + li)}</Fragment>)}</p>);
    });
  });
  return <div className={'rich ' + className}>{blocks}</div>;
}

/* ---------- Line chart (SVG, responsive) ---------- */
function niceTicks(min, max, n = 5) {
  const span = max - min || 1;
  const step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => span / s <= n + 0.5) || mag * 10;
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) ticks.push(+v.toFixed(10));
  return ticks;
}
export function LineChart({ series, xLabel, yLabel, height = 260, yMin, yMax, markers = [] }) {
  const W = 640, H = height, L = 52, R = 12, T = 12, B = 40;
  const xs = series.flatMap((s) => s.pts.map((p) => p[0]));
  const ys = series.flatMap((s) => s.pts.map((p) => p[1]));
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = yMin ?? Math.min(...ys), y1 = yMax ?? Math.max(...ys);
  if (y0 === y1) { y0 -= 1; y1 += 1; }
  const pad = (y1 - y0) * 0.06; if (yMin === undefined) y0 -= pad; if (yMax === undefined) y1 += pad;
  const sx = (x) => L + ((x - x0) / (x1 - x0 || 1)) * (W - L - R);
  const sy = (y) => T + (1 - (y - y0) / (y1 - y0)) * (H - T - B);
  const clampY = (y) => Math.max(y0, Math.min(y1, y));
  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${yLabel} vs ${xLabel}`}>
        {niceTicks(y0, y1).map((t) => (
          <g key={'y' + t}>
            <line x1={L} x2={W - R} y1={sy(t)} y2={sy(t)} className="grid" />
            <text x={L - 6} y={sy(t) + 4} textAnchor="end" className="tick">{+t.toPrecision(4)}</text>
          </g>
        ))}
        {niceTicks(x0, x1, 6).map((t) => (
          <text key={'x' + t} x={sx(t)} y={H - B + 16} textAnchor="middle" className="tick">{+t.toPrecision(4)}</text>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} className="axis" />
        <line x1={L} x2={L} y1={T} y2={H - B} className="axis" />
        {markers.map((m, i) => (
          <g key={'m' + i}>
            <line x1={sx(m.x)} x2={sx(m.x)} y1={T} y2={H - B} className="marker" />
            <text x={sx(m.x) + 4} y={T + 12} className="tick">{m.label}</text>
          </g>
        ))}
        {series.map((s, i) => (
          <polyline key={i} fill="none" stroke={s.color} strokeWidth={s.width || 2} strokeDasharray={s.dash} opacity={s.opacity ?? 1}
            points={s.pts.map((p) => `${sx(p[0]).toFixed(1)},${sy(clampY(p[1])).toFixed(1)}`).join(' ')} />
        ))}
        <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" className="label">{xLabel}</text>
        <text x={14} y={(T + H - B) / 2} textAnchor="middle" className="label" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>{yLabel}</text>
      </svg>
      <figcaption className="legend">
        {series.map((s, i) => (
          <span key={i}><i style={{ background: s.color }} />{s.name}</span>
        ))}
      </figcaption>
    </figure>
  );
}

/* ---------- Form controls ---------- */
export function Slider({ label, value, min, max, step, onChange, unit = '', fmt }) {
  return (
    <label className="slider">
      <span className="slider-top"><span>{label}</span><b>{fmt ? fmt(value) : value}{unit && ' ' + unit}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  );
}
export function Stat({ label, value, unit, tone }) {
  return (
    <div className={'stat ' + (tone || '')}>
      <span>{label}</span>
      <b>{value}<small>{unit ? ' ' + unit : ''}</small></b>
    </div>
  );
}
export const fmt = (x, d = 2) => (Number.isFinite(x) ? (Math.abs(x) >= 1000 ? Math.round(x).toLocaleString('en-IN') : (+x.toFixed(d)).toString()) : '—');

export function ExtLink({ href, children, className = '' }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

export const ytSearch = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
export const ytShorts = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' #shorts');
export const igTag = (t) => 'https://www.instagram.com/explore/tags/' + encodeURIComponent(t.replace(/^#/, '')) + '/';
