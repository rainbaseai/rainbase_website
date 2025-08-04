'use client'
import { FeatureSection } from "@/components/feature-section";
import { Meteors } from "@/components/meteors";
import { Button } from "@/components/ui/button";
import { JoinWaitlistModal } from "@/components/join-waitlist-modal";
import { ArrowUpRight } from "lucide-react";
import { Suspense } from "react";

function HomeContent() {


  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Meteors />
        <div className="flex flex-col justify-center items-center">
          <span className="pb-4 opacity-60">
            <p>Rainbase AI turns knowledge into daily productivity</p>
          </span>
          <h1 className="text-6xl text-center font-semibold">Your AI Work Companion<br />Everywhere You Work</h1>
          <div className="mt-5">
            <JoinWaitlistModal>
              <Button variant={'default'} className="cursor-pointer">
                Join the waitlist
                <ArrowUpRight />
              </Button>
            </JoinWaitlistModal>
          </div>
        </div>
      </div>
      <FeatureSection />
    </div>

  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
