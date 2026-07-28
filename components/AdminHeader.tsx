"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function AdminHeader() {
  const { token, logout } = useAuth();

  if (!token) return null;

  return (
    <header style={{ borderBottom: "1px solid oklch(0.9 0.005 250)", background: "#fff" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/properties" style={{ fontWeight: 800, fontSize: 16, color: "inherit" }}>
          Quản trị Bất động sản
        </Link>
        <button
          onClick={logout}
          style={{
            border: "1px solid oklch(0.85 0.01 250)",
            background: "#fff",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
