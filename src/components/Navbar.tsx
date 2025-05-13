import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/TranslationProvider';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { Sun, Moon, LogOut, User, LayoutDashboard, History, Settings } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/pages/ThemeProvider';
import { toast } from 'sonner';
import { useAuth } from '@/lib/sso/AuthContext';
import { ROUTES } from '@/utils/constants';

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('nav.logout_success'));
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(t('nav.logout_error'));
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.info(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} ${t('theme.activated')}`);
  };

  const navigateToProfile = () => {
    navigate(ROUTES.PROFILE);
  };
  
  return (
    <nav className="border-b border-border/40 bg-primary text-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-3">
        <div className="flex items-center space-x-4">
          <Link to={ROUTES.DASHBOARD} className="text-lg font-semibold text-white flex items-center">
            <span className="text-accent font-bold mr-1">Espa</span>
            <span>Bila</span>
          </Link>
          
          {isAuthenticated && (
            <div className="hidden md:flex space-x-6 ml-10">
              <Link to={ROUTES.TESTS_HISTORY} className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <History size={16} />
                {t('nav.tests')}
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 bg-primary/90 text-white border-white/30 hover:bg-primary/70 hover:border-white/50 dark:bg-primary/90 dark:border-white/40 dark:hover:bg-primary/70 dark:hover:border-white/60 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-border w-56 bg-background text-foreground dark:bg-gray-900 dark:text-white/90">
                <DropdownMenuLabel className="dark:text-white/90 flex items-center gap-2">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground dark:text-gray-400">{user.email}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem onClick={navigateToProfile} className="flex gap-2 cursor-pointer hover:text-accent dark:text-white/90 dark:hover:text-accent">
                  <User size={16} className="dark:text-gray-400" />
                  {t('profile.title')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme} className="flex gap-2 cursor-pointer hover:bg-accent/20 hover:text-foreground dark:text-white/90 dark:hover:text-accent">
                  {theme === 'dark' ? 
                    <Sun size={16} className="text-yellow-400" /> : 
                    <Moon size={16} className="text-primary" />
                  }
                  {t(theme === 'dark' ? 'theme.light' : 'theme.dark')}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem onClick={handleLogout} className="flex gap-2 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive dark:text-red-400 dark:hover:text-red-300">
                  <LogOut size={16} />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
} 