
import React, { useState } from "react";
import { ArrowLeft, Search, Loader2, AlertCircle, Book, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { InvokeLLM } from "@/integrations/Core";

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await InvokeLLM({
        prompt: `You are a medical first aid assistant. The user is searching for: "${query}".
        
        Provide:
        1. A brief explanation (2-3 sentences)
        2. Whether this is an emergency (true/false)
        3. 3-5 immediate action steps
        4. Related topics they might want to know about
        
        Be calm, clear, and supportive. Use simple language.`,
        response_json_schema: {
          type: "object",
          properties: {
            explanation: { type: "string" },
            is_emergency: { type: "boolean" },
            immediate_steps: { 
              type: "array", 
              items: { type: "string" } 
            },
            related_topics: { 
              type: "array", 
              items: { type: "string" } 
            }
          }
        }
      });
      
      setResults(response);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Search</h1>
        </div>

        {/* Search Input */}
        <div className="flex gap-2 mb-6">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Describe your situation or search for help..."
            className="h-14 text-lg"
            autoFocus
          />
          <Button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="h-14 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {results.is_emergency && (
              <Card className="p-4 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-[var(--emergency)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Emergency Situation Detected</h3>
                    <p className="text-sm text-red-800">Consider calling 911 for professional help</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Understanding the Situation</h3>
              <p className="text-gray-700 leading-relaxed">{results.explanation}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--primary)]" />
                Immediate Steps
              </h3>
              <ol className="space-y-3">
                {results.immediate_steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-teal-100 text-[var(--primary)] rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-green-500" />
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.related_topics.map((topic, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setQuery(topic);
                      handleSearch();
                    }}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {!results && !loading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Search for any medical situation, symptom, or first aid topic</p>
          </div>
        )}
      </div>
    </div>
  );
}
