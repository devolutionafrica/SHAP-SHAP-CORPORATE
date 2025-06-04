// components/TableSkeleton.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "../components/ui/table2"; // Assurez-vous que le chemin est correct et que 'TableColumn' est exporté par votre composant Table

interface TableSkeletonProps {
  rows?: number; // Nombre de lignes squelette à afficher, par défaut 5
  columns?: number; // Nombre de colonnes squelette à afficher, par défaut 8
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 8,
}) => {
  // Définissez les colonnes squelette de manière générique
  const skeletonColumns = Array.from({ length: columns }).map((_, i) => ({
    key: `col-${i}`,
    label: `Header ${i + 1}`, // Le label n'est pas affiché, mais utile pour la structure
  }));

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-lg">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            {skeletonColumns.map((col, idx) => (
              <TableColumn key={col.key} className="px-4 py-3">
                {/* Une barre grise pour l'en-tête, animée pour le chargement */}
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
              </TableColumn>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b last:border-b-0">
              {skeletonColumns.map((col, colIndex) => (
                <TableCell
                  key={`${rowIndex}-${colIndex}`}
                  className="px-4 py-3"
                >
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: rowIndex * 0.1 + colIndex * 0.05, // Effet d'onde de chargement
                    }}
                    className="h-4 bg-gray-200 rounded"
                    style={{ width: `${Math.random() * 60 + 40}%` }} // Largeur aléatoire pour un effet plus naturel
                  ></motion.div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
