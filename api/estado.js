// Guarda lo que marca el grupo en Upstash Redis (Vercel → Storage). Sin dependencias.
const URL_BASE = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const CLAVE = process.env.GRUPO_CLAVE || '';
const KEY = 'auto-vapor:estado';
const ID_OK = /^(m\d{2}|c\d{2}|h\d{2}|p-[A-F]\d*|x-[a-z0-9]{4,20})$/;

async function redis(cmd) {
  const r = await fetch(URL_BASE, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_BASE || !TOKEN) return res.status(503).json({ error: 'sin_base' });
  if (CLAVE && req.headers['x-clave'] !== CLAVE) return res.status(401).json({ error: 'clave' });
  try {
    if (req.method === 'GET') {
      const arr = (await redis(['HGETALL', KEY])) || [];
      const out = {};
      for (let i = 0; i < arr.length; i += 2) { try { out[arr[i]] = JSON.parse(arr[i + 1]); } catch {} }
      return res.status(200).json(out);
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { id, data } = body;
      if (!ID_OK.test(id || '') || !data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ error: 'datos_invalidos' });
      const txt = JSON.stringify(data);
      if (txt.length > 8000) return res.status(413).json({ error: 'muy_grande' });
      await redis(['HSET', KEY, id, txt]);
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const id = String(req.query.id || '');
      if (!id.startsWith('x-') || !ID_OK.test(id)) return res.status(400).json({ error: 'solo_agregados' });
      await redis(['HDEL', KEY, id]);
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'metodo' });
  } catch (e) {
    return res.status(500).json({ error: 'base_de_datos', detalle: String(e.message || e) });
  }
}
