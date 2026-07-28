"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Property } from "@/lib/types";
import { categoryLabel, formatPrice } from "@/lib/format";
import { deleteProperty, fetchProperties } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function PropertyTable() {
  const { token } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount pattern - no external subscription API
    // exists for "the properties list", so this has to be an effect
    // that eventually calls setState with the fetch result.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Xóa bất động sản này?")) return;
    setDeletingId(id);
    try {
      await deleteProperty(token, id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xóa thất bại");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div style={{ padding: 24, color: "oklch(0.5 0.01 250)" }}>Đang tải...</div>;
  if (error) return <div style={{ padding: 24, color: "#dc2626" }}>{error}</div>;

  return (
    <div style={{ overflowX: "auto", background: "#fff", border: "1px solid oklch(0.9 0.005 250)", borderRadius: 14 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid oklch(0.9 0.005 250)" }}>
            <th style={{ padding: "12px 16px" }}></th>
            <th style={{ padding: "12px 16px" }}>Tiêu đề</th>
            <th style={{ padding: "12px 16px" }}>Loại hình</th>
            <th style={{ padding: "12px 16px" }}>Giá</th>
            <th style={{ padding: "12px 16px" }}>Địa chỉ</th>
            <th style={{ padding: "12px 16px" }}></th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid oklch(0.93 0.005 250)" }}>
              <td style={{ padding: "10px 16px" }}>
                <div
                  style={{
                    position: "relative",
                    width: 56,
                    height: 42,
                    borderRadius: 6,
                    overflow: "hidden",
                    background: "oklch(0.95 0.005 250)",
                  }}
                >
                  {p.images[0] && <Image src={p.images[0]} alt="" fill style={{ objectFit: "cover" }} sizes="56px" />}
                </div>
              </td>
              <td style={{ padding: "10px 16px", fontWeight: 600, maxWidth: 260 }}>{p.title}</td>
              <td style={{ padding: "10px 16px" }}>{categoryLabel(p.category)}</td>
              <td style={{ padding: "10px 16px", color: "var(--accent)", fontWeight: 700 }}>{formatPrice(p.price)}</td>
              <td style={{ padding: "10px 16px", color: "oklch(0.5 0.01 250)", maxWidth: 260 }}>{p.address}</td>
              <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                <Link href={`/properties/edit?id=${p.id}`} style={{ color: "var(--accent)", fontWeight: 700, marginRight: 14 }}>
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  style={{ border: "none", background: "none", color: "#dc2626", fontWeight: 700, cursor: "pointer", padding: 0 }}
                >
                  {deletingId === p.id ? "..." : "Xóa"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {properties.length === 0 && (
        <div style={{ padding: 24, color: "oklch(0.5 0.01 250)" }}>Chưa có bất động sản nào.</div>
      )}
    </div>
  );
}
