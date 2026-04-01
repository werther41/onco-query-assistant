"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  reportContext: {
    variantInfo: {
      gene: string;
      variant?: string;
      exon?: string;
      nucleotideChange?: string;
      aminoAcidChange?: string;
    };
    report: string;
    civicMarkdown?: string;
  };
}

export default function ChatInterface({ reportContext }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationHistory: messages,
          question: userMessage.content,
          reportContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const { response: assistantResponse } = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantResponse },
      ]);
    } catch (error: unknown) {
      const text =
        error instanceof Error
          ? error.message
          : "Failed to get response. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${text}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-0 sticky top-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(0,0,0,0.07)]">
        <MessageCircle className="w-4 h-4 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">
            Ask Questions
          </p>
          <p className="meta-label mt-0.5">Follow-up about this variant</p>
        </div>
      </div>

      {/* Message list */}
      <div className="h-[480px] overflow-y-auto p-4 space-y-4 bg-surface-alt">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-sm text-muted-foreground">
              Ask a follow-up question about the variant, evidence, or treatment
              options.
            </p>
            <p className="meta-label mt-2">
              e.g. &quot;What is a kinase inhibitor?&quot;
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index}>
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-primary text-white">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-foreground">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-sm font-semibold mb-1.5 mt-3 first:mt-0">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-0.5 mb-2 pl-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-0.5 mb-2 pl-1">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm leading-relaxed">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="bg-[rgba(0,0,0,0.06)] px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-primary/30 pl-3 my-2 text-muted-foreground">{children}</blockquote>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 px-3 py-3 border-t border-[rgba(0,0,0,0.07)] bg-white"
      >
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this variant..."
          disabled={loading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          size="icon-sm"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </Button>
      </form>

      {/* Resources */}
      <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.07)]">
        <p className="meta-label mb-2">Additional Resources</p>
        <div className="flex flex-col gap-1">
          <a
            href="https://civicdb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            CIViC Database Entry
          </a>
          <a href="#" className="text-xs text-primary hover:underline">
            Related Literature
          </a>
          <a href="#" className="text-xs text-primary hover:underline">
            Clinical Trial Information
          </a>
        </div>
      </div>
    </Card>
  );
}
