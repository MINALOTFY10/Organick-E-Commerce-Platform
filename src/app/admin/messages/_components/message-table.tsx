"use client";

import { DataTable, Column } from "@/components/admin/data-table";
import { Trash2, Mail, Building, Phone } from "lucide-react";
import { deleteContactMessage } from "@/actions/contact-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  createdAt: Date;
}

interface Props {
  messages: ContactMessage[];
}

export default function MessageTable({ messages }: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await deleteContactMessage(id);
    router.refresh();
  };

  const columns: Column<ContactMessage>[] = [
    {
      header: "Name",
      cell: (msg) => (
        <div>
          <p className="text-white font-medium">{msg.fullName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{msg.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Info",
      cell: (msg) => (
        <div className="space-y-1">
          {msg.company && (
            <div className="flex items-center gap-1">
              <Building className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-300">{msg.company}</span>
            </div>
          )}
          {msg.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-300">{msg.phone}</span>
            </div>
          )}
          {!msg.company && !msg.phone && (
            <span className="text-sm text-gray-500">—</span>
          )}
        </div>
      ),
    },
    {
      header: "Message",
      cell: (msg) => {
        const isExpanded = expandedId === msg.id;
        const isLong = msg.message.length > 100;
        return (
          <div>
            <p className="text-sm text-gray-300 max-w-md">
              {isExpanded || !isLong
                ? msg.message
                : `${msg.message.slice(0, 100)}...`}
            </p>
            {isLong && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId(isExpanded ? null : msg.id);
                }}
                className="text-xs text-[#00ff7f] hover:underline mt-1"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: "Date",
      cell: (msg) => (
        <div>
          <p className="text-sm text-gray-300">
            {new Date(msg.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(msg.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Action",
      cell: (msg) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(msg.id);
          }}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Delete message"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={messages}
      columns={columns}
      emptyState={
        <div className="text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm mt-1">Contact form submissions will appear here.</p>
        </div>
      }
    />
  );
}
