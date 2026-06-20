
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Flame, 
  Star, 
  Zap, 
  BookOpen, 
  Code, 
  Target, 
  Lock,
  CheckCircle2,
  Medal,
  Award
} from "lucide-react";

const achievements = [
  { id: 1, title: "Night Owl", desc: "Complete 5 study sessions after 10 PM", progress: 80, icon: Flame, color: "text-orange-500", locked: false },
  { id: 2, title: "Syllabus Slayer", desc: "Upload and analyze 3 full course syllabi", progress: 100, icon: Target, color: "text-primary", locked: false },
  { id: 3, title: "Polyglot Scholar", desc: "Use AI Tutor in 3 different languages", progress: 40, icon: Zap, color: "text-accent", locked: false },
  { id: 4, title: "Code Master", desc: "Solve 10 coding challenges with Lumina", progress: 10, icon: Code, color: "text-emerald-500", locked: true },
  { id: 5, title: "Note Ninja", desc: "Generate 50 flashcards in Knowledge Vault", progress: 95, icon: BookOpen, color: "text-primary", locked: false },
  { id: 6, title: "The Planner", desc: "Follow a rebalanced study plan for 7 days", progress: 0, icon: Medal, color: "text-yellow-500", locked: true },
];

export default function AchievementsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            <Trophy className="text-yellow-500 w-10 h-10" /> Scholar Milestones
          </h1>
          <p className="text-muted-foreground mt-2">Level up your academic journey and collect legendary badges.</p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-white/5">
          <div className="text-center px-4 border-r border-white/10">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total XP</p>
            <p className="text-2xl font-bold text-primary">2,450</p>
          </div>
          <div className="text-center px-4 border-r border-white/10">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Rank</p>
            <p className="text-2xl font-bold text-accent">#42</p>
          </div>
          <div className="text-center px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Badges</p>
            <p className="text-2xl font-bold">12/48</p>
          </div>
        </div>
      </header>

      <Card className="glass-card bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
             <div>
                <CardTitle className="text-xl">Level 12: Master Librarian</CardTitle>
                <CardDescription>240 XP until Level 13</CardDescription>
             </div>
             <Award className="w-10 h-10 text-primary opacity-50" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={78} className="h-3" />
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
             <span>Level 12</span>
             <span>Level 13</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item) => (
          <Card key={item.id} className={`glass-card group overflow-hidden ${item.locked ? 'opacity-50 grayscale' : ''}`}>
            <CardHeader className="pb-4 relative">
              <div className={`w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${item.color}`}>
                {item.locked ? <Lock className="w-6 h-6 text-muted-foreground" /> : <item.icon className="w-8 h-8" />}
              </div>
              <CardTitle className="text-lg flex items-center justify-between">
                {item.title}
                {item.progress === 100 && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2">{item.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                <span>PROGRESS</span>
                <span>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-1.5" />
              {item.progress === 100 && (
                <Badge variant="outline" className="w-full justify-center border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                  Achievement Unlocked
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
