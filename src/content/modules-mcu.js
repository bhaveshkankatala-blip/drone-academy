// Microcontrollers in depth (general embedded systems, not drone-only).
export const moduleMcu = {
  id: 'mcu',
  title: 'Microcontrollers & Embedded Programming',
  tag: 'Microprocessors & Embedded Systems',
  eee: 'The skill behind every drone, EV, inverter, appliance and IoT product',
  color: '#38bdf8',
  mins: 240,
  summary: 'How a microcontroller works inside, and how to program its peripherals: GPIO and interrupts, timers and PWM, ADC, UART/SPI/I²C/CAN, DMA, clocks and low power; bare-metal vs HAL vs RTOS; choosing a family (AVR, STM32, ESP32, RP2040, C2000); and the debugging tools industry uses.',
  outcomes: [
    'Explain the blocks inside an MCU and how code, memory and peripherals interact.',
    'Configure a timer for a given PWM frequency/duty and an ADC for a given resolution.',
    'Choose UART, I²C, SPI or CAN for a job and estimate transfer times.',
    'Structure firmware with interrupts, DMA and an RTOS, and debug it with SWD and a logic analyser.',
  ],
  sections: [
    { h: 'What is inside a microcontroller', body: `[[fig:mcuarch]]

A microcontroller (MCU) is a whole computer on one chip: a **CPU core** (ARM Cortex-M in most modern parts; AVR in classic Arduinos; RISC-V and Xtensa in ESP32 variants), **Flash** for the program, **SRAM** for variables and the stack, and **peripherals** that do hardware jobs in parallel with the CPU. A **bus matrix** connects them; **DMA** moves data between peripherals and memory without the CPU; the **clock tree** (internal RC or external crystal → PLL) sets every speed.

Compared with a microprocessor (the chip in a phone or Raspberry Pi), an MCU has no MMU and usually no full operating system, but it boots in milliseconds, uses milliwatts, and responds to events in microseconds — exactly what control loops, motor drives and sensors need.` },
    { h: 'From reset to main(): memory and boot', body: `On reset the core reads the **vector table** at the start of Flash: the initial stack pointer and the address of the reset handler. Startup code copies initialised variables to SRAM, zeroes the rest (.bss), sets up clocks, then calls \`main()\`.

| Section | Lives in | Holds |
|---|---|---|
| .text | Flash | your code, constants |
| .data | Flash → copied to SRAM | initialised globals |
| .bss | SRAM | zero-initialised globals |
| stack | SRAM (top) | local variables, return addresses |
| heap | SRAM | \`malloc\` — avoid in real-time firmware |

Memory-mapped I/O: every peripheral is a set of **registers** at fixed addresses. Writing \`GPIOA->ODR |= (1 << 5);\` sets pin PA5 high — that is all a "digitalWrite" really does underneath.` },
    { h: 'GPIO and interrupts', body: `[[fig:interrupt]]

A GPIO pin can be input (with pull-up/down), push-pull output, open-drain output (needed for I²C), analog, or an **alternate function** (UART TX, timer channel…). Check the current a pin can source (typically a few mA to ~20 mA) — drive LEDs through resistors and anything bigger through a transistor or MOSFET driver.

**Interrupts** let hardware events (pin edge, timer overflow, byte received) run an **ISR** immediately. The **NVIC** on Cortex-M handles priorities and nesting. Rules of thumb: keep ISRs short, set a flag or push to a queue, never block or print in an ISR, and mark shared variables \`volatile\` (and protect multi-byte ones from tearing).

**Polling vs interrupts vs DMA:** polling wastes CPU waiting; interrupts react quickly per event; DMA moves whole buffers with one interrupt at the end — the professional choice for ADC streams, SPI sensors and UART logs.` },
    { h: 'Timers and PWM', body: `[[fig:timerpwm]]

A timer counts clock ticks after a **prescaler** (PSC) and wraps at the **auto-reload** value (ARR). Uses: periodic interrupts (the 1 kHz control loop), **PWM** generation (motors, LEDs, servos, power converters), **input capture** (measure pulse widths, RPM), **encoder mode** (quadrature encoders), and triggers for the ADC.

$$f_{PWM} = \\frac{f_{timer}}{(PSC+1)(ARR+1)}, \\qquad D = \\frac{CCR}{ARR+1}, \\qquad \\text{resolution} = \\log_2(ARR+1)\\ \\text{bits}$$

Advanced-control timers (TIM1/TIM8 on STM32) add **complementary outputs with dead-time** and a **break input** for over-current shutdown — that's how motor drives and inverters are built (directly connects to the ESC module).` },
    { h: 'ADC: reading the analog world', body: `A successive-approximation ADC converts a voltage to an $N$-bit number: $\\text{code} = V_{in}/V_{ref} \\times (2^N - 1)$, so one LSB $= V_{ref}/2^N$.

Practical points: sample time must let the internal sample capacitor charge through your source impedance; use an RC filter close to the pin; trigger conversions from a timer for evenly spaced samples (essential for control and FFTs); use DMA for continuous scans; oversample and average to gain effective bits. For current sensing in motor drives, the ADC is synchronised to the PWM centre to avoid switching noise.` },
    { h: 'Serial buses: UART, I²C, SPI, CAN', body: `[[fig:buses]]

| Bus | Wires | Speed | Topology | Typical use |
|---|---|---|---|---|
| UART | TX, RX (+GND) | 9.6 k–3 Mbit/s | point-to-point, no clock | GPS, debug console, Bluetooth/LoRa modules, RS-485 with a transceiver |
| I²C | SDA, SCL (pull-ups) | 100 k / 400 k / 1 M+ | multi-device, 7-bit addresses | sensors, EEPROM, small displays |
| SPI | SCK, MOSI, MISO, CS per device | 1–50 MHz | one master, many slaves | IMUs, SD cards, displays, external ADCs, flash |
| CAN | CAN-H, CAN-L (differential) | 125 k–1 Mbit/s (CAN-FD faster) | multi-master bus, priority arbitration | cars, EV battery systems, industrial, larger drones |
| USB | D+, D− | 12 Mbit/s+ | host/device | PC connection, mass storage |

UART frames add start and stop bits (8N1 = 10 bits per byte). I²C needs pull-up resistors and is sensitive to bus capacitance. SPI is fastest and simplest but needs a chip-select per device. CAN is robust to noise and is the backbone of automotive and industrial electronics — worth learning for EV and power-electronics jobs.` },
    { h: 'Bare-metal, HAL, or RTOS?', body: `- **Register-level (bare-metal)**: you write registers directly. Fastest and smallest; teaches you how hardware really works. Good for learning and tight ISRs.
- **Vendor HAL / LL libraries** (STM32 HAL, ESP-IDF drivers, Pico SDK): portable and quick to start; generated by tools like **STM32CubeMX**. Most companies use these.
- **Arduino framework**: fastest prototyping, huge library ecosystem; hides timing details you will eventually need.
- **RTOS** (FreeRTOS, Zephyr, ChibiOS, NuttX): tasks with priorities, queues, semaphores, timers. Use once you have several independent activities (control loop, comms, logging, UI). Learn priority inversion, stack sizing and why a 1 kHz loop should not depend on a blocking print.
- **Embedded Linux** (Raspberry Pi, BeagleBone, i.MX): when you need networking, cameras, files and Python — paired with an MCU for hard real-time.

A good industry pattern: MCU does deterministic real-time work; Linux computer does high-level work; they talk over UART/SPI/CAN/Ethernet.` },
    { h: 'Choosing a microcontroller family', body: `| Family | Strength | Typical use | Tools |
|---|---|---|---|
| AVR (ATmega328P, Arduino Uno) | simple, 5 V, huge community | learning, simple controllers | Arduino IDE, Microchip Studio |
| STM32 (F0…H7) | widest range, strong peripherals, industry standard | drones, motor control, industrial, medical | STM32CubeIDE/CubeMX, Keil, PlatformIO |
| ESP32 family | Wi-Fi + Bluetooth built in, cheap | IoT, connected products | ESP-IDF, Arduino-ESP32 |
| RP2040 / RP2350 (Raspberry Pi Pico) | cheap, PIO state machines, great docs | education, custom protocols | Pico SDK, MicroPython |
| nRF52 / nRF53 | Bluetooth Low Energy, ultra-low power | wearables, sensors | nRF Connect SDK (Zephyr) |
| TI C2000 | DSP-style real-time control, high-resolution PWM | power converters, inverters, EV drives | Code Composer Studio |
| PIC / dsPIC | long-lived industrial parts | appliances, power supplies | MPLAB X |

Choose by: peripherals you need (PWM channels, ADC speed, CAN, USB), memory, power budget, package you can solder, toolchain quality, availability and price. For an EEE student aiming at power electronics/EVs, add **C2000** after STM32.` },
    { h: 'Debugging like a professional', body: `- **SWD/JTAG debugger** (ST-Link, J-Link, CMSIS-DAP) with **GDB** in your IDE: breakpoints, single-step, watch variables and registers, view peripherals live.
- **Logic analyser** (cheap 8-channel + PulseView/sigrok, or Saleae): decode UART/I²C/SPI/CAN on real wires. Most "my sensor doesn't work" bugs are found here in minutes.
- **Oscilloscope**: analog truth — PWM edges, ringing, supply noise, ADC inputs.
- **Toggle a GPIO** at the start and end of a function and scope it to measure execution time and jitter.
- **Serial logs** (UART/USB, or SEGGER RTT) — rate-limited, never inside ISRs.
- **Static analysis and unit tests** on the PC for pure logic (filters, parsers), hardware-in-the-loop for the rest.` },
  ],
  numericals: [
    { q: 'An STM32 timer runs at 72 MHz. Configure it for 20 kHz PWM at 25% duty. What resolution do you get?', steps: ['(PSC+1)(ARR+1) = 72×10⁶ / 20×10³ = 3600 → choose **PSC = 0, ARR = 3599**.', '25% duty → CCR = 0.25 × 3600 = **900**.', 'Resolution = log₂(3600) ≈ **11.8 bits**.'], answer: 'PSC 0, ARR 3599, CCR 900; ≈ 11.8-bit resolution', why: '20 kHz keeps switching above hearing — standard for motor drives.' },
    { q: 'Generate a 50 Hz servo signal with a 1.5 ms pulse from the same 72 MHz timer.', steps: ['Pick PSC = 71 → 72 MHz / 72 = **1 MHz** tick (1 µs per count).', 'Period 20 ms → ARR + 1 = 20,000 → **ARR = 19999**.', '1.5 ms pulse → **CCR = 1500**.'], answer: 'PSC 71, ARR 19999, CCR 1500', why: 'A 1 µs tick makes pulse widths easy to read in code.' },
    { q: 'A 12-bit ADC with V_ref = 3.3 V reads 2482. What is the input voltage and the LSB size?', steps: ['LSB = 3.3 / 4096 = **0.806 mV**.', 'V = 2482 × 3.3 / 4095 = **2.00 V**.'], answer: '≈ 2.00 V; LSB ≈ 0.81 mV', why: 'Combine with a divider (PCB module) to read battery voltage.' },
    { q: 'At 115200 baud, 8N1, how long does one byte take and how long is a 100-byte GPS message?', steps: ['8N1 = 10 bits per byte → 115200/10 = 11,520 bytes/s.', 'One byte = **86.8 µs**; 100 bytes = **8.7 ms**.'], answer: '86.8 µs per byte; 8.7 ms per message', why: 'At 10 Hz GPS that is 9% of the time — use DMA + idle-line detection rather than per-byte interrupts.' },
    { q: 'Reading 6 data bytes from an I²C sensor at 400 kHz needs: address+W, register, repeated-start address+R, then 6 data bytes. Estimate the transfer time (9 bits per byte incl. ACK).', steps: ['Bytes on the bus = 1 + 1 + 1 + 6 = 9 → 9 × 9 = 81 bits.', 't ≈ 81 / 400,000 = **0.20 ms** (+ start/stop overhead).'], answer: '≈ 0.2 ms', why: 'Fine for a magnetometer at 100 Hz, too slow for an 8 kHz gyro — hence SPI.' },
    { q: 'A 480 MHz MCU runs an 8 kHz ISR that takes 3 µs. What fraction of CPU time does it use, and how many cycles is that per call?', steps: ['CPU load = 3 µs × 8000 /s = 24 ms per second = **2.4%**.', 'Cycles = 3×10⁻⁶ × 480×10⁶ = **1440 cycles** per call.'], answer: '2.4% load; 1440 cycles', why: 'Profiling ISRs this way tells you how much headroom is left for everything else.' },
  ],
  practice: [
    { book: 'Joseph Yiu — The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors (Newnes)', where: 'Architecture, exceptions/NVIC, memory map chapters', note: 'How the core really works.' },
    { book: 'Carmine Noviello — Mastering STM32 (Leanpub)', where: 'GPIO, timers, ADC, DMA, UART/SPI/I²C, FreeRTOS chapters', note: 'Hands-on with CubeMX/HAL — closest to industry practice.' },
    { book: 'Elecia White — Making Embedded Systems (O\'Reilly)', where: 'Whole book', note: 'Architecture, debugging and good habits; language-agnostic.' },
    { book: 'Mazidi et al. — The AVR Microcontroller and Embedded Systems', where: 'Timer, ADC and serial chapters', note: 'Common in Indian syllabi; great for register-level exercises.' },
  ],
  lab: { title: 'From blink to a sensor over SPI on an STM32', kit: ['STM32 Nucleo or Black Pill board (or Raspberry Pi Pico / ESP32 as alternatives)', 'STM32CubeIDE (free)', 'MPU-6050 or ICM-42688 breakout', 'Cheap 8-channel logic analyser + PulseView'], steps: ['Blink an LED by writing GPIO registers directly, then with HAL. Compare.', 'Configure a timer for 1 kHz interrupts and toggle a pin; measure jitter with the logic analyser.', 'Generate 20 kHz PWM at variable duty from a potentiometer read by the ADC (timer-triggered + DMA).', 'Print over UART with DMA; decode it on the logic analyser.', 'Read an IMU over SPI (or I²C), decode the transaction, and convert to physical units.', 'Stretch: move the tasks into FreeRTOS (control task at 1 kHz, logging task at 50 Hz).'], deliverable: 'Repo with each step as a tagged commit + logic-analyser screenshots.' },
  industry: ['Embedded C (and C++)', 'STM32 + CubeMX/HAL', 'Interrupts, DMA, timers', 'RTOS (FreeRTOS/Zephyr)', 'Debuggers + logic analysers', 'CAN for automotive/EV'],
  sim: null,
  resources: [
    { kind: 'tool', t: 'STM32CubeIDE', by: 'STMicroelectronics (free)', url: 'https://www.st.com/en/development-tools/stm32cubeide.html' },
    { kind: 'docs', t: 'FreeRTOS documentation', by: 'freertos.org', url: 'https://www.freertos.org/' },
    { kind: 'docs', t: 'Raspberry Pi Pico / RP2040 documentation', by: 'Raspberry Pi', url: 'https://www.raspberrypi.com/documentation/microcontrollers/' },
    { kind: 'docs', t: 'ESP-IDF programming guide', by: 'Espressif', url: 'https://docs.espressif.com/projects/esp-idf/' },
    { kind: 'tool', t: 'PulseView / sigrok (logic analyser software)', by: 'sigrok.org', url: 'https://sigrok.org/' },
    { kind: 'video', t: 'Digi-Key — Introduction to RTOS (Shawn Hymel)', by: 'YouTube search', yt: 'Digi-Key Introduction to RTOS Shawn Hymel' },
    { kind: 'video', t: 'STM32 tutorials (HAL, timers, DMA)', by: 'YouTube search', yt: 'Controllers Tech STM32 timer PWM DMA tutorial' },
    { kind: 'video', t: 'Bare-metal STM32 from scratch', by: 'YouTube search', yt: 'bare metal STM32 programming registers tutorial' },
    { kind: 'video', t: 'NPTEL — Embedded Systems Design', by: 'YouTube search', yt: 'NPTEL embedded systems design microcontroller' },
  ],
  shorts: ['microcontroller explained', 'PWM explained', 'SPI vs I2C vs UART'],
  reels: [
    { front: 'PWM frequency formula', back: 'f = f_timer / ((PSC+1)(ARR+1)); duty = CCR/(ARR+1).' },
    { front: 'UART 8N1 bytes per second at 115200?', back: '11,520 (10 bits per byte).' },
    { front: 'Why `volatile`?', back: 'Tells the compiler a variable can change outside normal flow (ISR, hardware) so it must re-read it.' },
    { front: 'I²C needs which extra parts?', back: 'Pull-up resistors on SDA and SCL (open-drain bus).' },
    { front: 'When to add an RTOS?', back: 'When several independent activities with different rates and priorities must run reliably.' },
    { front: 'MCU for power converters / EV drives?', back: 'TI C2000 (and STM32G4) — high-resolution PWM and fast control loops.' },
  ],
  quiz: [
    { q: 'Where does a Cortex-M MCU find its first instruction after reset?', o: ['At address 0 of SRAM', 'From the reset vector in the vector table', 'From the bootloader on the PC', 'Randomly'], a: 1, e: 'The vector table holds the initial stack pointer and the reset handler address.' },
    { q: 'Which bus is best for a 1 MHz-rate IMU next to the MCU?', o: ['UART', 'I²C at 100 kHz', 'SPI', 'CAN'], a: 2, e: 'SPI runs at MHz clock rates with no addressing overhead.' },
    { q: 'A 16-bit timer at 16 MHz with PSC = 15 and ARR = 999 produces…', o: ['16 kHz', '1 kHz', '1 MHz', '100 Hz'], a: 1, e: '16 MHz / (16 × 1000) = 1 kHz.' },
    { q: 'What should an ISR NOT do?', o: ['Set a flag', 'Clear the interrupt source', 'Block waiting or print long strings', 'Read a register'], a: 2, e: 'Long or blocking work delays other interrupts and the main loop.' },
    { q: 'DMA is used to…', o: ['Increase CPU clock', 'Move data between peripherals and memory without the CPU', 'Encrypt data', 'Debug code'], a: 1, e: 'It frees the CPU and reduces jitter.' },
    { q: 'Which bus uses differential signalling and priority arbitration, standard in cars and EVs?', o: ['I²C', 'SPI', 'CAN', 'UART'], a: 2, e: 'CAN is robust to noise and lets many nodes share one bus.' },
    { q: 'A 10-bit ADC with 5 V reference has an LSB of about…', o: ['4.9 mV', '1.2 mV', '0.5 mV', '10 mV'], a: 0, e: '5 / 1024 ≈ 4.9 mV.' },
    { q: 'Complementary PWM with dead-time on advanced timers is mainly for…', o: ['LED dimming', 'Driving half-bridges in motor drives and inverters', 'UART', 'ADC sampling'], a: 1, e: 'Dead-time prevents shoot-through in the bridge.' },
    { q: 'Why mark a variable shared with an ISR as `volatile`?', o: ['To make it faster', 'So the compiler doesn\'t cache it in a register and miss updates', 'To store it in Flash', 'For encryption'], a: 1, e: 'Without it, optimised code may never see the ISR\'s change.' },
    { q: 'Best tool to see why an I²C sensor doesn\'t respond?', o: ['Multimeter only', 'Logic analyser decoding the bus', 'Reinstall the IDE', 'Increase baud rate'], a: 1, e: 'You can see the address, ACK/NACK and timing directly.' },
  ],
};
