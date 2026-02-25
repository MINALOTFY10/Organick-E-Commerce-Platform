import { Suspense } from "react";
import { Mail } from "lucide-react";
import { SpecificSkeletonPageLayout } from "@/components/ui/skeleton-components";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import AdminPageHeader from "@/components/admin/admin-page-header";
import MessageFiltersProvider from "@/app/admin/messages/_components/message-filters-provider";
import MessageFiltersView from "@/app/admin/messages/_components/message-filters-view";
import MessageTableView from "@/app/admin/messages/_components/message-table-view";
import { getAllContactMessages, getContactMessageStats } from "@/actions/contact-actions";

async function MessagesSection() {
  const [messages, stats] = await Promise.all([
    getAllContactMessages(),
    getContactMessageStats(),
  ]);

  const cards = [
    { label: "Total Messages", value: stats.total, icon: Mail, color: "bg-blue-500/20" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Messages"
        subtitle={`View and manage messages from the contact form. ${stats.total} messages received.`}
        breadcrumb="Home › Messages"
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard cards={cards} />
      </div>

      <MessageFiltersView />
      <MessageTableView messages={messages} />
    </div>
  );
}

export default async function MessagesPage() {
  return (
    <MessageFiltersProvider>
      <Suspense fallback={<SpecificSkeletonPageLayout statsCards={1} tableRows={8} />}>
        <MessagesSection />
      </Suspense>
    </MessageFiltersProvider>
  );
}
