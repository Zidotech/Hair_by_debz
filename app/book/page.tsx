import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingPage } from "@/features/booking/components/booking-page";

export const metadata: Metadata = {
  title: "Book",
  description: "Request your appointment — pick a style, a date and two alternatives. Debz confirms by email.",
};

export default function Page() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
