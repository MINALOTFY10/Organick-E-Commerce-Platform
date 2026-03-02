"use client";

import { useMemo } from "react";
import MessageTable from "./message-table";
import { useMessageFilters } from "./message-filters-provider";

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

export default function MessageTableView({ messages }: Props) {
  const { search } = useMessageFilters();

  const filteredMessages = useMemo(() => {
    return messages.filter((m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase()) ||
      m.company?.toLowerCase().includes(search.toLowerCase())
    );
  }, [messages, search]);

  return <MessageTable messages={filteredMessages} />;
}
