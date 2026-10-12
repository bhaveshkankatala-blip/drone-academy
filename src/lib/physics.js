// Pure engineering functions used by the simulators. Tested in tests/physics.test.mjs.
// SI units throughout unless the name says otherwise.

export const G = 9.81;
export const RHO_SEA = 1.225;

/** Air density from altitude (m) and temperature (°C), ISA troposphere approximation. */
export function airDensity(altM = 0, tempC = 15) {
  const p = 101325 * Math.pow(1 - 2.25577e-5 * altM, 5.25588);
  return p / (287.05 * (tempC + 273.15));
}

/** Momentum theory hover for ONE rotor. Returns induced velocity (m/s) and ideal power (W). */
export function rotorHover(thrustN, diameterM, rho = RHO_SEA) {
  const A = Math.PI * (diameterM / 2) ** 2;
  const vi = Math.sqrt(thrustN / (2 * rho * A));
  return { area: A, vi, pIdeal: thrustN * vi, diskLoading: thrustN / A };
}

/** Whole-vehicle hover power chain: ideal → shaft (÷FM) → electrical (÷ηmotor·ηesc). */
export function hoverPower({ massKg, rotors = 4, diameterM, fm = 0.6, etaDrive = 0.8, rho = RHO_SEA, packV = 14.8 }) {
  const t = (massKg * G) / rotors;
  const r = rotorHover(t, diameterM, rho);
  const pIdeal = r.pIdeal * rotors;
  const pShaft = pIdeal / fm;
  const pElec = pShaft / etaDrive;
  return { thrustPerRotor: t, vi: r.vi, diskLoading: r.diskLoading, pIdeal, pShaft, pElec, current: pElec / packV, gPerW: (massKg * 1000) / pElec };
}

/** Propeller static thrust T = C_T ρ n² D⁴ (n in rev/s). */
export const propThrust = (ct, rpm, diameterM, rho = RHO_SEA) => ct * rho * (rpm / 60) ** 2 * diameterM ** 4;

/** Torque constant from KV (rpm/V): Kt = 60 / (2π KV)  [N·m/A]. */
export const ktFromKv = (kv) => 60 / (2 * Math.PI * kv);

/** Steady-state DC motor model (BLDC treated as DC machine). */
export function motorOperatingPoint({ kv, volts, amps, rOhm, i0 }) {
  const kt = ktFromKv(kv);
  const backEmf = volts - amps * rOhm;
  const rpm = kv * backEmf;
  const omega = (rpm * 2 * Math.PI) / 60;
  const torque = kt * Math.max(0, amps - i0);
  const pIn = volts * amps;
  const pOut = torque * omega;
  return { kt, backEmf, rpm, omega, torque, pIn, pOut, pCopper: amps * amps * rOhm, pNoLoad: i0 * backEmf, eff: pIn > 0 ? pOut / pIn : 0 };
}

/** LiPo pack under load. */
export function battery({ cells, mAh, cellIrMilliOhm, amps, usable = 0.8, restV = 3.8 }) {
  const ocv = cells * restV;
  const rPack = (cells * cellIrMilliOhm) / 1000;
  const vLoad = ocv - amps * rPack;
  const minutes = amps > 0 ? ((usable * mAh) / 1000 / amps) * 60 : Infinity;
  return { ocv, rPack, sag: amps * rPack, vLoad, cellV: vLoad / cells, heatW: amps * amps * rPack, minutes, wh: (cells * 3.7 * mAh) / 1000 };
}

/**
 * X-quad mixer. Motor order: 1 front-right (CW), 2 rear-right (CCW), 3 rear-left (CW), 4 front-left (CCW).
 * Body axes: x forward, y right, z down. Positive roll = right side down, positive pitch = nose up,
 * positive yaw = nose right (clockwise seen from above).
 * d = moment arm about roll/pitch axes (= arm length / √2), c = k_tau/k_f (m).
 */
export const MIX = { roll: [-1, -1, 1, 1], pitch: [1, -1, -1, 1], yaw: [-1, 1, -1, 1] };

export function mixForward(t, d, c) {
  return {
    thrust: t.reduce((a, b) => a + b, 0),
    roll: d * t.reduce((a, ti, i) => a + MIX.roll[i] * ti, 0),
    pitch: d * t.reduce((a, ti, i) => a + MIX.pitch[i] * ti, 0),
    yaw: c * t.reduce((a, ti, i) => a + MIX.yaw[i] * ti, 0),
  };
}

