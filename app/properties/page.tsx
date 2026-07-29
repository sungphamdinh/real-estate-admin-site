"use client";

import { useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import PropertyTable from "@/components/PropertyTable";

export default function PropertiesPage() {
  const [count, setCount] = useState<number | null>(null);

  return (
    <AuthGuard>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: "oklch(0.5 0.01 250)" }}>
            {count === null ? " " : `${count} bất động sản`}
          </div>
          <Link
            href="/properties/new"
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            + Thêm bất động sản
          </Link>
        </div>
        <PropertyTable onCountChange={setCount} />
      </div>
    </AuthGuard>
  );
}
