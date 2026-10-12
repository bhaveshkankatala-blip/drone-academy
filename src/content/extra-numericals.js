// Two extra solved numericals for each core module. Merged in content/index.js.
export const EXTRA_NUMERICALS = {
  systems: [
    { q: 'On a 4S drone the flight controller draws 2 W, the video transmitter 5 W, GPS 0.5 W and receiver 0.5 W, all from a 5 V buck regulator that is 90% efficient. How much current do the avionics draw from the 14.8 V battery?', steps: ['Load power = 2 + 5 + 0.5 + 0.5 = 8 W.', 'Battery-side power = 8 / 0.9 = 8.89 W.', 'Current = 8.89 / 14.8 = **0.60 A**.'], answer: '≈ 0.6 A', why: 'Small next to ~10 A hover current, but it never stops — include it in endurance estimates.' },
    { q: 'A 1.5 kg drone carries a 300 g camera. What is its payload fraction, and what does it become if a 100 g lighter frame is used?', steps: ['Payload fraction = 0.3 / 1.5 = **20%**.', 'Lighter frame: 0.3 / 1.4 = **21.4%**.'], answer: '20% → 21.4%', why: 'Payload fraction is a standard figure of merit when comparing designs.' },
  ],
  physics: [
    { q: 'A 600 g 5-inch FPV quad (D = 0.127 m) hovers at sea level. Find the induced velocity, total ideal hover power and disk loading. Compare its disk loading with the 1.2 kg 10-inch quad from Q1.', steps: ['T per rotor = 0.6 × 9.81 / 4 = 1.4715 N; A = π(0.0635)² = 0.01267 m².', 'vᵢ = √(1.4715 / (2 × 1.225 × 0.01267)) = √47.4 = **6.89 m/s**.', 'P_ideal = 4 × 1.4715 × 6.89 = **40.5 W**.', 'DL = 1.4715 / 0.01267 = **116 N/m²** vs 2.943 / 0.05067 = **58 N/m²** for the 10″ quad.'], answer: 'vᵢ ≈ 6.9 m/s, P ≈ 40.5 W, DL ≈ 116 vs 58 N/m²', why: 'Half the mass but double the disk loading: small props are agile but inefficient.' },
    { q: 'A pilot hovers at 30% throttle and thrust ∝ throttle² roughly holds for this setup. Estimate the thrust-to-weight ratio at full throttle.', steps: ['Hover: T_hover ∝ 0.3² = 0.09.', 'Full: T_max ∝ 1² = 1.', 'T/W ≈ 1 / 0.09 = **11**.'], answer: 'T/W ≈ 11', why: 'A rough but useful check of a freestyle build from hover throttle alone (real ESC/motor curves are not perfectly quadratic).' },
  ],
  dynamics: [
    { q: 'Model a quad as four 60 g motors at arm length 225 mm (ignore the body). Estimate I_zz and I_xx.', steps: ['Each motor is L = 0.225 m from the z-axis: I_zz = 4 m L² = 4 × 0.06 × 0.0506 = **0.0122 kg·m²**.', 'Each motor is L/√2 from the x-axis: I_xx = 4 m (L²/2) = **0.0061 kg·m²**.'], answer: 'I_zz ≈ 0.0122, I_xx ≈ 0.0061 kg·m²', why: 'Motors dominate inertia; I_zz ≈ 2 I_xx for a symmetric X frame. Real values are a bit higher (frame, battery).' },
    { q: 'A quad must yaw with angular acceleration 3 rad/s². With I_zz = 0.015 kg·m² and c = 0.016 m, what total thrust difference between the CCW and CW pairs is needed?', steps: ['τ_z = I_zz α = 0.015 × 3 = 0.045 N·m.', 'τ_z = c × (T_CCW,sum − T_CW,sum) → ΔT = 0.045 / 0.016 = **2.81 N**.'], answer: '≈ 2.8 N difference between pairs', why: 'Compare: the same roll acceleration needs only a fraction of a newton — yaw is weak on quads.' },
  ],
  motors: [
    { q: 'A 2450 KV motor draws 25 A with I₀ = 1 A. What torque does it produce?', steps: ['Kt = 9.549 / 2450 = 0.0039 N·m/A.', 'τ = Kt (I − I₀) = 0.0039 × 24 = **0.0936 N·m**.'], answer: '≈ 0.094 N·m', why: 'Tiny torque, huge speed: that is a high-KV motor.' },
    { q: 'A motor with phase-to-phase resistance 0.10 Ω runs at 30 A. Estimate copper loss, and the loss if a hot motor\'s resistance rises 20%.', steps: ['P = I²R = 900 × 0.10 = **90 W**.', 'Hot: R = 0.12 Ω → **108 W** (more heat → even hotter: thermal runaway risk).'], answer: '90 W → 108 W', why: 'Copper resistance rises ~0.4% per °C, so overheating feeds on itself.' },
  ],
  esc: [
    { q: 'How long does one DShot600 frame take, and how many frames fit in an 8 kHz PID loop period?', steps: ['16 bits at 600 kbit/s = 16 / 600,000 = **26.7 µs**.', 'Loop period = 125 µs → 125 / 26.7 ≈ **4.7** frames: one per loop fits easily.'], answer: '26.7 µs; ~4.7 per loop', why: 'Why DShot300 is too slow for 8 kHz updates on some setups and DShot600 is common.' },
    { q: 'A high-side MOSFET has Q_g = 30 nC. The bootstrap voltage may droop at most 0.5 V each switching cycle. What minimum bootstrap capacitance is needed?', steps: ['C ≥ Q_g / ΔV = 30 nC / 0.5 V = **60 nF**.', 'Designers add margin for leakage and the driver\'s own draw → typically ~10× → **0.47–1 µF**.'], answer: '≥ 60 nF (use ~1 µF)', why: 'Too small a bootstrap cap starves the high-side gate at low duty cycles.' },
  ],
  power: [
    { q: 'Battery leads are 15 cm of 14 AWG wire each way (8.28 mΩ/m). At 60 A, find the voltage drop and power lost in the leads.', steps: ['Total length = 0.30 m → R = 0.30 × 8.28 = 2.48 mΩ.', 'Drop = 60 × 0.00248 = **0.15 V**; loss = 60² × 0.00248 = **8.9 W**.'], answer: '0.15 V, 8.9 W', why: 'Keep high-current wires short and thick; XT60 connectors add a little more.' },
    { q: 'How long does a 1500 mAh pack take to charge at 1C, and what charge current is that?', steps: ['1C = 1.5 A.', 'Constant-current phase ≈ 1 h for the bulk; the constant-voltage tail adds roughly 10–20 min → **~70–80 min** total.'], answer: '1.5 A, about 70–80 min', why: 'Fast-charging (2–5C) is possible only if the manufacturer allows it, and ages the pack faster.' },
  ],
  sensing: [
    { q: 'Near sea level, how much does air pressure change per metre of height? If a barometer has 2 Pa noise, what altitude noise is that?', steps: ['dp/dh = ρg = 1.225 × 9.81 = **12.0 Pa/m**.', 'Altitude noise = 2 / 12.0 = **0.17 m**.'], answer: '12 Pa/m; ≈ 17 cm', why: 'Why baro altitude is good to tens of centimetres, and why prop wash (several Pa) matters.' },
    { q: 'A loose FC vibrates sinusoidally at 200 Hz with 0.5 mm amplitude. What peak acceleration does the accelerometer see? Will a ±16 g sensor clip?', steps: ['a = (2πf)² × A = (1256.6)² × 0.0005 = **790 m/s²** ≈ **80 g**.', 'Yes: far above ±16 g → clipping, which corrupts the attitude estimate.'], answer: '≈ 80 g — clips', why: 'Tiny vibrations at high frequency mean huge accelerations. Soft-mount the FC and balance props.' },
  ],
  control: [
    { q: 'Gyro noise of 0.5 °/s between samples is differentiated at 8 kHz without filtering. What derivative noise does the D-term see?', steps: ['Δt = 125 µs.', 'd/dt ≈ 0.5 / 125×10⁻⁶ = **4000 °/s²** (order of magnitude).'], answer: '~4000 °/s²', why: 'Small noise becomes a huge derivative — the reason D-term low-pass filters exist.' },
    { q: 'A loop has crossover at 40 Hz and 45° phase margin. Filters add 2 ms of total delay. What phase margin remains?', steps: ['Extra lag = 360 × f × t = 360 × 40 × 0.002 = **28.8°**.', 'Remaining PM = 45 − 28.8 = **16.2°** → very oscillatory.'], answer: '≈ 16° phase margin left', why: 'Every millisecond of filtering must be paid for in phase.' },
  ],
  firmware: [
    { q: 'An IMU burst read is 14 bytes over SPI at 10 MHz. How long does the transfer take, and what fraction of a 125 µs loop is it?', steps: ['14 × 8 = 112 bits → 112 / 10⁷ = **11.2 µs** (plus small overhead).', 'Fraction = 11.2 / 125 ≈ **9%** — and DMA can do it without the CPU.'], answer: '11.2 µs; ~9% of the loop', why: 'Why SPI (not I²C at 400 kHz, ≈ 300 µs) is used for the gyro.' },
    { q: 'An STM32H7 runs at 480 MHz with an 8 kHz loop. How many CPU cycles are available per loop?', steps: ['480×10⁶ / 8000 = **60,000 cycles** per loop.'], answer: '60,000 cycles', why: 'Filters, PID, mixer, logging and telemetry all have to fit — firmware engineers profile constantly.' },
  ],
  rf: [
    { q: 'Thermal noise is −174 dBm/Hz at room temperature. What is the noise floor in a 500 kHz bandwidth, and with a 6 dB receiver noise figure?', steps: ['10 log₁₀(500,000) = 57.0 dB.', 'Noise floor = −174 + 57 = **−117 dBm**; with NF 6 dB → **−111 dBm**.'], answer: '−117 dBm; −111 dBm with NF', why: 'Sensitivity = noise floor + required SNR — narrower bandwidth (lower packet rate) improves range.' },
    { q: 'Same antennas and distance: how many dB more free-space path loss at 5.8 GHz than at 2.44 GHz?', steps: ['ΔFSPL = 20 log₁₀(5.8 / 2.44) = 20 log₁₀(2.377) = **7.5 dB**.'], answer: '≈ 7.5 dB', why: 'Roughly 2.4× less range for the same power — why video at 5.8 GHz needs good antennas.' },
  ],
  design: [
    { q: 'You remove 100 g from a 1.5 kg drone (battery unchanged). Using hover power ∝ m^1.5, estimate the change in hover power and flight time.', steps: ['Power ratio = (1.4/1.5)^1.5 = 0.933^1.5 = **0.902** → about 10% less power.', 'Flight time ∝ 1/P → 1/0.902 = **1.11** → about 11% longer.'], answer: '−10% power, +11% flight time', why: 'Every gram counts — 100 g is often just wiring and screws.' },
    { q: 'A motor draws 18 A at full throttle on the thrust stand. With a 1.3× margin, what ESC rating do you choose?', steps: ['18 × 1.3 = 23.4 A → choose the next standard size: **25–30 A** continuous.'], answer: '25–30 A ESC', why: 'Hot climates and poor airflow push you to the upper end.' },
  ],
  autonomy: [
    { q: 'A drone is 800 m from home, returns at 8 m/s and draws 200 W. How much energy does the RTL leg need (excluding landing)?', steps: ['Time = 800 / 8 = 100 s.', 'Energy = 200 × 100 = 20,000 J = **5.6 Wh**.'], answer: '≈ 5.6 Wh', why: 'Battery failsafes should trigger with this energy plus landing and wind reserve still in the pack.' },
    { q: 'At 12 m/s with a maximum braking deceleration of 4 m/s², how far does the drone travel while stopping?', steps: ['d = v² / (2a) = 144 / 8 = **18 m**.'], answer: '18 m', why: 'Add this to GPS uncertainty when setting geofence buffers.' },
  ],
  fixedwing: [
    { q: 'The 2 kg plane (S = 0.4 m², C_L,max = 1.2) must take off from a college field at sea level. With a 1.2× safety margin over stall, what is the minimum launch speed?', steps: ['V_s = 8.17 m/s (from Q1).', 'Launch ≥ 1.2 × 8.17 = **9.8 m/s** (≈ 35 km/h) — a strong hand launch or a bungee.'], answer: '≈ 9.8 m/s', why: 'Why heavier planes need catapults or VTOL.' },
    { q: 'On a 35 °C afternoon at Warangal (≈ 270 m altitude) air density is about 1.11 kg/m³. By what factor does stall speed rise compared with sea-level ISA?', steps: ['V_s ∝ 1/√ρ.', 'Factor = √(1.225/1.11) = √1.104 = **1.05** → about 5% faster stall.'], answer: '≈ 5% higher stall speed', why: 'Hot days need longer take-off runs and more airspeed margin.' },
  ],
  pcb: [
    { q: 'A 100 nF decoupling capacitor must supply a 100 mA current spike lasting 10 ns. How much does the rail droop?', steps: ['ΔV = I·Δt / C = 0.1 × 10×10⁻⁹ / 100×10⁻⁹ = **10 mV**.'], answer: '≈ 10 mV', why: 'Small, fast spikes are fed by the local cap; that is why it sits right at the pin.' },
    { q: 'A 5 V, 2 A buck regulator runs from a 6S pack (22.2 V nominal) at 90% efficiency. Find input current and heat dissipated.', steps: ['P_out = 10 W → P_in = 10/0.9 = 11.1 W.', 'I_in = 11.1 / 22.2 = **0.5 A**; heat = 11.1 − 10 = **1.1 W**.'], answer: '0.5 A in; 1.1 W heat', why: 'A linear regulator would burn (22.2 − 5) × 2 = 34 W here.' },
  ],
  vision: [
    { q: 'A YOLO-class detector runs at 20 FPS on a Jetson with 30 ms of camera and transfer delay. What is the total latency, and how far does a target moving at 5 m/s travel in that time?', steps: ['Inference time = 1/20 = 50 ms → total ≈ 50 + 30 = **80 ms**.', 'Distance = 5 × 0.08 = **0.4 m**.'], answer: '≈ 80 ms; 0.4 m', why: 'Tracking controllers predict ahead by the measured latency.' },
    { q: 'At 50 m with GSD 3 cm and 80% front overlap (3000-px image length), how often must the camera trigger at 10 m/s?', steps: ['Image length on ground = 0.03 × 3000 = 90 m.', 'Spacing = (1 − 0.8) × 90 = 18 m → every 18/10 = **1.8 s**.'], answer: 'Every 1.8 s', why: 'Matches the survey simulator\'s "photo every" value.' },
  ],
};
