import type { Metadata } from "next";
import { GalleryPage } from "@/features/gallery/components/gallery-page";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Real clients. Real hairlines. Every look is Debz’s own work — tap one to book it.",
};

export default function Page() {
  return <GalleryPage />;
}
