"use client";
import { useState } from "react";

export default function SafeImage({
  src,
  alt,
  className = "",
  fallback,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  eager?: boolean;
}) {
  const [err, setErr] = useState(false);
  if (err) {
    if (fallback) return <span className="flex items-center justify-center w-full h-full text-3xl" aria-label={alt}>{fallback}</span>;
    return null;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setErr(true)} />
  );
}
