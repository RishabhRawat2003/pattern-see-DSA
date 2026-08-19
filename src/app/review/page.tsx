import type { Metadata } from "next";
import { ReviewList } from "@/components/ReviewList";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Review queue",
  description: `Patterns marked for review on ${site.name}, stored on this device.`,
  alternates: { canonical: "/review" },
};

export default function ReviewPage() {
  return (
    <main className="mx-auto w-full max-w-3xl min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <p className="kicker">Daily loop</p>
      <h1 className="display mt-3 text-[clamp(1.8rem,7vw,3rem)] text-paper">Review</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
        Marks live in your browser only. Due items are anything you tagged
        “Review in 2 days” whose date has arrived.
      </p>
      <ReviewList />
    </main>
  );
}
