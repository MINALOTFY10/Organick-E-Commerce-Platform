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
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        {breadcrumb && <p className="text-sm text-gray-400 mb-1">{breadcrumb}</p>}

        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>

        {subtitle && <p className="text-gray-400 mt-1 text-sm md:text-base">{subtitle}</p>}
      </div>

      {actionLabel &&
        (onAction || actionLink) &&
        (onAction ?
          <button
            onClick={onAction}
            className="flex items-center gap-2 bg-[#00ff7f] text-black px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#00ff7f]/90 font-medium cursor-pointer text-sm md:text-base shrink-0 self-start sm:self-auto"
          >
            {actionIcon}
            {actionLabel}
          </button>
        : <Link href={actionLink!} className="flex items-center gap-2 bg-[#00ff7f] text-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl hover:bg-[#00ff7f]/90 font-medium text-sm md:text-base shrink-0 self-start sm:self-auto">
            {actionIcon}
            {actionLabel}
          </Link>)}
    </header>
  );
}
