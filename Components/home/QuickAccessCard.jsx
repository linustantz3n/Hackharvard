import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function QuickAccessCard({ title, icon: Icon, color, onClick }) {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Card
        onClick={onClick}
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-7 h-7" />
          </div>
          <span className="font-semibold text-gray-900 text-center">{title}</span>
        </div>
      </Card>
    </motion.div>
  );
}