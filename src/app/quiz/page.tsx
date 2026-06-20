
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  BookOpen, 
  Code, 
  HelpCircle, 
  Target, 
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { adaptiveQuizForge, AdaptiveQuizForgeOutput } from "@/ai/flows/adaptive-quiz-forge-flow";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function QuizForgePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState<AdaptiveQuizForgeOutput | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [studyMaterial, setStudyMaterial] = useState("");
  const { toast } = useToast();

  const generateQuiz = async () => {
    if (!studyMaterial.trim()) {
      toast({
        variant: "destructive",
        title: "No material provided",
        description: "Please paste the material you want to be quizzed on.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const data = await adaptiveQuizForge({
        studyMaterial: studyMaterial,
        numQuestions: 5,
        questionTypes: ["MCQ", "True/False", "Coding"]
      });
      setQuizData(data);
      setCurrentQuestionIdx(0);
      setScore(0);
      setIsCompleted(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Forge Failed",
        description: "Could not generate questions from your material.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!quizData) return;
    
    const currentQ = quizData.quizQuestions[currentQuestionIdx];
    
    let isCorrect = false;
    if (currentQ.type === 'MCQ' && selectedAnswer === currentQ.correctAnswer) {
      isCorrect = true;
    } else if (currentQ.type === 'True/False') {
      const boolAns = selectedAnswer === "true";
      if (boolAns === currentQ.answer) isCorrect = true;
    } else if (currentQ.type === 'Coding') {
      isCorrect = true; // Placeholder for coding validation
    }

    if (isCorrect) setScore(s => s + 1);

    if (currentQuestionIdx < quizData.quizQuestions.length - 1) {
      setCurrentQuestionIdx(idx => idx + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-32 h-32 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/10">
          <Target className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Quiz Complete!</h1>
          <p className="text-xl text-muted-foreground">You scored {score} out of {quizData?.quizQuestions.length}</p>
        </div>
        <Card className="glass-card py-8 px-4 flex justify-around">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Accuracy</p>
            <p className="text-3xl font-bold text-primary">{Math.round((score / (quizData?.quizQuestions.length || 1)) * 100)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">XP Earned</p>
            <p className="text-3xl font-bold text-accent">+250 XP</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Questions</p>
            <p className="text-3xl font-bold text-foreground">{quizData?.quizQuestions.length}</p>
          </div>
        </Card>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="px-8 font-bold" onClick={() => {
            setIsCompleted(false);
            setQuizData(null);
            setCurrentQuestionIdx(0);
            setScore(0);
          }}>Back to Forge</Button>
          <Button size="lg" variant="outline" className="px-8 font-bold">Review Answers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-widest">
          <Zap className="w-3 h-3" /> Adaptive Engine
        </div>
        <h1 className="text-4xl font-headline font-bold">Quiz Forge</h1>
        <p className="text-muted-foreground text-lg">
          Generate custom practice tests from your uploaded notes and textbooks. 
        </p>
      </header>

      {!quizData ? (
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Study Material
              </CardTitle>
              <CardDescription>Paste the content you want to generate questions from.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea 
                placeholder="Paste lecture notes, book chapters, or paper abstracts here..." 
                className="min-h-[300px] bg-secondary/30 border-white/5 resize-none"
                value={studyMaterial}
                onChange={(e) => setStudyMaterial(e.target.value)}
              />
              <Button 
                size="lg" 
                className="w-full gap-2 font-bold h-14" 
                disabled={isGenerating || !studyMaterial.trim()}
                onClick={generateQuiz}
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Start Forging Practice Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            <Card className="glass-card">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <Target className="text-accent w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Timed Mock Test</CardTitle>
                <CardDescription>Full length exam simulations (Premium Only)</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Code className="text-primary w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Algorithm Lab</CardTitle>
                <CardDescription>Specific coding challenge generation (Premium Only)</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Question {currentQuestionIdx + 1} of {quizData.quizQuestions.length}</span>
            <div className="flex gap-2">
              {quizData.quizQuestions.map((_, i) => (
                <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i <= currentQuestionIdx ? 'bg-primary' : 'bg-secondary'}`} />
              ))}
            </div>
          </div>

          <Card className="glass-card border-l-4 border-l-primary p-8">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-primary border-primary/20">{quizData.quizQuestions[currentQuestionIdx].type}</Badge>
                </div>
                <h2 className="text-2xl font-bold leading-tight">
                  {quizData.quizQuestions[currentQuestionIdx].question}
                </h2>
              </div>

              {quizData.quizQuestions[currentQuestionIdx].type === 'MCQ' && (
                <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-3">
                  {quizData.quizQuestions[currentQuestionIdx].options.map((option: string, i: number) => (
                    <Label
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-white/5 ${
                        selectedAnswer === option ? 'border-primary bg-primary/5' : 'border-white/5 bg-secondary/30'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`opt-${i}`} />
                      <span className="text-lg">{option}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}

              {quizData.quizQuestions[currentQuestionIdx].type === 'True/False' && (
                <div className="flex gap-4">
                   <Button 
                    variant={selectedAnswer === "true" ? "default" : "secondary"} 
                    className="flex-1 h-16 text-lg font-bold"
                    onClick={() => setSelectedAnswer("true")}
                   >True</Button>
                   <Button 
                    variant={selectedAnswer === "false" ? "default" : "secondary"} 
                    className="flex-1 h-16 text-lg font-bold"
                    onClick={() => setSelectedAnswer("false")}
                   >False</Button>
                </div>
              )}

              {quizData.quizQuestions[currentQuestionIdx].type === 'Coding' && (
                <div className="bg-[#1e1e1e] p-6 rounded-xl font-mono text-sm border border-white/5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-muted-foreground text-xs uppercase tracking-widest">Problem Workspace</span>
                    <Badge variant="outline" className="text-xs">Solution Needed</Badge>
                  </div>
                  <pre className="text-emerald-400">
                    {`// Language: ${(quizData.quizQuestions[currentQuestionIdx] as any).language || 'Code'}\n\n// Solve the problem here:`}
                  </pre>
                  <Textarea placeholder="Enter your solution code snippet..." className="font-mono bg-black/40 border-white/10 mt-4 min-h-[150px]" />
                </div>
              )}

              <div className="pt-6 flex justify-between items-center">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Est. Time: 2 mins
                </p>
                <div className="flex gap-3">
                   <Button variant="ghost" onClick={() => {
                     setQuizData(null);
                     setStudyMaterial("");
                   }}>Reset</Button>
                   <Button size="lg" className="gap-2 font-bold px-10" onClick={handleNext} disabled={!selectedAnswer && quizData.quizQuestions[currentQuestionIdx].type !== 'Coding'}>
                    {currentQuestionIdx === quizData.quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
