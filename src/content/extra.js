// Extra quiz questions and reel cards per module (batch 1, part 1). Merged in content/index.js.
export const EXTRA = {
  systems: {
    quiz: [
      { q: 'Which interface usually connects the GNSS module to the flight controller?', o: ['SPI', 'UART', 'DShot', 'PWM'], a: 1, e: 'GNSS receivers stream NMEA/UBX messages over a serial UART (compass on the same module uses I²C).' },
      { q: 'Main advantage of a VTOL quadplane over a pure multirotor for survey work?', o: ['Simpler', 'Hovers longer', 'Takes off vertically but cruises efficiently on wings', 'Cheaper motors'], a: 2, e: 'Wings carry the weight in cruise, so endurance is several times higher; the rotors are only used for take-off and landing.' },
      { q: 'Which EEE subject explains why a buck BEC is preferred to a linear regulator?', o: ['Power Electronics', 'Electromagnetics', 'Control Systems', 'Digital Logic'], a: 0, e: 'Switching converters waste far less power than linear regulators that drop (Vin − Vout)·I as heat.' },
      { q: 'A flight controller loses its gyro signal mid-flight. What happens?', o: ['Nothing, GPS takes over', 'The rate loop has no feedback, so the drone becomes uncontrollable', 'It switches to manual automatically and flies fine', 'It climbs'], a: 1, e: 'The gyro feeds the innermost loop; without it the open-loop-unstable airframe diverges within moments.' },
    ],
    reels: [
      { front: 'Energy path in one line', back: 'Battery → PDB → ESC (inverter) → BLDC motor → prop → thrust.' },
      { front: 'Information loop in one line', back: 'Sensors → estimator → controller → mixer → ESCs → airframe moves → sensors.' },
    ],
  },
  physics: {
    quiz: [
      { q: 'Disk loading is defined as…', o: ['Thrust / disk area', 'Mass / prop pitch', 'Power / thrust', 'RPM / diameter'], a: 0, e: 'DL = T/A in N/m². Lower disk loading → lower induced velocity → less hover power.' },
      { q: 'Power for a given prop varies with rpm as…', o: ['n', 'n²', 'n³', 'n⁴'], a: 2, e: 'P = C_P ρ n³ D⁵.' },
      { q: 'Why does a multirotor often use LESS power at moderate forward speed than in hover?', o: ['Less drag', 'The rotor meets more fresh air per second, so induced power drops', 'Motors cool down', 'Battery voltage rises'], a: 1, e: 'Forward speed increases mass flow through the disk, reducing the induced velocity needed for the same thrust.' },
      { q: 'A hot afternoon reduces air density. For the same mass, hover power…', o: ['Falls', 'Rises', 'Is unchanged', 'Becomes zero'], a: 1, e: 'P ∝ 1/√ρ at fixed thrust and disk area.' },
    ],
    reels: [
      { front: 'Units check for T = C_T ρ n² D⁴', back: 'kg/m³ · s⁻² · m⁴ = kg·m/s² = N ✓' },
      { front: 'Figure of merit definition', back: 'FM = P_ideal / P_shaft — how close a real rotor gets to momentum theory.' },
    ],
  },
  dynamics: {
    quiz: [
      { q: 'NED frame axes are…', o: ['North, East, Down', 'North, East, Up', 'Normal, Elevation, Drift', 'Nose, Edge, Depth'], a: 0, e: 'ArduPilot and PX4 use North-East-Down; body frame is forward-right-down.' },
      { q: 'How many numbers does a quaternion use to represent attitude?', o: ['3', '4', '6', '9'], a: 1, e: 'Four (one constrained to unit length). A rotation matrix uses 9, Euler angles 3.' },
      { q: 'Near hover, a small pitch angle θ produces horizontal acceleration of about…', o: ['g·θ', 'g/θ', 'θ²', 'zero'], a: 0, e: 'Linearised: ẍ ≈ −gθ (sign by convention). Tilting the thrust vector is how a multirotor accelerates.' },
      { q: 'If the mixer requests negative thrust from a motor, the firmware must…', o: ['Reverse the motor', 'Clip/shift outputs because props can only push', 'Ignore it', 'Disarm'], a: 1, e: 'Fixed-pitch props on normal ESCs only produce positive thrust, so the mixer saturates at zero and redistributes.' },
    ],
    reels: [
      { front: 'Position control chain', back: 'Position error → velocity setpoint → acceleration → tilt angle → rate → torque.' },
      { front: 'X-quad moment arm', back: 'd = L/√2 (motors sit at 45° to the roll and pitch axes).' },
    ],
  },
  motors: {
    quiz: [
      { q: 'Doubling supply voltage on the same motor and prop (no current limit) will roughly…', o: ['Halve rpm', 'Double no-load rpm and greatly increase power draw', 'Not change anything', 'Halve current'], a: 1, e: 'rpm ≈ KV·V doubles; power ∝ rpm³ so the prop demands far more power — often a burned motor.' },
      { q: 'The no-load current I₀ mainly represents…', o: ['Copper loss', 'Iron (core) and friction losses', 'ESC switching loss', 'Battery IR'], a: 1, e: 'With no load, current only overcomes core losses, bearing friction and windage.' },
      { q: 'A 22 mm-stator motor is labelled "2207". Compared with a "2306", it has…', o: ['Smaller diameter, taller stator', 'Bigger diameter, shorter stator', 'Same size', 'More poles always'], a: 0, e: '22 mm × 7 mm vs 23 mm × 6 mm.' },
      { q: 'Why can magnets be permanently damaged by overheating?', o: ['They melt', 'Above their rated temperature they lose magnetisation irreversibly', 'Copper expands', 'Bearings seize'], a: 1, e: 'Neodymium magnets demagnetise above their grade\'s temperature rating — the motor becomes weaker forever.' },
    ],
    reels: [
      { front: 'Motor power balance', back: 'V·I = I²R + I₀·E + τω (copper + no-load + output).' },
      { front: 'Clarke + Park transforms do what?', back: 'Turn three AC phase currents into two DC-like d–q currents so FOC can use simple PI loops.' },
    ],
  },
  esc: {
    quiz: [
      { q: 'During dead-time, the motor current flows through…', o: ['Nothing', 'The MOSFET body diodes', 'The gate driver', 'The battery balance lead'], a: 1, e: 'Inductive current must keep flowing, so it freewheels through body diodes (lossy, V_F × I).' },
      { q: 'Why do ESCs start motors open-loop?', o: ['To save power', 'At standstill there is no back-EMF to detect rotor position', 'DShot requires it', 'To calibrate throttle'], a: 1, e: 'Back-EMF ∝ speed; it is too small to sense until the rotor is spinning.' },
      { q: 'DShot600 versus DShot300 mainly changes…', o: ['Throttle resolution', 'Bit rate (frame time)', 'Motor KV', 'PWM switching frequency of the MOSFETs'], a: 1, e: 'Both carry 11-bit throttle; the number is the bit rate in kbit/s.' },
      { q: 'Total gate charge Q_g matters because…', o: ['It sets R_DS(on)', 'Higher Q_g needs more drive current and costs switching time and gate power', 'It sets the voltage rating', 'It is irrelevant'], a: 1, e: 'P_gate = Q_g·V_GS·f_sw and switching time ≈ Q_g / I_drive.' },
    ],
    reels: [
      { front: 'Conduction loss', back: 'P = I_rms² · R_DS(on) per conducting FET.' },
      { front: 'Gate drive power', back: 'P = Q_g · V_GS · f_sw (30 nC, 10 V, 48 kHz → 14.4 mW).' },
    ],
  },
  power: {
    quiz: [
      { q: 'A 2200 mAh pack discharged at 44 A is running at…', o: ['10C', '20C', '44C', '2.2C'], a: 1, e: 'C-rate = I / capacity = 44 / 2.2 = 20C.' },
      { q: 'Two identical 4S packs connected in parallel (4S2P) give…', o: ['Double voltage', 'Double capacity, same voltage', 'Half resistance AND double voltage', 'No change'], a: 1, e: 'Parallel adds capacity and halves internal resistance; voltage stays 4S.' },
      { q: 'Why land at about 3.5 V/cell (resting) rather than flying to 3.0 V?', o: ['Rules require it', 'Deep discharge accelerates ageing and under load cells may dip dangerously low', 'GPS stops working', 'ESCs need 3.5 V'], a: 1, e: 'Little usable energy remains below ~3.5 V resting, and deep discharge damages LiPos.' },
      { q: 'What does an FC current sensor let you do?', o: ['Increase thrust', 'Track mAh used for accurate battery failsafe', 'Measure rpm', 'Encrypt telemetry'], a: 1, e: 'Integrating current gives consumed capacity — more reliable than voltage alone because voltage sags under load.' },
    ],
    reels: [
      { front: 'C-rate formula', back: 'C = current (A) / capacity (Ah).' },
      { front: 'Series vs parallel cells', back: 'Series (S) adds voltage. Parallel (P) adds capacity and current capability.' },
    ],
  },
  sensing: {
    quiz: [
      { q: 'A barometer reading jumps when the drone climbs fast near the ground. Most likely cause?', o: ['GPS error', 'Prop wash / pressure disturbance on the sensor', 'Gyro bias', 'Magnetic interference'], a: 1, e: 'Airflow from the props changes local pressure; foam covers and placement help.' },
      { q: 'Soft-iron magnetometer distortion turns the ideal measurement sphere into…', o: ['A shifted sphere', 'An ellipsoid', 'A line', 'A cube'], a: 1, e: 'Hard iron shifts the sphere; soft iron stretches it into an ellipsoid.' },
      { q: 'In the Kalman predict step, covariance P…', o: ['Shrinks', 'Grows by Q', 'Stays constant', 'Becomes zero'], a: 1, e: 'P⁻ = FPFᵀ + Q — prediction adds uncertainty; measurement updates remove it.' },
      { q: 'Gyro sensitivity at ±2000 °/s on 16 bits is about…', o: ['16.4 LSB/(°/s)', '131 LSB/(°/s)', '4096 LSB/(°/s)', '1 LSB/(°/s)'], a: 0, e: '65536 / 4000 = 16.4.' },
    ],
    reels: [
      { front: 'Hard iron vs soft iron', back: 'Hard iron: constant offset. Soft iron: distortion (ellipsoid).' },
      { front: 'Fused variance of two Gaussians', back: 'Smaller than either: σ² = σ₁²σ₂²/(σ₁²+σ₂²). 4 and 1 → 0.8.' },
    ],
  },
  control: {
    quiz: [
      { q: 'Feedforward in a rate controller reacts to…', o: ['Gyro noise', 'Changes in the setpoint (stick movement)', 'Battery voltage', 'GPS'], a: 1, e: 'It adds output proportional to setpoint change so the drone responds before error builds.' },
      { q: 'TPA (throttle PID attenuation) reduces P/D at high throttle because…', o: ['Motors have more authority and the loop gain rises, causing oscillation', 'Batteries sag', 'GPS is slower', 'It saves power'], a: 0, e: 'Thrust ∝ rpm², so the same command change produces more torque at high throttle.' },
      { q: 'Phase margin of a loop is reduced by…', o: ['Lower gain', 'Added delay and filtering', 'Higher sampling rate', 'Integral clamping'], a: 1, e: 'Delays and low-pass filters add phase lag at the crossover frequency.' },
      { q: 'An outer angle loop should be about how fast relative to the inner rate loop?', o: ['10× faster', 'The same', '5–10× slower in bandwidth', 'It does not matter'], a: 2, e: 'Bandwidth separation lets each loop treat the inner one as nearly instantaneous.' },
    ],
    reels: [
      { front: 'Settling time (2%) for 2nd order', back: 't_s ≈ 4 / (ζ ω_n)' },
      { front: 'Iterm relax', back: 'Limits integral build-up during fast stick moves to stop bounce-back.' },
    ],
  },
  firmware: {
    quiz: [
      { q: 'ArduPilot runs on top of which RTOS?', o: ['NuttX', 'ChibiOS', 'FreeRTOS only', 'Linux only'], a: 1, e: 'ArduPilot uses ChibiOS on STM32 boards; PX4 uses NuttX.' },
      { q: 'Why does an IMU have a "data ready" interrupt pin?', o: ['To save power only', 'So the MCU reads each new sample immediately with minimal jitter', 'For DShot', 'For USB'], a: 1, e: 'Interrupt-driven reads keep the control loop synchronised to fresh gyro data.' },
      { q: 'A biquad low-pass compared with a first-order filter at the same cutoff…', o: ['Rolls off faster but adds more delay', 'Has no delay', 'Rolls off slower', 'Amplifies noise'], a: 0, e: 'Second order: −40 dB/decade versus −20, at the cost of more phase lag.' },
      { q: 'HITL differs from SITL in that…', o: ['It uses real flight-controller hardware with simulated sensors', 'It needs real props', 'It runs on a phone', 'It is the same thing'], a: 0, e: 'Hardware-in-the-loop exercises the real board, drivers and timing.' },
    ],
    reels: [
      { front: 'Nyquist frequency', back: 'f_s / 2. Anything above it aliases into the band below.' },
      { front: 'Blade-pass frequency', back: 'blades × rpm / 60 (tri-blade at 30,000 rpm → 1500 Hz).' },
    ],
  },
  rf: {
    quiz: [
      { q: '−90 dBm is how many milliwatts?', o: ['10⁻⁹ mW', '10⁻⁹ W', '0.09 mW', '90 mW'], a: 0, e: '−90 dBm = 10^(−9) mW = 1 pW. Receivers work at these tiny powers.' },
      { q: 'Diversity receivers use two antennas mainly to…', o: ['Double power', 'Pick the better signal when one antenna fades or is blocked', 'Encrypt the link', 'Change frequency'], a: 1, e: 'Two spatially or angularly separated antennas rarely fade together.' },
      { q: 'Lower ELRS packet rates (e.g. 50 Hz vs 500 Hz) give…', o: ['Lower latency', 'Better sensitivity and range', 'Higher power', 'Encryption'], a: 1, e: 'Longer symbols and narrower bandwidth improve sensitivity at the cost of update rate.' },
      { q: 'Quarter-wave monopole length at 2.44 GHz (ignoring velocity factor)?', o: ['3.1 cm', '6.1 cm', '12.3 cm', '1.5 cm'], a: 0, e: 'λ = 3×10⁸/2.44×10⁹ = 12.3 cm; λ/4 ≈ 3.1 cm.' },
    ],
    reels: [
      { front: 'Wavelength formula', back: 'λ = c / f. 2.4 GHz → 12.5 cm, 5.8 GHz → 5.2 cm, 866 MHz → 34.6 cm.' },
      { front: 'Fade margin rule', back: 'Keep 10–20 dB above receiver sensitivity for real-world flying.' },
    ],
  },
  design: {
    quiz: [
      { q: 'Your mass budget grows 15% after assembly. First thing to recheck?', o: ['Paint', 'Hover power, flight time and T/W with the real mass', 'Radio range', 'Firmware version'], a: 1, e: 'Mass growth hits power (∝ m^1.5), endurance and control margin.' },
      { q: 'A drone hovers at 75% throttle. This means…', o: ['Perfect efficiency', 'Too little thrust margin for control and wind', 'Props are too big', 'Battery is too small'], a: 1, e: 'Only 25% headroom remains; aim for 40–60% on utility drones.' },
      { q: 'Why hold the GPS on a mast?', o: ['Looks better', 'Distance from power wires and ESCs reduces compass interference and improves sky view', 'Lower drag', 'Needed for DShot'], a: 1, e: 'Magnetic fields from high-current wires corrupt the compass; height also improves satellite visibility.' },
      { q: 'String test for CG means…', o: ['Measuring prop size', 'Lifting the drone by its centre to see if it hangs level', 'Testing wire continuity', 'Checking arm stiffness'], a: 1, e: 'If it tilts, the CG is off the motor centroid and the mixer wastes thrust compensating.' },
    ],
    reels: [
      { front: 'T/W rule of thumb', back: '≥2 for camera/utility drones, 8–12 for freestyle FPV.' },
      { front: 'Hover throttle target', back: '~40–60% for utility drones, ~20–30% for freestyle.' },
    ],
  },
  autonomy: {
    quiz: [
      { q: 'RTL in ArduPilot does what?', o: ['Records the track log', 'Returns to launch and lands (by default)', 'Resets telemetry link', 'Raises throttle limit'], a: 1, e: 'Return To Launch: climb to a safe altitude, fly home, descend.' },
      { q: 'Which library gives a simple Python API for arming, take-off and missions over MAVLink?', o: ['OpenCV', 'MAVSDK', 'NumPy', 'Flask'], a: 1, e: 'MAVSDK wraps MAVLink in a high-level API (pymavlink is the lower-level option).' },
      { q: 'Under Drone Rules 2021, a nano drone is…', o: ['≤ 250 g', '≤ 2 kg', '≤ 500 g', '≤ 25 kg'], a: 0, e: 'Nano: up to 250 g. Micro: above 250 g up to 2 kg.' },
      { q: 'ArUco markers are commonly used on drones for…', o: ['Radio pairing', 'Precision landing and pose estimation with a camera', 'Battery balancing', 'Motor timing'], a: 1, e: 'A camera detects the marker\'s corners and computes its relative position.' },
    ],
    reels: [
      { front: 'Guided mode', back: 'A companion computer sends position/velocity targets over MAVLink.' },
      { front: 'Pre-flight in 5 words', back: 'Props, pack, GPS, failsafes, area.' },
    ],
  },
};
