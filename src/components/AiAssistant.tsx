import { useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { ASSISTANT_PROMPTS, assistantReply } from "@/lib/ner-data";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "ai"; text: string };

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "NER Logistics Assistant online. I can compare routes, explain risk scores, locate hubs and run closure simulations over the prototype dataset.",
    },
  ]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }, { role: "ai", text: assistantReply(q) }]);
    setInput("");
  }

  return (
    <>
      {open ? (
        <div className="fixed right-3 bottom-3 z-50 flex h-[min(560px,80vh)] w-[min(400px,calc(100vw-1.5rem))] flex-col rounded-xl border border-cyan/30 bg-surface shadow-2xl">
          <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-cyan/40 bg-cyan/10">
              <Bot className="h-4 w-4 text-cyan" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">AI Logistics Assistant</p>
              <p className="text-[10px] text-muted-foreground">Simulated reasoning · prototype</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[88%] rounded-lg border px-3 py-2 text-xs leading-relaxed",
                  m.role === "ai"
                    ? "border-border bg-background/50"
                    : "ml-auto border-cyan/30 bg-cyan/12 text-cyan",
                )}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {ASSISTANT_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-[10px] text-muted-foreground hover:border-cyan/40 hover:text-cyan"
                >
                  {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about routes, risk, hubs…"
                className="flex-1 rounded-lg border border-input bg-surface-2/60 px-3 py-2 text-xs outline-none focus:border-cyan/50"
              />
              <button
                type="submit"
                className="rounded-lg border border-cyan/40 bg-cyan/15 p-2 text-cyan"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/15 px-4 py-3 text-sm font-semibold text-cyan backdrop-blur transition-colors hover:bg-cyan/25"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </button>
      )}
    </>
  );
}
