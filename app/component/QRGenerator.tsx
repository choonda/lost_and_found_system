import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import QRCode from "react-qr-code";

type QRGeneratorProps = {
  userId: string;
  itemId: string;
  onCloseQR: () => void;
};
const QRGenerator = ({ userId, itemId, onCloseQR }: QRGeneratorProps) => {
  const qrData = JSON.stringify({ userId, itemId });
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-60 p-4">
      <div className="flex flex-col bg-white w-fit h-fit">
        <button
          className="flex justify-end cursor-pointer"
          onClick={() => onCloseQR()}
        >
          <AiOutlineClose className="text-gray-500 text-2xl font-bold hover:text-black" />
        </button>
        <div className="" style={{ background: "white", padding: "4px" }}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={qrData}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
