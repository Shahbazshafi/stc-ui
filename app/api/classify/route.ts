export async function POST() {
  const base = process.env.N8N_BASE!;
  try {
    const r = await fetch(`${base}/webhook/classify-now`, { method: 'POST' });

    const ct = r.headers.get('content-type') || '';
    let data: any;

    if (ct.includes('application/json')) {
      data = await r.json();
    } else {
      const txt = await r.text(); // handle empty or text bodies
      data = { ok: r.ok, body: txt || null };
    }

    return Response.json(data, { status: r.ok ? 200 : 502 });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || 'fetch_failed' }, { status: 500 });
  }
}
