"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const photos = images?.filter(Boolean).length ? images.filter(Boolean) : ["/placeholder.svg"];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const src = photos[Math.min(active, photos.length - 1)];

  return (
    <div>
      <div className="relative flex min-h-[380px] items-center rounded-3xl bg-apple-gray p-8">
        <button
          type="button"
          aria-label="Zoom image"
          onClick={() => setZoom(true)}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy hover:bg-black hover:text-white"
        >
          <Search size={18} />
        </button>
        <button type="button" onClick={() => setZoom(true)} className="block w-full">
          <img src={src} alt={name} className="mx-auto max-h-[420px] object-contain" />
        </button>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        {photos.map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={`rounded-xl bg-apple-gray p-2 ring-1 ${index === active ? "ring-gold" : "ring-transparent"}`}
          >
            <img src={photo} alt="" className="h-16 w-16 object-contain" />
          </button>
        ))}
      </div>

      {zoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" onClick={() => setZoom(false)}>
          <button type="button" className="absolute right-6 top-6 text-white" aria-label="Close">
            <X size={28} />
          </button>
          <img src={src} alt={name} className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}
    </div>
  );
}
