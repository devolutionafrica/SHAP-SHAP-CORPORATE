// components/Field.tsx (ou le chemin approprié dans votre projet)
"use client"; // Indique que ce composant est un Client Component

import React from "react";
import { motion } from "framer-motion"; // Pour les animations de l'icône et du champ

// Définition du composant Field
export const Field = ({
  label,
  value,
  Icon, // Prop pour l'icône, qui sera un composant React (ex: de lucide-react)
}: {
  label: string;
  value: any;
  Icon: React.ElementType;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="text-primary-600 flex-shrink-0" // Couleur primaire pour l'icône
    >
      <Icon size={20} />{" "}
    </motion.div>
    <div>
      {/* Label du champ */}
      <div className="text-gray-500 text-xs font-medium uppercase leading-none">
        {label}
      </div>
      <div className="font-semibold text-gray-900 text-sm break-words">
        {value ?? "-"}
      </div>
    </div>
  </motion.div>
);
