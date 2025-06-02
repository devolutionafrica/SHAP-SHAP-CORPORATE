import { sql, poolPromise } from "../api/lib/db";

export async function findUserByUsername(username: string) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("username", sql.VarChar, username)
    .query(
      "SELECT U.*,CU.* FROM UTILISATEUR U inner join CLIENT_UNIQUE CU on(U.IDE_CLIENT_UNIQUE=CU.IDE_CLIENT_UNIQUE) WHERE LOGIN = @username"
    );

  return result.recordset[0]; // null si non trouvé
}
