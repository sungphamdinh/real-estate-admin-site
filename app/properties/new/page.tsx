"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import PropertyForm from "@/components/PropertyForm";
import { createProperty } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PropertyInput } from "@/lib/types";

export default function NewPropertyPage() {
  const { token } = useAuth();
  const router = useRouter();

  async function handleSubmit(input: PropertyInput) {
    if (!token) return;
    await createProperty(token, input);
    router.push("/properties");
  }

  return (
    <AuthGuard>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Thêm bất động sản</h1>
        <PropertyForm onSubmit={handleSubmit} submitLabel="Tạo mới" />
      </div>
    </AuthGuard>
  );
}
