import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";

import { findUserByUsername } from "@/app/models/user.model";
import { verifyAuthToken } from "@/app/api/lib/auth";
import extractUsernameIntoken from "../../login/route";

export async function PATCH(request: NextRequest) {
  const auth = verifyAuthToken(request);

  if (!auth) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const username = extractUsernameIntoken(request);

  if (username == null) {
    return new Response("Veuillez entrer un token valable", {
      status: 401,
    });
  }

  const { login, password, newPassword, phone, email } = await request.json();

  const user = await findUserByUsername(username!);

  if (!login || !password || !newPassword) {
    return new Response("Vérifiez les paramètres", {
      status: 404,
    });
  }

  if (user == null) {
    return new Response("Utilisateur non trouvé", {
      status: 404,
    });
  }

  if (password != user.MOT_DE_PASSE) {
    return new Response("Mot de passe incorrect", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("Login", sql.VarChar, login)

      .input("NewPassword", sql.VarChar, newPassword).query(`
         UPDATE Utilisateur
         SET MOT_DE_PASSE = @NewPassword, ISFIRSTCONNEXION=1
         WHERE LOGIN = @Login
        `);
    let idClientUnique = await pool.request().input("Login", sql.VarChar, login)
      .query(`
      select u.ide_client_unique
      from utilisateur u
      where u.login = @Login
      `);
    idClientUnique = idClientUnique.recordset[0].ide_client_unique;
    console.log("IDE client \n\n\n:", idClientUnique);
    await pool
      .request()
      .input("Email", sql.VarChar, email)
      .input("Login", sql.VarChar, login)
      .input("IDE_CU", sql.BigInt, idClientUnique)
      .input("phone", sql.VarChar, phone).query(`
        BEGIN TRY
          BEGIN TRANSACTION;

          -- Première mise à jour
          UPDATE Utilisateur
          SET EMAIL = @Email,
              Mobile = @phone
          WHERE LOGIN = @Login;

          -- Deuxième mise à jour
          UPDATE CLIENT_UNIQUE
          SET TELEPHONE = @phone
          WHERE IDE_CLIENT_UNIQUE = @IDE_CU;

          -- Si tout se passe bien, validez la transaction
          COMMIT TRANSACTION;
      END TRY
        BEGIN CATCH
            -- Si une erreur survient, annulez la transaction
            IF @@TRANCOUNT > 0
                ROLLBACK TRANSACTION;

            -- Vous pouvez loguer l'erreur ou la remonter si nécessaire
            -- Exemple pour remonter l'erreur à l'application
            DECLARE @ErrorMessage NVARCHAR(MAX), @ErrorSeverity INT, @ErrorState INT;
            SELECT @ErrorMessage = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();

            RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
        END CATCH;
      `);
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error("Erreur SQL", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
