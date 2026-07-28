import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import AdminHeader from "@/components/AdminHeader";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Quản trị Bất động sản",
  description: "Trang quản lý bất động sản",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body style={{ minHeight: "100vh" }}>
        <AuthProvider>
          <AdminHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
