import React, { useState } from 'react';
import StageBackground from '../theme/StageBackground';
import GrainFilter from '../theme/GrainFilter';
import EntranceAnimator from '../theme/EntranceAnimator';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="stage relative min-h-screen w-full flex flex-col">
      <StageBackground />
      <GrainFilter />
      <EntranceAnimator />
      
      <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      
      <div className="flex flex-1 w-full relative z-10 min-h-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 w-full min-w-0 flex flex-col overflow-y-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
