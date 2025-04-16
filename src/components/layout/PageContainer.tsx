
import React from "react";
import AppHeader from "./AppHeader";
import BottomNavigation from "./BottomNavigation";

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  showHeader?: boolean;
  showNotification?: boolean;
  className?: string;
}

const PageContainer = ({
  children,
  title,
  showBackButton = false,
  showBottomNav = true,
  showHeader = true,
  showNotification = true,
  className = "",
}: PageContainerProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {showHeader && (
        <AppHeader 
          title={title} 
          showBackButton={showBackButton}
          showNotification={showNotification}
        />
      )}
      
      <main className={`flex-1 px-4 py-6 pb-20 ${className}`}>
        {children}
      </main>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default PageContainer;
