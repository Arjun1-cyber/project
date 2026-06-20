
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Sparkles,
  Volume2,
  Trash2,
  LogOut,
  Save
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
          <Settings className="text-muted-foreground w-10 h-10" /> Preferences
        </h1>
        <p className="text-muted-foreground">Manage your account settings, AI personalization, and notifications.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="Alex Johnson" className="bg-secondary/30 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label>Academic Major</Label>
                <Input defaultValue="Computer Science" className="bg-secondary/30 border-white/5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input defaultValue="alex.johnson@university.edu" disabled className="bg-secondary/30 border-white/5 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> AI Tutor Customization
            </CardTitle>
            <CardDescription>How Lumina interacts with you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Default Tutor Language</p>
                <p className="text-xs text-muted-foreground">Primary language for explanations</p>
              </div>
              <Select defaultValue="mixed">
                <SelectTrigger className="w-[180px] bg-secondary/30 border-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mixed">Hinglish (Mixed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="bg-white/5" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                   <Volume2 className="w-4 h-4" /> Voice Mode Response
                </p>
                <p className="text-xs text-muted-foreground">Automatically speak AI responses</p>
              </div>
              <Switch />
            </div>

            <Separator className="bg-white/5" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Auto-Rebalance Mode</p>
                <p className="text-xs text-muted-foreground">AI adjusts schedule when sessions are missed</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {[
               { label: "Exam Reminders", desc: "Alerts for upcoming scheduled exams", enabled: true },
               { label: "Streak Alerts", desc: "Notifications to maintain your study streak", enabled: true },
               { label: "Community Activity", desc: "Replies and activity in your study hubs", enabled: false },
             ].map((n, i) => (
               <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.enabled} />
               </div>
             ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <Shield className="w-5 h-5" /> Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Public Profile</p>
                <p className="text-xs text-muted-foreground">Allow others to see your level and achievements</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-4 pt-4">
               <Button variant="outline" className="flex-1 gap-2 text-red-500 border-red-500/20 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Clear Study History
               </Button>
               <Button variant="outline" className="flex-1 gap-2">
                  <LogOut className="w-4 h-4" /> Log Out
               </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
           <Button className="gap-2 px-8 font-bold h-12 shadow-lg shadow-primary/20">
              <Save className="w-5 h-5" /> Save All Preferences
           </Button>
        </div>
      </div>
    </div>
  );
}
