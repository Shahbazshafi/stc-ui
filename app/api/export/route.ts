export const runtime = "nodejs";

export async function GET() {
  try {
    const n8n = process.env.N8N_BASE?.replace(/\/$/, "");
    if (!n8n) return new Response("Missing N8N_BASE", { status: 500 });

    const res = await fetch(`${n8n}/webhook/export-negatives`, { method: "GET" });
    if (!res.ok) return new Response(await res.text(), { status: res.status });

    const blob = await res.blob();
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="negatives.csv"'
      }
    });
  } catch (e: any) {
    return new Response(String(e?.message || e), { status: 500 });
  }
}
