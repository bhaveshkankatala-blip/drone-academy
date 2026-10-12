import { modulesA } from './modules-a.js';
import { modulesB } from './modules-b.js';
import { modulesC } from './modules-c.js';
import { modulesD } from './modules-d.js';

import { EXTRA } from './extra.js';
import { EXTRA_NUMERICALS } from './extra-numericals.js';

export const MODULES = [...modulesA, ...modulesB, ...modulesC, ...modulesD].map((m, i) => ({
  ...m,
  n: i + 1,
  reels: [...m.reels, ...(EXTRA[m.id]?.reels || [])],
  numericals: [...m.numericals, ...(EXTRA_NUMERICALS[m.id] || [])],
  quiz: [...m.quiz, ...(EXTRA[m.id]?.quiz || [])].map((q, j) => ({ ...q, key: `${m.id}:${j}`, module: m.id })),
}));

export const byId = Object.fromEntries(MODULES.map((m) => [m.id, m]));
export const ALL_QUESTIONS = MODULES.flatMap((m) => m.quiz);

export const TRACKS = [
  { name: 'Foundations', ids: ['systems', 'physics', 'dynamics'] },
  { name: 'Power train', ids: ['motors', 'esc', 'power'] },
  { name: 'Brains', ids: ['sensing', 'control', 'firmware'] },
  { name: 'Links & making it real', ids: ['rf', 'design', 'autonomy'] },
  { name: 'Specialisations', ids: ['fixedwing', 'pcb', 'vision'] },
];

/** Plan: ~6 weeks of preparation before the college project starts, then an 8-week project. */
export const PLAN = {
  prep: [
    { week: 'Prep week 1', focus: 'Foundations', modules: ['systems', 'physics'], doing: ['Finish both modules + quizzes', 'Hover-power numericals by hand, check with the sim', 'Start a project notebook (paper or Notion)'], output: 'Block diagram + hover power estimate for a 1–1.5 kg drone' },
    { week: 'Prep week 2', focus: 'Dynamics & motors', modules: ['dynamics', 'motors'], doing: ['Write the Python 3-D simulator (lab)', 'Motor numericals; read one real motor datasheet end-to-end'], output: 'Simulator repo on GitHub' },
    { week: 'Prep week 3', focus: 'Power electronics & batteries', modules: ['esc', 'power'], doing: ['ESC loss numericals', 'Battery safety SOP for your team', 'If possible: scope an ESC in the college lab'], output: 'Team LiPo safety SOP (1 page)' },
    { week: 'Prep week 4', focus: 'Sensing & control', modules: ['sensing', 'control'], doing: ['IMU + complementary filter on Arduino/STM32', 'Add PID to your simulator; tune it'], output: 'IMU fusion plot + simulator flying a square' },
    { week: 'Prep week 5', focus: 'Firmware & RF', modules: ['firmware', 'rf'], doing: ['Install ArduPilot SITL, fly a mission', 'Link-budget for your planned radios (India 866 MHz / 2.4 GHz)'], output: 'SITL mission video' },
    { week: 'Prep week 6', focus: 'Design & rules', modules: ['design', 'autonomy'], doing: ['Write requirements with your team/guide', 'Run the sizing loop; shortlist parts; draft BOM', 'Check DigitalSky map for your test site; ask college about R&D permissions'], output: 'Requirements + sizing + draft BOM ready on project day 1' },
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
