
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileUp, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Calendar, 
  CheckCircle2,
  ChevronRight,
  ListTodo,
  AlertCircle,
  Loader2
} from "lucide-react";
import { syllabusIntelligenceEngine, SyllabusIntelligenceEngineOutput } from "@/ai/flows/syllabus-intelligence-engine-flow";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SyllabusPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<SyllabusIntelligenceEngineOutput | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startScan = async () => {
    if (!file) return;
    setIsScanning(true);
    try {
      // Simulate reading file as base64 for the AI flow
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const data = await syllabusIntelligenceEngine({
          syllabusDataUri: base64,
          syllabusDescription: "Course syllabus for upcoming semester"
        });
        setResult(data);
        setIsScanning(false);
      };
    } catch (error) {
      console.error(error);
      setIsScanning(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> AI Powered
        </div>
        <h1 className="text-4xl font-headline font-bold">Syllabus Intelligence Engine</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Upload your course syllabus. Lumina will extract units, detect topics, and build your entire semester timeline in seconds.
        </p>
      </header>

      {!result ? (
        <Card className="glass-card border-dashed border-2 py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <FileUp className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Upload Syllabus</h3>
              <p className="text-muted-foreground">Supported formats: PDF, DOCX, JPEG, PNG</p>
            </div>
            <div className="w-full max-w-sm">
              <Label htmlFor="syllabus-upload" className="sr-only">Choose file</Label>
              <Input 
                id="syllabus-upload" 
                type="file" 
                className="cursor-pointer" 
                onChange={handleFileChange}
                accept=".pdf,.docx,.jpg,.jpeg,.png"
              />
            </div>
            <Button 
              size="lg" 
              className="px-8 font-bold gap-2" 
              disabled={!file || isScanning}
              onClick={startScan}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Syllabus...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Start AI Scan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Units & Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.unitsAndChapters.map((unit, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-secondary/30 border border-white/5 space-y-3">
                    <h4 className="font-bold flex items-center gap-2">
                      <Badge variant="outline" className="text-primary border-primary/20">Unit {idx + 1}</Badge>
                      {unit.unitName}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {unit.chapters.map((chapter, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-background/40">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {chapter}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" /> Semester Timeline
                </CardTitle>
                <CardDescription>Major milestones and events detected</CardDescription>
              </CardHeader>
              <CardContent className="relative pl-8 space-y-8">
                <div className="absolute left-[20px] top-4 bottom-4 w-px bg-border" />
                {result.semesterTimeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[16px] top-1 w-2 h-2 rounded-full bg-accent border-4 border-background ring-4 ring-accent/10" />
                    <div>
                      <p className="text-xs font-bold text-accent uppercase tracking-widest">{item.date}</p>
                      <p className="font-medium text-foreground mt-1">{item.eventDescription}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 sticky top-24">
            <Card className="glass-card border-primary/20">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Scan Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Estimated Study
                  </span>
                  <span className="font-bold text-primary">{result.estimatedStudyHoursOverall}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ListTodo className="w-4 h-4" /> Assignments
                  </span>
                  <span className="font-bold">{result.assignments.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Practicals
                  </span>
                  <span className="font-bold">{result.practicals.length}</span>
                </div>
                <Separator className="my-4" />
                <Button className="w-full gap-2 font-bold" size="lg">
                  Sync to Planner <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                  Scan New Syllabus
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Key Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.assignments.map((asn, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/40 text-sm">
                    <p className="font-bold truncate">{asn.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {asn.dueDate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
