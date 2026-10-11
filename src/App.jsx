import React, { useState, useEffect } from 'react';
import { 
  Cpu, Zap, Crosshair, Wrench, Play, BookOpen, 
  Terminal, ShieldAlert, Award, ChevronRight, Activity, 
  Map, Wind, Lightbulb, Target, Code, PenTool, CheckCircle, 
  Lock, Unlock, FileText, ChevronLeft, Hexagon, CircuitBoard,
  MonitorPlay, Download, Radio, Youtube,
  MessageSquare, Bot, X, Send, Loader2, Save
} from 'lucide-react';

/* Comprehensive Curriculum Data with Extreme EEE Depth */
const curriculumData = [
  {
    level: 1,
    id: 'l1-aero',
    title: 'Aerodynamics & Motor Matrix',
    category: 'Physics & Mechanics',
    icon: <Wind className="w-6 h-6 text-cyan-400" />,
    outcome: "Calculate required thrust for hover and mathematically map motor mixing ratios to achieve Roll, Pitch, and Yaw without physical control surfaces.",
    principle: "Unlike airplanes with ailerons, multirotors use fixed-pitch propellers. To change direction, we must change individual motor RPMs. Total Lift must equal Weight to hover. Torque is countered by spinning diagonally opposite motors in the same direction (CW and CCW pairs).",
    process: [
      "1. Define the drone's Center of Gravity (CG) as the origin (0,0,0).",
      "2. Map motor rotation: M1(Front-Right/CW), M2(Rear-Right/CCW), M3(Rear-Left/CW), M4(Front-Left/CCW).",
      "3. To Pitch Forward: Increase RPM on M2, M3; Decrease RPM on M1, M4. (Maintains constant total lift).",
      "4. To Yaw: Increase RPM on CW motors, decrease on CCW motors. This unbalances torque while maintaining lift."
    ],
    intuition: "Think of a drone like a table with four variable-length legs. If you want the table to tilt forward (Pitch), you shorten the front legs and lengthen the back legs. To spin the table (Yaw), you use the 'friction' of the spinning legs against the air (Torque).",
    software: {
      name: "eCalc Multicopter (Web Tool)",
      install: "Browser-based engineering tool. Navigate to ecalc.ch. Essential for pre-build calculations.",
      guide: "Input your estimated drone weight (e.g., 500g), battery cells (e.g., 4S = 14.8V), and motor Kv (e.g., 2400Kv). Analyze the 'hover throttle' percentage. If it's over 50%, your drone will be sluggish and underpowered. Ideal is 30-40% for freestyle.",
      link: "https://www.ecalc.ch/"
    },
    videos: [
      { title: "The Physics of Multirotor Flight", channel: "Real Engineering", duration: "14:20", thumb: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=300" },
      { title: "Drone Aerodynamics: Thrust to Weight Ratio", channel: "Joshua Bardwell", duration: "18:05", thumb: "https://images.unsplash.com/photo-1579820010410-c10411aaaa88?auto=format&fit=crop&q=80&w=300" }
    ],
    exam: [
      {
        question: "To induce a pure YAW rotation clockwise without changing altitude, how should the motor speeds change?",
        options: [
          "Increase all motors equally",
          "Increase CCW motors, decrease CW motors equally",
          "Increase front motors, decrease rear motors",
          "Increase CW motors, decrease CCW motors equally"
        ],
        correctAnswer: 1
      },
      {
        question: "If a quadcopter weighs 1000g, what is the absolute MINIMUM thrust required per motor just to hover? (Assume g = 9.8m/s²)",
        options: ["250g", "500g", "1000g", "125g"],
        correctAnswer: 0
      },
      {
        question: "Why do we use two CW and two CCW propellers?",
        options: ["To look cool", "To cancel out gyroscopic precession and reactive torque", "To increase maximum speed", "To make wiring easier"],
        correctAnswer: 1
      }
    ],
    notes: {
      color: "text-cyan-400",
      content: (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold border-b border-cyan-400/30 pb-2">1. The Hover Equation</h3>
          <p className="text-2xl">For stable hover: &Sigma; F<sub>z</sub> = 0</p>
          <p className="text-2xl ml-4">4 &times; T<sub>motor</sub> = m<sub>total</sub> &times; g</p>
          <p className="text-2xl mt-4">Where Thrust (T) is proportional to RPM (&Omega;) squared:</p>
          <p className="text-2xl ml-4">T = k<sub>f</sub> &Omega;<sup>2</sup> <span className="text-lg opacity-70">(where k<sub>f</sub> is a motor/prop constant)</span></p>
          
          <div className="my-8 flex justify-center">
            <svg width="400" height="300" viewBox="0 0 400 300" className="drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
              <rect x="150" y="150" width="100" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="100" cy="160" r="30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5,5" />
              <circle cx="300" cy="160" r="30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 100 130 L 100 50 M 90 60 L 100 50 L 110 60" fill="none" stroke="#22d3ee" strokeWidth="4" />
              <path d="M 300 130 L 300 50 M 290 60 L 300 50 L 310 60" fill="none" stroke="#22d3ee" strokeWidth="4" />
              <text x="70" y="40" fill="#22d3ee" className="text-2xl font-bold" style={{fontFamily: 'Caveat'}}>T1 (Lift)</text>
              <text x="310" y="40" fill="#22d3ee" className="text-2xl font-bold" style={{fontFamily: 'Caveat'}}>T2 (Lift)</text>
              <path d="M 200 170 L 200 250 M 190 240 L 200 250 L 210 240" fill="none" stroke="#f43f5e" strokeWidth="4" />
              <text x="215" y="245" fill="#f43f5e" className="text-2xl font-bold" style={{fontFamily: 'Caveat'}}>W = mg</text>
            </svg>
          </div>

          <h3 className="text-3xl font-bold border-b border-cyan-400/30 pb-2 mt-12">2. Yaw Torque Conservation</h3>
          <p className="text-2xl">Reactive torque (&tau;) opposes motor rotation:</p>
          <p className="text-2xl ml-4">&tau; = k<sub>&tau;</sub> &Omega;<sup>2</sup></p>
          <p className="text-2xl mt-4 text-pink-400">&tau;<sub>total</sub> = &tau;<sub>1</sub> - &tau;<sub>2</sub> + &tau;<sub>3</sub> - &tau;<sub>4</sub></p>
          <p className="text-xl opacity-80 mt-2">If we increase CW motors (&Omega;<sub>1</sub>, &Omega;<sub>3</sub>) and decrease CCW motors (&Omega;<sub>2</sub>, &Omega;<sub>4</sub>) equally, Lift remains constant, but &tau;<sub>total</sub> becomes non-zero, spinning the drone.</p>
        </div>
      )
    }
  },

  {
    level: 2,
    id: 'l2-esc',
    title: 'Power Electronics: MOSFETs to ESCs',
    category: 'Analog & Power Electronics',
    icon: <Zap className="w-6 h-6 text-orange-400" />,
    outcome: "Design a 3-phase inverter bridge utilizing N-channel MOSFETs and Gate Drivers to commutate a Brushless DC (BLDC) motor from a LiPo battery.",
    principle: "A BLDC motor has no mechanical brushes. We must electronically switch massive DC currents across 3 stator coils to create a rotating magnetic field. We use 3 Half-Bridges (6 N-channel MOSFETs). Since MCUs output 3.3V, Gate Drivers are required to step up the voltage (10V+) to push MOSFETs deep into the Ohmic/Linear region, minimizing resistance and heat.",
    process: [
      "1. Flight Controller sends digital throttle signal (DSHOT) to the ESC MCU.",
      "2. ESC MCU reads rotor position using Back-EMF zero-crossing detection on the unpowered phase.",
      "3. MCU commands the Gate Driver IC.",
      "4. Gate driver uses a bootstrap capacitor to drive the High-Side MOSFET gate above the battery voltage.",
      "5. Execute 6-step trapezoidal commutation (e.g., Phase A High, Phase B Low, Phase C floating)."
    ],
    intuition: "You know basic BJTs. In an ESC, MOSFETs aren't amplifiers; they are brute-force, hyper-fast switches handling 50+ Amps. If you turn the High and Low MOSFET on a single phase ON at the same time, it creates a dead short (Shoot-through) causing literal fire. 'Dead-time' is a tiny microsecond delay we code in to prevent this.",
    software: {
      name: "BLHeliSuite32 / Bluejay",
      install: "Download BLHeli32 configurator. Connect Flight Controller via USB. Power ESCs with LiPo (PROPS OFF!).",
      guide: "This software flashes the MCU on the ESCs themselves. You can set motor direction (reversing a phase electronically), adjust PWM switching frequency (24kHz-48kHz for smoother running vs heat), and configure dynamic timing.",
      link: "https://github.com/bitdump/BLHeli"
    },
    videos: [
      { title: "Building an ESC from Scratch", channel: "How To Mechatronics", duration: "22:15", thumb: "https://images.unsplash.com/photo-1563228913-64906f23605e?auto=format&fit=crop&q=80&w=300" },
      { title: "MOSFETs and How to Use Them", channel: "GreatScott!", duration: "10:45", thumb: "https://images.unsplash.com/photo-1620283085068-5aab14e1a7b4?auto=format&fit=crop&q=80&w=300" }
    ],
    exam: [
      {
        question: "Why do we need a Gate Driver IC between the Microcontroller and the Power MOSFETs in an ESC?",
        options: [
          "To cool down the MOSFETs",
          "To step up the 3.3V MCU logic to fully saturate the MOSFET gate",
          "To convert DC to AC",
          "To measure the battery voltage"
        ],
        correctAnswer: 1
      },
      {
        question: "What is 'Shoot-through' in a half-bridge circuit?",
        options: [
          "When the motor spins too fast",
          "When both High-side and Low-side MOSFETs are ON simultaneously, causing a short circuit",
          "When the RF signal shoots through a wall",
          "When the Gate voltage exceeds the Source voltage"
        ],
        correctAnswer: 1
      },
      {
        question: "To minimize power dissipation (heat) in the ESC, we want a MOSFET with:",
        options: [
          "High R_ds(on) and High Gate Capacitance",
          "Low R_ds(on) and Low Gate Capacitance",
          "High Drain-Source voltage rating only",
          "Linear amplification characteristics"
        ],
        correctAnswer: 1
      }
    ],
    notes: {
      color: "text-orange-400",
      content: (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold border-b border-orange-400/30 pb-2">1. The 3-Phase Inverter Bridge</h3>
          <p className="text-xl">Converting DC Battery voltage to switched AC for the BLDC Stator.</p>
          
          <div className="my-8 flex justify-center overflow-visible">
            <svg width="500" height="350" viewBox="0 0 500 350" className="drop-shadow-[0_0_15px_rgba(251,146,60,0.6)]">
              <line x1="50" y1="50" x2="450" y2="50" stroke="#f43f5e" strokeWidth="4" />
              <text x="20" y="55" fill="#f43f5e" className="text-xl font-bold" style={{fontFamily: 'Caveat'}}>+V_BAT</text>
              <line x1="50" y1="300" x2="450" y2="300" stroke="#3b82f6" strokeWidth="4" />
              <text x="20" y="305" fill="#3b82f6" className="text-xl font-bold" style={{fontFamily: 'Caveat'}}>GND</text>
              
              <g transform="translate(100,0)">
                <line x1="50" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="3" />
                <circle cx="50" cy="110" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 50 85 L 50 135 M 35 110 L 45 110" fill="none" stroke="currentColor" strokeWidth="3" />
                <text x="0" y="115" fill="#fb923c" className="text-xl" style={{fontFamily: 'Caveat'}}>Q1 (High)</text>
                
                <line x1="50" y1="135" x2="50" y2="215" stroke="currentColor" strokeWidth="3" />
                <circle cx="50" cy="175" r="5" fill="currentColor" />
                <line x1="50" y1="175" x2="80" y2="175" stroke="#a855f7" strokeWidth="4" />
                <text x="85" y="180" fill="#a855f7" className="text-xl font-bold" style={{fontFamily: 'Caveat'}}>Phase A</text>

                <circle cx="50" cy="245" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 50 220 L 50 270 M 35 245 L 45 245" fill="none" stroke="currentColor" strokeWidth="3" />
                <text x="0" y="250" fill="#fb923c" className="text-xl" style={{fontFamily: 'Caveat'}}>Q2 (Low)</text>
                
                <line x1="50" y1="270" x2="50" y2="300" stroke="currentColor" strokeWidth="3" />
              </g>

              <text x="250" y="180" fill="currentColor" className="text-3xl font-bold opacity-70" style={{fontFamily: 'Caveat'}}>... Phases B & C ...</text>
            </svg>
          </div>

          <h3 className="text-3xl font-bold border-b border-orange-400/30 pb-2 mt-12">2. MOSFET Power Dissipation</h3>
          <p className="text-2xl text-green-400 mb-2">Total Loss = Conduction Loss + Switching Loss</p>
          
          <p className="text-2xl mt-6">A. Conduction Loss (P<sub>cond</sub>)</p>
          <p className="text-xl opacity-80 mb-2">Occurs when the MOSFET is fully ON (Linear region).</p>
          <p className="text-2xl ml-4">P<sub>cond</sub> = I<sub>RMS</sub><sup>2</sup> &times; R<sub>DS(on)</sub></p>
          <p className="text-lg opacity-80 ml-4 mt-1">* Why EEEs care: We need R<sub>DS(on)</sub> in the sub-milliohm range (e.g., 0.8 m&Omega;) because I<sup>2</sup> grows massively at 50A bursts.</p>

          <p className="text-2xl mt-6">B. Switching Loss (P<sub>sw</sub>)</p>
          <p className="text-xl opacity-80 mb-2">Occurs during the transition where Voltage and Current overlap.</p>
          <p className="text-2xl ml-4">P<sub>sw</sub> = &frac12; &times; V<sub>in</sub> &times; I<sub>out</sub> &times; (t<sub>r</sub> + t<sub>f</sub>) &times; f<sub>sw</sub></p>
        </div>
      )
    }
  },

  {
    level: 3,
    id: 'l3-embedded',
    title: 'Embedded MCU & Sensor Fusion',
    category: 'Digital Electronics & Control',
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    outcome: "Program an MCU to read IMU data (Accel/Gyro) via SPI/I2C and fuse data to calculate true spatial orientation.",
    principle: "The Flight Controller reads the Gyroscope (rotation rate) and Accelerometer (gravity vector). Gyroscopes are fast but 'drift'. Accelerometers give absolute level reference but are noisy from motor vibrations. We use a Complementary Filter to fuse the best traits of both.",
    process: [
      "1. Base Level: Wire an Arduino Uno to an MPU6050 via I2C (SDA/SCL pins). Use Wire.h to read registers.",
      "2. Pro Level: STM32 MCUs use SPI at 10MHz+ to read sensors at 8000 times a second (8kHz loop).",
      "3. Convert raw 16-bit ADC values to degrees/sec and G-forces.",
      "4. Apply Complementary Filter math in the main execution loop."
    ],
    intuition: "Think of sensor fusion like asking two friends for directions. Friend A (Gyro) is very fast but gets lost over long distances (Drift). Friend B (Accel) is slow and distracted by bumps, but holds a compass pointing to absolute truth (Gravity). You trust A for immediate reactions, and use B to slowly correct A.",
    software: {
      name: "Arduino IDE -> Betaflight",
      install: "Start by installing Arduino IDE and the Adafruit MPU6050 library. For real drones, download Betaflight Configurator.",
      guide: "In Arduino, you learn the raw mechanics of I2C `Wire.requestFrom()`. In Betaflight, you configure the STM32's hardware targets. Go to the 'Sensors' tab in Betaflight to view raw XYZ axis data in real-time.",
      link: "https://betaflight.com/"
    },
    videos: [
      { title: "Arduino & MPU6050 Complete Guide", channel: "DroneBot Workshop", duration: "32:10", thumb: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=300" },
      { title: "Sensor Fusion: Complementary & Kalman", channel: "Brian Douglas", duration: "16:45", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300" }
    ],
    exam: [
      {
        question: "Why do modern Flight Controllers prefer SPI over I2C for communicating with the IMU?",
        options: [
          "SPI uses fewer wires",
          "SPI supports much higher clock speeds (e.g., 10MHz+) reducing loop time latency",
          "SPI requires no addressing",
          "I2C cannot read 16-bit registers"
        ],
        correctAnswer: 1
      },
      {
        question: "In sensor fusion, what is the primary weakness of the Gyroscope that the Accelerometer helps fix?",
        options: ["High frequency noise", "Integral Drift over time", "Sensitivity to magnetic fields", "Slow response time"],
        correctAnswer: 1
      },
      {
        question: "If an IMU register returns a 16-bit 2's complement value, what is the range of raw integers?",
        options: ["0 to 65535", "-32768 to +32767", "-128 to +127", "0 to 1024"],
        correctAnswer: 1
      }
    ],
    notes: {
      color: "text-purple-400",
      content: (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold border-b border-purple-400/30 pb-2">1. The Complementary Filter</h3>
          <p className="text-xl mb-4">Fusing High-pass (Gyro) and Low-pass (Accel) data.</p>
          
          <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 text-2xl text-center shadow-inner">
            <p>&theta;<sub>angle</sub> = &alpha; &times; (&theta;<sub>angle</sub> + &omega;<sub>gyro</sub> &times; dt) + (1-&alpha;) &times; &theta;<sub>accel</sub></p>
          </div>
          
          <ul className="text-xl space-y-4 mt-6 list-disc pl-8">
            <li><span className="text-pink-400 font-bold">&theta;<sub>angle</sub></span> : The final computed pitch/roll angle.</li>
            <li><span className="text-pink-400 font-bold">&omega;<sub>gyro</sub></span> : Angular rate (deg/sec) from the Gyroscope. Integrated over time (dt).</li>
            <li><span className="text-pink-400 font-bold">&theta;<sub>accel</sub></span> : Absolute angle calculated from gravity vector via arctan(Y/Z).</li>
            <li><span className="text-pink-400 font-bold">&alpha;</span> : Filter coefficient (typically ~0.98). We trust the gyro 98% for short-term, and accel 2% for long-term correction.</li>
          </ul>

          <h3 className="text-3xl font-bold border-b border-purple-400/30 pb-2 mt-12">2. SPI Protocol Timing (Mode 3)</h3>
          
          <div className="my-8 flex justify-center">
            <svg width="600" height="250" viewBox="0 0 600 250" className="drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
              <text x="10" y="50" fill="#a855f7" className="text-2xl font-bold" style={{fontFamily: 'Caveat'}}>SCK</text>
              <path d="M 80 30 L 150 30 L 150 70 L 200 70 L 200 30 L 250 30 L 250 70 L 300 70 L 300 30 L 350 30" fill="none" stroke="#a855f7" strokeWidth="3" />
              
              <text x="10" y="120" fill="#22c55e" className="text-2xl font-bold" style={{fontFamily: 'Caveat'}}>MOSI</text>
              <path d="M 80 140 L 140 140 L 160 100 L 240 100 L 260 140 L 350 140" fill="none" stroke="#22c55e" strokeWidth="3" />
              <text x="180" y="130" fill="#22c55e" className="text-xl" style={{fontFamily: 'Caveat'}}>Reg Addr</text>
              
              <text x="10" y="190" fill="#ef4444" className="text-2xl font-bold" style={{fontFamily: 'Caveat'}}>MISO</text>
              <path d="M 80 170 L 350 170 M 350 170 L 370 210 L 450 210 L 470 170 L 550 170" fill="none" stroke="#ef4444" strokeWidth="3" />
              <text x="360" y="200" fill="#ef4444" className="text-xl" style={{fontFamily: 'Caveat'}}>Data Out</text>

              <line x1="200" y1="20" x2="200" y2="230" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
              <text x="205" y="240" fill="currentColor" className="text-sm opacity-80">Sample on Rising Edge</text>
            </svg>
          </div>
        </div>
      )
    }
  },

  {
    level: 4,
    id: 'l4-control',
    title: 'Control Systems (PID Tuning)',
    category: 'System Dynamics',
    icon: <Crosshair className="w-6 h-6 text-green-400" />,
    outcome: "Implement and tune a PID closed-loop control system to stabilize the inherently unstable dynamics of a multirotor.",
    principle: "A drone is aerodynamically unstable. A PID controller calculates an 'Error' (Desired Setpoint minus Actual Sensor Reading). It uses Proportional (current error), Integral (past accumulated error), and Derivative (future predicted error) to command the motors.",
    process: [
      "1. Setpoint (SP): Pilot moves stick to command 30 deg/sec Roll.",
      "2. Process Variable (PV): Gyro reads current roll is 10 deg/sec.",
      "3. Error (e) = SP - PV = 20.",
      "4. P pushes motors hard. D dampens the push as PV approaches SP to prevent overshoot. I builds up if wind holds the drone back.",
      "5. Output sent to ESCs to adjust motor RPM."
    ],
    intuition: "P is the steering wheel—the further off course, the harder you turn. D is your eyes looking ahead—if you are turning too fast towards the center line, you counter-steer slightly to not overshoot. I is noticing the car constantly drifts right due to wind, so you hold a permanent left bias.",
    software: {
      name: "Blackbox Explorer",
      install: "Part of the Betaflight suite. Drones log flight data to an onboard SD card.",
      guide: "You open the log in Blackbox Explorer. You look at the Gyro traces vs Setpoint traces. If Gyro overshoots Setpoint, you increase D or decrease P. If it's sluggish, increase P.",
      link: "https://github.com/betaflight/blackbox-log-viewer"
    },
    videos: [
      { title: "PID Control - A brief introduction", channel: "Brian Douglas", duration: "12:00", thumb: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=300" },
      { title: "How to Tune a Quadcopter (PID)", channel: "UAV Tech", duration: "25:40", thumb: "https://images.unsplash.com/photo-1605335123992-3c81ee085fc5?auto=format&fit=crop&q=80&w=300" }
    ],
    exam: [
      {
        question: "If a drone aggressively oscillates rapidly (shakes) immediately after takeoff, which PID gain is likely too high?",
        options: ["Integral (I)", "Proportional (P)", "Feedforward", "Derivative (D)"],
        correctAnswer: 1
      },
      {
        question: "Which component of the PID loop is responsible for correcting long-term, steady-state errors (like a constant crosswind)?",
        options: ["Proportional", "Derivative", "Integral", "Setpoint"],
        correctAnswer: 2
      },
      {
        question: "Increasing the Derivative (D) term generally has what effect on the system?",
        options: ["Increases overshoot", "Dampens the response and prevents overshoot", "Makes the drone flip", "Increases top speed"],
        correctAnswer: 1
      }
    ],
    notes: {
      color: "text-green-400",
      content: (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold border-b border-green-400/30 pb-2">1. The PID Equation (Time Domain)</h3>
          
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 text-2xl text-center shadow-inner">
            <p>u(t) = K<sub>p</sub> e(t) + K<sub>i</sub> &int; e(&tau;) d&tau; + K<sub>d</sub> <sup>de(t)</sup>&frasl;<sub>dt</sub></p>
          </div>
          
          <p className="text-2xl mt-8">Where:</p>
          <ul className="text-xl space-y-4 list-disc pl-8">
            <li><span className="font-bold">u(t)</span>: Control variable (Signal sent to ESC mixer)</li>
            <li><span className="font-bold">e(t)</span>: Error (Setpoint - Gyro reading)</li>
            <li><span className="font-bold">K<sub>p</sub>, K<sub>i</sub>, K<sub>d</sub></span>: Tunable constants</li>
          </ul>

          <h3 className="text-3xl font-bold border-b border-green-400/30 pb-2 mt-12">2. Step Response Diagram</h3>
          <p className="text-xl opacity-80 mb-6">Visualizing how P, I, and D affect trajectory.</p>
          
          <div className="my-8 flex justify-center">
            <svg width="500" height="250" viewBox="0 0 500 250" className="drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]">
              {/* Axes */}
              <line x1="50" y1="200" x2="450" y2="200" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="200" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
              
              {/* Setpoint */}
              <line x1="50" y1="50" x2="450" y2="50" stroke="#a3a3a3" strokeWidth="2" strokeDasharray="5,5" />
              <text x="460" y="55" fill="#a3a3a3" className="text-lg" style={{fontFamily: 'Caveat'}}>Setpoint</text>

              {/* Overdamped (Low P) */}
              <path d="M 50 200 Q 150 200, 250 100 T 450 60" fill="none" stroke="#ef4444" strokeWidth="3" />
              <text x="300" y="110" fill="#ef4444" className="text-xl" style={{fontFamily: 'Caveat'}}>Sluggish (Low P)</text>

              {/* Underdamped (High P, Low D) */}
              <path d="M 50 200 C 100 200, 100 20, 150 20 C 200 20, 180 80, 220 80 C 260 80, 240 40, 280 40 C 320 40, 310 50, 450 50" fill="none" stroke="#eab308" strokeWidth="3" />
              <text x="120" y="20" fill="#eab308" className="text-xl" style={{fontFamily: 'Caveat'}}>Oscillating (High P)</text>

              {/* Critically Damped (Tuned) */}
              <path d="M 50 200 C 120 200, 100 50, 200 50 L 450 50" fill="none" stroke="#4ade80" strokeWidth="4" />
              <text x="210" y="40" fill="#4ade80" className="text-xl font-bold" style={{fontFamily: 'Caveat'}}>Tuned (Proper P & D)</text>
            </svg>
          </div>
        </div>
      )
    }
  },

  {
    level: 5,
    id: 'l5-rf',
    title: 'RF Comm & Antenna Design',
    category: 'Electromagnetics',
    icon: <Radio className="w-6 h-6 text-blue-400" />,
    outcome: "Understand EM wave propagation, select appropriate frequencies, and design antennas to maximize Signal-to-Noise Ratio (SNR).",
    principle: "Control links use 2.4GHz or 900MHz (LoRa). Video feeds use 5.8GHz. Lower frequencies penetrate obstacles better; higher frequencies carry more data (video). We measure transmit power in dBm and antenna gain in dBi.",
    process: [
      "1. Transmitter encodes digital SPI data (stick positions) into an RF carrier wave.",
      "2. Amplifier boosts signal (e.g., 100mW to 1000mW).",
      "3. Antenna shapes the radiation pattern (Linear Dipole vs Circular Polarized).",
      "4. Receiver captures EM wave, demodulates, and sends to Flight Controller via UART."
    ],
    intuition: "RF is like light. A linear dipole antenna is a bare lightbulb (shines everywhere, short range). A patch antenna is a flashlight (highly directional, long range). Multipath interference happens when the 'light' bounces off buildings and hits the receiver slightly delayed, causing video static.",
    software: {
      name: "ExpressLRS Configurator",
      install: "Download ExpressLRS Configurator. Used to flash open-source RC link firmware.",
      guide: "ExpressLRS uses LoRa modulation. You flash your Transmitter module and your drone Receiver with a matching 'Binding Phrase' so they cryptographically lock onto each other.",
      link: "https://www.expresslrs.org/"
    },
    videos: [
      { title: "RF and Antennas Explained", channel: "GreatScott!", duration: "11:15", thumb: "https://images.unsplash.com/photo-1614064009363-479607693dcb?auto=format&fit=crop&q=80&w=300" },
      { title: "ExpressLRS The Ultimate Range System", channel: "Joshua Bardwell", duration: "15:30", thumb: "https://images.unsplash.com/photo-1544378730-8b5104b281f6?auto=format&fit=crop&q=80&w=300" }
    ],
    exam: [
      {
        question: "If you want to fly a drone behind concrete buildings, which frequency is best for your control link?",
        options: ["5.8 GHz", "2.4 GHz", "900 MHz", "6.0 GHz"],
        correctAnswer: 2
      },
      {
        question: "If you increase your transmitter power from 10mW (10dBm) to 100mW (20dBm), what happens to your range?",
        options: [
          "It increases by 10x",
          "It roughly doubles/triples (inverse square law)",
          "It decreases",
          "It remains the same"
        ],
        correctAnswer: 1
      },
      {
        question: "Why do we use Circularly Polarized (CP) antennas for 5.8GHz video feeds?",
        options: [
          "They look better",
          "They reject multipath interference (bounced signals reverse polarization)",
          "They use less power",
          "They transmit faster"
        ],
        correctAnswer: 1
      }
    ],
    notes: {
      color: "text-blue-400",
      content: (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold border-b border-blue-400/30 pb-2">1. Power Output: dBm to mW</h3>
          <p className="text-xl mb-4">RF power is logarithmic.</p>
          
          <ul className="text-xl space-y-2 list-disc pl-8 font-mono">
            <li>10 dBm = 10 mW</li>
            <li>20 dBm = 100 mW <span className="text-gray-400 text-sm">(+10dB = x10 power)</span></li>
            <li>23 dBm = 200 mW <span className="text-gray-400 text-sm">(+3dB = x2 power)</span></li>
            <li>30 dBm = 1000 mW (1 Watt)</li>
          </ul>

          <h3 className="text-3xl font-bold border-b border-blue-400/30 pb-2 mt-12">2. Free Space Path Loss (FSPL)</h3>
          <p className="text-xl opacity-80 mb-2">Signal degrades based on distance (d) and frequency (f).</p>
          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 text-2xl text-center shadow-inner">
            <p>FSPL = 20 log<sub>10</sub>(d) + 20 log<sub>10</sub>(f) - 147.55</p>
          </div>
          
          <div className="my-8 flex justify-center mt-12">
            <svg width="400" height="200" viewBox="0 0 400 200" className="drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]">
              {/* TX Antenna */}
              <line x1="50" y1="150" x2="50" y2="50" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              <text x="30" y="180" fill="currentColor" className="text-xl" style={{fontFamily: 'Caveat'}}>TX</text>
              
              {/* Waves */}
              <path d="M 70 30 Q 150 -20, 230 30" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 80 50 Q 200 10, 320 50" fill="none" stroke="#60a5fa" strokeWidth="3" />
              <path d="M 70 70 Q 150 120, 230 70" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* RX Antenna */}
              <line x1="350" y1="150" x2="350" y2="50" stroke="currentColor" strokeWidth="4" />
              <circle cx="350" cy="50" r="5" fill="currentColor" />
              <text x="330" y="180" fill="currentColor" className="text-xl" style={{fontFamily: 'Caveat'}}>RX</text>
            </svg>
          </div>
        </div>
      )
    }
  }
];

export default function DroneBTechAcademy() {
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'module'
  const [activeModuleId, setActiveModuleId] = useState(null);
  
  // Gamification & Progression State
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [xp, setXp] = useState(0);

  // Native PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: 'Hello Engineer. I am your Gemini AI Assistant. Ask me anything about Aerodynamics, Control Systems, RF, or Embedded Electronics.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const activeModule = curriculumData.find(m => m.id === activeModuleId);

  const handleOpenModule = (mod) => {
    if (unlockedLevels.includes(mod.level)) {
      setActiveModuleId(mod.id);
      setViewMode('module');
    }
  };

  const handlePassExam = (levelPassed) => {
    const nextLevel = levelPassed + 1;
    if (!unlockedLevels.includes(nextLevel) && nextLevel <= curriculumData.length) {
      setUnlockedLevels([...unlockedLevels, nextLevel]);
      setXp(prev => prev + 500);
    } else if (levelPassed === curriculumData.length && !unlockedLevels.includes(999)) {
      // Graduate state
      setUnlockedLevels([...unlockedLevels, 999]);
      setXp(prev => prev + 1000);
    }
  };

  const handleDownloadApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        setToastMsg("Installing AeroNet to your device!");
      }
      setDeferredPrompt(null);
      return;
    }

    // Create a downloadable backup of the curriculum for offline study
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(curriculumData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "AeroNet_Offline_Curriculum.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setToastMsg("To install on mobile: Open browser menu (⋮ or Share icon) → select 'Add to Home Screen' / 'Install App'.");
    setTimeout(() => setToastMsg(null), 6000);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      if (!apiKey) {
        setChatMessages(prev => [...prev, { 
          role: 'model', 
          text: 'To enable live Gemini AI responses, please add your Gemini API key in a `.env` file as `VITE_GEMINI_API_KEY=your_key_here`.' 
        }]);
        setIsChatLoading(false);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const systemPrompt = "Act as a world-class Drone Engineering and Electronics (EEE) tutor for a 2nd-year B.Tech student. Provide concise, highly technical, yet easy-to-understand explanations focusing on Aerodynamics, RF, Embedded Systems (Arduino to STM32), Control Systems (PID), and Power Electronics (MOSFETs, ESCs). Use appropriate engineering terminology.";
      
      const historyFormat = chatMessages.filter(m => m.text).map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const payload = {
        contents: [
          ...historyFormat,
          { role: "user", parts: [{ text: userMsg }] }
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Communication error. Please check your uplink and try again.";
      
      setChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Uplink failed. Network connection error." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  /* Global CSS for Fonts and Cyberpunk Grid */
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Share+Tech+Mono&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative">
      
      {/* Cyberpunk Header/HUD */}
      <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-cyan-900/50 shadow-[0_4px_30px_rgba(6,182,212,0.15)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 border border-cyan-500/50 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer hover:bg-cyan-950 transition-colors" onClick={() => setViewMode('tree')}>
              <CircuitBoard className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 tracking-wider">
                AERO_NET [B.TECH EEE]
              </h1>
              <p className="text-[10px] text-cyan-500/70 font-tech tracking-widest uppercase">System Core // Active</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-cyan-950/50 border border-cyan-500/50 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-cyan-900 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="font-tech text-sm text-cyan-400 hidden sm:inline">ASK GEMINI</span>
            </button>

            <button 
              onClick={handleDownloadApp}
              className="bg-purple-950/50 border border-purple-500/50 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-purple-900 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span className="font-tech text-sm text-purple-400 hidden md:inline">INSTALL</span>
            </button>

            <div className="bg-gray-900 border border-gray-800 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="font-tech text-sm text-gray-300">{xp} XP</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      <main className="min-h-[calc(100vh-70px)] relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 p-4">
          {viewMode === 'tree' && (
            <SkillTreeView 
              curriculum={curriculumData} 
              unlockedLevels={unlockedLevels} 
              onOpen={handleOpenModule} 
            />
          )}
          {viewMode === 'module' && activeModule && (
            <ModuleDetailView 
              module={activeModule} 
              onBack={() => setViewMode('tree')}
              onPass={() => handlePassExam(activeModule.level)}
              isNextUnlocked={unlockedLevels.includes(activeModule.level + 1) || unlockedLevels.includes(999)}
            />
          )}
        </div>

        {toastMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 border border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-gray-200 px-6 py-4 rounded-xl flex items-center gap-3 animate-fade-in-up">
            <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-sm font-tech">{toastMsg}</p>
          </div>
        )}

        {isChatOpen && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-black/95 border-l border-cyan-900/50 shadow-[-10px_0_30px_rgba(6,182,212,0.1)] z-[100] flex flex-col backdrop-blur-xl animate-fade-in-up">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-cyan-900/50 flex justify-between items-center bg-gray-900/50">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Gemini AI Uplink</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-100 rounded-tr-none' 
                    : 'bg-gray-800 border border-gray-700 text-gray-300 rounded-tl-none font-tech whitespace-pre-wrap'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-sm font-tech text-cyan-400">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about PID, Aerodynamics, ESCs..."
                  className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors font-tech"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-600 text-center mt-2 font-tech">Powered by Gemini AI</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function SkillTreeView({ curriculum, unlockedLevels, onOpen }) {
  const isGraduated = unlockedLevels.includes(999);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-tech font-bold text-white mb-2 tracking-widest border-b border-cyan-500/30 inline-block pb-2">
          ACADEMIC PROGRESSION PATH
        </h2>
        <p className="text-gray-500 text-sm mt-2">Unlock nodes by passing rigorous technical examinations.</p>
      </div>

      <div className="relative">
        {/* Central Neural Spine */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-900 border-x border-gray-800 -translate-x-1/2">
          <div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            style={{ height: `${((Math.min(Math.max(...unlockedLevels), curriculum.length) - 1) / (curriculum.length - 1)) * 100}%`, transition: 'height 1s ease-out' }}
          />
        </div>

        <div className="space-y-20">
          {curriculum.map((mod, idx) => {
            const isUnlocked = unlockedLevels.includes(mod.level);
            const isCompleted = unlockedLevels.includes(mod.level + 1) || isGraduated;
            const isLeft = idx % 2 === 0;

            return (
              <div key={mod.id} className={`relative flex items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} md:justify-center`}>
                
                {/* Node Core */}
                <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full bg-black border-4 border-gray-900 flex items-center justify-center -translate-x-1/2 z-10">
                  {isCompleted ? (
                    <div className="w-4 h-4 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]" />
                  ) : isUnlocked ? (
                    <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-pulse" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-700" />
                  )}
                </div>

                {/* Node Card */}
                <div className={`
                  w-[calc(100%-4rem)] md:w-5/12 ml-16 md:ml-0 
                  ${isLeft ? 'md:mr-12 text-left md:text-right' : 'md:ml-12 text-left'}
                  group cursor-pointer perspective-1000
                `}
                onClick={() => onOpen(mod)}
                >
                  <div className={`
                    p-6 rounded-2xl border transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden
                    ${isUnlocked 
                      ? 'bg-gray-900/80 backdrop-blur-md border-gray-700 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]' 
                      : 'bg-black/50 border-gray-900 opacity-50 cursor-not-allowed'}
                  `}>
                    {isUnlocked && <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    
                    <div className={`flex flex-col ${isLeft ? 'md:items-end' : 'md:items-start'} mb-2`}>
                      <span className="text-[10px] font-tech text-gray-500 mb-2 border border-gray-800 px-2 py-0.5 rounded bg-black">MODULE 0{mod.level}</span>
                      <div className="flex items-center gap-3">
                        {isLeft && <h3 className={`text-xl font-bold ${isUnlocked ? 'text-gray-100' : 'text-gray-600'}`}>{mod.title}</h3>}
                        <div className={`p-2 rounded-lg bg-black border ${isUnlocked ? 'border-cyan-900/50' : 'border-gray-900'}`}>
                          {mod.icon}
                        </div>
                        {!isLeft && <h3 className={`text-xl font-bold ${isUnlocked ? 'text-gray-100' : 'text-gray-600'}`}>{mod.title}</h3>}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2 font-light">
                      {mod.category}
                    </p>

                    {isUnlocked && (
                      <div className={`mt-4 flex items-center gap-2 text-cyan-400 text-xs font-tech opacity-0 group-hover:opacity-100 transition-opacity ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                        {isCompleted ? <><CheckCircle className="w-4 h-4 text-pink-500" /> MODULE CLEARED</> : <><Terminal className="w-4 h-4" /> INIT UPLINK</>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isGraduated && (
           <div className="mt-20 text-center animate-fade-in-up">
              <div className="inline-block p-6 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                <Award className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white">B.TECH DRONE ENGINEERING CLEARED</h2>
                <p className="text-cyan-400 font-tech mt-2">You are ready to build the future.</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

function ModuleDetailView({ module, onBack, onPass, isNextUnlocked }) {
  const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'notes', 'resources', 'exam'

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex flex-col gap-2 shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center justify-center md:justify-start gap-2 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all font-tech mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> ABORT TO MAP
        </button>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="text-xs font-tech text-gray-500 mb-2 border-b border-gray-800 pb-2 uppercase">DATA MODULE 0{module.level}</div>
          
          <TabButton icon={BookOpen} label="Core Theory" active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} color="cyan" />
          <TabButton icon={PenTool} label="Eng. Derivations" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} color="pink" />
          <TabButton icon={MonitorPlay} label="Media & Comms" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} color="blue" />
          
          <div className="mt-4 pt-4 border-t border-gray-800">
            <TabButton 
              icon={isNextUnlocked ? CheckCircle : ShieldAlert} 
              label={isNextUnlocked ? "Exam Passed" : "Final Exam"} 
              active={activeTab === 'exam'} 
              onClick={() => setActiveTab('exam')} 
              color={isNextUnlocked ? "green" : "red"} 
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden relative backdrop-blur-sm shadow-xl flex flex-col">
        <div className="bg-black/80 border-b border-gray-800 p-6 shrink-0 flex items-center gap-4">
          <div className="p-3 bg-gray-900 border border-gray-700 rounded-xl">
            {module.icon}
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">{module.title}</h2>
            <p className="text-cyan-500 font-tech text-sm mt-1">{module.category}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
          {activeTab === 'theory' && <TheoryContent module={module} />}
          {activeTab === 'notes' && <HandwrittenNotes notes={module.notes} />}
          {activeTab === 'resources' && <ResourcesContent module={module} />}
          {activeTab === 'exam' && <ExamSystem examData={module.exam} onPass={onPass} isPassed={isNextUnlocked} />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick, color }) {
  const colorMap = {
    cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]',
    pink: 'text-pink-400 bg-pink-400/10 border-pink-400/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/30 shadow-[0_0_10px_rgba(96,165,250,0.2)]',
    red: 'text-red-400 bg-red-400/10 border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.2)]',
    green: 'text-green-400 bg-green-400/10 border-green-400/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]'
  };
  
  const inactiveClass = 'text-gray-400 hover:bg-gray-800 border-transparent hover:text-gray-200';

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all font-medium text-sm ${active ? colorMap[color] : inactiveClass}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function TheoryContent({ module }) {
  return (
    <div className="space-y-12 animate-fade-in-up">
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
          <Target className="w-5 h-5 text-cyan-400" /> Operational Outcome
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed bg-black/40 p-5 rounded-xl border border-gray-800/50">
          {module.outcome}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" /> Core Principle
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {module.principle}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
          <Terminal className="w-5 h-5 text-green-400" /> Execution Process
        </h3>
        <div className="space-y-3">
          {module.process.map((step, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex gap-4">
              <span className="text-green-400 font-tech block mt-1 shrink-0">{'>'}</span>
              <p className="text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 rounded-xl p-8">
          <h3 className="text-sm font-tech text-purple-400 mb-2 uppercase tracking-widest">Engineering Intuition</h3>
          <p className="text-xl text-purple-100/90 italic leading-relaxed">
            "{module.intuition}"
          </p>
        </div>
      </section>
    </div>
  );
}

function HandwrittenNotes({ notes }) {
  return (
    <div className="eng-grid min-h-full rounded-xl border border-cyan-900/50 p-8 md:p-12 shadow-2xl relative overflow-hidden animate-fade-in-up">
      {/* Tablet UI overlay elements */}
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
      </div>
      
      {/* Content wrapper with custom font (Caveat) mapped perfectly for readable math */}
      <div className={`font-handwritten ${notes.color} relative z-10`} style={{textShadow: '0 0 10px currentColor'}}>
        {notes.content}
      </div>
    </div>
  );
}

function ResourcesContent({ module }) {
  return (
    <div className="space-y-12 animate-fade-in-up">
      
      {/* Software Tool */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
          <Download className="w-5 h-5 text-blue-400" /> Required Software Protocol
        </h3>
        <div className="bg-blue-900/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-2xl font-bold text-blue-400">{module.software.name}</h4>
            <a href={module.software.link} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
              GET TOOL <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-gray-300 mb-4"><span className="text-gray-500 font-tech">INSTALL_REQ:</span> {module.software.install}</p>
          <div className="bg-black/50 p-4 rounded-lg border border-gray-800 text-gray-400 text-sm leading-relaxed">
            <strong className="text-gray-200">Execution Guide:</strong><br/>
            {module.software.guide}
          </div>
        </div>
      </section>

      {/* YouTube Feeds */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
          <Youtube className="w-5 h-5 text-red-500" /> Video Archives
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {module.videos.map((vid, idx) => (
            <div key={idx} className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/50 transition-all cursor-pointer relative">
              <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
              <div className="relative aspect-video z-10">
                <img 
                  src={vid.thumb} 
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.8)] group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-white">
                  {vid.duration}
                </div>
              </div>
              <div className="p-4 relative z-10 bg-gray-900">
                <h4 className="font-bold text-gray-200 line-clamp-2 group-hover:text-white transition-colors">{vid.title}</h4>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                  <span>{vid.channel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ExamSystem({ examData, onPass, isPassed }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(examData.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (index) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQ] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < examData.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
      calculateScore();
    }
  };

  const calculateScore = () => {
    let score = 0;
    selectedAnswers.forEach((ans, idx) => {
      if (ans === examData[idx].correctAnswer) score++;
    });
    if (score === examData.length && !isPassed) {
      onPass();
    }
  };

  const score = selectedAnswers.reduce((acc, ans, idx) => acc + (ans === examData[idx].correctAnswer ? 1 : 0), 0);

  if (isPassed && !showResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">MODULE CLEARED</h2>
          <p className="text-gray-400 mt-2 font-tech">Access to subsequent data unlocked.</p>
        </div>
        <button onClick={() => setShowResults(true)} className="text-cyan-400 hover:underline font-tech text-sm mt-8">Review Previous Answers</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-500" /> Technical Assessment
        </h3>
        <span className="font-tech text-gray-400 bg-black px-3 py-1 rounded border border-gray-800">
          Q {currentQ + 1} / {examData.length}
        </span>
      </div>

      {!showResults ? (
        <div className="space-y-8">
          <h4 className="text-xl text-gray-200 leading-relaxed font-medium">
            {examData[currentQ].question}
          </h4>
          
          <div className="space-y-3">
            {examData[currentQ].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAnswers[currentQ] === idx
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-white'
                    : 'bg-black/50 border-gray-800 text-gray-400 hover:bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-tech text-xs shrink-0 ${
                    selectedAnswers[currentQ] === idx ? 'border-cyan-400 text-cyan-400' : 'border-gray-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  {opt}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQ] === null}
              className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {currentQ === examData.length - 1 ? 'SUBMIT EVALUATION' : 'NEXT PROTOCOL'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className={`p-8 rounded-2xl text-center border ${
            score === examData.length ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'
          }`}>
            <h2 className="text-4xl font-black text-white mb-2">SCORE: {score} / {examData.length}</h2>
            <p className="text-gray-400 font-tech uppercase tracking-widest">
              {score === examData.length ? 'Clearance Granted' : 'Clearance Denied. Perfection Required.'}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-white text-xl">Review Matrix:</h3>
            {examData.map((q, qIdx) => {
              const isCorrect = selectedAnswers[qIdx] === q.correctAnswer;
              return (
                <div key={qIdx} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-900/10 border-green-900/50' : 'bg-red-900/10 border-red-900/50'}`}>
                  <p className="text-gray-200 mb-3">{q.question}</p>
                  <p className="text-sm font-tech">
                    <span className="text-gray-500">Your Answer: </span>
                    <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{q.options[selectedAnswers[qIdx]]}</span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm font-tech mt-1">
                      <span className="text-gray-500">Correct Answer: </span>
                      <span className="text-green-400">{q.options[q.correctAnswer]}</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {!isPassed && score < examData.length && (
            <div className="flex justify-center pt-8">
              <button 
                onClick={() => { setShowResults(false); setCurrentQ(0); setSelectedAnswers(new Array(examData.length).fill(null)); }}
                className="px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
              >
                RE-ENGAGE EXAM
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
