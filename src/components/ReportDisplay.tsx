"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DataPulse } from "@/components/ui/data-pulse";
import { ExternalLink } from "lucide-react";
import type { Components } from "react-markdown";

interface ReportDisplayProps {
  report: string | null;
  generating?: boolean;
  variantInfo: {
    gene: string;
    variant?: string;
  };
  civicMarkdown?: string;
}

const markdownComponents: Partial<Components> = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-semibold text-foreground mt-6 mb-3 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-foreground mt-5 mb-2 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-foreground mt-4 mb-1.5">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-foreground mt-3 mb-1">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc text-sm text-muted-foreground mb-4 space-y-1.5 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-sm text-muted-foreground mb-4 space-y-1.5 ml-4">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-sm text-muted-foreground">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground">{children}</em>
  ),
  code: ({ children }) => (
    <code className="bg-surface-alt px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
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
    <div className="overflow-x-auto my-5">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-alt">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-surface-alt transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-sm text-muted-foreground">{children}</td>
  ),
};

export default function ReportDisplay({
  report,
  generating,
  variantInfo,
  civicMarkdown,
}: ReportDisplayProps) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-5 pb-4 border-b border-[rgba(0,0,0,0.07)]">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">
            Interpretation Report
          </h2>
          {generating && <DataPulse label="Generating" />}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div>
            <span className="meta-value-bold">{variantInfo.gene}</span>
            <span className="meta-label ml-2">Gene</span>
          </div>
          {variantInfo.variant && (
            <div>
              <span className="meta-value-bold">{variantInfo.variant}</span>
              <span className="meta-label ml-2">Variant</span>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="source">CIViC Source</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          {report ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {report}
            </ReactMarkdown>
          ) : (
            <div className="space-y-3 pt-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-5 w-1/3 mt-5" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-5 w-1/3 mt-5" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="source">
          {civicMarkdown ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {civicMarkdown}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-muted-foreground pt-2">
              No source data available.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
