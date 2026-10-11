# AeroNet [B.Tech EEE Drone Academy] 🛸

An interactive educational platform designed for 2nd-year B.Tech Electrical & Electronics Engineering (EEE) students mastering drone flight dynamics, motor matrices, power electronics, embedded sensor fusion, control systems (PID), and RF telemetry.

## Features

- **Cyberpunk HUD & Interactive Map**: Visual learning progression with locked and unlocked nodes.
- **5 Comprehensive Modules**:
  1. Aerodynamics & Motor Matrix
  2. Power Electronics: MOSFETs to ESCs
  3. Embedded MCU & Sensor Fusion (MPU6050, SPI/I2C, Complementary Filter)
  4. Control Systems (PID Tuning & Step Response)
  5. RF Communication & Antenna Design
- **Handwritten Engineering Derivations**: Step-by-step vector mechanics and equations rendered in real-time.
- **Interactive Technical Assessments**: Multiple-choice exams at each level to unlock subsequent data tiers.
- **Gemini AI Uplink**: Built-in AI engineering tutor for on-demand explanations.
- **Offline Protocol**: Backup and study the curriculum offline.

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bhaveshkankatala-blip/drone-academy.git
   cd drone-academy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up Gemini AI Assistant:
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Launch the local development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
