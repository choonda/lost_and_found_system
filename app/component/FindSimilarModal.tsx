"use client";

import React from "react";
import Image from "next/image";

type SimilarItem = {
  id: string | number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  similarity?: number | null;
};

type Props = {
  isOpen: boolean;
  items: SimilarItem[];
  onClose: () => void; // Continue submission
  onCancel?: () => void; // Cancel submission or close without continuing
};

export default function FindSimilarModal({
  isOpen,
  items,
  onClose,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel || onClose}
      />

      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Similar items found</h3>
          <button
            aria-label="close"
            className="text-gray-600 hover:text-gray-900"
            onClick={onCancel || onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-auto">
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">No similar items found.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={String(it.id)} className="flex gap-3 items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {it.imageUrl ? (
                      // Use next/image if possible
                      <Image
                        src={it.imageUrl}
                        alt={it.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-500 px-2">No image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-medium">{it.name}</h4>
                      {typeof it.similarity === "number" && (
                        <span className="text-sm text-gray-500">
                          {(it.similarity * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
            onClick={onCancel || onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-green-600 text-sm text-white hover:bg-green-700"
            onClick={onClose}
          >
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  );
}
