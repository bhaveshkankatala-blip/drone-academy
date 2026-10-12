// Software toolkit for an EEE engineer — broad, not drone-only.
// cost: 'free' | 'student' (free/discounted student licence) | 'paid'
export const TOOL_CATEGORIES = [
  { id: 'lang', name: 'Programming languages', why: 'Everything else builds on these.' },
  { id: 'embedded', name: 'Embedded development', why: 'Writing and flashing firmware for microcontrollers.' },
  { id: 'debug', name: 'Debug & lab tools', why: 'Finding hardware/firmware bugs on real boards.' },
  { id: 'circuit', name: 'Circuit simulation', why: 'Test analog and digital circuits before building them.' },
  { id: 'power', name: 'Power electronics & machines', why: 'Converters, inverters, motor drives, EVs.' },
  { id: 'grid', name: 'Power systems', why: 'Grid studies, protection, renewables — core EEE careers.' },
  { id: 'pcb', name: 'PCB design (EDA)', why: 'Turning schematics into boards you can order.' },
  { id: 'fpga', name: 'Digital design / FPGA / VLSI', why: 'Hardware description languages and chip design flows.' },
  { id: 'math', name: 'Control, maths & modelling', why: 'Control design, signal processing and system models.' },
  { id: 'mech', name: 'CAD, FEA & CFD', why: 'Mechanical design and multiphysics simulation.' },
  { id: 'auto', name: 'Industrial automation', why: 'PLCs, SCADA and test benches in factories and plants.' },
  { id: 'robotics', name: 'Linux, robotics & AI', why: 'Autonomy, perception and machine learning.' },
  { id: 'workflow', name: 'Everyday engineering workflow', why: 'Version control, notebooks, reports.' },
  { id: 'drone', name: 'Drone-specific', why: 'Only for UAV work; learn after the general tools.' },
];

