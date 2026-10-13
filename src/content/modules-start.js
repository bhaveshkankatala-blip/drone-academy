// Module 0 / "Start here": bridges the 3rd-semester EEE subjects (Electrical Circuits, EMI,
// Electrical Machines, Analog Electronics) to the drone. Every numerical here uses only those subjects.

export const moduleStart = {
  id: 'start',
  title: 'Start Here: Your Subjects Inside a Drone',
  tag: 'Bridge',
  eee: 'Uses only Electrical Circuits, EMI, Electrical Machines and Analog Electronics',
  color: '#a3e635',
  mins: 50,
  summary: 'You already know more drone engineering than you think. This module shows where your current subjects (Circuits, EMI, Machines, Analog Electronics) appear inside a drone, and how to use this app.',
  outcomes: [
    'Point to the battery, motors, ESCs and flight controller on a drone and say which of your current subjects explains each one.',
    'Use Ohm\'s law and P = VI to estimate battery current, voltage drop and wire loss on a drone.',
    'Explain a brushless motor as "a DC motor whose brushes were replaced by electronics".',
    'Explain PWM: switching fast between 0 and V gives an average of D × V.',
    'Convert between grams, gram-force and newtons, and between rpm and rad/s, without hesitating.',
  ],
  sections: [
    { h: 'How to use this app (read this first)', body: `Every module has two reading levels. Use them in this order:

1. **Simple**: plain language and everyday examples, no derivations. Read this first.
2. **Engineer**: the full version with equations. Read it after the Simple version feels easy.

Then follow the **Study path** card at the top of each module: read → watch the named video → answer two quick questions → read the Engineer version → work through the starter examples → solve numericals with hints → take the quiz.

Words with a dotted underline, such as ESC, are **jargon**. Tap them for a two-line explanation.

> You do not need control systems, signals or EM waves yet. When a module needs them, its Simple view explains the idea from zero.` },
    { h: 'Electrical Circuits → battery, wires and power', body: `A drone is a DC circuit with a big load. Three things from your circuits course do most of the work.

**1. A battery is an EMF with an internal resistance** (its Thevenin model). A 4-cell LiPo might be 16.8 V when full with about 20 mΩ inside. At 40 A:

$$V_{terminal} = E - I R_{int} = 16.8 - 40 \\times 0.020 = 16.0\\ \\text{V}$$

That 0.8 V drop is called **voltage sag**. It is why a drone feels weaker on a tired battery.

**2. Power is P = VI.** Hovering a 1.5 kg drone takes roughly 250–350 W. At 15 V that is about 20 A, which is why the wires are thick.

**3. Wires waste I²R.** Two 10 cm leads of 12 AWG copper total about 1 mΩ. At 40 A that is $40^2 \\times 0.001 = 1.6$ W, turned straight into heat.

You already solve these circuits in class. On a drone the numbers are just bigger (tens of amps).` },
    { h: 'Electrical Machines → the motor', body: `Remember the DC machine: **back EMF $E = k\\omega$** and **torque $T = kI$**. A drone's brushless motor follows exactly the same two laws.

The difference is commutation. A brushed DC motor uses carbon brushes to switch current between coils as it turns. A **brushless (BLDC)** motor has no brushes. An electronic circuit, the **ESC**, switches the current at the right moment instead.

- Spin faster → more back EMF → less current flows for the same supply voltage.
- Load it harder (a bigger propeller) → it slows down → back EMF falls → more current flows → more torque.

**KV** is just $1/k$ written in rpm per volt. A 920 KV motor on 14.8 V would spin at about 920 × 14.8 ≈ 13,600 rpm with no propeller.

> Your Machines course is the deepest part of drone propulsion. Module "Brushless Motors" builds directly on it.` },
    { h: 'Analog Electronics → the ESC and the switches', body: `An **ESC** (electronic speed controller) is **six transistor switches** (MOSFETs) plus a tiny microcontroller. Your Analog Electronics course teaches the transistor; here it is used purely as an **on/off switch**.

**PWM** (pulse-width modulation): switch the supply on and off very fast, tens of thousands of times a second. If it is on for a fraction **D** (the duty cycle) of each period, the motor sees an average voltage of:

$$V_{avg} = D \\times V_{supply}$$

So 25% duty on a 16 V battery behaves like about 4 V. That is how the ESC controls motor speed without wasting power in a resistor.

Op-amps from the same course show up in **current sensing**: they amplify the tiny voltage across a shunt resistor.` },
    { h: 'EMI → measuring the drone', body: `Electrical Measurements and Instrumentation is how you **test** a drone:

| What you measure | How | EMI idea |
|---|---|---|
| Battery voltage | Voltage divider into a microcontroller ADC | Potential divider, loading |
| Current | Shunt resistor (e.g. 0.25 mΩ) + amplifier, or a Hall sensor | Ammeter shunts |
| Motor speed | Optical tachometer, or the ESC's own report | Speed measurement |
| Thrust | Load cell + amplifier (HX711) under a test stand | Strain gauges, bridges |
| Errors | Calibrate against a trusted meter | Accuracy, precision, calibration |

The drone's own sensors (gyroscope, accelerometer) are measurement instruments too. Their "bias" and "noise" are the same errors you meet in EMI.` },
    { h: 'The only maths you need right now', body: `- **Mass vs force.** Hobby thrust tables give **grams** (really gram-force). 1 gf = 0.00981 N, so 1000 gf ≈ 9.81 N.
- **rpm to rad/s.** Multiply by $2\\pi/60$ ≈ 0.1047. So 10,000 rpm ≈ 1047 rad/s.
- **Square law.** Propeller thrust grows with **speed squared**. Double the rpm → 4× the thrust.
- **mAh to energy.** Energy (Wh) = voltage × capacity (Ah). For 14.8 V × 5 Ah = 74 Wh.
- **Percent and ratios.** Efficiency = output ÷ input. Thrust-to-weight = max thrust ÷ weight.

That is all. Calculus appears only in Engineer sections, and you can skip derivations on a first read.` },
    { h: 'What you haven\'t studied yet (and why that\'s fine)', body: `Some modules use subjects from later semesters:

- **Control Systems** (PID, stability): Simple mode explains it with a car's cruise control.
- **Signals & Systems** (filters, sampling): explained with "averaging out shaky readings".
- **EM Fields / Communication** (antennas, dB): explained with sound volume and torches.
- **Microprocessors** (STM32, timers): explained as "a tiny computer with built-in helpers".

Recommended order: Start Here → System → **Batteries → Motors → ESCs** (all from your current subjects) → Flight physics → the rest.` },
  ],
  numericals: [
    { q: 'A 4S LiPo reads 16.4 V with no load. When the drone hovers, it draws 25 A and the terminal voltage drops to 15.9 V. Find the battery\'s internal resistance.', steps: ['Drop = 16.4 − 15.9 = 0.5 V.', 'This drop is caused by current through the internal resistance: $\\Delta V = I R$.', '$R = 0.5 / 25 = 0.020\\ \\Omega$ = **20 mΩ**.'], answer: '20 mΩ', why: 'Internal resistance is the single number that tells you how tired a pack is; it rises with age and cold.' },
    { q: 'An ESC drives a motor from a 16 V battery at 40% PWM duty cycle. What average voltage does the motor see?', steps: ['$V_{avg} = D \\times V$.', '= 0.40 × 16 = **6.4 V**.'], answer: '6.4 V', why: 'This is how every ESC controls speed: the switches are either fully on or fully off, so they waste very little power.' },
    { q: 'A drone hovers at 300 W from a 14.8 V battery. Find the current and the power lost in 2 mΩ of total wiring.', steps: ['$I = P / V = 300 / 14.8 = 20.3$ A.', '$P_{loss} = I^2 R = 20.3^2 \\times 0.002 = 0.82$ W.'], answer: '≈ 20.3 A, ≈ 0.82 W lost in wires', why: 'Losses grow with current squared: doubling current quadruples wire heating.' },
    { q: 'A motor-prop produces 850 g of thrust at 9000 rpm. Convert the thrust to newtons and the speed to rad/s.', steps: ['850 gf × 9.81 / 1000 = **8.34 N**.', '9000 × 2π / 60 = **942 rad/s**.'], answer: '8.34 N, 942 rad/s', why: 'Datasheets mix units; engineers convert before calculating.' },
    { q: 'A current-sense shunt of 0.25 mΩ carries 60 A. What voltage appears across it, and what power does it dissipate?', steps: ['$V = IR = 60 \\times 0.00025 = 0.015$ V = **15 mV**.', '$P = I^2 R = 3600 \\times 0.00025 = $ **0.9 W**.'], answer: '15 mV, 0.9 W', why: 'Only 15 mV, too small for an ADC directly, so an amplifier (op-amp) boosts it. This is your Analog Electronics course at work.' },
  ],
  practice: [
    { book: 'W. H. Hayt, J. E. Kemmerly — Engineering Circuit Analysis', where: 'Chapters on practical sources (Thevenin) and power', note: 'Battery internal resistance problems are exactly practical-source problems.' },
    { book: 'I. J. Nagrath & D. P. Kothari — Electric Machines', where: 'DC machines: EMF and torque equations', note: 'The same E = kω and T = kI apply to drone motors.' },
    { book: 'A. K. Sawhney — Electrical and Electronic Measurements and Instrumentation', where: 'Ammeter shunts, potential dividers, errors', note: 'Directly used in drone power sensing.' },
    { book: 'Sedra & Smith — Microelectronic Circuits', where: 'MOSFET as a switch; op-amp amplifiers', note: 'ESC switches and current-sense amplifiers.' },
  ],
  lab: { title: 'Measure a battery\'s internal resistance at home or in the lab', kit: ['Any battery (a 9 V, or a single Li-ion cell with a holder)', 'Multimeter', 'A load: a 10 Ω 5 W resistor or a small bulb', 'Wires with crocodile clips'], steps: ['Measure the open-circuit voltage (no load) and write it down as E.', 'Connect the load. Quickly measure the terminal voltage V and the current I (or compute I = V / R).', 'Compute R_int = (E − V) / I.', 'Repeat after the battery has been used for a while and compare.'], deliverable: 'A short table: E, V, I, R_int. Bring it to the Batteries module.' },
  industry: ['Using a multimeter and bench supply safely', 'Back-of-envelope power and current estimates', 'Reading component datasheets for voltage and current ratings'],
  sim: 'battery',
  resources: [
    { kind: 'docs', t: 'ArduPilot: Copter overview (what each part does)', by: 'ArduPilot docs', url: 'https://ardupilot.org/copter/' },
  ],
  shorts: ['how a drone works', 'brushless motor explained', 'pwm explained'],
  reels: [
    { front: 'Battery under load: why does voltage drop?', back: 'Current flows through the internal resistance: V = E − IR. More current, more drop (sag).' },
    { front: 'A brushless motor is a DC motor where…', back: '…the brushes (mechanical switches) are replaced by an electronic circuit, the ESC.' },
    { front: 'PWM duty cycle 30% on a 12 V supply ≈ ?', back: '≈ 3.6 V average (0.30 × 12).' },
    { front: '1 kg of thrust in newtons?', back: '≈ 9.81 N (1 kgf).' },
    { front: 'Double the propeller rpm → thrust becomes?', back: '4× (thrust ∝ rpm²).' },
  ],
  quiz: [
    { q: 'A battery has E = 12.6 V and R_int = 50 mΩ. What is the terminal voltage at 20 A?', o: ['12.6 V', '11.6 V', '13.6 V', '10.0 V'], a: 1, e: 'V = E − IR = 12.6 − 20 × 0.05 = 11.6 V.' },
    { q: 'Which part of a drone works most like the DC machine from your Machines course?', o: ['Battery', 'Brushless motor', 'GPS', 'Propeller'], a: 1, e: 'A BLDC motor obeys E = kω and T = kI just like a DC machine; only the commutation is electronic.' },
    { q: 'What does an ESC mainly contain?', o: ['A transformer', 'Six MOSFET switches and a small microcontroller', 'A battery charger', 'A radio receiver'], a: 1, e: 'Three half-bridges (six MOSFETs) form a three-phase inverter, controlled by a small MCU.' },
    { q: 'PWM at 50% duty on a 16 V supply gives an average of:', o: ['16 V', '4 V', '8 V', '32 V'], a: 2, e: 'V_avg = D × V = 0.5 × 16 = 8 V.' },
    { q: 'Doubling the current in a wire multiplies its heat loss by:', o: ['2', '4', '0.5', '1'], a: 1, e: 'P = I²R, so doubling I gives 4× the loss.' },
    { q: '850 g of thrust is about how many newtons?', o: ['0.85 N', '8.3 N', '85 N', '83 N'], a: 1, e: '0.85 kgf × 9.81 ≈ 8.34 N.' },
    { q: 'How does the drone measure its battery current?', o: ['With a thermometer', 'With a tiny shunt resistor (or Hall sensor) and an amplifier', 'By counting propeller turns', 'It cannot'], a: 1, e: 'Ohm\'s law across a known milliohm shunt, amplified for the ADC — EMI in practice.' },
    { q: 'Propeller thrust is roughly proportional to:', o: ['rpm', 'rpm²', '√rpm', 'Battery mAh'], a: 1, e: 'Thrust ∝ rpm². Doubling speed gives about 4× thrust.' },
  ],
};
