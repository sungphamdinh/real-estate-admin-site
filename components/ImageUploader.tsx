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
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const files = input.files;
    if (!files || files.length === 0 || !token) return;

    const fileList = Array.from(files);
    setUploading(true);
    setError(null);
    setProgress({ done: 0, total: fileList.length });

    // Uploaded one at a time (not Promise.all) so files land in the order
    // they were selected. Each success is committed to the parent's state
    // immediately, and a failure only skips that one file, so a bad file
    // partway through a large batch doesn't discard everything already
    // uploaded or block the rest of the batch.
    let current = images;
    const failures: string[] = [];
    for (let i = 0; i < fileList.length; i++) {
      try {
        const url = await uploadImage(token, fileList[i]);
        current = [...current, url];
        onChange(current);
      } catch (err) {
        failures.push(err instanceof Error ? err.message : fileList[i].name);
      } finally {
        setProgress({ done: i + 1, total: fileList.length });
      }
    }

    if (failures.length > 0) {
      setError(
        failures.length === 1
          ? `1 ảnh tải lên thất bại: ${failures[0]}`
          : `${failures.length} ảnh tải lên thất bại`
      );
    }
    setUploading(false);
    setProgress(null);
    input.value = "";
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  function moveImage(from: number, to: number) {
    if (from === to) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading} />
      {uploading && (
        <div style={{ fontSize: 13, color: "oklch(0.5 0.01 250)", marginTop: 6 }}>
          {progress ? `Đang tải ${progress.done}/${progress.total} ảnh...` : "Đang tải ảnh lên..."}
        </div>
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
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                if (index !== overIndex) setOverIndex(index);
              }}
              onDragLeave={() => setOverIndex((cur) => (cur === index ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) moveImage(dragIndex, index);
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              style={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 8,
                overflow: "hidden",
                border: overIndex === index && dragIndex !== index
                  ? "2px dashed var(--accent)"
                  : "1px solid oklch(0.85 0.01 250)",
                opacity: dragIndex === index ? 0.4 : 1,
                cursor: "grab",
              }}
            >
              <Image src={url} alt="" fill style={{ objectFit: "cover" }} sizes="90px" draggable={false} />
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
