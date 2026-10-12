import React from 'react';

// Second set of engineering figures (one or more per module). Same visual language as figures.jsx.
const Fig = ({ caption, vb, children }) => (
  <figure className="fig"><svg viewBox={vb} role="img" aria-label={caption}>{children}</svg><figcaption>{caption}</figcaption></figure>
);
const Box = ({ x, y, w = 120, h = 44, t, s, tone = 'a' }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="8" className={'fbox ' + tone} />
    <text x={x + w / 2} y={y + (s ? 19 : 27)} textAnchor="middle" className="ft">{t}</text>
    {s && <text x={x + w / 2} y={y + 35} textAnchor="middle" className="fs">{s}</text>}
  </g>
);
const Ar = ({ d, l, lx, ly }) => (
  <g><path d={d} className="farrow" markerEnd="url(#ah2)" />{l && <text x={lx} y={ly} className="fs" textAnchor="middle">{l}</text>}</g>
);
const Defs = () => (
  <defs>
    <marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" className="fhead" /></marker>
  </defs>
);
const T = ({ x, y, c = 'fs', a = 'middle', children }) => <text x={x} y={y} className={c} textAnchor={a}>{children}</text>;

/* Physics: actuator disk stream tube */
export function ActuatorFig() {
  return (
    <Fig caption="Momentum theory: still air above, induced velocity vᵢ at the disk, and the wake accelerated to 2vᵢ with a contracted tube (area halves)." vb="0 0 520 300">
      <Defs />
      <path d="M150 20 C170 110, 200 130, 210 150 L215 285" className="fdash" /><path d="M370 20 C350 110, 320 130, 310 150 L305 285" className="fdash" />
      <rect x={180} y={146} width={160} height={8} className="fbox b" />
      <T x={260} y={140} c="ft">disk, area A</T>
      <Ar d="M260 30 V70" /><T x={300} y={52} a="start">V ≈ 0 far above</T>
      <Ar d="M260 160 V200" /><T x={300} y={185} a="start">vᵢ at the disk</T>
      <Ar d="M260 230 V280" /><T x={300} y={262} a="start">w = 2vᵢ in the wake</T>
      <T x={80} y={150} c="ft">T = ṁ·w</T><T x={80} y={170}>ṁ = ρAvᵢ</T><T x={80} y={190}>P = T·vᵢ</T>
    </Fig>
  );
}

/* Dynamics: frames */
export function FramesFig() {
  return (
    <Fig caption="World frame (NED: north, east, down) and body frame (forward, right, down). Attitude is the rotation R between them." vb="0 0 520 240">
      <Defs />
      <T x={110} y={24} c="ft">World (NED)</T>
      <Ar d="M110 130 H200" /><T x={212} y={134} a="start">N (x)</T>
      <Ar d="M110 130 L60 180" /><T x={50} y={198}>E (y)</T>
      <Ar d="M110 130 V215" /><T x={124} y={220} a="start">D (z)</T>
      <g transform="translate(360 120) rotate(-20)">
        <rect x={-60} y={-12} width={120} height={24} rx="8" className="fbox a" />
        <Ar d="M0 0 H95" /><Ar d="M0 0 L-45 50" /><Ar d="M0 0 V80" />
      </g>
      <T x={360} y={24} c="ft">Body</T><T x={470} y={92}>x forward</T><T x={330} y={186}>y right</T><T x={395} y={214}>z down</T>
      <path d="M215 70 C260 40, 300 40, 330 70" className="farrow" markerEnd="url(#ah2)" /><T x={272} y={36} c="ft">R (quaternion)</T>
    </Fig>
  );
}

