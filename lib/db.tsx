import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  server: process.env.DB_SERVER!,
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
  },
};

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool: unknown) => {
    console.log("✅ Connecté à SQL Server");
    return pool;
  })
  .catch((err: unknown) => {
    console.error("Erreur connexion SQL Server", err);
    throw err;
  });

export { sql };
