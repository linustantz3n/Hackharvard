import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, AlertCircle, BookOpen, Dumbbell, Shield, Settings, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvokeLLM } from "@/integrations/Core";
import { useNavigate } from "react-router-dom";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const navItems = [
    { name: "Home", path: "Landing", icon: Home },
    { name: "Emergency", path: "Landing", icon: AlertCircle },
    { name: "Library", path: "Library", icon: BookOpen },
    { name: "Training", path: "Training", icon: Dumbbell },
    { name: "Prepare", path: "Preparedness", icon: Shield },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const result = await InvokeLLM({
        prompt: `You are a medical first aid expert. The user is searching for: "${searchQuery}"
        
Provide a helpful response that includes:
1. A brief, clear answer to their query
2. Recommended actions or first aid steps if applicable
3. When to seek professional medical help
4. Related topics they might want to explore

Keep your response concise, reassuring, and actionable.`,
        add_context_from_internet: true
      });
      
      setSearchResults(result);
    } catch (error) {
      console.error("Search error:", error);
    }
    setSearching(false);
  };

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

        .nav-item-active {
          color: #0891B2;
          font-weight: 600;
        }
      `}</style>

      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Landing")} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LifeLine</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="rounded-full"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </Button>
              <Link to={createPageUrl("Settings")}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path.toLowerCase()) || 
                             (item.path === "Landing" && location.pathname === "/");
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    isActive ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                  <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Medical Guidance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for symptoms, first aid, emergencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={searching}
                className="bg-gradient-to-r from-cyan-500 to-teal-500"
              >
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResults && (
              <div className="bg-cyan-50 rounded-xl p-6 space-y-3">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-800 whitespace-pre-line">{searchResults}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}