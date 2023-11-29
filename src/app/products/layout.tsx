import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="p-10">{children}</div>
      <Toaster />
    </>
  );
}
