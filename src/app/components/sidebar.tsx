"use client";
import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Documents", href: "/documents" },
  { name: "Chat", href: "/chat" },
  { name: "Actions", href: "/actions" },
  { name: "Insights", href: "/insights" },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-zinc-900 p-5 border-r border-zinc-800">
      <h1 className="text-xl font-bold mb-6">SecondBrain</h1>

      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="block px-3 py-2 rounded-lg hover:bg-zinc-800 transition"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}