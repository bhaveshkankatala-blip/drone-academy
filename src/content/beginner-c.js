// Beginner layer, part C (same shape as beginner-a.js).

export const BEGINNER_C = {
  design: {
    why: 'This is where everything combines into a real drone you can order parts for: the heart of your college project.',
    bridge: [
      { subject: 'Electrical Circuits', text: 'Power budget: total electrical power = V × I, summed over all motors and electronics.' },
      { subject: 'Electrical Machines', text: 'Motor selection uses KV, current rating and efficiency, the same ratings as any machine nameplate.' },
    ],
    simple: [
      { h: 'Design is a loop, not a straight line', body: `You cannot pick parts one at a time, because each choice changes the others:
a bigger battery → heavier drone → needs more thrust → bigger motors → even heavier → …

So engineers **guess, calculate, check, repeat**:

1. Write the requirements (payload, flight time).
2. Guess the total weight.
3. Work out hover power and pick motors + props from thrust tables.
4. Pick a battery for the flight time.
5. Add up the real weight. If it changed a lot, go back to step 3.

The **sizing simulator** in this module does this loop for you.` },
      { h: 'Rules of thumb that save you', body: `- **Thrust-to-weight ≥ 2:** total max thrust at least twice the weight.
- **Hover at about 50% throttle** or a bit less, leaving headroom for wind and manoeuvres.
- **Battery ≈ 30–40% of total weight** is typical for good flight time.
- **ESC rating ≥ 1.2–1.5× the motor's max current.**
- **Frame size follows prop size:** a 450 mm frame fits 10″ props.` },
      { h: 'Vibration and centre of gravity', body: `Mount the flight controller on soft pads, balance the props, and keep the **centre of gravity** in the middle of the motors. An off-centre battery makes some motors work harder all the time, which costs flight time and control margin.` },
    ],
    check: [
      { q: 'Why is drone design a loop?', o: ['Because the frame is round', 'Each part choice changes the weight, which changes what the other parts must be', 'Because of PID', 'It is not a loop'], a: 1, e: 'Weight couples every choice: battery ↔ motors ↔ thrust.' },
      { q: 'A good target hover throttle is about:', o: ['10%', '≈ 40–50%', '90%', '100%'], a: 1, e: 'Hovering near half throttle leaves headroom (T/W ≈ 2).' },
    ],
    starters: [
      { q: 'A drone\'s parts are: frame 350 g, 4 motors × 70 g, 4 ESCs × 10 g, flight controller + GPS 80 g, camera 200 g, battery 500 g. Total weight? What max thrust per motor is needed for T/W = 2?', steps: [
        { s: 'Sum: 350 + 280 + 40 + 80 + 200 + 500 = 1450 g.', why: 'A mass budget is just a careful addition, but it must include everything.' },
        { s: 'Total thrust needed = 2 × 1450 = 2900 g.', why: 'T/W = 2.' },
        { s: 'Per motor = 2900 / 4 = 725 g.', why: 'Shared equally by four motors.' },
      ], answer: '1450 g total; 725 g max thrust per motor' },
      { q: 'At hover, each motor of that drone uses 6.5 A at 14.8 V; electronics use 0.5 A. With a 5000 mAh pack and 80% usable, estimate the hover time.', steps: [
        { s: 'Total current = 4 × 6.5 + 0.5 = 26.5 A.', why: 'Currents from the same battery add.' },
        { s: 'Usable capacity = 5 × 0.8 = 4 Ah.', why: 'Keep 20% in reserve.' },
        { s: 'Time = 4 / 26.5 × 60 ≈ 9.1 min.', why: 'Ah ÷ A = hours, × 60 = minutes.' },
      ], answer: '≈ 9 minutes' },
    ],
    videos: [
      { id: 'I2Xik8WYYTo', t: 'How to calculate your drone\'s required thrust!', by: 'Dron-isteria', role: 'first', note: 'Step-by-step thrust budget, like the starter examples.' },
      { id: 'MNDn38vTCkk', t: 'FPV: What Motor, Battery and Props to use?', by: 'Cube FPV', role: 'deeper', note: 'How builders match motor, prop and battery in practice.' },
    ],
  },

  autonomy: {
    why: 'Autonomy (missions, failsafes, computer control) is what turns a flying toy into a useful machine, and it is what your project demo will show.',
    bridge: [
      { subject: 'EMI', text: 'Test planning and log analysis are measurement work: record, compare with expectation, explain the error.' },
    ],
    simple: [
      { h: 'Flight modes, from manual to automatic', body: `- **Stabilize / Angle:** you fly; the drone keeps itself level.
- **Altitude hold:** it also keeps its height.
- **Loiter / Position hold:** it holds its position using GPS.
- **Auto / Mission:** it flies a list of waypoints you planned on a map.
- **RTL (Return to Launch):** it flies home and lands, the most important safety mode.` },
      { h: 'Failsafes', body: `A **failsafe** is an automatic action when something goes wrong: radio lost → return home; battery low → land; GPS lost → hold height and land. **Set and test failsafes before the first real flight.**` },
      { h: 'Companion computers', body: `A small computer (Raspberry Pi, Jetson) can sit on the drone and talk to the flight controller over **MAVLink**, sending commands like "go to this point" based on a camera or AI. Tools: MAVSDK, DroneKit, ROS 2.` },
      { h: 'Rules in India', body: `Under the Drone Rules 2021, check the **DigitalSky** airspace map (green / yellow / red zones) before flying; most drones need a registration number (UIN), and commercial flying needs a remote pilot certificate. Nano drones and R&D flights have some exemptions. **Always verify the current rules and get your institute's permission.**` },
    ],
    check: [
      { q: 'Which mode brings the drone home automatically?', o: ['Stabilize', 'RTL (Return to Launch)', 'Acro', 'Manual'], a: 1, e: 'RTL climbs to a safe height, flies home and lands.' },
      { q: 'What should happen when the radio link is lost?', o: ['Nothing', 'A configured failsafe such as RTL or land', 'Motors stop instantly mid-air', 'Drone climbs forever'], a: 1, e: 'Failsafes are set in the firmware and must be tested before flying.' },
    ],
    starters: [
      { q: 'A mission flies 2.4 km at 8 m/s. Take-off, climb and landing add 90 s. How long does it take?', steps: [
        { s: 'Cruise time = 2400 / 8 = 300 s.', why: 'time = distance / speed.' },
        { s: 'Total = 300 + 90 = 390 s = 6.5 min.', why: 'Add the fixed overhead.' },
      ], answer: '6.5 minutes' },
      { q: 'The drone flies 12 minutes on a full battery, and you want to land with 25% reserve. What is the longest mission you should plan?', steps: [
        { s: 'Usable fraction = 1 − 0.25 = 0.75.', why: 'Reserve is for wind, mistakes and RTL.' },
        { s: 'Max mission = 12 × 0.75 = 9 min.', why: 'Plan within the usable part only.' },
      ], answer: '9 minutes' },
    ],
    videos: [
      { id: 'GFxwRgntGlQ', t: 'Beginner\'s Tutorial: Simulation using Mission Planner', by: 'Karthik\'s Tech Time', role: 'first', note: 'Run a simulated drone on your laptop and fly a mission (Indian channel).' },
      { id: 'ykIWqcNGN7U', t: 'Waypoint missions with Ardupilot', by: 'Burke Aviation', role: 'deeper', note: 'Planning real waypoint missions step by step.' },
    ],
  },

  fixedwing: {
    why: 'Wings fly much longer than rotors. Survey, mapping and long-range delivery drones are mostly fixed-wing or VTOL.',
    bridge: [
      { subject: 'Electrical Circuits', text: 'Cruise power P = drag × speed, then divided by efficiencies, the same power chain as the multirotor.' },
    ],
    simple: [
      { h: 'How a wing holds a plane up', body: `A wing is shaped and tilted so it **turns the passing air downward**. Pushing air down pushes the wing up (lift). The faster the plane flies, the more air the wing deflects, so the more lift.

Lift costs some **drag** (resistance). A good wing makes 10–20× more lift than drag. That ratio, **L/D**, is the key number.` },
      { h: 'Why wings beat rotors for endurance', body: `A multirotor must push all its weight down with propellers, all the time. A plane only has to overcome **drag**, which is about **1/10 of its weight** for a good design. So it needs far less power and flies **3–5× longer** on the same battery.` },
      { h: 'Stall', body: `If the wing is tilted too steeply (too high an **angle of attack**) or flies too slowly, the air stops flowing smoothly over it and lift suddenly drops. That is a **stall**. Always keep speed above stall speed, especially in turns.` },
      { h: 'VTOL: best of both', body: `A **quadplane** has four lifting motors for take-off and landing, plus a forward motor and wings for cruise. The tricky part is the **transition** between hover and wing-borne flight.` },
    ],
    check: [
      { q: 'L/D = 12 means:', o: ['12 kg payload', 'lift is 12× the drag', '12 minutes flight', '12 m/s speed'], a: 1, e: 'Lift-to-drag ratio: the higher, the more efficient the cruise.' },
      { q: 'A stall happens when:', o: ['the battery dies', 'angle of attack is too high / speed too low and lift suddenly drops', 'the GPS is lost', 'the motor overheats'], a: 1, e: 'Airflow separates from the wing and lift collapses.' },
    ],
    starters: [
      { q: 'A 2 kg plane cruises with L/D = 10 at 15 m/s. What is the drag, and the power needed to overcome it?', steps: [
        { s: 'Weight = 2 × 9.81 = 19.6 N; in level flight lift = weight.', why: 'Steady level flight: forces balance.' },
        { s: 'Drag = Lift / (L/D) = 19.6 / 10 = 1.96 N.', why: 'Definition of L/D.' },
        { s: 'Power = Drag × speed = 1.96 × 15 ≈ 29 W.', why: 'Mechanical power = force × velocity.' },
      ], answer: 'Drag ≈ 1.96 N; ≈ 29 W of air power' },
      { q: 'If propeller and motor efficiencies are 0.6 and 0.8, how much electrical power does that 29 W need?', steps: [
        { s: 'Overall = 0.6 × 0.8 = 0.48.', why: 'Efficiencies in a chain multiply.' },
        { s: 'Electrical = 29 / 0.48 ≈ 61 W.', why: 'Input = output / efficiency.' },
      ], answer: '≈ 61 W (a 2 kg quad needs roughly 300+ W to hover)' },
    ],
    videos: [
      { id: 'p4VHMsIuPmk', t: 'How do airplanes actually fly?', by: 'TED-Ed (Raymond Adkins)', role: 'first', note: 'Short, accurate explanation of lift.' },
      { id: 'Biu-6ORLo4I', t: 'VTOL Revisited: Bixler 3 QuadPlane', by: 'Dennis Baldwin', role: 'deeper', note: 'A real quadplane build and transition flights.' },
    ],
  },

  pcb: {
    why: 'Designing your own flight controller or power board is the strongest EEE portfolio project, and avionics hardware roles hire for it.',
    bridge: [
      { subject: 'Electrical Circuits', text: 'Trace resistance R = ρL/A and I²R heating decide how wide a copper track must be.' },
      { subject: 'EMI', text: 'Current sensing with shunts and voltage sensing with dividers on the board are direct EMI applications.' },
      { subject: 'Analog Electronics', text: 'Decoupling capacitors, regulators and op-amp current-sense amplifiers are Analog Electronics building blocks.' },
    ],
    simple: [
      { h: 'What a PCB is', body: `A **printed circuit board** replaces wires with flat copper tracks on a fibreglass board. You draw the **schematic** (what connects to what), then the **layout** (where parts and tracks physically go), and send the files to a factory (JLCPCB, PCBWay) to manufacture.` },
      { h: 'Rules that matter most', body: `- **High current needs wide copper.** A 1 mm track can carry only a few amps; motor power needs wide planes or thick copper.
- **Decoupling capacitors** go right next to every chip's power pin. They supply quick bursts of current and keep noise out.
- **A solid ground plane** under everything gives currents a clean return path.
- **Keep noisy power switching away from sensitive sensors** (the IMU).` },
      { h: 'Tools', body: `**KiCad** is free, professional and used in industry; learn it first. Altium is the common paid tool in companies. Start with a tiny board (an LED + regulator), then an STM32 breakout, then a full flight controller.` },
    ],
    check: [
      { q: 'Where should a decoupling capacitor be placed?', o: ['Anywhere on the board', 'As close as possible to the chip\'s power pin', 'Next to the battery connector only', 'Not needed'], a: 1, e: 'Short loops let it supply fast current and filter noise effectively.' },
      { q: 'A track carrying 30 A should be:', o: ['As thin as possible', 'Wide (or a copper pour), with thick copper', 'Made of solder', 'On the silkscreen layer'], a: 1, e: 'Width and copper thickness reduce resistance and heating.' },
    ],
    starters: [
      { q: 'A copper track is 50 mm long, 2 mm wide and 35 µm thick (1 oz copper). Copper resistivity ρ = 1.7×10⁻⁸ Ω·m. Find its resistance.', steps: [
        { s: 'Area A = 2 mm × 35 µm = 0.002 × 0.000035 = 7×10⁻⁸ m².', why: 'Cross-section = width × thickness, in metres.' },
        { s: 'R = ρL/A = 1.7×10⁻⁸ × 0.05 / 7×10⁻⁸.', why: 'Resistance of a uniform conductor (Circuits / Physics).' },
        { s: '= 8.5×10⁻¹⁰ / 7×10⁻⁸ ≈ 0.0121 Ω = 12.1 mΩ.', why: 'Simplify the powers of ten carefully.' },
      ], answer: '≈ 12 mΩ' },
      { q: 'That 12.1 mΩ track carries 10 A. How much heat does it make?', steps: [
        { s: 'P = I²R = 100 × 0.0121 = 1.21 W.', why: 'Copper loss, same as any resistor.' },
      ], answer: '≈ 1.2 W, enough to get a thin track hot. Use wider copper for motor currents.' },
    ],
    videos: [
      { id: 'TJPyqRnhytA', t: 'How to make your First PCB! Beginner KiCad Design Tutorial', by: 'LeMaster Tech', role: 'first', note: 'Complete first-board walkthrough in KiCad.' },
      { id: 'aVUqaB0IMh4', t: 'KiCad 6 STM32 PCB Design Full Tutorial (Phil\'s Lab #65)', by: 'Phil\'s Lab', role: 'deeper', note: 'The microcontroller board at the heart of a flight controller.' },
    ],
  },

  vision: {
    why: 'Cameras let drones map land, inspect structures and land precisely. This is where drones meet AI.',
    bridge: [
      { subject: 'Maths (1st year)', text: 'Similar triangles: the whole pinhole camera model is one ratio, size on sensor / focal length = size on ground / height.' },
      { subject: 'EMI', text: 'Resolution, accuracy and calibration of a camera are measurement-system ideas.' },
    ],
    simple: [
      { h: 'A camera is a ratio', body: `Light from the ground passes through the lens and lands on the sensor. By similar triangles:

$$\\frac{\\text{size on sensor}}{\\text{focal length}} = \\frac{\\text{size on ground}}{\\text{height}}$$

Fly higher → each pixel covers more ground → less detail.` },
      { h: 'Ground sample distance (GSD)', body: `**GSD** = how many centimetres of ground one pixel covers. For mapping you might want 2–3 cm/pixel. Lower flying = smaller GSD = more detail, but more photos and flight time to cover the area.` },
      { h: 'Mapping = lots of overlapping photos', body: `To make a map or 3-D model, the drone flies a "lawn-mower" pattern and takes photos that **overlap** by about 70–80%. Software (photogrammetry, e.g. OpenDroneMap) finds the same points in many photos and stitches them into one big accurate map.` },
      { h: 'Markers and AI', body: `- **ArUco / AprilTag markers:** printed square patterns a camera can find and measure precisely, used for precision landing.
- **Object detection (e.g. YOLO):** a neural network on a companion computer recognises people, vehicles or crops in real time.` },
    ],
    check: [
      { q: 'If the drone flies twice as high with the same camera, GSD:', o: ['halves', 'doubles (less detail)', 'stays the same', 'becomes zero'], a: 1, e: 'GSD is proportional to height.' },
      { q: 'Why do mapping photos overlap a lot?', o: ['To waste storage', 'So software can match points across photos and stitch an accurate map', 'Because the drone shakes', 'For the GPS'], a: 1, e: 'Photogrammetry needs each ground point seen in several photos.' },
    ],
    starters: [
      { q: 'A camera has 2.4 µm pixels and an 8.8 mm focal length. Flying at 80 m, what is the GSD?', steps: [
        { s: 'GSD = pixel size × height / focal length.', why: 'Similar triangles: one pixel on the sensor maps to one GSD on the ground.' },
        { s: '= 2.4×10⁻⁶ × 80 / 0.0088.', why: 'All in metres.' },
        { s: '= 1.92×10⁻⁴ / 0.0088 ≈ 0.0218 m ≈ 2.2 cm.', why: 'Simplify.' },
      ], answer: '≈ 2.2 cm per pixel' },
      { q: 'The image is 5472 pixels wide. How wide a strip of ground does one photo cover at that GSD?', steps: [
        { s: 'Width = pixels × GSD = 5472 × 0.0218 ≈ 119 m.', why: 'Each pixel covers one GSD.' },
      ], answer: '≈ 119 m wide' },
    ],
    videos: [
      { id: 'rSjc_t7SF_s', t: 'Mapping with Drones: Introduction to Photogrammetry', by: 'Jeremy Maurer', role: 'first', note: 'How overlapping photos become maps.' },
      { id: 'xfcf4B_HdBw', t: 'GSD and its Importance in Drone Mapping & Inspection', by: 'Hammer Missions', role: 'first', note: 'Ground sample distance, explained for drones.' },
      { id: 'qByYk6JggQU', t: 'Linear Camera Model | Camera Calibration', by: 'First Principles of Computer Vision (Columbia)', role: 'deeper', note: 'The camera model properly, from a Columbia University course.' },
    ],
  },
};
