// components/AnimatedImageLoader.tsx (ou AnimatedImageLoaderWithCircle.tsx)
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedImageLoaderProps {
  src: string;
  alt: string; // Texte alternatif pour l'accessibilité
  size?: number; // Taille (largeur et hauteur) totale du loader en pixels
  imageSizeRatio?: number; // Ratio de la taille de l'image par rapport à la taille totale (ex: 0.7 pour 70%)
  animationDuration?: number; // Durée de l'animation de rotation globale en secondes
  rotationDirection?: "clockwise" | "counter-clockwise"; // Direction de la rotation globale
  circleColor?: string; // Couleur de la barre circulaire
  circleStrokeWidth?: number; // Épaisseur de la barre circulaire
  circleAnimationDuration?: number; // Durée de l'animation du cercle lui-même (pour le dash)
  label?: string;
}

const AnimatedImageLoader: React.FC<AnimatedImageLoaderProps> = ({
  src,
  alt,
  size = 80, // Taille par défaut du loader complet (image + cercle)
  imageSizeRatio = 0.6, // L'image prendra 60% de la taille totale
  animationDuration = 2,
  rotationDirection = "clockwise",
  circleColor = "#223268", // Couleur par défaut de la barre circulaire
  circleStrokeWidth = 4, // Épaisseur par défaut de la barre
  circleAnimationDuration = 1.5,
  label = "Chargement en cours...",
}) => {
  const imageSize = size * imageSizeRatio;
  const rotateValue = rotationDirection === "clockwise" ? 360 : -360;

  // Variants pour l'animation du trait du cercle (comme un spinner classique)
  const circleDashVariants = {
    initial: { strokeDasharray: "1, 150", strokeDashoffset: 0 },
    animate: {
      strokeDasharray: ["1, 150", "90, 150", "90, 150"],
      strokeDashoffset: [0, -35, -124],
    },
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative", // Pour positionner le cercle et l'image
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-live="polite"
      aria-label={`Chargement en cours : ${alt}`}
      role="status"
    >
      {/* Cercle SVG animé en arrière-plan */}
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        // Rotation globale du loader
        animate={{ rotate: rotateValue }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: animationDuration,
        }}
      >
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - circleStrokeWidth) / 2 - 2} // Rayon du cercle, ajusté pour l'épaisseur du trait et un petit padding
          fill="none"
          stroke={circleColor}
          strokeWidth={circleStrokeWidth}
          strokeLinecap="round" // Bouts arrondis pour le trait
          // Animation du trait du cercle
          variants={circleDashVariants}
          initial="initial"
          animate="animate"
          transition={{
            repeat: Infinity,
            ease: "easeInOut", // Transition plus douce pour le dash
            duration: circleAnimationDuration,
          }}
        />
      </motion.svg>

      {/* Image animée au centre */}
      <motion.div
        style={{
          position: "relative", // Permet d'aligner l'Image de Next.js
          width: imageSize,
          height: imageSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%", // Optionnel: pour rendre l'image circulaire
          overflow: "hidden", // Cache ce qui dépasse si borderRadius est appliqué
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={imageSize}
          height={imageSize}
          style={{ objectFit: "contain" }}
        />
        {/* <span className="">{label}</span> */}
      </motion.div>
    </div>
  );
};

export default AnimatedImageLoader;
