import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { getBackendErrorMessage } from '@/utils/apiErrors';

export const TopBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    <header className="h-16 border-b-4 border-primary bg-card flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-bold">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">Manage your gym efficiently</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="border-2">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="border-2">
          <User className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm" className="border-2 gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};
