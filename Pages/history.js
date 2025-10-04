import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { EmergencySession } from "@/entities/EmergencySession";
import { motion } from "framer-motion";
import { Clock, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await EmergencySession.list("-created_date");
    setSessions(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency History</h1>
          <p className="text-gray-600">Review your past emergency sessions</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            
          >
            <Card className="text-center py-12 border-dashed">
              <CardContent>
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No emergency sessions yet</p>
                <p className="text-sm text-gray-400 mt-2">Your emergency history will appear here</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                
              >
                <Link to={createPageUrl("Summary") + `?sessionId=${session.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 border-none cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="capitalize bg-cyan-100 text-cyan-700 hover:bg-cyan-200">
                              {session.emergency_type}
                            </Badge>
                            <Badge className={`capitalize ${
                              session.severity === 'critical' ? 'bg-red-100 text-red-700' :
                              session.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                              session.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {session.severity}
                            </Badge>
                            {session.status === 'resolved' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-3 line-clamp-2">
                            "{session.transcript}"
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(session.created_date), 'MMM d, yyyy • h:mm a')}
                            </span>
                            <span>
                              {session.guidance_steps?.filter(s => s.completed).length || 0} / {session.guidance_steps?.length || 0} steps
                            </span>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}