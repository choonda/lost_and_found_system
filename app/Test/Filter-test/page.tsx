"use client";

import { useState } from "react";

export default function TestFilterPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runTest() {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/sensitive-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: query }),
      });

      const data = await res.json();
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult(data.isSensitive ? "SENSITIVE" : "SAFE");
      }
    } catch (error) {
      setResult("Unexpected error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Sensitive Content Filter Tester</h1>

      <textarea
        className="border p-4 rounded w-full max-w-xl"
        rows={5}
        placeholder="Type something to test..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
        onClick={runTest}
        disabled={loading}
      >
        {loading ? "Checking..." : "Run Test"}
      </button>

      {result && (
        <div className="mt-6 text-xl font-semibold">
          Result:{" "}
          <span
            className={
              result === "SENSITIVE" ? "text-red-600" : "text-green-600"
            }
          >
            {result}
          </span>
        </div>
      )}
    </div>
  );
}
