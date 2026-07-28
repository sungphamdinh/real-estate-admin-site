"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import PropertyForm from "@/components/PropertyForm";
import { fetchProperty, updateProperty } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Property, PropertyInput } from "@/lib/types";

function EditPropertyForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const { token } = useAuth();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    fetchProperty(id).then((p) => {
      if (!p) setNotFound(true);
      else setProperty(p);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(input: PropertyInput) {
    if (!token) return;
    await updateProperty(token, id, input);
    router.push("/properties");
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Sửa bất động sản</h1>
      {loading && <div style={{ color: "oklch(0.5 0.01 250)" }}>Đang tải...</div>}
      {notFound && <div style={{ color: "#dc2626" }}>Không tìm thấy bất động sản.</div>}
      {property && <PropertyForm initial={property} onSubmit={handleSubmit} submitLabel="Lưu thay đổi" />}
    </div>
  );
}

export default function EditPropertyPage() {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <EditPropertyForm />
      </Suspense>
    </AuthGuard>
  );
}
