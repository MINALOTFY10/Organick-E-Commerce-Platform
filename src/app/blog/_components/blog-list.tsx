import Blog from "@/types/blog";
import Image from "next/image";
import { User, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BlogListProps {
  blogs: Blog[];
}

export function BlogCard({ post }: { post: Blog }) {
  return (
    <Link href={`/blog/${post.id}`} className="block group">
      <article className="relative cursor-pointer rounded-[30px]">
        <div className="relative h-75 md:h-100 w-full overflow-hidden rounded-[30px]">
          <img src={post.heroImage} alt={post.title} className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute top-8 left-8 bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-md">
            <time className="text-(--primary-color) font-bold text-lg leading-none">{post.day}</time>
            <span className="text-(--primary-color) font-bold text-sm">{post.month}</span>
          </div>
        </div>

        <div
          className="
            relative -mt-32 mx-6 bg-white rounded-[30px] p-8
            shadow-[0_30px_90px_rgba(0,0,0,0.08),0_15px_60px_rgba(0,0,0,0.06)]
            group-hover:-translate-y-1 transition-all duration-300
          "
        >
          <div className="flex items-center gap-2 text-[#274C5B] mb-3">
            <User size={16} className="text-[#f3dc7c]" />
            <span className="text-sm font-medium">By {post.author}</span>
          </div>
          <h3 className="text-(--primary-color) text-xl font-extrabold mb-3 group-hover:text-(--secondary-color) transition-colors">{post.title}</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{post.subtitle}</p>
          <div className="inline-flex items-center bg-[#f3dc7c] text-[#214a3a] font-bold rounded-xl px-6 py-3 transition-all hover:bg-[#f6e28e]">
            <span className="mr-3 text-sm">Read More</span>
            <span className="bg-[#214a3a] text-white rounded-full p-1">
              <ArrowRight size={10} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <>
      {blogs.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </>
  );
}
