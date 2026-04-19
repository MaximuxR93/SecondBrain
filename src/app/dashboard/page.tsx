"use client";

import { useStore } from "@/store/useStore";

export default function Documents() {
  const { documents, addDocument, selectDoc } = useStore();

  const handleAdd = () => {
    const newDoc = {
      id: Date.now().toString(),
      name: "Sample Doc " + documents.length,
    };
    addDocument(newDoc);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Documents</h1>

      <button
        onClick={handleAdd}
        className="bg-white text-black px-4 py-2 rounded"
      >
        Add Document
      </button>

      <div className="mt-4 space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => selectDoc(doc)}
            className="p-3 bg-zinc-800 rounded cursor-pointer"
          >
            {doc.name}
          </div>
        ))}
      </div>
    </div>
  );
}