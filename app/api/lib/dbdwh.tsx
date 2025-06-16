import sql from "mssql";

const altDbConfig: sql.config = {
  user: process.env.ALT_DB_USER!,
  password: process.env.ALT_DB_PASSWORD!,
  server: process.env.ALT_DB_SERVER!,
  database: process.env.ALT_DB_NAME!,
  port: parseInt(process.env.ALT_DB_PORT || "1433"),

  options: {
    encrypt: process.env.AL === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
  },
  requestTimeout: 0,
};

export const poolPromiseDHW = new sql.ConnectionPool(altDbConfig)
  .connect()
  .then((pool) => {
    console.log(
      `Connecté à SQL Server "${altDbConfig.server}" (DB: "${altDbConfig.database}")`
    );
    return pool;
  })
  .catch((err) => {
    console.error("Erreur connexion SQL Server", err);
    throw err;
  });

export { sql };
