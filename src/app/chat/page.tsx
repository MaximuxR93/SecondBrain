"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function Chat() {
  const { selectedDoc, addMessage, getMessages, updateLastMessage } = useStore();

  const docId = selectedDoc?.id || "global";
  const messages = getMessages(docId);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
          context: selectedDoc?.content || "",
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

      // Stream response
      for (let i = 0; i < data.reply.length; i++) {
        current += data.reply[i];
        updateLastMessage(docId, current);
        await new Promise((res) => setTimeout(res, 10));
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
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto bg-zinc-950/50 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md p-4 border-b border-zinc-800 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-zinc-100 tracking-wide">
          Assistant
        </h1>
        <p className="text-xs font-medium text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-700/50">
          Context: {selectedDoc ? selectedDoc.name : "All Documents"}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <p className="text-zinc-500 font-medium">How can I help you today?</p>
            
            {/* Prompt Buttons inside empty state for better UX */}
            <div className="flex gap-3 flex-wrap justify-center max-w-md">
              <button
                onClick={() => handleQuickPrompt("Summarize this document")}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all px-4 py-2 rounded-xl text-sm text-zinc-300 shadow-sm"
              >
                ✨ Summarize
              </button>
              <button
                onClick={() => handleQuickPrompt("What are the key points?")}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all px-4 py-2 rounded-xl text-sm text-zinc-300 shadow-sm"
              >
                🧠 Key Points
              </button>
              <button
                onClick={() => handleQuickPrompt("Give insights")}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all px-4 py-2 rounded-xl text-sm text-zinc-300 shadow-sm"
              >
                📊 Insights
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-zinc-100 text-zinc-900 rounded-br-sm"
                  : "bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 rounded-bl-sm"
              }`}
            >
              {(() => {
                const parts = msg.content.split("Snippet:");
                return (
                  <>
                    <p className="whitespace-pre-wrap">{parts[0]}</p>
                    {parts[1] && (
                      <div className="mt-3 p-3 bg-zinc-950/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-400 font-mono">
                        <strong className="text-zinc-300 block mb-1">
                          Source Snippet:
                        </strong>
                        {parts[1].trim()}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-5 py-3.5 rounded-2xl rounded-bl-sm bg-zinc-800/80 border border-zinc-700/50 flex space-x-2 items-center">
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900/50 backdrop-blur-md border-t border-zinc-800/50">
        <div className="flex gap-2 max-w-3xl mx-auto relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something about the document..."
            disabled={loading}
            className="flex-1 px-4 py-3 pr-14 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 outline-none transition-all text-sm text-zinc-100 placeholder:text-zinc-600"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-100 text-zinc-950 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 p-2 rounded-lg transition-all"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}