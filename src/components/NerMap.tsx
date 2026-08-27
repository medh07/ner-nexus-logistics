import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { MapProps } from "./NerMapInner";

const Inner = lazy(() => import("./NerMapInner"));

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background/60">
      <p className="label-xs animate-pulse">Loading GIS layers…</p>
    </div>
  );
}

export function NerMap(props: MapProps) {
  return (
    <ClientOnly fallback={<MapSkeleton />}>
      <Suspense fallback={<MapSkeleton />}>
        <Inner {...props} />
      </Suspense>
    </ClientOnly>
  );
}
