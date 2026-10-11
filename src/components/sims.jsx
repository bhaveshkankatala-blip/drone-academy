import React, { useMemo, useState } from 'react';
import * as Ph from '../lib/physics.js';
import { LineChart, Slider, Stat, fmt, Tex } from './ui.jsx';

const C = { a: '#22d3ee', b: '#f472b6', c: '#a3e635', d: '#fbbf24', e: '#94a3b8' };

function SimShell({ title, intro, children, tryThis }) {
  return (
    <div className="sim">
      <h3>{title}</h3>
      {intro && <p className="muted">{intro}</p>}
      {children}
      {tryThis && (
        <div className="try"><b>Try this:</b><ul>{tryThis.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
      )}
    </div>
  );
}

export function HoverSim() {
  const [m, setM] = useState(1.2), [d, setD] = useState(10), [fm, setFm] = useState(0.6), [eta, setEta] = useState(0.8), [alt, setAlt] = useState(0), [cells, setCells] = useState(4);
  const rho = Ph.airDensity(alt, 30);
  const h = Ph.hoverPower({ massKg: m, diameterM: d * 0.0254, fm, etaDrive: eta, rho, packV: cells * 3.7 });
  const sweep = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((p) => [p, Ph.hoverPower({ massKg: m, diameterM: p * 0.0254, fm, etaDrive: eta, rho }).pElec]);
  return (
    <SimShell title="Hover power calculator (momentum theory)" intro="Change mass and prop size and watch the electrical power needed just to hover. Air density uses an ISA model at 30 °C (a Warangal summer afternoon)."
      tryThis={['Double the mass: power rises by 2^1.5 ≈ 2.83×, not 2×.', 'Go from 5″ to 10″ props at the same mass: big slow props win on efficiency.', 'Set altitude to 3000 m (Ladakh): thinner air costs ~20% more power (P ∝ 1/√ρ).']}>
      <div className="grid2">
        <div>
          <Slider label="All-up mass" value={m} min={0.25} max={5} step={0.05} unit="kg" onChange={setM} />
          <Slider label="Prop diameter" value={d} min={3} max={18} step={0.5} unit="in" onChange={setD} />
          <Slider label="Figure of merit (prop quality)" value={fm} min={0.4} max={0.8} step={0.01} onChange={setFm} />
          <Slider label="Motor × ESC efficiency" value={eta} min={0.5} max={0.95} step={0.01} onChange={setEta} />
          <Slider label="Altitude" value={alt} min={0} max={4000} step={100} unit="m" onChange={setAlt} />
          <Slider label="Battery cells (S)" value={cells} min={1} max={12} step={1} unit="S" onChange={setCells} />
        </div>
        <div className="stats">
          <Stat label="Air density ρ" value={fmt(rho, 3)} unit="kg/m³" />
          <Stat label="Thrust per rotor" value={fmt(h.thrustPerRotor)} unit="N" />
          <Stat label="Induced velocity vᵢ" value={fmt(h.vi)} unit="m/s" />
          <Stat label="Ideal power (all rotors)" value={fmt(h.pIdeal, 1)} unit="W" />
          <Stat label="Electrical hover power" value={fmt(h.pElec, 1)} unit="W" tone="hot" />
          <Stat label="Hover current" value={fmt(h.current, 1)} unit="A" />
          <Stat label="Efficiency" value={fmt(h.gPerW, 1)} unit="g/W" />
        </div>
      </div>
      <LineChart xLabel="Prop diameter (in)" yLabel="Hover power (W)" series={[{ name: 'Electrical hover power', color: C.a, pts: sweep }]} markers={[{ x: d, label: 'you' }]} />
    </SimShell>
  );
}

export function MixerSim() {
  const [thr, setThr] = useState(12), [roll, setRoll] = useState(0), [pitch, setPitch] = useState(0), [yaw, setYaw] = useState(0);
  const arm = 0.225, d = arm / Math.SQRT2, c = 0.016, tMax = 6;
  const raw = Ph.mixInverse({ thrust: thr, roll, pitch, yaw }, d, c);
  const sat = raw.some((t) => t > tMax || t < 0);
  const names = ['M1 front-right (CW)', 'M2 rear-right (CCW)', 'M3 rear-left (CW)', 'M4 front-left (CCW)'];
  const pos = [[150, 50], [150, 150], [50, 150], [50, 50]];
  return (
    <SimShell title="Motor mixer (X-quad)" intro="Command thrust and body torques; the mixer matrix turns them into four motor thrusts. Arm 225 mm, c = kτ/kf = 0.016 m, each motor limited to 6 N."
      tryThis={['Add yaw only: CCW motors (M2, M4) speed up, CW slow down, total thrust unchanged.', 'Ask for a big roll at high throttle: a motor saturates. That is why firmware has "airmode" and mixer prioritisation.', 'Note yaw needs ~10× more thrust difference than roll for the same torque, because c ≪ d.']}>
      <div className="grid2">
        <div>
          <Slider label="Total thrust T" value={thr} min={0} max={24} step={0.1} unit="N" onChange={setThr} />
          <Slider label="Roll torque τx (right side down +)" value={roll} min={-0.6} max={0.6} step={0.01} unit="N·m" onChange={setRoll} />
          <Slider label="Pitch torque τy (nose up +)" value={pitch} min={-0.6} max={0.6} step={0.01} unit="N·m" onChange={setPitch} />
          <Slider label="Yaw torque τz (nose right +)" value={yaw} min={-0.1} max={0.1} step={0.002} unit="N·m" onChange={setYaw} />
          {sat && <p className="warn">Saturation: at least one motor is asked for more than 6 N or less than 0. Real firmware must scale or prioritise.</p>}
        </div>
        <div>
          <svg viewBox="0 0 200 200" className="quad">
            <line x1="50" y1="50" x2="150" y2="150" className="arm" /><line x1="150" y1="50" x2="50" y2="150" className="arm" />
            <polygon points="100,22 92,36 108,36" className="nose" />
            {raw.map((t, i) => {
              const f = Math.max(0, Math.min(1, t / tMax));
              return (
                <g key={i}>
                  <circle cx={pos[i][0]} cy={pos[i][1]} r={30} className="prop" style={{ fill: `rgba(34,211,238,${0.1 + 0.6 * f})`, stroke: t > tMax || t < 0 ? '#f43f5e' : undefined }} />
                  <text x={pos[i][0]} y={pos[i][1] - 3} textAnchor="middle" className="ptxt">M{i + 1}</text>
                  <text x={pos[i][0]} y={pos[i][1] + 11} textAnchor="middle" className="ptxt">{t.toFixed(2)} N</text>
                </g>
              );
            })}
          </svg>
          <div className="stats">{raw.map((t, i) => <Stat key={i} label={names[i]} value={fmt(t)} unit="N" tone={t > tMax || t < 0 ? 'bad' : ''} />)}</div>
        </div>
      </div>
      <Tex block m={String.raw`\begin{bmatrix}T_1\\T_2\\T_3\\T_4\end{bmatrix}=\frac14\begin{bmatrix}1&-1/d&\phantom{-}1/d&-1/c\\1&-1/d&-1/d&\phantom{-}1/c\\1&\phantom{-}1/d&-1/d&-1/c\\1&\phantom{-}1/d&\phantom{-}1/d&\phantom{-}1/c\end{bmatrix}\begin{bmatrix}T\\\tau_x\\\tau_y\\\tau_z\end{bmatrix}`} />
    </SimShell>
  );
}

export function MotorSim() {
  const [kv, setKv] = useState(920), [v, setV] = useState(11.1), [r, setR] = useState(0.12), [i0, setI0] = useState(0.5), [amps, setA] = useState(10);
  const op = Ph.motorOperatingPoint({ kv, volts: v, amps, rOhm: r, i0 });
  const curve = [];
  for (let a = 0.6; a <= Math.min(80, (v / r) * 0.6); a += 0.5) curve.push([a, 100 * Ph.motorOperatingPoint({ kv, volts: v, amps: a, rOhm: r, i0 }).eff]);
  return (
    <SimShell title="BLDC motor operating point" intro="Steady-state model: V = I·R + ω/Kv,  torque = Kt·(I − I₀). Losses are copper (I²R) and no-load (I₀·back-EMF)."
      tryThis={['Peak efficiency sits at a moderate current: too low and I₀ losses dominate, too high and I²R does.', 'Lower Kv at the same voltage = more torque per amp (Kt = 9.549/Kv): spin bigger props.']}>
      <div className="grid2">
        <div>
          <Slider label="KV" value={kv} min={200} max={3000} step={10} unit="rpm/V" onChange={setKv} />
          <Slider label="Supply voltage" value={v} min={3.7} max={50.4} step={0.1} unit="V" onChange={setV} />
          <Slider label="Winding resistance R" value={r} min={0.01} max={0.5} step={0.005} unit="Ω" onChange={setR} />
          <Slider label="No-load current I₀" value={i0} min={0.1} max={3} step={0.05} unit="A" onChange={setI0} />
          <Slider label="Load current I" value={amps} min={0.6} max={60} step={0.1} unit="A" onChange={setA} />
        </div>
        <div className="stats">
          <Stat label="Kt" value={fmt(op.kt, 5)} unit="N·m/A" />
          <Stat label="Speed" value={fmt(op.rpm, 0)} unit="rpm" />
          <Stat label="Torque" value={fmt(op.torque, 4)} unit="N·m" />
          <Stat label="Input power" value={fmt(op.pIn, 1)} unit="W" />
          <Stat label="Output (shaft) power" value={fmt(op.pOut, 1)} unit="W" />
          <Stat label="Copper loss" value={fmt(op.pCopper, 1)} unit="W" tone="hot" />
          <Stat label="Efficiency" value={fmt(100 * op.eff, 1)} unit="%" tone="good" />
        </div>
      </div>
      <LineChart xLabel="Current (A)" yLabel="Efficiency (%)" yMin={0} yMax={100} series={[{ name: 'Efficiency vs current', color: C.c, pts: curve }]} markers={[{ x: amps, label: 'now' }]} />
    </SimShell>
  );
}

export function BatterySim() {
  const [cells, setCells] = useState(4), [mah, setMah] = useState(1500), [ir, setIr] = useState(8), [amps, setA] = useState(30), [usable, setU] = useState(0.8);
  const b = Ph.battery({ cells, mAh: mah, cellIrMilliOhm: ir, amps, usable });
  const sag = [];
  for (let a = 0; a <= 150; a += 5) sag.push([a, Ph.battery({ cells, mAh: mah, cellIrMilliOhm: ir, amps: a }).cellV]);
  return (
    <SimShell title="LiPo pack: sag, heat and flight time" intro="Pack internal resistance = cells × cell IR. Resting voltage assumed 3.8 V/cell (mid-discharge). Usable fraction protects the cells; 80% is the industry habit."
      tryThis={['Push current to 100 A on an 8 mΩ/cell 4S pack: per-cell voltage drops toward 3.0 V — that triggers low-voltage warnings mid-punch.', 'Old packs have 2–3× the IR. See how heat (I²R) explodes.']}>
      <div className="grid2">
        <div>
          <Slider label="Cells in series (S)" value={cells} min={1} max={12} step={1} unit="S" onChange={setCells} />
          <Slider label="Capacity" value={mah} min={300} max={22000} step={100} unit="mAh" onChange={setMah} />
          <Slider label="Cell internal resistance" value={ir} min={2} max={40} step={0.5} unit="mΩ" onChange={setIr} />
          <Slider label="Average current" value={amps} min={1} max={150} step={1} unit="A" onChange={setA} />
          <Slider label="Usable fraction" value={usable} min={0.5} max={0.95} step={0.05} onChange={setU} />
        </div>
        <div className="stats">
          <Stat label="Energy (nominal)" value={fmt(b.wh, 1)} unit="Wh" />
          <Stat label="C-rate at this current" value={fmt(amps / (mah / 1000), 1)} unit="C" />
          <Stat label="Voltage sag" value={fmt(b.sag, 2)} unit="V" />
          <Stat label="Loaded cell voltage" value={fmt(b.cellV, 2)} unit="V/cell" tone={b.cellV < 3.3 ? 'bad' : ''} />
          <Stat label="Heat inside pack" value={fmt(b.heatW, 1)} unit="W" tone="hot" />
          <Stat label="Flight time" value={fmt(b.minutes, 1)} unit="min" tone="good" />
        </div>
      </div>
      <LineChart xLabel="Current (A)" yLabel="Loaded cell voltage (V)" yMin={2.5} yMax={4.0} series={[{ name: 'Cell voltage under load', color: C.d, pts: sag }, { name: '3.3 V warning', color: '#f43f5e', dash: '6 4', pts: [[0, 3.3], [150, 3.3]] }]} />
    </SimShell>
  );
}

export function FilterSim() {
  const [alpha, setAlpha] = useState(0.98), [bias, setBias] = useState(0.5), [vib, setVib] = useState(4);
  const s = useMemo(() => Ph.simulateCompFilter({ alpha, gyroBias: bias, vib }), [alpha, bias, vib]);
  const rms = (k) => Math.sqrt(s.reduce((a, p) => a + (p[k] - p.truth) ** 2, 0) / s.length);
  const { tau, fc } = Ph.compFilterTau(alpha, 0.004);
  return (
    <SimShell title="Complementary filter, live" intro="A drone tilts through a manoeuvre (black). The gyro is integrated (drifts because of bias), the accelerometer angle is noisy and shaken by 23 Hz frame vibration. The filter blends them. Loop at 250 Hz."
      tryThis={['α → 0.999: very smooth but slow to remove drift.', 'α → 0.9: drift gone but vibration leaks through.', 'Set bias to 0: pure gyro looks perfect — real MEMS gyros are never that kind.']}>
      <div className="grid2">
        <div>
          <Slider label="α (trust in gyro)" value={alpha} min={0.8} max={0.999} step={0.001} onChange={setAlpha} />
          <Slider label="Gyro bias" value={bias} min={0} max={2} step={0.05} unit="°/s" onChange={setBias} />
          <Slider label="Vibration amplitude on accel" value={vib} min={0} max={15} step={0.5} unit="°" onChange={setVib} />
        </div>
        <div className="stats">
          <Stat label="Time constant τ" value={fmt(tau, 3)} unit="s" />
          <Stat label="Crossover frequency" value={fmt(fc, 2)} unit="Hz" />
          <Stat label="RMS error gyro-only" value={fmt(rms('gyroOnly'), 2)} unit="°" tone="bad" />
          <Stat label="RMS error accel-only" value={fmt(rms('acc'), 2)} unit="°" tone="bad" />
          <Stat label="RMS error fused" value={fmt(rms('fused'), 2)} unit="°" tone="good" />
        </div>
      </div>
      <LineChart xLabel="Time (s)" yLabel="Roll angle (°)" yMin={-20} yMax={45} series={[
        { name: 'Accel angle', color: C.e, opacity: 0.35, width: 1, pts: s.map((p) => [p.t, p.acc]) },
        { name: 'Gyro integrated', color: C.b, pts: s.map((p) => [p.t, p.gyroOnly]) },
        { name: 'Fused', color: C.a, width: 2.5, pts: s.map((p) => [p.t, p.fused]) },
        { name: 'Truth', color: '#e5e7eb', dash: '5 4', pts: s.map((p) => [p.t, p.truth]) },
      ]} />
    </SimShell>
  );
}

export function PidSim() {
  const [kp, setKp] = useState(12), [ki, setKi] = useState(20), [kd, setKd] = useState(0.2), [dhz, setDhz] = useState(100), [noise, setNoise] = useState(0), [tm, setTm] = useState(30);
  const s = useMemo(() => Ph.simulateRateLoop({ kp: kp / 1000, ki: ki / 1000, kd: kd / 1000, dTermHz: dhz, noiseDps: noise, tm: tm / 1000 }), [kp, ki, kd, dhz, noise, tm]);
  const m = Ph.stepMetrics(s.filter((p) => p.t < 0.6), 100);
  const uRms = Math.sqrt(s.filter((p) => p.t > 0.15 && p.t < 0.6).reduce((a, p, _, arr) => a + p.u * p.u / arr.length, 0));
  return (
    <SimShell title="Rate-loop PID tuner" intro="One axis of a quad: 100 °/s step at t = 0.02 s, a wind gust at t = 0.6 s. Motor/prop response is a first-order lag; motor command saturates at ±1. Gains shown ×1000."
      tryThis={['P = 30, D = 0: ringing (~30% overshoot). Now add D ≈ 0.4: it calms down — D adds phase lead.', 'Add gyro noise 20 °/s and raise D: look at how jittery the motor command gets (hot motors in real life). Lower the D-term filter and see the trade-off with delay.', 'Set I = 0 and watch the gust leave a permanent error. I fixes it.', 'Slow motors (Tm = 60 ms, big props): the same gains now overshoot. Big drones need different tunes.']}>
      <div className="grid2">
        <div>
          <Slider label="P" value={kp} min={0} max={40} step={0.5} onChange={setKp} />
          <Slider label="I" value={ki} min={0} max={60} step={1} onChange={setKi} />
          <Slider label="D" value={kd} min={0} max={1} step={0.01} onChange={setKd} />
          <Slider label="D-term low-pass cutoff" value={dhz} min={10} max={500} step={5} unit="Hz" onChange={setDhz} />
          <Slider label="Gyro noise" value={noise} min={0} max={40} step={1} unit="°/s" onChange={setNoise} />
          <Slider label="Motor time constant Tm" value={tm} min={10} max={80} step={1} unit="ms" onChange={setTm} />
        </div>
        <div className="stats">
          <Stat label="Overshoot" value={fmt(m.overshootPct, 1)} unit="%" tone={m.overshootPct > 15 ? 'bad' : 'good'} />
          <Stat label="Rise time (10→90%)" value={fmt(m.riseMs, 0)} unit="ms" />
          <Stat label="Motor command RMS (noise → heat)" value={fmt(uRms, 2)} tone={uRms > 0.5 ? 'hot' : ''} />
        </div>
      </div>
      <LineChart xLabel="Time (s)" yLabel="Roll rate (°/s)" series={[
        { name: 'Setpoint', color: '#e5e7eb', dash: '5 4', pts: s.map((p) => [p.t, p.sp]) },
        { name: 'Gyro rate', color: C.a, width: 2.5, pts: s.map((p) => [p.t, p.w]) },
      ]} markers={[{ x: 0.6, label: 'gust' }]} />
      <LineChart height={180} xLabel="Time (s)" yLabel="Motor cmd" yMin={-1} yMax={1} series={[{ name: 'Controller output u (±1)', color: C.d, width: 1.2, pts: s.map((p) => [p.t, p.u]) }]} />
    </SimShell>
  );
}

export function LinkSim() {
  const [band, setBand] = useState('2.4'), [p, setP] = useState(24), [g1, setG1] = useState(2), [g2, setG2] = useState(2), [loss, setLoss] = useState(2), [sens, setSens] = useState(-105), [margin, setMargin] = useState(10), [dKm, setD] = useState(2);
  const fHz = { '0.866': 866e6, '2.4': 2.44e9, '5.8': 5.8e9 }[band];
  const r = Ph.linkBudget({ ptxDbm: p, gtx: g1, grx: g2, lossDb: loss, sensDbm: sens, fHz, dM: dKm * 1000, marginDb: margin });
  const pts = []; for (let k = 0.1; k <= 30; k += 0.1) pts.push([k, p + g1 + g2 - loss - Ph.fspl(k * 1000, fHz)]);
  return (
    <SimShell title="RF link budget" intro="Received power = Ptx + Gtx + Grx − losses − FSPL. Free-space only: trees, bodies and terrain cost another 10–30 dB in practice. Receiver sensitivity values are illustrative; check your link's datasheet for the packet rate you use."
      tryThis={['Same everything, switch 2.4 GHz → 866 MHz: range ×2.8 (FSPL ∝ f²).', 'Each +6 dB doubles range. Doubling power is only +3 dB.', 'A 10 dB fade margin cuts free-space range to ~32%.']}>
      <div className="grid2">
        <div>
          <div className="seg">{['0.866', '2.4', '5.8'].map((b) => <button key={b} className={band === b ? 'on' : ''} onClick={() => setBand(b)}>{b === '0.866' ? '866 MHz (India sub-GHz)' : b + ' GHz'}</button>)}</div>
          <Slider label="Tx power" value={p} min={0} max={33} step={1} unit={`dBm (${fmt(Ph.dbmToMw(p), 0)} mW)`} onChange={setP} />
          <Slider label="Tx antenna gain" value={g1} min={-3} max={14} step={0.5} unit="dBi" onChange={setG1} />
          <Slider label="Rx antenna gain" value={g2} min={-3} max={14} step={0.5} unit="dBi" onChange={setG2} />
          <Slider label="Cable / polarisation loss" value={loss} min={0} max={20} step={0.5} unit="dB" onChange={setLoss} />
          <Slider label="Rx sensitivity" value={sens} min={-130} max={-80} step={1} unit="dBm" onChange={setSens} />
          <Slider label="Fade margin" value={margin} min={0} max={30} step={1} unit="dB" onChange={setMargin} />
          <Slider label="Distance" value={dKm} min={0.1} max={30} step={0.1} unit="km" onChange={setD} />
        </div>
        <div className="stats">
          <Stat label="FSPL at distance" value={fmt(r.fspl, 1)} unit="dB" />
          <Stat label="Received power" value={fmt(r.prx, 1)} unit="dBm" />
          <Stat label="Margin over sensitivity" value={fmt(r.margin, 1)} unit="dB" tone={r.margin < margin ? 'bad' : 'good'} />
          <Stat label="Max range with margin" value={fmt(r.maxRangeM / 1000, 2)} unit="km" tone="good" />
        </div>
      </div>
      <LineChart xLabel="Distance (km)" yLabel="Received power (dBm)" series={[
        { name: 'Received power', color: C.a, pts },
        { name: 'Sensitivity', color: '#f43f5e', dash: '6 4', pts: [[0.1, sens], [30, sens]] },
        { name: 'Sensitivity + margin', color: C.d, dash: '3 3', pts: [[0.1, sens + margin], [30, sens + margin]] },
      ]} markers={[{ x: dKm, label: 'you' }]} />
    </SimShell>
  );
}

export function SizingSim() {
  const [rot, setRot] = useState(4), [prop, setProp] = useState(10), [base, setBase] = useState(0.75), [pay, setPay] = useState(0.3), [batt, setBatt] = useState(0.45), [wh, setWh] = useState(150), [fm, setFm] = useState(0.6), [eta, setEta] = useState(0.8), [twr, setTwr] = useState(2);
  const s = Ph.sizing({ rotors: rot, propIn: prop, baseKg: base, payloadKg: pay, battKg: batt, whPerKg: wh, fm, etaDrive: eta, twr });
  const curve = []; for (let b = 0.05; b <= 3; b += 0.05) curve.push([b, Ph.sizing({ rotors: rot, propIn: prop, baseKg: base, payloadKg: pay, battKg: b, whPerKg: wh, fm, etaDrive: eta }).minutes]);
  const best = curve.reduce((a, c) => (c[1] > a[1] ? c : a), [0, 0]);
  return (
    <SimShell title="First-pass sizing tool" intro="The loop every drone design starts with: guess masses → hover power → flight time → motor thrust spec. Base mass = frame + motors + ESCs + FC + wiring. Avionics draw fixed at 8 W."
      tryThis={['Keep adding battery: flight time peaks then FALLS — the extra battery mass costs more power than it gives energy.', 'Swap LiPo (150 Wh/kg) for Li-ion 21700 packs (~200–230 Wh/kg): the endurance builders\' trick.', 'Hex (6 rotors) with the same props: smaller disk loading per rotor, more redundancy, more mass.']}>
      <div className="grid2">
        <div>
          <Slider label="Rotors" value={rot} min={3} max={8} step={1} onChange={setRot} />
          <Slider label="Prop diameter" value={prop} min={3} max={20} step={0.5} unit="in" onChange={setProp} />
          <Slider label="Base mass (no battery, no payload)" value={base} min={0.1} max={5} step={0.05} unit="kg" onChange={setBase} />
          <Slider label="Payload" value={pay} min={0} max={5} step={0.05} unit="kg" onChange={setPay} />
          <Slider label="Battery mass" value={batt} min={0.05} max={3} step={0.05} unit="kg" onChange={setBatt} />
          <Slider label="Pack specific energy" value={wh} min={100} max={260} step={5} unit="Wh/kg" onChange={setWh} />
          <Slider label="Figure of merit" value={fm} min={0.4} max={0.8} step={0.01} onChange={setFm} />
          <Slider label="Motor × ESC efficiency" value={eta} min={0.5} max={0.95} step={0.01} onChange={setEta} />
          <Slider label="Thrust-to-weight target" value={twr} min={1.5} max={8} step={0.1} onChange={setTwr} />
        </div>
        <div className="stats">
          <Stat label="All-up weight" value={fmt(s.auw * 1000, 0)} unit="g" />
          <Stat label="Hover power" value={fmt(s.pHover, 0)} unit="W" />
          <Stat label="Hover thrust / motor" value={fmt(s.hoverPerMotorG, 0)} unit="g" />
          <Stat label="Max thrust spec / motor" value={fmt(s.thrustMaxPerMotorG, 0)} unit="g" tone="hot" />
          <Stat label="Estimated flight time" value={fmt(s.minutes, 1)} unit="min" tone="good" />
          <Stat label="Best battery mass" value={fmt(best[0] * 1000, 0)} unit={`g → ${fmt(best[1], 1)} min`} />
        </div>
      </div>
      <LineChart xLabel="Battery mass (kg)" yLabel="Flight time (min)" series={[{ name: 'Flight time', color: C.c, pts: curve }]} markers={[{ x: batt, label: 'you' }]} />
      <p className="muted small">Momentum theory is optimistic for real props in forward flight and wind; treat this as a ±25% first pass, then confirm with motor thrust tables and a tethered hover test.</p>
    </SimShell>
  );
}

export const SIMS = { hover: HoverSim, mixer: MixerSim, motor: MotorSim, battery: BatterySim, filter: FilterSim, pid: PidSim, link: LinkSim, sizing: SizingSim };
