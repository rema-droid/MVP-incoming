"use client";

import { memo, type ComponentType } from "react";
import { Compass, LayoutGrid, Flame, Eye, Store, Rocket, Rss, Zap, type LucideProps } from "lucide-react";
import type { Tab } from "./Sidebar";

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

// Hoisting static item configuration with Lucide Component references instead of instantiating React elements
const NAV_ITEMS: { id: Tab; label: string; Icon: ComponentType<LucideProps> }[] = [
  { id: "discover", label: "Explore", Icon: Compass },
  { id: "runnable", label: "Runnable", Icon: Zap },
  { id: "categories", label: "Types", Icon: LayoutGrid },
  { id: "shop", label: "Market", Icon: Store },
  { id: "feed", label: "Feed", Icon: Rss },
  { id: "runtime", label: "Try", Icon: Rocket },
  { id: "trending", label: "Popular", Icon: Flame },
  { id: "viewed", label: "Recent", Icon: Eye },
];

// Memoized to prevent re-rendering when parent component state updates (e.g. search input keystrokes, runtime job polling)
function MobileNavComponent({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav aria-label="Mobile navigation" className="fixed bottom-0 z-50 w-full border-t border-white/10 bg-[#031d24]/90 pb-safe pt-2 backdrop-blur-xl lg:hidden">
      <div className="flex h-14 w-full items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const { Icon } = item;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="group flex flex-1 flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const MobileNav = memo(MobileNavComponent);
export default MobileNav;
