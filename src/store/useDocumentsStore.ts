import type { DocumentName } from "@/types/document";
import { create } from "zustand";

type DocumentsStore = {
  documents: DocumentName[] | null;
  setDocuments: (docs: DocumentName[]) => void;
  addDocument: (doc: DocumentName) => void;
  addDocuments: (docs: DocumentName[]) => void;
  removeDocument: (type: DocumentName) => void;
  clearDocuments: () => void;
  requestId?: string | null;
  setRequestId: (requestId?: string) => void;
};

export const useDocumentsStore = create<DocumentsStore>((set) => ({
  documents: null,
  requestId: null,
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) =>
    set((state) => ({
      documents: state.documents ? [...state.documents, doc] : [doc],
    })),
  addDocuments: (docs) =>
    set((state) => ({
      documents: state.documents ? [...state.documents, ...docs] : docs,
    })),
  removeDocument: (document) =>
    set((state) => ({
      documents: state.documents
        ? state.documents.filter((v) => v !== document)
        : null,
    })),
  clearDocuments: () => set({ documents: null }),
  setRequestId: (requestId) => set({ requestId }),
}));