/* Motors */
export function OutrunnerFig() {
  const n = 14, teeth = 12;
  return (
    <Fig caption="Outrunner cross-section: 12 wound stator teeth inside a spinning bell of 14 alternating magnets (12N14P). Magnets at large radius give torque at low speed." vb="0 0 300 300">
      <circle cx={150} cy={150} r={130} className="fbox e" />
      {Array.from({ length: n }, (_, i) => { const a = (i / n) * 2 * Math.PI; return <rect key={i} x={150 + 112 * Math.cos(a) - 9} y={150 + 112 * Math.sin(a) - 7} width={18} height={14} transform={`rotate(${(a * 180) / Math.PI + 90} ${150 + 112 * Math.cos(a)} ${150 + 112 * Math.sin(a)})`} className={'fbox ' + (i % 2 ? 'b' : 'a')} />; })}
      {Array.from({ length: teeth }, (_, i) => { const a = (i / teeth) * 2 * Math.PI; return <line key={i} x1={150 + 35 * Math.cos(a)} y1={150 + 35 * Math.sin(a)} x2={150 + 92 * Math.cos(a)} y2={150 + 92 * Math.sin(a)} className="fw" style={{ strokeWidth: 9 }} />; })}
      <circle cx={150} cy={150} r={30} className="fbox d" /><T x={150} y={154} c="ft">shaft</T>
      <T x={150} y={292}>pink = N · cyan = S · grey = stator teeth with coils</T>
    </Fig>
  );
}
export function TorqueSpeedFig() {
  return (
    <Fig caption="DC-motor view of a BLDC at fixed voltage: speed falls linearly with torque (slope set by R); efficiency peaks at moderate load." vb="0 0 520 260">
      <line x1={60} y1={220} x2={500} y2={220} className="fw" /><line x1={60} y1={220} x2={60} y2={20} className="fw" />
      <T x={280} y={250}>torque τ (∝ current)</T><T x={30} y={120} a="middle">rpm</T>
      <path d="M60 40 L480 210" className="farrow" style={{ stroke: 'var(--accent)' }} /><T x={120} y={36} a="start">no-load rpm ≈ KV·V</T>
      <path d="M60 220 C120 60, 200 50, 300 80 S460 190, 480 210" className="farrow" style={{ stroke: 'var(--good)' }} />
      <T x={250} y={60}>efficiency</T><line x1={185} y1={50} x2={185} y2={220} className="fdash" /><T x={185} y={236}>η max at I≈√(I₀V/R)</T>
      <T x={470} y={200} a="end">stall: I = V/R</T>
    </Fig>
  );
}

/* ESC six-step waveforms */
export function SixStepFig() {
  const step = 70, x0 = 70;
  const wave = (pat, y) => {
    let d = `M${x0} ${y}`;
    pat.forEach((v, i) => { const yy = v === 1 ? y - 25 : v === -1 ? y + 25 : null; const xs = x0 + i * step; if (yy === null) d += ` L${xs} ${y} L${xs + step} ${y}`; else d += ` L${xs} ${yy} L${xs + step} ${yy}`; });
    return d;
  };
  const A = [1, 1, 0, -1, -1, 0], B = [-1, 0, 1, 1, 0, -1], C = [0, -1, -1, 0, 1, 1];
  return (
    <Fig caption="Six-step drive: each phase is high (+), low (−) or floating (flat) for 120° blocks. The floating segment is where back-EMF zero-crossing is sensed." vb="0 0 520 280">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={x0 + i * step} y1={20} x2={x0 + i * step} y2={250} className="fdash" />)}
      {[1, 2, 3, 4, 5, 6].map((i) => <T key={i} x={x0 + (i - 0.5) * step} y={268}>step {i}</T>)}
      <path d={wave(A, 60)} className="farrow" style={{ stroke: 'var(--accent)' }} /><T x={40} y={64} c="ft">A</T>
      <path d={wave(B, 140)} className="farrow" style={{ stroke: 'var(--accent2)' }} /><T x={40} y={144} c="ft">B</T>
      <path d={wave(C, 220)} className="farrow" style={{ stroke: 'var(--warn)' }} /><T x={40} y={224} c="ft">C</T>
    </Fig>
  );
}

