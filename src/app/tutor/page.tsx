
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Paperclip, 
  Languages, 
  Sparkles,
  ChevronDown,
  Play,
  Settings2,
  MoreVertical
} from "lucide-react";
import { multilingualAITutor, MultilingualAITutorOutput } from "@/ai/flows/multilingual-ai-tutor-flow";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  audio?: string;
  timestamp: Date;
};

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: "Hello! I'm Lumina, your AI Academic Tutor. You can upload study materials or ask me any questions. I can explain things in English, Hindi, or both!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "mixed">("mixed");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await multilingualAITutor({
        userInput: input,
        documentContext: "General study help", // In a real app, this would be the actual doc content
        language,
        voiceOutputEnabled: voiceEnabled
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response.responseText,
        audio: response.responseAudioDataUri || undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (dataUri: string) => {
    const audio = new Audio(dataUri);
    audio.play();
  };

  return (
    <div className="h-screen flex flex-col p-4 md:p-8 space-y-4 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold">Lumina AI Tutor</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Online</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium"><Languages className="w-3 h-3" /> Multilingual Support</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-secondary/40 p-2 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <Label htmlFor="voice-toggle" className="text-xs font-semibold cursor-pointer">Voice Output</Label>
            <Switch 
              id="voice-toggle" 
              checked={voiceEnabled} 
              onCheckedChange={setVoiceEnabled} 
            />
          </div>
          <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
            <SelectTrigger className="w-[140px] h-8 text-xs border-none bg-transparent focus:ring-0">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English Only</SelectItem>
              <SelectItem value="hi">Hindi Only</SelectItem>
              <SelectItem value="mixed">Hinglish (Mixed)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex gap-6">
        <Card className="flex-1 glass-card flex flex-col overflow-hidden relative">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6 max-w-4xl mx-auto pb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={msg.role === 'user' ? "https://picsum.photos/seed/user/100/100" : undefined} />
                    <AvatarFallback className={msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                      {msg.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`space-y-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-secondary/60 text-foreground border border-white/5 rounded-tl-none'
                    }`}>
                      {msg.text}
                      {msg.audio && (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="mt-3 h-8 gap-2 bg-background/50 border-none w-full justify-start"
                          onClick={() => playAudio(msg.audio!)}
                        >
                          <Play className="w-3 h-3 fill-current" /> Listen to explanation
                        </Button>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 animate-pulse">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Sparkles className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div className="p-4 rounded-2xl bg-secondary/60 text-sm italic text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-background/50 border-t border-white/5 shrink-0">
            <div className="max-w-4xl mx-auto flex gap-3 items-end">
              <Button variant="secondary" size="icon" className="shrink-0 rounded-full h-11 w-11 bg-secondary/50">
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </Button>
              <div className="flex-1 relative">
                <textarea
                  placeholder="Ask Lumina anything about your studies..."
                  className="w-full bg-secondary/30 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none max-h-32 min-h-[44px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
              </div>
              <Button size="icon" className="shrink-0 rounded-full h-11 w-11" onClick={sendMessage} disabled={!input.trim() || isLoading}>
                <Send className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="icon" className="shrink-0 rounded-full h-11 w-11 bg-secondary/50">
                <Mic className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-3">Lumina can make mistakes. Always check critical information.</p>
          </div>
        </Card>

        <div className="hidden lg:flex flex-col w-80 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Study Context</CardTitle>
              <CardDescription>Relevant materials for this session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">Physics_Unit_2.pdf</p>
                  <p className="text-[10px] text-muted-foreground">Uploaded 2h ago</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs gap-2" size="sm">
                Add More Materials
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Concepts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              {["Wave-Particle Duality", "Schrödinger's Equation", "Photoelectric Effect"].map((concept, i) => (
                <div key={i} className="px-6 py-3 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between group">
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{concept}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground -rotate-90" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);
