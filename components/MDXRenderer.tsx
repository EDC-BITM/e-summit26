"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle2, AlertCircle, Code, FileText } from "lucide-react";
import remarkGfm from "remark-gfm";

// Custom MDX components with theme styling
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl md:text-4xl font-bold mb-6 text-white mt-8 first:mt-0 pb-2 border-b border-[#8F00AF]/30"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl md:text-3xl font-semibold mb-4 text-white mt-8 flex items-center gap-2"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl md:text-2xl font-semibold mb-3 text-white/90 mt-6"
      {...props}
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="text-lg md:text-xl font-semibold mb-2 text-white/80 mt-4"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base text-gray-300 mb-4 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside mb-4 space-y-2 text-gray-300"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-2 text-gray-300"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="ml-4 text-gray-300" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-[#8F00AF] pl-4 py-2 my-4 bg-[#8F00AF]/5 rounded-r-lg italic text-gray-300"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-sm text-[#8F00AF] font-mono"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto my-4"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-[#8F00AF] hover:text-[#8F00AF]/80 underline underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table
        className="w-full border-collapse border border-white/10"
        {...props}
      />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-[#8F00AF]/20" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-white/10 px-4 py-2 text-left text-white font-semibold"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-white/10 px-4 py-2 text-gray-300" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-white/10" {...props} />
  ),
  // Custom components
  Info: ({ children }: { children: React.ReactNode }) => (
    <Alert className="my-4 border-blue-500/30 bg-blue-500/10">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-gray-300 !block">
        <div className="[&_*]:!list-none [&_ul]:!list-disc [&_ol]:!list-decimal [&_li]:ml-4">
          {children}
        </div>
      </AlertDescription>
    </Alert>
  ),
  Success: ({ children }: { children: React.ReactNode }) => (
    <Alert className="my-4 border-green-500/30 bg-green-500/10">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <AlertDescription className="text-gray-300 !block">
        <div className="[&_*]:!list-none [&_ul]:!list-disc [&_ol]:!list-decimal [&_li]:ml-4">
          {children}
        </div>
      </AlertDescription>
    </Alert>
  ),
  Warning: ({ children }: { children: React.ReactNode }) => (
    <Alert className="my-4 border-yellow-500/30 bg-yellow-500/10">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-gray-300 !block">
        <div className="[&_*]:!list-none [&_ul]:!list-disc [&_ol]:!list-decimal [&_li]:ml-4">
          {children}
        </div>
      </AlertDescription>
    </Alert>
  ),
  Card: ({ children }: { children: React.ReactNode }) => (
    <Card className="my-4 bg-white/5 border-white/10">
      <CardContent className="pt-6">
        <div className="[&_*]:!list-none [&_ul]:!list-disc [&_ol]:!list-decimal [&_li]:ml-4">
          {children}
        </div>
      </CardContent>
    </Card>
  ),
};

interface MDXRendererProps {
  content: string;
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function compileMDX() {
      if (!content || content.trim() === "") {
        setMdxSource(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const serialized = await serialize(content, {
          parseFrontmatter: true,
          mdxOptions: {
            development: process.env.NODE_ENV === "development",
            remarkPlugins: [remarkGfm],
          },
        });
        setMdxSource(serialized);
      } catch (err) {
        console.error("MDX compilation error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to compile MDX content",
        );
      } finally {
        setLoading(false);
      }
    }

    compileMDX();
  }, [content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8F00AF]/30 border-t-[#8F00AF]" />
          <p className="text-sm text-gray-400">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="my-4 border-red-500/30 bg-red-500/10">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-gray-300">
          <strong>Error rendering documentation:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!mdxSource) {
    return (
      <Card className="my-4 bg-white/5 border-white/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-gray-400">
            <FileText className="h-5 w-5" />
            <p>No documentation available for this event yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <article className="prose prose-invert prose-purple max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </article>
  );
}
