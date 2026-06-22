'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import {
  Bars3Icon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'All Users', href: '/admin', icon: UsersIcon },
  { name: 'Pending Approval', href: '/admin/pending', icon: ClockIcon },
  { name: 'Invite Users', href: '/admin/invite', icon: EnvelopeIcon },
  { name: 'Organisations', href: '/admin/organisations', icon: BuildingOfficeIcon },
  { name: 'Help', href: '/admin/help', icon: QuestionMarkCircleIcon },
];

const NavItems = () => (
  <ul role="list" className="-mx-2 space-y-1">
    {navigation.map((item) => {
      const current = pathname === item.href;
      return (
        <li key={item.name}>
          <Link
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              current
                ? 'text-primary bg-gray-50'
                : 'hover:text-primary text-gray-700 hover:bg-gray-50',
              'group flex gap-x-3 p-2 text-sm/6 font-semibold'
            )}
          >
            <item.icon
              aria-hidden="true"
              className={cn(
                current ? 'text-primary' : 'group-hover:text-primary text-gray-400',
                'size-6 shrink-0'
              )}
            />
            {item.name}
          </Link>
        </li>
      );
    })}
  </ul>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();



  return (
    <div>
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
              <div className="flex h-16 shrink-0 items-center">
                <span className="text-sm font-semibold text-foreground">Admin</span>
              </div>
              <nav className="flex flex-1 flex-col">
                <NavItems />
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <span className="text-sm font-semibold text-foreground">Admin</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <NavItems />
              </li>
              <li className="-mx-6 mt-auto border-t border-border">
                <div className="flex items-center gap-x-3 px-6 py-4">
                  <UserButton />
                  <span className="text-sm font-medium text-foreground">Admin</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="flex-1 text-sm/6 font-semibold text-gray-900">
          {navigation.find((n) => n.href === pathname)?.name ?? 'Admin'}
        </div>
        <UserButton />
      </div>

      <main className="py-10 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}