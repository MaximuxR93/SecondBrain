"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function Chat() {
  const {
    selectedDoc,
    addMessage,
    getMessages,
    updateLastMessage,
  } = useStore();

  const docId = selectedDoc?.id || "global";
  const messages = getMessages(docId) || [];

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔥 MULTI-DOC CONTEXT
  const getFullContext = () => {
    if (selectedDoc) return selectedDoc.content;

    const { documents } = useStore.getState();

    return documents
      .map(
        (doc) =>
          `Document: ${doc.name}\nContent:\n${doc.content}`
      )
      .join("\n\n");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;

    addMessage(docId, { role: "user", content: userInput });
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          context: getFullContext(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI failed");
      }

      // Add empty assistant message
      addMessage(docId, {
        role: "assistant",
        content: "",
      });

      let current = "";

      // 🔥 STREAMING EFFECT
      for (let i = 0; i < data.reply.length; i++) {
        current += data.reply[i];

        updateLastMessage(docId, current);

        await new Promise((res) => setTimeout(res, 8));
      }
    } catch (err) {
      console.error(err);

      addMessage(docId, {
        role: "assistant",
        content: "⚠️ AI failed. Check backend.",
      });
    }

    setLoading(false);
  };

  const handleQuickPrompt = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat</h1>

      {/* 🔥 MULTI-DOC NOTICE */}
      {!selectedDoc && (
        <p className="text-center text-yellow-400 mb-3 text-sm">
          Using ALL documents for context
        </p>
      )}

      {/* Quick Prompts */}
      <div className="flex gap-2 flex-wrap mb-4 justify-center">
        <button
          onClick={() => handleQuickPrompt("Summarize all documents")}
          className="bg-zinc-800 px-3 py-1 rounded text-sm"
        >
          ✨ Summarize
        </button>

        <button
          onClick={() => handleQuickPrompt("Compare documents")}
          className="bg-zinc-800 px-3 py-1 rounded text-sm"
        >
          🧠 Compare
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 flex flex-col justify-end">
        {messages.length === 0 && (
          <p className="text-center text-zinc-500">
            Start a conversation 👆
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-xl max-w-[70%] text-sm ${
                msg.role === "user"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {msg.role === "assistant" ? (
                (() => {
                  const answer = msg.content.split("Sources:")[0];
                  const sources = msg.content
                    .split("Sources:")[1]
                    ?.split("Snippet:")[0];
                  const snippet = msg.content.split("Snippet:")[1];

                  return (
                    <>
                      {/* Answer */}
                      <p>{answer}</p>

                      {/* Sources */}
                      {sources && (
                        <div className="mt-2 text-xs text-blue-400">
                          📄 Sources:
                          <div className="ml-2">
                            {sources
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, idx) => (
                                <p key={idx}>{line}</p>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Snippet */}
                      {snippet && (
                        <div className="mt-2 p-2 bg-zinc-700 rounded text-xs text-zinc-300">
                          <strong>Snippet:</strong> {snippet}
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-zinc-400 text-sm animate-pulse">
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 border-t border-zinc-800 pt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 rounded-lg bg-zinc-900 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-white text-black px-5 py-2 rounded-lg"
        >
          Send
        </button>
      </div>

      {/* Context */}
      <p className="text-xs text-zinc-400 mt-2 text-center">
        Context: {selectedDoc ? selectedDoc.name : "All Documents"}
      </p>
    </div>
  );
}