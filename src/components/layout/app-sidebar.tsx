
"use client";

import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  GraduationCap, 
  FileText, 
  BarChart3, 
  Settings, 
  Sparkles,
  Trophy,
  Library,
  Zap,
  Code
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Syllabus Engine", icon: Sparkles, path: "/syllabus" },
  { name: "Semester Planner", icon: Calendar, path: "/planner" },
  { name: "AI Tutor", icon: MessageSquare, path: "/tutor" },
  { name: "Knowledge Vault", icon: Library, path: "/vault" },
  { name: "Adaptive Quizzes", icon: Zap, path: "/quiz" },
  { name: "Coding Helper", icon: Code, path: "/coding" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
];

const secondaryItems = [
  { name: "Achievements", icon: Trophy, path: "/achievements" },
  { name: "Community", icon: GraduationCap, path: "/community" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar">
      <SidebarHeader className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tight text-foreground">LUMINA</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Hub</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={pathname === item.path}>
                    <Link href={item.path} className="flex items-center gap-3 px-3 py-2 rounded-md transition-all">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support & Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={pathname === item.path}>
                    <Link href={item.path} className="flex items-center gap-3 px-3 py-2 rounded-md transition-all">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/50 border border-white/5">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate text-foreground">Alex Johnson</span>
            <span className="text-xs text-muted-foreground truncate">Level 12 Scholar</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
