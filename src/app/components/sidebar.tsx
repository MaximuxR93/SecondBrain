"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Activity,
  BarChart2,
  BrainCircuit
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Actions", href: "/actions", icon: Activity },
  { name: "Insights", href: "/insights", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-zinc-800/50 flex flex-col z-20 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
          <BrainCircuit size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          SecondBrain
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-zinc-800/80 text-white shadow-sm ring-1 ring-white/10"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
              }`}
            >
              <Icon
                size={18}
                className={`transition-colors ${
                  isActive ? "text-blue-400" : "group-hover:text-zinc-300"
                }`}
              />
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}