"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MDXRenderer from "@/components/MDXRenderer";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
  Table,
  Link,
  AlertCircle,
  CheckCircle2,
  Info as InfoIcon,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MDXEditor({
  value,
  onChange,
  placeholder,
}: MDXEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const { toast } = useToast();

  const insertText = (before: string, after: string = "", placeholder = "") => {
    const textarea = document.getElementById(
      "mdx-editor-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newValue =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end);

    onChange(newValue);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = document.getElementById(
      "mdx-editor-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + text + value.substring(start);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertText("# ", "", "Heading"),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertText("## ", "", "Subheading"),
    },
    {
      icon: Bold,
      label: "Bold",
      action: () => insertText("**", "**", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertText("*", "*", "italic text"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertText("- ", "", "List item"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertText("1. ", "", "List item"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertText("`", "`", "code"),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertText("> ", "", "Quote"),
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertText("[", "](url)", "link text"),
    },
    {
      icon: Table,
      label: "Table",
      action: () =>
        insertAtCursor(
          "\n| Column 1 | Column 2 |\n|----------|----------|\n| Data 1   | Data 2   |\n",
        ),
    },
  ];

  const componentButtons = [
    {
      icon: InfoIcon,
      label: "Info Box",
      color: "text-blue-500",
      action: () =>
        insertAtCursor("\n<Info>\n\nYour info content here\n\n</Info>\n"),
    },
    {
      icon: CheckCircle2,
      label: "Success Box",
      color: "text-green-500",
      action: () =>
        insertAtCursor(
          "\n<Success>\n\nYour success content here\n\n</Success>\n",
        ),
    },
    {
      icon: AlertCircle,
      label: "Warning Box",
      color: "text-yellow-500",
      action: () =>
        insertAtCursor(
          "\n<Warning>\n\nYour warning content here\n\n</Warning>\n",
        ),
    },
    {
      icon: Copy,
      label: "Card",
      color: "text-purple-500",
      action: () =>
        insertAtCursor("\n<Card>\n\nYour card content here\n\n</Card>\n"),
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: "MDX content copied to clipboard",
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-background h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="flex flex-col h-full"
      >
        <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <TabsList className="h-8">
            <TabsTrigger value="write" className="text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
          </TabsList>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
        </div>

        <TabsContent
          value="write"
          className="m-0 p-0 flex-1 flex flex-col overflow-hidden"
        >
          {/* Toolbar */}
          <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 flex-shrink-0">
            <div className="flex gap-1 pr-2 border-r">
              {toolbarButtons.slice(0, 2).map((btn) => (
                <Button
                  key={btn.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={btn.action}
                  title={btn.label}
                  className="h-8 w-8 p-0"
                >
                  <btn.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <div className="flex gap-1 pr-2 border-r">
              {toolbarButtons.slice(2, 9).map((btn) => (
                <Button
                  key={btn.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={btn.action}
                  title={btn.label}
                  className="h-8 w-8 p-0"
                >
                  <btn.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {toolbarButtons.slice(9).map((btn) => (
                <Button
                  key={btn.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={btn.action}
                  title={btn.label}
                  className="h-8 w-8 p-0"
                >
                  <btn.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Components */}
          <div className="border-b bg-muted/20 p-2 flex gap-1 flex-shrink-0">
            <span className="text-xs text-muted-foreground mr-2 flex items-center">
              Components:
            </span>
            {componentButtons.map((btn) => (
              <Button
                key={btn.label}
                type="button"
                variant="ghost"
                size="sm"
                onClick={btn.action}
                title={btn.label}
                className="h-7 text-xs px-2"
              >
                <btn.icon className={`h-3 w-3 mr-1 ${btn.color}`} />
                {btn.label.replace(" Box", "")}
              </Button>
            ))}
          </div>

          {/* Editor */}
          <Textarea
            id="mdx-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border-0 rounded-none font-mono text-sm resize-none focus-visible:ring-0 overflow-auto"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0 p-0 flex-1 overflow-auto">
          <div className="p-6 bg-black h-full overflow-auto">
            {value ? (
              <MDXRenderer content={value} />
            ) : (
              <p className="text-muted-foreground text-center py-12">
                Nothing to preview. Start writing in the Write tab.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
