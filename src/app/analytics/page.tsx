
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Brain, 
  Zap,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const studyData = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 6.2 },
  { day: "Wed", hours: 3.8 },
  { day: "Thu", hours: 5.5 },
  { day: "Fri", hours: 7.0 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 4.0 },
];

const subjectData = [
  { name: "Physics", value: 35, color: "hsl(var(--primary))" },
  { name: "Math", value: 25, color: "hsl(var(--accent))" },
  { name: "CS", value: 30, color: "hsl(200, 80%, 60%)" },
  { name: "Ethics", value: 10, color: "hsl(160, 60%, 50%)" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
          <BarChart3 className="text-primary w-10 h-10" /> Academic Analytics
        </h1>
        <p className="text-muted-foreground">Deep insights into your learning patterns and cognitive performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Study Time", value: "33.5h", icon: Clock, trend: "+12%", color: "text-primary" },
          { label: "Daily Avg", value: "4.8h", icon: Calendar, trend: "-2%", color: "text-accent" },
          { label: "Retention Rate", value: "88%", icon: Brain, trend: "+5%", color: "text-emerald-500" },
          { label: "Focus Score", value: "72/100", icon: Target, trend: "+8%", color: "text-yellow-500" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <stat.icon className="w-4 h-4" /> {stat.label}
              </CardDescription>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xs flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend} <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 glass-card">
          <CardHeader>
            <CardTitle>Study Hours Distribution</CardTitle>
            <CardDescription>Visualizing your focus time across the week</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={{ hours: { label: "Hours", color: "hsl(var(--primary))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle>Subject Mix</CardTitle>
            <CardDescription>Time spent per subject</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="w-full grid grid-cols-2 gap-4 mt-4">
                {subjectData.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs font-medium">{s.name} ({s.value}%)</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" /> Peak Performance Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your focus peaks between <span className="font-bold text-foreground">9:00 AM and 11:30 AM</span>. During this window, your "Deep Focus" tasks are completed 24% faster than average.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
               <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Recommendation</div>
               <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" /> Retention Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Active recall via the <span className="font-bold text-foreground">Quiz Forge</span> has improved your Exam Readiness by 15% this month compared to passive reading.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-between">
               <div className="text-xs font-bold text-accent uppercase tracking-widest">Knowledge Mastery</div>
               <Zap className="w-4 h-4 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
