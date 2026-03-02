"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Package, ShoppingBag, Users, Newspaper, MessageSquare, X, Loader2 } from "lucide-react";
import { globalSearch, type SearchResult } from "@/actions/admin-search-actions";
import { useRouter } from "next/navigation";

const CATEGORY_META: Record<
  SearchResult["category"],
  { icon: typeof Package; label: string; color: string }
> = {
  product:  { icon: Package,       label: "Products", color: "text-emerald-400" },
  order:    { icon: ShoppingBag,   label: "Orders",   color: "text-blue-400" },
  user:     { icon: Users,         label: "Users",    color: "text-orange-400" },
  blog:     { icon: Newspaper,     label: "Blogs",    color: "text-purple-400" },
  message:  { icon: MessageSquare, label: "Messages", color: "text-pink-400" },
};

export function AdminGlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await globalSearch(q);
      setResults(res);
      setSelectedIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  }

  function navigate(result: SearchResult) {
    setOpen(false);
    router.push(result.href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex]);
    }
  }

  // Group results by category
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      {/* Trigger input */}
      <div className="relative flex-1 max-w-xl">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 pl-10 pr-4 py-2.5 bg-[#1a3d32] border border-[#2a4d42] rounded-lg text-gray-500 hover:border-[#3a5d52] focus:outline-none transition-colors text-left"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <span className="hidden sm:inline">Global search...</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 rounded border border-[#2a4d42] bg-[#0d2820] px-1.5 py-0.5 text-xs text-gray-500">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-[#0c2218] border border-emerald-900/60 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.7)] ring-1 ring-emerald-400/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Search input row */}
            <div className="flex items-center gap-3 px-5 border-b border-[#1a3d32]/80">
              {loading
                ? <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
                : <Search className="w-5 h-5 text-emerald-500/70 shrink-0" />
              }
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, orders, users, blogs, messages..."
                className="flex-1 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base tracking-tight"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results area */}
            <div className="max-h-[52vh] overflow-y-auto">

              {/* Empty — prompt to type */}
              {query.trim().length < 2 && !loading && (
                <div className="py-10 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-900/40 border border-emerald-800/50 mb-4">
                    <Search className="w-5 h-5 text-emerald-400/70" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium mb-1">Search everything</p>
                  <p className="text-gray-600 text-xs">Products, orders, users, blogs, and messages</p>
                  {/* Category pills */}
                  <div className="flex flex-wrap justify-center gap-2 mt-5">
                    {Object.entries(CATEGORY_META).map(([key, meta]) => {
                      const Icon = meta.icon;
                      return (
                        <span key={key} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#1a3d32]/60 border border-[#2a4d42]/60 ${meta.color}`}>
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No results */}
              {query.trim().length >= 2 && !loading && results.length === 0 && (
                <div className="py-12 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/50 mb-4">
                    <Search className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium mb-1">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-gray-600 text-xs">Try a different search term</p>
                </div>
              )}

              {/* Grouped results */}
              {Object.entries(grouped).map(([category, items]) => {
                const meta = CATEGORY_META[category as SearchResult["category"]];
                const Icon = meta.icon;
                return (
                  <div key={category} className="py-1">
                    {/* Category header */}
                    <div className={`flex items-center gap-2 px-5 py-2 text-[11px] font-semibold uppercase tracking-widest ${meta.color}`}>
                      <Icon className="w-3 h-3" />
                      {meta.label}
                    </div>

                    {/* Items */}
                    {items.map((item) => {
                      const globalIdx = results.indexOf(item);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigate(item)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors group ${
                            isSelected
                              ? "bg-emerald-800/30 ring-inset ring-1 ring-emerald-700/40"
                              : "hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#1a3d32]/80 border border-[#2a4d42]/60 ${meta.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/90 truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                          </div>
                          <span className={`text-xs shrink-0 transition-opacity ${isSelected ? "opacity-60 text-emerald-400" : "opacity-0 group-hover:opacity-40 text-gray-400"}`}>
                            ↵
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer — always visible */}
            <div className="px-5 py-2.5 border-t border-[#1a3d32]/80 bg-[#0a1d15]/60 flex items-center gap-4 text-[11px] text-gray-600">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md border border-[#2a4d42] bg-[#0d2820] text-gray-400">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md border border-[#2a4d42] bg-[#0d2820] text-gray-400">↵</kbd>
                Open
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md border border-[#2a4d42] bg-[#0d2820] text-gray-400">Esc</kbd>
                Close
              </span>
              {results.length > 0 && (
                <span className="ml-auto text-gray-500 font-medium">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
