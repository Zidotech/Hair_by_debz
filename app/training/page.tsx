import type { Metadata } from "next";
import { TrainingPage } from "@/features/training/components/training-page";

export const metadata: Metadata = {
  title: "Training",
  description: "Hair By Debz Academy — train in a working studio, not a classroom.",
};

export default function Page() {
  return <TrainingPage />;
}
