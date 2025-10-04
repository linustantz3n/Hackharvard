import React from "react";
import { motion } from "framer-motion";
import { Heart, AlertCircle, Activity, Droplet, Flame, Shield } from "lucide-react";

const emergencyIcons = {
  medical: Heart,
  injury: Droplet,
  fire: Flame,
  safety: Shield,
  cardiac: Activity,
  default: AlertCircle
};

export default function EmergencyAnimation({ emergencyType, severity }) {
  const Icon = emergencyIcons[emergencyType?.toLowerCase()] || emergencyIcons.default;
  
  const severityColors = {
    low: "from-blue-400 to-blue-500",
    medium: "from-yellow-400 to-orange-500",
    high: "from-orange-500 to-red-500",
    critical: "from-red-600 to-red-700"
  };

  const colorClass = severityColors[severity] || severityColors.medium;

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      {/* Pulsing Background Circles */}
      <motion.div
        
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        
        className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${colorClass} blur-2xl`}
      />
      
      <motion.div
        
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        
        className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${colorClass} blur-xl`}
      />

      {/* Center Icon */}
      <motion.div
        
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        
        className="relative z-10"
      >
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-2xl`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      {/* Orbiting Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "linear"
          }}
          
          className="absolute w-full h-full"
        >
          <div className={`absolute top-0 left-1/2 w-2 h-2 rounded-full bg-gradient-to-br ${colorClass}`} />
        </motion.div>
      ))}
    </div>
  );
}