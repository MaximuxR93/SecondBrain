"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Sparkles, Send, BrainCircuit, BarChart3, FileText } from "lucide-react";

export default function Chat() {
  const { selectedDoc, getMessages, addMessage } = useStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  // ✅ Always get fresh context from store (ROOT FIX)
  const getContext = () => {
    const state = useStore.getState();

    const docs = state.documents;
    const selected = state.selectedDoc;

    if (!selected) return "";

    const fullDoc = docs.find((d) => d.id === selected.id);

    return fullDoc?.content || "";
  };

  // ✅ Messages per document
  const messages = selectedDoc
    ? getMessages(selectedDoc.id)
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customInput?: string) => {
    if (!selectedDoc) {
      alert("Please select a document first.");
      return;
    }

    const message = customInput || input;
    if (!message.trim()) return;

    const context = getContext();

    console.log("📤 CONTEXT LENGTH:", context.length);

    addMessage(selectedDoc.id, {
      role: "user",
      content: message,
    });

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI failed");
      }

      addMessage(selectedDoc.id, {
        role: "assistant",
        content: data.reply,
      });
    } catch (err) {
      console.error("❌ AI error:", err);

      addMessage(selectedDoc.id, {
        role: "assistant",
        content: "Something went wrong. Try again.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-5xl mx-auto bg-zinc-950/80 rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden mt-4">
      {/* Header */}
      <div className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 p-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/10">
            <BrainCircuit size={26} className="drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              AI Assistant <span className="text-[10px] uppercase tracking-wider font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">Beta</span>
            </h1>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <FileText size={12} className="text-zinc-500" />
              {selectedDoc ? selectedDoc.name : "No document selected"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800/50 flex gap-3 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => handleSend("Summarize the key points of the document")}
          className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-full text-sm font-medium transition-all border border-zinc-700/50 hover:border-indigo-500/50 hover:text-indigo-300 whitespace-nowrap shadow-sm hover:shadow-indigo-500/10"
        >
          <Sparkles size={16} className="text-indigo-400" /> Summarize
        </button>

        <button
          onClick={() => handleSend("Extract important skills from the document")}
          className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-full text-sm font-medium transition-all border border-zinc-700/50 hover:border-emerald-500/50 hover:text-emerald-300 whitespace-nowrap shadow-sm hover:shadow-emerald-500/10"
        >
          <BrainCircuit size={16} className="text-emerald-400" /> Extract Skills
        </button>

        <button
          onClick={() => handleSend("Give key insights from this document")}
          className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-full text-sm font-medium transition-all border border-zinc-700/50 hover:border-amber-500/50 hover:text-amber-300 whitespace-nowrap shadow-sm hover:shadow-amber-500/10"
        >
          <BarChart3 size={16} className="text-amber-400" /> Key Insights
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/40 custom-scrollbar">
        {(messages?.length || 0) === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-5 animate-in fade-in duration-700">
            <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 shadow-inner">
              <Sparkles size={36} className="text-indigo-500/60" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-zinc-300 tracking-tight">How can I help you today?</p>
              <p className="text-sm max-w-sm text-zinc-500 mx-auto">Select a quick action above or type your question below to start analyzing your document.</p>
            </div>
          </div>
        )}

        {(messages || []).map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            } animate-in slide-in-from-bottom-2 duration-300`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
              msg.role === "user" 
                ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border border-indigo-400/30" 
                : "bg-gradient-to-br from-zinc-800 to-zinc-900 text-indigo-400 border border-zinc-700/80"
            }`}>
              {msg.role === "user" ? <User size={18} /> : <Bot size={20} />}
            </div>

            {/* Bubble */}
            <div
              className={`px-5 py-4 rounded-2xl max-w-[85%] text-[15px] leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-indigo-600/15 text-indigo-50 border border-indigo-500/30 rounded-tr-sm backdrop-blur-sm"
                  : "bg-zinc-900/90 text-zinc-200 border border-zinc-700/50 rounded-tl-sm backdrop-blur-sm shadow-xl"
              }`}
            >
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800/80">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                    p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 last:mb-0 space-y-2 marker:text-indigo-400" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 last:mb-0 space-y-2 marker:text-indigo-400" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1.5" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-indigo-100 bg-indigo-500/10 px-1.5 py-0.5 rounded-md" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-4 text-white border-b border-zinc-800/80 pb-2 flex items-center gap-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-5 mb-3 text-indigo-50" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-4 mb-2 text-zinc-200" {...props} />,
                    code: ({node, inline, ...props}: any) => 
                      inline 
                        ? <code className="bg-zinc-800/80 text-indigo-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-zinc-700/50" {...props} />
                        : <code className="block bg-zinc-950 p-4 rounded-xl text-[13px] font-mono overflow-x-auto border border-zinc-800 shadow-inner" {...props} />,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 flex-row animate-in fade-in duration-300">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-zinc-800 to-zinc-900 text-indigo-400 border border-zinc-700/80">
              <Bot size={20} />
            </div>
            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-zinc-900/90 border border-zinc-700/50 flex items-center gap-2.5 h-12">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-zinc-900/90 border-t border-zinc-800/80 backdrop-blur-xl">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3 max-w-4xl mx-auto relative group"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AI Assistant..."
            className="flex-1 pl-5 pr-14 py-4 rounded-2xl bg-zinc-950/80 border border-zinc-700/60 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 outline-none text-white transition-all placeholder:text-zinc-500 shadow-inner group-hover:border-zinc-600"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-900/20 active:scale-95"
          >
            <Send size={18} className={`transition-all ${loading ? "opacity-0 scale-50" : "opacity-100 scale-100 ml-0.5"}`} />
            {loading && <div className="absolute w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          </button>
        </form>
        <p className="text-center text-[11px] text-zinc-500 mt-3 font-medium tracking-wide">
          AI can make mistakes. Verify important information from the document.
        </p>
      </div>
    </div>
  );
}