"use client";

export default function Topbar() {
  return (
    <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6">
      <input
        placeholder="Search..."
        className="bg-zinc-900 px-3 py-2 rounded-md text-sm outline-none"
      />

      <div className="text-sm text-zinc-400">
        User
      </div>
    </div>
  );
}