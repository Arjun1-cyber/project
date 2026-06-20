
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageCircle, 
  GraduationCap, 
  Search, 
  Plus, 
  TrendingUp,
  Globe,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";

const studyGroups = [
  { id: 1, name: "Quantum Physics Hub", members: 124, topics: ["Wave Theory", "Mechanics"], active: true },
  { id: 2, name: "CS Finals Prep", members: 340, topics: ["Algorithms", "Data Structures"], active: true },
  { id: 3, name: "Language Learners", members: 89, topics: ["Hinglish", "French"], active: false },
  { id: 4, name: "Organic Chemistry", members: 56, topics: ["Bonding", "Hydrocarbons"], active: true },
];

export default function CommunityPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            <Users className="text-primary w-10 h-10" /> Global Scholar Network
          </h1>
          <p className="text-muted-foreground">Collaborate, share notes, and compete with students worldwide.</p>
        </div>
        <Button className="gap-2 font-bold h-12 px-6">
          <Plus className="w-5 h-5" /> Create Study Hub
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search for hubs, topics, or classmates..." className="pl-10 h-12 bg-secondary/30 border-white/5" />
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" className="h-12 px-4 gap-2"><Globe className="w-4 h-4" /> Global</Button>
           <Button variant="secondary" className="h-12 px-4 gap-2"><GraduationCap className="w-4 h-4" /> My Campus</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Trending Hubs <TrendingUp className="w-5 h-5 text-accent" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id} className="glass-card hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    {group.active && <Badge className="bg-emerald-500 text-white animate-pulse">Live</Badge>}
                  </div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Users className="w-3 h-3" /> {group.members} active scholars
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {group.topics.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] uppercase">{t}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Join Hub
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Global Leaderboard</CardTitle>
              <CardDescription>Top scholars this semester</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Sarah K.", xp: "12,450", level: 45, img: "https://picsum.photos/seed/s1/100/100" },
                { name: "James R.", xp: "10,200", level: 41, img: "https://picsum.photos/seed/s2/100/100" },
                { name: "Mei Ling", xp: "9,800", level: 38, img: "https://picsum.photos/seed/s3/100/100" },
                { name: "Alex Johnson", xp: "2,450", level: 12, img: "https://picsum.photos/seed/user/100/100", isMe: true },
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${user.isMe ? 'bg-primary/10 border-primary/20' : 'bg-secondary/20 border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage src={user.img} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Level {user.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">{user.xp} XP</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs gap-2">View Full Standings <ArrowRight className="w-3 h-3" /></Button>
            </CardContent>
          </Card>

          <Card className="glass-card bg-accent/5 border-accent/20">
             <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                   <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold">Lumina Social</h3>
                <p className="text-xs text-muted-foreground">Connect with AI-matched study buddies who share your learning style and goals.</p>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">Match Me Now</Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
