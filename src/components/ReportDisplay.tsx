"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import type { Components } from "react-markdown";

interface ReportDisplayProps {
  report: string | null;
  variantInfo: {
    gene: string;
    variant?: string;
  };
  civicMarkdown?: string;
}

const markdownComponents: Partial<Components> = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-semibold text-foreground mt-6 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-foreground mt-3 mb-2">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground mb-1 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc text-muted-foreground mb-4 space-y-2 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2 ml-4">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground">{children}</em>
  ),
  code: ({ children }) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
      {children}
    </code>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline inline-flex items-center gap-1"
    >
      {children}
      <ExternalLink className="w-3 h-3 inline-block" />
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-muted/50">{children}</tr>,
  th: ({ children }) => (
    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground bg-muted">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-2 text-muted-foreground">
      {children}
    </td>
  ),
};

export default function ReportDisplay({
  report,
  variantInfo,
  civicMarkdown,
}: ReportDisplayProps) {
  return (
    <Card className="p-8 shadow-md border-0">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-3xl font-semibold text-foreground mb-2">
          Variant Interpretation Report
        </h2>
        <p className="text-muted-foreground text-lg">
          <span className="font-semibold text-foreground">Gene:</span>{" "}
          {variantInfo.gene}
          {variantInfo.variant && (
            <>
              {" "}
              <span className="text-muted-foreground mx-2">|</span>
              <span className="font-semibold text-foreground">
                Variant:
              </span>{" "}
              {variantInfo.variant}
            </>
          )}
        </p>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>

        <TabsContent value="report" className="markdown-content">
          {report ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {report}
            </ReactMarkdown>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-8 w-1/3 mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-8 w-1/3 mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="source" className="markdown-content">
          {civicMarkdown ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {civicMarkdown}
            </ReactMarkdown>
          ) : (
            <div className="text-muted-foreground">
              No source data available.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
