"use client";

import { useState } from "react";

export default function AiTestPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendToAI = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      setResponse("❌ Error calling AI.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Test AI Feature</h1>

      <textarea
        className="border p-2 w-full text-white"
        rows={4}
        placeholder="Type something..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={sendToAI}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Sending..." : "Send to AI"}
      </button>

      <div className="mt-4 border p-2 text-black bg-gray-100">
        {response}
      </div>
    </div>
  );
}
