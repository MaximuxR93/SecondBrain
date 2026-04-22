"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";

export default function Dashboard() {
  const { documents } = useStore();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/documents"
          className="bg-white text-black px-4 py-2 rounded-lg"
        >
          Upload Document
        </Link>

        <Link
          href="/chat"
          className="bg-zinc-800 px-4 py-2 rounded-lg"
        >
          Open Chat
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <p className="text-zinc-400">
          Total Documents: {documents.length}
        </p>
      </div>

      {/* Recent Docs */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-3 bg-zinc-900 rounded-lg"
          >
            {doc.name}
          </div>
        ))}
      </div>
    </div>
  );
}