import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";

import { findUserByUsername } from "@/app/models/user.model";
import checkTokenValidity, { verifyAuthToken } from "@/app/api/lib/auth";

export async function PATCH(request: NextRequest) {
  const { login, password, confirm, newPassword } = await request.json();

  console.log("Received data:", { login, password, confirm, newPassword });

  const verify = verifyAuthToken(request);
  if (verify == null) {
    return NextResponse.json(
      { error: "Token invalide ou expiré" },
      { status: 401 }
    );
  }

  if (!login || !newPassword || !confirm || !password) {
    return NextResponse.json(
      { error: "Tous les champs sont requis" },
      { status: 400 }
    );
  }
  if (newPassword !== confirm) {
    return NextResponse.json(
      { error: "Les mots de passe ne correspondent pas" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Login", sql.VarChar, login)
      .input("Password", sql.VarChar, password)
      .input("NewPassword", sql.VarChar, newPassword).query(`
         UPDATE Utilisateur
         SET MOT_DE_PASSE = @newPassword
         
         WHERE LOGIN = @Login And MOT_DE_PASSE = @Password
        `);
    console.log("Update result:", result);
    if (result.rowsAffected[0] == 0) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec ces identifiants" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Mot de passe modifié avec succès" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur de modification du mot de passe :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
