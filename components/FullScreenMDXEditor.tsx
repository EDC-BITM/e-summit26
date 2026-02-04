"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import MDXEditor from "@/components/MDXEditor";

interface FullScreenMDXEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  eventName?: string;
}

export default function FullScreenMDXEditor({
  value,
  onChange,
  onClose,
  eventName,
}: FullScreenMDXEditorProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-muted/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Edit Event Documentation</h2>
          {eventName && (
            <p className="text-sm text-muted-foreground">{eventName}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <MDXEditor value={value} onChange={onChange} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/50 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted border rounded">Esc</kbd> to
          close
        </p>
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}
