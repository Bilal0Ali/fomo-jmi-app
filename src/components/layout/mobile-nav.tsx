"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookCopy, Library, MessageSquareQuestion, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/notes', icon: BookCopy, label: 'Notes' },
  { href: '/resources', icon: Library, label: 'Resources' },
  { href: '/requests', icon: MessageSquareQuestion, label: 'Requests' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-card p-2 sm:hidden">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground",
              pathname.startsWith(item.href) && "text-accent"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
