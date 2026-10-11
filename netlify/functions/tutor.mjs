// Server-side proxy for the AI tutor. The API key lives in Netlify environment variables
// (Site settings → Environment variables → GEMINI_API_KEY) and never reaches the browser.
// Optional: GEMINI_MODEL to override the default model id.
const SYSTEM = `You are a drone-engineering tutor for a 2nd-year B.Tech Electrical & Electronics student in India.
Explain from first principles, use SI units, show equations step by step, and connect ideas to EEE subjects
(machines, power electronics, control systems, signals & systems, EM fields). Be accurate; say when you are unsure.
For regulations, point to DGCA/DigitalSky and say rules may have changed. Keep answers concise unless asked for depth.
Use $...$ for inline maths.`;

export default async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: 'Tutor not configured: set GEMINI_API_KEY in Netlify environment variables.' }, { status: 503 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'Bad JSON' }, { status: 400 }); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const contents = messages
    .filter((m) => m && typeof m.text === 'string' && m.text.length < 4000)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
  while (contents.length && contents[0].role !== 'user') contents.shift();
  if (!contents.length) return Response.json({ error: 'Empty question' }, { status: 400 });
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM + (body.context ? `\nThe student is currently studying: ${String(body.context).slice(0, 500)}` : '') }] },
      contents,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return Response.json({ error: `Model error (${res.status}): ${data?.error?.message || 'unknown'}. Check GEMINI_MODEL / key.` }, { status: 502 });
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || 'No answer returned.';
  return Response.json({ text });
};