/* Power tree */
export function PowerTreeFig() {
  return (
    <Fig caption="Power tree of a drone. The pack is a Thevenin source (EMF + internal resistance); high current goes to ESCs, low-noise rails are derived for the electronics." vb="0 0 640 300">
      <Defs />
      <rect x={20} y={110} width={110} height={90} rx="10" className="fbox d" /><T x={75} y={132} c="ft">LiPo pack</T>
      <circle cx={55} cy={165} r={13} className="fbox e" /><T x={55} y={169} c="ft">E</T>
      <rect x={80} y={158} width={34} height={14} className="fbox e" /><T x={97} y={192}>R_int</T>
      <Ar d="M130 155 H170" /><Box x={170} y={132} w={120} t="Current sensor" s="shunt / Hall → ADC" tone="c" />
      <Ar d="M290 155 H320" /><Box x={320} y={40} w={130} t="4 × ESC" s="tens of amps" tone="b" />
      <Ar d="M320 155 C310 120, 310 80, 320 62" />
      <Box x={320} y={132} w={130} t="Buck BEC 5 V" s="~90% efficient" tone="a" /><Ar d="M450 155 H480" />
      <Box x={480} y={110} w={140} t="FC, RX, GPS" s="5 V rail" tone="a" />
      <Box x={480} y={200} w={140} t="LDO 3.3 V" s="low-noise → MCU, IMU" tone="c" /><Ar d="M450 160 C470 190, 470 215, 480 222" />
      <Box x={320} y={230} w={130} t="Buck 9–12 V" s="video / camera" tone="e" /><Ar d="M320 160 C300 200, 300 240, 320 252" />
      <rect x={140} y={230} width={120} height={44} rx="8" className="fbox e" /><T x={200} y={250} c="ft">Low-ESR cap</T><T x={200} y={266}>absorbs spikes</T>
    </Fig>
  );
}

/* Sensing */
export function CompFilterFig() {
  return (
    <Fig caption="Complementary filter as two filters: the integrated gyro is high-passed, the accelerometer angle is low-passed, and they add back to the true angle at all frequencies." vb="0 0 640 210">
      <Defs />
      <Box x={10} y={30} w={100} t="Gyro ω" s="fast, drifts" tone="a" /><Ar d="M110 52 H150" />
      <Box x={150} y={30} w={80} t="∫ dt" tone="e" /><Ar d="M230 52 H270" />
      <Box x={270} y={30} w={150} t="High-pass" s="τs/(τs+1)" tone="a" /><Ar d="M420 52 C460 52, 470 90, 495 100" />
      <Box x={10} y={130} w={100} t="Accel" s="noisy, absolute" tone="b" /><Ar d="M110 152 H150" />
      <Box x={150} y={130} w={80} t="atan2" tone="e" /><Ar d="M230 152 H270" />
      <Box x={270} y={130} w={150} t="Low-pass" s="1/(τs+1)" tone="b" /><Ar d="M420 152 C460 152, 470 115, 495 106" />
      <circle cx={510} cy={103} r={14} className="fsum" /><T x={510} y={108} c="ft">Σ</T><Ar d="M524 103 H580" /><T x={608} y={107} c="ft">θ̂</T>
    </Fig>
  );
}
export function KalmanFig() {
  return (
    <Fig caption="Kalman filter loop. Predict grows uncertainty using the motion model (Q); update shrinks it using a measurement (R) weighted by the Kalman gain." vb="0 0 600 240">
      <Defs />
      <Box x={40} y={90} w={190} h={60} t="PREDICT" s="x̂⁻ = Fx̂ + Bu · P⁻ = FPFᵀ + Q" tone="a" />
      <Box x={370} y={90} w={200} h={60} t="UPDATE" s="K = P⁻Hᵀ(HP⁻Hᵀ+R)⁻¹" tone="b" />
      <Ar d="M230 105 C290 60, 320 60, 370 105" l="prior (x̂⁻, P⁻)" lx={300} ly={52} />
      <Ar d="M370 140 C320 190, 290 190, 230 140" l="posterior (x̂, P) → next step" lx={300} ly={205} />
      <Ar d="M470 30 V88" /><T x={470} y={22} c="ft">measurement z (GPS, baro, mag)</T>
      <Ar d="M135 30 V88" /><T x={135} y={22} c="ft">IMU / control input u</T>
    </Fig>
  );
}

