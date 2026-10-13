// Beginner layer, part A. For each module:
//   why      – one line: why this module matters
//   bridge   – "You already know this from…" links to 3rd-semester subjects
//   simple   – plain-language sections (no derivations), read before the Engineer version
//   check    – two quick questions to confirm the Simple read made sense
//   starters – Level-1 worked examples; every step has a "why"
//   videos   – checked YouTube links (title + channel confirmed through YouTube's oEmbed endpoint)
//              role: 'first' = watch after the Simple read; 'deeper' = after the Engineer read; 'extra' = optional

export const BEGINNER_A = {
  start: {
    why: 'Shows that your current subjects already explain most of a drone, so nothing later feels like it came from nowhere.',
    bridge: [],
    simple: null, // this module is already written at the Simple level
    check: [
      { q: 'You read a module and the Engineer view feels too hard. What should you do first?', o: ['Skip the module', 'Switch to Simple, read it, watch the "first" video, then come back', 'Go straight to the quiz', 'Memorise the equations'], a: 1, e: 'Simple → video → Engineer is the intended order. The Engineer text is much easier once the idea is clear.' },
      { q: 'Which of your current subjects explains the battery voltage drop under load?', o: ['Electrical Machines', 'Electrical Circuits (Thevenin source)', 'Analog Electronics', 'None of them'], a: 1, e: 'A battery is an EMF in series with an internal resistance: V = E − IR.' },
    ],
    starters: [
      { q: 'A drone battery shows 16.8 V with no load and has 25 mΩ internal resistance. What voltage reaches the drone when it pulls 30 A?', steps: [
        { s: 'Write the battery model: $V = E - IR$.', why: 'A real battery = ideal source E + internal resistance R in series (your Thevenin model from Circuits).' },
        { s: 'Convert 25 mΩ to ohms: 0.025 Ω.', why: 'Always convert to base SI units before multiplying.' },
        { s: 'Drop: $IR = 30 \\times 0.025 = 0.75$ V.', why: 'Current through a resistance always causes a voltage drop.' },
        { s: '$V = 16.8 - 0.75 = 16.05$ V.', why: 'What is left after the internal drop is what the motors actually get.' },
      ], answer: '≈ 16.05 V' },
      { q: 'An ESC switches a 12 V supply with a duty cycle of 0.6. What average voltage does the motor see, and what duty cycle would give 3 V?', steps: [
        { s: '$V_{avg} = D \\times V = 0.6 \\times 12 = 7.2$ V.', why: 'The switch is fully on for 60% of each cycle and fully off for 40%, so the average is 60% of the supply.' },
        { s: 'For 3 V: $D = 3 / 12 = 0.25$ (25%).', why: 'Rearrange the same formula: D = V_avg / V.' },
      ], answer: '7.2 V; 25% duty for 3 V' },
    ],
    videos: [
      { id: 'jOugJpQfUDU', t: 'Drone Components Explained: FPV Beginner series', by: 'Jon E5 FPV', role: 'first', note: 'Names every part on a drone and what it does. Watch this before anything else.' },
      { id: 'cXCXRbkWiio', t: 'FPV drone controls explained: throttle, pitch, roll, yaw', by: 'Drone Racing League', role: 'first', note: 'How the four motors make the drone move in each direction.' },
      { id: 'R1QN_0fcZ_8', t: 'Internal Resistance of a Battery, EMF, Cell Terminal Voltage, Physics Problems', by: 'The Organic Chemistry Tutor', role: 'deeper', note: 'Solved problems on V = E − IR, the same maths as drone battery sag.' },
      { id: 'UJkHL-6mn8s', t: 'How to use MOSFET as a Switch?', by: 'ALL ABOUT ELECTRONICS', role: 'extra', note: 'The switch inside every ESC. Indian channel, clear for EEE students.' },
    ],
  },

  systems: {
    why: 'Gives you the map: every later module zooms into one box of this picture.',
    bridge: [
      { subject: 'Electrical Circuits', text: 'The battery → wires → ESCs path is a DC power circuit; P = VI and I²R losses apply directly.' },
      { subject: 'Electrical Machines', text: 'The four motors are brushless DC machines: E = kω and T = kI.' },
      { subject: 'Analog Electronics', text: 'Each ESC is built from MOSFET switches, the transistor-as-switch idea.' },
      { subject: 'EMI', text: 'The flight controller is full of measurement instruments: gyroscope, accelerometer, barometer, current and voltage sensors.' },
    ],
    simple: [
      { h: 'A drone in one sentence', body: `A drone is a **battery** feeding **four motors** through **four speed controllers**, with a **small computer** in the middle that keeps adjusting the motor speeds so it doesn't fall over.

Think of balancing a stick on your palm. Your eyes see it tilting, your brain decides, and your hand moves to correct it, again and again, many times a second. On a drone:

- **Eyes** = sensors (a gyroscope feels rotation, an accelerometer feels tilt).
- **Brain** = flight controller (a microcontroller).
- **Hand** = ESCs + motors + propellers.` },
      { h: 'Two flows: energy and information', body: `**Energy flow** (thick wires, tens of amps):
Battery → power board → ESCs → motors → propellers push air down.

**Information flow** (thin wires, a loop):
Sensors → flight controller → ESCs → motors → the drone moves → sensors notice → …

The information flow is a **loop**. That loop is called **feedback**, and it is the reason a drone can fly at all.` },
      { h: 'Why it cannot fly without the computer', body: `A quadcopter is like a pencil standing on its tip. If it tilts a little, nothing pulls it back; it just tilts more. So the computer must check and correct **hundreds to thousands of times per second**.

The pilot never controls the motors directly. The pilot says "tilt forward a bit", and the computer works out how fast each of the four motors must spin to make that happen.` },
      { h: 'Types of drones, in one line each', body: `- **Quad (4 motors):** simplest and cheapest; the one you will most likely build.
- **Hex/Octo (6/8 motors):** carries more and can survive one motor failing.
- **Fixed-wing (a small plane):** flies 3–5× longer but cannot hover.
- **VTOL:** takes off like a quad, cruises like a plane; most complex.` },
    ],
    check: [
      { q: 'In the "stick on your palm" picture, what plays the role of your eyes?', o: ['The battery', 'The sensors (gyroscope, accelerometer)', 'The propellers', 'The radio'], a: 1, e: 'Sensors observe the drone\'s rotation and tilt, just as your eyes watch the stick.' },
      { q: 'Why does a quadcopter need a computer correcting it many times a second?', o: ['To save battery', 'Because it naturally tips over, like a pencil on its tip', 'For GPS', 'To talk to the pilot'], a: 1, e: 'It has no natural tendency to stay level, so constant fast correction (feedback) is essential.' },
    ],
    starters: [
      { q: 'A 1.2 kg drone should be able to produce twice its weight in thrust. How much thrust must each of its four motors give?', steps: [
        { s: 'Total thrust needed = 2 × 1.2 kg = 2.4 kg (of force).', why: '"Twice its weight" is the thrust-to-weight ratio of 2, the usual safe minimum so there is spare power to tilt and fight wind.' },
        { s: 'Per motor = 2.4 / 4 = 0.6 kg = 600 g.', why: 'Four motors share the load equally.' },
        { s: 'In newtons: 0.6 × 9.81 = 5.9 N.', why: 'Hobby datasheets use grams; physics uses newtons. Know both.' },
      ], answer: '600 g (≈ 5.9 N) per motor' },
      { q: 'The flight controller runs its correction loop 2000 times per second. How many milliseconds between corrections?', steps: [
        { s: 'Time per loop = 1 / 2000 s = 0.0005 s.', why: 'Frequency and period are reciprocals: T = 1/f.' },
        { s: '0.0005 s = 0.5 ms.', why: '1 s = 1000 ms.' },
      ], answer: '0.5 ms' },
    ],
    videos: [
      { id: 'xSOaeSd1AlM', t: 'Flight controller basics for beginners', by: 'FPV University', role: 'first', note: 'What the "brain" board does and what plugs into it.' },
      { list: 'PLn8PRpmsu08oOLBVYYIwwN_nvuyUqEjrj', t: 'Drone Simulation and Control (playlist): watch Part 1 now', by: 'MATLAB (Brian Douglas)', role: 'deeper', note: 'Part 1 explains why a drone needs feedback control. Save the other parts for the Control module.' },
    ],
  },

  power: {
    why: 'The battery decides how long you fly and how hard the motors can push. It is also the most dangerous part.',
    bridge: [
      { subject: 'Electrical Circuits', text: 'A battery pack is a Thevenin source: EMF + internal resistance. Cells in series add voltage; cells in parallel add capacity.' },
      { subject: 'EMI', text: 'Battery voltage and current are measured with a potential divider and a shunt, exactly as in EMI.' },
      { subject: 'Analog Electronics', text: 'The 5 V supply for the electronics comes from a buck converter, a switching circuit made of a transistor, a diode or a second transistor, an inductor and a capacitor.' },
    ],
    simple: [
      { h: 'Reading a battery label', body: `A label like **"4S 5000 mAh 50C"** means:

- **4S**: 4 cells in **S**eries. Each LiPo cell is 3.7 V nominal (4.2 V full, about 3.5 V empty under load), so 4S ≈ 14.8 V nominal, 16.8 V full.
- **5000 mAh**: capacity. It can supply 5 A for 1 hour, or 50 A for 6 minutes.
- **50C**: the claimed maximum current = 50 × capacity in amps = 50 × 5 = 250 A. These claims are usually optimistic.

**Energy** = voltage × capacity = 14.8 V × 5 Ah = **74 Wh**.` },
      { h: 'Why voltage drops when you fly hard', body: `Inside every battery there is a small resistance, a few milliohms per cell. When current flows through it, some voltage is lost inside the battery:

$$V_{out} = E - I \\times R_{internal}$$

Pull more current → bigger drop → the drone feels weaker. This drop is called **sag**. Old or cold batteries have higher internal resistance, so they sag more.` },
      { h: 'How long can it fly?', body: `Rough rule:

$$\\text{flight time (min)} \\approx \\frac{\\text{usable capacity (Ah)}}{\\text{hover current (A)}} \\times 60$$

Only use about **80%** of the capacity. Draining a LiPo completely damages it.

Example: 5 Ah × 0.8 = 4 Ah usable; hover current 20 A → 4/20 × 60 = **12 minutes**.` },
      { h: 'Feeding the small electronics', body: `The flight controller, receiver and camera need **5 V**, not 16 V. A **buck converter** (in drone language, a **BEC**) steps 16 V down to 5 V efficiently by switching on and off quickly, the same PWM idea used in ESCs, followed by an inductor and capacitor that smooth it out.` },
      { h: 'Safety (seriously)', body: `- Charge LiPos only with a **balance charger**, never unattended, ideally in a LiPo bag.
- Never short the leads. A short can release hundreds of amps and start a fire.
- Store at about 3.8 V per cell. Throw away (safely) any pack that is **puffed** (swollen).` },
    ],
    check: [
      { q: 'What does "4S" mean on a LiPo?', o: ['4 seconds of flight', '4 cells in series (≈ 14.8 V nominal)', '4 amps', '4 batteries in parallel'], a: 1, e: 'S = series. 4 × 3.7 V = 14.8 V nominal.' },
      { q: 'Why does a drone feel weaker when the battery is old?', o: ['The motors get older', 'Higher internal resistance → more voltage sag under load', 'GPS loses signal', 'The props wear out'], a: 1, e: 'V = E − IR: a larger R means a bigger drop at the same current.' },
    ],
    starters: [
      { q: 'A 3S 2200 mAh LiPo powers a small drone that hovers at 11 A. Estimate the hover time using 80% of the capacity.', steps: [
        { s: 'Capacity in Ah: 2200 mAh = 2.2 Ah.', why: 'Divide mAh by 1000 to get Ah, so the units match the current in A.' },
        { s: 'Usable: 2.2 × 0.8 = 1.76 Ah.', why: 'Stopping at about 80% protects the LiPo from over-discharge.' },
        { s: 'Time = 1.76 / 11 = 0.16 h.', why: 'Capacity ÷ current = hours (Ah ÷ A = h).' },
        { s: '0.16 × 60 = 9.6 min.', why: 'Convert hours to minutes.' },
      ], answer: '≈ 9.6 minutes' },
      { q: 'A 4S pack (16.8 V full) has 4 cells of 6 mΩ each. What is the terminal voltage at 50 A?', steps: [
        { s: 'Pack resistance = 4 × 6 = 24 mΩ = 0.024 Ω.', why: 'Cells are in series, so their resistances add, just like resistors in series.' },
        { s: 'Drop = 50 × 0.024 = 1.2 V.', why: 'Ohm\'s law across the internal resistance.' },
        { s: 'V = 16.8 − 1.2 = 15.6 V.', why: 'Terminal voltage = EMF − internal drop.' },
      ], answer: '15.6 V' },
    ],
    videos: [
      { id: 'ke8L3yygegs', t: 'How to Choose the right drone battery! C-Rating? mAh? Cells? All explained.', by: 'UAVfutures', role: 'first', note: 'Decodes every number on the label.' },
      { id: 'a8d22YQ2qEw', t: 'Battery Internal Resistance', by: 'Ben Finio', role: 'first', note: 'Why voltage drops under load, with a real measurement.' },
      { id: 'vQtKPedhi84', t: 'How Buck Converters Really Work (and Why Vout = D·Vin)', by: 'Prof MAD', role: 'deeper', note: 'How the 5 V supply (BEC) is made. Connects to your Analog Electronics course.' },
      { id: 'yJ-QyHiiqUI', t: 'Lipo Battery Explained', by: 'RcHelpDotCom', role: 'extra', note: 'Charging, storage and safety basics.' },
    ],
  },

  motors: {
    why: 'Motors turn electrical power into thrust. Choosing the wrong one is the most common beginner design mistake.',
    bridge: [
      { subject: 'Electrical Machines', text: 'Same laws as your DC machine: back EMF E = Ke·ω, torque T = Kt·I, and V = E + IR.' },
      { subject: 'Electrical Machines', text: 'Construction is close to a permanent-magnet synchronous machine: magnets on the rotor, three-phase windings on the stator.' },
      { subject: 'Electrical Circuits', text: 'Copper loss is I²R in the windings, the same calculation you do for any resistor.' },
    ],
    simple: [
      { h: 'What a brushless motor is', body: `A normal toy DC motor has **brushes**: little sliding contacts that flip the current direction as the motor turns. They wear out and spark.

A **brushless** motor removes them. The coils sit still (the **stator**) and the magnets spin around them (the **rotor**; on drones the outside "bell" spins). An electronic circuit, the **ESC**, switches current between the three coil sets at the right moment, which is the job the brushes used to do.

Result: no wear, very efficient, very powerful for its weight.` },
      { h: 'KV: the most important motor number', body: `**KV** = rpm per volt, with no propeller.

- 2300 KV on 4S (14.8 V): ≈ 34,000 rpm unloaded. Fast, made for small 5″ props.
- 900 KV on 4S: ≈ 13,300 rpm. Slower, made for big 10″ props.

High KV = fast but weak per amp. Low KV = slow but strong per amp. **Big props need low KV**; small props need high KV.

> KV is not "how powerful" a motor is. It is a gear ratio between volts and speed.` },
      { h: 'Why current depends on the load', body: `A spinning motor also acts like a **generator**: it produces a voltage that opposes the battery (the **back EMF**). The faster it spins, the bigger the back EMF.

- Free-spinning: back EMF ≈ supply voltage, so very little current flows.
- With a big propeller: the prop holds it back, it spins slower, back EMF is lower, more current flows, more torque.

This is exactly the DC machine behaviour from your Machines course.` },
      { h: 'Reading a motor name', body: `**"2212 920KV"** means a stator **22 mm** wide and **12 mm** tall, and 920 KV. A bigger stator gives more torque and copes with more heat.

The motor's datasheet gives a **thrust table**: for each propeller and voltage, how much thrust (g), current (A) and efficiency (g/W) you get. That table is what you design with.` },
    ],
    check: [
      { q: 'A 1000 KV motor runs on 12 V with no propeller. About how fast does it spin?', o: ['1000 rpm', '12,000 rpm', '83 rpm', '120,000 rpm'], a: 1, e: 'KV × V = 1000 × 12 = 12,000 rpm (unloaded).' },
      { q: 'Which motor suits a big 10-inch propeller?', o: ['High KV (2500)', 'Low KV (≈ 800–1000)', 'Any KV', 'A brushed motor'], a: 1, e: 'Big props need lots of torque at lower speed, so low KV.' },
    ],
    starters: [
      { q: 'A 920 KV motor runs on a 4S battery at 14.8 V. Estimate its no-load speed in rpm and rad/s.', steps: [
        { s: 'rpm ≈ KV × V = 920 × 14.8 = 13,616 rpm.', why: 'KV is defined as rpm per volt with no load.' },
        { s: 'rad/s = 13,616 × 2π / 60 ≈ 1426 rad/s.', why: 'Physics formulas (E = Ke·ω) need ω in rad/s.' },
      ], answer: '≈ 13,600 rpm ≈ 1426 rad/s' },
      { q: 'A motor has 0.1 Ω winding resistance and carries 15 A. How much power turns into heat in the copper?', steps: [
        { s: '$P = I^2 R$.', why: 'Copper loss is just resistor heating, as in Circuits.' },
        { s: '$= 15^2 \\times 0.1 = 225 \\times 0.1 = 22.5$ W.', why: 'Square the current first; that is why high current is so costly.' },
      ], answer: '22.5 W of copper loss' },
    ],
    videos: [
      { id: 'fxSdZWWx3e8', t: 'How a Brushless DC Motor Works', by: 'Edison Tech Center', role: 'first', note: 'Clear animation of stator, rotor and switching.' },
      { id: 'YqmB6jlUfR0', t: 'Brushless DC Motor (BLDC Motor): how it works', by: 'learnchannel', role: 'first', note: 'A second short explanation with the three-phase switching sequence.' },
      { id: 'uvyi6hPIt8w', t: 'Motor KV 100% Explained', by: 'Chris Rosser', role: 'deeper', note: 'An engineer explains KV, torque and voltage properly. Watch after the Engineer read.' },
    ],
  },

  esc: {
    why: 'The ESC is pure power electronics: the most "EEE" part of a drone, and a big source of jobs.',
    bridge: [
      { subject: 'Analog Electronics', text: 'Each switch is a power MOSFET used fully on or fully off, the transistor-as-a-switch idea.' },
      { subject: 'Electrical Circuits', text: 'Conduction loss is I²·R_DS(on): Ohm\'s law heating in the switch.' },
      { subject: 'Electrical Machines', text: 'The ESC creates the rotating three-phase supply the motor needs, like a variable-frequency drive for an induction motor.' },
    ],
    simple: [
      { h: 'What the ESC does', body: `The battery gives **DC**. A brushless motor needs current switched through its **three** coil sets in a rotating pattern.

The ESC is the translator: **six electronic switches** (MOSFETs), arranged as three pairs called **half-bridges**, one pair per motor wire. A tiny microcontroller turns them on and off in the right order to make the magnetic field rotate, and the rotor follows it.` },
      { h: 'Speed control = PWM', body: `To slow the motor down, the ESC does not reduce voltage with a resistor (that would waste energy as heat). It **switches on and off very fast** (around 24–48 kHz) and changes the on-fraction:

- 100% on → full battery voltage.
- 50% on → behaves like half the voltage.

Because each switch is either fully on (tiny resistance) or fully off (no current), very little power is wasted.` },
      { h: 'Where the heat comes from', body: `1. **Conduction loss:** when on, a MOSFET has a tiny resistance (a few milliohms). Loss = I² × R.
2. **Switching loss:** for a brief moment while turning on or off, a MOSFET has both voltage and current, and wastes energy. More switching per second means more of this loss.

That is why ESCs have current ratings (e.g. "35 A") and get hot.` },
      { h: 'How the ESC knows where the rotor is', body: `Drone motors have no position sensors. The ESC watches the **one coil that is not powered** at that moment. The spinning magnets induce a voltage (back EMF) in it, and when that voltage crosses zero, the ESC knows it is time for the next switching step.

This is called **sensorless** control. It only works once the motor is spinning, which is why motors "twitch" at start-up.` },
      { h: 'How the flight controller talks to the ESC', body: `Modern drones send a **digital** speed command called **DShot** (e.g. DShot600 = 600 kbit/s). Old drones used a simple pulse width (1000–2000 µs, like a servo). Digital is more precise and needs no calibration.` },
    ],
    check: [
      { q: 'How many MOSFET switches are in a typical three-phase drone ESC?', o: ['2', '3', '6', '12'], a: 2, e: 'Three half-bridges × 2 switches = 6.' },
      { q: 'Why does an ESC use PWM instead of a resistor to control speed?', o: ['It is cheaper', 'Switches fully on/off waste very little power; a resistor would burn the excess as heat', 'Resistors are illegal', 'PWM is louder'], a: 1, e: 'An ideal switch has either no current or no voltage across it, so almost no power is dissipated.' },
    ],
    starters: [
      { q: 'A MOSFET has R_DS(on) = 3 mΩ and carries 20 A while on. Find its conduction loss.', steps: [
        { s: 'Convert: 3 mΩ = 0.003 Ω.', why: 'SI units before multiplying.' },
        { s: '$P = I^2 R = 20^2 \\times 0.003 = 400 \\times 0.003 = 1.2$ W.', why: 'A fully-on MOSFET behaves like a small resistor.' },
      ], answer: '1.2 W' },
      { q: 'An ESC switches at 24 kHz. How long is one PWM period, and how long is the switch on at 30% duty?', steps: [
        { s: 'Period T = 1 / 24,000 ≈ 41.7 µs.', why: 'Period = 1 / frequency.' },
        { s: 'On-time = 0.30 × 41.7 ≈ 12.5 µs.', why: 'Duty cycle is the fraction of each period that the switch is on.' },
      ], answer: 'T ≈ 41.7 µs, on for ≈ 12.5 µs' },
    ],
    videos: [
      { id: 'UJkHL-6mn8s', t: 'How to use MOSFET as a Switch?', by: 'ALL ABOUT ELECTRONICS', role: 'first', note: 'The building block of the ESC. Matches your Analog Electronics course.' },
      { id: 'TwAmmPxOpTM', t: 'How Drone ESCs Work (so I built my own)', by: 'OpenDrone', role: 'first', note: 'Walks through a real drone ESC from the switches to the firmware.' },
      { id: 'Kk3OxZaeLgU', t: 'ESC 101: Everything you need to know about Electronic Speed Controllers', by: 'FreddyCanFly', role: 'deeper', note: 'Ratings, firmware (BLHeli, AM32) and protocols (DShot).' },
    ],
  },

  physics: {
    why: 'Explains how much power it takes to hover, which decides your battery, motors and flight time.',
    bridge: [
      { subject: 'Electrical Circuits', text: 'Electrical power in = V × I; this module explains how much of it becomes useful air movement.' },
      { subject: 'Electrical Machines', text: 'Motor output power = torque × speed, the same as any rotating machine.' },
    ],
    simple: [
      { h: 'Thrust = throwing air down', body: `A propeller is a **fan pushing air downward**. By Newton's third law, pushing air down pushes the drone up.

How hard it pushes depends on **how much air** it moves each second and **how fast** that air leaves:

$$\\text{thrust} = (\\text{mass of air per second}) \\times (\\text{speed you give it})$$

To hover, thrust must equal weight.` },
      { h: 'Why thrust grows with speed squared', body: `Spin the prop twice as fast and two things double: the amount of air it grabs, and the speed it throws that air. 2 × 2 = **4× the thrust**. So:

$$T \\propto \\text{rpm}^2$$

Power grows even faster (roughly with rpm³), which is why flying hard drains the battery so quickly.` },
      { h: 'Why big, slow props are more efficient', body: `You can make the same thrust two ways:
- move **a lot of air slowly** (big prop), or
- move **a little air fast** (small prop).

Moving air costs energy proportional to its speed squared, so the big slow option wastes less energy. That is why long-flight drones use big propellers and racing drones (which want agility, not efficiency) use small ones.` },
      { h: 'From air power to battery current', body: `There is a chain of losses: battery → wires → ESC → motor → propeller → air. Each step wastes some energy:

- Motor + ESC efficiency ≈ 80%
- Propeller efficiency (called **figure of merit**) ≈ 60–70%

So the battery must supply roughly twice the "ideal" air power. The Engineer view derives the ideal number; for now remember **a 1–2 kg drone hovers on about 150–350 W**.` },
    ],
    check: [
      { q: 'If you double propeller rpm, thrust becomes about:', o: ['2×', '4×', '8×', 'the same'], a: 1, e: 'Thrust ∝ rpm².' },
      { q: 'For long flight time, which is better at the same thrust?', o: ['Small prop spinning fast', 'Big prop spinning slowly', 'Both are the same', 'More props in a line'], a: 1, e: 'Moving more air slowly needs less power for the same thrust.' },
    ],
    starters: [
      { q: 'A prop makes 400 g of thrust at 6000 rpm. Estimate its thrust at 9000 rpm.', steps: [
        { s: 'Speed ratio = 9000 / 6000 = 1.5.', why: 'Work with the ratio so the unknown constant cancels.' },
        { s: 'Thrust ratio = 1.5² = 2.25.', why: 'Thrust ∝ rpm².' },
        { s: 'New thrust = 400 × 2.25 = 900 g.', why: 'Scale the known value by the ratio.' },
      ], answer: '≈ 900 g' },
      { q: 'A drone needs 180 W of air power to hover. The propellers are 65% efficient and the motor+ESC are 80% efficient. How much electrical power does the battery supply?', steps: [
        { s: 'Overall efficiency = 0.65 × 0.80 = 0.52.', why: 'Efficiencies in a chain multiply.' },
        { s: 'Battery power = 180 / 0.52 ≈ 346 W.', why: 'Input = useful output ÷ efficiency.' },
      ], answer: '≈ 346 W' },
    ],
    videos: [
      { id: 'fvUvOeBYjyE', t: 'How Propellers Work: The Physics of Efficient Thrust', by: 'IntuitiveAerospace', role: 'first', note: 'Why props push air, and why size matters.' },
      { id: 'GK1t8YIvGM8', t: 'Drone Simulation and Control, Part 2: How Do You Get a Drone to Hover?', by: 'MATLAB (Brian Douglas)', role: 'deeper', note: 'Hover, motor speeds and how a quad changes its attitude.' },
      { id: 'KgTN_VuKORs', t: 'Thrust to Weight Ratios | A Drone Design Foundation', by: 'The Drone Dojo', role: 'extra', note: 'Why T/W ≈ 2 is the usual minimum.' },
    ],
  },
};
