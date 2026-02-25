import Blog from "@/types/blog";
import BlogSection from "@/types/blog-section";
import Image from "next/image";

export type BlogPostProps = {
  post: Blog;
};

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "HEADING":
      return <h2 className="text-3xl font-bold text-[#1B3C58]">{section.content}</h2>;

    case "PARAGRAPH":
      return <p className="text-slate-600 leading-7 text-lg">{section.content}</p>;

    case "LIST":
      return (
        <ul className="list-disc pl-6 space-y-3 text-slate-600 text-lg">
          {section.items?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "ORDERED_LIST":
      return (
        <ol className="list-decimal pl-6 space-y-3 text-slate-600 text-lg">
          {section.items?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );

    case "QUOTE":
      return (
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 flex gap-4 my-12">
          <span className="text-5xl text-[#1B3C58] font-serif">“</span>
          <blockquote className="text-xl md:text-2xl font-bold text-[#1B3C58] italic">
            {section.content}
          </blockquote>
        </div>
      );

    default:
      return null;
  }
}


export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="min-h-screen bg-white pb-20">
      <div className="relative h-[60vh] w-full">
        <Image src={post.heroImage} alt="" fill className="object-cover w-full h-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container mx-auto px-4 lg:px-0">
        <div className="relative -mt-70 z-10 bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-6xl mx-auto border border-gray-100">
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 font-medium">
            <span>Published On: {post.publishDate}</span>
            <span>by {post.author}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1B3C58] mb-6">
            {post.title}
          </h1>

          <p className="text-slate-500 text-lg">{post.subtitle}</p>

          <div className="max-w-3xl mx-auto mt-16 space-y-8">
            {post.sections.map((section, index) => (
              <RenderSection key={index} section={section} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
