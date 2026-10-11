// Modules 9–12.
export const modulesC = [
  {
    id: 'firmware',
    title: 'Flight-Controller Hardware, Firmware & Filtering',
    tag: 'Embedded Systems + DSP',
    eee: 'Microprocessors and Signals & Systems in one board',
    color: '#2dd4bf',
    mins: 180,
    summary: 'STM32 flight controllers, buses, timers and DMA, RTOS scheduling; Betaflight vs ArduPilot vs PX4; sampling and aliasing, low-pass/notch/RPM filters, and blackbox log analysis; simulation (SITL).',
    outcomes: [
      'Read an FC schematic and explain which peripheral drives what.',
      'Pick the right firmware for a mission and configure it.',
      'Explain aliasing, filter delay and RPM notch filtering with numbers.',
      'Run ArduPilot or PX4 SITL and analyse a log.',
    ],
    sections: [
      { h: 'Anatomy of a flight controller', body: `- **MCU:** STM32F405/F722/H743 (Cortex-M4/M7, FPU). H7 boards run ArduPilot/PX4 comfortably; F4/F7 common on FPV.
- **IMU on SPI** (MHz clock, interrupt on data-ready), **baro + mag on I²C**, **GNSS, receiver, telemetry, VTX control on UARTs**.
- **Timers + DMA** generate DShot waveforms for four motors with no CPU load per bit.
- **ADC** reads battery voltage (divider) and current sensor.
- **Flash/SD** for blackbox logs. **USB** for configuration.

ArduPilot runs on **ChibiOS** (RTOS), PX4 on **NuttX** (POSIX-like RTOS) with modules talking over **uORB** publish/subscribe. Betaflight runs a hand-tuned scheduler without a general RTOS.` },
      { h: 'Choosing firmware', body: `| | Betaflight | ArduPilot | PX4 |
|---|---|---|---|
| Built for | FPV freestyle/racing, manual acro | Autonomous vehicles of all kinds | Autonomous vehicles, research, industry |
| GPS missions | Rescue mode only | Full missions, geofence, failsafes | Full missions, offboard control |
| Licence | GPL | GPL | BSD (industry-friendly) |
| Config tool | Betaflight Configurator/App | Mission Planner, QGroundControl | QGroundControl |
| Your college project | Learning control/feel | **Best default for autonomy** | Great for ROS 2 work |

For a college project that must fly a mission, log data and be explainable, start with **ArduPilot on a Pixhawk-class board** (or a cheaper H743 board running ArduPilot).` },
      { h: 'Derivation: sampling, aliasing and filter delay', type: 'derive', body: `Sample at $f_s$ → any content above the Nyquist frequency $f_s/2$ **folds** back: a component at $f$ appears at $|f - k f_s|$. Motor noise at 1.2 kHz sampled at only 1 kHz would appear at 200 Hz — right inside the control band, impossible to filter afterwards. Hence high gyro rates (kHz) plus the IMU's internal anti-alias filter.

Motor noise frequencies: fundamental $f_1 = \\text{rpm}/60$, with harmonics at $2f_1, 3f_1$; prop blade-pass at $N_{blades} \\cdot f_1$. They move with throttle.

A first-order low-pass at cutoff $f_c$ has phase $-\\arctan(f/f_c)$ and low-frequency group delay $\\tau_g \\approx 1/(2\\pi f_c)$. A biquad (2nd-order) rolls off faster but delays more. A **notch** removes a narrow band with little delay elsewhere — so the best approach is notches *exactly* on the motor harmonics: the **RPM filter** uses eRPM telemetry from bidirectional DShot to place 3 harmonics × 4 motors × 3 axes of notches in real time.` },
      { h: 'Simulation before flight (SITL/HITL)', body: `**SITL** (software-in-the-loop) compiles the real autopilot code for your PC and connects it to a physics simulator (ArduPilot's built-in, Gazebo, etc.). You can fly missions, test failsafes and tune — without breaking anything. **HITL** runs the firmware on the real FC hardware with simulated sensors.

Industry expectation: every new feature is tested in SITL, with automated tests, before it ever flies.` },
    ],
    numericals: [
      { q: 'A 5″ quad\'s motors spin at 30,000 rpm with tri-blade props. Find the motor fundamental, its 2nd harmonic, and the blade-pass frequency.', steps: ['f₁ = 30,000/60 = **500 Hz**; 2f₁ = **1000 Hz**.', 'Blade-pass = 3 × 500 = **1500 Hz**.'], answer: '500 Hz, 1000 Hz, 1500 Hz', why: 'These are where you\'ll see peaks in a gyro FFT — and where the RPM filter places notches.' },
      { q: 'A gyro sampled at 1 kHz picks up vibration at 1.2 kHz with no anti-alias filter. At what frequency does it appear?', steps: ['Nyquist = 500 Hz; alias = |1200 − 1 × 1000| = **200 Hz**.'], answer: '200 Hz', why: 'An aliased 200 Hz tone looks like real motion; the controller will "fight" it.' },
      { q: 'Group delay of a first-order low-pass at 100 Hz cutoff?', steps: ['τ_g ≈ 1/(2π × 100) = **1.59 ms**.'], answer: '≈ 1.6 ms', why: 'Combine with the control module: 1.6 ms at a 50 Hz crossover costs ~29° of phase.' },
    ],
    practice: [
      { book: 'Richard Lyons — Understanding Digital Signal Processing (Pearson)', where: 'Sampling/aliasing and IIR filter chapters', note: 'Most readable DSP book for engineers.' },
      { book: 'Oppenheim & Willsky — Signals and Systems', where: 'Sampling theorem problems', note: 'Your syllabus text; same maths.' },
      { book: 'ArduPilot Dev Docs', where: 'SITL and "Learning the ArduPilot codebase" pages', note: 'Hands-on.' },
    ],
    lab: { title: 'SITL + FFT on a real log', kit: ['PC with Ubuntu/WSL2', 'ArduPilot SITL (sim_vehicle.py) or PX4 SITL', 'Mission Planner/QGroundControl', 'Any blackbox/DataFlash log'], steps: ['Install ArduPilot SITL; take off, fly a square mission, land.', 'Trigger a failsafe (RC loss) and watch the vehicle RTL.', 'Open a log; plot gyro data and its FFT (Mission Planner FFT or Python). Identify motor peaks.', 'Enable the harmonic notch (ArduPilot INS_HNTCH_*) in SITL with simulated vibration and compare.'], deliverable: 'Screenshots of the mission + an FFT plot with labelled motor harmonics.' },
    industry: ['STM32 + RTOS', 'ArduPilot/PX4 build & parameter tuning', 'Gyro FFT and notch filtering', 'SITL-first testing culture', 'Git + C++'],
    sim: null,
    resources: [
      { kind: 'docs', t: 'SITL Simulator (Software in the Loop)', by: 'ArduPilot dev docs', url: 'https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html' },
      { kind: 'docs', t: 'DShot RPM Filtering', by: 'Betaflight docs', url: 'https://betaflight.com/docs/wiki/guides/current/DSHOT-RPM-Filtering' },
      { kind: 'docs', t: 'PX4 User Guide', by: 'Dronecode', url: 'https://docs.px4.io/main/en/' },
      { kind: 'video', t: 'Phil\'s Lab — flight controller / STM32 PCB design', by: 'YouTube search', yt: 'Phils Lab drone flight controller PCB design STM32' },
      { kind: 'video', t: 'Joop Brokking — build your own Arduino flight controller', by: 'YouTube search', yt: 'Joop Brokking YMFC flight controller' },
      { kind: 'video', t: 'Aliasing explained', by: 'YouTube search', yt: 'aliasing nyquist explained visually' },
    ],
    shorts: ['nyquist aliasing', 'betaflight vs ardupilot', 'stm32 explained'],
    reels: [
      { front: 'Motor noise frequency at 24,000 rpm?', back: '400 Hz fundamental (rpm/60), harmonics at 800, 1200 Hz.' },
      { front: 'Why notch instead of low-pass?', back: 'A notch removes a narrow band with little delay elsewhere; low-pass delays everything.' },
      { front: 'Alias of 1.2 kHz sampled at 1 kHz?', back: '200 Hz.' },
      { front: 'Firmware for autonomous college project?', back: 'ArduPilot (or PX4 if you\'re going deep on ROS 2).' },
    ],
    quiz: [
      { q: 'Which peripheral lets an STM32 output DShot to four motors with minimal CPU?', o: ['ADC', 'Timers + DMA', 'I²C', 'RTC'], a: 1, e: 'DMA streams pre-computed timer compare values that shape each DShot bit.' },
      { q: 'PX4 modules communicate through…', o: ['uORB', 'CAN only', 'Shared global variables', 'HTTP'], a: 0, e: 'uORB is PX4\'s internal publish/subscribe bus.' },
      { q: 'Main reason to sample the gyro at kHz rates?', o: ['Prettier logs', 'Push Nyquist well above motor noise to avoid aliasing and reduce delay', 'Required by DShot', 'Saves power'], a: 1, e: 'High rates keep motor noise from folding into the control band.' },
      { q: 'RPM filtering requires…', o: ['GPS', 'Bidirectional DShot (eRPM telemetry)', 'A magnetometer', 'Analog PWM'], a: 1, e: 'Notch centres come from per-motor eRPM.' },
      { q: 'Testing a geofence failsafe safely first means…', o: ['Fly near people', 'SITL', 'Skip it', 'Disable logging'], a: 1, e: 'SITL runs the real firmware against simulated physics.' },
      { q: 'Licence that makes PX4 popular with companies?', o: ['GPL', 'BSD', 'Proprietary', 'Creative Commons'], a: 1, e: 'BSD lets companies keep their modifications closed.' },
    ],
  },

  {
    id: 'rf',
    title: 'RF Links, Telemetry & Video',
    tag: 'EM Fields & Communication',
    eee: 'dB arithmetic, antennas and modulation you\'ll use every flight',
    color: '#60a5fa',
    mins: 150,
    summary: 'dB and dBm, free-space path loss and link budgets, antennas and polarisation, RC links (ExpressLRS/CRSF), MAVLink telemetry, analog vs digital video, and India\'s licence-exempt bands.',
    outcomes: [
      'Do link-budget arithmetic in dB and predict range.',
      'Choose frequency, antenna type and polarisation for a mission.',
      'Explain the RC signal chain from stick to flight controller.',
      'Know which bands are licence-exempt in India.',
    ],
    sections: [
      { h: 'Think in decibels', body: `$P_{dBm} = 10\\log_{10}(P_{mW})$: 0 dBm = 1 mW, 10 dBm = 10 mW, 20 dBm = 100 mW, 30 dBm = 1 W. **+3 dB ≈ ×2 power, +10 dB = ×10.** Gains and losses just add.

**Free-space path loss** (d in metres, f in Hz):

$$FSPL = 20\\log_{10} d + 20\\log_{10} f - 147.55\\;\\text{dB}$$

**Link budget:** $P_{rx} = P_{tx} + G_{tx} + G_{rx} - L_{cables} - FSPL$. The link works while $P_{rx}$ stays above receiver sensitivity plus a **fade margin** (10–20 dB for real-world multipath, bodies, foliage).

Every **+6 dB** doubles free-space range (since FSPL grows 20 dB/decade of distance). So 4× power (+6 dB) = 2× range.` },
      { h: 'Antennas and polarisation', body: `- **Dipole / monopole:** omnidirectional around its axis, null off the ends, ~2 dBi. Half-wave length $\\approx 0.95\\,\\lambda/2$.
- **Patch / helical:** directional, 8–14 dBi, used on ground stations for long range.
- **Linear vs circular polarisation:** a rolling drone twists a linear antenna → up to ~20 dB mismatch at 90°. **Circular (CP)** antennas tolerate orientation, and a reflected signal flips handedness (RHCP ↔ LHCP), so CP rejects many reflections — the reason FPV video uses CP.
- Mount antennas away from carbon fibre (conductive, blocks RF) and keep the receiver antennas at 90° to each other for diversity.` },
      { h: 'RC, telemetry and video chains', body: `**RC:** stick gimbals (Hall/potentiometer) → radio's MCU (ADC) → **CRSF** serial to the TX module → RF (ELRS uses **LoRa** at low packet rates and FLRC/GFSK at high rates) → receiver → **CRSF over UART** → flight controller. Link quality and RSSI come back as telemetry.

ExpressLRS **binding phrase** is hashed into a link ID so TX/RX pair — it is **not encryption**.

**Telemetry:** **MAVLink** messages (heartbeat, attitude, GPS, mission items) over a radio (SiK 433/868/915 modems, WiFi, LTE) to a ground station (Mission Planner, QGroundControl). Learning MAVLink is mandatory for autonomy jobs.

**Video:** analog 5.8 GHz (low latency, fuzzy) vs digital HD systems (sharper, more latency/cost). Digital links use the 5.8 GHz band too.

**India bands (check current WPC rules before buying):** licence-exempt sub-GHz for low-power devices is **865–867 MHz** — so pick *India/866 MHz* hardware and the **IN_866** ELRS regulatory domain, **not 915 MHz FCC** gear. 2.4 GHz ISM is widely used; parts of 5.8 GHz are delicensed for low-power use.` },
    ],
    numericals: [
      { q: 'Compute FSPL at 2 km for 2.4 GHz.', steps: ['20 log₁₀(2000) = 66.02 dB; 20 log₁₀(2.4×10⁹) = 187.60 dB.', 'FSPL = 66.02 + 187.60 − 147.55 = **106.07 dB**.'], answer: '≈ 106.1 dB', why: 'Learn this one number; scale with +6 dB per doubling of distance.' },
      { q: 'TX 250 mW (≈ 24 dBm), 2 dBi antennas both ends, 1 dB cable loss, receiver sensitivity −105 dBm, 10 dB fade margin, 2.4 GHz. Max free-space range? Repeat at 866 MHz.', steps: ['Allowed FSPL = 24 + 2 + 2 − 1 − (−105) − 10 = **122 dB**.', '20 log₁₀ d = 122 − 187.60 + 147.55 = 81.95 → d = 10^(81.95/20) ≈ **12.5 km**.', 'At 866 MHz, 20 log₁₀ f = 178.75 → 20 log₁₀ d = 90.80 → d ≈ **34.7 km**.'], answer: '≈ 12.5 km (2.4 GHz); ≈ 34.7 km (866 MHz)', why: 'Free space only — terrain/foliage/bodies cut this a lot, but the ratio (×2.8) holds.' },
      { q: 'Half-wave dipole length at 5.8 GHz (velocity factor 0.95)?', steps: ['λ = c/f = 3×10⁸/5.8×10⁹ = 5.17 cm.', 'L ≈ 0.95 × λ/2 = **2.46 cm**.'], answer: '≈ 2.5 cm', why: 'That\'s why 5.8 GHz antennas are tiny and a few mm of damage detunes them.' },
      { q: 'Going from 100 mW to 1 W TX power multiplies free-space range by?', steps: ['+10 dB → range × 10^(10/20) = **×3.16**.'], answer: '×3.16', why: 'Not ×10 — range grows with the square root of power.' },
    ],
    practice: [
      { book: 'Constantine Balanis — Antenna Theory (Wiley)', where: 'Dipoles, gain and the Friis transmission equation', note: 'Friis problems are exactly link budgets.' },
      { book: 'Simon Haykin — Communication Systems', where: 'Noise, SNR and modulation chapters', note: 'Why sensitivity depends on bandwidth and modulation.' },
      { book: 'ExpressLRS documentation', where: 'Firmware options & regulatory domains, packet-rate vs sensitivity', note: 'Real numbers for your own link budget.' },
    ],
    lab: { title: 'Range-test a link and compare with the budget', kit: ['ELRS (or any) TX/RX with telemetry', 'Phone GPS for distance', 'Notebook'], steps: ['Compute the predicted range with the link-budget sim.', 'Walk the receiver away in an open field; log RSSI and LQ every 100 m.', 'Plot RSSI vs log(distance): slope should be ~ −20 dB/decade in open field.', 'Repeat with the antenna rotated 90° and with a body in between.'], deliverable: 'RSSI vs distance plot with the free-space prediction overlaid.' },
    industry: ['Link budgets', 'Antenna placement on carbon frames', 'MAVLink integration', 'Spectrum regulations (WPC)'],
    sim: 'link',
    resources: [
      { kind: 'docs', t: 'ExpressLRS documentation', by: 'expresslrs.org', url: 'https://www.expresslrs.org/' },
      { kind: 'docs', t: 'MAVLink developer guide', by: 'mavlink.io', url: 'https://mavlink.io/en/' },
      { kind: 'tool', t: 'QGroundControl', by: 'Dronecode', url: 'https://qgroundcontrol.com/' },
      { kind: 'video', t: 'Joshua Bardwell — ExpressLRS setup', by: 'YouTube search', yt: 'Joshua Bardwell ExpressLRS setup guide' },
      { kind: 'video', t: 'Circular polarization explained', by: 'YouTube search', yt: 'circular polarization antenna explained FPV' },
      { kind: 'video', t: 'Link budget tutorial', by: 'YouTube search', yt: 'RF link budget tutorial friis equation' },
    ],
    shorts: ['dBm explained', 'circular polarized antenna', 'radio waves explained'],
    reels: [
      { front: '+3 dB, +6 dB, +10 dB?', back: '×2 power, ×4 power (= ×2 range), ×10 power (= ×3.16 range).' },
      { front: 'FSPL formula', back: '20log d + 20log f − 147.55 (d in m, f in Hz)' },
      { front: 'Why CP antennas for FPV video?', back: 'Orientation-tolerant and reflections flip handedness, so multipath is rejected.' },
      { front: 'India sub-GHz licence-exempt band?', back: '865–867 MHz → use IN_866 domain, not 915 MHz gear.' },
      { front: 'Is the ELRS binding phrase encryption?', back: 'No. It\'s hashed into a link UID for pairing.' },
    ],
    quiz: [
      { q: '23 dBm is about…', o: ['23 mW', '200 mW', '2 W', '100 mW'], a: 1, e: '20 dBm = 100 mW, +3 dB doubles → 200 mW.' },
      { q: 'Same power, 2.4 GHz → 866 MHz, free-space range becomes…', o: ['Same', '~2.8× longer', '~2.8× shorter', '~8× longer'], a: 1, e: 'FSPL ∝ f² → range ∝ 1/f: 2.44/0.866 ≈ 2.8.' },
      { q: 'Best control-link frequency to fly behind buildings and trees?', o: ['5.8 GHz', '2.4 GHz', 'Sub-GHz (866 MHz in India)', '60 GHz'], a: 2, e: 'Lower frequencies diffract and penetrate better.' },
      { q: 'Receiver to flight controller on modern ELRS setups uses…', o: ['SPI', 'CRSF over UART', 'Analog PPM only', 'I²C'], a: 1, e: 'CRSF is a fast serial protocol on a UART, carrying channels and telemetry.' },
      { q: 'Main use of MAVLink?', o: ['Motor control', 'Telemetry/commands between autopilot, ground station and companion computer', 'Video', 'Battery balancing'], a: 1, e: 'It\'s the lingua franca of ArduPilot/PX4 systems.' },
      { q: 'Linear antennas on the drone and ground, drone banks 90°. Expected effect?', o: ['None', 'Large polarisation mismatch loss (up to ~20 dB)', 'Gain increases', 'Frequency shifts'], a: 1, e: 'Cross-polarised linear antennas couple poorly.' },
    ],
  },

  {
    id: 'design',
    title: 'Airframe & Design Workflow (Your Project Engine)',
    tag: 'Design & Systems Engineering',
    eee: 'Requirements → numbers → parts → test: how real drones get designed',
    color: '#a3e635',
    mins: 180,
    summary: 'Frame types and materials, vibration and CG, then the full sizing loop: requirements → mass budget → hover power → motor/prop/ESC/battery selection → verification. Ends with a complete worked design.',
    outcomes: [
      'Write measurable requirements for a drone.',
      'Run the sizing loop and select components from datasheets.',
      'Design for vibration, CG and maintainability.',
      'Produce a bill of materials and a mass/power budget.',
    ],
    sections: [
      { h: 'Frames, materials and vibration', body: `- **Carbon fibre** plates/tubes: stiff and light (conductive — keep antennas clear, insulate edges near wires). **Glass-fibre/PCB, aluminium, 3D-printed PLA/PETG/nylon/CF-nylon** for mounts and prototypes.
- **Stiffness matters more than strength:** a flexible arm's resonance can sit near motor frequencies, putting vibration into the gyro. Aim for arm first-mode frequency well away from motor fundamentals.
- **Vibration path:** prop imbalance → motor → arm → frame → FC. Fixes: balanced props, soft-mounted FC (grommets), stiff arms, tightened screws.
- **CG** at the geometric centre of the motors (or the mixer must compensate, wasting thrust). Battery placement shifts CG — check with a string test.
- **Maintainability:** standard screws, connectors instead of solder where possible, spare arms. Field repairs win competitions.` },
      { h: 'The sizing loop', body: `1. **Requirements**: payload mass, endurance, range, wind tolerance, size limit, budget, regulations (e.g. stay in the micro category < 2 kg).
2. **Mass budget** (first guess): frame, motors, ESCs, FC/GNSS/RX, wiring, payload, battery.
3. **Hover power** (momentum theory with FM, efficiencies) → **current**.
4. **Battery**: pick voltage (higher for bigger drones), then capacity for endurance with 20% reserve; check C-rating vs max current.
5. **Motor + prop**: hover thrust per motor at ~40–60% throttle; max thrust ≥ T/W × AUW / n. Pick from thrust tables; KV to suit voltage and prop.
6. **ESC**: continuous current ≥ 1.2–1.5 × motor max current; voltage rating ≥ pack max.
7. **Iterate**: real component masses replace guesses; recompute until it converges.
8. **Verify**: thrust-stand test, tethered hover, logged flights.

The sizing tool on this page runs steps 2–5 for you; do it once by hand first.` },
      { h: 'Worked design: 15-minute mapping quad with 300 g camera', type: 'derive', body: `**Requirements:** payload 300 g, ≥15 min hover endurance, AUW < 2 kg (micro category), T/W ≥ 2.

**Guess:** frame + arms 300 g, 4 motors 4 × 60 = 240 g, 4-in-1 ESC 25 g, FC + GNSS + RX + wiring 135 g → base 700 g. Battery guess 4S 5000 mAh LiPo ≈ 500 g (74 Wh). AUW = 0.7 + 0.3 + 0.5 = **1.5 kg**.

**Power (10″ props, FM 0.6, η 0.8):** T/rotor = 3.68 N, A = 0.0507 m², $v_i = \\sqrt{3.68/(2\\cdot1.225\\cdot0.0507)} = 5.44$ m/s, $P_{ideal} = 4 \\times 3.68 \\times 5.44 = 80.1$ W → $P_{elec} = 80.1/(0.6\\cdot0.8) = 167$ W, plus ~8 W avionics ≈ **175 W** (≈ 11.8 A at 14.8 V).

**Endurance:** 0.8 × 74 Wh / 175 W = 0.338 h ≈ **20 min** → meets 15 min with margin for wind.

**Motor spec:** hover 375 g per motor; max ≥ 2 × 1500/4 = **750 g** per motor on 4S with 10″ props → a ~2212–2814 class motor around 800–1000 KV. Check the thrust table: hover near 45% throttle, ~3 A per motor.

**ESC:** if max current per motor ≈ 15 A → 25–30 A ESCs. **Battery C-check:** max total ~60 A on a 5 Ah pack = 12C — any decent pack copes.

Then buy, weigh, and repeat the calculation with real masses.` },
    ],
    numericals: [
      { q: 'A 2.2 kg hexacopter needs T/W = 2. What max thrust per motor?', steps: ['Total = 2 × 2.2 = 4.4 kgf; per motor = 4.4/6 = **733 gf** (7.2 N).'], answer: '≈ 733 gf per motor', why: 'Hexes split thrust across six motors — but also need margin to survive a motor-out.' },
      { q: 'In the worked design, the battery is upgraded from 500 g (74 Wh) to 800 g (≈118 Wh). Using P ∝ m^1.5 for the hover power of 175 W at 1.5 kg (ignore avionics), estimate new endurance.', steps: ['New AUW = 1.8 kg → P ≈ 167 × (1.8/1.5)^1.5 + 8 = 167 × 1.315 + 8 ≈ 228 W.', 'Endurance = 0.8 × 118/228 h = 0.414 h ≈ **24.8 min** (vs 20 min).'], answer: '≈ 25 min (+25% endurance for +60% battery)', why: 'Diminishing returns — the sizing sim shows the peak.' },
      { q: 'An ESC is rated 30 A continuous. The motor draws 24 A at full throttle on the thrust stand. Is the margin acceptable?', steps: ['Ratio = 30/24 = 1.25 → within the 1.2–1.5× guideline, at the low end.', 'In hot weather or with poor airflow choose 35–40 A.'], answer: 'Acceptable but tight', why: 'ESC failures are the most common electrical failure in hobby builds; margin is cheap insurance.' },
    ],
    practice: [
      { book: 'Quan Quan — Introduction to Multicopter Design and Control', where: 'Airframe design and propulsion-system design/performance chapters', note: 'Complete design examples with real component data.' },
      { book: 'Daniel Raymer — Aircraft Design: A Conceptual Approach (AIAA)', where: 'Sizing and weight-estimation chapters', note: 'The aerospace classic for the sizing mindset (fixed-wing).' },
      { book: 'eCalc xcopterCalc', where: 'Re-run the worked design', note: 'Compare with your hand numbers and explain the differences.' },
    ],
    lab: { title: 'Mass & power budget spreadsheet', kit: ['Spreadsheet', 'Datasheets of shortlisted parts', 'Kitchen scale'], steps: ['List every component with datasheet mass and measured mass.', 'Compute AUW, hover power, endurance, T/W with formulas (not typed numbers).', 'Add a margin column (+10% mass for wires/screws).', 'Make it the single source of truth for the project.'], deliverable: 'A shared mass/power budget sheet — every design review starts here.' },
    industry: ['Requirements writing', 'Trade studies', 'Mass/power budgets', 'BOM management', 'CAD (Fusion 360/FreeCAD/SolidWorks)'],
    sim: 'sizing',
    resources: [
      { kind: 'tool', t: 'eCalc xcopterCalc', by: 'eCalc', url: 'https://www.ecalc.ch/xcoptercalc.php' },
      { kind: 'book', t: 'Introduction to Multicopter Design and Control', by: 'Quan Quan (Springer)', url: 'https://link.springer.com/book/10.1007/978-981-10-3382-7' },
      { kind: 'tool', t: 'FreeCAD (free CAD)', by: 'freecad.org', url: 'https://www.freecad.org/' },
      { kind: 'video', t: 'Drone frame design in Fusion 360', by: 'YouTube search', yt: 'design drone frame Fusion 360 tutorial' },
      { kind: 'video', t: 'How to choose motors and props for a drone', by: 'YouTube search', yt: 'how to choose motor and propeller for drone thrust to weight' },
    ],
    shorts: ['carbon fiber drone frame', 'thrust to weight ratio', 'drone vibration fix'],
    reels: [
      { front: 'Sizing loop in 5 words', back: 'Requirements → mass → power → parts → verify (repeat).' },
      { front: 'ESC rating margin?', back: '1.2–1.5× the motor\'s max current; more in heat.' },
      { front: 'Why stiffness over strength?', back: 'Flexible arms resonate near motor frequencies and inject vibration into the gyro.' },
      { front: 'Adding battery always adds flight time?', back: 'No — past an optimum, extra mass costs more power than the energy it adds.' },
    ],
    quiz: [
      { q: 'First step of a drone design?', o: ['Buy motors', 'Write measurable requirements', 'Pick a colour', 'Tune PID'], a: 1, e: 'Without requirements you can\'t judge any trade-off.' },
      { q: 'Hover throttle you aim for on a camera/utility drone?', o: ['5–10%', '~40–60%', '95%', 'Doesn\'t matter'], a: 1, e: 'Leaves headroom for control and wind while staying efficient.' },
      { q: 'FC soft-mounting mainly reduces…', o: ['Weight', 'Vibration reaching the IMU', 'RF noise', 'Battery sag'], a: 1, e: 'Grommets isolate high-frequency vibration.' },
      { q: 'Why keep a 1.9 kg design under 2 kg in India?', o: ['Batteries are cheaper', 'Stays in the micro category (simpler rules for non-commercial use)', 'Better GPS', 'No reason'], a: 1, e: 'Drone Rules 2021 categories: micro is >250 g to 2 kg.' },
      { q: 'Carbon fibre near antennas…', o: ['Improves range', 'Blocks/detunes RF — mount antennas clear of it', 'No effect', 'Is required'], a: 1, e: 'CF is conductive.' },
      { q: 'Your sizing gives 22 min, the real flight 16 min. Most likely?', o: ['Physics is wrong', 'Optimistic FM/efficiency, wind, mass growth — update the model with measured values', 'Battery is fake', 'GPS error'], a: 1, e: 'Close the loop: replace assumptions with measurements.' },
    ],
  },

  {
    id: 'autonomy',
    title: 'Autonomy, Testing, Safety & Indian Regulations',
    tag: 'Robotics + Professional Practice',
    eee: 'Where jobs are: autonomy software, flight test, compliance',
    color: '#f472b6',
    mins: 180,
    summary: 'Flight modes and navigation, missions and failsafes, MAVLink/MAVSDK, ROS 2 with companion computers, computer vision; test planning and log review; Drone Rules 2021 and the DigitalSky platform; building a portfolio.',
    outcomes: [
      'Explain how a position-hold and waypoint mission work end-to-end.',
      'Command a drone from Python via MAVLink/MAVSDK in SITL.',
      'Write a test plan with go/no-go criteria and failsafes.',
      'Know the Indian rules that apply to your college project.',
    ],
    sections: [
      { h: 'From stabilise to fully autonomous', body: `| Mode (ArduPilot names) | Pilot controls | Autopilot holds |
|---|---|---|
| Stabilize | Angle + throttle | Attitude |
| AltHold | Angle | Altitude (baro/rangefinder) |
| Loiter / PosHold | Velocity | Position (GNSS + EKF) |
| Auto | Nothing | Follows mission waypoints |
| Guided | Nothing — a computer sends targets | Position/velocity setpoints from MAVLink |
| RTL / Land | Nothing | Return home, descend |

**Navigation stack:** EKF gives position/velocity → **position controller** (P on position → velocity setpoint → PID on velocity → acceleration → tilt angle setpoint) → attitude loops. Waypoint navigation adds path following (L1 / S-curves) and speed limits.` },
      { h: 'Companion computers, MAVLink and ROS 2', body: `A **companion computer** (Raspberry Pi, Jetson, Radxa) runs perception and high-level decisions, and talks to the autopilot over MAVLink (serial/UDP). Typical stack:

- **MAVSDK** (C++/Python): simple API — arm, takeoff, goto, missions, telemetry.
- **pymavlink**: lower-level message access.
- **ROS 2**: perception and planning nodes. PX4 bridges to ROS 2 via **uXRCE-DDS**; ArduPilot supports DDS too, and **MAVROS** is common.
- **Computer vision**: OpenCV, ArUco markers for precision landing, YOLO-class detectors for object detection, visual odometry/SLAM for GPS-denied flight.

\`\`\`python
# MAVSDK-Python: take off to 10 m in SITL and land
import asyncio
from mavsdk import System

async def main():
    drone = System()
    await drone.connect(system_address="udp://:14540")
    async for s in drone.core.connection_state():
        if s.is_connected: break
    await drone.action.arm()
    await drone.action.set_takeoff_altitude(10)
    await drone.action.takeoff()
    await asyncio.sleep(15)
    await drone.action.land()

asyncio.run(main())
\`\`\`` },
      { h: 'Test like a professional', body: `- **Test plan** per flight: objective, configuration (firmware version, parameters file, pack), procedure, pass/fail criteria, abort criteria, who is pilot / safety officer / logger.
- **Progression:** bench (props off) → tethered hover → hover in stabilise → AltHold → Loiter → short Auto mission → full mission. Never skip a step after changing hardware or firmware.
- **Pre-flight checklist:** props tight & correct direction, pack voltage, GPS lock & HDOP, compass healthy, failsafes set (RC loss, low battery, geofence), area clear.
- **Post-flight:** download logs; check vibration levels, EKF innovations, battery voltage/current, motor outputs (saturation?).
- **Kill switch** on the transmitter, always. Prop guards for indoor work.` },
      { h: 'Indian rules that apply to you (verify before flying)', body: `Under the **Drone Rules, 2021** (amended 2022), categories by all-up weight: **nano ≤ 250 g, micro 250 g–2 kg, small 2–25 kg, medium 25–150 kg, large > 150 kg**.

- Check the **DigitalSky airspace map**: **green** zones (up to 400 ft / 120 m) need no permission; **yellow** zones need ATC permission; **red** zones (near airports, borders, military and other sensitive sites) need central-government permission.
- Drones need a **Unique Identification Number (UIN)** via DigitalSky; nano and R&D prototypes have exemptions.
- A **Remote Pilot Certificate** (from a DGCA-authorised training organisation) is required except for nano drones and micro drones flown non-commercially.
- Research & development organisations (which can include recognised educational institutions) have exemptions when flying their own prototypes in green zones within their premises — ask your college how they hold this.

**Heads-up:** a draft **Civil Drone (Promotion and Regulation) Bill, 2025** was published to replace the 2021 Rules with a statute (tighter registration, insurance, penalties). Check its status on the Ministry of Civil Aviation site before your project flies.` },
      { h: 'Portfolio that gets interviews', body: `- A GitHub repo with your **Python 6-DOF simulator + PID**.
- **Thrust-stand data** and a short report.
- A **SITL mission script** (MAVSDK) with a demo video.
- Your **project design report**: requirements, sizing, BOM, test logs, lessons learned.
- Contributions: docs fixes or small PRs to ArduPilot/PX4; competitions (e.g. SAE/ISRO/IIT drone challenges, Inter-IIT style events).` },
    ],
    numericals: [
      { q: 'A survey mission is 3.2 km of flight at 8 m/s cruise plus 60 s for take-off and landing. The drone draws 210 W in cruise from a 4S 5000 mAh (74 Wh) pack. Keeping a 25% reserve, is the mission feasible?', steps: ['Time = 3200/8 + 60 = 460 s = 7.67 min.', 'Energy = 210 W × 460 s = 96,600 J = **26.8 Wh**.', 'Available with 25% reserve = 0.75 × 74 = **55.5 Wh** → feasible with ~2× margin.'], answer: 'Yes: needs ~27 Wh of 55.5 Wh available', why: 'Mission planners run exactly this energy check before arming.' },
      { q: 'GPS horizontal accuracy is ±2.5 m (1σ). You want a geofence that the drone will not cross because of position error alone with ~99.7% confidence. How much buffer inside the legal boundary?', steps: ['3σ ≈ 3 × 2.5 = **7.5 m** buffer (plus stopping distance).'], answer: '≥ 7.5 m, plus braking distance', why: 'Real geofences add stopping distance: at 8 m/s with 3 m/s² braking that\'s another ~11 m.' },
    ],
    practice: [
      { book: 'Peter Corke — Robotics, Vision and Control (Springer)', where: 'Aerial robot and vision chapters (Python/MATLAB examples)', note: 'Bridges control and computer vision.' },
      { book: 'Thrun, Burgard & Fox — Probabilistic Robotics', where: 'Localisation and SLAM chapters', note: 'For GPS-denied autonomy.' },
      { book: 'PX4 & ArduPilot docs', where: 'ROS 2 / MAVSDK / DDS guides', note: 'Follow the official examples end-to-end.' },
    ],
    lab: { title: 'Script a mission in SITL', kit: ['ArduPilot or PX4 SITL', 'Python + MAVSDK (pip install mavsdk)', 'QGroundControl'], steps: ['Start SITL; connect QGroundControl to watch.', 'Run the take-off/land script above.', 'Extend: upload a 4-waypoint square mission and start it.', 'Add a geofence and a low-battery failsafe; trigger them.', 'Stretch: OpenCV ArUco detection on a simulated camera for precision landing.'], deliverable: 'Python repo + screen recording of the autonomous mission.' },
    industry: ['MAVSDK/pymavlink', 'ROS 2 + DDS', 'Computer vision (OpenCV)', 'Test planning & log review', 'DGCA/DigitalSky compliance'],
    sim: null,
    resources: [
      { kind: 'docs', t: 'MAVSDK', by: 'mavsdk.mavlink.io', url: 'https://mavsdk.mavlink.io/main/en/' },
      { kind: 'docs', t: 'PX4 + ROS 2 guide', by: 'PX4 docs', url: 'https://docs.px4.io/main/en/ros2/' },
      { kind: 'docs', t: 'DigitalSky platform', by: 'DGCA, Government of India', url: 'https://digitalsky.dgca.gov.in/' },
      { kind: 'docs', t: 'Draft Civil Drone (Promotion and Regulation) Bill, 2025 (PDF)', by: 'Ministry of Civil Aviation', url: 'https://www.civilaviation.gov.in/sites/default/files/2025-09/Draft%20Civil%20Drone%20%28Promotion%20and%20Regulation%29%20Bill%202025.pdf' },
      { kind: 'video', t: 'Intelligent Quads — drone programming with ROS', by: 'YouTube search', yt: 'Intelligent Quads drone programming ROS ArduPilot' },
      { kind: 'video', t: 'ArduPilot precision landing with ArUco', by: 'YouTube search', yt: 'ArduPilot precision landing aruco marker' },
    ],
    shorts: ['autonomous drone mission', 'drone rules india', 'ROS 2 drone'],
    reels: [
      { front: 'Mode that holds position with GPS (ArduPilot)?', back: 'Loiter (or PosHold).' },
      { front: 'Companion computer talks to autopilot via?', back: 'MAVLink (MAVSDK / pymavlink / MAVROS); PX4 ↔ ROS 2 via uXRCE-DDS.' },
      { front: 'Indian weight categories', back: 'Nano ≤250 g · Micro ≤2 kg · Small ≤25 kg · Medium ≤150 kg · Large >150 kg' },
      { front: 'Green / yellow / red zone?', back: 'Green: fly ≤400 ft without permission · Yellow: ATC permission · Red: central govt permission.' },
      { front: 'Flight-test progression', back: 'Bench → tethered → stabilise → AltHold → Loiter → short Auto → full mission.' },
    ],
    quiz: [
      { q: 'Which ArduPilot mode lets a companion computer send position targets?', o: ['Stabilize', 'Guided', 'Acro', 'AltHold'], a: 1, e: 'Guided mode accepts setpoints over MAVLink.' },
      { q: 'A 1.2 kg drone falls in which Indian category?', o: ['Nano', 'Micro', 'Small', 'Medium'], a: 1, e: 'Micro: more than 250 g up to 2 kg.' },
      { q: 'Before your first autonomous mission on new hardware you should…', o: ['Go straight to Auto', 'Progress through tethered/stabilise/AltHold/Loiter tests', 'Disable failsafes', 'Fly over a crowd for visibility'], a: 1, e: 'Each step validates a layer before relying on it.' },
      { q: 'Flying in a yellow zone requires…', o: ['Nothing', 'Air-traffic-control permission', 'Only a RPC', 'Only a UIN'], a: 1, e: 'Yellow = controlled airspace.' },
      { q: 'PX4 connects to ROS 2 using…', o: ['MAVROS only', 'uXRCE-DDS bridge', 'HTTP REST', 'Bluetooth'], a: 1, e: 'The XRCE-DDS agent exposes uORB topics as ROS 2 topics.' },
      { q: 'Most important post-flight habit?', o: ['Wash props', 'Download and review logs (vibration, EKF, battery, motor saturation)', 'Post on Instagram', 'Recalibrate compass every time'], a: 1, e: 'Logs reveal problems before they become crashes.' },
    ],
  },
];
