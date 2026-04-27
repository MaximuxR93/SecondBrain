import { create } from "zustand";

type Document = {
  id: string;
  name: string;
  content: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Store = {
  documents: Document[];
  selectedDoc: Document | null;

  chatHistory: Record<string, Message[]>;

  addDocument: (doc: Document) => void;
  selectDoc: (doc: Document) => void;

  addMessage: (docId: string, msg: Message) => void;
  getMessages: (docId: string) => Message[];
  updateLastMessage: (docId: string, content: string) => void;

  clearMessages: (docId: string) => void;
};

export const useStore = create<Store>((set, get) => ({
  documents: [],
  selectedDoc: null,

  // 🔥 IMPORTANT: always initialize as empty object
  chatHistory: {},

  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
    })),

  selectDoc: (doc) => set({ selectedDoc: doc }),

  // ✅ Safe message add
  addMessage: (docId, msg) =>
    set((state) => ({
      chatHistory: {
        ...state.chatHistory,
        [docId]: [...(state.chatHistory[docId] || []), msg],
      },
    })),

  // ✅ Always returns array (never undefined)
  getMessages: (docId) => {
    const state = get();
    return state.chatHistory[docId] || [];
  },

  // ✅ Update last assistant message
  updateLastMessage: (docId, content) =>
    set((state) => {
      const msgs = state.chatHistory[docId] || [];

      if (msgs.length === 0) return state;

      const updated = [...msgs];
      updated[updated.length - 1] = {
        role: "assistant",
        content,
      };

      return {
        chatHistory: {
          ...state.chatHistory,
          [docId]: updated,
        },
      };
    }),

  // 🧹 Clear chat (UX feature)
  clearMessages: (docId) =>
    set((state) => ({
      chatHistory: {
        ...state.chatHistory,
        [docId]: [],
      },
    })),
}));