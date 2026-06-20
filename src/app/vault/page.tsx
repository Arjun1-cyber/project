
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Library, 
  Plus, 
  Sparkles, 
  FileText, 
  Copy, 
  Download,
  Loader2,
  BookOpen,
  Zap,
  Layout
} from "lucide-react";
import { generateStudyMaterial, GenerateStudyMaterialInput } from "@/ai/flows/ai-notes-generator-flow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type MaterialType = GenerateStudyMaterialInput['materialType'];

export default function VaultPage() {
  const [content, setContent] = useState("");
  const [materialType, setMaterialType] = useState<MaterialType>("detailed_notes");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "No content",
        description: "Please paste your lecture notes or textbook material first.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateStudyMaterial({
        content,
        materialType
      });
      setGeneratedResult(response.generatedMaterial);
      toast({
        title: "Material Generated!",
        description: `Your ${materialType.replace('_', ' ')} are ready.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Lumina could not process your request at this time.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      toast({
        title: "Copied!",
        description: "Content copied to your clipboard.",
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            <Library className="text-primary w-10 h-10" /> Knowledge Vault
          </h1>
          <p className="text-muted-foreground">Transform raw study content into structured learning materials.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-card sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Create New Material
              </CardTitle>
              <CardDescription>Paste your notes, transcript, or textbook content below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Paste your content here (e.g. lecture transcripts, rough notes)..." 
                  className="min-h-[300px] bg-secondary/30 border-white/5 resize-none font-sans leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Format</p>
                  <Select value={materialType} onValueChange={(v: MaterialType) => setMaterialType(v)}>
                    <SelectTrigger className="bg-secondary/50 border-white/5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short_notes">Short Notes</SelectItem>
                      <SelectItem value="detailed_notes">Detailed Notes</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                      <SelectItem value="revision_sheets">Revision Sheets</SelectItem>
                      <SelectItem value="mind_map">Mind Map (Textual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full font-bold gap-2" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {generatedResult ? (
            <Card className="glass-card min-h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layout className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Generated {materialType.replace('_', ' ')}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-8">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                    {generatedResult}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[500px] rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8 bg-secondary/10">
              <div className="w-20 h-20 rounded-full bg-secondary/40 flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-muted-foreground">Ready to forge knowledge</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Paste your content on the left and choose a format to begin generating AI-powered study materials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
