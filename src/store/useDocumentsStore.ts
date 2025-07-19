import type { Document, DocumentType } from "@/types/document";
import { create } from "zustand";

type DocumentsStore = {
  documents: Document[] | null;
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (type: DocumentType) => void;
  clearDocuments: () => void;
};

export const useDocumentsStore = create<DocumentsStore>((set) => ({
  documents: null,
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) =>
    set((state) => ({
      documents: state.documents ? [...state.documents, doc] : [doc],
    })),
  removeDocument: (documentType) =>
    set((state) => ({
      documents: state.documents
        ? state.documents.filter((d) => d.documentType !== documentType)
        : null,
    })),
  clearDocuments: () => set({ documents: null }),
}));
