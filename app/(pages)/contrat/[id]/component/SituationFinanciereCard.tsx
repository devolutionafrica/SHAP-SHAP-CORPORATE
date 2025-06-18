import { SituationFinanciere } from "@/app/Types/type";
import { motion } from "framer-motion";
import {
  Clock,
  FileText,
  MonitorSmartphoneIcon,
  Repeat,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Field } from "./Field";

export default function SituationFinanciereCard({
  situation,
}: {
  situation: SituationFinanciere;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} // Animation pour la carte entière
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6 border-2 border-primary-500" // Bordure colorée
    >
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <motion.div
          initial={{ rotate: -90, opacity: 0 }} // Animation du titre de la carte
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
          className="text-primary-700"
        >
          <ShieldCheck size={28} />
        </motion.div>
        <h2 className="text-2xl font-bold text-primary-800">
          Situation Financière de la Police
        </h2>
      </div>

      {situation ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Police" value={situation.NumeroPolice} Icon={Tag} />
          <Field
            label="Valeur de rachat"
            value={situation.ValeurDeRachat}
            Icon={FileText}
          />
          <Field
            label="Montant Maximum Valeur rachat partiel"
            value={situation.MontantMaximumValeurRachatPartiel}
            Icon={Clock}
          />
          <Field
            label="Montant Rente Périodique"
            value={situation.MontantRentePeriodiqueTheorique}
            Icon={Repeat}
          />
          <Field
            label="Capitaux au terme"
            value={situation.CapitalAuTerme}
            Icon={MonitorSmartphoneIcon}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-gray-500 py-8"
        >
          <p>Aucune information de police disponible.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