export function mixInverse({ thrust, roll, pitch, yaw }, d, c) {
  return [0, 1, 2, 3].map(
    (i) => thrust / 4 + (MIX.roll[i] * roll) / (4 * d) + (MIX.pitch[i] * pitch) / (4 * d) + (MIX.yaw[i] * yaw) / (4 * c)
  );
}

/** Free-space path loss in dB, d in metres, f in Hz. */
export const fspl = (dM, fHz) => 20 * Math.log10(dM) + 20 * Math.log10(fHz) - 147.55;

export function linkBudget({ ptxDbm, gtx, grx, lossDb, sensDbm, fHz, dM, marginDb = 10 }) {
  const loss = fspl(dM, fHz);
  const prx = ptxDbm + gtx + grx - lossDb - loss;
  const allowed = ptxDbm + gtx + grx - lossDb - sensDbm - marginDb;
  const maxRangeM = Math.pow(10, (allowed + 147.55 - 20 * Math.log10(fHz)) / 20);
  return { fspl: loss, prx, margin: prx - sensDbm, maxRangeM };
}

export const dbmToMw = (dbm) => Math.pow(10, dbm / 10);
export const mwToDbm = (mw) => 10 * Math.log10(mw);

/** Second-order step response figures. */
export function secondOrder(zeta, wn) {
  const os = zeta < 1 ? 100 * Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta)) : 0;
  return { overshootPct: os, settling2pct: 4 / (zeta * wn), wd: zeta < 1 ? wn * Math.sqrt(1 - zeta * zeta) : 0 };
}

/** Complementary filter time constant τ = α·dt/(1−α) and crossover frequency. */
export function compFilterTau(alpha, dt) {
  const tau = (alpha * dt) / (1 - alpha);
  return { tau, fc: 1 / (2 * Math.PI * tau) };
}

