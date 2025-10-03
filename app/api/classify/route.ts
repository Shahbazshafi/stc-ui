export const runtime = "nodejs";

export async function POST() {
  try {
    const n8n = process.env.N8N_BASE?.replace(/\/$/, "");
    if (!n8n) return Response.json({ error: "Missing N8N_BASE" }, { status: 500 });

    const res = await fetch(`${n8n}/webhook/classify-now`, { method: "POST" });
    const text = await res.text();
    return new Response(text, { status: res.status, headers: { "content-type": "application/json" } });
  } catch (e: any) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
