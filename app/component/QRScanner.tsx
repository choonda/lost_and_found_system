"use client";
import React, { useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useZxing } from "react-zxing";

type QRScannerProps = {
  centerId: number;
  onSuccess?: () => void;
  onClose: () => void;
};

const QRScanner = ({ centerId, onSuccess, onClose }: QRScannerProps) => {
  const [decodedText, setDecodedText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const locked = useRef(false); // 🔒 prevent multiple scans

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (locked.current) return; // prevent duplicate scans
      locked.current = true;

      const text = result.getText();
      setDecodedText(text);

      handleScan(text);
    },
    onError(err: any) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Camera Error";
      setError(msg);
    },
    constraints: {
      video: {
        facingMode: "environment",
        torch: torchOn,
      } as any,
    },
  });

  const handleScan = async (qrText: string) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      setError("");

      let parsed;

      try {
        parsed = JSON.parse(qrText);
      } catch (e) {
        setError("Invalid QR Code (Not JSON)");
        locked.current = false;
        return;
      }

      if (!parsed?.itemId || !parsed?.userId) {
        setError("Invalid QR Code Format");
        locked.current = false;
        return;
      }

      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parsed.userId,
          itemId: parsed.itemId,
          centerId: Number(centerId),
        }),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        setError(errorMsg || "Failed to create claim");
        locked.current = false; // allow re-scan
        return;
      }

      alert("Claim successfully recorded!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Unable to process QR Code.");
      locked.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Scan Item QR Code</h2>
          <button onClick={onClose}>
            <AiOutlineClose className="text-gray-600 text-2xl hover:text-black" />
          </button>
        </div>

        {/* Camera View */}
        <video ref={ref} className="w-full rounded-lg shadow-md border"></video>

        {/* Flashlight Toggle */}
        <button
          className="mt-4 bg-buttongreen text-white w-full py-2 rounded-lg"
          onClick={() => setTorchOn((prev) => !prev)}
        >
          {torchOn ? "Turn Off Flashlight" : "Turn On Flashlight"}
        </button>

        {/* Display Scanned Data */}
        {decodedText && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h3 className="font-semibold">Scanned Data:</h3>
            <pre className="text-sm">{decodedText}</pre>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 text-red-600 font-semibold text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
