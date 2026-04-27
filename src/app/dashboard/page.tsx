"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { UploadCloud, MessageSquare, FileText, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { documents } = useStore();

  return (
    <div className="max-w-5xl mx-auto animation-fade-in relative z-10">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-zinc-400 mt-2">Here's an overview of your knowledge base.</p>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/documents"
          className="group glass-panel p-6 rounded-2xl flex items-start justify-between hover:bg-zinc-800/60 hover:ring-1 hover:ring-white/20 transition-all duration-300"
        >
          <div>
            <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-100">Upload Document</h2>
            <p className="text-sm text-zinc-400 mt-1">Add new PDFs to your knowledge base.</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/chat"
          className="group glass-panel p-6 rounded-2xl flex items-start justify-between hover:bg-zinc-800/60 hover:ring-1 hover:ring-white/20 transition-all duration-300"
        >
          <div>
            <div className="bg-purple-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-100">Open Chat</h2>
            <p className="text-sm text-zinc-400 mt-1">Talk to your SecondBrain AI assistant.</p>
          </div>
          <ArrowRight className="text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </section>

      {/* Stats & Recent Docs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-zinc-100">Recent Documents</h3>
          <span className="text-xs font-medium px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-full border border-zinc-700/50">
            Total: {documents.length}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center border border-dashed border-zinc-700">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 text-zinc-500">
              <FileText size={24} />
            </div>
            <h4 className="text-zinc-200 font-medium mb-1">No documents yet</h4>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              Get started by uploading your first PDF document to build your knowledge base.
            </p>
            <Link href="/documents" className="mt-6 px-4 py-2 bg-white text-black font-medium rounded-lg text-sm hover:bg-zinc-200 transition-colors">
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 6).map((doc) => (
              <div
                key={doc.id}
                className="glass-panel p-4 rounded-xl flex items-start gap-3 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="p-2 bg-zinc-800/50 rounded-lg text-blue-400 shrink-0">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-zinc-200 truncate">{doc.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">PDF Document</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}