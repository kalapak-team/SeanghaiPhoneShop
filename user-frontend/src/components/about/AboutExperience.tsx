"use client";

import "./about.css";
import { GridMorphPreview, Grid3DScroll, InfiniteCanvas } from "@/components/about/sections/Catalog";
import { BrandCarousel, CategoryDeck, LineConnections } from "@/components/about/sections/Ecosystem";
import { type AboutFacts, FlipHero, ParallaxOpening } from "@/components/about/sections/Hero";
import { CardDrawServices, CardShuffle } from "@/components/about/sections/Journey";
import { ClosingContact, FluidTestimonials, StoresParallax } from "@/components/about/sections/People";
import { SplitScroll, StackingPromise } from "@/components/about/sections/Promise";
import { DistortStatement, UnmaskChapters } from "@/components/about/sections/Story";
import type { Settings, Store } from "@/lib/types";

export function AboutExperience({ settings, stores, facts }: { settings: Settings; stores: Store[]; facts: AboutFacts }) {
  return (
    <div className="bg-black">
      <FlipHero facts={facts} />
      <ParallaxOpening />
      <UnmaskChapters />
      <DistortStatement />
      <StackingPromise />
      <SplitScroll />
      <BrandCarousel />
      <LineConnections />
      <Grid3DScroll products={facts.products} />
      <CategoryDeck />
      <GridMorphPreview />
      <InfiniteCanvas />
      <CardShuffle />
      <CardDrawServices />
      <FluidTestimonials />
      <StoresParallax stores={stores} />
      <ClosingContact settings={settings} />
    </div>
  );
}
