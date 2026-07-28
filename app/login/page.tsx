"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login, token, hydrated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/properties");
    }
  }, [hydrated, token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/properties");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated || token) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          border: "1px solid oklch(0.9 0.005 250)",
          borderRadius: 14,
          padding: 28,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Đăng nhập quản trị</h1>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: 10,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <label style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, display: "block" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            height: 42,
            borderRadius: 8,
            border: "1px solid oklch(0.85 0.01 250)",
            padding: "0 12px",
            fontSize: 14,
            marginBottom: 16,
          }}
        />

        <label style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, display: "block" }}>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            height: 42,
            borderRadius: 8,
            border: "1px solid oklch(0.85 0.01 250)",
            padding: "0 12px",
            fontSize: 14,
            marginBottom: 20,
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