/* Control */
export function PidFig() {
  return (
    <Fig caption="A flight-ready PID: derivative taken on the measurement and low-pass filtered, integrator clamped, feedforward from the setpoint, output saturated." vb="0 0 660 260">
      <Defs />
      <T x={20} y={64} a="start" c="ft">setpoint</T><circle cx={110} cy={60} r={13} className="fsum" /><T x={110} y={65} c="ft">Σ</T><Ar d="M78 60 H96" />
      <Ar d="M123 60 H170" l="e" lx={146} ly={52} />
      <Box x={170} y={10} w={110} t="Kp" tone="a" /><Box x={170} y={70} w={110} t="Ki ∫ (clamped)" tone="a" />
      <Ar d="M150 60 C155 32, 160 32, 170 32" /><Ar d="M150 60 C155 88, 160 92, 170 92" />
      <Box x={170} y={140} w={110} t="Kd · d/dt" s="on measurement" tone="b" /><Box x={300} y={140} w={90} t="LPF" s="D-term filter" tone="b" />
      <Ar d="M280 162 H300" /><Box x={170} y={200} w={110} t="Kff · d/dt" s="feedforward" tone="c" />
      <circle cx={440} cy={100} r={14} className="fsum" /><T x={440} y={105} c="ft">Σ</T>
      <Ar d="M280 32 C380 32, 420 60, 432 88" /><Ar d="M280 92 H426" /><Ar d="M390 162 C420 162, 432 130, 436 114" /><Ar d="M280 222 C420 222, 440 150, 442 114" />
      <Box x={480} y={78} w={90} t="clip ±1" tone="e" /><Ar d="M454 100 H480" /><Ar d="M570 100 H640" l="u → mixer" lx={605} ly={92} />
      <T x={110} y={250} c="ft">gyro measurement</T><path d="M60 236 H150 V162 H170" className="farrow" markerEnd="url(#ah2)" /><path d="M110 236 V74" className="farrow" markerEnd="url(#ah2)" />
    </Fig>
  );
}

/* Firmware */
export function FcMapFig() {
  return (
    <Fig caption="Flight-controller peripheral map: which MCU block talks to which device." vb="0 0 660 320">
      <Defs />
      <rect x={250} y={100} width={160} height={120} rx="12" className="fbox a" /><T x={330} y={150} c="ft">STM32 MCU</T><T x={330} y={170}>Cortex-M7 + FPU</T><T x={330} y={188}>RTOS / scheduler</T>
      <Box x={20} y={20} w={150} t="IMU" s="SPI · data-ready IRQ" tone="c" /><Ar d="M170 42 C220 50, 240 90, 255 110" l="SPI" lx={215} ly={60} />
      <Box x={20} y={100} w={150} t="Baro + compass" s="I²C" tone="c" /><Ar d="M170 122 H248" l="I²C" lx={210} ly={116} />
      <Box x={20} y={180} w={150} t="GNSS · RX · telemetry" s="UARTs" tone="e" /><Ar d="M170 202 H248" l="UART" lx={210} ly={196} />
      <Box x={20} y={260} w={150} t="Battery V / I" s="ADC" tone="d" /><Ar d="M170 282 C220 270, 240 230, 260 218" l="ADC" lx={210} ly={262} />
      <Box x={490} y={20} w={150} t="4 × ESC" s="Timers + DMA → DShot" tone="b" /><Ar d="M410 112 C440 80, 460 50, 488 42" />
      <Box x={490} y={100} w={150} t="SD / flash" s="blackbox logs (SPI/SDIO)" tone="e" /><Ar d="M410 135 H488" />
      <Box x={490} y={180} w={150} t="USB" s="configurator" tone="e" /><Ar d="M410 180 C440 185, 460 195, 488 200" />
      <Box x={490} y={260} w={150} t="CAN (autopilots)" s="smart ESCs, GPS" tone="e" /><Ar d="M400 220 C440 250, 460 270, 488 280" />
    </Fig>
  );
}
export function FilterChainFig() {
  return (
    <Fig caption="Gyro signal path: analog anti-alias filter inside the IMU, sampling, RPM-tracked notches, then low-pass filters — each stage trades noise for delay." vb="0 0 700 140">
      <Defs />
      {[['IMU AAF', 'analog', 'c'], ['Sample', 'kHz', 'e'], ['RPM notches', 'f₁, 2f₁, 3f₁', 'b'], ['Dyn. notch', 'FFT peak', 'b'], ['PT1 LPF', 'gyro', 'a'], ['PID', 'D-term LPF', 'd']].map(([t, s, tone], i) => (
        <g key={t}><Box x={10 + i * 115} y={45} w={100} t={t} s={s} tone={tone} />{i < 5 && <Ar d={`M${110 + i * 115} 67 H${125 + i * 115}`} />}</g>
      ))}
      <T x={350} y={125}>more filtering → less noise but more phase lag in the control loop</T>
    </Fig>
  );
}

