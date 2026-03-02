import { ReactNode } from "react";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLink?: Url;
  actionIcon?: ReactNode;
}

export default function AdminPageHeader({ title, subtitle, breadcrumb, actionLabel, onAction, actionLink, actionIcon }: AdminPageHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        {breadcrumb && <p className="text-sm text-gray-400 mb-1">{breadcrumb}</p>}

        <h2 className="text-3xl font-bold text-white">{title}</h2>

        {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
      </div>

      {actionLabel &&
        (onAction || actionLink) &&
        (onAction ?
          <button
            onClick={onAction}
            className="flex items-center gap-2 bg-[#00ff7f] text-black px-6 py-3 rounded-lg hover:bg-[#00ff7f]/90 font-medium cursor-pointer"
          >
            {actionIcon}
            {actionLabel}
          </button>
        : <Link href={actionLink!} className="flex items-center gap-2 bg-[#00ff7f] text-black px-6 py-3 rounded-xl hover:bg-[#00ff7f]/90 font-medium">
            {actionIcon}
            {actionLabel}
          </Link>)}
    </header>
  );
}
