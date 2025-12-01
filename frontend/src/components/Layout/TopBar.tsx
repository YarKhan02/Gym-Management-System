import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = () => {
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
      </div>
    </header>
  );
};
