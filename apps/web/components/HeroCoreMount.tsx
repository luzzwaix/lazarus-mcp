"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

function CoreLoading() {
  return (
    <div className="core-fallback" aria-label="Repo Resurrection Core loading">
      <div className="fallback-ring fallback-ring-one" />
      <div className="fallback-ring fallback-ring-two" />
      <div className="fallback-cube" />
      <div className="fallback-beam" />
      {Array.from({ length: 18 }).map((_, index) => (
        <span className="fallback-particle" key={index} style={{ "--i": index } as CSSProperties} />
      ))}
    </div>
  );
}

const ResurrectionCore = dynamic(() => import("./ResurrectionCore"), {
  ssr: false,
  loading: CoreLoading
});

export default function HeroCoreMount() {
  return <ResurrectionCore />;
}
