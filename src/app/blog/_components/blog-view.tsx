"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Blog from "@/types/blog";
import { SocialBlogCard } from "./blog-card";

interface BlogViewProps {
  blogs: Blog[];
}

type SortOrder = "newest" | "oldest";

export default function BlogView({ blogs }: BlogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique authors
  const authors = useMemo(() => {
    const authorSet = new Set(blogs.map((b) => b.author));
    return Array.from(authorSet).sort();
  }, [blogs]);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }

    if (selectedAuthor) {
      result = result.filter((b) => b.author === selectedAuthor);
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [blogs, searchQuery, selectedAuthor, sortOrder]);

  const activeFilterCount =
    (selectedAuthor ? 1 : 0) + (sortOrder !== "newest" ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAuthor(null);
    setSortOrder("newest");
  };

  return (
    <section className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Search & Filters Bar */}
        <div className="sticky top-0 z-10 pb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            {/* Search Row */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] rounded-full text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "bg-(--secondary-color) text-white"
                    : "bg-[#f0f2f5] text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-white text-(--secondary-color) text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Sort */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    {(["newest", "oldest"] as const).map((order) => (
                      <button
                        key={order}
                        onClick={() => setSortOrder(order)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          sortOrder === order
                            ? "bg-(--primary-color) text-white"
                            : "bg-[#f0f2f5] text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {order === "newest" ? "Latest First" : "Oldest First"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Authors */}
                {authors.length > 1 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Author
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedAuthor(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          !selectedAuthor
                            ? "bg-(--primary-color) text-white"
                            : "bg-[#f0f2f5] text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        All
                      </button>
                      {authors.map((author) => (
                        <button
                          key={author}
                          onClick={() =>
                            setSelectedAuthor(
                              selectedAuthor === author ? null : author,
                            )
                          }
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedAuthor === author
                              ? "bg-(--primary-color) text-white"
                              : "bg-[#f0f2f5] text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {author}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear All */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {(searchQuery || selectedAuthor) && (
          <div className="mb-4 px-1">
            <p className="text-sm text-gray-500">
              {filteredBlogs.length}{" "}
              {filteredBlogs.length === 1 ? "post" : "posts"} found
              {searchQuery && (
                <span>
                  {" "}
                  for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
              )}
              {selectedAuthor && (
                <span>
                  {" "}
                  by <strong>{selectedAuthor}</strong>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Blog Feed */}
        <div className="space-y-4">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((post) => (
              <SocialBlogCard key={post.id} post={post} />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-gray-300 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
              <button
                onClick={clearFilters}
                className="text-(--secondary-color) font-medium text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
