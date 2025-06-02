// lib/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Next.js",
      version: "1.0.0",
      description: "Documentation API avec Swagger",
    },
  },
  apis: ["./api/**/*.ts"],
});
