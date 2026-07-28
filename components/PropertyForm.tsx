"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Property, PropertyCategory, PropertyInput } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const CATEGORY_OPTIONS: { value: PropertyCategory; label: string }[] = [
  { value: "NHA_PHO", label: "Nhà phố" },
  { value: "CAN_HO", label: "Căn hộ" },
  { value: "BIET_THU", label: "Biệt thự" },
  { value: "DAT_NEN", label: "Đất nền" },
];

export default function PropertyForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Property;
  onSubmit: (input: PropertyInput) => Promise<void>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<PropertyCategory>(initial?.category ?? "NHA_PHO");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [width, setWidth] = useState(initial?.width != null ? String(initial.width) : "");
  const [length, setLength] = useState(initial?.length != null ? String(initial.length) : "");
  const [floors, setFloors] = useState(initial?.floors != null ? String(initial.floors) : "");
  const [bedrooms, setBedrooms] = useState(initial?.bedrooms != null ? String(initial.bedrooms) : "");
  const [bathrooms, setBathrooms] = useState(initial?.bathrooms != null ? String(initial.bathrooms) : "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description: description || undefined,
        category,
        price: Number(price) || 0,
        address,
        width: Number(width) || 0,
        length: Number(length) || 0,
        floors: Number(floors) || 0,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        images,
        contact: contact || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      setSubmitting(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    height: 42,
    borderRadius: 8,
    border: "1px solid oklch(0.85 0.01 250)",
    padding: "0 12px",
    fontSize: 14,
  };
  const labelStyle: React.CSSProperties = { fontWeight: 700, fontSize: 13, marginBottom: 6, display: "block" };
  const fieldWrapStyle: React.CSSProperties = { marginBottom: 16 };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      {error && (
        <div
          style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Tiêu đề</label>
        <input style={fieldStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Mô tả</label>
        <textarea
          style={{ ...fieldStyle, height: 100, padding: 12 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Loại hình</label>
        <select
          style={fieldStyle}
          value={category}
          onChange={(e) => setCategory(e.target.value as PropertyCategory)}
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Giá (VNĐ)</label>
        <input type="number" style={fieldStyle} value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Địa chỉ</label>
        <input style={fieldStyle} value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Chiều rộng (m)</label>
          <input type="number" style={fieldStyle} value={width} onChange={(e) => setWidth(e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Chiều dài (m)</label>
          <input
            type="number"
            style={fieldStyle}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Số tầng</label>
          <input
            type="number"
            style={fieldStyle}
            value={floors}
            onChange={(e) => setFloors(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Phòng ngủ</label>
          <input
            type="number"
            style={fieldStyle}
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Phòng tắm</label>
          <input
            type="number"
            style={fieldStyle}
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Liên hệ</label>
        <input style={fieldStyle} value={contact} onChange={(e) => setContact(e.target.value)} />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Hình ảnh</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "12px 24px",
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
          {submitting ? "Đang lưu..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/properties")}
          style={{
            padding: "12px 24px",
            borderRadius: 8,
            background: "#fff",
            border: "1px solid oklch(0.85 0.01 250)",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
