import { create } from "zustand";

type Document = {
  id: string;
  name: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Store = {
  documents: Document[];
  selectedDoc: Document | null;
  messages: Message[];

  addDocument: (doc: Document) => void;
  selectDoc: (doc: Document) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
};

export const useStore = create<Store>((set) => ({
  documents: [],
  selectedDoc: null,
  messages: [],

  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
    })),

  selectDoc: (doc) => set({ selectedDoc: doc }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  clearMessages: () => set({ messages: [] }),
}));