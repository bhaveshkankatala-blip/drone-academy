import { modulesA } from './modules-a.js';
import { modulesB } from './modules-b.js';
import { modulesC } from './modules-c.js';
import { modulesD } from './modules-d.js';
import { moduleMcu } from './modules-mcu.js';
import { moduleStart } from './modules-start.js';
import { BEGINNER_A } from './beginner-a.js';
import { BEGINNER_B } from './beginner-b.js';
import { BEGINNER_C } from './beginner-c.js';

import { EXTRA } from './extra.js';
import { EXTRA_NUMERICALS } from './extra-numericals.js';

// Beginner-friendly order: the subjects a 3rd-semester EEE student already studies come first
// (batteries → circuits, motors → machines, ESCs → analog electronics); heavy maths (dynamics, control) later.
const ORDER = ['start', 'systems', 'power', 'motors', 'esc', 'physics', 'mcu', 'sensing', 'dynamics', 'control', 'firmware', 'rf', 'design', 'autonomy', 'fixedwing', 'pcb', 'vision'];
const ALL = [moduleStart, ...modulesA, ...modulesB, ...modulesC, ...modulesD, moduleMcu];
export const BEGINNER = { ...BEGINNER_A, ...BEGINNER_B, ...BEGINNER_C };
// Figures injected at the top of named sections (see components/figures*.jsx).
export const FIG_MAP = {
  physics: { 'Derivation: momentum (actuator-disk) theory': 'actuator' },
  dynamics: { 'Frames and rotations': 'frames' },
  motors: { "What's inside": 'outrunner', 'Derivation: KV, Kt and the motor equations': 'torquespeed' },
  esc: { 'Six-step commutation and sensorless timing': 'sixstep' },
  power: { 'Power distribution': 'powertree' },
  sensing: { 'Derivation: the complementary filter is a pair of filters': 'compfilter', 'The Kalman filter in one page': 'kalman' },
  control: { 'Discrete PID you can actually fly': 'pid' },
  firmware: { 'Anatomy of a flight controller': 'fcmap', 'Derivation: sampling, aliasing and filter delay': 'filterchain' },
  rf: { 'Think in decibels': 'linkbudget', 'RC, telemetry and video chains': 'rfchain' },
  design: { 'The sizing loop': 'sizingloop' },
  autonomy: { 'From stabilise to fully autonomous': 'navstack' },
  fixedwing: { 'Lift, drag and stall': 'aircraft' },
  pcb: { 'Layout rules that save your project': 'pcbstack' },
  vision: { 'Derivation: ground sample distance and survey planning': 'pinhole' },
};
const withFigs = (m) => ({ ...m, sections: m.sections.map((s) => (FIG_MAP[m.id]?.[s.h] ? { ...s, body: `[[fig:${FIG_MAP[m.id][s.h]}]]\n\n` + s.body } : s)) });

export const MODULES = ORDER.map((id) => withFigs(ALL.find((m) => m.id === id))).map((m, i) => ({
  ...m,
  n: i, // Start Here is module 0
  reels: [...m.reels, ...(EXTRA[m.id]?.reels || [])],
  numericals: [...m.numericals, ...(EXTRA_NUMERICALS[m.id] || [])],
  nCore: m.numericals.length, // numericals[0..nCore) are Level 2 (guided); the rest are Level 3 (challenge)
  beginner: BEGINNER[m.id] || null,
  quiz: [...m.quiz, ...(EXTRA[m.id]?.quiz || [])].map((q, j) => ({ ...q, key: `${m.id}:${j}`, module: m.id })),
}));

export const byId = Object.fromEntries(MODULES.map((m) => [m.id, m]));
export const ALL_QUESTIONS = MODULES.flatMap((m) => m.quiz);

export const TRACKS = [
  { name: 'Start here', note: 'No new subjects needed', ids: ['start', 'systems'] },
  { name: 'Power train', note: 'Uses what you study this semester: Circuits, Machines, Analog Electronics', ids: ['power', 'motors', 'esc'] },
  { name: 'Flight & brains', note: 'Physics, microcontrollers and sensors', ids: ['physics', 'mcu', 'sensing'] },
  { name: 'Control & firmware', note: 'Heavier maths: read Simple first, come back after Control Systems', ids: ['dynamics', 'control', 'firmware'] },
  { name: 'Links & making it real', note: 'Radio, design and your project', ids: ['rf', 'design', 'autonomy'] },
  { name: 'Specialisations', note: 'Pick one that matches your interest', ids: ['fixedwing', 'pcb', 'vision'] },
];

