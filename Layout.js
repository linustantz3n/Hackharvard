import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertCircle, Book, Activity, Users, Settings, User as UserIcon, LogIn, LogOut } from "lucide-react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [location.pathname]); // Re-check user on route change

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    // Optional: force a reload to ensure clean state
    window.location.href = createPageUrl("Home");
  };

  const handleLogin = () => {
    User.login();
  };
  
  const navigationItems = [
    { name: "Emergency", icon: AlertCircle, path: createPageUrl("Home"), color: "text-[var(--emergency)]" },
    { name: "First Aid", icon: Book, path: createPageUrl("FirstAidLibrary"), color: "text-[var(--primary)]" },
    { name: "Training", icon: Activity, path: createPageUrl("TrainingMode"), color: "text-[var(--primary)]" },
    { name: "Contacts", icon: Users, path: createPageUrl("EmergencyContacts"), color: "text-[var(--primary)]" },
    { name: "Settings", icon: Settings, path: createPageUrl("Settings"), color: "text-gray-500" }
  ];

  const isActive = (item) => {
    if (item.name === "Emergency") {
      return (
        location.pathname === createPageUrl("Home") ||
        location.pathname === "/" ||
        location.pathname === createPageUrl("Preparedness")
      );
    }
    return location.pathname === item.path;
  };

  const UserProfileButton = ({ isMobile = false }) => {
    if (loading) {
      return isMobile ? null : <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`w-full justify-start items-center gap-3 ${isMobile ? 'h-full text-gray-500' : 'p-2 text-left'}`}>
              <UserIcon className={`w-6 h-6 rounded-full p-0.5 ${isMobile ? (isActive({name: 'Settings'}) ? 'text-gray-500' : 'text-gray-400') : 'bg-gray-200 text-gray-600'}`} />
              {!isMobile && <span className="truncate font-semibold text-gray-700">{user.full_name || user.email}</span>}
              {isMobile && <span className={`text-xs font-medium ${isActive({name: 'Settings'}) ? 'text-gray-500' : 'text-gray-500'}`}>Profile</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobile ? "end" : "start"} className="w-56">
             <DropdownMenuItem onSelect={() => window.location.href = createPageUrl('Settings')}>
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
       <Button variant="ghost" onClick={handleLogin} className={`w-full justify-start items-center gap-3 ${isMobile ? 'h-full text-gray-500 flex-col justify-center gap-1' : 'p-2'}`}>
        <LogIn className={`w-6 h-6 ${isMobile ? 'text-gray-400' : ''}`} />
        <span className={isMobile ? 'text-xs font-medium' : 'font-semibold'}>{isMobile ? 'Login' : 'Log In / Sign Up'}</span>
      </Button>
    );
  };


  const mobileNavItems = [
    { name: "Emergency", icon: AlertCircle, path: createPageUrl("Home"), color: "text-[var(--emergency)]" },
    { name: "First Aid", icon: Book, path: createPageUrl("FirstAidLibrary"), color: "text-[var(--primary)]" },
    { name: "Training", icon: Activity, path: createPageUrl("TrainingMode"), color: "text-[var(--primary)]" },
    { name: "Contacts", icon: Users, path: createPageUrl("EmergencyContacts"), color: "text-[var(--primary)]" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap');
        
        :root {
          --primary: #208383;
          --primary-hover: #1a6b6b;
          --secondary: #4A9A9A;
          --emergency: #FF6347;
          --emergency-hover: #e65235;
          --background: #FBF7F5;
          --surface: #FFFFFF;
          --text-primary: #1F2937;
          --text-secondary: #6B7280;
        }

        .font-sans {
          font-family: 'Lexend', sans-serif;
        }

        @keyframes noisy-flare {
          0%, 100% { box-shadow: 0 0 25px 5px var(--flare-color, transparent); }
          30% { box-shadow: 0 0 40px 12px var(--flare-color, transparent); }
          60% { box-shadow: 0 0 20px 8px var(--flare-color, transparent); }
          80% { box-shadow: 0 0 35px 10px var(--flare-color, transparent); }
        }

        .animate-noisy-flare {
          animation: noisy-flare 2.5s ease-in-out infinite;
        }
      `}</style>
      
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:border-gray-200 md:bg-white/60">
        <div className="p-6 text-center">
          <Link to={createPageUrl("Home")}>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e15cdd77aa3bd840b81deb/8b6edec8c_LifeLineLogo.png" 
              alt="LifeLine Logo" 
              className="w-16 h-16 mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold text-[var(--primary)] tracking-tight">LifeLine</h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                  active 
                    ? 'bg-teal-50 text-[var(--primary)]' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? item.color : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
         <div className="p-4 border-t border-gray-200">
          <UserProfileButton />
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 pb-24 md:pb-0 overflow-auto">
        {children}
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom shadow-lg z-50 md:hidden">
        <div className="grid grid-cols-5 h-20">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  active ? 'bg-teal-50' : 'hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? item.color : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${active ? item.color : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          {/* Mobile User Profile Button */}
          <div className="flex flex-col items-center justify-center">
            <UserProfileButton isMobile={true} />
          </div>
        </div>
      </nav>
    </div>
  );
}