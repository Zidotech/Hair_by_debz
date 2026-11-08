import type { Metadata } from "next";
import { ConfirmPage } from "@/features/booking/components/confirm-page";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false },
};

export default function Page() {
  return <ConfirmPage />;
}