/* RF */
export function RfChainFig() {
  return (
    <Fig caption="RC signal chain from thumb to motor. Every hop adds latency; the radio hop decides range." vb="0 0 700 200">
      <Defs />
      {[['Gimbals', 'Hall / pot', 'e'], ['Radio MCU', 'ADC + mixer', 'a'], ['TX module', 'CRSF in', 'b'], ['RX', 'LoRa / FLRC', 'b'], ['Flight ctrl', 'CRSF over UART', 'a']].map(([t, s, tone], i) => (
        <g key={t}><Box x={10 + i * 140} y={40} w={115} t={t} s={s} tone={tone} />{i < 4 && i !== 2 && <Ar d={`M${125 + i * 140} 62 H${150 + i * 140}`} />}</g>
      ))}
      <path d="M405 62 C415 30, 425 94, 435 62 S445 30, 450 62" className="farrow" /><T x={428} y={20} c="ft">2.4 GHz / 866 MHz</T>
      <Ar d="M635 84 V140" /><Box x={560} y={140} w={130} t="ESCs → motors" tone="d" />
      <Ar d="M420 140 H560" /><T x={360} y={160} c="ft">telemetry back: RSSI, LQ, battery (MAVLink / CRSF)</T>
    </Fig>
  );
}
export function LinkBudgetFig() {
  const steps = [['Ptx', 24], ['+Gtx', 26], ['−cable', 25], ['−FSPL', -81], ['+Grx', -79]];
  const y = (v) => 40 + (30 - v) * 1.55;
  return (
    <Fig caption="Link budget as a staircase (dBm): gains and losses simply add. Range is fine while the last step stays above sensitivity plus fade margin." vb="0 0 560 300">
      <line x1={40} y1={y(-105)} x2={540} y2={y(-105)} className="frail p" style={{ strokeWidth: 2 }} /><T x={44} y={y(-105) + 16} a="start">receiver sensitivity −105 dBm</T>
      <line x1={40} y1={y(-95)} x2={540} y2={y(-95)} className="fdash" /><T x={44} y={y(-95) - 6} a="start">sensitivity + 10 dB fade margin</T>
      {steps.map(([l, v], i) => <g key={l}><rect x={60 + i * 95} y={y(v) - 3} width={80} height={6} className="fbox a" /><T x={100 + i * 95} y={y(v) - 10} c="ft">{l}</T><T x={100 + i * 95} y={y(v) + 18}>{v} dBm</T>{i > 0 && <line x1={60 + i * 95} y1={y(steps[i - 1][1])} x2={60 + i * 95} y2={y(v)} className="fdash" />}</g>)}
      <T x={540} y={y(-79) - 30} a="end">16 dB above sensitivity</T>
    </Fig>
  );
}

/* Design */
export function SizingLoopFig() {
  const items = [['Requirements', 'payload · time · rules'], ['Mass budget', 'guess every part'], ['Hover power', 'momentum theory'], ['Battery', 'Wh · C-rate'], ['Motor + prop', 'thrust tables'], ['ESC', '1.2–1.5× current'], ['Verify', 'thrust stand · logs']];
  const cx = 320, cy = 170, rx = 230, ry = 125;
  return (
    <Fig caption="The sizing loop. Real masses replace guesses each lap until the numbers converge." vb="0 0 640 340">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="fdash" />
      {items.map(([t, s], i) => { const a = -Math.PI / 2 + (i / items.length) * 2 * Math.PI; return <Box key={t} x={cx + rx * Math.cos(a) - 75} y={cy + ry * Math.sin(a) - 22} w={150} t={t} s={s} tone={i === 6 ? 'c' : i === 0 ? 'd' : 'a'} />; })}
      <T x={cx} y={cy + 5} c="ft">iterate ↻</T>
    </Fig>
  );
}

