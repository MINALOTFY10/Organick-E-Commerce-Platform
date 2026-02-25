import { Edit3, Trash2, Eye, MessageSquare, FileText } from "lucide-react";
import { Blog } from "./blogs-view";
import { Column, DataTable } from "@/components/admin/data-table";
import Link from "next/link";

interface Props {
  blogs: Blog[];
  onStatusToggle: (id: string) => void;
  onDelete: (blog: Blog) => void;
  isLoading: boolean;
}

export default function BlogTable({ blogs, onStatusToggle, onDelete, isLoading }: Props) {
  const columns: Column<Blog>[] = [
    {
      header: "Title",
      cell: (blog) => (
        <td className="py-4 px-6">
          <div>
            <p className="text-white font-medium">{blog.title}</p>
            <p className="text-gray-400 text-sm mt-1">{blog.slug}</p>
          </div>
        </td>
      ),
    },
    {
      header: "Author",
      cell: (blog) => <td className="py-4 px-6 text-gray-400">{blog.author.name || "Unknown"}</td>,
    },
    {
      header: "Status",
      cell: (blog) => (
        <td className="py-4 px-6">
          <button
            onClick={() => onStatusToggle(blog.id)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              blog.status === "PUBLISHED"
                ? "bg-[#00ff7f]/20 text-[#00ff7f]"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {blog.status}
          </button>
        </td>
      ),
    },
    {
      header: "Views",
      cell: (blog) => (
        <td className="py-4 px-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{blog.views.toLocaleString()}</span>
          </div>
        </td>
      ),
    },
    {
      header: "Comments",
      cell: (blog) => (
        <td className="py-4 px-6">
          <div className="flex items-center gap-2 text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span>{blog._count.comments}</span>
          </div>
        </td>
      ),
    },
    {
      header: "Updated",
      cell: (blog) => (
        <td className="py-4 px-6 text-gray-400">
          {new Date(blog.updatedAt).toLocaleDateString()}
        </td>
      ),
    },
    {
      header: "Actions",
      cell: (blog) => (
        <td className="py-4 px-6 flex gap-4">
          <Link href={`/admin/blogs/${blog.id}/edit`}>
            <Edit3 className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </Link>
          <button onClick={() => onDelete(blog)} disabled={isLoading}>
            <Trash2 className="w-5 h-5 text-red-500 hover:text-red-400 transition-colors" />
          </button>
        </td>
      ),
    },
  ];

  const EmptyState = (
    <>
      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 font-medium">No blogs found</p>
      <p className="text-gray-500 text-sm mt-1">Create your first blog post to get started</p>
    </>
  );

  return <DataTable data={blogs} columns={columns} emptyState={EmptyState} />;
}