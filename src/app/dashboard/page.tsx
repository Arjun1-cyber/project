import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  BookOpen, 
  CalendarDays, 
  Clock, 
  TrendingUp, 
  Zap, 
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, Alex!
          </h1>
          <p className="text-muted-foreground mt-1">You have 3 study goals for today. Let's crush them.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary fill-primary/20" />
            <span className="font-bold text-primary">12 Day Streak</span>
          </div>
          <div className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full flex items-center gap-2">
            <Star className="w-5 h-5 text-accent fill-accent/20" />
            <span className="font-bold text-accent">2,450 XP</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Study Hours
            </CardDescription>
            <CardTitle className="text-3xl font-bold">24.5h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+12%</span> from last week
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Exam Readiness
            </CardDescription>
            <CardTitle className="text-3xl font-bold">82%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={82} className="h-2" />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Course Progress
            </CardDescription>
            <CardTitle className="text-3xl font-bold">4/6</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Courses completed this sem</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Next Exam
            </CardDescription>
            <CardTitle className="text-3xl font-bold">5 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Data Structures & Algos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Smart Schedule</CardTitle>
                <CardDescription>AI-optimized study blocks based on your energy and exams</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                Rebalance <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "10:00 AM", subject: "Quantum Physics", topic: "Wave-Particle Duality", duration: "90 min", type: "Deep Focus", color: "text-primary" },
              { time: "02:00 PM", subject: "Operating Systems", topic: "Process Synchronization", duration: "60 min", type: "Active Recall", color: "text-accent" },
              { time: "05:00 PM", subject: "Database Systems", topic: "Normalization", duration: "45 min", type: "Practice Quiz", color: "text-emerald-500" },
            ].map((block, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-muted-foreground w-20">{block.time}</div>
                  <div className="w-1 h-10 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  <div>
                    <p className="font-bold text-foreground">{block.subject}</p>
                    <p className="text-sm text-muted-foreground">{block.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={block.color + " border-current/20 mb-1"}>{block.type}</Badge>
                  <p className="text-xs text-muted-foreground">{block.duration}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500/20" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="h-20 flex flex-col gap-2 rounded-xl" asChild>
                <Link href="/syllabus">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs">Scan Syllabus</span>
                </Link>
              </Button>
              <Button variant="secondary" className="h-20 flex flex-col gap-2 rounded-xl" asChild>
                <Link href="/tutor">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">AI Tutor</span>
                </Link>
              </Button>
              <Button variant="secondary" className="h-20 flex flex-col gap-2 rounded-xl" asChild>
                <Link href="/quiz">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs">Daily Quiz</span>
                </Link>
              </Button>
              <Button variant="secondary" className="h-20 flex flex-col gap-2 rounded-xl" asChild>
                <Link href="/vault">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Notes Gen</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg">Cognitive Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Spaced Repetition</span>
                  <span className="font-medium text-primary">High Retention</span>
                </div>
                <Progress value={92} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Focus Score</span>
                  <span className="font-medium text-accent">Productive</span>
                </div>
                <Progress value={78} className="h-1.5" />
              </div>
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm font-semibold text-accent flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> AI Insight
                </p>
                <p className="text-xs text-accent/80 mt-1 leading-relaxed">
                  You retain "Physics" better in the morning. Let's move your physics block to 9:00 AM tomorrow.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
