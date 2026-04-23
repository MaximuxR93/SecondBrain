"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function Documents() {
  const { documents, addDocument, selectDoc, selectedDoc } = useStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔒 Validate file (extension-based)
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    // 🔒 Prevent duplicate uploads
    if (documents.some((doc) => doc.name === file.name)) {
      alert("This document is already uploaded.");
      e.target.value = "";
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

    // 🔄 Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      {/* Upload */}
      <div className="mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
        />

        {loading && (
          <p className="text-zinc-400 mt-2 text-sm">
            Uploading & processing...
          </p>
        )}
      </div>

      {/* Empty state */}
      {documents.length === 0 && (
        <p className="text-zinc-400">No documents uploaded yet.</p>
      )}

      {/* Documents list */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 rounded-xl border transition ${
              selectedDoc?.id === doc.id
                ? "bg-white text-black"
                : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <div
              onClick={() => selectDoc(doc)}
              className="cursor-pointer font-medium"
            >
              {doc.name}
            </div>

            <div className="mt-2 flex gap-4 text-sm">
              <button
                onClick={() => selectDoc(doc)}
                className="text-blue-400 hover:underline"
              >
                Select
              </button>

              <button
                onClick={() => {
                  selectDoc(doc);
                  router.push("/chat");
                }}
                className="text-green-400 hover:underline"
              >
                Open in Chat →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}