
'use client';

import { cn } from "@/lib/utils";

export function WaterAnimation() {
  return (
    <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-400/50 animate-wave rounded-b-full" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-500/50 animate-wave-reverse rounded-b-full" />
    </div>
  );
}
