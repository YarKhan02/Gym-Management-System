import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  CalendarDays, 
  Wallet,
  AlertCircle
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Members', path: '/members', icon: Users },
  { name: 'Plans', path: '/memberships', icon: CreditCard },
  { name: 'Subscriptions', path: '/subscriptions', icon: CalendarDays },
  { name: 'Payments', path: '/payments', icon: Wallet },
  { name: 'Due Payments', path: '/due-payments', icon: AlertCircle },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-card border-r-4 border-primary">
      <div className="p-6 border-b-4 border-primary">
        <h1 className="text-2xl font-bold">GYM MANAGER</h1>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors border-2 border-transparent"
                  activeClassName="bg-primary text-primary-foreground border-primary"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
