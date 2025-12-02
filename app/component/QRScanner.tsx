"use client";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useZxing } from "react-zxing";

type QRScannerProps = {
  centerId: string;
  onSuccess?: () => void;
  onClose: () => void;
};
const QRScanner = ({ centerId, onSuccess, onClose }: QRScannerProps) => {
  const [decodedText, setDecodedText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      setDecodedText(text);
      handleScan(text);
    },
    onError(error: any) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Camera Error";
      setError(message);
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

      const parsed = JSON.parse(qrText);

      if (!parsed?.itemId || !parsed?.userId) {
        setError("Invalid QR Code Format");
        return;
      }

      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parsed.userId,
          itemId: parsed.itemId,
          centerId,
        }),
      });

      if (res.ok) {
        alert("Claim successfully recorded!");
        if (onSuccess) onSuccess();
      } else {
        alert("Failed to create claim");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process QR Code");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-50">
      <div className="flex flex-col items-center p-4 bg-white">
        <div className="flex flex-row  w-full justify-between">
          <h2 className="text-xl font-bold mb-4">Scan Item QR Code</h2>
          <button
            onClick={onClose}
            className="flex text-gray-500 text-2xl font-bold hover:text-black z-50"
          >
            <AiOutlineClose className="text-gray-500 text-2xl font-bold hover:text-black" />
          </button>
        </div>

        {/* Camera View */}
        <video
          ref={ref}
          className="w-full max-w-md rounded-lg shadow-md border"
        ></video>

        {/* Flashlight Toggle */}
        <button
          className="mt-4 bg-buttongreen text-white px-4 py-2 rounded-lg"
          onClick={() => setTorchOn(!torchOn)}
        >
          {torchOn ? "Turn Off Flashlight" : "Turn On Flashlight"}
        </button>

        {/* Display Scanned Data */}
        {decodedText && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg w-full max-w-md text-center">
            <h3 className="font-semibold">Scanned Data</h3>
            <pre className="text-sm">{decodedText}</pre>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-3 text-red-600 font-semibold">{error}</p>}
      </div>
    </div>
  );
};

export default QRScanner;
