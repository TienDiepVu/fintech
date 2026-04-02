import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, Moon, Sun, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Wallet size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent hidden sm:block">
              FinWallet
            </h1>
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
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {user?.email}
              </span>
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
    </header>
  );
}
