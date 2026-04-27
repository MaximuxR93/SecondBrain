"use client";

import { Search, Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 glass z-10 sticky top-0 border-b border-zinc-800/50 flex items-center justify-between px-6 lg:px-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search documents, chats, insights..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-zinc-400 hover:text-zinc-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-sm ring-2 ring-zinc-800 cursor-pointer hover:ring-zinc-600 transition-all">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}