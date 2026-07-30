"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Property } from "@/lib/types";
import { categoryLabel, formatPrice } from "@/lib/format";
import { deleteProperty, fetchProperties } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function PropertyTable({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { token } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onCountChange?.(properties.length);
  }, [properties, onCountChange]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedIds.size > 0 && selectedIds.size < properties.length;
    }
  }, [selectedIds, properties.length]);

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

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.size === properties.length ? new Set() : new Set(properties.map((p) => p.id))
    );
  }

  async function handleBulkDelete() {
    if (!token || selectedIds.size === 0) return;
    if (!window.confirm(`Xóa ${selectedIds.size} bất động sản đã chọn?`)) return;
    setBulkDeleting(true);
    const ids = Array.from(selectedIds);
    const results = await Promise.allSettled(ids.map((id) => deleteProperty(token, id)));
    const succeeded = ids.filter((_, i) => results[i].status === "fulfilled");
    const failedCount = ids.length - succeeded.length;

    setProperties((prev) => prev.filter((p) => !succeeded.includes(p.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      succeeded.forEach((id) => next.delete(id));
      return next;
    });
    setBulkDeleting(false);

    if (failedCount > 0) {
      alert(`Đã xóa ${succeeded.length}/${ids.length} mục. ${failedCount} mục xóa thất bại.`);
    }
  }

  if (loading) return <div style={{ padding: 24, color: "oklch(0.5 0.01 250)" }}>Đang tải...</div>;
  if (error) return <div style={{ padding: 24, color: "#dc2626" }}>{error}</div>;

  return (
    <>
      {selectedIds.size > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 16px",
            marginBottom: 10,
            background: "#fef2f2",
            border: "1px solid oklch(0.85 0.1 25)",
            borderRadius: 10,
            fontSize: 14,
          }}
        >
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            style={{
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 6,
              padding: "6px 12px",
              cursor: bulkDeleting ? "not-allowed" : "pointer",
              opacity: bulkDeleting ? 0.6 : 1,
            }}
          >
            {bulkDeleting ? "Đang xóa..." : `Xóa ${selectedIds.size} BĐS`}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            disabled={bulkDeleting}
            style={{ border: "none", background: "none", color: "oklch(0.4 0.01 250)", fontWeight: 700, cursor: "pointer" }}
          >
            Bỏ chọn
          </button>
        </div>
      )}
      <div style={{ overflowX: "auto", background: "#fff", border: "1px solid oklch(0.9 0.005 250)", borderRadius: 14 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid oklch(0.9 0.005 250)" }}>
            <th style={{ padding: "12px 16px" }}>
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={properties.length > 0 && selectedIds.size === properties.length}
                onChange={toggleSelectAll}
                disabled={bulkDeleting}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
            </th>
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
            <tr
              key={p.id}
              style={{
                borderBottom: "1px solid oklch(0.93 0.005 250)",
                background: selectedIds.has(p.id) ? "oklch(0.97 0.03 25)" : undefined,
              }}
            >
              <td style={{ padding: "10px 16px" }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  disabled={bulkDeleting}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
              </td>
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
              <td style={{ padding: "10px 16px", fontWeight: 600, maxWidth: 260 }}>
                <Link href={`/properties/edit?id=${p.id}`} style={{ color: "inherit" }}>
                  {p.title}
                </Link>
              </td>
              <td style={{ padding: "10px 16px" }}>{categoryLabel(p.category)}</td>
              <td style={{ padding: "10px 16px", color: "var(--accent)", fontWeight: 700 }}>{formatPrice(p.price)}</td>
              <td style={{ padding: "10px 16px", color: "oklch(0.5 0.01 250)", maxWidth: 260 }}>{p.address}</td>
              <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                <Link href={`/properties/edit?id=${p.id}`} style={{ color: "var(--accent)", fontWeight: 700, marginRight: 14 }}>
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id || bulkDeleting}
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
    </>
  );
}
