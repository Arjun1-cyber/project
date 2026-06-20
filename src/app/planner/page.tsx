"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ListFilter,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  CalendarDays,
  Loader2
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { generateStudyPlan, GenerateStudyPlanOutput } from "@/ai/flows/personalized-semester-planner-flow";
import { useToast } from "@/hooks/use-toast";

export default function PlannerPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [smartPlan, setSmartPlan] = useState<GenerateStudyPlanOutput | null>(null);
  const { toast } = useToast();

  const handleSmartRebalance = async () => {
    setIsRebalancing(true);
    try {
      // For MVP, we pass current static context to the AI
      const result = await generateStudyPlan({
        syllabusTimeline: [
          { subject: "Data Structures", unit: "Unit 1", chapter: "Linked Lists", estimatedStudyHours: 4 },
          { subject: "AI Ethics", unit: "Unit 2", chapter: "Safety", estimatedStudyHours: 6 }
        ],
        examDates: [
          { subject: "Data Structures", date: "2024-11-15", type: "Midterm" }
        ],
        collegeTimetable: [
          { day: "Monday", subject: "Maths 101", startTime: "09:00", endTime: "10:00" }
        ],
        userAvailability: [
          { day: "Monday", startTime: "14:00", endTime: "20:00" },
          { day: "Tuesday", startTime: "14:00", endTime: "20:00" },
          { day: "Wednesday", startTime: "14:00", endTime: "20:00" },
          { day: "Thursday", startTime: "14:00", endTime: "20:00" },
          { day: "Friday", startTime: "14:00", endTime: "20:00" }
        ],
        difficultyLevel: "medium"
      });
      setSmartPlan(result);
      toast({
        title: "Schedule Rebalanced",
        description: "Lumina has optimized your study blocks for the week.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Rebalance Failed",
        description: "Could not optimize your schedule at this time.",
      });
    } finally {
      setIsRebalancing(false);
    }
  };

  const schedule = smartPlan?.studyPlan.filter(block => block.date === date?.toISOString().split('T')[0]) || [
    { time: "09:00 AM", subject: "Maths 101", duration: "60m", type: "Lecture", color: "bg-blue-500" },
    { time: "11:30 AM", subject: "AI Ethics", duration: "90m", type: "Study Block", color: "bg-primary" },
    { time: "02:00 PM", subject: "Lab Session", duration: "120m", type: "Practical", color: "bg-emerald-500" },
    { time: "05:00 PM", subject: "Revision", duration: "45m", type: "Revision", color: "bg-accent" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Semester Planner</h1>
          <p className="text-muted-foreground">Manage your study blocks, lectures, and exams in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 font-bold">
            <AlertCircle className="w-4 h-4" /> Missed Session?
          </Button>
          <Button 
            className="gap-2 font-bold bg-primary hover:bg-primary/90"
            onClick={handleSmartRebalance}
            disabled={isRebalancing}
          >
            {isRebalancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Smart Rebalance
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl border-none"
            />
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { subject: "Data Structures", days: 4, type: "Midterm" },
                { subject: "Computer Networks", days: 12, type: "Final" }
              ].map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
                  <div>
                    <p className="text-sm font-bold">{exam.subject}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{exam.type}</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-primary border-primary/20">In {exam.days}d</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {smartPlan?.rebalanceNotes && (
            <Card className="glass-card border-accent/20">
              <CardHeader className="bg-accent/5">
                <CardTitle className="text-sm flex items-center gap-2 text-accent">
                  <Sparkles className="w-4 h-4" /> AI Planner Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-xs text-muted-foreground leading-relaxed">
                {smartPlan.rebalanceNotes}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Optimal Day</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="space-y-4">
            {schedule.map((item: any, i) => (
              <div key={i} className="group relative flex items-start gap-6 p-6 rounded-2xl bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-all cursor-pointer">
                <div className="flex flex-col items-center gap-2 pt-1">
                  <span className="text-sm font-bold text-foreground w-20">{(item as any).startTime || item.time}</span>
                  <span className="text-[10px] text-muted-foreground">{(item as any).durationMinutes ? `${(item as any).durationMinutes}m` : item.duration}</span>
                </div>
                
                <div className={`w-1.5 h-16 rounded-full ${item.color || 'bg-primary'} shadow-lg shadow-white/5 group-hover:scale-y-110 transition-transform`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold truncate">{item.subject}</h3>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">{item.type || 'Study Block'}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(item as any).topic || 'Standard Lecture Session'}
                  </p>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button className="w-full h-16 border-2 border-dashed border-border/50 bg-transparent text-muted-foreground hover:bg-white/5 hover:border-primary/50 transition-all rounded-2xl gap-2 font-bold">
            <Plus className="w-5 h-5" /> Add New Event or Study Block
          </Button>
        </div>
      </div>
    </div>
  );
}