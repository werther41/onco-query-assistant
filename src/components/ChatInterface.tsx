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
    civicData?: any;
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
      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${
          error.message || "Failed to get response. Please try again."
        }`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-md border-0 sticky top-8 gap-2">
      <div className="flex items-center gap-1">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Ask Questions</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Ask follow-up questions about the variant, evidence, treatment options,
        or request clarification.
      </p>

      <div className="border border-border rounded-lg h-96 flex flex-col mb-1">
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-8">
              <p>Start a conversation by asking a question below.</p>
              <p className="text-sm mt-2">
                Example: "What is a kinase inhibitor?" or "Explain the evidence
                level A."
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[96%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="text-sm">{children}</p>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-lg px-4 py-2">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the variant..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Additional Info Section */}
      <div className="pt-3 border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Additional Resources
        </h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://civicdb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CIViC Entry
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Related Literature
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Trial Information
            </a>
          </li>
        </ul>
      </div>
    </Card>
  );
}
