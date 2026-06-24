import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SidebarProvider } from '@/contexts/SidebarContext';

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-background">
        {/* full-width top border to align with sidebar vertical border */}
        <div className="absolute left-0 right-0 top-14 sm:top-16 border-b-4 border-primary z-10" />
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
