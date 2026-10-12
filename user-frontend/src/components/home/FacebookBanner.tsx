import { Settings } from "@/lib/types";

export function FacebookBanner({ settings }: { settings: Settings }) {
  return (
    <div className="bg-[#1d1d1f] text-white/80">
      <div className="container-xl py-3 text-center text-sm md:text-[15px]">
        {settings.announcement}
      </div>
    </div>
  );
}
