import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, Loader2, AlertCircle, Trash2, Zap, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/ai/chat`;

const suggestedQuestions = [
  "What are my rights as a tenant?",
  "How do I file a small claims case?",
  "What should I do after a car accident?",
  "Analyze a simple non-compete clause.",
];

const LegalAIChat = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
      });
      setMessages((prev) => {
        if (prev[prev.length - 1]?.role === "user") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!user) {
    return (
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-zinc-800 p-12 text-center flex flex-col items-center gap-6">
        <AlertCircle className="w-16 h-16 text-zinc-700" />
        <h3 className="text-2xl font-bold tracking-tight text-white uppercase tracking-wider text-[11px]">Admission Required</h3>
        <p className="text-zinc-500 max-w-sm text-sm mb-4 leading-relaxed uppercase">
          Neural link requires validation. Please authenticate to access the Legal Question AI.
        </p>
        <Button onClick={() => navigate("/login")} className="bg-white text-black rounded-xl font-bold px-10 py-6 text-xs uppercase tracking-widest">Authenticate</Button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-zinc-800 overflow-hidden flex flex-col h-[650px] shadow-2xl shadow-black/20 selection:bg-blue-600/30">
      {/* Header */}
      <div className="flex items-center justify-between p-5 px-6 border-b border-zinc-800/60 bg-zinc-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-blue-600/10 blur-[10px] rounded-full opacity-50" />
             <BrainCircuit className="w-6 h-6 text-cyan-400 relative z-10" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">Legal AI Neural Link</h3>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest text-[10px]">Asynchronous Core v3.0</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-zinc-500 hover:text-white hover:bg-zinc-800/50 rounded-full text-xs font-bold uppercase tracking-tighter">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 py-20 relative">
            <div className="absolute w-[300px] h-[300px] bg-blue-600/5 blur-[80px] rounded-full -z-10" />
            <MessageSquare className="w-20 h-20 text-zinc-800 mb-8" />
            <h4 className="text-2xl font-bold tracking-tighter text-white mb-3">
              Engage the Neural Core.
            </h4>
            <p className="text-sm text-zinc-500 mb-10 max-w-md leading-relaxed">
              Input any legal matter for high-velocity synthesis. Your core is listening. Remember, this is general guidance, not legal counsel.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {suggestedQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="bg-zinc-900/50 hover:bg-blue-600/10 border-zinc-800 hover:border-blue-600/50 text-gray-600 hover:text-cyan-400 rounded-full text-xs font-medium px-5 transition-all duration-300"
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                >
                  <Zap className="w-3 h-3 mr-1.5" /> {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 relative overflow-hidden ${
                    message.role === "user"
                      ? "bg-black border-zinc-800"
                      : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  {message.role === "user" ? (
                    <span className="text-xs font-black uppercase text-white tracking-widest italic">YOU</span>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-blue-600/10 blur-[8px]" />
                      <BrainCircuit className="w-5 h-5 text-cyan-400 relative z-10" />
                    </>
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-3xl p-5 backdrop-blur-md shadow-lg ${
                    message.role === "user"
                      ? "bg-zinc-800 text-gray-900 rounded-tr-none shadow-black/20 border border-zinc-700"
                      : "bg-white/[0.02] text-zinc-200 rounded-tl-none border border-white/5"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 relative">
                   <div className="absolute inset-0 bg-blue-600/10 blur-[8px]" />
                   <BrainCircuit className="w-5 h-5 text-cyan-400 relative z-10" />
                </div>
                <div className="bg-white/[0.02] border border-white/5 text-zinc-200 rounded-3xl rounded-tl-none p-5 shadow-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-5 px-6 border-t border-zinc-800/60 bg-zinc-950/20">
        <div className="flex gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your legal question for synthesis..."
            className="min-h-[50px] max-h-40 resize-none bg-zinc-900/50 border-zinc-800/50 focus:border-blue-600/50 focus:ring-blue-600/20 text-gray-900 rounded-2xl p-4 text-sm leading-relaxed"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 h-[50px] w-[50px] rounded-2xl transition-all shadow-lg ${!input.trim() || isLoading ? 'bg-zinc-800 text-zinc-600' : 'bg-blue-600 hover:bg-cyan-400 text-black shadow-blue-600/20 hover:scale-105'}`"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-700 mt-4 text-center">
          Legal Guidance only. Not professional counsel.
        </p>
      </form>
    </div>
  );
};

export default LegalAIChat;
