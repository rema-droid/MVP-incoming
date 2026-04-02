"use client";

import { Star, LayoutGrid, Flame, Eye, Bookmark, Settings, Search, User, Store, Rocket, Rss } from "lucide-react";

export type Tab = "discover" | "categories" | "shop" | "feed" | "runtime" | "trending" | "viewed" | "bookmarks" | "settings";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}: SidebarProps) {
  const getIconClass = (id: string) => 
    `h-4 w-4 shrink-0 transition-colors duration-200 ${
      activeTab === id ? "text-blue-400" : "text-blue-400/60"
    }`;

  const exploreItems = [
    { label: "Explore", id: "discover" as Tab, icon: <Star className={getIconClass("discover")} /> },
    { label: "Types", id: "categories" as Tab, icon: <LayoutGrid className={getIconClass("categories")} /> },
    { label: "Marketplace", id: "shop" as Tab, icon: <Store className={getIconClass("shop")} /> },
    { label: "Feed", id: "feed" as Tab, icon: <Rss className={getIconClass("feed")} /> },
  ];

  const libraryItems = [
    { label: "Popular now", id: "trending" as Tab, icon: <Flame className={getIconClass("trending")} /> },
    { label: "Recently Viewed", id: "viewed" as Tab, icon: <Eye className={getIconClass("viewed")} /> },
    { label: "Saved", id: "bookmarks" as Tab, icon: <Bookmark className={getIconClass("bookmarks")} /> },
  ];

  const systemItems = [
    { label: "Try Apps", id: "runtime" as Tab, icon: <Rocket className={getIconClass("runtime")} /> },
    { label: "Options", id: "settings" as Tab, icon: <Settings className={getIconClass("settings")} /> },
  ];

  return (
    <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/5 bg-[#031d24] h-[100dvh]">
      {/* ── GITMURPH Brand ── */}
      <div className="px-5 pt-6 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <span className="text-[15px] font-black text-white tracking-tight">G</span>
          </div>
          <div>
            <h1 className="text-[17px] font-bold tracking-tight text-white leading-none">GITMURPH</h1>
            <p className="text-[10px] font-medium text-zinc-500 tracking-wide mt-0.5">Discover · Run · Build</p>
          </div>
        </div>
      </div>

      {/* ── Search Bar Area ── */}
      <div className="p-4 pt-4">
        <form onSubmit={onSearchSubmit} className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full rounded-md border border-white/10 bg-black/20 py-1.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 shadow-inner outline-none transition-all focus:border-blue-500/50 focus:bg-black/40 focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-medium text-zinc-500">
            <span className="text-[9px]">⌘</span>K
          </div>
        </form>
      </div>

      {/* ── Navigation List ── */}
      <nav className="flex flex-1 flex-col gap-6 px-3 py-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">Explore</h3>
          {exploreItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">Library</h3>
          {libraryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">System</h3>
          {systemItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Profile Bottom Region ── */}
      <div className="mt-auto p-4 border-t border-white/5">
        <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black/40 border border-white/10">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
          <span className="text-sm font-semibold text-zinc-300 tracking-tight">
            Chimzy Fire
          </span>
        </button>
      </div>
    </aside>
  );
}
