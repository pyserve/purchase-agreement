import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Document } from "@/types/document";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

interface DocumentDisplayProps {
  document?: Document;
  documents: Document[];
  onDocumentSelect: (id: number) => void;
}

export default function DocumentDisplay({
  document,
  documents,
  onDocumentSelect,
}: DocumentDisplayProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handlePrevious = () => {
    if (!document) return;
    const currentIndex = documents.findIndex((d) => d.id === document.id);
    if (currentIndex > 0) {
      onDocumentSelect(documents[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (!document) return;
    const currentIndex = documents.findIndex((d) => d.id === document.id);
    if (currentIndex < documents.length - 1) {
      onDocumentSelect(documents[currentIndex + 1].id);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleFitToScreen = () => {
    setZoomLevel(100);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  if (!document) {
    return (
      <section className="flex-1 bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No document selected</p>
          <p className="text-sm text-gray-400">
            Select a document from the sidebar to view it
          </p>
        </div>
      </section>
    );
  }

  const currentIndex = documents.findIndex((d) => d.id === document.id);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < documents.length - 1;

  return (
    <section className="flex-1 bg-gray-100 p-6 flex flex-col">
      {/* Document Info Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{document.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Weaver Eco Home Inc. • Last modified 2 hours ago
        </p>
      </div>

      {/* Single Image Display */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-4xl w-full bg-white shadow-lg overflow-hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              {imageLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-gray-100 h-96"
                >
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Loading document...</p>
                  </div>
                </motion.div>
              )}

              {imageError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-gray-100 h-96"
                >
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Unable to load document
                    </h4>
                    <p className="text-gray-600 mb-4">
                      The document could not be displayed. Please try refreshing
                      the page.
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                </motion.div>
              )}

              {!imageLoading && !imageError && (
                <motion.img
                  key={document.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={document.imageUrl}
                  alt={document.name}
                  className="w-full h-auto max-h-[800px] object-contain"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "center center",
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onLoadStart={handleImageLoadStart}
                />
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Document Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            {/* Page {document.pageNumber} of {document.totalPages} */}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Zoom Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[50px] text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Fit to Screen */}
          <Button variant="ghost" size="sm" onClick={handleFitToScreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
