"use client";

import "./support.css";
import { BlindsWarranty, FaqShuffle, PrepareFan, PromisePile } from "@/components/support/sections/Cards";
import { BlobStories, MessageComposer, StoresRail } from "@/components/support/sections/Contact";
import { NotesCanvas, ProductFloor, TopicBento } from "@/components/support/sections/Explore";
import { ChannelGlitch, DepthParallax, type SupportFacts, SupportHero, VelocityMarquee } from "@/components/support/sections/Hero";
import { CircleUnmask, RequestFlow, ServiceCube } from "@/components/support/sections/Journey";
import type { Settings, Store } from "@/lib/types";

export function SupportExperience({ settings, stores, facts }: { settings: Settings; stores: Store[]; facts: SupportFacts }) {
  return (
    <div className="bg-white">
      <SupportHero settings={settings} facts={facts} />
      <DepthParallax />
      <ChannelGlitch settings={settings} />
      <VelocityMarquee />
      <PromisePile />
      <RequestFlow />
      <CircleUnmask />
      <TopicBento />
      <ServiceCube />
      <BlindsWarranty />
      <PrepareFan />
      <FaqShuffle settings={settings} />
      <ProductFloor products={facts.products} />
      <NotesCanvas />
      <BlobStories />
      <StoresRail stores={stores} />
      <MessageComposer settings={settings} stores={stores} />
    </div>
  );
}
