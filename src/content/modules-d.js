// Modules 13–15: specialisation track.
export const modulesD = [
  {
    id: 'fixedwing',
    title: 'Fixed-Wing & VTOL Flight',
    tag: 'Aerodynamics',
    eee: 'Why wings beat rotors for endurance — with numbers',
    color: '#f97316',
    mins: 150,
    summary: 'Lift and drag, stall, lift-to-drag ratio and cruise power, turns and load factor, control surfaces and stability, and how quadplanes and tilt-rotors combine hover with efficient cruise.',
    outcomes: [
      'Use the lift equation to find cruise and stall speeds.',
      'Compute cruise power from L/D and compare it with multirotor hover power.',
      'Explain load factor in turns and why stall speed rises when banking.',
      'Describe how a VTOL quadplane transitions and what can go wrong.',
    ],
    sections: [
      { h: 'Lift, drag and stall', body: `A wing makes lift by turning the airflow downward:

$$L = \\tfrac12 \\rho V^2 S\\, C_L, \\qquad D = \\tfrac12 \\rho V^2 S\\, C_D$$

$S$ is wing area, $C_L$ rises roughly linearly with angle of attack $\\alpha$ until the flow separates at the **stall** ($C_{L,max}$ ≈ 1.0–1.4 for simple small-UAV wings without flaps). In level flight $L = W$, so the slowest you can fly is

$$V_{stall} = \\sqrt{\\frac{2W}{\\rho S C_{L,max}}}$$

Drag has two parts: **parasite** (skin friction and form drag, grows with $V^2$) and **induced** (the price of making lift, falls with $V^2$). Their sum has a minimum: the speed for best range sits near that minimum.` },
      { h: 'Derivation: why wings win on endurance', type: 'derive', body: `In steady level flight, thrust = drag and lift = weight. Define the lift-to-drag ratio $L/D$ (small UAVs: about 8–15; gliders 30+).

$$D = \\frac{W}{L/D}, \\qquad P_{aero} = D\\,V = \\frac{W V}{L/D}$$

Electrical power divides by propeller and drive efficiencies: $P_{elec} = P_{aero}/(\\eta_{prop}\\,\\eta_{drive})$.

A multirotor must instead push air downward continuously to support its full weight ($P \\propto W^{1.5}/\\sqrt{A}$). For the same 2 kg mass, a plane with $L/D = 10$ needs roughly **one fifth** of the power of a 10-inch quad (see numericals). That ratio is why mapping and long-range delivery use wings.` },
      { h: 'Turns and load factor', body: `In a coordinated turn at bank angle $\\phi$, lift must hold the weight *and* pull the aircraft round:

$$n = \\frac{L}{W} = \\frac{1}{\\cos\\phi}, \\qquad R = \\frac{V^2}{g\\tan\\phi}, \\qquad V_{stall,turn} = V_{stall}\\sqrt{n}$$

At 60° bank the wing carries **2 g** and stall speed rises by √2 ≈ 41%. Many fixed-wing crashes are low, slow, steep turns. Autopilots limit bank angle (e.g. 45°) and keep airspeed margins for this reason.` },
      { h: 'Control surfaces and stability', body: `| Surface | Controls | Axis |
|---|---|---|
| Ailerons | Roll | Longitudinal (x) |
| Elevator | Pitch | Lateral (y) |
| Rudder | Yaw | Vertical (z) |
| Flaps | Extra lift at low speed | — |

Unlike a multirotor, a well-designed plane is **statically stable**: the centre of gravity sits ahead of the neutral point, so a nose-up disturbance produces a nose-down restoring moment. The distance between them as a fraction of chord is the **static margin** (typically 5–15% for small UAVs). CG too far aft → unstable; too far forward → heavy, sluggish, high elevator drag.

Fixed-wing autopilots (ArduPlane, PX4 fixed-wing) need an **airspeed sensor** (pitot tube + differential pressure sensor) because GPS gives ground speed, not airspeed, and stall depends on airspeed.` },
      { h: 'VTOL: quadplanes and tilt-rotors', body: `- **Quadplane**: a normal plane plus four lift motors. Take off as a quad, accelerate with the pusher motor, and switch the lift motors off once airspeed is safely above stall. Simple and robust; the lift motors are dead weight in cruise.
- **Tilt-rotor / tilt-wing**: the same motors tilt from vertical to horizontal. Lighter, but mechanically and control-wise much harder.
- **Tailsitter**: the whole aircraft pitches 90°. Fewest parts, hardest to control in wind.

The **transition** is the risky part: the vehicle must reach a safe airspeed before the lift motors stop helping, and back-transition must not stall. ArduPilot's QuadPlane code has parameters for transition speed, timeouts and "assisted" flight (lift motors help if airspeed or attitude goes wrong).` },
    ],
    numericals: [
      { q: 'A 2 kg fixed-wing UAV has wing area 0.4 m² and cruises at C_L = 0.5 (sea level, ρ = 1.225). Find the cruise speed and the stall speed if C_L,max = 1.2.', steps: ['W = 2 × 9.81 = 19.62 N.', 'Cruise: V = √(2W/(ρ S C_L)) = √(39.24 / (1.225 × 0.4 × 0.5)) = √160.2 = **12.66 m/s**.', 'Stall: V_s = √(39.24 / (1.225 × 0.4 × 1.2)) = √66.7 = **8.17 m/s**.'], answer: 'Cruise ≈ 12.7 m/s; stall ≈ 8.2 m/s', why: 'Cruise is only ~1.55× stall here — gusts and turns eat that margin quickly.' },
      { q: 'The same plane has L/D = 10 at cruise. Find drag, aerodynamic power, and electrical power with η_prop = 0.6 and η_drive = 0.8. Compare with a 2 kg quad on 10″ props (FM 0.6, η 0.8).', steps: ['D = W/(L/D) = 19.62/10 = **1.96 N**.', 'P_aero = D·V = 1.962 × 12.66 = **24.8 W** → P_elec = 24.8/(0.6 × 0.8) = **51.7 W**.', 'Quad (momentum theory, same assumptions as module 2): P_elec ≈ **257 W**.', 'Ratio ≈ 257/51.7 ≈ **5×** more power for the multirotor.'], answer: 'Plane ≈ 52 W vs quad ≈ 257 W (≈5×)', why: 'Same battery → roughly 5× the flight time for the plane, minus losses for climb and wind.' },
      { q: 'The plane turns at 15 m/s with 30° bank. Find the turn radius. At 60° bank, what is the load factor and the new stall speed?', steps: ['R = V²/(g tanφ) = 225/(9.81 × 0.5774) = **39.7 m**.', 'At 60°: n = 1/cos60° = **2 g**.', 'V_s,turn = 8.17 × √2 = **11.6 m/s** — close to many cruise speeds.'], answer: 'R ≈ 39.7 m; n = 2; stall ≈ 11.6 m/s at 60°', why: 'Explains why autopilots cap bank angle and why survey turns are planned wide.' },
    ],
    practice: [
      { book: 'John D. Anderson — Introduction to Flight (McGraw-Hill)', where: 'Airfoils and wings; airplane performance (level flight, turns, range and endurance)', note: 'Clear derivations and many end-of-chapter problems.' },
      { book: 'Beard & McLain — Small Unmanned Aircraft', where: 'Forces and moments, linear design models, autopilot design chapters', note: 'Written exactly for small fixed-wing UAVs.' },
      { book: 'Daniel Raymer — Aircraft Design: A Conceptual Approach', where: 'Initial sizing and performance chapters', note: 'For sizing a VTOL or survey plane.' },
    ],
    lab: { title: 'Fly a quadplane in SITL', kit: ['ArduPilot SITL (sim_vehicle.py -v ArduPlane -f quadplane)', 'Mission Planner or QGroundControl'], steps: ['Start the quadplane SITL model and take off in QHOVER.', 'Switch to FBWA and watch the transition: log airspeed and lift-motor outputs.', 'Fly a survey mission with VTOL take-off and landing.', 'Reduce the transition airspeed parameter and observe what happens (in simulation only!).'], deliverable: 'Plot of airspeed and lift-motor output through a transition, with a short explanation.' },
    industry: ['Fixed-wing performance estimation', 'ArduPlane / PX4 fixed-wing tuning (TECS, L1)', 'Airspeed sensor calibration', 'VTOL transition testing'],
    sim: null,
    resources: [
      { kind: 'docs', t: 'ArduPilot Plane documentation', by: 'ArduPilot', url: 'https://ardupilot.org/plane/' },
      { kind: 'docs', t: 'QuadPlane (VTOL) support', by: 'ArduPilot', url: 'https://ardupilot.org/plane/docs/quadplane-support.html' },
      { kind: 'tool', t: 'XFLR5 — wing and airfoil analysis (free)', by: 'xflr5.tech', url: 'https://www.xflr5.tech/xflr5.htm' },
      { kind: 'video', t: 'Flite Test — how planes fly / design basics', by: 'YouTube search', yt: 'Flite Test how airplanes fly basics' },
      { kind: 'video', t: 'NPTEL — introduction to aircraft performance', by: 'YouTube search', yt: 'NPTEL aircraft performance lecture lift drag' },
      { kind: 'video', t: 'VTOL quadplane transition explained', by: 'YouTube search', yt: 'ArduPilot quadplane transition explained' },
    ],
    shorts: ['how wings make lift', 'stall explained airplane', 'VTOL drone transition'],
    reels: [
      { front: 'Lift equation', back: 'L = ½ρV²S·C_L' },
      { front: 'Why wings beat rotors on endurance', back: 'Cruise power = W·V/(L/D). With L/D ≈ 10 that is ~5× less than hovering the same mass.' },
      { front: 'Load factor at 60° bank', back: 'n = 1/cos60° = 2 g; stall speed ×√2.' },
      { front: 'Why fixed-wing autopilots need a pitot tube', back: 'Stall depends on airspeed; GPS only gives ground speed.' },
    ],
    quiz: [
      { q: 'Stall happens when…', o: ['Speed reaches zero', 'The angle of attack exceeds the critical angle and flow separates', 'The motor stops', 'Altitude is too high'], a: 1, e: 'A wing can stall at any speed if the angle of attack is too high, e.g. in a steep turn.' },
      { q: 'Doubling airspeed (same C_L) changes lift by…', o: ['×2', '×4', '×√2', 'No change'], a: 1, e: 'L ∝ V².' },
      { q: 'Cruise power of a fixed-wing is…', o: ['W·V/(L/D)', 'W^1.5/√(2ρA)', 'L·D', 'W/V'], a: 0, e: 'P = D·V and D = W/(L/D).' },
      { q: 'Stall speed in a 60° banked turn compared with level flight is…', o: ['Same', '√2× higher', '2× higher', 'Lower'], a: 1, e: 'n = 2 → V_s ∝ √n.' },
      { q: 'A plane with CG behind the neutral point is…', o: ['More efficient and stable', 'Statically unstable in pitch', 'Unaffected', 'Faster only'], a: 1, e: 'Negative static margin: a pitch disturbance grows instead of being corrected.' },
      { q: 'The main risk phase of a quadplane flight is…', o: ['Cruise', 'Transition between hover and wing-borne flight', 'Battery change', 'GPS lock'], a: 1, e: 'Airspeed must be safe before lift motors stop helping, and back-transition must not stall.' },
      { q: 'Elevator controls…', o: ['Roll', 'Pitch', 'Yaw', 'Throttle'], a: 1, e: 'Ailerons roll, elevator pitches, rudder yaws.' },
      { q: 'Turn radius at speed V and bank φ is…', o: ['V/(g sinφ)', 'V²/(g tanφ)', 'gV/tanφ', 'V²·tanφ'], a: 1, e: 'Horizontal lift component L·sinφ provides the centripetal force mV²/R with L·cosφ = mg.' },
    ],
  },

  {
    id: 'pcb',
    title: 'Flight-Controller & Power PCB Design',
    tag: 'Electronics Design',
    eee: 'The most hireable EEE skill in the drone industry',
    color: '#14b8a6',
    mins: 180,
    summary: 'Designing a flight-controller or power board: schematic blocks, STM32 + IMU layout, power trees and decoupling, high-current traces, current and voltage sensing, EMI and grounding, and the KiCad workflow from schematic to fabrication.',
    outcomes: [
      'Draw the schematic blocks of a flight controller and choose parts from datasheets.',
      'Size high-current traces and pours, and estimate their resistance and loss.',
      'Design voltage and current sensing for an ADC.',
      'Apply layout rules for IMUs, switching regulators and grounding.',
    ],
    sections: [
      { h: 'The blocks on a flight controller', body: `- **MCU**: STM32F4/F7/H7 with crystal (or not), SWD debug header, boot pin, USB.
- **IMU** on SPI (e.g. ICM-42688-P / BMI270), with its own clean 3.3 V supply and data-ready interrupt line.
- **Barometer** (I²C/SPI) under foam, away from airflow and light.
- **Power tree**: battery → buck regulator (5 V for peripherals) → low-noise LDO (3.3 V for MCU and especially the IMU).
- **Voltage divider + current-sense** inputs to the ADC.
- **Connectors**: UARTs (GPS, receiver, telemetry), motor outputs (timers), I²C, CAN on bigger autopilots.
- **Storage**: SD card or SPI flash for logs.

Open-source references: many ArduPilot/Betaflight board designs and target definitions are public. Studying a real schematic is the fastest way to learn.` },
      { h: 'Derivation: trace width and copper loss', type: 'derive', body: `Copper resistance: $R = \\rho L / (w\\,t)$ with $\\rho_{Cu} \\approx 1.72\\times10^{-8}$ Ω·m and 1 oz copper ≈ 35 µm thick.

The IPC-2221 rule of thumb links current to cross-section for a given temperature rise $\\Delta T$ (A in mil²):

$$I = k\\,\\Delta T^{0.44} A^{0.725}, \\quad k \\approx 0.048 \\text{ (outer layers)}$$

Solve for area, then width = area / thickness. For tens of amps the answer is *centimetres* of 1 oz copper — which is why power boards use **copper pours on several layers, 2 oz copper, stitching vias, and solder pads for thick wires** instead of thin traces. Modern IPC-2152 charts are more accurate; use a calculator, but know the physics.` },
      { h: 'Sensing: voltage and current', body: `**Battery voltage:** a resistor divider scales the pack voltage into the ADC range with margin, plus a small capacitor to filter noise. Choose high enough resistance to avoid draining the pack but low enough for the ADC's input impedance.

**Current:** either a **shunt resistor** (sub-milliohm) + a current-sense amplifier (e.g. INA-family), or a **Hall-effect** sensor (isolated, no loss, more offset drift). Shunt power $= I^2R$ and voltage $= IR$ set the trade-off: small R → low loss but tiny signal needing gain.

Calibrate both against a multimeter and a known load; firmware has scale and offset parameters for exactly this.` },
      { h: 'Layout rules that save your project', body: `- **Decouple every power pin**: 100 nF close to the pin, plus bulk (1–10 µF) nearby. Shortest possible loop to ground.
- **Solid ground plane** under everything; don't split it under high-speed signals. Return currents flow directly under their trace.
- **Switching regulator**: keep the hot loop (input cap → switch → diode/low-side FET) tiny; keep the inductor and switch node away from the IMU and baro.
- **IMU**: near the board centre, away from high current, with its own filtered supply; note orientation for the firmware.
- **High current**: keep battery and motor currents out of the sensitive analogue area; star-like distribution.
- **Test points and an SWD header**: you will need them on your first board.
- **DRC/ERC clean** before ordering. Check footprints against datasheets — the most common first-board mistake.` },
      { h: 'Workflow: KiCad to a working board', body: `1. Requirements and block diagram → 2. part selection (check availability at your fab/assembly house) → 3. schematic with ERC → 4. footprints → 5. placement (connectors and IMU first) → 6. routing + pours → 7. DRC → 8. Gerbers + BOM + pick-and-place → 9. order (many fabs offer assembly) → 10. **bring-up**: current-limited first power-on, check rails, flash bootloader, test each peripheral.

KiCad is free and widely used by startups; Altium is common in larger companies. Learning either well is a strong portfolio signal.` },
    ],
    numericals: [
      { q: 'Using IPC-2221 (outer layer, k = 0.048), what copper cross-section and width (1 oz = 1.378 mil thick) carry 20 A with a 10 °C temperature rise?', steps: ['A = [I / (k ΔT^0.44)]^(1/0.725) = [20 / (0.048 × 10^0.44)]^(1.379) ≈ **1015 mil²**.', 'Width (1 oz) = 1015 / 1.378 ≈ 737 mil ≈ **18.7 mm**.', 'With 2 oz copper ≈ **9.4 mm**; split over two layers ≈ 4.7 mm each.'], answer: '≈ 1015 mil²; ≈ 18.7 mm at 1 oz', why: 'This is why ESC and PDB boards are mostly copper pours and thick-wire pads.' },
      { q: 'A 1 oz (35 µm) trace is 5 mm wide and 50 mm long and carries 30 A. Find its resistance, voltage drop and power loss.', steps: ['R = ρL/(wt) = 1.72×10⁻⁸ × 0.05 / (0.005 × 35×10⁻⁶) = **4.91 mΩ**.', 'Drop = 30 × 0.00491 = **0.147 V**.', 'Loss = I²R = 900 × 0.00491 = **4.4 W** — a lot of heat in a thin strip.'], answer: '4.9 mΩ, 0.15 V, 4.4 W', why: 'Copper is not free: compute before you route.' },
      { q: 'Design a battery-voltage divider for 6S (25.2 V max) into a 3.3 V, 12-bit ADC using 10 kΩ / 1 kΩ. What is the ADC voltage at full charge and the voltage resolution per count?', steps: ['Ratio = (10k + 1k)/1k = 11 → V_adc = 25.2/11 = **2.29 V** (safe margin below 3.3 V).', 'Resolution = (3.3/4096) × 11 = **8.9 mV** of battery voltage per count.'], answer: '2.29 V; ≈ 8.9 mV/count', why: 'Plenty for per-cell monitoring (~1.5 mV per cell).' },
      { q: 'A 0.25 mΩ shunt carries 100 A. Find the shunt voltage, its power, and a sensible amplifier gain for a 3.3 V ADC.', steps: ['V = IR = 100 × 0.00025 = **25 mV**.', 'P = I²R = 10,000 × 0.00025 = **2.5 W** — needs a shunt rated for it and good copper.', 'Max gain = 3.3/0.025 = 132 → choose **gain 100** → 2.5 V at 100 A, leaving headroom.'], answer: '25 mV, 2.5 W, gain ≈ 100', why: 'Typical of real current-sense designs on power modules.' },
    ],
    practice: [
      { book: 'Henry Ott — Electromagnetic Compatibility Engineering (Wiley)', where: 'Grounding, decoupling and PCB layout chapters', note: 'The EMC reference used across industry.' },
      { book: 'Texas Instruments / Analog Devices application notes', where: 'Buck converter layout, current-sense amplifier selection', note: 'Free, practical, full of numbers.' },
      { book: 'KiCad documentation + an open-source flight-controller design', where: 'Schematic and PCB editor chapters', note: 'Reproduce a small part of a real design.' },
    ],
    lab: { title: 'Design a power + sensing board in KiCad', kit: ['KiCad (free)', 'Datasheets: a buck regulator, an LDO, a current-sense amplifier', 'Optional: order 5 boards from a PCB fab'], steps: ['Schematic: XT60 in/out, shunt + amplifier, divider, 5 V buck, 3.3 V LDO, test points.', 'Run ERC, assign footprints, place connectors first.', 'Route with pours for battery current; keep the buck hot loop tight.', 'Run DRC, export Gerbers, review them in a Gerber viewer.', 'If you build it: current-limited power-on, measure rails and calibrate sensing.'], deliverable: 'KiCad project + PDF schematic + 3D render. A real portfolio piece.' },
    industry: ['KiCad / Altium', 'Datasheet-driven part selection', 'Power integrity and EMC layout', 'Board bring-up and debugging'],
    sim: null,
    resources: [
      { kind: 'tool', t: 'KiCad EDA (free)', by: 'kicad.org', url: 'https://www.kicad.org/' },
      { kind: 'docs', t: 'Fundamentals of MOSFET and IGBT Gate Driver Circuits', by: 'Texas Instruments (SLUA618)', url: 'https://www.ti.com/lit/an/slua618a/slua618a.pdf' },
      { kind: 'video', t: 'Phil\'s Lab — KiCad and STM32 hardware design', by: 'YouTube search', yt: 'Phils Lab KiCad STM32 PCB design' },
      { kind: 'video', t: 'Robert Feranec — PCB layout and grounding', by: 'YouTube search', yt: 'Robert Feranec PCB layout grounding decoupling' },
      { kind: 'video', t: 'Buck converter PCB layout', by: 'YouTube search', yt: 'buck converter PCB layout hot loop' },
    ],
    shorts: ['PCB design tips', 'decoupling capacitor explained', 'kicad tutorial'],
    reels: [
      { front: 'Copper resistance formula', back: 'R = ρL/(w·t), ρ_Cu ≈ 1.72×10⁻⁸ Ω·m, 1 oz ≈ 35 µm.' },
      { front: 'Why 100 nF next to every power pin?', back: 'Supplies fast current spikes locally so the rail doesn\'t dip; the loop must be tiny.' },
      { front: 'Shunt sensing trade-off', back: 'Small R → low loss but tiny signal (needs gain). Large R → easy signal but heat.' },
      { front: 'First power-on of a new board', back: 'Current-limited supply, check every rail, then flash, then test one peripheral at a time.' },
    ],
    quiz: [
      { q: 'Why does the IMU usually get its own LDO supply?', o: ['LDOs are faster', 'To keep switching noise off the sensor\'s supply', 'Required by SPI', 'To save power'], a: 1, e: 'Low-noise supply reduces sensor noise and offsets.' },
      { q: 'High-current paths on ESC/PDB boards are made with…', o: ['Thin traces', 'Copper pours on multiple layers, thick copper and wire pads', 'Jumper wires only', 'Vias only'], a: 1, e: 'Tens of amps need large copper area.' },
      { q: 'The "hot loop" of a buck converter should be…', o: ['As large as possible', 'As small as possible', 'Routed under the IMU', 'Split across the ground plane'], a: 1, e: 'The high di/dt loop radiates; keep its area tiny.' },
      { q: 'A 0.5 mΩ shunt at 60 A dissipates…', o: ['0.03 W', '1.8 W', '30 W', '0.9 W'], a: 1, e: 'P = I²R = 3600 × 0.0005 = 1.8 W.' },
      { q: 'Which check catches unconnected pins and conflicting outputs in a schematic?', o: ['DRC', 'ERC', 'BOM', 'Gerber'], a: 1, e: 'Electrical Rules Check works on the schematic; DRC on the layout.' },
      { q: 'Return current of a fast signal flows mostly…', o: ['Anywhere in the ground plane', 'Directly under the signal trace in the reference plane', 'Through the battery', 'Through the shield only'], a: 1, e: 'At high frequency, return current follows the path of least inductance — right under the trace.' },
      { q: 'Battery divider 10k/1k on a 4S pack at 16.8 V gives the ADC…', o: ['1.53 V', '1.68 V', '3.3 V', '0.84 V'], a: 0, e: '16.8 / 11 = 1.53 V.' },
      { q: 'A common first-board mistake is…', o: ['Too many test points', 'Wrong footprints or pin mapping', 'Too much ground plane', 'Using KiCad'], a: 1, e: 'Always verify footprints and pinouts against the datasheet before ordering.' },
    ],
  },

  {
    id: 'vision',
    title: 'Computer Vision & Mapping for Drones',
    tag: 'Perception',
    eee: 'Cameras as sensors: optics, pixels, latency and algorithms',
    color: '#e879f9',
    mins: 160,
    summary: 'The pinhole camera model and calibration, ground sample distance and survey planning, motion blur and exposure, fiducial markers and precision landing, object detection on companion computers, visual odometry and photogrammetry.',
    outcomes: [
      'Compute ground sample distance, footprint and survey line spacing.',
      'Check motion blur and latency budgets for a vision task.',
      'Explain camera calibration and marker-based pose estimation.',
      'Choose between on-board detection, visual odometry and offline photogrammetry.',
    ],
    sections: [
      { h: 'The pinhole camera model', body: `A 3-D point $(X, Y, Z)$ in the camera frame projects to pixel coordinates

$$u = f_x\\frac{X}{Z} + c_x, \\qquad v = f_y\\frac{Y}{Z} + c_y$$

$f_x, f_y$ are focal lengths **in pixels** ($f_{px} = f_{mm}/\\text{pixel pitch}$) and $(c_x, c_y)$ is the principal point. Together they form the **intrinsic matrix** $K$. Real lenses add **distortion** (radial, tangential), so every vision pipeline starts with **calibration**: photograph a checkerboard from many angles and let OpenCV estimate $K$ and the distortion coefficients.` },
      { h: 'Derivation: ground sample distance and survey planning', type: 'derive', body: `Looking straight down from height $H$, one pixel of pitch $p$ behind a lens of focal length $f$ covers

$$GSD = \\frac{H\\,p}{f}$$

on the ground. The image footprint is $GSD \\times$ (pixels across). For photogrammetry, consecutive photos need ~70–80% **forward overlap** and adjacent flight lines ~60–70% **side overlap**, so

$$\\text{line spacing} = (1 - \\text{side overlap}) \\times \\text{footprint width}$$

**Motion blur** during exposure $t_e$ at ground speed $v$: blur $= v\\,t_e$; keep it below about one GSD. That links flight speed, shutter speed and lighting — dim evenings force slower flights.` },
      { h: 'Markers, detection and latency', body: `- **Fiducial markers** (ArUco, AprilTag): a camera finds the four corners, and with $K$ known, \`solvePnP\` gives the marker's position and orientation relative to the camera. ArduPilot and PX4 accept this as a precision-landing target (via MAVLink LANDING_TARGET messages).
- **Object detection**: neural networks (YOLO-class models) on a companion computer (Jetson, Raspberry Pi with an accelerator). Throughput (frames per second) and **latency** matter: a 100 ms delay at 5 m/s means the object has moved 0.5 m by the time you react.
- Minimum pixel size: detectors and marker decoders need the target to span a minimum number of pixels; that sets the maximum altitude for a given target size.` },
      { h: 'Where the drone is without GPS: visual odometry and SLAM', body: `**Visual odometry (VO)** tracks features between frames to estimate motion; **visual-inertial odometry (VIO)** fuses this with the IMU for scale and robustness. **SLAM** also builds a map and corrects drift when it recognises a place again (loop closure). Tracking cameras or stereo/depth cameras feed position estimates into the autopilot's EKF as an external navigation source.

**Photogrammetry** (structure-from-motion) is offline: hundreds of overlapping survey images → orthomosaic and 3-D model. Open-source **OpenDroneMap** does this; commercial tools are common in survey companies.` },
    ],
    numericals: [
      { q: 'A drone flies a survey at 50 m with a camera of 4 mm focal length, 2.4 µm pixel pitch and 4000 pixels across. Find the GSD and the footprint width.', steps: ['GSD = H·p/f = 50 × 2.4×10⁻⁶ / 4×10⁻³ = **0.03 m = 3 cm/pixel**.', 'Footprint = 0.03 × 4000 = **120 m**.'], answer: '3 cm/px; 120 m wide', why: 'Agriculture and survey contracts specify GSD; you choose altitude from it.' },
      { q: 'For the same survey with 70% side overlap, what flight-line spacing do you need? Over a 600 m wide field, how many lines?', steps: ['Spacing = (1 − 0.70) × 120 = **36 m**.', 'Lines ≈ 600/36 = 16.7 → **17 lines** (plus one extra for edge coverage in practice).'], answer: '36 m spacing; ~17–18 lines', why: 'Mission planners compute this grid automatically — now you can check it.' },
      { q: 'Flying at 10 m/s with a 1/500 s exposure, how much motion blur is there in metres and in pixels (GSD 3 cm)?', steps: ['Blur = v·t = 10 × 0.002 = **0.02 m**.', 'In pixels = 0.02/0.03 = **0.67 px** (< 1 px, acceptable).'], answer: '2 cm ≈ 0.67 px', why: 'In poor light the shutter slows; then you must slow down or accept blur.' },
      { q: 'A 0.2 m ArUco marker must span at least 20 pixels to be detected reliably. With f_px = f/p = 1667 pixels, what is the maximum detection altitude?', steps: ['Pixels spanned = f_px × size / distance → distance = f_px × size / pixels.', 'd = 1667 × 0.2 / 20 = **16.7 m**.'], answer: '≈ 16.7 m', why: 'For higher approaches, use a bigger marker or nested markers (large + small).' },
    ],
    practice: [
      { book: 'Richard Szeliski — Computer Vision: Algorithms and Applications (free online edition)', where: 'Image formation, feature detection, structure from motion chapters', note: 'Standard reference; free PDF from the author.' },
      { book: 'Hartley & Zisserman — Multiple View Geometry in Computer Vision', where: 'Camera models and calibration', note: 'The maths behind calibration and SfM.' },
      { book: 'Peter Corke — Robotics, Vision and Control', where: 'Image formation and visual servoing chapters', note: 'Python examples tied to robots and drones.' },
    ],
    lab: { title: 'Calibrate a camera and estimate marker pose', kit: ['Webcam or phone camera / Raspberry Pi camera', 'Printed checkerboard and ArUco marker', 'Python + OpenCV (opencv-contrib-python)'], steps: ['Capture ~20 checkerboard images at different angles; run cv2.calibrateCamera; save K and distortion.', 'Print a 10 cm ArUco marker; detect it and run solvePnP to get distance.', 'Compare measured distance with a tape measure at 0.5, 1, 2 m.', 'Stretch: feed the result to SITL as a LANDING_TARGET and try precision landing.'], deliverable: 'Calibration file + a table of true vs estimated distances.' },
    industry: ['OpenCV + camera calibration', 'Survey planning (GSD, overlap)', 'Edge AI on Jetson/RPi', 'Photogrammetry workflow (OpenDroneMap)', 'VIO / external navigation into the EKF'],
    sim: 'survey',
    resources: [
      { kind: 'docs', t: 'OpenCV camera calibration tutorial', by: 'OpenCV docs', url: 'https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html' },
      { kind: 'docs', t: 'Precision landing and loiter', by: 'ArduPilot docs', url: 'https://ardupilot.org/copter/docs/precision-landing-with-irlock.html' },
      { kind: 'tool', t: 'OpenDroneMap (open-source photogrammetry)', by: 'opendronemap.org', url: 'https://www.opendronemap.org/' },
      { kind: 'book', t: 'Computer Vision: Algorithms and Applications', by: 'Richard Szeliski (free online)', url: 'https://szeliski.org/Book/' },
      { kind: 'video', t: 'First Principles of Computer Vision', by: 'YouTube search', yt: 'First Principles of Computer Vision Shree Nayar camera model' },
      { kind: 'video', t: 'ArUco marker pose estimation in Python', by: 'YouTube search', yt: 'ArUco marker pose estimation OpenCV Python' },
    ],
    shorts: ['how camera calibration works', 'drone mapping photogrammetry', 'YOLO object detection drone'],
    reels: [
      { front: 'Ground sample distance', back: 'GSD = H·p/f. 50 m, 2.4 µm, 4 mm → 3 cm/pixel.' },
      { front: 'Focal length in pixels', back: 'f_px = f / pixel pitch (4 mm / 2.4 µm ≈ 1667 px).' },
      { front: 'Motion-blur rule', back: 'v × exposure ≤ ~1 GSD.' },
      { front: 'VO vs SLAM', back: 'VO estimates motion (drifts). SLAM also builds a map and corrects drift with loop closure.' },
    ],
    quiz: [
      { q: 'GSD gets finer (smaller) when you…', o: ['Fly higher', 'Fly lower or use a longer focal length', 'Use bigger pixels', 'Fly faster'], a: 1, e: 'GSD = H·p/f.' },
      { q: 'Camera calibration estimates…', o: ['Battery health', 'Intrinsics (focal lengths, principal point) and lens distortion', 'GPS offset', 'Motor KV'], a: 1, e: 'Those parameters map 3-D rays to pixels.' },
      { q: 'With 70% side overlap and a 100 m footprint, line spacing is…', o: ['70 m', '30 m', '100 m', '170 m'], a: 1, e: '(1 − 0.7) × 100 = 30 m.' },
      { q: 'solvePnP returns…', o: ['Image brightness', 'The pose of a known object relative to the camera', 'Lens focal length', 'GPS coordinates'], a: 1, e: 'Given 3-D model points and their 2-D image positions plus K.' },
      { q: 'A detector has 150 ms latency and the target moves at 4 m/s. Position error from latency alone?', o: ['0.06 m', '0.6 m', '6 m', '0.15 m'], a: 1, e: '4 × 0.15 = 0.6 m — prediction or lower latency is needed.' },
      { q: 'Visual-inertial odometry adds the IMU mainly to…', o: ['Save power', 'Recover metric scale and handle fast motion/blur', 'Increase resolution', 'Encrypt video'], a: 1, e: 'A single camera cannot see scale; the IMU provides it and bridges blurry frames.' },
      { q: 'Photogrammetry produces…', o: ['Live control signals', 'Orthomosaics and 3-D models from overlapping images (offline)', 'RF maps', 'PID gains'], a: 1, e: 'Structure-from-motion runs after the flight.' },
      { q: 'To detect a marker from higher altitude you can…', o: ['Use a smaller marker', 'Use a bigger marker or longer focal length', 'Increase exposure time', 'Lower the frame rate'], a: 1, e: 'More pixels on the target: bigger target or more f_px.' },
    ],
  },
];
