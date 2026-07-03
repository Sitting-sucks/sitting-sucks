import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dumbbell, Library, ShoppingCart, Menu, X, LogOut, User,
  Calendar, TrendingUp, Settings, Users, LayoutDashboard, BookOpen, MessageCircle
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { GamificationBadge } from "./GamificationBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { useSubscription } from "@/hooks/useSubscription";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isTrainer } = useRole();
  const { subscribed, subscriptionTier } = useSubscription();
  const { unreadCount } = useUnreadCount();
  const { toast } = useToast();

  // Check if user has access to messaging (trainer or Tier 2)
  const hasMessagingAccess = isTrainer || subscriptionTier === 'coaching';

  const isActive = (path: string) => location.pathname === path;
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
    }
  };

  // Base nav items for all users (including free users)
  const baseNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/exercise-library", label: "Exercises", icon: Library },
    { path: "/exercise-diary", label: "Diary", icon: BookOpen },
  ];

  // Tier 1+ subscribers get programs and progress tracking
  const tier1NavItems = subscribed ? [
    { path: "/my-programs", label: "My Programs", icon: Calendar },
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/log-workout", label: "Log Workout", icon: Dumbbell },
  ] : [];

  // Admin nav items (only for trainers)
  const adminNavItems = isTrainer ? [
    { path: "/admin/exercises", label: "Manage Exercises", icon: Dumbbell },
    { path: "/admin/programs", label: "Program Builder", icon: Calendar },
    { path: "/admin/clients", label: "Clients", icon: Users },
  ] : [];

  const allNavItems = [...baseNavItems, ...tier1NavItems];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/e3d51457-4b9e-46e8-8a17-47f87911ecbf.png"
                alt="Sitting Sucks Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-primary">Sitting Sucks</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {allNavItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* Admin Dropdown for Trainers */}
            {isTrainer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActivePrefix("/admin") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Trainer Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {adminNavItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Messages - Tier 2 and Trainers only */}
            {hasMessagingAccess && (
              <Link to="/messages">
                <Button
                  variant={isActive("/messages") ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2 relative"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-xs flex items-center justify-center"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            <Link to="/store">
              <Button
                variant={isActive("/store") ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Store</span>
              </Button>
            </Link>

            <GamificationBadge />
            <ThemeToggle />

            {!subscribed && (
              <Link to="/pricing">
                <Button variant="outline" size="sm">
                  Subscribe
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.full_name || user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {isTrainer && <Badge variant="default">Trainer</Badge>}
                      {subscriptionTier === "coaching" && <Badge variant="secondary">Tier 2</Badge>}
                      {subscriptionTier === "basic" && <Badge variant="outline">Tier 1</Badge>}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Pricing</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {allNavItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}

              <Link to="/store" onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive("/store") ? "default" : "ghost"}
                  className="w-full justify-start flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Equipment Store</span>
                </Button>
              </Link>

              {/* Admin Section for Mobile */}
              {isTrainer && (
                <>
                  <div className="pt-2 pb-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                      Admin
                    </span>
                  </div>
                  {adminNavItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className="w-full justify-start flex items-center space-x-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </>
              )}

              {/* Messages - Tier 2 and Trainers only */}
              {hasMessagingAccess && (
                <Link to="/messages" onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive("/messages") ? "default" : "ghost"}
                    className="w-full justify-start flex items-center space-x-2 relative"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-5 min-w-5 px-1.5 text-xs"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              <div className="flex items-center justify-between pt-2">
                <ThemeToggle />
                {!subscribed && (
                  <Link to="/pricing" className="flex-1 ml-2" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Subscribe
                    </Button>
                  </Link>
                )}
              </div>

              <Link to="/settings" onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive("/settings") ? "default" : "ghost"}
                  className="w-full justify-start flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full justify-start flex items-center space-x-2 text-destructive"
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
