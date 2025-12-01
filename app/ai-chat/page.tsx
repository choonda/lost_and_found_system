// app/page.tsx
"use client";
import React, { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("LOST");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [chatResult, setChatResult] = useState<any>(null);

  async function uploadItem(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Choose an image first");
    const fd = new FormData();
    fd.append("image", file);
    fd.append("userId", "test-user");
    fd.append("name", name);
    fd.append("description", desc);
    fd.append("type", type);
    fd.append("location", location);
    const res = await fetch("/api/items/upload", { method: "POST", body: fd });
    const json = await res.json();
    setResult(json);
  }

  async function askAI(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, userLocation: location })
    });
    const json = await res.json();
    setChatResult(json);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Lost & Found (demo)</h1>

      <form onSubmit={uploadItem}>
        <h2>Upload Item</h2>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <br />
        <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="LOST">LOST</option>
          <option value="FOUND">FOUND</option>
        </select>
        <br />
        <input placeholder="Location (e.g., Library)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <br />
        <button type="submit">Upload</button>
      </form>

      <pre>{result && JSON.stringify(result, null, 2)}</pre>

      <hr />

      <form onSubmit={askAI}>
        <h2>Chat / Find</h2>
        <input placeholder="Describe the item (e.g. black backpack w/ red zipper)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <br />
        <input placeholder="Your location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <br />
        <button type="submit">Ask AI</button>
      </form>

      <pre>{chatResult && JSON.stringify(chatResult, null, 2)}</pre>
    </div>
  );
}
