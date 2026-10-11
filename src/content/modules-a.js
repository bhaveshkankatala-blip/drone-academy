// Modules 1–4. Text uses the tiny markup in components/ui.jsx (Rich): $math$, $$display$$, **bold**, - bullets, | tables |, [[fig:name]].
// Numericals are original problems written for this course; "practice" points to where to find more of the same kind.

export const modulesA = [
  {
    id: 'systems',
    title: 'The Drone as a System',
    tag: 'Orientation',
    eee: 'Ties every EEE course you will take to one machine',
    color: '#22d3ee',
    mins: 45,
    summary: 'What every block on a multirotor does, how energy and information flow, which configuration to pick, and what roles exist in the drone industry.',
    outcomes: [
      'Draw the full block diagram of a multirotor from memory and name the interface between each block (voltage level, protocol).',
      'Explain why a multirotor is open-loop unstable and needs a controller running hundreds to thousands of times per second.',
      'Choose between quad, hex, octo, coaxial, fixed-wing and VTOL for a given mission.',
      'Map each subsystem to the EEE subject that explains it.',
    ],
    sections: [
      { h: 'One picture to hold the whole course', body: `[[fig:system]]

Energy flows from the **battery** through the **power distribution board** to four **ESCs** (each a three-phase inverter) into **brushless motors** that spin propellers. Information flows in a loop: **sensors** → **flight controller** (estimator → controller → mixer) → ESCs → motors → the airframe moves → sensors see it.

If you remember one thing: a drone is a **power-electronics system wrapped around a feedback loop**. Everything else is detail.` },
      { h: 'Why it can\'t fly without a computer', body: `A quadcopter with fixed-pitch props has no passive stability. Tilt it 1° and the thrust vector tilts too, producing sideways acceleration; nothing pushes it back. Small errors in motor speeds produce torques that integrate twice (torque → angular acceleration → rate → angle). That's a **double integrator** — open-loop unstable in the sense that any disturbance grows.

So the flight controller measures rotation rate with a gyroscope and corrects motor speeds typically **1,000–8,000 times per second** (FPV firmware) or **400 Hz+** (autopilots like ArduPilot/PX4). The human pilot (or autopilot) only commands *what attitude/rate they want*.` },
      { h: 'Your EEE syllabus, mapped to the drone', body: `| Drone subsystem | What you need | Where you learn it |
|---|---|---|
| Motors | BLDC/PMSM, back-EMF, torque constant | Electrical Machines |
| ESC | MOSFET switching, gate drive, PWM, losses | Power Electronics, Analog Circuits |
| Battery & PDB | Internal resistance, DC-DC converters | Circuit Theory, Power Electronics |
| Flight controller | Microcontrollers, SPI/I²C/UART, timers, DMA | Digital Electronics, Microprocessors |
| Estimation & filters | Sampling, aliasing, LPF/notch, Kalman | Signals & Systems, Probability |
| Control | Transfer functions, Bode, PID, stability margins | Control Systems |
| Radio | Antennas, dB, path loss, modulation | EM Fields, Communication Systems |` },
      { h: 'Configurations and when to use them', body: `| Type | Strength | Weakness | Typical job |
|---|---|---|---|
| Quad (X/H/+) | Simplest, cheapest, agile | No motor redundancy | FPV, inspection, education |
| Hex / Octo | Can survive a motor failure (with the right firmware), more payload | Heavier, more ESCs to fail | Cinema cameras, agriculture sprayers |
| Coaxial X8 | Compact for its thrust | Lower efficiency of the lower prop | Heavy lift in small footprint |
| Fixed-wing | 3–5× endurance of a multirotor | Needs runway/launcher, can't hover | Mapping, survey |
| VTOL (quadplane, tilt-rotor) | Hovers to take off, flies on wings | Complex, heavier | Long-range delivery, survey |

Agricultural spraying in India is a big employer of multirotor engineers; mapping/survey and defence are large too.` },
      { h: 'Industry roles you can aim for', body: `- **Avionics / hardware engineer**: flight-controller and ESC PCB design (KiCad/Altium), EMI, power integrity. *EEE sweet spot.*
- **Embedded firmware engineer**: drivers, RTOS, ArduPilot/PX4 contributions, ESC firmware.
- **Controls / GNC engineer**: modelling, estimation, controller design, simulation (MATLAB/Simulink, Python, SITL).
- **Propulsion engineer**: motor/prop matching, thrust-stand testing, thermal design.
- **Autonomy / perception**: ROS 2, computer vision, SLAM, path planning.
- **Flight test & certification**: test plans, log analysis, DGCA type-certification paperwork.` },
    ],
    numericals: [
      { q: 'A 1.6 kg quadcopter must have a thrust-to-weight ratio (T/W) of at least 2 for safe control authority. What maximum static thrust must each motor-prop produce, in grams-force and newtons?', steps: ['Total required max thrust = T/W × weight = 2 × 1.6 kg = 3.2 kgf.', 'Per motor = 3.2 / 4 = 0.8 kgf = **800 gf**.', 'In newtons: 0.8 × 9.81 = **7.85 N** per motor.'], answer: '800 gf ≈ 7.85 N per motor', why: 'T/W ≈ 2 is the usual minimum for camera/utility drones; freestyle FPV quads are often 8–12.' },
      { q: 'An inner loop runs at 4 kHz and the motor + prop has a mechanical time constant of about 30 ms. How many control updates happen during one motor time constant?', steps: ['Loop period = 1/4000 = 0.25 ms.', 'Updates = 30 ms / 0.25 ms = **120**.'], answer: '120 updates', why: 'The controller is far faster than the plant, so it can be designed as if continuous-time — the classic "sample 10–20× faster than the dynamics" rule is easily met.' },
    ],
    practice: [
      { book: 'Quan Quan — Introduction to Multicopter Design and Control (Springer)', where: 'Opening chapters on multicopter configuration and components', note: 'The best single textbook for this whole course.' },
      { book: 'Beard & McLain — Small Unmanned Aircraft: Theory and Practice', where: 'Introduction and system architecture chapters', note: 'Fixed-wing focused, but the autopilot architecture is the same.' },
    ],
    lab: { title: 'Teardown & block diagram', kit: ['Any toy or broken drone (or photos of a 5″ FPV build online)', 'Multimeter'], steps: ['Identify battery, PDB/AIO board, ESCs, motors, flight controller, receiver.', 'Measure battery voltage and the 5 V BEC rail with a multimeter.', 'Follow each wire and label it with its protocol (power, DShot, UART, I²C).', 'Redraw the block diagram from the course figure with real part numbers.'], deliverable: 'One-page block diagram with voltages and protocols on every arrow.' },
    industry: ['Reading datasheets fast', 'System block diagrams in design reviews', 'Knowing which subsystem owns a fault'],
    sim: null,
    resources: [
      { kind: 'book', t: 'Introduction to Multicopter Design and Control', by: 'Quan Quan (Springer)', url: 'https://link.springer.com/book/10.1007/978-981-10-3382-7' },
      { kind: 'video', t: 'Drone Simulation and Control (5-part series)', by: 'MATLAB Tech Talks — Brian Douglas', url: 'https://www.mathworks.com/videos/series/drone-simulation-and-control.html' },
      { kind: 'docs', t: 'ArduPilot Copter documentation', by: 'ArduPilot', url: 'https://ardupilot.org/copter/' },
      { kind: 'docs', t: 'PX4 User Guide', by: 'Dronecode', url: 'https://docs.px4.io/main/en/' },
      { kind: 'video', t: 'Joshua Bardwell — FPV build & component explainers', by: 'YouTube search', yt: 'Joshua Bardwell how to build an FPV drone' },
      { kind: 'video', t: 'Painless360 — ArduPilot for beginners', by: 'YouTube search', yt: 'Painless360 ArduPilot beginners' },
    ],
    shorts: ['how does a quadcopter fly', 'drone parts explained', 'hexacopter motor failure'],
    reels: [
      { front: 'Why does a quad need 2 CW and 2 CCW props?', back: 'Each prop\'s drag torque twists the body the opposite way. Equal CW and CCW pairs cancel the reaction torque; changing the balance on purpose is how it yaws.' },
      { front: 'A drone is a ______ system wrapped around a ______.', back: 'A power-electronics system wrapped around a feedback loop.' },
      { front: 'Rule of thumb: control loop rate vs plant speed?', back: 'Sample ≥10–20× faster than the fastest dynamics you control. 4 kHz vs a 30 ms motor lag gives 120 updates per time constant.' },
      { front: 'When does a hexacopter beat a quad?', back: 'Payload and redundancy: with suitable firmware a hex can stay controllable after losing a motor; a quad can\'t.' },
    ],
    quiz: [
      { q: 'Which subsystem converts battery DC into the three-phase currents a BLDC motor needs?', o: ['Flight controller', 'ESC (three-phase inverter)', 'BEC', 'Receiver'], a: 1, e: 'An ESC is six MOSFETs in three half-bridges plus a small MCU: a three-phase inverter.' },
      { q: 'Why is a quadcopter called open-loop unstable?', o: ['Its battery voltage drops', 'Small torque errors integrate into growing attitude errors with no restoring force', 'Props are fixed pitch', 'GPS is noisy'], a: 1, e: 'Torque → angular acceleration → rate → angle is a double integrator with no natural restoring moment. Only feedback keeps it level.' },
      { q: 'Typical inner (rate) loop frequency on a modern FPV flight controller?', o: ['10 Hz', '50 Hz', '1–8 kHz', '1 MHz'], a: 2, e: 'Betaflight-class firmware runs the gyro/PID loop in the kHz range; autopilots typically run attitude loops at 400 Hz+.' },
      { q: 'Best configuration for 60-minute mapping of a 5 km² farm?', o: ['5″ FPV quad', 'Fixed-wing or VTOL', 'Coaxial X8', 'Micro whoop'], a: 1, e: 'Wings give several times the endurance of rotors. VTOL keeps the vertical take-off convenience.' },
      { q: 'A drone has T/W = 1.2. What is the main problem?', o: ['It can\'t hover', 'Very little spare thrust for control and wind gusts', 'Too agile', 'Battery will overheat at hover'], a: 1, e: 'Hover needs T/W = 1. With 1.2 there is only 20% headroom for tilting, climbing and rejecting disturbances; T/W ≥ 2 is the usual minimum.' },
      { q: 'Which EEE course most directly explains choosing a D-term low-pass filter cutoff?', o: ['Electrical Machines', 'Signals & Systems / Control', 'Power Systems', 'Measurements'], a: 1, e: 'Filter cutoff trades noise rejection against phase lag: frequency-domain reasoning from Signals & Systems applied in a control loop.' },
    ],
  },

  {
    id: 'physics',
    title: 'Flight Physics: Thrust & Hover Power',
    tag: 'Physics & Aerodynamics',
    eee: 'Energy conservation + fluid momentum — the physics behind your power budget',
    color: '#38bdf8',
    mins: 120,
    summary: 'How a propeller makes thrust, why thrust ∝ RPM², what momentum theory says about the minimum power to hover, and why big slow props are more efficient.',
    outcomes: [
      'Use $T = C_T\\rho n^2 D^4$ and $P = C_P\\rho n^3 D^5$ and read propeller data tables.',
      'Derive induced velocity and ideal hover power from momentum theory.',
      'Compute electrical hover power and current from mass, prop size, figure of merit and drive efficiency.',
      'Explain disk loading, ground effect, vortex ring state and the effect of altitude/temperature.',
    ],
    sections: [
      { h: 'Thrust is momentum you throw downward', body: `A propeller is a rotating wing. Each blade section sees air at the blade speed $\\omega r$ plus inflow, produces lift, and the sum along the blade pushes air downward. By Newton's 3rd law the air pushes the prop up.

Dimensional analysis gives the standard propeller laws (n in rev/s, D in m):

$$T = C_T\\,\\rho\\, n^2 D^4 \\qquad Q = C_Q\\,\\rho\\, n^2 D^5 \\qquad P = 2\\pi Q n = C_P\\,\\rho\\, n^3 D^5$$

For a given prop $C_T$ and $C_P$ are nearly constant in hover, so **thrust ∝ RPM²** and **power ∝ RPM³**. That cube is why a little more thrust costs a lot more power.` },
      { h: 'Derivation: momentum (actuator-disk) theory', type: 'derive', body: `Model the rotor as a thin disk of area $A$ that adds momentum to the air.

1. Far above, air is still. At the disk it moves down at induced velocity $v_i$; far below (the wake) at $w$.
2. Mass flow through the disk: $\\dot m = \\rho A v_i$.
3. Thrust = rate of momentum change: $T = \\dot m\\, w$.
4. Power = rate of kinetic energy added: $P = \\tfrac12 \\dot m w^2$. Also $P = T v_i$ (force × velocity at the disk).
5. Equating: $T v_i = \\tfrac12 \\dot m w^2 = \\tfrac12 T w$ → $w = 2v_i$ (the wake speeds up to twice the disk velocity).
6. Substitute: $T = \\rho A v_i (2 v_i)$ →

$$v_i = \\sqrt{\\frac{T}{2\\rho A}}, \\qquad P_{ideal} = T v_i = \\frac{T^{3/2}}{\\sqrt{2\\rho A}}$$

**Read it like an engineer:** for fixed thrust, $P \\propto 1/\\sqrt{A}$ → bigger disks need less power. For fixed disk, $P \\propto T^{1.5}$ → doubling mass costs $2^{1.5} = 2.83\\times$ the power.` },
      { h: 'From ideal power to battery current', body: `Real props lose energy to profile drag, tip vortices and swirl. The **figure of merit** captures this:

$$FM = \\frac{P_{ideal}}{P_{shaft}} \\quad (\\text{small UAV props: } \\approx 0.5\\text{–}0.7)$$

Then motor and ESC losses: $P_{elec} = P_{shaft} / (\\eta_{motor}\\eta_{ESC})$, with $\\eta_{motor}\\eta_{ESC}$ around 0.7–0.85. Divide by pack voltage for current.

**Disk loading** $DL = T/A$ (N/m²) is the single best predictor of hover efficiency. Helicopters ~ 100–500 N/m², small quads ~ 50–150 N/m², FPV racers much higher (they trade efficiency for agility).` },
      { h: 'Real-world effects you must know', body: `- **Air density:** $P \\propto 1/\\sqrt{\\rho}$. Hot afternoons and high altitude reduce $\\rho$ and thrust margin. ISA: $\\rho_0 = 1.225$ kg/m³ at 15 °C sea level.
- **Ground effect:** within about one rotor diameter of the ground, the wake can't expand; you get more thrust per watt. Landing feels "floaty".
- **Vortex ring state:** descending vertically into your own wake at roughly the induced velocity: thrust becomes erratic and the drone can drop. Descend at an angle (forward speed) to avoid it.
- **Forward flight:** a tilted rotor moving forward gets more fresh air per second, so induced power **drops** at moderate speed — that's why best-endurance speed for a multirotor is not zero.
- **Prop wash interaction:** close-spaced props and arms under the prop (blockage) cost several % of thrust.` },
      { h: 'Reading a propeller/motor thrust table', body: `Manufacturers publish tables: throttle %, voltage, current, thrust (g), power (W), efficiency (g/W). Workflow:

1. Find the row where **thrust ≈ AUW / number of motors** → hover current and g/W.
2. Check 100% throttle thrust ≥ T/W × AUW / motors.
3. Hover throttle ≈ 40–60% for camera/utility drones, 20–30% for freestyle FPV.

Independent wind-tunnel data: the **UIUC Propeller Data Site** gives measured $C_T$, $C_P$ for hundreds of small props.` },
    ],
    numericals: [
      { q: 'A 1.2 kg quadcopter uses 10-inch props (D = 0.254 m) at sea level (ρ = 1.225 kg/m³). Find (a) induced velocity, (b) total ideal hover power, (c) electrical hover power if FM = 0.6 and motor×ESC efficiency = 0.8, (d) hover current from a 4S pack (14.8 V).', steps: ['Thrust per rotor: T = mg/4 = 1.2×9.81/4 = 2.943 N.', 'Disk area: A = π(0.127)² = 0.05067 m².', 'v_i = √(T/2ρA) = √(2.943 / (2×1.225×0.05067)) = **4.87 m/s**.', 'P_ideal per rotor = T·v_i = 2.943×4.869 = 14.33 W → total **57.3 W**.', 'P_shaft = 57.3/0.6 = 95.5 W;  P_elec = 95.5/0.8 = **119.4 W**.', 'I = 119.4/14.8 = **8.07 A**.'], answer: 'vᵢ ≈ 4.87 m/s, P_ideal ≈ 57.3 W, P_elec ≈ 119 W, I ≈ 8.1 A', why: 'This is exactly how you sanity-check eCalc or a datasheet before buying parts.' },
      { q: 'A 10-inch prop has C_T = 0.11 in static conditions. Find its thrust at 8000 rpm at sea level.', steps: ['n = 8000/60 = 133.3 rev/s; D⁴ = 0.254⁴ = 4.162×10⁻³ m⁴.', 'T = C_T ρ n² D⁴ = 0.11 × 1.225 × 133.3² × 4.162×10⁻³ = **9.97 N** (≈ 1.02 kgf).'], answer: '≈ 9.97 N', why: 'Units check: kg/m³ · s⁻² · m⁴ = kg·m/s² = N.' },
      { q: 'A drone hovers with its motors at 6000 rpm. A 2 kg payload is added that doubles the required thrust. What rpm is needed now, and by what factor does aerodynamic power rise (same prop)?', steps: ['T ∝ n² → n₂ = n₁√2 = 6000×1.414 = **8485 rpm**.', 'P ∝ n³ → factor = (√2)³ = **2.83×** (same answer as momentum theory\'s T^1.5).'], answer: '8485 rpm; 2.83× power', why: 'Two different derivations agree — a good sign your physics is consistent.' },
      { q: 'Same 1.2 kg drone flown at 3000 m altitude on a 30 °C day (ρ ≈ 0.81 kg/m³). By what factor does ideal hover power change versus sea-level ISA?', steps: ['P ∝ 1/√ρ at fixed thrust and area.', 'Factor = √(1.225/0.81) = √1.512 = **1.23** → about 23% more power.'], answer: '≈ 1.23× (23% more power, and less thrust margin)', why: 'Hill-station and Ladakh operations need bigger margins.' },
    ],
    practice: [
      { book: 'J. Gordon Leishman — Principles of Helicopter Aerodynamics (Cambridge)', where: 'Chapter on momentum theory for hover and vertical flight', note: 'The authority on rotor theory; problems at the end of the chapter are exactly this style.' },
      { book: 'Quan Quan — Introduction to Multicopter Design and Control', where: 'Propulsion system modelling & performance estimation chapter', note: 'Worked examples for hover time with real motor/prop data.' },
      { book: 'UIUC Propeller Data Site', where: 'Pick any APC 10×4.7 data file', note: 'Compute thrust from C_T yourself and compare.' },
    ],
    lab: { title: 'Build a thrust stand', kit: ['Kitchen scale (1 g resolution) or HX711 + load cell', 'One motor, ESC, prop', 'Bench supply or LiPo with a watt meter', 'Arduino (to generate servo PWM) or a servo tester', 'Optical/laser tachometer (optional)'], steps: ['Clamp the motor upside-down on a lever above the scale (prop blowing up, so thrust presses down). Use a guard.', 'Sweep throttle 10%→100% in 10% steps; log voltage, current, thrust, rpm.', 'Plot thrust vs rpm² — should be a straight line. Fit C_T.', 'Plot g/W vs thrust and mark your hover point.', 'Compare with momentum theory: compute FM = T·vᵢ/P_shaft (estimate P_shaft = 0.85×P_elec).'], deliverable: 'Plots of T vs rpm², g/W vs thrust, measured C_T and FM. This is a portfolio piece.' },
    industry: ['Thrust-stand testing (RCbenchmark/Tyto stands)', 'Reading motor thrust tables', 'Propulsion trade studies'],
    sim: 'hover',
    resources: [
      { kind: 'tool', t: 'UIUC Propeller Data Site', by: 'University of Illinois', url: 'https://m-selig.ae.illinois.edu/props/propDB.html' },
      { kind: 'tool', t: 'eCalc xcopterCalc', by: 'eCalc', url: 'https://www.ecalc.ch/xcoptercalc.php' },
      { kind: 'book', t: 'Principles of Helicopter Aerodynamics', by: 'J. Gordon Leishman (Cambridge University Press)', url: null },
      { kind: 'video', t: 'How Do You Get a Drone to Hover? (part 2)', by: 'MATLAB Tech Talks', url: 'https://www.mathworks.com/videos/series/drone-simulation-and-control.html' },
      { kind: 'video', t: 'Momentum theory / actuator disk lectures', by: 'YouTube search', yt: 'actuator disk momentum theory rotor hover lecture' },
      { kind: 'video', t: 'NPTEL helicopter / rotor aerodynamics lectures', by: 'YouTube search', yt: 'NPTEL helicopter aerodynamics momentum theory' },
    ],
    shorts: ['propeller thrust explained', 'ground effect drone', 'vortex ring state drone'],
    reels: [
      { front: 'Thrust ∝ ? and power ∝ ? (vs RPM)', back: 'T ∝ n², P ∝ n³. A little more thrust costs a lot more power.' },
      { front: 'Ideal hover power formula', back: 'P = T^{3/2} / √(2ρA). Bigger disk → less power. Heavier → power grows as mass^1.5.' },
      { front: 'Wake velocity far below the rotor?', back: 'Twice the induced velocity at the disk: w = 2vᵢ.' },
      { front: 'Why descend at an angle, not straight down?', back: 'Straight down at ~vᵢ you fall into your own wake: vortex ring state, sudden loss of lift.' },
      { front: 'Figure of merit of small UAV props?', back: 'About 0.5–0.7. P_shaft = P_ideal / FM.' },
    ],
    quiz: [
      { q: 'If rpm increases by 20%, thrust increases by about…', o: ['20%', '44%', '73%', '10%'], a: 1, e: 'T ∝ n² → 1.2² = 1.44, i.e. +44%.' },
      { q: 'Momentum theory: for the same thrust, doubling prop diameter changes ideal power by…', o: ['×2', '×0.5', '×0.25', '×4'], a: 1, e: 'A ∝ D². Doubling D gives 4× the area, and P ∝ 1/√A → power halves.' },
      { q: 'Wake velocity far downstream in ideal hover equals…', o: ['vᵢ', '2vᵢ', 'vᵢ/2', '√2·vᵢ'], a: 1, e: 'From T·vᵢ = ½ṁw² and T = ṁw → w = 2vᵢ.' },
      { q: 'A 1 kg drone hovers at 100 W. Same drone with 1 kg extra payload (2 kg total) needs roughly…', o: ['200 W', '283 W', '141 W', '400 W'], a: 1, e: 'P ∝ T^1.5 → 2^1.5 = 2.83 → ≈283 W (assuming FM and efficiency unchanged).' },
      { q: 'Which makes hover LESS efficient?', o: ['Larger props', 'Ground effect', 'High disk loading', 'Cooler, denser air'], a: 2, e: 'Higher T/A means faster induced flow and more power per newton.' },
      { q: 'What is the hazard of descending vertically at about the induced velocity?', o: ['Ground effect', 'Vortex ring state', 'Gyroscopic precession', 'Prop desync only'], a: 1, e: 'The rotor recirculates its own wake; thrust fluctuates and can collapse.' },
    ],
  },

  {
    id: 'dynamics',
    title: 'Rigid-Body Dynamics & the Mixer Matrix',
    tag: 'Mechanics & Linear Algebra',
    eee: 'Matrices from your maths course doing real work',
    color: '#818cf8',
    mins: 150,
    summary: 'Frames, rotation matrices, Euler angles vs quaternions, Newton–Euler equations of motion, and the mixer matrix that maps torques to motor thrusts.',
    outcomes: [
      'Write the 6-DOF Newton–Euler equations for a quadrotor.',
      'Build the X-quad mixer matrix from geometry and invert it.',
      'Explain gimbal lock and why flight software uses quaternions.',
      'Linearise the model around hover for controller design.',
    ],
    sections: [
      { h: 'Frames and rotations', body: `Two frames matter: the **world frame** (NED: north, east, down — used by ArduPilot/PX4) and the **body frame** (x forward, y right, z down). Attitude is the rotation between them.

**Euler angles** (roll φ, pitch θ, yaw ψ, applied in Z-Y-X order) are intuitive but hit a singularity at θ = ±90° (**gimbal lock**): roll and yaw become the same axis and the rate equations divide by cos θ.

The rotation matrix from body to world for Z-Y-X Euler angles:

$$R = \\begin{bmatrix} c\\theta c\\psi & s\\phi s\\theta c\\psi - c\\phi s\\psi & c\\phi s\\theta c\\psi + s\\phi s\\psi \\\\ c\\theta s\\psi & s\\phi s\\theta s\\psi + c\\phi c\\psi & c\\phi s\\theta s\\psi - s\\phi c\\psi \\\\ -s\\theta & s\\phi c\\theta & c\\phi c\\theta \\end{bmatrix}$$

**Quaternions** $q = [q_0, q_1, q_2, q_3]$ represent the same rotation with 4 numbers, no singularity, and cheap renormalisation. Every serious autopilot stores attitude as a quaternion and converts to Euler only for display.` },
      { h: 'Derivation: Newton–Euler equations of a quadrotor', type: 'derive', body: `**Translation** (world frame). Thrust acts along body −z (upward). With total thrust $T$:

$$m\\ddot{\\mathbf p} = m\\begin{bmatrix}0\\\\0\\\\g\\end{bmatrix} + R\\begin{bmatrix}0\\\\0\\\\-T\\end{bmatrix} \\; (+\\text{drag})$$

**Rotation** (body frame). With inertia matrix $J$ and body rate $\\boldsymbol\\omega$:

$$J\\dot{\\boldsymbol\\omega} = \\boldsymbol\\tau - \\boldsymbol\\omega \\times J\\boldsymbol\\omega \\;(-\\text{gyroscopic prop terms})$$

The cross term couples axes during fast multi-axis rotations; for a symmetric quad near hover it is small.

**Linearised hover model** (small angles, $\\psi = 0$): $\\ddot x \\approx -g\\theta$, $\\ddot y \\approx g\\phi$, $\\ddot z = g - T/m$, $\\ddot\\phi = \\tau_x/J_{xx}$, $\\ddot\\theta = \\tau_y/J_{yy}$, $\\ddot\\psi = \\tau_z/J_{zz}$.

So each attitude axis is a **double integrator** $1/(Js^2)$ — and horizontal position is a double integrator of attitude: four integrators from torque to position. That's why we nest control loops.` },
      { h: 'The mixer matrix', body: `[[fig:quad]]

Each motor $i$ makes thrust $T_i = k_f\\Omega_i^2$ and reaction torque $Q_i = k_\\tau\\Omega_i^2 = c\\,T_i$ (with $c = k_\\tau/k_f$, a length of order 0.01–0.03 m). For an X frame with arm length $L$, the moment arm about roll/pitch is $d = L/\\sqrt2$.

$$\\begin{bmatrix}T\\\\\\tau_x\\\\\\tau_y\\\\\\tau_z\\end{bmatrix} = \\begin{bmatrix}1&1&1&1\\\\-d&-d&d&d\\\\d&-d&-d&d\\\\-c&c&-c&c\\end{bmatrix}\\begin{bmatrix}T_1\\\\T_2\\\\T_3\\\\T_4\\end{bmatrix}$$

Signs: lifting the left motors (3, 4) rolls right-side-down (+τx); lifting the front (1, 4) pitches nose-up (+τy); a CW prop pushes the body CCW (−τz), so speeding up the CCW pair (2, 4) yaws nose-right.

The flight controller uses the **inverse** (the mixer): $T_i = \\tfrac14\\left(T + r_i\\tau_x/d + p_i\\tau_y/d + y_i\\tau_z/c\\right)$. Because $c \\ll d$, yaw authority is about 10× weaker than roll/pitch — quads yaw slowly.

**Saturation:** if a requested $T_i$ exceeds the motor's max or goes below zero, the mixer must scale/prioritise. Betaflight's *airmode* and ArduPilot's motor mixer prioritise attitude over thrust to keep control.` },
      { h: 'Industry note: motor order is firmware-specific', body: `This course numbers motors 1 = front-right, clockwise around. **Betaflight**, **ArduPilot** and **PX4** each use their own numbering and default spin directions. Before first flight you *always* open the motor tab, spin each motor individually (props off) and confirm position and direction against that firmware's diagram. Most "flips on take-off" crashes are motor order or prop direction errors.` },
    ],
    numericals: [
      { q: 'An X-quad has arm length 225 mm (motor to centre). Left motors produce 3.2 N each, right motors 2.8 N each. Find the roll torque and the roll angular acceleration if J_xx = 0.012 kg·m².', steps: ['Moment arm d = L/√2 = 0.225/1.414 = 0.1591 m.', 'τx = d[(T3+T4) − (T1+T2)] = 0.1591 × (6.4 − 5.6) = **0.127 N·m** (right side down).', 'α = τ/J = 0.1273/0.012 = **10.6 rad/s²** ≈ 608 °/s².'], answer: 'τx ≈ 0.127 N·m; α ≈ 10.6 rad/s²', why: 'A 0.4 N imbalance per side produces 600 °/s² — this is why quads react so violently and need fast control.' },
      { q: 'Same frame (d = 0.1591 m), c = 0.016 m. The controller requests T = 12 N, τx = 0.1 N·m, τy = 0, τz = 0.02 N·m. Find T1…T4 with the mixer formula.', steps: ['Base: T/4 = 3.0 N. Roll term: τx/(4d) = 0.1/0.6364 = 0.157 N. Yaw term: τz/(4c) = 0.02/0.064 = 0.3125 N.', 'Signs (roll r, yaw y): M1(−,−), M2(−,+), M3(+,−), M4(+,+).', 'T1 = 3 − 0.157 − 0.3125 = **2.53 N**; T2 = 3 − 0.157 + 0.3125 = **3.155 N**; T3 = 3 + 0.157 − 0.3125 = **2.845 N**; T4 = 3 + 0.157 + 0.3125 = **3.47 N**.', 'Check: sum = 12.0 N ✓.'], answer: 'T = [2.53, 3.155, 2.845, 3.47] N', why: 'Notice the yaw term is twice the roll term even though τz is 1/5 of τx — yaw is expensive.' },
      { q: 'Why does an Euler-angle based attitude estimator fail when the drone pitches to 90° (e.g. a vertical climb)?', steps: ['Euler rate kinematics: ψ̇ = (q sinφ + r cosφ)/cosθ.', 'At θ = 90°, cosθ = 0 → division by zero; roll and yaw axes align (gimbal lock).', 'Quaternion kinematics q̇ = ½ q ⊗ [0, ω] have no such division.'], answer: 'Gimbal lock: the cosθ in the denominator → ∞', why: 'Acro FPV pilots flip through 90° constantly; the firmware never notices because it uses quaternions.' },
    ],
    practice: [
      { book: 'Beard & McLain — Small Unmanned Aircraft', where: 'Coordinate frames and kinematics/dynamics chapters (the uavbook supplement has a quadrotor model)', note: 'Their exercises on rotation matrices are excellent.' },
      { book: 'Mahony, Kumar & Corke — "Multirotor Aerial Vehicles", IEEE Robotics & Automation Magazine (2012)', where: 'Whole paper', note: 'The classic tutorial: modelling, estimation, control in 15 pages.' },
      { book: 'Russ Tedrake — Underactuated Robotics (MIT, free online)', where: 'Ch. 3 — Quadrotors (planar and 3D), LQR for quadrotors', note: 'Code notebooks you can run.' },
    ],
    lab: { title: 'Write a 3-D quadrotor simulator in Python', kit: ['Python + NumPy + Matplotlib'], steps: ['State: position, velocity, quaternion, body rates (13 numbers).', 'Inputs: four thrusts → mixer forward matrix → T, τ.', 'Integrate with RK4 at 1 kHz; normalise the quaternion each step.', 'Test: equal thrusts = mg → stays put. Add 0.01 N to M4 → it should roll and pitch exactly as the sign rules predict.', 'Add a PD attitude controller (next modules) and fly a square.'], deliverable: 'A GitHub repo with the simulator and plots. Interviewers love this.' },
    industry: ['6-DOF modelling (MATLAB/Simulink or Python)', 'Quaternion maths', 'Motor/mixer configuration on real firmware'],
    sim: 'mixer',
    resources: [
      { kind: 'course', t: 'Underactuated Robotics — Ch. 3 Quadrotors', by: 'Russ Tedrake, MIT', url: 'https://underactuated.mit.edu/acrobot.html' },
      { kind: 'book', t: 'Small Unmanned Aircraft: Theory and Practice', by: 'Beard & McLain (Princeton)', url: null },
      { kind: 'paper', t: 'Multirotor Aerial Vehicles: Modeling, Estimation, and Control of Quadrotor', by: 'Mahony, Kumar, Corke — IEEE RAM 2012', url: 'https://doi.org/10.1109/MRA.2012.2206474' },
      { kind: 'video', t: '3Blue1Brown — Quaternions visualised', by: 'YouTube search', yt: '3Blue1Brown quaternions visualizing 4d numbers' },
      { kind: 'video', t: 'Setting Up the Control Problem (part 1)', by: 'MATLAB Tech Talks', url: 'https://www.mathworks.com/videos/series/drone-simulation-and-control.html' },
      { kind: 'docs', t: 'ArduPilot motor order diagrams', by: 'ArduPilot', url: 'https://ardupilot.org/copter/docs/connect-escs-and-motors.html' },
    ],
    shorts: ['gimbal lock explained', 'quaternion rotation', 'how a quadcopter yaws'],
    reels: [
      { front: 'Why is yaw authority ~10× weaker than roll?', back: 'Roll torque uses the arm d (~0.16 m); yaw uses c = kτ/kf (~0.016 m) — the prop\'s drag torque ratio.' },
      { front: 'Torque → position: how many integrators?', back: 'Four: torque → rate → angle → (tilted thrust) velocity → position. Hence nested loops.' },
      { front: 'What is gimbal lock?', back: 'At pitch ±90° Euler roll and yaw axes align; rate equations divide by cosθ = 0. Quaternions avoid it.' },
      { front: 'Mixer row for total thrust?', back: '[1 1 1 1] — every motor contributes equally to lift.' },
    ],
    quiz: [
      { q: 'In an X-quad, the moment arm for roll/pitch with arm length L is…', o: ['L', 'L/2', 'L/√2', '√2·L'], a: 2, e: 'Motors sit at 45° to the roll and pitch axes, so the perpendicular distance is L·cos45° = L/√2.' },
      { q: 'A CW-spinning prop (seen from above) exerts what torque on the frame?', o: ['CW', 'CCW', 'None', 'Depends on throttle only'], a: 1, e: 'Newton\'s 3rd law: the motor pushes the prop CW, the prop pushes the stator (and frame) CCW.' },
      { q: 'Why do autopilots store attitude as quaternions?', o: ['Fewer numbers than Euler', 'No singularity and cheap normalisation', 'Required by MAVLink', 'They are faster to display'], a: 1, e: 'Quaternions use 4 numbers (one more than Euler) but avoid gimbal lock and are numerically well behaved.' },
      { q: 'Near hover, the transfer function from roll torque to roll angle is…', o: ['1/(Js)', '1/(Js²)', 'J/s', 'K/(τs+1)'], a: 1, e: 'Jφ̈ = τx → Φ(s)/τ(s) = 1/(Js²): a double integrator.' },
      { q: 'The mixer requests T1 = 7.2 N but motors max out at 6 N. Good firmware will…', o: ['Ignore it', 'Clip only M1', 'Scale/shift all outputs to preserve the attitude correction', 'Disarm'], a: 2, e: 'Clipping one motor breaks the torque balance; mixers shift/scale all outputs to keep attitude control (airmode-style prioritisation).' },
      { q: 'To pitch nose-up (positive τy in this course\'s convention) you…', o: ['Raise rear motors', 'Raise front motors', 'Raise CW motors', 'Raise left motors'], a: 1, e: 'More thrust at the front lifts the nose.' },
    ],
  },

  {
    id: 'motors',
    title: 'Brushless Motors (BLDC / PMSM)',
    tag: 'Electrical Machines',
    eee: 'Your machines course, at 30,000 rpm',
    color: '#a78bfa',
    mins: 150,
    summary: 'Construction of outrunner BLDC motors, KV and torque constant, back-EMF, the steady-state motor equations, losses, efficiency and thermal limits, and how to match a motor to a prop.',
    outcomes: [
      'Relate KV to Kt and back-EMF constant in SI units.',
      'Solve for speed, torque, power and efficiency at an operating point.',
      'Explain stator size codes (e.g. 2306), pole/slot counts and why outrunners suit props.',
      'Match motor KV and voltage to prop size.',
    ],
    sections: [
      { h: 'What\'s inside', body: `A drone motor is an **outrunner**: the permanent magnets are on a bell that spins *around* a fixed wound stator. Outrunners have a large magnet radius → more torque per amp at low speed, which suits direct-drive props.

**Naming:** "2306" = 23 mm stator diameter, 6 mm stator height. Volume ∝ D²h is a decent proxy for torque. **12N14P** = 12 stator slots, 14 magnet poles (7 pole pairs): electrical frequency = 7 × mechanical frequency. Your ESC needs the pole count to report true rpm.

Electrically it is a three-phase permanent-magnet synchronous machine. Drone motors are usually driven like a **BLDC** (six-step) by hobby ESCs or with **FOC** (sinusoidal) by more advanced ones.` },
      { h: 'Derivation: KV, Kt and the motor equations', type: 'derive', body: `KV is the no-load speed per volt: $\\text{rpm} = K_V\\,E$ where $E$ is back-EMF. In SI the back-EMF constant is $K_e = E/\\omega$ (V·s/rad), and for an ideal machine power balance $E I = \\tau\\omega$ gives $K_t = K_e$. Converting units:

$$K_t\\;[\\text{N·m/A}] = \\frac{60}{2\\pi K_V} \\approx \\frac{9.549}{K_V}$$

Steady state, treating the motor as a DC machine:

$$V = I R + \\frac{\\omega}{K_V'} \\quad (K_V' \\text{ in rad/s/V}), \\qquad \\tau = K_t (I - I_0)$$

Power flow: $P_{in} = VI$, copper loss $I^2R$, no-load (iron + friction) loss $\\approx I_0 E$, output $P_{out} = \\tau\\omega$. Efficiency peaks where copper loss ≈ no-load loss:

$$I_{\\eta,max} \\approx \\sqrt{\\frac{I_0 V}{R}}$$` },
      { h: 'Matching motor, prop and voltage', body: `- **Low KV + big prop + high voltage**: heavy-lift and long-endurance (e.g. 300–500 KV on 6–12S with 15–30″ props).
- **High KV + small prop**: FPV (e.g. 1700–2000 KV on 6S, 2400–2700 KV on 4S with 5″ props).
- Same power at higher voltage = lower current = less $I^2R$ in wires, ESC and motor. Industry trend: 6S over 4S, 12S+ for big drones.
- Prop too large for the motor → current and temperature skyrocket (power ∝ rpm³·D⁵). Always check the manufacturer's tested prop list and a thrust table.

**Thermal limit is the real limit.** Magnets (often N52 / N52SH) lose strength permanently above their rated temperature. Rule of thumb on the bench: if you can't hold your finger on the bell for 5 seconds after a flight, back off.` },
      { h: 'Six-step vs FOC', body: `| | Six-step (trapezoidal) | FOC (field-oriented control) |
|---|---|---|
| Currents | Two phases at a time, 120° blocks | Sinusoidal in all three phases |
| Position sensing | Back-EMF zero crossing on floating phase | Observer estimates rotor angle from currents |
| Torque ripple | Higher | Low |
| Hardware | Cheap MCU, no current sensing needed | Phase-current sensing + faster MCU |
| Used in | BLHeli_S/Bluejay, AM32 | Larger commercial/industrial drone ESCs, e-bikes |

FOC transforms phase currents into a rotating d–q frame (Clarke + Park transforms) so torque control becomes two DC PI loops — directly from your machines course.` },
    ],
    numericals: [
      { q: 'A 2450 KV motor runs on a fully charged 4S pack (16.8 V). Find the no-load speed and the torque constant.', steps: ['No-load rpm ≈ KV × V = 2450 × 16.8 = **41,160 rpm** (ignoring I₀R drop).', 'Kt = 60/(2π × 2450) = **0.00390 N·m/A**.'], answer: '≈ 41,160 rpm; Kt ≈ 3.90 mN·m/A', why: 'Under load, rpm is lower because I·R eats into the voltage.' },
      { q: 'A 920 KV motor: R = 0.12 Ω, I₀ = 0.5 A, supply 11.1 V, drawing 10 A. Find speed, torque, output power, efficiency and the loss breakdown.', steps: ['Back-EMF E = V − IR = 11.1 − 10×0.12 = 9.9 V → rpm = 920 × 9.9 = **9,108 rpm** (ω = 953.8 rad/s).', 'Kt = 9.549/920 = 0.01038 N·m/A → τ = Kt(I − I₀) = 0.01038 × 9.5 = **0.0986 N·m**.', 'P_out = τω = 0.0986 × 953.8 = **94.05 W**; P_in = 11.1 × 10 = 111 W.', 'η = 94.05/111 = **84.7%**.', 'Losses: copper I²R = 12.0 W; no-load I₀E = 0.5 × 9.9 = 4.95 W. Check: 111 − 12 − 4.95 = 94.05 W ✓.'], answer: '9108 rpm, 0.0986 N·m, 94.1 W out, η ≈ 84.7%', why: 'The energy balance closing exactly proves the model is self-consistent.' },
      { q: 'For the same motor at 11.1 V, estimate the current for peak efficiency.', steps: ['I ≈ √(I₀V/R) = √(0.5 × 11.1 / 0.12) = √46.25 = **6.8 A**.'], answer: '≈ 6.8 A', why: 'Design so hover current sits near peak efficiency — that\'s endurance for free.' },
      { q: 'A 14-pole motor spins at 30,000 rpm. What is the electrical commutation frequency the ESC must handle?', steps: ['Pole pairs = 14/2 = 7.', 'Mechanical frequency = 30,000/60 = 500 Hz → electrical = 7 × 500 = **3.5 kHz**.', 'Six-step: 6 commutations per electrical cycle → **21,000 commutations/s**.'], answer: '3.5 kHz electrical; 21k steps/s', why: 'This is why ESC firmware is written in tight assembly/C with hardware timers.' },
    ],
    practice: [
      { book: 'Austin Hughes & Bill Drury — Electric Motors and Drives (Newnes)', where: 'DC motor and permanent-magnet/brushless chapters', note: 'Very readable; the DC-motor equations apply directly.' },
      { book: 'R. Krishnan — Permanent Magnet Synchronous and Brushless DC Motor Drives (CRC)', where: 'BLDC modelling and control chapters', note: 'Graduate depth for FOC.' },
      { book: 'Your Electrical Machines textbook (e.g. P.S. Bimbhra / Nagrath & Kothari)', where: 'DC machine numericals on back-EMF and torque', note: 'Same equations — redo them with drone numbers.' },
    ],
    lab: { title: 'Measure KV, R and I₀ of a real motor', kit: ['Motor + ESC', 'Bench supply', 'Multimeter (4-wire or low-ohm mode if available)', 'Oscilloscope (college lab)'], steps: ['Phase-to-phase resistance with a low-ohm method; divide by 2 for per-phase (wye).', 'Run no-load at a known voltage; measure current (I₀) and rpm (ESC telemetry or tachometer). KV ≈ rpm / (V − I₀R).', 'Spin the motor by hand/drill with no ESC; scope the phase-to-phase voltage. Back-EMF amplitude vs speed gives Ke — compare with 60/(2πKV).', 'Compare with the datasheet.'], deliverable: 'Table: datasheet vs measured KV, R, I₀ + back-EMF scope capture.' },
    industry: ['Motor/prop matching', 'Thermal testing', 'FOC fundamentals (Clarke/Park)'],
    sim: 'motor',
    resources: [
      { kind: 'book', t: 'Electric Motors and Drives', by: 'Hughes & Drury', url: null },
      { kind: 'video', t: 'How brushless motors work', by: 'YouTube search', yt: 'how brushless DC motor works animation outrunner' },
      { kind: 'video', t: 'Field oriented control explained', by: 'YouTube search', yt: 'field oriented control explained clarke park transform' },
      { kind: 'video', t: 'Motor KV explained for drones', by: 'YouTube search', yt: 'motor kv explained FPV Joshua Bardwell' },
      { kind: 'docs', t: 'Oscar Liang — FPV motor guide', by: 'oscarliang.com', url: 'https://oscarliang.com/fpv-drone-motors/' },
    ],
    shorts: ['brushless motor explained', 'motor kv explained', 'outrunner vs inrunner'],
    reels: [
      { front: 'Kt from KV?', back: 'Kt = 60/(2π·KV) ≈ 9.549/KV  [N·m/A]. Low KV = more torque per amp.' },
      { front: '"2207" means?', back: 'Stator 22 mm diameter, 7 mm height.' },
      { front: 'Peak efficiency current?', back: 'Where copper loss ≈ no-load loss: I ≈ √(I₀V/R).' },
      { front: 'Why push voltage up (4S → 6S)?', back: 'Same power at lower current → I²R losses in wires, ESC and windings fall.' },
    ],
    quiz: [
      { q: 'A 1000 KV motor has Kt of about…', o: ['0.955 N·m/A', '0.00955 N·m/A', '9.55 N·m/A', '0.0955 N·m/A'], a: 1, e: '9.549/1000 = 0.00955 N·m/A.' },
      { q: 'Why are drone motors outrunners?', o: ['Cheaper magnets', 'Larger magnet radius gives more torque at low speed for direct prop drive', 'They need no ESC', 'Better cooling of magnets'], a: 1, e: 'Torque ∝ air-gap radius; outrunners put magnets at the largest radius.' },
      { q: '12N14P motor: electrical frequency vs mechanical?', o: ['Same', '×7', '×14', '×12'], a: 1, e: '14 poles = 7 pole pairs → f_elec = 7 × f_mech.' },
      { q: 'At very high current, the dominant motor loss is…', o: ['Iron loss', 'Copper loss I²R', 'Bearing friction', 'Windage'], a: 1, e: 'Copper loss grows with I² and dominates at high load.' },
      { q: 'Back-EMF in a motor spinning at constant speed is proportional to…', o: ['Current', 'Speed', 'Temperature', 'Supply voltage only'], a: 1, e: 'E = Ke·ω.' },
      { q: 'FOC needs which extra hardware compared to basic six-step?', o: ['Hall sensors always', 'Phase-current sensing and a faster MCU', 'A gearbox', 'A second battery'], a: 1, e: 'FOC regulates d–q currents, so it must measure phase currents and run transforms quickly.' },
    ],
  },
];