export const TOOLS = [
  { n: 'C', c: 'lang', cost: 'free', what: 'The language of microcontrollers, drivers and operating systems.', where: 'All embedded, firmware and power-electronics control jobs.', url: 'https://en.cppreference.com/w/c', yt: 'C programming for embedded systems' },
  { n: 'C++', c: 'lang', cost: 'free', what: 'C with classes, templates and a large standard library.', where: 'ArduPilot/PX4, robotics, high-performance software, games.', url: 'https://en.cppreference.com/', yt: 'modern C++ for embedded' },
  { n: 'Python', c: 'lang', cost: 'free', what: 'Fast-to-write language for scripting, data analysis, automation and AI.', where: 'Test automation, data/log analysis, ML, ROS 2, lab equipment control.', url: 'https://www.python.org/', yt: 'Python for engineers numpy matplotlib' },
  { n: 'MATLAB', c: 'lang', cost: 'student', what: 'Numerical computing environment with toolboxes for control, signals, power.', where: 'Universities, automotive, aerospace, power-electronics design.', url: 'https://www.mathworks.com/products/matlab.html', yt: 'MATLAB onramp tutorial' },
  { n: 'Embedded Rust', c: 'lang', cost: 'free', what: 'Memory-safe systems language growing in embedded.', where: 'Newer firmware teams; optional after C.', url: 'https://docs.rust-embedded.org/book/', yt: 'embedded Rust tutorial' },

  { n: 'Arduino IDE', c: 'embedded', cost: 'free', what: 'Simplest way to program AVR, ESP32, RP2040 and many boards.', where: 'Prototyping, education, maker products.', url: 'https://www.arduino.cc/en/software', yt: 'Arduino tutorial beginners' },
  { n: 'PlatformIO (VS Code)', c: 'embedded', cost: 'free', what: 'Professional build system for hundreds of boards inside VS Code.', where: 'Moving beyond Arduino IDE; multi-board projects.', url: 'https://platformio.org/', yt: 'PlatformIO VS Code tutorial' },
  { n: 'STM32CubeIDE + CubeMX', c: 'embedded', cost: 'free', what: 'ST\'s IDE with graphical pin/clock/peripheral configuration and HAL code generation.', where: 'Industry standard for STM32 products.', url: 'https://www.st.com/en/development-tools/stm32cubeide.html', yt: 'STM32CubeIDE tutorial' },
  { n: 'ESP-IDF', c: 'embedded', cost: 'free', what: 'Espressif\'s official framework for ESP32 (FreeRTOS-based, Wi-Fi/BLE).', where: 'IoT and connected products.', url: 'https://docs.espressif.com/projects/esp-idf/', yt: 'ESP-IDF getting started' },
  { n: 'Keil MDK / Arm tools', c: 'embedded', cost: 'student', what: 'Arm\'s commercial compiler and IDE (free tier for small code).', where: 'Many Indian and global firms; common in university labs.', url: 'https://www.keil.arm.com/', yt: 'Keil uVision ARM tutorial' },
  { n: 'MPLAB X', c: 'embedded', cost: 'free', what: 'Microchip IDE for PIC, dsPIC and AVR.', where: 'Appliances, power supplies, automotive modules.', url: 'https://www.microchip.com/en-us/tools-resources/develop/mplab-x-ide', yt: 'MPLAB X PIC tutorial' },
  { n: 'Code Composer Studio', c: 'embedded', cost: 'free', what: 'TI IDE for C2000, MSP430 and Sitara.', where: 'Power converters, inverters, EV motor control.', url: 'https://www.ti.com/tool/CCSTUDIO', yt: 'TI C2000 code composer studio tutorial' },
  { n: 'FreeRTOS', c: 'embedded', cost: 'free', what: 'Most widely used real-time OS for MCUs.', where: 'Any firmware with multiple concurrent tasks.', url: 'https://www.freertos.org/', yt: 'FreeRTOS tutorial' },
  { n: 'Zephyr RTOS', c: 'embedded', cost: 'free', what: 'Linux-Foundation RTOS with drivers for hundreds of boards.', where: 'BLE/IoT (Nordic), industrial; fast-growing.', url: 'https://zephyrproject.org/', yt: 'Zephyr RTOS getting started' },

  { n: 'GDB + ST-Link / J-Link', c: 'debug', cost: 'free', what: 'Step through firmware on the chip, inspect registers and memory.', where: 'Daily work of every firmware engineer.', url: 'https://www.segger.com/products/debug-probes/j-link/', yt: 'STM32 debugging breakpoints SWD' },
  { n: 'PulseView / sigrok', c: 'debug', cost: 'free', what: 'Logic-analyser software with protocol decoders (UART, I²C, SPI, CAN…).', where: 'Bring-up and debugging of any digital interface.', url: 'https://sigrok.org/', yt: 'PulseView logic analyzer tutorial' },
  { n: 'Serial terminals (PuTTY, minicom, CoolTerm)', c: 'debug', cost: 'free', what: 'Talk to devices over UART/USB.', where: 'Everyday debugging and configuration.', url: 'https://www.putty.org/', yt: 'serial terminal UART debugging' },
  { n: 'Wireshark', c: 'debug', cost: 'free', what: 'Network packet analyser (also CAN/USB with adapters).', where: 'IoT, networking, MAVLink over UDP.', url: 'https://www.wireshark.org/', yt: 'Wireshark tutorial beginners' },

  { n: 'LTspice', c: 'circuit', cost: 'free', what: 'Fast SPICE simulator with many power-device models.', where: 'Analog and power-supply design everywhere.', url: 'https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html', yt: 'LTspice tutorial' },
  { n: 'ngspice', c: 'circuit', cost: 'free', what: 'Open-source SPICE engine (built into KiCad).', where: 'Simulating directly from your PCB schematic.', url: 'https://ngspice.sourceforge.io/', yt: 'KiCad ngspice simulation' },
  { n: 'Multisim', c: 'circuit', cost: 'student', what: 'NI\'s educational circuit simulator with virtual instruments.', where: 'University labs; teaching.', url: 'https://www.ni.com/en/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-multisim.html', yt: 'Multisim tutorial' },
  { n: 'Proteus', c: 'circuit', cost: 'paid', what: 'Simulates microcontroller firmware together with circuits.', where: 'Embedded prototyping, Indian colleges.', url: 'https://www.labcenter.com/', yt: 'Proteus microcontroller simulation' },
  { n: 'Falstad circuit simulator', c: 'circuit', cost: 'free', what: 'In-browser animated circuit simulator.', where: 'Building intuition quickly.', url: 'https://www.falstad.com/circuit/', yt: 'Falstad circuit simulator' },

  { n: 'Simulink + Simscape Electrical', c: 'power', cost: 'student', what: 'Block-diagram simulation of control + power electronics + machines; code generation.', where: 'EV, aerospace, motor-drive and converter design.', url: 'https://www.mathworks.com/products/simulink.html', yt: 'Simulink Simscape electrical power electronics tutorial' },
  { n: 'PLECS', c: 'power', cost: 'student', what: 'Fast, power-electronics-focused system simulator (thermal too).', where: 'Converter and inverter design companies.', url: 'https://www.plexim.com/', yt: 'PLECS tutorial' },
  { n: 'PSIM', c: 'power', cost: 'student', what: 'Power-electronics and motor-drive simulator.', where: 'Power supplies, drives, education.', url: 'https://altair.com/psim', yt: 'PSIM tutorial buck converter' },
  { n: 'FEMM', c: 'power', cost: 'free', what: '2-D finite-element magnetics and electrostatics.', where: 'Inductor, transformer and motor magnetic design.', url: 'https://www.femm.info/', yt: 'FEMM tutorial motor' },
  { n: 'Ansys Maxwell / Motor-CAD', c: 'power', cost: 'paid', what: 'Industry electromagnetic and electric-machine design suites.', where: 'EV motor and transformer design teams.', url: 'https://www.ansys.com/products/electronics/ansys-motor-cad', yt: 'Ansys Motor-CAD tutorial' },

  { n: 'ETAP', c: 'grid', cost: 'paid', what: 'Power-system analysis: load flow, short circuit, protection coordination, arc flash.', where: 'Utilities, EPC firms, industrial plants (very common in India).', url: 'https://etap.com/', yt: 'ETAP load flow tutorial' },
  { n: 'PSCAD', c: 'grid', cost: 'student', what: 'Electromagnetic-transient simulation of grids, HVDC, renewables.', where: 'Grid integration, HVDC, research.', url: 'https://www.pscad.com/', yt: 'PSCAD tutorial' },
  { n: 'DIgSILENT PowerFactory', c: 'grid', cost: 'paid', what: 'Transmission/distribution planning and stability studies.', where: 'TSOs, utilities, consultants.', url: 'https://www.digsilent.de/en/powerfactory.html', yt: 'PowerFactory tutorial load flow' },
  { n: 'PowerWorld Simulator', c: 'grid', cost: 'student', what: 'Interactive power-flow visualisation; free educational version.', where: 'Teaching and planning studies.', url: 'https://www.powerworld.com/', yt: 'PowerWorld simulator tutorial' },
  { n: 'pandapower / MATPOWER', c: 'grid', cost: 'free', what: 'Open-source power-flow and optimal power-flow in Python / MATLAB.', where: 'Research, scripting studies, learning.', url: 'https://www.pandapower.org/', yt: 'pandapower tutorial power flow' },

  { n: 'KiCad', c: 'pcb', cost: 'free', what: 'Full open-source schematic + PCB + 3-D + SPICE suite.', where: 'Startups, hobby, increasingly industry.', url: 'https://www.kicad.org/', yt: 'KiCad tutorial beginners' },
  { n: 'Altium Designer', c: 'pcb', cost: 'student', what: 'Industry-leading PCB tool (student licences exist).', where: 'Most larger electronics companies.', url: 'https://www.altium.com/', yt: 'Altium Designer tutorial' },
  { n: 'EasyEDA', c: 'pcb', cost: 'free', what: 'Browser-based PCB tool tied to JLCPCB/LCSC parts.', where: 'Quick prototypes with assembly service.', url: 'https://easyeda.com/', yt: 'EasyEDA tutorial' },

  { n: 'Verilog / VHDL', c: 'fpga', cost: 'free', what: 'Hardware description languages for digital circuits.', where: 'FPGA, ASIC/VLSI design and verification.', url: 'https://www.edaplayground.com/', yt: 'Verilog tutorial beginners' },
  { n: 'AMD Vivado', c: 'fpga', cost: 'free', what: 'Synthesis, implementation and simulation for AMD/Xilinx FPGAs (free edition).', where: 'FPGA jobs, defence, telecom, research.', url: 'https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vivado.html', yt: 'Vivado tutorial' },
  { n: 'Intel Quartus Prime', c: 'fpga', cost: 'free', what: 'Toolchain for Intel/Altera FPGAs (Lite edition free).', where: 'FPGA design.', url: 'https://www.intel.com/content/www/us/en/products/details/fpga/development-tools/quartus-prime.html', yt: 'Quartus Prime tutorial' },
  { n: 'Icarus Verilog + GTKWave', c: 'fpga', cost: 'free', what: 'Lightweight open-source Verilog simulator and waveform viewer.', where: 'Learning and verification practice.', url: 'https://steveicarus.github.io/iverilog/', yt: 'Icarus Verilog GTKWave tutorial' },

  { n: 'python-control + SciPy', c: 'math', cost: 'free', what: 'Transfer functions, Bode, root locus, state space in Python.', where: 'Control design without MATLAB.', url: 'https://python-control.readthedocs.io/', yt: 'python control systems library tutorial' },
  { n: 'GNU Octave', c: 'math', cost: 'free', what: 'Free, largely MATLAB-compatible numerical language.', where: 'Running MATLAB-style coursework anywhere.', url: 'https://octave.org/', yt: 'GNU Octave tutorial' },
  { n: 'Scilab / Xcos', c: 'math', cost: 'free', what: 'Free numerical computing with a Simulink-like block editor.', where: 'Education, FOSSEE (IIT Bombay) labs.', url: 'https://www.scilab.org/', yt: 'Scilab Xcos tutorial' },
  { n: 'OpenModelica', c: 'math', cost: 'free', what: 'Equation-based multi-domain modelling (electrical, mechanical, thermal).', where: 'System-level modelling in automotive and energy.', url: 'https://openmodelica.org/', yt: 'OpenModelica tutorial' },

  { n: 'Fusion 360', c: 'mech', cost: 'student', what: 'CAD + CAM + simulation + electronics in one (free for students).', where: 'Product design, drones, enclosures.', url: 'https://www.autodesk.com/products/fusion-360', yt: 'Fusion 360 beginner tutorial' },
  { n: 'SolidWorks', c: 'mech', cost: 'student', what: 'Industry-standard mechanical CAD.', where: 'Manufacturing, automotive, aerospace.', url: 'https://www.solidworks.com/', yt: 'SolidWorks beginner tutorial' },
  { n: 'FreeCAD', c: 'mech', cost: 'free', what: 'Open-source parametric CAD.', where: 'Free alternative for any mechanical design.', url: 'https://www.freecad.org/', yt: 'FreeCAD tutorial beginners' },
  { n: 'Ansys (Mechanical, Fluent)', c: 'mech', cost: 'student', what: 'Structural FEA, CFD, thermal and electromagnetic simulation.', where: 'Aerospace, automotive, electronics cooling.', url: 'https://www.ansys.com/academic/students', yt: 'Ansys student tutorial' },
  { n: 'OpenFOAM', c: 'mech', cost: 'free', what: 'Open-source CFD toolkit.', where: 'Research, aerodynamics, combustion.', url: 'https://www.openfoam.com/', yt: 'OpenFOAM tutorial beginners' },
  { n: 'XFLR5', c: 'mech', cost: 'free', what: 'Airfoil and wing analysis for low-speed aircraft.', where: 'UAV and model-aircraft design.', url: 'https://www.xflr5.tech/xflr5.htm', yt: 'XFLR5 tutorial' },

  { n: 'PLC programming (IEC 61131-3)', c: 'auto', cost: 'free', what: 'Ladder logic, structured text, function blocks — learn with CODESYS (free).', where: 'Factories, process plants, substations, Indian core industry.', url: 'https://www.codesys.com/', yt: 'PLC ladder logic tutorial CODESYS' },
  { n: 'Siemens TIA Portal', c: 'auto', cost: 'paid', what: 'Programming Siemens PLCs, HMIs and drives.', where: 'Very common in Indian and European plants.', url: 'https://www.siemens.com/tia-portal', yt: 'TIA Portal tutorial' },
  { n: 'LabVIEW', c: 'auto', cost: 'student', what: 'Graphical programming for test, measurement and instrument control.', where: 'Test benches, labs, R&D.', url: 'https://www.ni.com/en/shop/labview.html', yt: 'LabVIEW tutorial beginners' },

  { n: 'Linux (Ubuntu) + shell', c: 'robotics', cost: 'free', what: 'The operating system of servers, robots and embedded Linux.', where: 'Robotics, embedded Linux, any software role.', url: 'https://ubuntu.com/', yt: 'Linux command line for beginners' },
  { n: 'ROS 2', c: 'robotics', cost: 'free', what: 'Middleware and tools for robot software (nodes, topics, navigation).', where: 'Robotics, autonomous vehicles, drones.', url: 'https://docs.ros.org/', yt: 'ROS 2 tutorial beginners' },
  { n: 'Gazebo', c: 'robotics', cost: 'free', what: 'Physics simulator for robots with sensors.', where: 'Testing robot software before hardware.', url: 'https://gazebosim.org/', yt: 'Gazebo simulation tutorial' },
  { n: 'OpenCV', c: 'robotics', cost: 'free', what: 'Computer-vision library (C++/Python).', where: 'Inspection, robotics, drones, medical imaging.', url: 'https://opencv.org/', yt: 'OpenCV Python tutorial' },
  { n: 'PyTorch', c: 'robotics', cost: 'free', what: 'Deep-learning framework.', where: 'AI/ML roles, perception, predictive maintenance.', url: 'https://pytorch.org/', yt: 'PyTorch beginner tutorial' },
  { n: 'Docker', c: 'robotics', cost: 'free', what: 'Package software and its environment into containers.', where: 'Reproducible robotics/AI setups, deployment.', url: 'https://www.docker.com/', yt: 'Docker tutorial beginners' },

  { n: 'Git + GitHub', c: 'workflow', cost: 'free', what: 'Version control and collaboration.', where: 'Every engineering team; your portfolio lives here.', url: 'https://git-scm.com/', yt: 'Git and GitHub for beginners' },
  { n: 'VS Code', c: 'workflow', cost: 'free', what: 'Editor for every language with debuggers and extensions.', where: 'Default editor across industry.', url: 'https://code.visualstudio.com/', yt: 'VS Code tutorial' },
  { n: 'Jupyter + NumPy/pandas/Matplotlib', c: 'workflow', cost: 'free', what: 'Notebooks for data analysis and plotting.', where: 'Log analysis, test reports, research.', url: 'https://jupyter.org/', yt: 'Jupyter numpy pandas matplotlib tutorial' },
  { n: 'LaTeX / Overleaf', c: 'workflow', cost: 'free', what: 'Professional reports, papers and theses with equations.', where: 'Project reports, research papers.', url: 'https://www.overleaf.com/', yt: 'Overleaf LaTeX tutorial' },
  { n: 'Excel / Google Sheets', c: 'workflow', cost: 'free', what: 'Budgets, BOMs, quick calculations, plots.', where: 'Every company, every day.', url: 'https://www.google.com/sheets/about/', yt: 'Excel for engineers' },

  { n: 'Mission Planner / QGroundControl', c: 'drone', cost: 'free', what: 'Ground-control stations for ArduPilot / PX4.', where: 'UAV operations and testing.', url: 'https://ardupilot.org/planner/', yt: 'Mission Planner tutorial' },
  { n: 'Betaflight Configurator', c: 'drone', cost: 'free', what: 'Set up and tune FPV flight controllers.', where: 'FPV builds.', url: 'https://betaflight.com/', yt: 'Betaflight configurator setup' },
  { n: 'ArduPilot / PX4 SITL', c: 'drone', cost: 'free', what: 'Run real autopilot code in simulation.', where: 'UAV software development.', url: 'https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html', yt: 'ArduPilot SITL tutorial' },
];