/** Deterministic pseudo-random generator so simulations are repeatable. */
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function gauss(r) {
  const u = Math.max(r(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

/**
 * Rate-loop simulation for one axis.
 * Plant: torque lags command with motor time constant tm (first order), J·ω̇ = τ.
 * Controller: PID on rate error, D on measurement with first-order low-pass, output clamp, integrator clamp.
 */
// gain = angular acceleration (deg/s²) at full normalised torque; u, tau, disturbance are normalised to ±1.
export function simulateRateLoop({ kp, ki, kd, dTermHz = 100, tm = 0.03, gain = 4000, stepDps = 100, noiseDps = 0, tEnd = 1.5, dt = 0.0005, disturbAt = 0.6, disturb = -0.1, seed = 3 }) {
  const r = rng(seed);
  let w = 0, tau = 0, integ = 0, dPrev = 0, measPrev = 0;
  const alpha = dt / (dt + 1 / (2 * Math.PI * dTermHz));
  const out = [];
  for (let k = 0, t = 0; t <= tEnd; k++, t = k * dt) {
    const sp = t >= 0.02 ? stepDps : 0;
    const meas = w + noiseDps * gauss(r);
    const e = sp - meas;
    integ = Math.max(-1, Math.min(1, integ + ki * e * dt));
    const dRaw = -(meas - measPrev) / dt;
    measPrev = meas;
    const dF = dPrev + alpha * (dRaw - dPrev);
    dPrev = dF;
    const u = Math.max(-1, Math.min(1, kp * e + integ + kd * dF));
    const dist = t >= disturbAt ? disturb : 0;
    tau += ((u + dist - tau) / tm) * dt;
    w += gain * tau * dt;
    if (k % 4 === 0) out.push({ t, sp, w, u });
  }
  return out;
}

export function stepMetrics(series, sp) {
  const peak = Math.max(...series.map((p) => p.w));
  const t10 = series.find((p) => p.w >= 0.1 * sp)?.t ?? NaN;
  const t90 = series.find((p) => p.w >= 0.9 * sp)?.t ?? NaN;
  return { overshootPct: Math.max(0, ((peak - sp) / sp) * 100), riseMs: (t90 - t10) * 1000 };
}

/** Complementary filter over a synthetic tilt manoeuvre. */
export function simulateCompFilter({ alpha = 0.98, dt = 0.004, gyroBias = 0.5, gyroNoise = 0.3, accNoise = 3, vib = 4, tEnd = 20, seed = 7 }) {
  const r = rng(seed);
  let gyroOnly = 0, fused = 0;
  const out = [];
  for (let k = 0, t = 0; t <= tEnd; k++, t = k * dt) {
    const truth = t < 3 ? 0 : t < 8 ? 25 * Math.sin(((t - 3) / 5) * Math.PI) : t < 12 ? 0 : t < 16 ? 15 : 0;
    const truthNext = (() => { const tt = t + dt; return tt < 3 ? 0 : tt < 8 ? 25 * Math.sin(((tt - 3) / 5) * Math.PI) : tt < 12 ? 0 : tt < 16 ? 15 : 0; })();
    const rate = (truthNext - truth) / dt;
    const gyro = rate + gyroBias + gyroNoise * gauss(r);
    const acc = truth + accNoise * gauss(r) + vib * Math.sin(2 * Math.PI * 23 * t);
    gyroOnly += gyro * dt;
    fused = alpha * (fused + gyro * dt) + (1 - alpha) * acc;
    if (k % 10 === 0) out.push({ t, truth, gyroOnly, acc, fused });
  }
  return out;
}

/** Simple multirotor sizing estimate (momentum theory + battery energy). */
export function sizing({ rotors = 4, propIn = 10, baseKg = 0.75, payloadKg = 0.3, battKg = 0.45, whPerKg = 150, fm = 0.6, etaDrive = 0.8, usable = 0.8, avionicsW = 8, twr = 2 }) {
  const auw = baseKg + payloadKg + battKg;
  const hp = hoverPower({ massKg: auw, rotors, diameterM: propIn * 0.0254, fm, etaDrive });
  const pTotal = hp.pElec + avionicsW;
  const energy = battKg * whPerKg * usable;
  return { auw, pHover: pTotal, minutes: (energy / pTotal) * 60, thrustMaxPerMotorG: (twr * auw * 1000) / rotors, hoverPerMotorG: (auw * 1000) / rotors, gPerW: hp.gPerW, diskLoading: hp.diskLoading };
}

/** Downward-looking camera survey geometry. Lengths in metres, pitch in µm, focal in mm. */
export function survey({ altM, focalMm, pitchUm, pxAcross, pxAlong, speed, exposureS, sideOverlap, frontOverlap }) {
  const gsd = (altM * pitchUm * 1e-6) / (focalMm * 1e-3);
  const width = gsd * pxAcross, length = gsd * pxAlong;
  const lineSpacing = (1 - sideOverlap) * width;
  const photoSpacing = (1 - frontOverlap) * length;
  const blurPx = (speed * exposureS) / gsd;
  return { gsd, width, length, lineSpacing, photoSpacing, triggerS: photoSpacing / speed, blurPx, fPx: (focalMm * 1e-3) / (pitchUm * 1e-6) };
}

/** Continuous-time filter responses at frequency f (Hz). Returns {mag (linear), phaseDeg}. */
const cpx = (re, im) => ({ re, im });
const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return cpx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const cmul = (a, b) => cpx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export function filterChain(f, { pt1Hz = 0, biquadHz = 0, notchHz = 0, notchQ = 3 }) {
  let h = cpx(1, 0);
  if (pt1Hz > 0) h = cmul(h, cdiv(cpx(1, 0), cpx(1, f / pt1Hz)));
  if (biquadHz > 0) { const x = f / biquadHz; h = cmul(h, cdiv(cpx(1, 0), cpx(1 - x * x, Math.SQRT2 * x))); }
  if (notchHz > 0) { const x = f / notchHz; h = cmul(h, cdiv(cpx(1 - x * x, 0), cpx(1 - x * x, x / notchQ))); }
  return { mag: Math.hypot(h.re, h.im), phaseDeg: (Math.atan2(h.im, h.re) * 180) / Math.PI };
}
export const toDb = (m) => 20 * Math.log10(Math.max(m, 1e-6));
/** Frequency at which a tone appears after sampling at fs. */
export function aliasOf(f, fs) { const r = f % fs; return r > fs / 2 ? fs - r : r; }
