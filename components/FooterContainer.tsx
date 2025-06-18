"use client"; // Indique que ce composant est exécuté côté client

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import logo from "@/public/nsiavie.png";
import Image from "next/image";
export default function AnimatedFooter() {
  const currentYear = new Date().getFullYear();
  const companyPhoneNumber = "+225 01 02 03 04 05";
  const companyEmail = "contact@nsia-assurance.com";
  const nsiaLogoPath = "/images/nsia-logo.svg";

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0, // Position finale (visible, à sa place)
      transition: {
        duration: 0.6, // Durée de l'animation du conteneur principal
        ease: "easeOut", // Effet d'accélération/décélération
        when: "beforeChildren", // Anime le parent avant les enfants
        staggerChildren: 0.2, // Délai entre l'animation de chaque enfant
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Position et opacité initiales des éléments enfants
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, // Position et opacité finales des éléments enfants
  };

  return (
    <motion.footer
      className="bg-[#223268] text-white py-12 px-6 sm:px-10 lg:px-20 mt-12 relative bottom-0"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        <motion.div variants={itemVariants} className="flex-shrink-0">
          <Image
            src={logo}
            alt="NSIA Assurance Logo"
            className="h-14 w-auto object-contain"
            width={300}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 text-center md:text-left"
        >
          {/* Numéro de téléphone */}
          <a
            href={`tel:${companyPhoneNumber.replace(/\s/g, "")}`} // Supprime les espaces pour le lien tel:
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-300 transform hover:scale-105"
            aria-label={`Appeler NSIA Assurance au ${companyPhoneNumber}`}
          >
            <Phone size={20} className="text-teal-300" />{" "}
            {/* Icône téléphone */}
            <span className="font-semibold text-lg">{companyPhoneNumber}</span>
          </a>
          {/* Adresse e-mail */}
          <a
            href={`mailto:${companyEmail}`}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-300 transform hover:scale-105"
            aria-label={`Envoyer un e-mail à ${companyEmail}`}
          >
            <Mail size={20} className="text-teal-300" /> {/* Icône e-mail */}
            <span className="font-semibold text-lg">{companyEmail}</span>
          </a>
        </motion.div>

        {/* Section Copyright */}
        <motion.div
          variants={itemVariants}
          className="text-sm text-gray-300 text-center md:text-right"
        >
          &copy; {currentYear} NSIA Assurance. Tous droits réservés.
        </motion.div>
      </div>
    </motion.footer>
  );
}
