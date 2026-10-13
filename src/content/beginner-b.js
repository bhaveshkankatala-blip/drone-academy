// Beginner layer, part B (same shape as beginner-a.js).

export const BEGINNER_B = {
  mcu: {
    why: 'Every board on a drone (flight controller, ESC, GPS, receiver) is run by a microcontroller. Programming one is a core industry skill.',
    bridge: [
      { subject: 'Analog Electronics', text: 'Inside, a microcontroller is millions of MOSFET switches. Its pins drive LEDs and gates exactly like a transistor stage.' },
      { subject: 'EMI', text: 'The ADC (analog-to-digital converter) is a built-in voltmeter. Its resolution and accuracy are EMI concepts.' },
      { subject: 'Electrical Circuits', text: 'Pull-up resistors, voltage dividers into ADC pins, and RC filters on inputs are plain circuit analysis.' },
    ],
    simple: [
      { h: 'A tiny computer with built-in helpers', body: `A **microcontroller (MCU)** is a whole small computer on one chip: a processor, memory, and **peripherals**. Peripherals are hardware helpers that do jobs by themselves so the processor does not have to:

- **GPIO pins:** switch things on/off, read buttons.
- **Timers:** count time precisely; they make the PWM signals for motors.
- **ADC:** measures a voltage (e.g. battery voltage) and turns it into a number.
- **Serial ports (UART, I²C, SPI):** talk to other chips such as the GPS, the gyroscope or the radio receiver.

The drone's flight controller usually uses an **STM32** microcontroller. Arduino boards use simpler AVR chips; ESP32 adds Wi-Fi.` },
      { h: 'Interrupts: "tap me on the shoulder"', body: `Instead of checking a sensor again and again ("is the data ready? is it ready now?"), the processor can ask the sensor to **interrupt** it when data arrives. It stops what it is doing, handles the data quickly, and goes back.

That is how a flight controller can read a gyroscope 8000 times per second and still have time for everything else.` },
      { h: 'Three ways chips talk', body: `| Bus | Wires | Speed | Used on a drone for |
|---|---|---|---|
| UART | 2 (TX, RX) | slow–medium | GPS, radio receiver, telemetry |
| I²C | 2 (SDA, SCL), many devices share | slow | compass, barometer |
| SPI | 4, fast | fast | gyroscope/accelerometer, flash memory |

You do not need the details yet; just remember **SPI = fast sensors, UART = GPS and radio**.` },
      { h: 'How you program it', body: `You write C or C++ on your laptop, compile it, and **flash** it to the chip over USB or a debugger (ST-Link). Start with **Arduino** (easiest), then move to **STM32 with STM32CubeIDE**, the tool industry uses. Flight firmware like Betaflight and ArduPilot is huge C/C++ code running on these same chips.` },
    ],
    check: [
      { q: 'Which peripheral generates the PWM signal for a motor?', o: ['ADC', 'Timer', 'UART', 'GPIO input'], a: 1, e: 'Hardware timers produce precise PWM without the processor toggling pins itself.' },
      { q: 'A fast gyroscope chip is usually connected over:', o: ['UART', 'SPI', 'Bluetooth', 'USB'], a: 1, e: 'SPI is the fast bus used for IMUs and flash memory.' },
    ],
    starters: [
      { q: 'A 12-bit ADC with a 3.3 V reference reads the value 2048. What voltage is on the pin?', steps: [
        { s: 'A 12-bit ADC has 2¹² = 4096 steps (0 to 4095).', why: 'n bits give 2ⁿ possible numbers.' },
        { s: 'Voltage per step = 3.3 / 4096 ≈ 0.000806 V (0.806 mV).', why: 'The reference voltage is split into equal steps; this is the ADC resolution.' },
        { s: 'V = 2048 × 0.000806 ≈ 1.65 V.', why: 'Reading × step size = voltage. 2048 is half-scale, so half of 3.3 V.' },
      ], answer: '≈ 1.65 V' },
      { q: 'A battery up to 16.8 V must be read by a 3.3 V ADC. Choose a divider: R1 (top) = 10 kΩ. What R2 (bottom) keeps the pin at or below 3.3 V?', steps: [
        { s: 'Divider: $V_{out} = V_{in} \\times R2/(R1+R2)$.', why: 'The standard potential divider from Circuits/EMI.' },
        { s: 'Need $R2/(R1+R2) \\le 3.3/16.8 = 0.196$.', why: 'Worst case is a full battery.' },
        { s: 'Solve: $R2 \\le 0.196 \\times (10k + R2)$ → $0.804 R2 \\le 1.96k$ → $R2 \\le 2.44$ kΩ. Pick a standard **2.2 kΩ**.', why: 'Choose the next smaller standard value for a safety margin.' },
        { s: 'Check: 16.8 × 2.2/12.2 = 3.03 V. Safe.', why: 'Always verify the final choice.' },
      ], answer: 'R2 = 2.2 kΩ (pin sees ≈ 3.03 V at 16.8 V)' },
    ],
    videos: [
      { id: 't68MG-kVDCU', t: '[Fully Explained] What is a Microcontroller and how does it work?', by: 'RootSaid', role: 'first', note: 'What is inside the chip and what each part does.' },
      { id: 'q0V3tuf7Az4', t: 'I2C, SPI and UART Explained: Communication Protocols for Beginners', by: 'RootSaid', role: 'deeper', note: 'The three buses every drone uses.' },
    ],
  },

  sensing: {
    why: 'A drone can only control what it can measure. Bad sensing means a drone that drifts, wobbles or crashes.',
    bridge: [
      { subject: 'EMI', text: 'Sensors have offset (bias), noise, sensitivity and calibration, exactly the error types from EMI.' },
      { subject: 'EMI', text: 'MEMS accelerometers are tiny capacitive transducers; capacitive sensing is an EMI topic.' },
      { subject: 'Electrical Circuits', text: 'An RC low-pass filter smooths noisy signals. The complementary filter is the same idea done in software.' },
    ],
    simple: [
      { h: 'The drone\'s senses', body: `- **Gyroscope:** how fast the drone is **rotating** (degrees per second). Very fast and smooth, but it slowly drifts.
- **Accelerometer:** which way is **down** (it feels gravity). Correct on average, but very shaky because of vibration.
- **Magnetometer (compass):** which way is **north**. Easily disturbed by the battery wires' current.
- **Barometer:** air pressure, which tells the **height**. Affected by wind and propeller airflow.
- **GPS:** **position** to about 1–3 m, a few times per second.

The gyroscope and accelerometer together are called an **IMU**, a chip about the size of a grain of rice (MEMS).` },
      { h: 'No sensor is good enough alone', body: `The gyroscope is smooth but drifts: add up its readings for a minute and the angle wanders off. The accelerometer never drifts but is noisy.

So combine them: **trust the gyroscope for quick changes, and slowly pull the answer toward the accelerometer** to cancel drift. That is the **complementary filter**:

$$\\text{angle} = 0.98 \\times (\\text{angle} + \\text{gyro} \\times \\Delta t) + 0.02 \\times \\text{accel angle}$$

It is like walking with your eyes almost closed (gyro) and peeking now and then (accelerometer) to stay on the path.` },
      { h: 'The Kalman filter, in one idea', body: `A Kalman filter is a smarter way to blend sensors. It keeps track of **how sure it is** about each guess. When a sensor is noisy, it trusts it less; when its own prediction is uncertain, it trusts the sensor more. ArduPilot and PX4 use an advanced version (the **EKF**) to combine IMU, GPS, compass and barometer.

You do not need the maths yet; the Engineer view introduces it gently.` },
      { h: 'Calibration', body: `Every sensor has small built-in errors. **Calibration** measures them so the software can subtract them. Examples: keep the drone still to measure gyro bias; rotate it in all directions to calibrate the compass. Same idea as zeroing a meter in your EMI lab.` },
    ],
    check: [
      { q: 'Which sensor is smooth but drifts over time?', o: ['Accelerometer', 'Gyroscope', 'GPS', 'Barometer'], a: 1, e: 'Integrating gyro rate gives angle, and tiny biases add up into drift.' },
      { q: 'The complementary filter combines:', o: ['GPS and radio', 'Gyroscope (short-term) and accelerometer (long-term)', 'Two batteries', 'Motor speed and current'], a: 1, e: 'Gyro for fast changes, accelerometer to remove drift.' },
    ],
    starters: [
      { q: 'A gyroscope has a constant bias of 0.5 °/s. If you integrate it for 60 s with the drone still, how far off is the angle?', steps: [
        { s: 'Angle = rate × time.', why: 'Integrating a constant rate is just multiplication.' },
        { s: 'Error = 0.5 °/s × 60 s = 30°.', why: 'A small bias becomes a big angle error over time; this is drift.' },
      ], answer: '30° of drift. This is why the accelerometer correction is needed.' },
      { q: 'An accelerometer at rest reads 0.5 g along the drone\'s forward axis and 0.866 g straight down its body. What is the pitch angle?', steps: [
        { s: 'At rest, the accelerometer sees only gravity, split between the two axes.', why: 'Tilting the sensor shares the 1 g of gravity between its axes.' },
        { s: 'tan(θ) = 0.5 / 0.866 = 0.577.', why: 'The two components form a right triangle with 1 g as the hypotenuse.' },
        { s: 'θ = atan(0.577) = 30°.', why: 'Inverse tangent gives the angle.' },
      ], answer: '30° pitch' },
    ],
    videos: [
      { id: 'DCQnBNebh_k', t: 'How Does a MEMS IMU Work?', by: 'GuideNav', role: 'first', note: 'What is inside the gyroscope/accelerometer chip.' },
      { id: 'BUW2OdAtzBw', t: 'Complementary Filter: Sensor Fusion #2 (Phil\'s Lab #34)', by: 'Phil\'s Lab', role: 'deeper', note: 'The complementary filter from an engineer, with real code.' },
      { id: 'mwn8xhgNpFY', t: 'Why Use Kalman Filters? | Understanding Kalman Filters, Part 1', by: 'MATLAB', role: 'extra', note: 'Gentle introduction to the Kalman filter idea.' },
    ],
  },

  dynamics: {
    why: 'Describes how motor thrusts turn into movement. Needed for simulation and control, but heavier maths. Skim it now and return after Control.',
    bridge: [
      { subject: 'Engineering Mechanics (1st year)', text: 'F = ma for movement and τ = Iα for rotation are all this module uses, applied in 3-D.' },
      { subject: 'Maths (1st year)', text: 'Matrices: the "mixer matrix" is a 4×4 matrix multiplying four motor thrusts.' },
    ],
    simple: [
      { h: 'Three ways to rotate', body: `A drone can rotate in three ways:

- **Roll:** tilt left/right (like a plane dipping a wing).
- **Pitch:** tilt nose up/down.
- **Yaw:** spin flat like a turntable.

Plus it can go **up/down** with more or less total thrust. Four motors, four things to control. That match is why a quadcopter works.` },
      { h: 'How four motors do it', body: `Number the motors around the frame. Two spin clockwise, two counter-clockwise.

- **Up:** all four faster.
- **Roll right:** left motors faster, right motors slower.
- **Pitch forward:** back motors faster, front slower.
- **Yaw:** clockwise pair faster, counter-clockwise pair slower. The leftover twisting reaction turns the body.

The **mixer** is the rule (a table, or a matrix) that turns "I want this much up, roll, pitch, yaw" into four motor speeds.` },
      { h: 'Tilting is how it moves sideways', body: `A quad has no sideways propeller. To go forward, it **tilts** forward. Part of the thrust now points backward-down, pushing it forward. More tilt = more acceleration, but less upward thrust, so the motors must speed up to stay level in height.` },
      { h: 'Why this module is optional for now', body: `The Engineer version uses rotation matrices and vector equations, usually 2nd–3rd year maths. Read the Simple part, play with the **mixer simulator**, and come back to the derivations after Control Systems.` },
    ],
    check: [
      { q: 'To yaw (spin flat), a quadcopter:', o: ['Tilts forward', 'Speeds up one spin-direction pair and slows the other', 'Uses a tail rotor', 'Turns off two motors'], a: 1, e: 'Unequal reaction torque between the CW and CCW pairs rotates the body.' },
      { q: 'How does a quad move forward?', o: ['A rear propeller pushes it', 'It tilts so part of the thrust points backward', 'It cannot', 'By yawing'], a: 1, e: 'Tilting the thrust vector creates a horizontal force component.' },
    ],
    starters: [
      { q: 'A 1 kg quad tilts 10° forward and keeps its height. Approximately what total thrust is needed, and what forward force results?', steps: [
        { s: 'Weight = 1 × 9.81 = 9.81 N.', why: 'W = mg.' },
        { s: 'Vertical part of thrust must equal weight: T·cos10° = 9.81 → T = 9.81/0.985 ≈ 9.96 N.', why: 'Only the vertical component holds it up.' },
        { s: 'Forward part: T·sin10° = 9.96 × 0.174 ≈ 1.73 N.', why: 'The horizontal component accelerates the drone.' },
      ], answer: 'T ≈ 9.96 N; forward force ≈ 1.73 N (≈ 1.73 m/s² for 1 kg)' },
      { q: 'At hover, each of four motors makes 2.5 N. To roll, the flight controller adds 0.2 N to the two left motors and removes 0.2 N from the two right ones. Does the total thrust change?', steps: [
        { s: 'Before: 4 × 2.5 = 10 N.', why: 'Sum of all motors.' },
        { s: 'After: 2 × 2.7 + 2 × 2.3 = 5.4 + 4.6 = 10 N.', why: 'Adding and removing equal amounts keeps the sum constant.' },
      ], answer: 'No: still 10 N, so the drone rolls without climbing or sinking. This is what the mixer is designed to do.' },
    ],
    videos: [
      { list: 'PLn8PRpmsu08oOLBVYYIwwN_nvuyUqEjrj', t: 'Drone Simulation and Control (playlist): Parts 1–2', by: 'MATLAB (Brian Douglas)', role: 'first', note: 'Shows how motor speed changes create roll, pitch and yaw.' },
      { id: 'OPNVF9EuHaw', t: '3 Parameterizations of Rotation: Euler Angles, Axis-angle, and Roll Pitch Yaw', by: 'Aaron Becker', role: 'deeper', note: 'University lecture on describing 3-D rotations. Watch after the Engineer read.' },
    ],
  },

  control: {
    why: 'Control is what makes a drone fly steadily. PID tuning is one of the most asked-about skills in drone interviews.',
    bridge: [
      { subject: 'EMI', text: 'A moving-coil meter needle settling (damping, overshoot) shows the same behaviour as a tuned control loop.' },
      { subject: 'Electrical Circuits', text: 'An RLC circuit\'s step response (underdamped, overdamped) is exactly how a P/PD-controlled drone responds.' },
      { subject: 'Electrical Machines', text: 'Speed control of a DC motor with feedback is the simplest version of this module.' },
    ],
    simple: [
      { h: 'Feedback, like a car\'s cruise control', body: `Cruise control keeps a car at 80 km/h. It measures speed, compares it with 80, and presses the accelerator more or less. That loop **measure → compare → correct** is **feedback control**.

On a drone: the target is "level" (or "tilt 10°"); the gyroscope measures the actual angle and rate; the controller changes motor speeds to close the gap.` },
      { h: 'P, I and D in plain words', body: `The gap between target and actual is the **error**. A **PID** controller adds three reactions:

- **P (proportional):** push in proportion to the error now. Big error → big push. Too much P causes shaking (oscillation).
- **I (integral):** if a small error persists (e.g. a heavier battery on one side), slowly add more push until it is gone.
- **D (derivative):** watch how fast the error is changing and brake early, like easing off the accelerator before reaching the target speed. Reduces overshoot, but amplifies noise.

$$\\text{output} = K_P\\, e + K_I \\int e\\, dt + K_D \\frac{de}{dt}$$` },
      { h: 'Two loops inside each other', body: `Drones use **cascaded** control:
- **Outer loop (angle):** "I want 10° tilt. I'm at 5°, so rotate at 50 °/s."
- **Inner loop (rate):** "I want 50 °/s. I'm at 30 °/s, so adjust the motors."

The inner loop runs very fast (1–8 kHz) and the outer one slower. Most FPV pilots only use the inner rate loop.` },
      { h: 'Tuning', body: `Tuning means choosing the three gains. A practical recipe: start with low gains; raise **P** until it gets a bit bouncy, then back off; add **D** to calm the overshoot; add a little **I** to remove slow drift. The **PID simulator** in this module lets you try it safely.` },
    ],
    check: [
      { q: 'Which PID term removes a small error that persists, e.g. from an off-centre battery?', o: ['P', 'I', 'D', 'None'], a: 1, e: 'The integral keeps growing while the error stays, so it eventually cancels it.' },
      { q: 'What usually happens if P is set much too high?', o: ['The drone is sluggish', 'The drone oscillates/shakes', 'Battery lasts longer', 'GPS improves'], a: 1, e: 'Too much proportional gain overcorrects, causing oscillation.' },
    ],
    starters: [
      { q: 'A P controller has Kp = 0.8. The target roll rate is 100 °/s and the gyro measures 70 °/s. What is the controller output (in "°/s units")?', steps: [
        { s: 'Error = target − measured = 100 − 70 = 30 °/s.', why: 'Error is always target minus actual.' },
        { s: 'Output = Kp × error = 0.8 × 30 = 24.', why: 'P control scales the error.' },
      ], answer: '24 (the mixer turns this into motor speed changes)' },
      { q: 'An error is 2° and stays constant for 3 s. With Ki = 0.5 per second, how much has the I-term built up?', steps: [
        { s: 'Integral of a constant = value × time = 2 × 3 = 6 degree-seconds.', why: 'The integral is the area under the error curve.' },
        { s: 'I-term = Ki × 6 = 0.5 × 6 = 3.', why: 'Multiply by the integral gain.' },
      ], answer: 'I-term = 3, and it keeps growing while the error remains' },
    ],
    videos: [
      { id: 'wkfEZmsQqiA', t: 'What Is PID Control? | Understanding PID Control, Part 1', by: 'MATLAB (Brian Douglas)', role: 'first', note: 'The clearest beginner explanation of PID.' },
      { list: 'PLn8PRpmsu08pQBgjxYFXSsODEF3Jqmm-y', t: 'Understanding PID Control (full playlist)', by: 'MATLAB (Brian Douglas)', role: 'deeper', note: 'Continue with parts 2–7 after the Engineer read: anti-windup, filtering, tuning.' },
    ],
  },

  firmware: {
    why: 'Firmware is the software that flies the drone. Knowing which one to use and how to read its logs saves weeks on the project.',
    bridge: [
      { subject: 'Electrical Circuits', text: 'An RC low-pass filter and its cutoff frequency, f = 1/(2πRC), is exactly the digital filter idea used on gyro data.' },
      { subject: 'EMI', text: 'Sampling a signal and instrument bandwidth: why a meter cannot follow very fast signals.' },
    ],
    simple: [
      { h: 'Three main firmware choices', body: `| Firmware | Best for | Feel |
|---|---|---|
| **Betaflight** | FPV racing/freestyle | Very fast and crisp; manual flying only |
| **ArduPilot** | Projects, survey, autonomy | GPS missions, many vehicle types, huge documentation |
| **PX4** | Research, companies, ROS | Clean architecture, popular in industry and universities |

For a college project with GPS or missions, **ArduPilot** is usually the easiest start.` },
      { h: 'Vibration is the enemy', body: `Motors and props shake the frame hundreds of times per second. The gyroscope feels that shaking and the controller might react to it, making motors hot and flight twitchy.

So firmware **filters** the gyro data: it removes the fast shaking while keeping the slow real movement, like ignoring a passenger tapping the dashboard while still noticing the car turning.` },
      { h: 'Sampling and aliasing', body: `The flight controller **samples** the gyro thousands of times per second. If vibration is faster than half the sampling rate, it shows up disguised as a slow fake wobble. This is **aliasing**, like a car wheel in a film that seems to spin backwards. The fix: sample fast enough and filter before sampling.` },
      { h: 'Simulation before flying', body: `**SITL** (Software In The Loop) runs the real flight firmware on your laptop with a simulated drone. You can practise missions, failsafes and settings with zero risk. Always do this before the first real flight.` },
    ],
    check: [
      { q: 'Which firmware is usually best for a GPS mission project?', o: ['Betaflight', 'ArduPilot (or PX4)', 'Windows', 'BLHeli'], a: 1, e: 'ArduPilot and PX4 support GPS navigation and missions; Betaflight targets manual FPV flight.' },
      { q: 'Aliasing means:', o: ['The battery is old', 'Fast vibration appears as a slow fake signal because of sampling', 'Motors spinning backwards', 'Radio interference'], a: 1, e: 'Signals above half the sample rate fold down to lower frequencies.' },
    ],
    starters: [
      { q: 'The gyro is sampled at 8 kHz. What is the highest frequency it can represent correctly (the Nyquist frequency)?', steps: [
        { s: 'Nyquist frequency = sample rate / 2.', why: 'You need at least two samples per cycle to capture a wave.' },
        { s: '= 8000 / 2 = 4000 Hz.', why: 'Anything above this aliases.' },
      ], answer: '4 kHz' },
      { q: 'An RC low-pass filter has R = 1 kΩ and C = 1 µF. What is its cutoff frequency?', steps: [
        { s: '$f_c = \\frac{1}{2\\pi RC}$.', why: 'Standard first-order RC filter from Circuits.' },
        { s: '$RC = 1000 \\times 10^{-6} = 0.001$ s.', why: 'Multiply in SI units.' },
        { s: '$f_c = 1 / (2\\pi \\times 0.001) ≈ 159$ Hz.', why: 'Signals well below 159 Hz pass; well above are reduced.' },
      ], answer: '≈ 159 Hz' },
    ],
    videos: [
      { id: 'QbkSZ9sevKQ', t: 'Is Betaflight really the best? ArduPilot, INAV, Betaflight and EmuFlight comparison', by: 'FPV University', role: 'first', note: 'Practical comparison of the firmware options.' },
      { id: 'QJuSd1hhBws', t: 'Visualizing Aliasing and the Shannon Nyquist Sampling Theorem', by: 'Nick Space Cowboy', role: 'deeper', note: 'See aliasing happen. Makes the gyro-filter section click.' },
    ],
  },

  rf: {
    why: 'Radio links carry your control commands, telemetry and video. Losing the link is a leading cause of lost drones.',
    bridge: [
      { subject: 'EMI', text: 'Decibels and logarithmic scales are used in instrumentation; dB here is the same idea for power ratios.' },
      { subject: 'Electrical Circuits', text: 'Impedance matching (50 Ω antennas and cables) is maximum power transfer, the theorem from Circuits.' },
    ],
    simple: [
      { h: 'Three radio links on a drone', body: `1. **Control (RC):** your transmitter → drone. Small data, must never drop (e.g. ExpressLRS).
2. **Telemetry:** drone ↔ laptop/phone. Battery, GPS position, mode (MAVLink).
3. **Video:** drone camera → your goggles or screen. Lots of data.` },
      { h: 'Decibels without fear', body: `Radio power varies enormously, so engineers use a **log scale**, the decibel:

- **+3 dB** = double the power. **−3 dB** = half.
- **+10 dB** = 10× the power. **−10 dB** = one-tenth.
- **dBm** means "dB compared with 1 milliwatt": 0 dBm = 1 mW, 20 dBm = 100 mW, 30 dBm = 1 W.

Why bother? Because now you can **add and subtract** instead of multiplying: transmitter power + antenna gains − losses = received power.` },
      { h: 'Why signals get weaker with distance', body: `A radio wave spreads out like light from a bulb. **Double the distance → one quarter of the power** (−6 dB). Walls, trees and your own body absorb more. The link works as long as the received power stays above the receiver's **sensitivity** (the weakest signal it can decode). The spare is called **link margin**.` },
      { h: 'Antennas', body: `An antenna turns electrical signals into radio waves and back. Rules of thumb:
- Keep antennas **away from carbon fibre and metal**, and pointing in compatible directions.
- **Polarisation** must match (both vertical, or both circular of the same hand), or you lose a lot of signal.
- In India, use licence-exempt bands (2.4 GHz, 5.8 GHz, 865–867 MHz) within allowed power.` },
    ],
    check: [
      { q: '+3 dB means the power is:', o: ['3× bigger', 'doubled', 'halved', 'unchanged'], a: 1, e: '10·log10(2) ≈ 3 dB.' },
      { q: 'If you double the distance in free space, received power:', o: ['halves', 'drops to one quarter (−6 dB)', 'stays the same', 'doubles'], a: 1, e: 'Free-space loss follows the inverse-square law.' },
    ],
    starters: [
      { q: 'Convert 100 mW to dBm, and 27 dBm to mW.', steps: [
        { s: 'dBm = 10·log10(P / 1 mW) = 10·log10(100) = 10 × 2 = 20 dBm.', why: 'Definition of dBm.' },
        { s: '27 dBm: 20 dBm (100 mW) + 7 dB. 7 dB ≈ 5× (10^0.7 = 5.01). So ≈ 500 mW.', why: 'Split into easy parts: 10 dB steps and the remainder.' },
      ], answer: '100 mW = 20 dBm; 27 dBm ≈ 500 mW' },
      { q: 'A transmitter sends 20 dBm with 2 dBi antennas on both ends. Path loss is 110 dB. What reaches the receiver, and is it above a −105 dBm sensitivity?', steps: [
        { s: 'Received = 20 + 2 + 2 − 110 = −86 dBm.', why: 'In dB, gains add and losses subtract.' },
        { s: 'Margin = −86 − (−105) = 19 dB.', why: 'Margin = received − sensitivity.' },
      ], answer: '−86 dBm; 19 dB margin, a healthy link' },
    ],
    videos: [
      { id: 'jOVa4xJSLiA', t: 'What is a dB? RF and Cable Basics', by: 'The Volpe Firm', role: 'first', note: 'Decibels from scratch.' },
      { id: 'ZaXm6wau-jc', t: 'How does an Antenna work? | ICT #4', by: 'Sabin Civil Engineering', role: 'first', note: 'Animated explanation of how antennas radiate.' },
    ],
  },
};
