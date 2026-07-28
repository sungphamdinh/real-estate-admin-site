import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import PropertyTable from "@/components/PropertyTable";

export default function PropertiesPage() {
  return (
    <AuthGuard>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Quản lý bất động sản</h1>
          <Link
            href="/properties/new"
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            + Thêm bất động sản
          </Link>
        </div>
        <PropertyTable />
      </div>
    </AuthGuard>
  );
}
