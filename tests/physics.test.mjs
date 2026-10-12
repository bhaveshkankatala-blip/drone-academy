// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/lib/physics.js';

const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test('FSPL 2.4 GHz at 2 km ≈ 106.07 dB', () => near(P.fspl(2000, 2.4e9), 106.07, 0.02));
test('FSPL 1 km 2.4 GHz ≈ 100.05 dB', () => near(P.fspl(1000, 2.4e9), 100.05, 0.02));
test('+10 dB = √10 × range', () => {
  const a = P.linkBudget({ ptxDbm: 10, gtx: 0, grx: 0, lossDb: 0, sensDbm: -100, fHz: 2.4e9, dM: 100, marginDb: 0 });
  const b = P.linkBudget({ ptxDbm: 20, gtx: 0, grx: 0, lossDb: 0, sensDbm: -100, fHz: 2.4e9, dM: 100, marginDb: 0 });
  near(b.maxRangeM / a.maxRangeM, Math.sqrt(10), 1e-9);
});
test('link budget worked example → 12.5 km', () => {
  const r = P.linkBudget({ ptxDbm: 24, gtx: 2, grx: 2, lossDb: 1, sensDbm: -105, fHz: 2.4e9, dM: 1000, marginDb: 10 });
  near(r.maxRangeM / 1000, 12.51, 0.02);
});
test('Kt from KV', () => { near(P.ktFromKv(2450), 0.003898, 1e-6); near(P.ktFromKv(920), 0.01038, 1e-5); });
test('motor operating point worked example', () => {
  const m = P.motorOperatingPoint({ kv: 920, volts: 11.1, amps: 10, rOhm: 0.12, i0: 0.5 });
  near(m.rpm, 9108, 0.5); near(m.pOut, 94.05, 0.05); near(m.eff, 0.8473, 1e-3);
  near(m.pIn - m.pCopper - m.pNoLoad, m.pOut, 1e-9); // energy balance closes exactly
});
test('hover power worked example (1.2 kg, 10")', () => {
  const h = P.hoverPower({ massKg: 1.2, rotors: 4, diameterM: 0.254, fm: 0.6, etaDrive: 0.8 });
  near(h.vi, 4.869, 0.002); near(h.pIdeal, 57.32, 0.05); near(h.pElec, 119.4, 0.1);
});
test('prop thrust coefficient example', () => near(P.propThrust(0.11, 8000, 0.254), 9.971, 0.01));
test('mixer inverse/forward round trip', () => {
  const d = 0.225 / Math.SQRT2, c = 0.016;
  const t = P.mixInverse({ thrust: 12, roll: 0.1, pitch: 0, yaw: 0.02 }, d, c);
  [2.53, 3.155, 2.845, 3.47].forEach((v, i) => near(t[i], v, 0.002));
  const f = P.mixForward(t, d, c);
  near(f.thrust, 12, 1e-9); near(f.roll, 0.1, 1e-9); near(f.pitch, 0, 1e-9); near(f.yaw, 0.02, 1e-9);
});
test('mixer signs: increasing CCW motors yaws nose right (clockwise from above)', () => {
  const f = P.mixForward([3, 3.2, 3, 3.2], 0.16, 0.016); assert.ok(f.yaw > 0);
});
test('battery examples', () => {
  const b = P.battery({ cells: 4, mAh: 5000, cellIrMilliOhm: 8, amps: 25 }); near(b.minutes, 9.6, 1e-9);
  const s = P.battery({ cells: 4, mAh: 1500, cellIrMilliOhm: 8, amps: 60 }); near(s.sag, 1.92, 1e-9);
});
test('complementary filter τ', () => { const r = P.compFilterTau(0.98, 0.004); near(r.tau, 0.196, 1e-6); near(r.fc, 0.812, 0.001); });
test('second order overshoot ζ=0.5 → 16.3%', () => near(P.secondOrder(0.5, 10).overshootPct, 16.3, 0.05));
test('air density sea level ISA', () => near(P.airDensity(0, 15), 1.225, 0.002));
test('fusion beats gyro-only and accel-only', () => {
  const s = P.simulateCompFilter({});
  const rms = (k) => Math.sqrt(s.reduce((a, p) => a + (p[k] - p.truth) ** 2, 0) / s.length);
  assert.ok(rms('fused') < rms('gyroOnly')); assert.ok(rms('fused') < rms('acc'));
});
test('default PID gains give a stable, reasonably damped step', () => {
  const s = P.simulateRateLoop({ kp: 0.012, ki: 0.02, kd: 0.0002 });
  const m = P.stepMetrics(s.filter((p) => p.t < 0.6), 100);
  assert.ok(m.overshootPct < 25, `overshoot ${m.overshootPct}`);
  assert.ok(Math.abs(s.filter((p) => p.t > 0.3 && p.t < 0.6).at(-1).w - 100) < 5);
});
test('high P without D rings more than tuned', () => {
  const tuned = P.stepMetrics(P.simulateRateLoop({ kp: 0.012, ki: 0.02, kd: 0.0002 }).filter((p) => p.t < 0.6), 100);
  const hot = P.stepMetrics(P.simulateRateLoop({ kp: 0.03, ki: 0.02, kd: 0 }).filter((p) => p.t < 0.6), 100);
  assert.ok(hot.overshootPct > tuned.overshootPct + 10);
});
test('sizing sanity', () => { const s = P.sizing({}); assert.ok(s.minutes > 5 && s.minutes < 40, String(s.minutes)); });
test('integral removes the gust error, P-only does not', () => {
  const withI = P.simulateRateLoop({ kp: 0.012, ki: 0.02, kd: 0.0002 }).at(-1).w;
  const noI = P.simulateRateLoop({ kp: 0.012, ki: 0, kd: 0.0002 }).at(-1).w;
  assert.ok(Math.abs(withI - 100) < 2.5 && 100 - noI > 5, `${withI} ${noI}`);
});
test('survey GSD worked example', () => {
  const r = P.survey({ altM: 50, focalMm: 4, pitchUm: 2.4, pxAcross: 4000, pxAlong: 3000, speed: 10, exposureS: 0.002, sideOverlap: 0.7, frontOverlap: 0.8 });
  near(r.gsd, 0.03, 1e-9); near(r.width, 120, 1e-6); near(r.lineSpacing, 36, 1e-6); near(r.blurPx, 0.6667, 1e-3);
});
