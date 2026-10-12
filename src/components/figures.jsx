import React from 'react';
import { FIGS2 } from './figures2.jsx';

// Hand-drawn style engineering figures. All scale to width; colours come from CSS variables.
const Fig = ({ caption, vb, children }) => (
  <figure className="fig">
    <svg viewBox={vb} role="img" aria-label={caption}>{children}</svg>
    <figcaption>{caption}</figcaption>
  </figure>
);
const Box = ({ x, y, w = 120, h = 44, t, s, tone = 'a' }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="8" className={'fbox ' + tone} />
    <text x={x + w / 2} y={y + (s ? 19 : 27)} textAnchor="middle" className="ft">{t}</text>
    {s && <text x={x + w / 2} y={y + 35} textAnchor="middle" className="fs">{s}</text>}
  </g>
);
const Arrow = ({ d, label, lx, ly }) => (
  <g>
    <path d={d} className="farrow" markerEnd="url(#ah)" />
    {label && <text x={lx} y={ly} className="fs" textAnchor="middle">{label}</text>}
  </g>
);
const Defs = () => (
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" className="fhead" />
    </marker>
  </defs>
);

export function SystemFig() {
  return (
    <Fig caption="A multirotor as an electrical engineer sees it: energy flows left→right, information flows in a loop." vb="0 0 720 330">
      <Defs />
      <Box x={10} y={20} t="LiPo battery" s="4–6S, 14.8–22.2 V" tone="d" />
      <Box x={170} y={20} t="PDB / current sensor" s="+ BEC 5 V / 9 V" tone="d" />
      <Box x={330} y={20} t="4 × ESC" s="3-phase inverters" tone="b" />
      <Box x={490} y={20} t="4 × BLDC + prop" s="thrust, reaction torque" tone="b" />
      <Arrow d="M130 42 H168" /><Arrow d="M290 42 H328" /><Arrow d="M450 42 H488" />
      <Box x={330} y={140} t="Flight controller" s="STM32: estimator + PID + mixer" tone="a" />
      <Arrow d="M390 140 V66" label="DShot" lx={420} ly={108} />
      <Box x={170} y={140} t="IMU · baro · mag" s="SPI / I²C" tone="c" />
      <Arrow d="M290 162 H328" />
      <Box x={10} y={140} t="GNSS · rangefinder" s="UART / I²C" tone="c" />
      <Arrow d="M130 162 C150 120, 300 110, 360 140" />
      <Box x={490} y={140} t="RC receiver" s="ELRS / CRSF (UART)" tone="e" />
      <Arrow d="M488 162 H452" />
      <Box x={490} y={250} t="Telemetry / video" s="MAVLink, VTX" tone="e" />
      <Arrow d="M452 175 C470 200, 480 240, 488 268" />
      <Box x={330} y={250} t="Companion computer" s="Pi / Jetson, ROS 2" tone="e" />
      <Arrow d="M390 250 V186" label="MAVLink" lx={425} ly={228} />
      <Box x={170} y={250} t="Airframe" s="carbon, vibration path" tone="d" />
      <text x={600} y={110} className="fs" textAnchor="middle">Physics: rigid body</text>
      <path d="M550 66 C620 90, 620 200, 580 250" className="fdash" />
    </Fig>
  );
}

