// Modules 5–8.
export const modulesB = [
  {
    id: 'esc',
    title: 'ESCs: Power Electronics in the Air',
    tag: 'Power Electronics',
    eee: 'MOSFETs, gate drivers and PWM doing 21,000 commutations a second',
    color: '#fb923c',
    mins: 150,
    summary: 'The ESC as a three-phase inverter: MOSFET selection, gate drive and bootstrap, dead-time, six-step commutation with back-EMF sensing, loss calculations, DShot protocols and current firmware (Bluejay, AM32).',
    outcomes: [
      'Explain each block of an ESC and why a gate driver is required.',
      'Calculate conduction, switching and gate-drive losses.',
      'Describe six-step commutation and back-EMF zero-crossing detection.',
      'Choose a throttle protocol and ESC firmware for a build.',
    ],
    sections: [
      { h: 'Inside an ESC', body: `[[fig:bridge]]

An ESC = **MCU** (reads the throttle command, decides which switches to turn on) + **gate driver** + **six N-channel MOSFETs** in three half-bridges + **bulk capacitors** + (sometimes) current sensing. Four of these are often combined into a "4-in-1" board.

**Why N-channel on the high side too?** N-MOSFETs have lower $R_{DS(on)}$ for the same die area than P-channel. But to turn a high-side N-FET fully on, its gate must be ~10 V *above its source*, which sits at battery voltage when on. The **bootstrap** circuit charges a capacitor while the low-side FET is on and then uses it as a floating supply for the high-side gate.` },
      { h: 'MOSFET regions — getting the words right', body: `A MOSFET used as a switch should be either fully **off** (cut-off) or fully **on** in the **ohmic (triode) region**, where it behaves like a small resistor $R_{DS(on)}$.

> Careful: in MOSFET language, "saturation" is the constant-current region used in amplifiers — the *lossy* place a switch must cross quickly. (For BJTs, "saturation" means fully on. Mixing these up is a classic viva mistake.)

The gate driver's real jobs:
- Provide enough $V_{GS}$ (typically ~10 V; logic-level FETs ~4.5–5 V) for low $R_{DS(on)}$.
- Source/sink **amps of peak current** to charge the gate charge $Q_g$ in tens of ns, so the FET spends little time in the lossy region.
- Level-shift for the high side (bootstrap) and enforce **dead-time**.` },
      { h: 'Derivation: where the watts go', type: 'derive', body: `**Conduction loss** (per conducting FET): $P_{cond} = I_{rms}^2 R_{DS(on)}$. In six-step, one high-side and one low-side FET carry the phase current at any instant.

**Switching loss** (hard switching, linear V–I overlap approximation):

$$P_{sw} = \\tfrac12 V_{in} I \\,(t_r + t_f)\\, f_{sw}$$

**Gate-drive loss**: $P_{gate} = Q_g V_{GS} f_{sw}$, and the peak gate current to switch in time $t$ is $I_g \\approx Q_g/t$.

**Dead-time** fraction $= t_{dead} \\cdot f_{sw}$ (twice per period in practice). During dead-time current freewheels through the body diodes (loss ≈ $V_F I$).

Trade-off: higher $f_{sw}$ (24 → 48 → 96 kHz) gives smoother current and quieter motors but more switching and gate loss.` },
      { h: 'Six-step commutation and sensorless timing', body: `| Step | High-side ON | Low-side ON | Floating (sensed) |
|---|---|---|---|
| 1 | A | B | C |
| 2 | A | C | B |
| 3 | B | C | A |
| 4 | B | A | C |
| 5 | C | A | B |
| 6 | C | B | A |

The floating phase's voltage crosses half the DC bus when the rotor is 30 electrical degrees before the next commutation. The ESC detects this **zero crossing** with a comparator, waits ~30° (adjusted by "timing advance"), and steps. At standstill there is no back-EMF, so startup is open-loop — that's why props sometimes twitch before spinning up.

**Throttle protocols:** analog PWM (1–2 ms pulses, needs calibration) → OneShot/MultiShot → **DShot** (digital, 16-bit frames: 11-bit throttle + telemetry bit + 4-bit CRC, no calibration). **Bidirectional DShot** lets the ESC send eRPM back on the same wire — required for **RPM filtering** in Betaflight.

**Firmware in 2024+:** BLHeli_32 was discontinued in mid-2024. Current choices: **Bluejay** (open-source, for BLHeli_S/EFM8 hardware) and **AM32** (open-source, for 32-bit ARM ESCs), configured from the web **ESC Configurator** or the AM32 configurator.` },
    ],
    numericals: [
      { q: 'An ESC carries 30 A rms phase current. Each MOSFET has R_DS(on) = 2.5 mΩ. Estimate total conduction loss in one ESC (ignore PWM chopping).', steps: ['At any instant one high-side and one low-side FET conduct the phase current.', 'P = 2 × I²R = 2 × 30² × 0.0025 = **4.5 W**.'], answer: '≈ 4.5 W', why: 'Four ESCs → 18 W of heat in a small board: cooling and copper area matter.' },
      { q: 'Same ESC: V_in = 16.8 V, I = 30 A, t_r + t_f = 40 ns, f_sw = 48 kHz. Switching loss of one switching FET?', steps: ['P_sw = ½ × 16.8 × 30 × 40×10⁻⁹ × 48,000.', '= ½ × 504 × 1.92×10⁻³ = **0.484 W**.'], answer: '≈ 0.48 W', why: 'Doubling f_sw to 96 kHz doubles this — a real trade-off in Bluejay\'s PWM frequency setting.' },
      { q: 'A MOSFET has total gate charge Q_g = 30 nC, driven at V_GS = 10 V and 48 kHz. Find gate-drive power and the peak gate current needed to switch in 20 ns.', steps: ['P_gate = Q_g V_GS f = 30×10⁻⁹ × 10 × 48×10³ = **14.4 mW** per FET.', 'I_g ≈ Q_g/t = 30 nC / 20 ns = **1.5 A**.'], answer: '14.4 mW; 1.5 A peak', why: 'An MCU pin gives ~20 mA → it would take ~1.5 µs, crawling through the lossy region. That is why you need a driver.' },
      { q: 'Dead-time is set to 200 ns at 48 kHz PWM. What fraction of each PWM period is dead-time (one transition)?', steps: ['Period = 1/48,000 = 20.8 µs.', 'Fraction = 200 ns × 48 kHz = 0.0096 = **0.96%** (≈1.9% for both edges).'], answer: '≈ 1% per edge', why: 'Too little dead-time → shoot-through; too much → distortion and diode losses.' },
    ],
    practice: [
      { book: 'Mohan, Undeland & Robbins — Power Electronics: Converters, Applications, and Design (Wiley)', where: 'Switching-device and inverter chapters', note: 'The standard text; its switching-loss derivation is the one above.' },
      { book: 'Texas Instruments SLUA618 — Fundamentals of MOSFET and IGBT Gate Driver Circuits', where: 'Whole application report', note: 'Free, industry-standard, full of worked numbers.' },
      { book: 'M.H. Rashid — Power Electronics', where: 'Three-phase inverter chapter problems', note: 'Common in Indian university syllabi.' },
    ],
    lab: { title: 'Scope an ESC (props off!)', kit: ['ESC + motor + current-limited bench supply', 'Oscilloscope with a differential probe or careful ground referencing', 'Flight controller or servo tester'], steps: ['Set the supply current limit to ~2 A. Props OFF.', 'Probe one phase vs ground at low throttle: see the PWM chopping and the floating-phase back-EMF slope.', 'Change Bluejay PWM frequency (24/48 kHz) and compare the waveforms and motor temperature.', 'Measure commutation frequency vs rpm and check the pole count.'], deliverable: 'Annotated scope screenshots: PWM, floating phase, zero-crossing.' },
    industry: ['MOSFET selection from datasheets (R_DS(on), Q_g, SOA, thermal resistance)', 'Gate-driver design', 'ESC firmware configuration (Bluejay/AM32)', 'PCB layout for high current'],
    sim: null,
    resources: [
      { kind: 'docs', t: 'Fundamentals of MOSFET and IGBT Gate Driver Circuits (SLUA618)', by: 'Texas Instruments', url: 'https://www.ti.com/lit/an/slua618a/slua618a.pdf' },
      { kind: 'tool', t: 'AM32 ESC firmware', by: 'GitHub — am32-firmware', url: 'https://github.com/am32-firmware/AM32' },
      { kind: 'tool', t: 'Bluejay ESC firmware', by: 'GitHub — bird-sanctuary', url: 'https://github.com/bird-sanctuary/bluejay' },
      { kind: 'tool', t: 'ESC Configurator (web)', by: 'esc-configurator.com', url: 'https://esc-configurator.com/' },
      { kind: 'docs', t: 'DShot RPM filtering', by: 'Betaflight docs', url: 'https://betaflight.com/docs/wiki/guides/current/DSHOT-RPM-Filtering' },
      { kind: 'video', t: 'GreatScott! — MOSFETs and gate drivers', by: 'YouTube search', yt: 'GreatScott MOSFET gate driver explained' },
      { kind: 'video', t: 'Sensorless BLDC back-EMF zero crossing', by: 'YouTube search', yt: 'sensorless BLDC back EMF zero crossing explained' },
      { kind: 'video', t: 'Phil\'s Lab — PCB design for power electronics', by: 'YouTube search', yt: 'Phils Lab half bridge gate driver PCB' },
    ],
    shorts: ['how an ESC works', 'MOSFET shoot through', 'BLDC six step commutation'],
    reels: [
      { front: 'MOSFET switch should be in which region when ON?', back: 'Ohmic (triode). "Saturation" in a MOSFET is the constant-current amplifier region — a switch must pass through it fast.' },
      { front: 'Switching loss formula', back: 'P_sw ≈ ½·V·I·(t_r + t_f)·f_sw' },
      { front: 'Why a bootstrap capacitor?', back: 'High-side N-FET source floats at V_bat; the cap, charged when the low side is on, supplies V_GS ≈ 10 V above it.' },
      { front: 'BLHeli_32 status?', back: 'Discontinued mid-2024. Use AM32 (32-bit) or Bluejay (BLHeli_S hardware).' },
      { front: 'DShot frame?', back: '16 bits: 11 throttle + 1 telemetry request + 4 CRC. Digital, no calibration.' },
    ],
    quiz: [
      { q: 'Why is a gate driver used between the MCU and power MOSFETs?', o: ['To convert DC to AC', 'To give enough V_GS for low R_DS(on) and amps of peak current to charge the gate quickly (plus high-side level shifting)', 'To measure battery voltage', 'To cool the MOSFETs'], a: 1, e: 'The MCU pin gives ~3.3 V at ~20 mA; the driver supplies ~10 V at amps and floats the high side via bootstrap.' },
      { q: 'Shoot-through is…', o: ['Motor over-speed', 'High and low FET of one leg ON together, shorting the bus', 'RF interference', 'Back-EMF exceeding V_bat'], a: 1, e: 'Prevented by dead-time between turning one off and the other on.' },
      { q: 'Doubling PWM frequency roughly doubles which loss?', o: ['Conduction', 'Switching and gate-drive', 'Copper loss in the motor', 'None'], a: 1, e: 'Both P_sw and P_gate are ∝ f_sw.' },
      { q: 'In six-step drive, how is rotor position found without sensors?', o: ['GPS', 'Back-EMF zero crossing on the floating phase', 'Measuring battery current', 'Hall sensors are always required'], a: 1, e: 'The undriven phase reveals back-EMF; its crossing of V_bus/2 times the next step.' },
      { q: 'Bidirectional DShot enables…', o: ['Higher throttle resolution', 'eRPM telemetry for RPM notch filtering', 'Encryption', 'Analog calibration'], a: 1, e: 'The ESC replies with eRPM on the same wire; the FC places notch filters at motor harmonics.' },
      { q: 'You need a new 32-bit ESC firmware in 2026. Best choice?', o: ['BLHeli_32 update', 'AM32', 'SimonK', 'Analog PWM'], a: 1, e: 'BLHeli_32 ended in 2024; AM32 is the open-source successor for ARM ESCs.' },
    ],
  },

  {
    id: 'power',
    title: 'Batteries & Power Distribution',
    tag: 'Circuits & Electrochemistry',
    eee: 'Thevenin equivalents and I²R — with fire risk',
    color: '#fbbf24',
    mins: 100,
    summary: 'LiPo and Li-ion cells, C-rating, internal resistance and voltage sag, energy and flight time, BECs and buck converters, wiring and connectors, and safe handling.',
    outcomes: [
      'Model a pack as an EMF with internal resistance and predict sag and heat.',
      'Estimate flight time from capacity, current and usable fraction.',
      'Size BECs, wires and connectors.',
      'Follow charging, storage and disposal rules.',
    ],
    sections: [
      { h: 'Cells, packs and the numbers on the label', body: `**LiPo** cell: 3.0 V empty (never below under load for long), 3.7 V nominal, 4.2 V full (4.35 V for "HV"). Storage at ~3.8 V/cell. **"4S1P 1500 mAh 120C"** = four cells in series (14.8 V nominal, 16.8 V full), one parallel group, 1.5 Ah capacity, *claimed* max discharge 120 × 1.5 = 180 A.

C-ratings are marketing; **internal resistance (IR)** is the real metric. Measure IR per cell with a good charger. New 1500 mAh FPV cells: a few mΩ; worn: 15–30 mΩ.

**Li-ion** (18650/21700): higher energy density (~200–260 Wh/kg cell-level) but much lower current capability — ideal for long-range, low-current flights. LiPo packs are ~130–180 Wh/kg but deliver huge currents.` },
      { h: 'Derivation: pack as a Thevenin source', type: 'derive', body: `Model each cell as EMF $E$ in series with $R_{cell}$. For $N$ series cells (plus wiring/connector resistance $R_w$):

$$V_{load} = N E - I(N R_{cell} + R_w), \\qquad P_{heat} = I^2(N R_{cell}+R_w)$$

Usable energy and time with usable fraction $u$ (~0.8 to protect the cells):

$$E_{Wh} = N \\cdot 3.7 \\cdot C_{Ah}, \\qquad t = \\frac{u\\,C_{Ah}}{I_{avg}}$$

Peukert-like effects (less capacity at very high C) and temperature make real numbers worse; a cold pack in Warangal winter mornings sags noticeably more.` },
      { h: 'Power distribution', body: `- **PDB / AIO boards** carry battery current to the ESCs, often with a **current sensor** (shunt + amplifier or Hall) so the FC can report mAh used.
- **BEC** (battery eliminator circuit) = a buck converter making 5 V for FC/receiver and 9–12 V for video. Switching (buck) BECs are ~85–95% efficient; linear regulators burn $(V_{in}-V_{out})I$ as heat — never use one from 6S.
- **Low-ESR capacitor** (e.g. 1000 µF, 35 V for 6S) across the ESC input absorbs voltage spikes from motor braking and long battery leads. Missing caps kill ESCs and add gyro noise.
- **Wires and connectors:** XT30 (~30 A cont.), XT60 (~60 A), XT90 (~90 A). Wire: 14 AWG for 5″ FPV, 12/10 AWG for larger. Voltage drop $= I R_{wire}$ — 10 cm of 14 AWG is ~0.8 mΩ.` },
      { h: 'Safety rules (non-negotiable)', body: `- Charge at ≤ 1C unless the manufacturer allows more, on a balance charger, on a non-flammable surface, **never unattended**.
- Store at 3.8 V/cell in a LiPo bag or ammo box; don't leave full packs in a hot room or car.
- Puffed (swollen) pack = retire it. Discharge to ~0 V in a safe way and dispose via e-waste.
- Never short, puncture or crush. A LiPo fire can't be smothered easily — sand bucket and distance.
- Land at ~3.5 V/cell (resting); loaded voltage can read lower.` },
    ],
    numericals: [
      { q: 'A 4S 5000 mAh pack powers a drone drawing 25 A on average. Using 80% of capacity, what is the flight time?', steps: ['Usable charge = 0.8 × 5 Ah = 4 Ah.', 't = 4/25 h = 0.16 h = **9.6 min**.'], answer: '9.6 min', why: 'Always add reserve for landing and wind; plan missions around ~70% of this.' },
      { q: 'A 4S 1500 mAh pack has 8 mΩ per cell. At a 60 A punch, find the voltage sag, loaded pack voltage if the resting voltage is 16.0 V, and heat generated.', steps: ['R_pack = 4 × 8 mΩ = 32 mΩ.', 'Sag = 60 × 0.032 = **1.92 V** → V_load = 16.0 − 1.92 = **14.08 V** (3.52 V/cell).', 'Heat = I²R = 3600 × 0.032 = **115 W** (briefly).'], answer: 'Sag 1.92 V; 14.08 V; ~115 W heat', why: 'That heat is why packs get hot after aggressive flying, and why IR rises as they age.' },
      { q: 'Energy in a 4S 1500 mAh pack and in a 6S 1100 mAh pack. Which stores more?', steps: ['4S: 14.8 V × 1.5 Ah = **22.2 Wh**.', '6S: 22.2 V × 1.1 Ah = **24.4 Wh**.'], answer: '6S 1100 stores more energy (24.4 vs 22.2 Wh)', why: 'Compare packs in Wh, not mAh, when voltages differ.' },
      { q: 'A linear 5 V regulator powers a 0.5 A load from a 6S pack (25.2 V full). How much power does it waste? What about a 90%-efficient buck?', steps: ['Linear: (25.2 − 5) × 0.5 = **10.1 W** wasted (it would overheat).', 'Buck: P_out = 2.5 W → P_in = 2.78 W → waste **0.28 W**.'], answer: '10.1 W vs 0.28 W', why: 'This is why every FC uses switching BECs.' },
    ],
    practice: [
      { book: 'Battery University (Cadex)', where: 'Lithium-ion/polymer charging, ageing and IR articles', note: 'Free and practical.' },
      { book: 'Quan Quan — Introduction to Multicopter Design and Control', where: 'Battery modelling within the propulsion chapter', note: 'Endurance estimation examples.' },
      { book: 'Your Circuit Theory textbook', where: 'Thevenin equivalent & maximum power transfer problems', note: 'A loaded battery is exactly a Thevenin source.' },
    ],
    lab: { title: 'Measure a pack\'s internal resistance', kit: ['LiPo pack', 'Known load (e.g. 1 Ω power resistor or an electronic load)', 'Multimeter', 'Fan / safe bench'], steps: ['Measure open-circuit voltage V₁.', 'Apply a known current I for 2–3 s; measure V₂ during load.', 'R_pack = (V₁ − V₂)/I. Compare with the charger\'s IR reading.', 'Repeat on an old pack and on a cold pack.'], deliverable: 'IR table for new/old/cold packs with calculated sag at your hover and max currents.' },
    industry: ['Pack selection and power budgets', 'BEC/DC-DC design', 'Current sensing calibration', 'Battery safety SOPs'],
    sim: 'battery',
    resources: [
      { kind: 'docs', t: 'Battery University', by: 'Cadex Electronics', url: 'https://batteryuniversity.com/' },
      { kind: 'docs', t: 'Oscar Liang — LiPo battery guide', by: 'oscarliang.com', url: 'https://oscarliang.com/lipo-battery-guide/' },
      { kind: 'video', t: 'LiPo safety and IR explained', by: 'YouTube search', yt: 'LiPo battery internal resistance explained drone' },
      { kind: 'video', t: 'Buck converter explained', by: 'YouTube search', yt: 'buck converter how it works explained' },
    ],
    shorts: ['lipo battery fire', 'lipo storage voltage', 'buck converter explained'],
    reels: [
      { front: 'LiPo full / nominal / storage / empty?', back: '4.2 / 3.7 / 3.8 / 3.0 V per cell (don\'t fly down to 3.0).' },
      { front: 'Better pack metric than C-rating?', back: 'Internal resistance (mΩ per cell).' },
      { front: 'Flight time formula', back: 't = usable·C(Ah) / I_avg  (usable ≈ 0.8)' },
      { front: 'Linear regulator from 6S to 5 V?', back: 'Never. It wastes (V_in − V_out)·I. Use a buck BEC.' },
    ],
    quiz: [
      { q: 'A "6S" LiPo fully charged is about…', o: ['22.2 V', '25.2 V', '24 V', '26.1 V'], a: 1, e: '6 × 4.2 = 25.2 V (22.2 V is nominal).' },
      { q: 'Voltage sag under load is caused mainly by…', o: ['Capacity', 'Internal resistance', 'C-rating label', 'Balance lead'], a: 1, e: 'V_drop = I × R_internal.' },
      { q: 'Correct LiPo storage voltage per cell?', o: ['4.2 V', '3.8 V', '3.3 V', '3.0 V'], a: 1, e: '~3.8 V/cell minimises ageing in storage.' },
      { q: 'Why add a big low-ESR capacitor at the ESC power input?', o: ['More capacity', 'Absorb voltage spikes and ripple from switching/regen', 'Increase KV', 'Filter RC signal'], a: 1, e: 'Long leads have inductance; switching and braking create spikes that can exceed MOSFET ratings.' },
      { q: 'Same drone, same 300 W power demand: which pack flies longer, 4S 1500 mAh or 6S 1100 mAh?', o: ['4S 1500 (more mAh)', '6S 1100 (more Wh)', 'Same', 'Impossible to say'], a: 1, e: 'Compare energy, not mAh: 4S 1500 = 22.2 Wh, 6S 1100 = 24.4 Wh. At equal power, more Wh = more minutes.' },
      { q: 'A swollen LiPo should be…', o: ['Flown gently', 'Charged slowly', 'Retired and safely disposed', 'Punctured to release gas'], a: 2, e: 'Swelling = internal gas from degradation; it is a fire risk. Never puncture.' },
    ],
  },

  {
    id: 'sensing',
    title: 'Sensors & State Estimation',
    tag: 'Digital Electronics + Probability',
    eee: 'Signals & Systems meets probability: how the drone knows where it is',
    color: '#c084fc',
    mins: 180,
    summary: 'MEMS IMUs, magnetometer, barometer, GNSS and rangefinders; noise, bias and calibration; the complementary filter, Mahony/Madgwick, and the Kalman filter/EKF used by PX4 and ArduPilot.',
    outcomes: [
      'Explain how MEMS gyros/accelerometers work and their error sources.',
      'Derive and tune a complementary filter; compute its time constant.',
      'Run the 1-D Kalman filter by hand and explain the EKF used in autopilots.',
      'Read an IMU over SPI and convert raw counts to physical units.',
    ],
    sections: [
      { h: 'The sensor suite', body: `| Sensor | Measures | Good at | Bad at | Bus |
|---|---|---|---|---|
| Gyroscope (MEMS) | angular rate | fast, smooth, short-term | bias → drift when integrated | SPI |
| Accelerometer | specific force (gravity + motion) | long-term "which way is down" | noisy, fooled by acceleration & vibration | SPI |
| Magnetometer | Earth's field | heading (yaw) | motor/wire currents, iron nearby | I²C |
| Barometer | pressure → altitude | relative height | prop wash, wind, temperature drift | I²C/SPI |
| GNSS (GPS/NavIC/…) | position, velocity | absolute position | 1–3 m error, 5–10 Hz, multipath | UART |
| Rangefinder / LiDAR / optical flow | height, ground speed | precise near ground | limited range, surfaces | UART/I²C |

**MEMS gyro:** a vibrating proof mass; rotation creates a Coriolis force perpendicular to the vibration, sensed capacitively. **Accelerometer:** a proof mass on springs; displacement ∝ force, read as capacitance change. Both output 16-bit two's-complement counts. Common FC IMUs: ICM-42688-P, BMI270, ICM-20602.` },
      { h: 'Raw counts to units, and calibration', body: `An accelerometer set to ±8 g over 16 bits has sensitivity $65536/16 = 4096$ LSB/g. A gyro at ±2000 °/s has $65536/4000 = 16.4$ LSB/(°/s).

Model each axis: $y = (1+s)\\,x + b + n$ (scale error $s$, bias $b$, noise $n$). Calibration estimates $s$ and $b$: six-position accel calibration, gyro bias averaged at rest on boot (that's why the FC asks you not to move it), magnetometer **hard-iron** (offset) and **soft-iron** (ellipsoid → sphere) calibration.

Reading tilt from the accelerometer when not accelerating: $\\phi = \\operatorname{atan2}(a_y, a_z)$, $\\theta = \\operatorname{atan2}(-a_x, \\sqrt{a_y^2+a_z^2})$. Gravity has **no information about yaw** — heading needs a magnetometer, GNSS velocity, or two GNSS antennas.` },
      { h: 'Derivation: the complementary filter is a pair of filters', type: 'derive', body: `Discrete update at period $\\Delta t$:

$$\\hat\\theta_k = \\alpha(\\hat\\theta_{k-1} + \\omega_k\\Delta t) + (1-\\alpha)\\theta_{acc,k}$$

Take the Laplace view of the continuous equivalent with time constant $\\tau$:

$$\\hat\\Theta(s) = \\underbrace{\\frac{\\tau s}{\\tau s + 1}}_{\\text{high-pass}}\\frac{\\Omega(s)}{s} + \\underbrace{\\frac{1}{\\tau s+1}}_{\\text{low-pass}}\\Theta_{acc}(s)$$

The two weights sum to 1, so the true angle passes with **unity gain at all frequencies** — gyro covers fast motion, accelerometer covers slow. Matching the discrete form gives

$$\\tau = \\frac{\\alpha\\,\\Delta t}{1-\\alpha}, \\qquad f_c = \\frac{1}{2\\pi\\tau}$$

**Mahony** filter = complementary filter on SO(3) (with a PI correction that also estimates gyro bias). **Madgwick** uses gradient descent on quaternions. Both are cheap and used in small FCs.` },
      { h: 'The Kalman filter in one page', type: 'derive', body: `A Kalman filter keeps a **mean** $\\hat x$ and **uncertainty** $P$ and alternates two steps.

**Predict** (motion model, uncertainty grows):
$$\\hat x^- = F\\hat x + Bu, \\qquad P^- = FPF^T + Q$$

**Update** (measurement $z = Hx + v$, uncertainty shrinks):
$$K = P^-H^T(HP^-H^T + R)^{-1}, \\quad \\hat x = \\hat x^- + K(z - H\\hat x^-), \\quad P = (I-KH)P^-$$

In 1-D with $H = 1$: $K = P^-/(P^-+R)$ — a weighted average that trusts whichever source is less uncertain. $Q$ = how much you distrust the model, $R$ = how much you distrust the sensor.

Real attitudes/positions are nonlinear, so autopilots use an **Extended Kalman Filter** (linearise with Jacobians each step). **PX4 runs EKF2; ArduPilot runs EKF3** — each fuses IMU, GNSS, baro, mag, optical flow, etc., estimating ~20+ states including sensor biases and wind.` },
    ],
    numericals: [
      { q: 'A gyro has an uncorrected bias of 0.5 °/s. If you only integrate the gyro, how much attitude error after 60 s?', steps: ['Error = bias × time = 0.5 × 60 = **30°**.'], answer: '30°', why: 'A level hover would slowly "lean" 30° — the accelerometer (or Kalman bias estimate) must correct it.' },
      { q: 'A complementary filter runs at 250 Hz with α = 0.98. Find the time constant and crossover frequency.', steps: ['Δt = 0.004 s.', 'τ = αΔt/(1−α) = 0.98 × 0.004 / 0.02 = **0.196 s**.', 'f_c = 1/(2πτ) = **0.81 Hz**: below it trust the accelerometer, above it the gyro.'], answer: 'τ ≈ 0.196 s; f_c ≈ 0.81 Hz', why: 'Change loop rate and you must change α to keep the same τ — a common bug when porting code.' },
      { q: 'A stationary IMU reads a_x = 0, a_y = 4.9 m/s², a_z = 8.49 m/s². Find roll.', steps: ['φ = atan2(a_y, a_z) = atan2(4.9, 8.49) = **30.0°**.', 'Check: √(4.9² + 8.49²) = 9.80 m/s² = g ✓ (so the vehicle really is static).'], answer: '30° roll', why: 'Checking |a| ≈ g is how good filters decide when to trust the accelerometer.' },
      { q: '1-D Kalman: prior altitude 100 m with variance 4 m²; barometer reads 103 m with variance 1 m². Find the fused estimate and its variance.', steps: ['K = P⁻/(P⁻ + R) = 4/(4+1) = 0.8.', 'x̂ = 100 + 0.8 × (103 − 100) = **102.4 m**.', 'P = (1 − 0.8) × 4 = **0.8 m²** (smaller than either source!).'], answer: '102.4 m, variance 0.8 m²', why: 'Fusion beats both inputs — that is the whole point.' },
    ],
    practice: [
      { book: 'Roger Labbe — Kalman and Bayesian Filters in Python (free, GitHub)', where: 'Chapters on the g-h filter, 1-D Kalman, multivariate KF and EKF', note: 'Interactive notebooks; the best self-study route.' },
      { book: 'Paul Groves — Principles of GNSS, Inertial, and Multisensor Integrated Navigation Systems (Artech)', where: 'Inertial sensors and INS/GNSS integration chapters', note: 'The industry reference for navigation engineers.' },
      { book: 'Your Probability & Random Processes textbook', where: 'Gaussian distributions, variance of sums', note: 'Kalman gain is just optimal weighting of Gaussians.' },
    ],
    lab: { title: 'IMU to angle on an Arduino/STM32', kit: ['MPU-6050/ICM-42688 breakout', 'Arduino or STM32 (Blue/Black Pill)', 'Python for plotting'], steps: ['Read raw accel/gyro over I²C (MPU-6050) or SPI (ICM-42688); print at 250 Hz.', 'Average 1000 gyro samples at rest → bias; subtract it.', 'Compute accel roll/pitch and gyro-integrated angle; implement the complementary filter.', 'Tape the IMU to a motor mount and run a motor: watch the accel angle go crazy (vibration) — then fix it with soft mounting.', 'Stretch goal: implement a Mahony filter and compare.'], deliverable: 'Plot of accel / gyro / fused angle while tilting by hand and with vibration.' },
    industry: ['Sensor selection and calibration', 'EKF tuning on PX4/ArduPilot logs', 'Vibration isolation', 'Sensor fusion in C++/Python'],
    sim: 'filter',
    resources: [
      { kind: 'book', t: 'Kalman and Bayesian Filters in Python', by: 'Roger Labbe (free)', url: 'https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python' },
      { kind: 'video', t: 'Understanding Kalman Filters (7 parts)', by: 'MATLAB Tech Talks', url: 'https://www.mathworks.com/videos/series/understanding-kalman-filters.html' },
      { kind: 'docs', t: 'Using PX4\'s Navigation Filter (EKF2)', by: 'PX4 docs', url: 'https://docs.px4.io/main/en/advanced_config/tuning_the_ecl_ekf.html' },
      { kind: 'docs', t: 'Extended Kalman Filter (EKF) in ArduPilot', by: 'ArduPilot dev docs', url: 'https://ardupilot.org/dev/docs/extended-kalman-filter.html' },
      { kind: 'video', t: 'Steve Brunton — Kalman filter lectures', by: 'YouTube search', yt: 'Steve Brunton Kalman filter control bootcamp' },
      { kind: 'video', t: 'MEMS gyroscope how it works', by: 'YouTube search', yt: 'how MEMS gyroscope accelerometer works inside chip' },
    ],
    shorts: ['MEMS accelerometer explained', 'kalman filter explained simply', 'gyroscope drift'],
    reels: [
      { front: 'Gyro vs accelerometer weakness?', back: 'Gyro: bias → drift when integrated. Accel: noise, vibration, fooled by acceleration.' },
      { front: 'Complementary filter time constant', back: 'τ = α·Δt/(1−α). α = 0.98 at 250 Hz → 0.196 s.' },
      { front: 'Kalman gain in 1-D', back: 'K = P⁻/(P⁻ + R): trust whoever is less uncertain.' },
      { front: 'Why can\'t the accelerometer fix yaw?', back: 'Gravity points down regardless of heading. Use magnetometer or GNSS.' },
      { front: 'PX4 vs ArduPilot estimator?', back: 'PX4: EKF2. ArduPilot: EKF3.' },
    ],
    quiz: [
      { q: 'Why fuse gyro and accelerometer at all?', o: ['To save power', 'Gyro drifts long-term, accel is noisy short-term — together they cover each other', 'Accel is faster', 'Required by law'], a: 1, e: 'Complementary error characteristics: high-pass the gyro, low-pass the accel.' },
      { q: 'Accelerometer ±8 g on 16 bits: sensitivity?', o: ['2048 LSB/g', '4096 LSB/g', '8192 LSB/g', '16384 LSB/g'], a: 1, e: '65536 counts / 16 g span = 4096 LSB/g.' },
      { q: 'In a Kalman filter, increasing R (measurement noise) makes the filter…', o: ['Trust the sensor more', 'Trust the prediction more', 'Diverge always', 'Run faster'], a: 1, e: 'Larger R → smaller K → measurements move the estimate less.' },
      { q: 'Magnetometer hard-iron calibration corrects…', o: ['Scale', 'A constant offset from nearby magnetised parts', 'Temperature', 'Latency'], a: 1, e: 'Hard iron = offset (sphere shifted); soft iron = distortion (sphere → ellipsoid).' },
      { q: 'A drone is accelerating forward at 3 m/s². The accel-only pitch estimate will be…', o: ['Correct', 'Wrong — it sees a tilted "gravity"', 'Zero', 'Undefined'], a: 1, e: 'The accelerometer measures specific force (gravity minus acceleration), so linear acceleration looks like tilt.' },
      { q: 'Why do flight controllers use SPI rather than I²C for the IMU?', o: ['Fewer pins', 'Much higher clock rates (MHz) and lower latency for kHz sampling', 'Built-in addressing', 'Lower power'], a: 1, e: 'SPI runs at several MHz with no addressing overhead — essential for kHz gyro loops.' },
    ],
  },

  {
    id: 'control',
    title: 'Control: Cascaded PID to Modern Methods',
    tag: 'Control Systems',
    eee: 'Your Control Systems course, flying',
    color: '#4ade80',
    mins: 200,
    summary: 'Transfer-function view of the attitude loop, cascaded angle/rate PID, discrete implementation, D-term filtering, anti-windup, feedforward, tuning from step responses and logs, and where LQR/MPC fit.',
    outcomes: [
      'Write a discrete-time PID with derivative-on-measurement, filtering and anti-windup.',
      'Explain why loops are cascaded and how to choose bandwidths.',
      'Relate gains to damping ratio and overshoot using the plant model.',
      'Tune from step responses / blackbox logs and know when to reach for LQR or MPC.',
    ],
    sections: [
      { h: 'Plant first: what are we controlling?', body: `From the dynamics module, one attitude axis near hover is torque → angle $1/(Js^2)$. Motors don't change thrust instantly: a first-order lag with time constant $T_m$ (≈ 10–50 ms; bigger props are slower). The **rate** plant is therefore

$$G_{rate}(s) = \\frac{\\omega(s)}{u(s)} = \\frac{K}{s\\,(T_m s + 1)}$$

That extra pole from the motor lag is what limits how aggressive you can be: it eats phase margin.` },
      { h: 'Cascaded control', body: `[[fig:cascade]]

- **Rate loop** (inner, fastest): PID on gyro rate. This is what "PID tuning" in Betaflight means.
- **Angle loop** (outer): mostly P, turns angle error into a rate setpoint.
- **Velocity → position loops** (ArduPilot/PX4 modes like Loiter/Position): convert position error into a tilt (angle) setpoint.

Rule: each outer loop's bandwidth ≈ 1/5–1/10 of the inner loop's, so the inner loop looks "instant" to the outer one. In acro/rate mode the pilot commands the rate loop directly.` },
      { h: 'Derivation: P control on the rate plant', type: 'derive', body: `Close a P loop around $G = K/(s(T_m s+1))$:

$$\\frac{\\omega}{\\omega_{sp}} = \\frac{K K_p}{T_m s^2 + s + K K_p} \\;\\Rightarrow\\; \\omega_n = \\sqrt{\\frac{K K_p}{T_m}}, \\quad \\zeta = \\frac{1}{2\\sqrt{K K_p T_m}}$$

Raising $K_p$ raises speed $\\omega_n$ but lowers damping $\\zeta$ → overshoot $M_p = e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}$ grows. **D adds damping** (phase lead) so you can keep high P without ringing; **I removes steady error** from disturbances (wind, CG offset, a weak motor) but adds phase lag and overshoot.

Practical limits on D: it differentiates sensor noise (motor vibration) → hot motors. Hence **D-term low-pass filters** and RPM/notch filtering (next module).` },
      { h: 'Discrete PID you can actually fly', body: `\`\`\`c
// runs at loop rate, dt in seconds
float pid_update(PID *c, float setpoint, float meas, float dt) {
    float err = setpoint - meas;
    // P
    float p = c->kp * err;
    // I with clamping anti-windup
    c->integ += c->ki * err * dt;
    c->integ = clampf(c->integ, -c->i_lim, c->i_lim);
    // D on measurement (no kick on setpoint steps), low-pass filtered
    float d_raw = -(meas - c->prev_meas) / dt;
    c->d_filt += c->d_alpha * (d_raw - c->d_filt);   // first-order LPF
    c->prev_meas = meas;
    float d = c->kd * c->d_filt;
    // feedforward: react to stick movement before error builds
    float ff = c->kff * (setpoint - c->prev_sp) / dt;
    c->prev_sp = setpoint;
    return clampf(p + c->integ + d + ff, -1.0f, 1.0f);
}
\`\`\`

Industry details hidden in those lines: **derivative on measurement** (avoids "derivative kick"), **integrator clamp** (anti-windup when motors saturate), **iterm relax** (Betaflight limits I during fast stick moves), **TPA** (reduce P/D at high throttle), and **feedforward** for stick responsiveness.` },
      { h: 'Tuning workflow used in practice', body: `1. Fix mechanical problems first (vibration, loose props): no tune fixes a bad frame.
2. Filters next: just enough to keep motors cool.
3. P/D balance: raise P until mid-frequency oscillation (bounce-back), then add D to damp it; check motor temperature.
4. I: increase until it holds attitude through throttle punches and wind without slow wobble.
5. Feedforward for stick feel.
6. Verify in logs: setpoint vs gyro traces (Blackbox Explorer, PID Toolbox, ArduPilot UAV Log Viewer).

ArduPilot offers **AutoTune** and PX4 an autotune module that do system identification in flight. Beyond PID: **LQR** (optimal state feedback on the linearised model), **MPC** (optimises over a horizon with constraints — used for aggressive trajectories), **INDI** (incremental nonlinear dynamic inversion — very robust, used in research and some products).` },
    ],
    numericals: [
      { q: 'A closed-loop rate response is second order with ζ = 0.5. What overshoot do you expect? What ζ gives ~4.6% overshoot?', steps: ['M_p = exp(−ζπ/√(1−ζ²)) = exp(−0.5π/0.866) = exp(−1.814) = **16.3%**.', 'For ζ = 0.7: exp(−0.7π/0.714) = exp(−3.08) = **4.6%**.'], answer: '16.3%; ζ ≈ 0.7', why: 'ζ ≈ 0.6–0.8 is the usual sweet spot for attitude loops.' },
      { q: 'Rate plant K/(s(T_m s+1)) with T_m = 0.02 s, P control only. What loop gain K·K_p gives ζ = 0.7, and what is ω_n?', steps: ['ζ = 1/(2√(K K_p T_m)) → K K_p = 1/(4ζ²T_m) = 1/(4 × 0.49 × 0.02) = **25.5 s⁻¹**.', 'ω_n = √(K K_p / T_m) = √(25.5/0.02) = **35.7 rad/s** (≈ 5.7 Hz).', '2% settling ≈ 4/(ζω_n) = 4/(0.7 × 35.7) = **0.16 s**.'], answer: 'K·K_p ≈ 25.5 s⁻¹; ω_n ≈ 35.7 rad/s; t_s ≈ 0.16 s', why: 'Slower motors (bigger T_m) force a lower gain for the same damping — big drones feel softer.' },
      { q: 'The rate loop runs at 8 kHz but the gyro is read at 8 kHz with 1 ms of total filter delay. What phase lag does that delay add at 50 Hz (a typical crossover)?', steps: ['Phase lag = 360° × f × delay = 360 × 50 × 0.001 = **18°**.'], answer: '18°', why: 'Filter delay directly eats phase margin — the core reason FPV firmware fights to minimise filtering.' },
    ],
    practice: [
      { book: 'Norman Nise — Control Systems Engineering (Wiley)', where: 'Time response (second-order systems), root locus, and PID design chapters', note: 'Lots of solved and end-of-chapter problems in exactly this style.' },
      { book: 'Åström & Murray — Feedback Systems (free online edition)', where: 'PID control chapter, including anti-windup and derivative filtering', note: 'Rigorous and practical.' },
      { book: 'K. Ogata — Modern Control Engineering', where: 'Transient response analysis problems', note: 'Classic Indian-syllabus text.' },
    ],
    lab: { title: 'Tune a real (or simulated) quad from logs', kit: ['FPV quad with Blackbox, or ArduPilot/PX4 SITL', 'Blackbox Explorer / PID Toolbox / UAV Log Viewer'], steps: ['Fly 3 tests: default tune, +30% P, +30% D. Same moves each time (snap rolls, punch-outs).', 'Overlay setpoint vs gyro; measure overshoot and delay.', 'Note motor temperatures after each.', 'In SITL: run ArduPilot AutoTune and compare its gains to yours.'], deliverable: 'A one-page tuning report with plots and the chosen gains, justified.' },
    industry: ['PID implementation details (anti-windup, D on measurement, filtering)', 'Log-based tuning', 'Simulink/Python control design', 'Awareness of LQR, MPC, INDI'],
    sim: 'pid',
    resources: [
      { kind: 'video', t: 'Understanding PID Control (7 parts)', by: 'MATLAB Tech Talks', url: 'https://www.mathworks.com/videos/series/understanding-pid-control.html' },
      { kind: 'video', t: 'Tuning the PID Controller (drone series part 5)', by: 'MATLAB Tech Talks', url: 'https://www.mathworks.com/videos/series/drone-simulation-and-control.html' },
      { kind: 'tool', t: 'Betaflight Blackbox Explorer', by: 'GitHub — betaflight', url: 'https://github.com/betaflight/blackbox-log-viewer' },
      { kind: 'docs', t: 'ArduPilot AutoTune', by: 'ArduPilot docs', url: 'https://ardupilot.org/copter/docs/autotune.html' },
      { kind: 'video', t: 'Steve Brunton — Control Bootcamp', by: 'YouTube search', yt: 'Steve Brunton control bootcamp' },
      { kind: 'video', t: 'Chris Rosser — Blackbox / PID tuning', by: 'YouTube search', yt: 'Chris Rosser PID tuning blackbox' },
      { kind: 'video', t: 'UAV Tech — PID tuning explained', by: 'YouTube search', yt: 'UAV Tech PID tuning quadcopter' },
    ],
    shorts: ['PID controller explained', 'drone PID tuning', 'P I D animation'],
    reels: [
      { front: 'P, I, D in one line each', back: 'P: push proportional to error. I: remove steady error (wind). D: damp — oppose fast change.' },
      { front: 'Why derivative on measurement?', back: 'Avoids "derivative kick" when the setpoint jumps.' },
      { front: 'Anti-windup?', back: 'Clamp/stop the integrator when the output saturates, or it overshoots badly afterwards.' },
      { front: 'Overshoot for ζ = 0.5 / 0.7?', back: '16.3% / 4.6%' },
      { front: 'Delay → phase lag', back: 'φ = 360°·f·t_d. 1 ms at 50 Hz = 18°.' },
    ],
    quiz: [
      { q: 'Fast bounce-back oscillation right after a quick flip usually means…', o: ['Too much I', 'P too high relative to D (under-damped)', 'Low battery', 'GPS glitch'], a: 1, e: 'Under-damping → overshoot and ringing; add D or reduce P. (Very high-frequency jitter with hot motors points to D/noise instead.)' },
      { q: 'Which term removes steady error from a constant wind?', o: ['P', 'I', 'D', 'Feedforward'], a: 1, e: 'Integral accumulates any persistent error until the output cancels it.' },
      { q: 'Why is the inner loop the rate loop rather than the angle loop?', o: ['Gyro measures rate directly, fast and low-noise; it closes the fastest dynamics', 'Angles are illegal', 'Rate is cheaper to compute', 'Tradition only'], a: 0, e: 'The gyro gives rate with almost no delay, so the tightest loop sits there.' },
      { q: 'Raising K_p on K/(s(T_m s+1)) with P-only control…', o: ['Increases damping', 'Increases speed but reduces damping', 'Has no effect on overshoot', 'Makes it unstable immediately'], a: 1, e: 'ω_n ∝ √K_p, ζ ∝ 1/√K_p.' },
      { q: 'Main cost of a lower D-term filter cutoff?', o: ['More noise', 'More phase lag (delay)', 'Higher CPU', 'Lower battery voltage'], a: 1, e: 'A stronger low-pass delays the signal, reducing phase margin.' },
      { q: 'Which method optimises control over a future horizon with constraints?', o: ['PID', 'LQR', 'MPC', 'Bang-bang'], a: 2, e: 'Model Predictive Control solves a constrained optimisation each step.' },
    ],
  },
];
