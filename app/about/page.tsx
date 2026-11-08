import type { Metadata } from "next";
import { AboutPage } from "@/features/about/components/about-page";

export const metadata: Metadata = {
  title: "About & Contact",
  description: "A private, appointment-only studio in Northwest London. One inbox, every answer.",
};

export default function Page() {
  return <AboutPage />;
}
