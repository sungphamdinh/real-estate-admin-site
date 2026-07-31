"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import ConsignmentTable from "@/components/ConsignmentTable";

export default function ConsignmentsPage() {
  const [count, setCount] = useState<number | null>(null);

  return (
    <AuthGuard>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: "oklch(0.5 0.01 250)" }}>
            {count === null ? " " : `${count} yêu cầu ký gửi`}
          </div>
        </div>
        <ConsignmentTable onCountChange={setCount} />
      </div>
    </AuthGuard>
  );
}
