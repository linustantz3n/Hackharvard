import React from 'react';
import { User, HeartPulse, AlertTriangle, Phone } from 'lucide-react';
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

const CRITICAL_KEYWORDS = /\b(critical|immediately|important|warning|must|do not|don't)\b/i;

export default function MessageBubble({ message }) {
    if (message.role === 'system') {
        return (
            <div className="flex justify-center my-2">
                <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2">
                    <Phone className="w-3 h-3"/>
                    {message.content}
                </div>
            </div>
        );
    }
    
    const isUser = message.role === 'user';
    const isCritical = !isUser && CRITICAL_KEYWORDS.test(message.content);

    return (
        <div className={cn("flex items-start gap-3 w-full", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className={cn(
                    "w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0",
                    isCritical ? "bg-red-500" : "bg-[var(--primary)]"
                )}>
                    {isCritical ? <AlertTriangle className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
                </div>
            )}
            <div className={cn(
                "max-w-[85%] rounded-2xl",
                isUser ? "bg-blue-500 text-white" : "bg-white border",
                isCritical && "bg-red-50 border-red-200"
            )}>
                <div className="px-4 py-3">
                    {message.content && (
                        <ReactMarkdown 
                            className={cn(
                                "prose prose-sm max-w-none [&>p]:my-0",
                                isCritical ? "prose-red" : "prose-slate"
                            )}
                            components={{ a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
                
                {message.asset_url && (
                    <div className="mt-1 p-2 border-t">
                        <img 
                            src={message.asset_url} 
                            alt="Visual aid for first aid instruction"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                )}
            </div>
             {isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                </div>
            )}
        </div>
    );
}