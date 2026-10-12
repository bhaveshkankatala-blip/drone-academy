// One-page formula sheet, grouped by module. tex = KaTeX source.
export const FORMULAS = [
  { id: 'physics', items: [
    ['Prop thrust / power', String.raw`T = C_T\rho n^2D^4,\quad P = C_P\rho n^3D^5`, 'n in rev/s'],
    ['Induced velocity', String.raw`v_i = \sqrt{T/(2\rho A)}`, 'momentum theory'],
    ['Ideal hover power', String.raw`P = T^{3/2}/\sqrt{2\rho A}`, '÷FM, ÷η for electrical'],
    ['Disk loading', String.raw`DL = T/A`, 'N/m²'],
  ] },
  { id: 'dynamics', items: [
    ['X-quad arm', String.raw`d = L/\sqrt2`, ''],
    ['Rotational dynamics', String.raw`J\dot{\omega} = \tau - \omega\times J\omega`, ''],
    ['Hover linearisation', String.raw`\ddot x \approx -g\theta,\;\ddot y \approx g\phi`, ''],
  ] },
  { id: 'motors', items: [
    ['Torque constant', String.raw`K_t = 60/(2\pi K_V) \approx 9.549/K_V`, 'N·m/A'],
    ['Motor model', String.raw`V = IR + E,\; \text{rpm} = K_V E,\; \tau = K_t(I-I_0)`, ''],
    ['Peak-efficiency current', String.raw`I \approx \sqrt{I_0V/R}`, ''],
    ['Electrical frequency', String.raw`f_e = p_{pairs}\cdot \text{rpm}/60`, ''],
  ] },
  { id: 'esc', items: [
    ['Conduction loss', String.raw`P = I_{rms}^2 R_{DS(on)}`, ''],
    ['Switching loss', String.raw`P_{sw} = \tfrac12 V I (t_r+t_f) f_{sw}`, ''],
    ['Gate drive', String.raw`P_g = Q_gV_{GS}f_{sw},\; I_g \approx Q_g/t`, ''],
  ] },
  { id: 'power', items: [
    ['Pack under load', String.raw`V = NE - I(NR_{cell}+R_w)`, ''],
    ['Flight time', String.raw`t = u\,C_{Ah}/I_{avg}`, 'u ≈ 0.8'],
    ['Energy', String.raw`E_{Wh} = N\cdot 3.7\cdot C_{Ah}`, ''],
    ['C-rate', String.raw`C = I/C_{Ah}`, ''],
  ] },
  { id: 'sensing', items: [
    ['Complementary filter', String.raw`\hat\theta_k = \alpha(\hat\theta_{k-1}+\omega\Delta t)+(1-\alpha)\theta_{acc}`, ''],
    ['Its time constant', String.raw`\tau = \alpha\Delta t/(1-\alpha),\; f_c = 1/(2\pi\tau)`, ''],
    ['Kalman gain (1-D)', String.raw`K = P^-/(P^-+R)`, ''],
    ['Tilt from accel', String.raw`\phi = \operatorname{atan2}(a_y,a_z)`, ''],
  ] },
  { id: 'control', items: [
    ['PID', String.raw`u = K_pe + K_i\!\int e\,dt + K_d\,\dot e`, 'D on measurement'],
    ['Overshoot', String.raw`M_p = e^{-\zeta\pi/\sqrt{1-\zeta^2}}`, ''],
    ['Settling (2%)', String.raw`t_s \approx 4/(\zeta\omega_n)`, ''],
    ['Delay → phase', String.raw`\phi = 360^\circ f t_d`, ''],
  ] },
  { id: 'firmware', items: [
    ['Nyquist', String.raw`f_N = f_s/2`, ''],
    ['Motor noise', String.raw`f_1 = \text{rpm}/60,\; f_{bp} = N_b f_1`, ''],
    ['PT1 delay', String.raw`\tau_g \approx 1/(2\pi f_c)`, ''],
  ] },
  { id: 'rf', items: [
    ['dBm', String.raw`P_{dBm} = 10\log_{10}P_{mW}`, ''],
    ['Path loss', String.raw`FSPL = 20\log d + 20\log f - 147.55`, 'd in m, f in Hz'],
    ['Link budget', String.raw`P_{rx} = P_{tx}+G_{tx}+G_{rx}-L-FSPL`, ''],
    ['Range scaling', String.raw`d \propto 10^{\Delta dB/20}`, '+6 dB → ×2'],
  ] },
  { id: 'autonomy', items: [
    ['Stopping distance', String.raw`d = v^2/(2a)`, ''],
    ['Leg energy', String.raw`E = P\,d/v`, ''],
  ] },
  { id: 'fixedwing', items: [
    ['Lift', String.raw`L = \tfrac12\rho V^2SC_L`, ''],
    ['Stall speed', String.raw`V_s = \sqrt{2W/(\rho SC_{L,max})}`, ''],
    ['Cruise power', String.raw`P = WV/(L/D)`, ''],
    ['Turn', String.raw`n = 1/\cos\phi,\; R = V^2/(g\tan\phi)`, ''],
  ] },
  { id: 'pcb', items: [
    ['Copper resistance', String.raw`R = \rho L/(wt)`, 'ρ ≈ 1.72×10⁻⁸ Ω·m'],
    ['IPC-2221', String.raw`I = k\,\Delta T^{0.44}A^{0.725}`, 'A in mil², k≈0.048'],
  ] },
  { id: 'vision', items: [
    ['Ground sample distance', String.raw`GSD = Hp/f`, ''],
    ['Line spacing', String.raw`s = (1-o_{side})\,W`, ''],
    ['Focal length in px', String.raw`f_{px} = f/p`, ''],
  ] },
];