/* Autonomy */
export function NavStackFig() {
  return (
    <Fig caption="Autonomy stack: a companion computer decides where to go; the autopilot's nested loops make it happen; the EKF tells everyone where the drone is." vb="0 0 700 260">
      <Defs />
      <Box x={10} y={20} w={160} t="Companion computer" s="ROS 2 · vision · planning" tone="e" />
      <Ar d="M170 42 H210" l="MAVLink" lx={190} ly={34} />
      {[['Mission / Guided', 'waypoints'], ['Position', 'P → velocity sp'], ['Velocity', 'PID → accel/tilt'], ['Attitude', 'P → rate sp'], ['Rate', 'PID → torque']].map(([t, s], i) => (
        <g key={t}><Box x={210 + (i % 3) * 165} y={20 + Math.floor(i / 3) * 90} w={145} t={t} s={s} tone="a" /></g>
      ))}
      <Ar d="M355 42 H375" /><Ar d="M520 42 H540" /><Ar d="M612 64 C612 90, 300 80, 282 108" /><Ar d="M355 132 H375" />
      <Box x={540} y={110} w={145} t="Mixer → ESCs" tone="b" /><Ar d="M520 132 H540" />
      <Box x={210} y={200} w={310} t="EKF (IMU + GNSS + baro + mag + flow)" s="position, velocity, attitude, biases" tone="c" />
      <path d="M365 200 V160" className="farrow" markerEnd="url(#ah2)" /><path d="M300 200 C200 180, 180 100, 230 66" className="farrow" markerEnd="url(#ah2)" />
    </Fig>
  );
}

/* Fixed wing */
export function AircraftForcesFig() {
  return (
    <Fig caption="Four forces in level flight (L = W, T = D) and a banked turn: lift tilts, so it must grow to n = 1/cos φ times the weight." vb="0 0 640 260">
      <Defs />
      <path d="M60 130 L250 120 L270 130 L250 140 Z" className="fbox a" /><path d="M140 125 L170 60 L195 60 L180 125 Z" className="fbox a" /><path d="M140 135 L170 200 L195 200 L180 135 Z" className="fbox a" />
      <Ar d="M165 115 V30" /><T x={178} y={34} a="start" c="ft">Lift L</T>
      <Ar d="M165 145 V235" /><T x={178} y={235} a="start" c="ft">Weight W</T>
      <Ar d="M270 130 H330" /><T x={334} y={134} a="start" c="ft">Thrust T</T>
      <Ar d="M60 130 H10" /><T x={14} y={120} a="start" c="ft">Drag D</T>
      <g transform="translate(500 140)">
        <line x1={-90} y1={0} x2={90} y2={0} className="fdash" />
        <g transform="rotate(-30)"><rect x={-80} y={-5} width={160} height={10} rx="4" className="fbox b" /><Ar d="M0 -5 V-95" /></g>
        <Ar d="M0 0 V80" /><T x={-58} y={-88} c="ft">L</T><T x={14} y={90} a="start" c="ft">W</T>
        <path d="M60 0 A60 60 0 0 0 52 -30" className="farrow" /><T x={75} y={-18} a="start">φ</T>
      </g>
    </Fig>
  );
}

/* PCB */
export function PcbStackFig() {
  const layers = [['Top: signals + parts', 'a'], ['L2: solid GND plane', 'e'], ['L3: power planes / pours', 'd'], ['Bottom: signals + high-current pours', 'b']];
  return (
    <Fig caption="A typical 4-layer stack-up and board zoning: keep high current and switching away from the IMU and analogue sensing." vb="0 0 660 260">
      {layers.map(([t, tone], i) => <g key={t}><rect x={20} y={30 + i * 50} width={280} height={30} rx="4" className={'fbox ' + tone} /><T x={160} y={50 + i * 50} c="ft">{t}</T></g>)}
      <rect x={340} y={30} width={300} height={200} rx="10" className="fbox e" />
      <rect x={350} y={40} width={120} height={180} rx="6" className="fbox b" /><T x={410} y={120} c="ft">Power</T><T x={410} y={138}>battery in, ESC pads,</T><T x={410} y={152}>shunt, buck</T>
      <rect x={480} y={40} width={150} height={80} rx="6" className="fbox a" /><T x={555} y={76} c="ft">Digital</T><T x={555} y={94}>MCU, flash, USB</T>
      <rect x={480} y={130} width={150} height={90} rx="6" className="fbox c" /><T x={555} y={170} c="ft">Sensitive</T><T x={555} y={188}>IMU (centre), baro, LDO</T>
    </Fig>
  );
}