export const ROADMAP = [
  { when: 'Now (2nd year)', items: ['C (pointers, structs, bit operations)', 'Python + NumPy/Matplotlib', 'Git + GitHub', 'Arduino → STM32CubeIDE', 'LTspice', 'KiCad basics', 'MATLAB or Octave/python-control for your control course'] },
  { when: '3rd year', items: ['Simulink (+ Simscape Electrical) or PLECS/PSIM', 'FreeRTOS + logic-analyser debugging', 'Linux command line', 'One specialisation track below', 'Fusion 360 for enclosures/frames'] },
  { when: 'Final year / internships', items: ['Go deep in your chosen track\'s paid tools (student licences)', 'Build 2–3 portfolio projects end-to-end', 'Write reports in LaTeX; keep everything on GitHub'] },
];

export const TRACKS_CAREER = [
  ['Embedded / avionics', 'C, STM32 + CubeIDE, FreeRTOS/Zephyr, KiCad/Altium, GDB, logic analyser, CAN'],
  ['Power electronics & EV', 'LTspice, PLECS/PSIM or Simulink/Simscape, TI C2000 + CCS, FEMM/Motor-CAD, CAN'],
  ['Power systems & renewables', 'ETAP, PSCAD, PowerFactory/PowerWorld, pandapower, Python, Excel'],
  ['Robotics / drones / autonomy', 'C++, Python, Linux, ROS 2, Gazebo, OpenCV, PyTorch, SITL'],
  ['VLSI / FPGA', 'Verilog/SystemVerilog, Vivado/Quartus, Icarus + GTKWave, Linux, Python/TCL scripting'],
  ['Industrial automation', 'PLC (CODESYS, TIA Portal), SCADA/HMI, LabVIEW, industrial networks'],
];
