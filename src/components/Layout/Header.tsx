import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, Moon, Sun, Wallet, Users, LayoutDashboard, Landmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Avatar } from '../ui/avatar';
import { ProfileDialog } from '../Account/ProfileDialog';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { label: 'Tổng quan', path: '/', icon: LayoutDashboard },
    { label: 'Vay nợ', path: '/debts', icon: Landmark },
    { label: 'Danh bạ', path: '/contacts', icon: Users },
  ];

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Wallet size={24} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent hidden sm:block">
                FinWallet
              </h1>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 hover:bg-muted p-1 pr-2 rounded-lg transition-colors group"
              >
                <Avatar 
                  src={profile?.avatar_url} 
                  name={profile?.full_name || user?.email} 
                  size="sm" 
                  className="group-hover:ring-2 ring-primary/20 transition-all"
                />
                <span className="text-sm font-semibold text-foreground hidden sm:block max-w-[120px] truncate">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </span>
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </header>
  );
}