/* Vision */
export function PinholeFig() {
  return (
    <Fig caption="Downward camera geometry: similar triangles give GSD = H·p/f and footprint = GSD × pixels." vb="0 0 600 300">
      <rect x={250} y={20} width={100} height={12} className="fbox a" /><T x={360} y={30} a="start">sensor, pixel pitch p</T>
      <circle cx={300} cy={70} r={6} className="fdot" /><T x={312} y={74} a="start">lens (focal length f)</T>
      <line x1={250} y1={32} x2={60} y2={270} className="fdash" /><line x1={350} y1={32} x2={540} y2={270} className="fdash" />
      <line x1={40} y1={270} x2={560} y2={270} className="fw" />
      <T x={300} y={290} c="ft">ground footprint = GSD × pixels</T>
      <line x1={575} y1={70} x2={575} y2={270} className="farrow" /><T x={585} y={175} a="start" c="ft">H</T>
      <line x1={230} y1={32} x2={230} y2={70} className="farrow" /><T x={222} y={56} a="end">f</T>
    </Fig>
  );
}

/* Microcontrollers */
export function McuArchFig() {
  return (
    <Fig caption="Inside a microcontroller: CPU core, memories and peripherals share a bus matrix; DMA moves data without the CPU; the clock tree times everything." vb="0 0 680 320">
      <Defs />
      <rect x={10} y={10} width={660} height={300} rx="14" className="fbox e" />
      <Box x={30} y={30} w={150} h={60} t="CPU core" s="Cortex-M · FPU · NVIC" tone="a" />
      <Box x={30} y={110} w={150} t="Flash" s="program (KB–MB)" tone="d" />
      <Box x={30} y={170} w={150} t="SRAM" s="data, stack (KB)" tone="d" />
      <Box x={30} y={240} w={150} t="Clock tree" s="HSE/HSI → PLL → buses" tone="c" />
      <rect x={220} y={30} width={60} height={260} rx="8" className="fbox a" /><T x={250} y={165} c="ft">bus</T><T x={250} y={182}>matrix</T>
      <Box x={320} y={30} w={130} t="DMA" s="memory ↔ peripheral" tone="b" />
      {[['GPIO + EXTI', 'pins, interrupts'], ['Timers', 'PWM, capture, encoder'], ['ADC / DAC', 'analog in / out'], ['UART · SPI · I²C', 'serial buses'], ['CAN · USB · Eth', 'bigger parts']].map(([t, s], i) => <Box key={t} x={320 + (i % 2) * 170} y={90 + Math.floor(i / 2) * 70} w={150} t={t} s={s} tone={i % 2 ? 'c' : 'e'} />)}
      <Ar d="M180 60 H218" /><Ar d="M180 132 H218" /><Ar d="M180 192 H218" /><Ar d="M282 60 H318" /><Ar d="M282 160 H318" />
    </Fig>
  );
}
export function TimerPwmFig() {
  return (
    <Fig caption="Hardware PWM: a timer counts 0 → ARR and restarts (period); the output is high while the count is below the compare value CCR (duty = CCR/(ARR+1))." vb="0 0 560 250">
      <line x1={40} y1={130} x2={540} y2={130} className="fw" />
      <path d="M40 130 L140 30 L140 130 L240 30 L240 130 L340 30 L340 130 L440 30 L440 130 L540 30" className="farrow" style={{ stroke: 'var(--accent)' }} />
      <line x1={40} y1={30} x2={540} y2={30} className="fdash" /><T x={544} y={34} a="start">ARR</T>
      <line x1={40} y1={90} x2={540} y2={90} className="fdash" style={{ stroke: 'var(--warn)' }} /><T x={544} y={94} a="start">CCR</T>
      <path d="M40 200 V160 H80 V200 H140 V160 H180 V200 H240 V160 H280 V200 H340 V160 H380 V200 H440 V160 H480 V200 H540" className="farrow" style={{ stroke: 'var(--accent2)' }} />
      <T x={20} y={84} c="ft">count</T><T x={20} y={184} c="ft">PWM</T><T x={290} y={235}>f_PWM = f_timer / ((PSC+1)(ARR+1))</T>
    </Fig>
  );
}
export function BusesFig() {
  return (
    <Fig caption="Three serial buses at a glance. UART: 2 wires, no clock, agreed baud. I²C: 2 shared wires, addresses, open-drain. SPI: 4 wires, chip-select per device, fastest." vb="0 0 680 270">
      <T x={20} y={30} a="start" c="ft">UART</T>
      <path d="M80 40 H120 V60 H150 V40 H180 V60 H240 V40 H270 V60 H300 V40 H360" className="farrow" style={{ stroke: 'var(--accent)' }} /><T x={100} y={78}>start</T><T x={330} y={78}>stop</T><T x={500} y={50}>TX→RX, RX←TX · e.g. 115200 baud</T>
      <T x={20} y={120} a="start" c="ft">I²C</T>
      <path d="M80 110 H100 L105 130 H125 L130 110 H150 L155 130 H175 L180 110 H200 L205 130 H225 L230 110 H360" className="farrow" style={{ stroke: 'var(--accent2)' }} /><T x={60} y={113} a="end">SCL</T>
      <path d="M80 140 H110 V160 H170 V140 H230 V160 H360" className="farrow" style={{ stroke: 'var(--warn)' }} /><T x={60} y={153} a="end">SDA</T><T x={500} y={140}>7-bit address + ACK · 100–400 kHz (1 MHz+)</T>
      <T x={20} y={210} a="start" c="ft">SPI</T>
      <path d="M80 190 H100 V210 H360 V190" className="farrow" style={{ stroke: 'var(--good)' }} /><T x={60} y={203} a="end">CS</T>
      <path d="M100 230 H110 V245 H120 V230 H130 V245 H140 V230 H150 V245 H160 V230 H170 V245 H180 V230 H190 V245 H200 V230 H210 V245 H220 V230" className="farrow" style={{ stroke: 'var(--accent)' }} /><T x={60} y={240} a="end">SCK</T>
      <T x={500} y={225}>MOSI + MISO full duplex · 1–50 MHz</T>
    </Fig>
  );
}
export function InterruptFig() {
  return (
    <Fig caption="Interrupt timeline: main code is pre-empted by an ISR, which can itself be pre-empted by a higher-priority one (NVIC). Keep ISRs short; hand work to tasks or DMA." vb="0 0 640 210">
      <Defs />
      <line x1={40} y1={170} x2={620} y2={170} className="fw" /><T x={620} y={190} a="end">time →</T>
      <rect x={40} y={140} width={120} height={22} className="fbox e" /><rect x={420} y={140} width={200} height={22} className="fbox e" /><T x={100} y={155} c="ft">main loop</T><T x={520} y={155} c="ft">main resumes</T>
      <rect x={160} y={95} width={260} height={22} className="fbox a" /><T x={200} y={110} c="ft">ISR: SPI DRDY (prio 2)</T>
      <rect x={250} y={50} width={90} height={22} className="fbox b" /><T x={295} y={65} c="ft">timer (prio 1)</T>
      <Ar d="M160 30 V93" /><T x={160} y={22} c="ft">IMU data-ready</T><Ar d="M250 30 V48" /><T x={270} y={22} a="start" c="ft">timer IRQ</T>
      <T x={330} y={205}>latency = time from event to first ISR instruction (≈ 12 cycles on Cortex-M)</T>
    </Fig>
  );
}

export const FIGS2 = {
  actuator: ActuatorFig, frames: FramesFig, outrunner: OutrunnerFig, torquespeed: TorqueSpeedFig, sixstep: SixStepFig, powertree: PowerTreeFig,
  compfilter: CompFilterFig, kalman: KalmanFig, pid: PidFig, fcmap: FcMapFig, filterchain: FilterChainFig, rfchain: RfChainFig, linkbudget: LinkBudgetFig,
  sizingloop: SizingLoopFig, navstack: NavStackFig, aircraft: AircraftForcesFig, pcbstack: PcbStackFig, pinhole: PinholeFig,
  mcuarch: McuArchFig, timerpwm: TimerPwmFig, buses: BusesFig, interrupt: InterruptFig,
};
