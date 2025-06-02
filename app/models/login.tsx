import { sql, poolPromise } from "../lib/db";

export function findUserByEmail(email: string) {
  return poolPromise.then((pool) =>
    pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM users WHERE email = @email")
  );
}