/** Plan: ~6 weeks of preparation before the college project starts, then an 8-week project. */
export const PLAN = {
  prep: [
    { week: 'Prep week 1', focus: 'Start here, system view & batteries', modules: ['start', 'systems', 'power'], doing: ['Read each module in Simple view first, then Engineer', 'Measure a battery\'s internal resistance (Start Here lab)', 'Start a project notebook (paper or Notion)'], output: 'Block diagram of a drone with voltages on every arrow + battery R_int table' },
    { week: 'Prep week 2', focus: 'Motors, ESCs & flight physics', modules: ['motors', 'esc', 'physics'], doing: ['Motor and ESC starter examples, then Level 2 numericals', 'Read one real motor datasheet thrust table end-to-end', 'Hover-power numericals by hand; check with the hover simulator'], output: 'Hover power and current estimate for a 1–1.5 kg drone' },
    { week: 'Prep week 3', focus: 'Microcontrollers & sensors', modules: ['mcu', 'sensing'], doing: ['Blink an LED and read a voltage on Arduino or STM32', 'Read an MPU-6050 IMU and plot gyro vs accelerometer angle', 'Write a complementary filter'], output: 'IMU angle plot with and without the filter' },
    { week: 'Prep week 4', focus: 'Dynamics & control (Simple view first)', modules: ['dynamics', 'control'], doing: ['Play with the mixer and PID simulators until the behaviour makes sense', 'Watch the MATLAB PID series', 'Optional: start the Python simulator lab'], output: 'Screenshots of a well-tuned and a badly-tuned PID response, with your explanation' },
    { week: 'Prep week 5', focus: 'Firmware & RF', modules: ['firmware', 'rf'], doing: ['Install ArduPilot SITL / Mission Planner simulation and fly a mission', 'Link budget for your planned radios (India 865–867 MHz / 2.4 GHz)'], output: 'SITL mission screen recording' },
    { week: 'Prep week 6', focus: 'Design & rules', modules: ['design', 'autonomy'], doing: ['Write requirements with your team/guide', 'Run the sizing loop; shortlist parts; draft BOM', 'Check the DigitalSky map for your test site; ask the college about R&D permissions'], output: 'Requirements + sizing + draft BOM ready on project day 1' },
  ],
  project: [
    { week: 'Project week 1', tasks: ['Freeze requirements with guide', 'Mass/power budget sheet', 'Order parts (allow for delivery delays)'], gate: 'Design review 1: requirements + sizing approved' },
    { week: 'Project week 2', tasks: ['Thrust-stand test of chosen motor/prop', 'Frame CAD or kit selection', 'SITL: configure parameters you will use'], gate: 'Measured thrust table matches sizing within ~15%' },
    { week: 'Project week 3', tasks: ['Assemble frame, power system, ESCs (props off)', 'Smoke test with current-limited supply', 'Flash ArduPilot, calibrate sensors, set failsafes'], gate: 'Bench checklist passes; motors spin correct order/direction' },
    { week: 'Project week 4', tasks: ['Tethered hover', 'First free hover in Stabilize/AltHold in an open green-zone field', 'Log review: vibration, battery, EKF'], gate: 'Stable 2-minute hover; vibration within firmware guidelines' },
    { week: 'Project week 5', tasks: ['Tune (AutoTune or manual from logs)', 'Loiter + RTL tests', 'Measure real endurance vs sizing'], gate: 'Position hold in light wind; RTL works' },
    { week: 'Project week 6', tasks: ['Add the project-specific feature (payload, camera, sensor, autonomy script)', 'Waypoint mission in SITL first, then field'], gate: 'Feature demo in SITL + field' },
    { week: 'Project week 7', tasks: ['Repeatability: 3 successful missions', 'Collect data/plots for the report', 'Fix issues found in logs'], gate: 'Three logged successful missions' },
    { week: 'Project week 8', tasks: ['Report: requirements → design → test → results → lessons', 'Demo video + slides', 'Viva prep: use this app\'s mock tests'], gate: 'Submission + demo' },
  ],
  bom: [
    ['Frame', '450–550 mm class (F450/S500-type) or 7–10″ carbon frame', 'Space for GPS mast and payload'],
    ['Flight controller', 'ArduPilot-supported H743 board or Pixhawk-class', 'Check ArduPilot "supported boards" list'],
    ['GNSS + compass', 'u-blox M8/M10-class module with compass', 'Mount on a mast away from power wires'],
    ['Motors', '~2212–2814 class, 700–1000 KV for 10″ on 4S (from your sizing!)', 'Use thrust table to confirm'],
    ['ESCs', '4 × 30–40 A (BLHeli_S/Bluejay or AM32)', '≥1.2–1.5× motor max current'],
    ['Props', '10″ (match motor table), spares ×3 sets', 'Balance them'],
    ['Battery', '4S 4000–5000 mAh LiPo ×2 + balance charger', 'Plus LiPo bag'],
    ['Radio', 'Transmitter + receiver (ELRS 2.4 GHz or India-domain 866 MHz)', 'Kill switch on a switch'],
    ['Telemetry', 'MAVLink radio set for India band, or Wi-Fi telemetry for short range', 'For QGroundControl/Mission Planner'],
    ['Power module', 'Voltage/current sensor compatible with the FC', 'Calibrate against a meter'],
    ['Safety', 'Prop guards (early tests), tether line, fire bucket/sand, first-aid kit', 'Non-negotiable'],
    ['Tools', 'Soldering station, hex drivers, multimeter, zip ties, heat-shrink, threadlocker', 'Shared team kit'],
  ],
  risks: [
    ['Parts delayed', 'Order in project week 1; identify a local alternative for each part'],
    ['Crash on first hover', 'Tethered tests, prop guards, Stabilize at low height, kill switch'],
    ['Compass/GPS issues', 'Mount GPS high, calibrate outdoors away from metal, check interference vs throttle'],
    ['Flight-time shortfall', 'Re-run sizing with measured masses; lighter frame or bigger pack'],
    ['Regulatory permission', 'Check DigitalSky zones and college R&D permissions in prep week 6'],
  ],
};
