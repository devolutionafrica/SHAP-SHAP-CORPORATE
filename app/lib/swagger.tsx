// app/lib/swagger.ts
import swaggerJsdoc from "swagger-jsdoc"; // npm install swagger-jsdoc

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ma Super API Next.js",
      version: "1.0.0",
      description: "Documentation de mon API Next.js",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // L'URL de base de votre API
        description: "Serveur de développement local",
      },
      // Ajoutez d'autres serveurs si nécessaire
    ],
  },
  // Spécifiez les fichiers où se trouvent vos annotations JSDoc pour générer la doc
  apis: ["./pages/api/*.ts", "./lib/api-definitions/*.ts"], // Adaptez les chemins à votre structure
};

export const swaggerSpec = swaggerJsdoc(options);
