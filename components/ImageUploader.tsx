"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/api";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(token, file);
        uploaded.push(url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải ảnh thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading} />
      {uploading && (
        <div style={{ fontSize: 13, color: "oklch(0.5 0.01 250)", marginTop: 6 }}>Đang tải ảnh lên...</div>
      )}
      {error && <div style={{ fontSize: 13, color: "#dc2626", marginTop: 6 }}>{error}</div>}

      {images.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: 10,
            marginTop: 12,
          }}
        >
          {images.map((url) => (
            <div
              key={url}
              style={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid oklch(0.85 0.01 250)",
              }}
            >
              <Image src={url} alt="" fill style={{ objectFit: "cover" }} sizes="90px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Xóa ảnh"
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "none",
                  background: "oklch(0.2 0.01 250 / 0.7)",
                  color: "#fff",
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
