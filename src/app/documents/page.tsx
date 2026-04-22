"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function Documents() {
  const { documents, addDocument, selectDoc, selectedDoc } = useStore();
  const router = useRouter();

  const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  console.log("📤 Uploading:", file.name);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    console.log("📡 Status:", res.status);

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Server error:", data);
      throw new Error(data.error || "Upload failed");
    }

    console.log("📄 Text length:", data.text.length);

    const newDoc = {
      id: Date.now().toString(),
      name: file.name,
      content: data.text.slice(0, 5000),
    };

    addDocument(newDoc);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    alert("Upload failed. Check console + backend logs.");
  }
};

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      {/* Upload */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="mb-6"
      />

      {/* Empty state */}
      {documents.length === 0 && (
        <p className="text-zinc-400">No documents uploaded yet.</p>
      )}

      {/* List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 rounded-xl border ${
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