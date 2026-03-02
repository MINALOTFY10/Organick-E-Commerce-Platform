import BlogForm from "@/app/admin/blogs/_components/blog-form";
import { getBlogById } from "@/actions/blog-actions";
import { requireAdmin } from "@/lib/auth-utils";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const blog = await getBlogById(id);

  return (
    <div>
      <BlogForm blog={blog} />
    </div>
  );
}
