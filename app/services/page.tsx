import type { Metadata } from "next";
import { ServicesPage } from "@/features/services/components/services-page";

export const metadata: Metadata = {
  title: "Services & prices",
  description: "Every service, every price — upfront. 20% deposit online, balance in cash on the day.",
};

export default function Page() {
  return <ServicesPage />;
}
