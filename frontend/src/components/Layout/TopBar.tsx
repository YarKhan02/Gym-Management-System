import { Bell, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { getBackendErrorMessage } from '@/utils/apiErrors';
import { useSidebar } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const TopBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggle: toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Signed out', description: 'Your session has ended.' });
      navigate('/login', { replace: true });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: getBackendErrorMessage(error, 'Unable to logout right now.'),
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-card flex items-center justify-between px-3 sm:px-6 gap-2">
      {/* Left section with hamburger menu on mobile */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="border-2 flex-shrink-0"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="min-w-0">
          <h2 className="text-base sm:text-xl font-bold truncate">Shoukan Labs</h2>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">Manage your gym efficiently</p>
        </div>
      </div>

      {/* Right section with icons and logout */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <Button variant="outline" size="icon" className="border-2 hidden sm:flex">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="border-2 hidden sm:flex">
          <User className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-2 gap-1 sm:gap-2 text-xs sm:text-sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};