export function CascadeFig() {
  return (
    <Fig caption="Cascaded attitude control. The inner rate loop runs fastest (1–8 kHz); each outer loop is ≥5× slower than the loop it commands." vb="0 0 720 200">
      <Defs />
      <text x={8} y={72} className="fs">angle sp</text>
      <circle cx={80} cy={68} r={12} className="fsum" /><text x={80} y={72} textAnchor="middle" className="ft">Σ</text>
      <Arrow d="M48 68 H66" />
      <Box x={110} y={46} w={110} t="Angle P" s="~100–500 Hz" tone="c" />
      <Arrow d="M92 68 H108" />
      <circle cx={260} cy={68} r={12} className="fsum" /><text x={260} y={72} textAnchor="middle" className="ft">Σ</text>
      <Arrow d="M220 68 H246" label="rate sp" lx={233} ly={58} />
      <Box x={290} y={46} w={110} t="Rate PID" s="1–8 kHz" tone="a" />
      <Arrow d="M272 68 H288" />
      <Box x={430} y={46} w={90} t="Mixer" s="τ → T₁…T₄" tone="b" />
      <Arrow d="M400 68 H428" />
      <Box x={550} y={46} w={150} t="ESC + motor + body" s="lag Tm, inertia J" tone="d" />
      <Arrow d="M520 68 H548" />
      <path d="M700 90 V150 H260 V82" className="farrow" markerEnd="url(#ah)" />
      <text x={470} y={145} className="fs" textAnchor="middle">gyro rate ω (fast, from IMU)</text>
      <path d="M690 90 V180 H80 V82" className="farrow" markerEnd="url(#ah)" />
      <text x={400} y={194} className="fs" textAnchor="middle">estimated angle θ̂ (from attitude estimator)</text>
    </Fig>
  );
}

export function BridgeFig() {
  const leg = (x, ph, hi, lo) => (
    <g key={ph}>
      <line x1={x} y1={30} x2={x} y2={60} className="fw" />
      <rect x={x - 22} y={60} width={44} height={44} rx="6" className={'fbox ' + (hi ? 'b' : 'e')} />
      <text x={x} y={87} textAnchor="middle" className="ft">{ph}H</text>
      <line x1={x} y1={104} x2={x} y2={146} className="fw" />
      <circle cx={x} cy={125} r={4} className="fdot" />
      <line x1={x} y1={125} x2={x + 60} y2={125} className="fw" />
      <text x={x + 64} y={129} className="ft">{ph}</text>
      <rect x={x - 22} y={146} width={44} height={44} rx="6" className={'fbox ' + (lo ? 'b' : 'e')} />
      <text x={x} y={173} textAnchor="middle" className="ft">{ph}L</text>
      <line x1={x} y1={190} x2={x} y2={220} className="fw" />
    </g>
  );
  return (
    <Fig caption="Three half-bridges. Shown: step 'A high, B low, C floating' — current flows A→B, and the ESC listens to C's back-EMF to time the next step." vb="0 0 620 250">
      <line x1={40} y1={30} x2={560} y2={30} className="frail p" /><text x={10} y={26} className="fs">+Vbat</text>
      <line x1={40} y1={220} x2={560} y2={220} className="frail n" /><text x={10} y={240} className="fs">GND</text>
      {leg(120, 'A', true, false)}{leg(290, 'B', false, true)}{leg(460, 'C', false, false)}
      <text x={560} y={246} className="fs" textAnchor="end">pink = ON · grey = OFF</text>
    </Fig>
  );
}

export function QuadFig() {
  return (
    <Fig caption="Motor numbering and spin used in this course (seen from above). Firmware numbering differs: always check the motor diagram of the firmware you use." vb="0 0 300 260">
      <Defs />
      <line x1={80} y1={60} x2={220} y2={200} className="fw" /><line x1={220} y1={60} x2={80} y2={200} className="fw" />
      <polygon points="150,22 140,40 160,40" className="fhead" /><text x={150} y={16} textAnchor="middle" className="fs">front (x)</text>
      {[[220, 60, 'M1', 'CW'], [220, 200, 'M2', 'CCW'], [80, 200, 'M3', 'CW'], [80, 60, 'M4', 'CCW']].map(([x, y, n, r]) => (
        <g key={n}>
          <circle cx={x} cy={y} r={34} className={'fbox ' + (r === 'CW' ? 'a' : 'b')} />
          <text x={x} y={y - 2} textAnchor="middle" className="ft">{n}</text>
          <text x={x} y={y + 14} textAnchor="middle" className="fs">{r}</text>
        </g>
      ))}
      <Arrow d="M150 130 H200" label="y (right)" lx={240} ly={134} />
    </Fig>
  );
}

export const FIGS = { system: SystemFig, cascade: CascadeFig, bridge: BridgeFig, quad: QuadFig, ...FIGS2 };
