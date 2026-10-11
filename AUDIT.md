# Audit of the original AeroNet app (commit 43349bb)

This is what was wrong with the version Gemini generated, and what was done about it.

## Code bugs

| # | Bug | Effect | Fix |
|---|-----|--------|-----|
| 1 | Progress (unlocked levels, XP) lived only in React state | Refresh or closing the app wiped all progress | Progress, quiz scores and lab checklists saved to `localStorage` (wrapped in try/catch so private-mode browsers don't crash) |
| 2 | Service worker served `/` and `index.html` **cache-first** forever | After any new Netlify deploy, phones that installed the PWA kept the old `index.html`, which points at old hashed JS files that no longer exist. Netlify's `/* → /index.html` rewrite then returns HTML for the JS request → blank white screen | Network-first for page navigations, cache-first only for hashed `/assets/*`, cache version bump + old-cache cleanup |
| 3 | Gemini API key read from `VITE_GEMINI_API_KEY` | Every `VITE_` variable is baked into the public JS bundle, so anyone could copy the key from the site | Key moved to a Netlify Function (`netlify/functions/tutor.mjs`); the browser never sees it |
| 4 | Gemini model hard-coded to `gemini-1.5-flash` | Gemini 1.5 models have been retired, so the tutor always returned the generic error | Model name is now an environment variable with a current default; real API error messages are shown |
| 5 | Exam "Review Previous Answers" after passing | Answers aren't stored, so the review showed `Your Answer: undefined`, `SCORE 0/3` and "Clearance Denied" on a module you had passed | Last attempt is persisted; review shows the real attempt |
| 6 | Exam required 100% and gave no explanations | You learn nothing from a wrong answer except which option was right | Every question now has a worked explanation; pass mark is 80%; questions reshuffle on retry |
| 7 | "Video" cards were not links, and titles/channels/durations were invented (stock Unsplash photos as thumbnails) | Clicking did nothing; several "videos" don't exist | Replaced with real, checked resources (official docs, textbooks, named course series). YouTube items open a search for the named series rather than a guessed video ID |
| 8 | `maximum-scale=1, user-scalable=no` in the viewport | You couldn't pinch-zoom equations or diagrams on a phone | Removed |
| 9 | Module view height fixed to `100vh - 100px` with the sidebar stacked on top | On phones the reading area was a few hundred pixels tall | Layout rebuilt mobile-first; content scrolls with the page |
| 10 | SVG diagrams with fixed pixel widths (500–600 px) | Diagrams overflowed or got clipped on phones | All diagrams scale with `viewBox` + `width:100%` |
| 11 | Hover-only "INIT UPLINK" / "MODULE CLEARED" labels | Invisible on touch screens | Always-visible status chips |
| 12 | Clicking a locked node did nothing | Looked broken | Shows what you need to pass to unlock it, plus an "unlock all (study mode)" switch |
| 13 | Google Fonts loaded twice (in `index.html` and again from a `useEffect`) | Duplicate network request; the effect also removed the font on unmount in StrictMode | Loaded once in `index.html` |
| 14 | "Offline Protocol" downloaded `JSON.stringify(curriculumData)` | The file contained serialized React elements, i.e. unreadable junk | Real offline support via the service worker, plus a print-friendly module view (Print → Save as PDF) |
| 15 | No deep links | Couldn't share or bookmark a module | Hash routes, e.g. `#/m/control` |

## Content errors

| Module | Original claim | Problem | Corrected to |
|--------|----------------|---------|--------------|
| ESC | Gate driver pushes the MOSFET "into the Ohmic/**Linear** region"; exam: "fully **saturate** the MOSFET gate" | Mixes BJT and MOSFET vocabulary. For a MOSFET, *saturation* is the constant-current (amplifier) region, i.e. exactly where you **don't** want a switch. "Linear mode" in power-electronics also means that lossy region | A fully-on switch sits in the **ohmic (triode) region**. The driver's real jobs: enough V_GS (≈10 V) to minimise R_DS(on), amps of peak gate current to charge Q_g fast, and bootstrap level-shifting for the high side |
| ESC | R_DS(on) "in the sub-milliohm range (e.g. 0.8 mΩ)" | Typical small-drone ESC FETs are roughly 1–5 mΩ | Corrected, with a worked loss calculation |
| ESC | Dead-time is "a microsecond delay" | ESC dead-times are typically tens to hundreds of **nanoseconds** | Corrected |
| ESC | Recommends **BLHeliSuite32 / BLHeli_32** | BLHeli_32 was discontinued in 2024 | Current options: **Bluejay** (BLHeli_S hardware), **AM32** (open-source 32-bit), configured from the web ESC Configurator |
| RF | Transmitter "encodes digital **SPI** data (stick positions)" | Stick gimbals are read by an ADC/Hall sensors; the radio talks to the TX module over a **UART** protocol (CRSF) | Corrected signal chain |
| RF | ExpressLRS binding phrase makes TX/RX "**cryptographically** lock" | The phrase is hashed into a link UID. ELRS is **not encrypted** | Corrected |
| RF | 900 MHz recommended generically | In India the licence-exempt sub-GHz band is **865–867 MHz**; 915 MHz-band hardware is not legal to use there | India-specific band note added |
| RF | FSPL formula with no units | Formula is only valid with d in metres and f in Hz | Units added + interactive link-budget calculator |
| RF | +10 dB → range "roughly doubles/triples" | It's exactly √10 ≈ 3.16× in free space | Precise answer + derivation |
| Aero | eCalc: "hover throttle over 50% is sluggish, 30–40% ideal for freestyle" | 5" freestyle quads typically hover around 20–30%; ~50% is normal for heavy camera/endurance builds | Corrected with thrust-to-weight reasoning |
| Aero | CW/CCW pairs cancel "gyroscopic precession and reactive torque" | The main reason is cancelling **reaction (drag) torque**; net angular momentum cancelling is a secondary benefit | Clarified |
| Sensor fusion | Complementary filter presented as the whole story | Accelerometer can't correct **yaw** (gravity has no heading info); the accel angle is only valid when not accelerating | Added magnetometer/GNSS yaw, Mahony, Kalman/EKF, and what PX4/ArduPilot actually run |
| PID | Single PID loop | Real flight controllers run **cascaded** loops (angle → rate), with D-term filtering, anti-windup, feedforward | Full cascade, discrete-time code, and a live step-response simulator |

## What was missing entirely

Flight physics beyond T = kΩ² (momentum theory, hover power, figure of merit), rigid-body dynamics and the mixer **matrix**, BLDC motor equations (KV, Kt, back-EMF), batteries and power distribution, sensors in depth, Kalman filtering, digital filtering/FFT/RPM filters, flight-controller firmware architecture (Betaflight vs ArduPilot vs PX4), airframe and mechanical design, a full **sizing workflow**, autonomy (MAVLink, ROS 2, companion computers), testing and safety, India's drone regulations, and career/portfolio guidance. All are now modules.
