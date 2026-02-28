import NewTaglineImg from "@/../public/img/news-tagline.png";
import Image from "next/image";
import TransparentButton from "@/components/ui/transparent-button";
import { getRecentBlogs } from "@/actions/blog-actions";
import { mapRowBlogToBlog } from "@/mappers/blog-mapper";
import BlogList from "@/app/blog/_components/blog-list";
import Blog from "@/types/blog";
import Link from "next/link";

interface BlogsViewProps {
  blogs: Blog[];
}

export default async function BlogsView({ blogs }: BlogsViewProps) {
  return (
    <section className="bg-white mt-10 mb-10 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <Image src={NewTaglineImg} alt="Natural food" width={60} height={40} className="object-contain" />

            <h2 className="text-[#274C5B] text-3xl md:text-3xl lg:text-4xl font-extrabold mt-1 leading-tight">
              Discover weekly content about organic food, & more
            </h2>
          </div>

          <Link href="/blog" className="self-start md:self-end">
            <TransparentButton variant="login">
              <span className="flex items-center gap-2">
                View All
              </span>
            </TransparentButton>
          </Link>
        </div>

        {/* Blog Cards Grid */}
          <div
            className="
              flex md:grid md:grid-cols-2 gap-8 md:gap-10
              overflow-x-auto md:overflow-visible
              snap-x snap-mandatory md:snap-none scrollbar-hide pb-4 md:pb-0
            "
          >
            {blogs.map((post) => (
              <div
                key={post.id}
                className="shrink-0 snap-center w-[80vw] sm:w-[60vw] md:w-full"
              >
                <BlogList blogs={[post]} />
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
