"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function Documents() {
  const { documents, addDocument, selectDoc, selectedDoc } = useStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const handleFileProcess = async (file: File) => {
    // 🔒 Validate file (extension-based)
    const allowedExtensions = [".pdf", ".docx", ".txt", ".csv", ".md"];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
      alert("Only PDF, DOCX, TXT, CSV, and MD files are allowed.");
      return;
    }

    // 🔒 Prevent duplicate uploads
    if (documents.some((doc) => doc.name === file.name)) {
      alert("This document is already uploaded.");
      return;
    }

    console.log("📤 Uploading:", file.name);

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      console.log("📡 Status:", res.status);

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Server error:", data);
        throw new Error(data.error || "Upload failed");
      }

      const text = data.text || "";

      console.log("📄 Text length:", text.length);

      if (text.trim().length === 0) {
        alert("No readable text found in this PDF.");
      }

      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        content: text.slice(0, 5000),
      };

      addDocument(newDoc);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Check backend.");
    }

    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="max-w-4xl mx-auto animation-fade-in relative z-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Documents
        </h1>
        <p className="text-zinc-400 mt-2">Manage your knowledge base files.</p>
      </header>

      {/* Upload Area */}
      <div className="mb-10">
        <label
          htmlFor="file-upload"
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            dragActive 
              ? "border-blue-500 bg-blue-500/10" 
              : "border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-zinc-500"
          } ${loading ? "opacity-50 pointer-events-none" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <Loader2 className="w-10 h-10 text-blue-500 mb-3 animate-spin" />
            ) : (
              <div className="bg-zinc-800/50 p-3 rounded-full mb-3 text-zinc-400">
                <UploadCloud size={24} />
              </div>
            )}
            <p className="mb-2 text-sm text-zinc-300">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-zinc-500 text-center px-4">Supported formats: PDF, DOCX, TXT, CSV, MD</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,.csv,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv,text/markdown"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
          Your Files
          <span className="text-xs font-medium px-2 py-0.5 bg-zinc-800/50 text-zinc-300 rounded-full border border-zinc-700/50">
            {documents.length}
          </span>
        </h3>

        {documents.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            <p>No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              
              return (
                <div
                  key={doc.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "ring-1 ring-blue-500/50 border-blue-500/30 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-400"}`}>
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        onClick={() => selectDoc(doc)}
                        className="cursor-pointer font-medium text-zinc-100 truncate hover:text-blue-400 transition-colors"
                        title={doc.name}
                      >
                        {doc.name}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        Added just now
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="text-blue-500 shrink-0" size={18} />}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50">
                    <button
                      onClick={() => selectDoc(doc)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        isSelected 
                          ? "bg-blue-500 text-white shadow-sm" 
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>

                    <button
                      onClick={() => {
                        selectDoc(doc);
                        router.push("/chat");
                      }}
                      className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 px-2 py-1.5 transition-colors ml-auto group"
                    >
                      Chat
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}