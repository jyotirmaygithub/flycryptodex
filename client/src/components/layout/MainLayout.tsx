import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  
  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarMinimized(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // When reopening on mobile, make sure it's not minimized
    if (!sidebarOpen && isMobile) {
      setSidebarMinimized(false);
    }
  };
  
  const toggleMinimized = () => {
    setSidebarMinimized(!sidebarMinimized);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-950">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          isMinimized={sidebarMinimized}
          onClose={() => setSidebarOpen(false)} 
          onMinimize={toggleMinimized}
        />
        <main className={`flex-1 overflow-auto p-4 md:p-6 transition-all duration-200 ${sidebarMinimized ? "md:pl-[80px]" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}