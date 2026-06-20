'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Code, 
  Sparkles, 
  Bug, 
  Zap, 
  BookOpen, 
  Copy, 
  CheckCircle2,
  Loader2,
  MessageSquare
} from "lucide-react";
import { codingHelper, CodingHelperOutput } from "@/ai/flows/coding-helper-flow";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function CodingHelperPage() {
  const [code, setCode] = useState("");
  const [task, setTask] = useState<'debug' | 'explain' | 'optimize' | 'refactor'>('explain');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CodingHelperOutput | null>(null);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "No code provided",
        description: "Please paste your code snippet to get help.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await codingHelper({
        code,
        task,
        language: "auto-detect"
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Assistant Error",
        description: "Lumina could not process your code at this time.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
          <Code className="text-primary w-10 h-10" /> Coding Helper
        </h1>
        <p className="text-muted-foreground">Debug, explain, or optimize your programming assignments with AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Code Input</CardTitle>
              <CardDescription>Paste your snippet below and select a task.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="// Paste your code here..." 
                className="min-h-[400px] font-mono text-sm bg-secondary/30 border-white/5 resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={task === 'debug' ? 'default' : 'secondary'} 
                  className="gap-2" 
                  onClick={() => setTask('debug')}
                >
                  <Bug className="w-4 h-4" /> Debug
                </Button>
                <Button 
                  variant={task === 'explain' ? 'default' : 'secondary'} 
                  className="gap-2" 
                  onClick={() => setTask('explain')}
                >
                  <BookOpen className="w-4 h-4" /> Explain
                </Button>
                <Button 
                  variant={task === 'optimize' ? 'default' : 'secondary'} 
                  className="gap-2" 
                  onClick={() => setTask('optimize')}
                >
                  <Zap className="w-4 h-4" /> Optimize
                </Button>
                <Button 
                  variant={task === 'refactor' ? 'default' : 'secondary'} 
                  className="gap-2" 
                  onClick={() => setTask('refactor')}
                >
                  <MessageSquare className="w-4 h-4" /> Refactor
                </Button>
              </div>
              <Button 
                className="w-full gap-2 font-bold h-12" 
                onClick={handleProcess} 
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isProcessing ? "Processing..." : `Lumina, ${task} this!`}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Analysis
                    <Badge variant="outline" className="uppercase tracking-widest">{task}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{result.analysis}</p>
                </CardContent>
              </Card>

              {result.improvedCode && (
                <Card className="glass-card bg-[#1e1e1e]">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                    <CardTitle className="text-sm font-mono text-emerald-400">Improved Code</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result.improvedCode!)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <pre className="font-mono text-sm overflow-x-auto text-foreground">
                      {result.improvedCode}
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Explanation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.keyTakeaways.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/90 font-medium">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8 bg-secondary/10">
              <Code className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-muted-foreground">Awaiting your code...</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2">
                Paste your code on the left and Lumina will help you master it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}