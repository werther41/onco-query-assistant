import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import styles from "./markdown.module.css";

export default function ResearchWorkflowPage() {
  // Read the markdown file from the same directory
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "articles",
    "research-workflow",
    "research-workflow.md"
  );
  const fileContents = fs.readFileSync(filePath, "utf8");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/infographic">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Infographic
            </Button>
          </Link>
        </div>

        {/* Article content */}
        <article className={styles.markdownContent}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {fileContents}
          </ReactMarkdown>
        </article>

        {/* Back button at bottom */}
        <div className="mt-12 text-center">
          <Link href="/infographic">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Infographic
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
