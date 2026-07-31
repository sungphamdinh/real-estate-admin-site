"use client";

import { useCallback, useEffect, useState } from "react";
import { ConsignmentLead } from "@/lib/types";
import { categoryLabel, formatPrice } from "@/lib/format";
import { deleteConsignmentLead, fetchConsignmentLeads } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default function ConsignmentTable({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { token } = useAuth();
  const [leads, setLeads] = useState<ConsignmentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    onCountChange?.(leads.length);
  }, [leads, onCountChange]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConsignmentLeads(token);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh sách");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Xóa yêu cầu ký gửi này?")) return;
    setDeletingId(id);
    try {
      await deleteConsignmentLead(token, id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
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
            <th style={{ padding: "12px 16px" }}>Họ tên</th>
            <th style={{ padding: "12px 16px" }}>Điện thoại</th>
            <th style={{ padding: "12px 16px" }}>Loại hình</th>
            <th style={{ padding: "12px 16px" }}>Khu vực</th>
            <th style={{ padding: "12px 16px" }}>Diện tích</th>
            <th style={{ padding: "12px 16px" }}>Giá mong muốn</th>
            <th style={{ padding: "12px 16px" }}>Mô tả</th>
            <th style={{ padding: "12px 16px" }}>Thời gian</th>
            <th style={{ padding: "12px 16px" }}></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ borderBottom: "1px solid oklch(0.93 0.005 250)" }}>
              <td style={{ padding: "10px 16px", fontWeight: 600 }}>{lead.fullName}</td>
              <td style={{ padding: "10px 16px" }}>
                <a href={`tel:${lead.phone}`} style={{ color: "var(--accent)" }}>
                  {lead.phone}
                </a>
              </td>
              <td style={{ padding: "10px 16px" }}>{categoryLabel(lead.category)}</td>
              <td style={{ padding: "10px 16px" }}>{lead.district}</td>
              <td style={{ padding: "10px 16px" }}>{lead.area} m²</td>
              <td style={{ padding: "10px 16px", color: "var(--accent)", fontWeight: 700 }}>
                {lead.price ? formatPrice(lead.price) : "—"}
              </td>
              <td style={{ padding: "10px 16px", color: "oklch(0.5 0.01 250)", maxWidth: 260 }}>
                {lead.description || "—"}
              </td>
              <td style={{ padding: "10px 16px", color: "oklch(0.5 0.01 250)", whiteSpace: "nowrap" }}>
                {formatDate(lead.createdAt)}
              </td>
              <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                <button
                  onClick={() => handleDelete(lead.id)}
                  disabled={deletingId === lead.id}
                  style={{ border: "none", background: "none", color: "#dc2626", fontWeight: 700, cursor: "pointer", padding: 0 }}
                >
                  {deletingId === lead.id ? "..." : "Xóa"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && (
        <div style={{ padding: 24, color: "oklch(0.5 0.01 250)" }}>Chưa có yêu cầu ký gửi nào.</div>
      )}
    </div>
  );
}
