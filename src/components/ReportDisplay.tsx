"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportDisplayProps {
  report: string;
  variantInfo: {
    gene: string;
    variant?: string;
  };
}

export default function ReportDisplay({ report, variantInfo }: ReportDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Variant Interpretation Report
        </h2>
        <p className="text-gray-600">
          <span className="font-semibold">Gene:</span> {variantInfo.gene}
          {variantInfo.variant && (
            <>
              {" "}
              | <span className="font-semibold">Variant:</span> {variantInfo.variant}
            </>
          )}
        </p>
      </div>

      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2 ml-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700">{children}</em>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-gray-300">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-200">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-gray-50">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900 bg-gray-100">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 px-4 py-2 text-gray-700">
                {children}
              </td>
            ),
          }}
        >
          {report}
        </ReactMarkdown>
      </div>
    </div>
  );
}

