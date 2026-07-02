import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Wallet, Package, GraduationCap,
  Calendar, Settings, LogOut, School,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth, schoolName } from "@/lib/auth";

import appleTreeLogo from "@/assets/apple-tree-logo.jpg";
import applePlayLogo from "@/assets/apple-play-logo.jpg";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Students", url: "/students", icon: Users },
  { title: "Tuition Fees", url: "/tuition-fees", icon: Wallet },
  { title: "Other Fees", url: "/other-fees", icon: Package },
  { title: "Academics", url: "/academics", icon: GraduationCap },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: r => r.location.pathname });
  const { signOut, user, school } = useAuth();

  const logoUrl = school === "apple_tree" ? appleTreeLogo : school === "apple_play" ? applePlayLogo : null;

  const active = (url: string) => url === "/" ? path === "/" : path.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white shadow-elegant">
            {logoUrl ? (
              <img src={logoUrl} alt="School Logo" className="h-full w-full object-contain" />
            ) : (
              <School className="h-5 w-5 text-sidebar-foreground" />
            )}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="truncate text-sm font-semibold text-sidebar-foreground">{schoolName(school)}</div>
              <div className="truncate text-xs text-sidebar-foreground/60">Pre-Primary ERP</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={active(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        {!collapsed && user?.email && (
          <div className="px-2 py-1.5 text-xs text-sidebar-foreground/60 truncate">{user.email}</div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut()} tooltip="Sign out">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
