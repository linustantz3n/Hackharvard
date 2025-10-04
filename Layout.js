import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, History } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isLanding = currentPageName === "Landing";

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      <style>{`
        :root {
          --primary: #0891B2;
          --primary-light: #06B6D4;
          --accent: #F87171;
          --success: #34D399;
          --text: #1F2937;
          --text-light: #6B7280;
          --bg: #FAFAFA;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      {/* Minimal Header */}
      {!isLanding && (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link to={createPageUrl("Landing")} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">LifePal</span>
            </Link>
            
            <Link 
              to={createPageUrl("History")} 
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <History className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">History</span>
            </Link>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="min-h-[calc(100vh-73px)]">
        {children}
      </main>
    </div>
  );
}