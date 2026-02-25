import Link from "next/link";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import Blog from "@/types/blog";

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function getAuthorInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function getAuthorColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function SocialBlogCard({ post }: { post: Blog }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Author Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${getAuthorColor(post.author)} flex items-center justify-center text-white font-bold text-sm shrink-0`}
        >
          {getAuthorInitials(post.author)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-(--primary-color) text-sm truncate">
            {post.author}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={12} />
            <time>{getTimeAgo(post.publishDate)}</time>
            <span className="select-none">·</span>
            <time>{post.publishDate}</time>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <h2 className="text-lg font-bold text-(--primary-color) mb-1 leading-snug">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {post.subtitle}
        </p>
      </div>

      {/* Hero Image */}
      {post.heroImage && (
        <div className="relative">
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>
      )}

      {/* Actions Footer */}
      <div className="px-5 py-3 border-t border-gray-50">
        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 text-(--secondary-color) font-semibold text-sm hover:text-(--primary-color) transition-colors group"
        >
          <BookOpen size={16} />
          <span>Read Full Article</span>
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </article>
  );
}
