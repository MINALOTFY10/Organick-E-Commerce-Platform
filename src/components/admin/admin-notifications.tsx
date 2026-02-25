"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  ShoppingBag,
  Users,
  Package,
  MessageSquare,
  X,
  Loader2,
} from "lucide-react";
import {
  getAdminNotifications,
  type Notification,
} from "@/actions/admin-notification-actions";
import { useRouter } from "next/navigation";

const TYPE_META: Record<
  Notification["type"],
  { icon: typeof Package; color: string; bgColor: string }
> = {
  order:     { icon: ShoppingBag,   color: "text-blue-400",    bgColor: "bg-blue-400/10" },
  user:      { icon: Users,         color: "text-orange-400",  bgColor: "bg-orange-400/10" },
  low_stock: { icon: Package,       color: "text-red-400",     bgColor: "bg-red-400/10" },
  message:   { icon: MessageSquare, color: "text-pink-400",    bgColor: "bg-pink-400/10" },
};

export function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fetch notifications on mount and every 60 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const data = await getAdminNotifications();
      setNotifications(data.notifications);
      if (!dismissed) {
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // Silently fail — user will see stale data
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen((prev) => !prev);
    if (!open) {
      // Mark as read when opening
      setDismissed(true);
      setUnreadCount(0);
    }
  }

  function handleNavigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleDismiss(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 flex items-center justify-center bg-red-500 rounded-full text-[10px] font-bold text-white px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-[#0a1f1a] border border-[#2a4d42] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a3d32]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {loading && <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />}
            </div>
            <button
              onClick={() => setNotifications([])}
              className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Notification list */}
          <div className="max-h-100 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications</p>
                <p className="text-xs text-gray-600 mt-0.5">You&apos;re all caught up</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const meta = TYPE_META[notification.type];
                const Icon = meta.icon;
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNavigate(notification.href)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[#1a3d32]/50 cursor-pointer transition-colors group border-b border-[#1a3d32]/50 last:border-b-0"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.bgColor}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDismiss(notification.id, e)}
                      className="p-1 text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      aria-label="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#1a3d32] text-center">
              <button
                onClick={() => handleNavigate("/admin")}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
