import type { Metadata } from "next";

import HeaderComponent from "@/components/HeaderComponent";
import { headers, cookies } from "next/headers"; // <-- Import 'cookies' to read cookies on the server

export const metadata: Metadata = {
  title: "Shap Shap Corporate",
  description: "Created with v0",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-2 relative ">
      {/* Conditionally render HeaderComponent based on 'shouldShowHeader' */}
      {<HeaderComponent />}

      {/* Main Content */}
      <div className="content p-8">{children}</div>
    </div>
  );
}
