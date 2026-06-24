import { NavLink } from '@/components/NavLink';
import { useSidebar } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
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
  const { isOpen, close } = useSidebar();
  const isMobile = useIsMobile();

  // On mobile: sidebar appears as overlay when isOpen
  // On desktop: sidebar is always visible
  const shouldShow = !isMobile || isOpen;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? `fixed left-0 top-0 h-screen w-64 z-40 transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative w-64'
        } min-h-screen bg-card border-r-4 border-primary`}
      >
        {/* Header */}
        <div className="p-6 border-b-4 border-primary flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Gym Manager</h1>
          {isMobile && (
            <button
              onClick={close}
              className="p-1 hover:bg-accent rounded transition-colors md:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={close}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors border-2 border-transparent text-sm sm:text-base"
                    activeClassName="bg-primary text-primary-foreground border-primary"
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
