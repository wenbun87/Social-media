'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Lightbulb,
  BookUser,
  PenTool,
  CalendarDays,
  TrendingUp,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/voice', label: 'Brand Profile', icon: BookUser },
  { href: '/ideas', label: 'Idea Bank', icon: Lightbulb },
  { href: '/transform', label: 'Content Studio', icon: PenTool },
  { href: '/calendar', label: 'Planner', icon: CalendarDays },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-card-dark border-r border-border flex flex-col z-50">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-text-primary">ContentForge</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/15 text-primary-light'
                  : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-border">
        <p className="text-xs text-text-muted">ContentForge v1.0</p>
      </div>
    </aside>
  );
}
