import BlogForm from "@/app/admin/blogs/_components/blog-form";
import { requireAdmin } from "@/lib/auth-utils";

export default async function NewBlogPage() {
  await requireAdmin();

  return (
    <div className="p-8">
      <BlogForm />
    </div>
  );
}
