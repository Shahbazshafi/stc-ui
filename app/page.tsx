"use client";
import { useState } from "react";

export default function Page() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function uploadCSV(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/ingest", { method: "POST", body: fd });
      const j = await res.json();
      setMsg(`Ingest: ${res.ok ? "ok" : "error"} — ${JSON.stringify(j)}`);
    } catch (err: any) {
      setMsg(`Ingest error: ${err?.message || String(err)}`);
    } finally {
      setBusy(false);
      e.currentTarget.reset();
    }
  }

  async function classifyNow() {
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/classify", { method: "POST" });
      const j = await res.json();
      setMsg(`Classify: ${res.ok ? "ok" : "error"} — ${JSON.stringify(j)}`);
    } catch (err: any) {
      setMsg(`Classify error: ${err?.message || String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  async function downloadNegatives() {
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "negatives.csv";
      a.click();
      URL.revokeObjectURL(url);
      setMsg("Downloaded negatives.csv");
    } catch (err: any) {
      setMsg(`Export error: ${err?.message || String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Search Terms Cleaner</h1>
      <p>Upload Google Ads search terms CSV, classify, and export negatives.</p>

      <form onSubmit={uploadCSV} style={{ marginTop: 24, display: "grid", gap: 12 }}>
        <label>
          CSV file:
          <input name="file" type="file" accept=".csv,text/csv" required />
        </label>
        <button disabled={busy} type="submit">Upload → Ingest</button>
      </form>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button disabled={busy} onClick={classifyNow}>Run Classifier</button>
        <button disabled={busy} onClick={downloadNegatives}>Download negatives.csv</button>
      </div>

      {msg && <pre style={{ marginTop: 16, background: "#f6f6f6", padding: 12 }}>{msg}</pre>}
    </main>
  );
}
