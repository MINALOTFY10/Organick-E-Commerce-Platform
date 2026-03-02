"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, Clock, CornerDownLeft } from "lucide-react";

const RECENT_KEY = "organick_recent_searches";
const MAX_RECENT = 10;

function getStored(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); }
  catch { return []; }
}

function pushRecent(query: string): string[] {
  const items = getStored().filter((s) => s.toLowerCase() !== query.toLowerCase());
  items.unshift(query);
  const trimmed = items.slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
  return trimmed;
}

function removeStored(query: string): string[] {
  const items = getStored().filter((s) => s !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  return items;
}

export default function NavSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Focus + load recents when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setRecentSearches(getStored());
    }
  }, [open]);

  // Live suggestions (debounced 200 ms)
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/suggestions?q=${encodeURIComponent(query.trim())}`,
          { cache: "no-store" }
        );
        if (res.ok) setSuggestions((await res.json()).suggestions ?? []);
      } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  // Close on outside-click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    pushRecent(trimmed);
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onNavigate?.();
  }, [router, onNavigate]);

  const close = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  }, []);

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleRemoveRecent = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(removeStored(item));
  };

  const showRecent = open && !query.trim() && recentSearches.length > 0;
  const showSuggestions = open && !!query.trim() && suggestions.length > 0;
  const dropdownOpen = showRecent || showSuggestions;

  return (
    <div ref={containerRef} className="relative flex items-center ms-auto lg:ms-0 me-5">
      {open ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-1.5"
        >
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(query);
              if (e.key === "Escape") close();
            }}
            placeholder="What are you looking …"
            style={{ outline: "none" }}
            className="flex-1 min-w-0 bg-transparent text-sm text-(--primary-color) placeholder:text-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear"
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="text-sm font-semibold text-(--primary-color) hover:text-(--secondary-color) transition-colors cursor-pointer whitespace-nowrap ml-1"
          >
            Cancel
          </button>
        </motion.div>
      ) : (
        <button
          aria-label="Search products"
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-(--primary-color)/10 text-(--primary-color) hover:bg-(--secondary-color)/15 hover:text-(--secondary-color) transition-all duration-200 cursor-pointer"
        >
          <Search size={18} />
        </button>
      )}

      {/* ── Dropdown ─────────────────────────────────────────────────────── */}
      {dropdownOpen && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden min-w-72 animate-[fadeIn_0.15s_ease-out]">

          {showRecent && (
            <>
              <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Recent searches
              </p>
              {recentSearches.map((item) => (
                <div
                  key={item}
                  onClick={() => commit(item)}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock size={15} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveRecent(item, e)}
                    aria-label={`Remove "${item}"`}
                    className="text-gray-300 hover:text-(--primary-color) transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </>
          )}

          {showSuggestions && suggestions.map((s) => {
            const isRecent = recentSearches.some((r) => r.toLowerCase() === s.toLowerCase());
            return (
              <div
                key={s}
                onClick={() => commit(s)}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isRecent
                    ? <Clock size={15} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                    : <Search size={15} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                  }
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{s}</span>
                </div>
                <CornerDownLeft size={14} className="text-(--primary-color) opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
