"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";
import { createBlog, updateBlog } from "@/actions/blog-actions";
import type { BlogWriteInput, BlogSectionInput } from "@/lib/data/blog";

type SectionType = "PARAGRAPH" | "HEADING" | "LIST" | "ORDERED_LIST" | "QUOTE";

interface BlogFormProps {
  blog?: {
    id: string;
    title: string;
    subtitle: string;
    author: string;
    heroImage: string;
    sections: {
      id: string;
      type: SectionType;
      content: string | null;
      items: string[];
      order: number;
    }[];
  };
}

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: "HEADING", label: "Heading" },
  { value: "PARAGRAPH", label: "Paragraph" },
  { value: "QUOTE", label: "Quote" },
  { value: "LIST", label: "Bullet List" },
  { value: "ORDERED_LIST", label: "Numbered List" },
];

function emptySection(order: number): BlogSectionInput {
  return { type: "PARAGRAPH", content: "", items: [], order };
}

export default function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(blog?.heroImage || "");

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    subtitle: blog?.subtitle || "",
    author: blog?.author || "",
    heroImage: blog?.heroImage || "",
  });

  const [sections, setSections] = useState<BlogSectionInput[]>(
    blog?.sections.length
      ? blog.sections.map((s) => ({
          type: s.type,
          content: s.content ?? "",
          items: s.items ?? [],
          order: s.order,
        }))
      : [emptySection(0)],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "heroImage") setImagePreview(value);
  };

  // Section helpers
  const updateSection = (idx: number, patch: Partial<BlogSectionInput>) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    );
  };

  const addSection = () => {
    setSections((prev) => [...prev, emptySection(prev.length)]);
  };

  const removeSection = (idx: number) => {
    setSections((prev) =>
      prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i })),
    );
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    setSections((prev) => {
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy.map((s, i) => ({ ...s, order: i }));
    });
  };

  // List item helpers
  const addListItem = (sectionIdx: number) => {
    updateSection(sectionIdx, {
      items: [...(sections[sectionIdx].items ?? []), ""],
    });
  };

  const updateListItem = (sectionIdx: number, itemIdx: number, value: string) => {
    const items = [...(sections[sectionIdx].items ?? [])];
    items[itemIdx] = value;
    updateSection(sectionIdx, { items });
  };

  const removeListItem = (sectionIdx: number, itemIdx: number) => {
    const items = (sections[sectionIdx].items ?? []).filter((_, i) => i !== itemIdx);
    updateSection(sectionIdx, { items });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload: BlogWriteInput = {
      ...formData,
      sections: sections.map((s, i) => ({ ...s, order: i })),
    };

    const result = blog
      ? await updateBlog(blog.id, payload)
      : await createBlog(payload);

    if (!result.success) {
      setError(result.message);
    } else {
      router.push("/admin/blogs");
      router.refresh();
    }
    setLoading(false);
  };

  const isListType = (type: SectionType) => type === "LIST" || type === "ORDERED_LIST";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="p-2 hover:bg-[#2a4d42] rounded-lg transition-colors shrink-0">
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {blog ? "Edit Blog Post" : "Create Blog Post"}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              {blog ? "Update your blog post content" : "Write a new blog post"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-4 md:p-8">
          <h3 className="text-lg font-bold text-white mb-6">Basic Information</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors"
                  placeholder="Blog post title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Subtitle *</label>
                <textarea
                  name="subtitle"
                  required
                  value={formData.subtitle}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors resize-none"
                  placeholder="A brief summary of the blog post"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Author *</label>
                <input
                  type="text"
                  name="author"
                  required
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Hero Image URL *</label>
                <input
                  type="url"
                  name="heroImage"
                  required
                  value={formData.heroImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors"
                  placeholder="https://..."
                />
                {imagePreview && (
                  <div className="mt-4 relative rounded-lg border border-[#2a4d42] overflow-hidden h-48 bg-[#0d2820]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Content Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ff7f]/20 text-[#00ff7f] rounded-lg hover:bg-[#00ff7f]/30 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-[#0d2820] border border-[#2a4d42] rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveSection(idx, -1)}
                        disabled={idx === 0}
                        className="text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        title="Move up"
                      >
                        <GripVertical className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(idx, 1)}
                        disabled={idx === sections.length - 1}
                        className="text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        title="Move down"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">
                      Section {idx + 1}
                    </span>
                    <select
                      value={section.type}
                      onChange={(e) =>
                        updateSection(idx, {
                          type: e.target.value as SectionType,
                          // Reset content/items when switching between list and non-list
                          ...(isListType(e.target.value as SectionType) !== isListType(section.type)
                            ? { content: "", items: [] }
                            : {}),
                        })
                      }
                      className="px-3 py-1.5 bg-[#1a3d32] border border-[#2a4d42] rounded-lg text-white text-sm focus:outline-none focus:border-[#00ff7f] transition-colors"
                    >
                      {SECTION_TYPES.map((st) => (
                        <option key={st.value} value={st.value}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSection(idx)}
                    disabled={sections.length === 1}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30"
                    title="Remove section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isListType(section.type) ? (
                  <div className="space-y-2">
                    {(section.items ?? []).map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm w-6 text-right">
                          {section.type === "ORDERED_LIST" ? `${itemIdx + 1}.` : "•"}
                        </span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListItem(idx, itemIdx, e.target.value)}
                          className="flex-1 px-3 py-2 bg-[#1a3d32] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors text-sm"
                          placeholder="List item..."
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem(idx, itemIdx)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem(idx)}
                      className="flex items-center gap-1 text-sm text-[#00ff7f] hover:text-[#00ff7f]/80 transition-colors mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Item
                    </button>
                  </div>
                ) : (
                  <textarea
                    value={section.content ?? ""}
                    onChange={(e) => updateSection(idx, { content: e.target.value })}
                    rows={section.type === "HEADING" ? 1 : 4}
                    className="w-full px-4 py-3 bg-[#1a3d32] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors resize-none"
                    placeholder={
                      section.type === "HEADING"
                        ? "Section heading..."
                        : section.type === "QUOTE"
                          ? "Quote text..."
                          : "Paragraph content..."
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/blogs"
            className="px-6 py-3 text-gray-400 hover:bg-[#0d2820] rounded-lg transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#00ff7f] text-black rounded-lg hover:bg-[#00ff7f]/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> {blog ? "Update Post" : "Publish Post"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
